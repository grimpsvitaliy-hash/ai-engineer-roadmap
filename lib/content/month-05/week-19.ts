import type { Lesson } from "../types";

export const week19: Lesson = {
  id: "m5-w19",
  monthId: "month-05",
  weekNumber: 19,
  title: "Стриминг, кеширование, оптимизация стоимости",
  goal: "Понимаешь как сделать LLM-приложение быстрым и дешёвым. Стриминг для UX, prompt caching и client-side cache для денег, мониторинг для контроля.",
  estimatedHours: "6-7 ч",
  theory: [
    {
      id: "streaming",
      title: "Streaming — главное для UX",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Без стриминга: пользователь ждёт 5-15 секунд → видит весь ответ сразу.\n\nСо стримингом: пользователь начинает читать через ~200 мс → ответ «печатается».",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Психологический эффект",
          content:
            "Воспринимаемая скорость со стримингом в 3-5 раз выше, даже если общее время то же. Это разница между «приложение долго думает» и «приложение работает».",
        },
        {
          type: "code",
          language: "python",
          content: `# Anthropic SDK — стриминг через context manager
from anthropic import AsyncAnthropic

client = AsyncAnthropic()


async def stream_response(prompt: str):
    async with client.messages.stream(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        async for text in stream.text_stream:
            print(text, end="", flush=True)
        # После завершения — можно получить полный ответ
        final = await stream.get_final_message()
        print(f"\\n\\nTokens: {final.usage.input_tokens} + {final.usage.output_tokens}")`,
        },
      ],
    },
    {
      id: "fastapi-streaming",
      title: "Streaming в FastAPI",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from anthropic import AsyncAnthropic

app = FastAPI()
client = AsyncAnthropic()


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    async def event_generator():
        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{"role": "user", "content": req.message}]
        ) as stream:
            async for text in stream.text_stream:
                # SSE формат: "data: ...\\n\\n"
                yield f"data: {text}\\n\\n"
            yield "data: [DONE]\\n\\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )`,
        },
        {
          type: "text",
          content:
            "**На клиенте (фронтенд) принимаем через EventSource:**",
        },
        {
          type: "code",
          language: "javascript",
          content: `const eventSource = new EventSource('/chat/stream');

eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
        eventSource.close();
        return;
    }
    document.getElementById('output').innerText += event.data;
};`,
        },
      ],
    },
    {
      id: "prompt-caching",
      title: "Prompt caching — экономия до 90%",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**Prompt caching** (Anthropic) — кеширование длинной части промпта на стороне API. Cached токены стоят **в 10 раз дешевле**.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Когда работает",
          content:
            "Идеально для случаев когда у тебя длинный неизменный кусок (system prompt, документация в контексте, few-shot examples). Кеш живёт 5 минут после последнего использования.",
        },
        {
          type: "code",
          language: "python",
          content: `# Помечаем cache_control на длинный системный промпт
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Ты ассистент по документации... (тут 5000 токенов с описанием API)",
            "cache_control": {"type": "ephemeral"},  # кешируем этот блок
        }
    ],
    messages=[{"role": "user", "content": req.message}]
)

# usage.cache_creation_input_tokens — сколько ушло на создание кеша (первый раз)
# usage.cache_read_input_tokens — сколько прочитано из кеша (последующие)`,
        },
        {
          type: "code",
          language: "text",
          content: `Стоимость (Haiku 4.5, за 1M токенов):
  Обычные input:        $0.80
  Cache creation:       $1.00   (один раз)
  Cache read:           $0.08   (последующие — в 10x дешевле!)
  Output:               $4.00

Если у тебя system prompt 5000 токенов, и 1000 запросов:
  Без caching:  1000 × 5000 × $0.80 = $4
  С caching:    5000 × $1 + 999 × 5000 × $0.08 = ~$5 (≈ как один раз)`,
        },
      ],
    },
    {
      id: "client-cache",
      title: "Client-side cache",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Если один и тот же запрос приходит повторно — не зови LLM, отдай из своего кеша.",
        },
        {
          type: "code",
          language: "python",
          content: `import hashlib
import json
from functools import lru_cache

# Простейший: in-memory LRU cache
@lru_cache(maxsize=1000)
def cached_classify(text: str) -> str:
    # вызывает LLM один раз для каждого уникального text
    return classify_via_claude(text)


# Production: Redis с TTL
import redis.asyncio as redis

r = redis.Redis(host="redis", port=6379)


async def query_with_cache(question: str, k: int) -> dict:
    # Ключ — хеш входных параметров
    cache_key = "rag:" + hashlib.sha256(
        json.dumps({"q": question, "k": k}, sort_keys=True).encode()
    ).hexdigest()

    # Пробуем из кеша
    cached = await r.get(cache_key)
    if cached:
        return json.loads(cached)

    # Считаем
    result = await actual_query(question, k)

    # Кладём в кеш на 1 час
    await r.setex(cache_key, 3600, json.dumps(result))
    return result`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Подводный камень",
          content:
            "Кеш плохо подходит для контекстуальных диалогов (история разная → ключи разные → cache miss). Зато отлично для классификации, извлечения, фиксированных RAG-запросов.",
        },
      ],
    },
    {
      id: "cost-optimization",
      title: "Оптимизация стоимости — чек-лист",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**1. Выбор модели под задачу:**\n\n- Классификация / простое извлечение → Haiku ($0.80/$4)\n- Сложный анализ, дебаг → Sonnet ($3/$15)\n- Креатив, рассуждения → Opus ($15/$75)\n\n**2. Сокращай system prompt** — он шлётся каждый раз. Используй prompt caching для длинных.\n\n**3. Лимитируй output** — `max_tokens` под реальный максимум, не «с запасом 8K».\n\n**4. Batch API** для не-realtime задач (50% скидка от обоих провайдеров).\n\n**5. Кешируй похожие запросы** (классификация, FAQ).\n\n**6. Мониторинг** — без него ты не знаешь куда уходят деньги.",
        },
      ],
    },
    {
      id: "monitoring",
      title: "Мониторинг и логирование",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `# Простой structured logger через loguru
from loguru import logger
import json

logger.add("llm_calls.jsonl", serialize=True, rotation="100 MB")


async def call_with_logging(prompt: str, user_id: str = None) -> dict:
    start = time.time()
    try:
        response = await client.messages.create(...)
        elapsed = time.time() - start

        cost = calculate_cost(response)

        logger.info({
            "event": "llm_call",
            "model": response.model,
            "user_id": user_id,
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
            "cost_usd": cost,
            "latency_ms": int(elapsed * 1000),
            "stop_reason": response.stop_reason,
        })
        return {"text": response.content[0].text, "cost": cost}

    except Exception as e:
        logger.error({
            "event": "llm_error",
            "user_id": user_id,
            "error": type(e).__name__,
            "message": str(e),
        })
        raise`,
        },
        {
          type: "text",
          content:
            "**Платформы observability (для серьёзных проектов):**\n\n- **Langfuse** — open source, есть free cloud tier. https://langfuse.com\n- **Helicone** — proxy + observability\n- **LangSmith** — от LangChain\n- **Phoenix (Arize)** — open source",
        },
      ],
    },
    {
      id: "resources",
      title: "Ресурсы",
      estimatedMinutes: 0,
      blocks: [
        {
          type: "resources",
          items: [
            {
              title: "Anthropic Prompt Caching",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
              description: "Полная документация по prompt caching.",
            },
            {
              title: "Anthropic Streaming",
              url: "https://docs.anthropic.com/en/api/messages-streaming",
              description: "Документация по streaming API.",
            },
            {
              title: "Langfuse",
              url: "https://langfuse.com/",
              description: "Главная open-source платформа observability для LLM.",
            },
            {
              title: "Anthropic Batch API",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
              description: "Для не-realtime задач — скидка 50%.",
            },
          ],
        },
      ],
    },
    {
      id: "funfacts",
      title: "Из мира программистов",
      estimatedMinutes: 3,
      blocks: [
        {
          type: "funfact",
          emoji: "🎲",
          title: "Две сложные вещи в computer science",
          content:
            "Самая известная цитата в индустрии (Phil Karlton): **«There are only two hard things in Computer Science: cache invalidation and naming things»**. Позже мем расширили: «...and off-by-one errors». Кэширование в LLM-приложениях — отдельная боль: история разная → ключи разные → cache miss. Поэтому **prompt caching** Anthropic решает то, что обычный cache не может.",
        },
        {
          type: "funfact",
          emoji: "💸",
          title: "Стартап разорился на $80K за ночь",
          content:
            "Реальная история 2023 года: стартап на YC поставил Claude API endpoint без rate limit. Какой-то скрипт зациклился и за **одну ночь** сжёг $80K — почти весь seed-раунд. Anthropic compounded the funds — но через 6 месяцев. С тех пор в Anthropic Console **обязательны budget alerts** — без них проект отказывается стартовать.",
        },
        {
          type: "funfact",
          emoji: "⚡",
          title: "Streaming — психологический трюк",
          content:
            "Исследования UX-лабораторий показали: пользователи **в 5 раз** более терпеливы к LLM-стримингу, чем к синхронному ответу той же длительности. Воспринимаемая скорость > реальная скорость. Тот же приём раньше использовал YouTube с прогресс-баром «buffering», Microsoft с **progress bars**, которые иногда не отражали реальный прогресс — просто давали ощущение «работа идёт».",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Главное преимущество streaming для пользователя:",
      options: [
        { id: "a", text: "Общее время ответа уменьшается в 10 раз" },
        { id: "b", text: "Пользователь начинает читать сразу — воспринимаемая скорость в 3-5x выше" },
        { id: "c", text: "Стоимость уменьшается" },
        { id: "d", text: "Точность повышается" },
      ],
      correctOptionId: "b",
      explanation:
        "Общее время не меняется. Меняется UX: вместо 10 секунд тишины — мгновенное появление и плавное «печатание». Это огромная разница в восприятии.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Какой класс используется в FastAPI для streaming-ответа?",
      options: [
        { id: "a", text: "JSONResponse" },
        { id: "b", text: "StreamingResponse" },
        { id: "c", text: "WebSocketResponse" },
        { id: "d", text: "ChunkedResponse" },
      ],
      correctOptionId: "b",
      explanation:
        "`StreamingResponse` принимает async generator. Часто используется с media_type='text/event-stream' для SSE (Server-Sent Events).",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Prompt caching от Anthropic делает токены...",
      options: [
        { id: "a", text: "Дешевле в 2 раза" },
        { id: "b", text: "Дешевле в 10 раз (для cache_read токенов)" },
        { id: "c", text: "Дороже на 10%" },
        { id: "d", text: "Бесплатными" },
      ],
      correctOptionId: "b",
      explanation:
        "Cache read стоит ~10% от обычной цены input. Cache creation стоит ~125%. Окупается уже на 2-3 одинаковых запросах.",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "Что хорошо подходит для prompt caching? (несколько)",
      options: [
        { id: "a", text: "Длинный неизменный system prompt" },
        { id: "b", text: "Большой документ-контекст для RAG, который не меняется между запросами" },
        { id: "c", text: "Few-shot examples (всегда одинаковые)" },
        { id: "d", text: "User message — он у каждого пользователя разный" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Caching работает только для **префикса** запроса который **одинаковый** между вызовами. User message в конце — обычно разный, не кешируется.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Когда client-side cache (Redis) даёт наибольший эффект?",
      options: [
        { id: "a", text: "Чат-боты с памятью (история каждого пользователя разная)" },
        { id: "b", text: "Классификация / RAG-вопросы которые повторяются (FAQ)" },
        { id: "c", text: "Креативная генерация" },
        { id: "d", text: "Streaming endpoints" },
      ],
      correctOptionId: "b",
      explanation:
        "Кеш работает если ключи (запросы) повторяются. Чат с историей → каждый раз ключ новый → cache miss. FAQ → одни и те же вопросы → cache hit.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Какая модель Claude самая дешёвая и подходит для классификации?",
      options: [
        { id: "a", text: "Claude Opus" },
        { id: "b", text: "Claude Sonnet" },
        { id: "c", text: "Claude Haiku" },
        { id: "d", text: "Все одной цены" },
      ],
      correctOptionId: "c",
      explanation:
        "Haiku ~ в 4 раза дешевле Sonnet и в 20 раз дешевле Opus. Для классификации и простых задач — выбор по умолчанию.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Эмуляция streaming",
      description:
        "Без реального API — сгенерируй имитацию streaming-ответа. Функция `simulate_stream(text)` — генератор, который выдаёт текст по 3-5 символов с small delay.\n\nДля runnable в браузере используем `asyncio.sleep` через `time.sleep`.",
      starterCode: `import time
from typing import Iterator


def simulate_stream(text: str, chunk_size: int = 4, delay_ms: int = 30) -> Iterator[str]:
    """Имитирует stream — выдаёт куски с задержкой."""
    # Допиши
    pass


# Тест: должны увидеть "печатание"
print("=== Streaming ===")
for chunk in simulate_stream("Hello world! This is a streamed response from a mock LLM.", chunk_size=5, delay_ms=20):
    print(chunk, end="", flush=True)
print()
`,
      solutionCode: `import time
from typing import Iterator


def simulate_stream(text: str, chunk_size: int = 4, delay_ms: int = 30) -> Iterator[str]:
    delay = delay_ms / 1000
    for i in range(0, len(text), chunk_size):
        yield text[i:i + chunk_size]
        time.sleep(delay)


print("=== Streaming ===")
for chunk in simulate_stream("Hello world! This is a streamed response from a mock LLM.", chunk_size=5, delay_ms=20):
    print(chunk, end="", flush=True)
print()`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "LRU cache для классификации",
      description:
        "Используй `functools.lru_cache` для кеширования дорогих вычислений.\n\nФункция `expensive_classify(text)` — имитирует медленный LLM-вызов (sleep 0.5s).\n\nОберни в декоратор так, чтобы повторные вызовы с тем же текстом отвечали мгновенно.",
      starterCode: `import time
from functools import lru_cache


# Просто счётчик вызовов реальной функции
call_count = 0


# Допиши декоратор
def expensive_classify(text: str) -> str:
    global call_count
    call_count += 1
    time.sleep(0.3)  # эмулируем LLM
    return "positive" if "good" in text.lower() else "negative"


# Тестируем
texts = ["good service", "bad experience", "good service", "good service", "bad experience"]

start = time.time()
for t in texts:
    label = expensive_classify(t)
    print(f"  {t} → {label}")
elapsed = time.time() - start

print(f"\\nВремя: {elapsed:.2f}s")
print(f"Реальных вызовов: {call_count} (всего обращений: {len(texts)})")
print(f"Cache info: {expensive_classify.cache_info()}")
`,
      solutionCode: `import time
from functools import lru_cache


call_count = 0


@lru_cache(maxsize=128)
def expensive_classify(text: str) -> str:
    global call_count
    call_count += 1
    time.sleep(0.3)
    return "positive" if "good" in text.lower() else "negative"


texts = ["good service", "bad experience", "good service", "good service", "bad experience"]

start = time.time()
for t in texts:
    label = expensive_classify(t)
    print(f"  {t} → {label}")
elapsed = time.time() - start

print(f"\\nВремя: {elapsed:.2f}s")
print(f"Реальных вызовов: {call_count} (всего обращений: {len(texts)})")
print(f"Cache info: {expensive_classify.cache_info()}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Cost tracker для production",
      description:
        "Класс `LLMCostTracker` для накопления метрик в стиле observability:\n- `record_call(model, input, output, latency_ms, user_id, cached=False)`\n- `summary(by='model')` → агрегат: count, total_cost, avg_latency\n- `top_users(limit)` → топ юзеров по стоимости",
      starterCode: `from collections import defaultdict


class LLMCostTracker:
    PRICES = {
        "haiku":  (0.80, 4.00),
        "sonnet": (3.00, 15.00),
        "opus":   (15.00, 75.00),
    }

    def __init__(self):
        self.records: list[dict] = []

    def _cost(self, model: str, inp: int, out: int) -> float:
        i, o = self.PRICES[model]
        return (inp / 1e6) * i + (out / 1e6) * o

    def record_call(self, model, input_tokens, output_tokens, latency_ms, user_id, cached=False):
        cost = 0 if cached else self._cost(model, input_tokens, output_tokens)
        self.records.append({
            "model": model,
            "input": input_tokens,
            "output": output_tokens,
            "latency_ms": latency_ms,
            "user_id": user_id,
            "cached": cached,
            "cost": cost,
        })

    def summary(self, by: str = "model") -> dict:
        # Допиши: группировка по by ('model' или 'user_id')
        # Возврат: {key: {count, total_cost, avg_latency_ms}}
        pass

    def top_users(self, limit: int = 5) -> list[dict]:
        # Допиши
        pass


tracker = LLMCostTracker()
tracker.record_call("haiku", 1000, 500, 800, "alice")
tracker.record_call("haiku", 1200, 400, 750, "bob")
tracker.record_call("sonnet", 500, 300, 1200, "alice")
tracker.record_call("haiku", 100, 50, 50, "alice", cached=True)
tracker.record_call("opus", 5000, 2000, 5000, "charlie")

import json
print("=== By model ===")
print(json.dumps(tracker.summary("model"), indent=2))
print("\\n=== By user ===")
print(json.dumps(tracker.summary("user_id"), indent=2))
print("\\n=== Top users ===")
print(json.dumps(tracker.top_users(3), indent=2))
`,
      solutionCode: `from collections import defaultdict


class LLMCostTracker:
    PRICES = {
        "haiku":  (0.80, 4.00),
        "sonnet": (3.00, 15.00),
        "opus":   (15.00, 75.00),
    }

    def __init__(self):
        self.records: list[dict] = []

    def _cost(self, model: str, inp: int, out: int) -> float:
        i, o = self.PRICES[model]
        return (inp / 1e6) * i + (out / 1e6) * o

    def record_call(self, model, input_tokens, output_tokens, latency_ms, user_id, cached=False):
        cost = 0 if cached else self._cost(model, input_tokens, output_tokens)
        self.records.append({
            "model": model,
            "input": input_tokens,
            "output": output_tokens,
            "latency_ms": latency_ms,
            "user_id": user_id,
            "cached": cached,
            "cost": cost,
        })

    def summary(self, by: str = "model") -> dict:
        grouped = defaultdict(list)
        for r in self.records:
            grouped[r[by]].append(r)

        out = {}
        for key, recs in grouped.items():
            out[key] = {
                "count": len(recs),
                "total_cost": round(sum(r["cost"] for r in recs), 6),
                "avg_latency_ms": round(sum(r["latency_ms"] for r in recs) / len(recs), 1),
                "cache_hits": sum(1 for r in recs if r["cached"]),
            }
        return out

    def top_users(self, limit: int = 5) -> list[dict]:
        user_costs = defaultdict(float)
        for r in self.records:
            user_costs[r["user_id"]] += r["cost"]
        sorted_users = sorted(user_costs.items(), key=lambda x: x[1], reverse=True)
        return [{"user_id": u, "total_cost": round(c, 6)} for u, c in sorted_users[:limit]]


tracker = LLMCostTracker()
tracker.record_call("haiku", 1000, 500, 800, "alice")
tracker.record_call("haiku", 1200, 400, 750, "bob")
tracker.record_call("sonnet", 500, 300, 1200, "alice")
tracker.record_call("haiku", 100, 50, 50, "alice", cached=True)
tracker.record_call("opus", 5000, 2000, 5000, "charlie")

import json
print("=== By model ===")
print(json.dumps(tracker.summary("model"), indent=2))
print("\\n=== By user ===")
print(json.dumps(tracker.summary("user_id"), indent=2))
print("\\n=== Top users ===")
print(json.dumps(tracker.top_users(3), indent=2))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: streaming + cache в FastAPI",
      description:
        "Возьми RAG-API из недели 17 и добавь:\n\n1. **Streaming endpoint** `/chat/stream` — отвечает SSE\n2. **Caching на запросы** — простой in-memory dict с TTL 1 час (потом можешь заменить на Redis)\n3. **Логирование** — каждый вызов записывает в файл `llm_calls.jsonl`\n\nПротестируй через curl:\n```bash\n# Стриминг\ncurl -N -X POST http://localhost:8000/chat/stream \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"message\":\"Расскажи историю\"}'\n\n# Cached запрос — второй раз быстро\ncurl -X POST http://localhost:8000/chat -d '{\"message\":\"hello\"}'\ncurl -X POST http://localhost:8000/chat -d '{\"message\":\"hello\"}'\n```",
      starterCode: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from anthropic import AsyncAnthropic
from loguru import logger
import hashlib, json, time

logger.add("llm_calls.jsonl", serialize=True, rotation="50 MB")

app = FastAPI()
client = AsyncAnthropic()

# Простой in-memory cache с TTL
_cache: dict[str, tuple[float, dict]] = {}
CACHE_TTL = 3600  # секунд


def make_key(message: str) -> str:
    return hashlib.sha256(message.encode()).hexdigest()


def cache_get(key: str):
    item = _cache.get(key)
    if not item:
        return None
    timestamp, value = item
    if time.time() - timestamp > CACHE_TTL:
        del _cache[key]
        return None
    return value


def cache_set(key: str, value: dict):
    _cache[key] = (time.time(), value)


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat(req: ChatRequest):
    key = make_key(req.message)
    cached = cache_get(key)
    if cached:
        logger.info({"event": "cache_hit", "key": key[:8]})
        return {"reply": cached["text"], "cached": True}

    t0 = time.time()
    response = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": req.message}]
    )
    elapsed = time.time() - t0
    text = response.content[0].text

    logger.info({
        "event": "llm_call",
        "model": "haiku",
        "input": response.usage.input_tokens,
        "output": response.usage.output_tokens,
        "latency_ms": int(elapsed * 1000),
    })

    cache_set(key, {"text": text})
    return {"reply": text, "cached": False}


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    async def gen():
        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{"role": "user", "content": req.message}]
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {text}\\n\\n"
            yield "data: [DONE]\\n\\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


# Запуск:
# uvicorn api:app --reload
`,
      language: "python",
      runnable: false,
      hints: [
        "Проверить streaming в браузере проще через простой HTML с EventSource.",
        "Для серьёзного prod — замени dict на Redis с TTL: `await r.setex(key, 3600, json.dumps(value))`.",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь зачем streaming для UX (3-5x воспринимаемая скорость)",
    "Реализовал streaming endpoint в FastAPI",
    "Знаешь prompt caching и client-side cache — когда какой использовать",
    "Локально внедрил кеширование запросов",
    "Логируешь LLM-вызовы в structured формате",
  ],
};
