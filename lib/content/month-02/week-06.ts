import type { Lesson } from "../types";

export const week06: Lesson = {
  id: "m2-w6",
  monthId: "month-02",
  weekNumber: 6,
  title: "Первые API-вызовы к Claude",
  goal: "Уверенно делаешь запросы к Anthropic API: понимаешь параметры, читаешь ответы, обрабатываешь ошибки, считаешь стоимость.",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "setup",
      title: "Подготовка: SDK и ключ",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Установка официального Python SDK:",
        },
        {
          type: "code",
          language: "bash",
          content: `pip install anthropic
pip install python-dotenv`,
        },
        {
          type: "text",
          content:
            "Получение ключа:\n\n1. Зарегистрируйся на https://console.anthropic.com\n2. Пополни баланс (минимум $5 хватит на 6 месяцев обучения)\n3. **API Keys** → Create Key → скопируй (показывается один раз)",
        },
        {
          type: "code",
          language: "bash",
          content: `# .env (не коммитить!)
ANTHROPIC_API_KEY=sk-ant-api03-...`,
        },
        {
          type: "callout",
          variant: "danger",
          title: "Защита ключа",
          content:
            "**Никогда** не пиши ключ в коде. Боты сканируют GitHub и за минуты украдут. Защита: `.env` + `.gitignore` (с записью `.env`).",
        },
      ],
    },
    {
      id: "first-call",
      title: "Hello, Claude",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()  # читает ANTHROPIC_API_KEY из .env

client = Anthropic()  # ключ берётся из переменной окружения

message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Расскажи короткую шутку про программистов"}
    ]
)

print(message.content[0].text)
print(f"\\nИспользовано токенов: {message.usage.input_tokens} input + {message.usage.output_tokens} output")`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Структура ответа",
          content:
            "`message.content` — это **список** блоков (для tool use может быть несколько). У текстовых блоков есть `.text`. `message.usage` содержит счётчики токенов. `message.stop_reason` показывает почему генерация закончилась (`end_turn`, `max_tokens`, `tool_use`).",
        },
      ],
    },
    {
      id: "parameters",
      title: "Параметры запроса",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `message = client.messages.create(
    # Обязательные:
    model="claude-haiku-4-5-20251001",  # какая модель
    max_tokens=1024,                     # лимит на ответ
    messages=[...],                      # диалог

    # Опциональные:
    system="Ты переводчик.",             # роль/инструкция
    temperature=0.3,                     # 0-1, чем выше тем креативнее
    top_p=1.0,                           # альтернатива temperature
    stop_sequences=["END"],              # стоп-слова
    metadata={"user_id": "abc123"},      # для трекинга
)`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Подбор max_tokens",
          content:
            "Не ставь огромный `max_tokens=8192` если ожидаешь короткий ответ — это влияет на тайминги. Ставь по реальной верхней границе ответа + запас 30%.",
        },
      ],
    },
    {
      id: "errors",
      title: "Обработка ошибок",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Anthropic SDK выбрасывает типизированные исключения. Лови их **точечно**, не голым `except`.",
        },
        {
          type: "code",
          language: "python",
          content: `import anthropic

try:
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hi"}]
    )
except anthropic.AuthenticationError:
    # 401 — неверный ключ
    print("Проверь ANTHROPIC_API_KEY")
except anthropic.RateLimitError:
    # 429 — слишком много запросов
    print("Превышен rate limit, подожди и повтори")
except anthropic.BadRequestError as e:
    # 400 — что-то с параметрами (например, контекст переполнен)
    print(f"Плохой запрос: {e}")
except anthropic.APIConnectionError:
    # Сеть упала
    print("Не могу подключиться к API")
except anthropic.InternalServerError:
    # 500 — на стороне Anthropic
    print("Anthropic упал, повтори через минуту")`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Retry с exponential backoff",
          content:
            "Для rate limit и серверных ошибок — повтори с задержкой 1с, потом 2с, 4с, 8с. SDK Anthropic делает это **автоматически** до 2 раз. Можно настроить через `max_retries`.",
        },
      ],
    },
    {
      id: "cost-monitoring",
      title: "Мониторинг стоимости",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `# Простой логгер стоимости
def log_cost(message, model="haiku"):
    prices = {
        "haiku":  {"in": 0.80, "out": 4.00},
        "sonnet": {"in": 3.00, "out": 15.00},
        "opus":   {"in": 15.00, "out": 75.00},
    }
    p = prices[model]
    cost = (message.usage.input_tokens / 1e6) * p["in"] + \\
           (message.usage.output_tokens / 1e6) * p["out"]
    print(f"  Tokens: {message.usage.input_tokens} + {message.usage.output_tokens}")
    print(f"  Cost: $\${cost:.6f}")`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "На проде",
          content:
            "В реальном приложении — логируй каждый вызов в БД/файл с user_id, токенами и стоимостью. Тогда сможешь увидеть, кто из пользователей жрёт бюджет.",
        },
      ],
    },
    {
      id: "docs",
      title: "Документация",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "resources",
          items: [
            {
              title: "Anthropic Messages API — официальные доки",
              url: "https://docs.anthropic.com/en/api/messages",
              description: "Главный референс по API. Обязательно к прочтению.",
            },
            {
              title: "Anthropic Cookbook — примеры",
              url: "https://github.com/anthropics/anthropic-cookbook",
              description: "Готовые примеры по разным сценариям.",
            },
            {
              title: "Pricing",
              url: "https://www.anthropic.com/pricing",
              description: "Актуальные цены на модели.",
            },
            {
              title: "Python SDK на GitHub",
              url: "https://github.com/anthropics/anthropic-sdk-python",
              description: "Исходники SDK — иногда полезно посмотреть.",
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
          emoji: "🚀",
          title: "ChatGPT vs всё человечество",
          content:
            "**ChatGPT набрал 100 миллионов пользователей за 2 месяца** — самый быстрый продукт в истории. Для сравнения: TikTok — 9 месяцев, Instagram — 2.5 года, Facebook — 4.5 года, телефон — 75 лет. Запуск был запланирован как **«low-key research preview»**. OpenAI не ожидала такого. Они арендовали тысячи GPU экстренно и долго не справлялись с нагрузкой.",
        },
        {
          type: "funfact",
          emoji: "💸",
          title: "Один токен стоит дешевле атома",
          content:
            "Один токен Claude Haiku стоит примерно **$0.0000008**. Чтобы потратить **$1**, нужно сгенерировать ~1.25 миллиона токенов — это **примерно 12 «Войн и мир» Толстого**. AI-инференс — это, возможно, самая дешёвая полезная работа в истории человечества (на единицу). За $5 ты можешь поговорить с моделью больше, чем человек прочитает за всю жизнь.",
        },
        {
          type: "funfact",
          emoji: "📡",
          title: "API первой LLM был... через email",
          content:
            "В 2020 GPT-3 не было API в современном смысле. Чтобы получить доступ к alpha, нужно было **писать в форму OpenAI и ждать неделями**. Доступ давали избранным разработчикам. Стандартный REST API появился позже. Сейчас за 60 секунд ты получаешь ключ и можешь запросить state-of-the-art модель — это огромная демократизация всего за 3 года.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Где должен храниться API-ключ Anthropic в твоём проекте?",
      options: [
        { id: "a", text: "Захардкожен в коде — удобнее" },
        { id: "b", text: "В файле .env, который добавлен в .gitignore" },
        { id: "c", text: "В отдельной публичной репе с пометкой 'не использовать'" },
        { id: "d", text: "В комментарии в коде" },
      ],
      correctOptionId: "b",
      explanation:
        "`.env` файл с ключом + `.env` в `.gitignore` — стандарт. Боты сканируют GitHub: украденный ключ — это сотни долларов на твоём счету за час.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Как получить текст ответа Claude из объекта `message`?",
      options: [
        { id: "a", text: "message.text" },
        { id: "b", text: "message.response" },
        { id: "c", text: "message.content[0].text" },
        { id: "d", text: "str(message)" },
      ],
      correctOptionId: "c",
      explanation:
        "`message.content` — это **список** блоков. У текстовых блоков есть атрибут `.text`. Для tool use или multimodal в списке может быть несколько разных блоков.",
    },
    {
      id: "q3",
      type: "text-input",
      question:
        "Какое исключение бросит SDK при превышении лимита запросов в минуту?\nВведи название класса (без префикса anthropic.).",
      correctAnswers: ["RateLimitError"],
      caseSensitive: true,
      explanation:
        "`anthropic.RateLimitError` — соответствует HTTP 429. SDK сам ретраит автоматически (по умолчанию 2 раза с backoff).",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "Какие параметры обязательны в `client.messages.create()`? (несколько)",
      options: [
        { id: "a", text: "model" },
        { id: "b", text: "max_tokens" },
        { id: "c", text: "messages" },
        { id: "d", text: "temperature" },
        { id: "e", text: "system" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Обязательны: `model`, `max_tokens`, `messages`. `temperature` и `system` опциональны.",
    },
    {
      id: "q5",
      type: "single-choice",
      question:
        "Сколько стоит вызов Haiku 4.5 на 10 000 input + 2 000 output токенов?\n($0.80 input / $4 output за 1M)",
      options: [
        { id: "a", text: "~$0.016" },
        { id: "b", text: "~$0.16" },
        { id: "c", text: "~$1.60" },
        { id: "d", text: "~$0.0016" },
      ],
      correctOptionId: "a",
      explanation:
        "Input: 10000/1M × 0.80 = $0.008. Output: 2000/1M × 4 = $0.008. Итого: $0.016. Один цент с копейками.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Что значит `stop_reason: 'max_tokens'` в ответе?",
      options: [
        { id: "a", text: "Модель естественно закончила ответ" },
        { id: "b", text: "Ответ был обрезан, потому что упёрся в лимит max_tokens" },
        { id: "c", text: "Сработала стоп-последовательность" },
        { id: "d", text: "Превышен rate limit" },
      ],
      correctOptionId: "b",
      explanation:
        "`max_tokens` в stop_reason значит «ответ оборван на полуслове». Увеличь max_tokens или попроси модель быть короче.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Парсинг JSON-ответа Claude (мок)",
      description:
        "Реальный API мы вызвать в браузере не можем (нет ключа в публичном проде). Но потренируемся на типичном ответе.\n\nДан фейковый ответ в формате реального API. Извлеки текст и подсчитай стоимость для Haiku ($0.80 / $4 за 1M).",
      starterCode: `import json

response_json = {
    "id": "msg_01ABC",
    "type": "message",
    "role": "assistant",
    "model": "claude-haiku-4-5-20251001",
    "content": [
        {"type": "text", "text": "Это пример ответа Claude."}
    ],
    "stop_reason": "end_turn",
    "usage": {
        "input_tokens": 23,
        "output_tokens": 9
    }
}


def extract_and_cost(resp: dict) -> tuple[str, float]:
    # Допиши: вернуть (текст ответа, стоимость в долларах)
    pass


text, cost = extract_and_cost(response_json)
print(f"Текст: {text}")
print(f"Стоимость: $\${cost:.8f}")
`,
      solutionCode: `def extract_and_cost(resp: dict) -> tuple[str, float]:
    text = resp["content"][0]["text"]
    inp = resp["usage"]["input_tokens"]
    out = resp["usage"]["output_tokens"]
    cost = (inp / 1_000_000) * 0.80 + (out / 1_000_000) * 4.00
    return text, cost


response_json = {
    "id": "msg_01ABC",
    "type": "message",
    "role": "assistant",
    "model": "claude-haiku-4-5-20251001",
    "content": [{"type": "text", "text": "Это пример ответа Claude."}],
    "stop_reason": "end_turn",
    "usage": {"input_tokens": 23, "output_tokens": 9}
}

text, cost = extract_and_cost(response_json)
print(f"Текст: {text}")
print(f"Стоимость: $\${cost:.8f}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Класс-обёртка над API",
      description:
        "Напиши класс `MockClaude` который имитирует поведение Anthropic SDK. У него:\n- `__init__(api_key)` — конструктор, бросает `ValueError` если ключ пустой или не начинается с `sk-`\n- `chat(message, system=None)` — возвращает строку-ответ. Логика: эхо `'You said: {message}'`, но если system указан — `'[{system}] You said: {message}'`",
      starterCode: `class MockClaude:
    def __init__(self, api_key: str):
        # Допиши валидацию и сохранение ключа
        pass

    def chat(self, message: str, system: str = None) -> str:
        # Допиши
        pass


# Тесты
try:
    bad = MockClaude("")
except ValueError as e:
    print(f"OK: поймали '{e}'")

try:
    bad = MockClaude("wrong-key")
except ValueError as e:
    print(f"OK: поймали '{e}'")

client = MockClaude("sk-ant-test")
print(client.chat("Hello"))
print(client.chat("Hello", system="Будь краток"))
`,
      solutionCode: `class MockClaude:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("API key пуст")
        if not api_key.startswith("sk-"):
            raise ValueError("API key должен начинаться с 'sk-'")
        self.api_key = api_key

    def chat(self, message: str, system: str = None) -> str:
        if system:
            return f"[{system}] You said: {message}"
        return f"You said: {message}"


try:
    bad = MockClaude("")
except ValueError as e:
    print(f"OK: поймали '{e}'")

try:
    bad = MockClaude("wrong-key")
except ValueError as e:
    print(f"OK: поймали '{e}'")

client = MockClaude("sk-ant-test")
print(client.chat("Hello"))
print(client.chat("Hello", system="Будь краток"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Логгер стоимости",
      description:
        "Класс `CostTracker` накапливает статистику по вызовам:\n- Метод `record(model, input_tokens, output_tokens)` — записать один вызов\n- Метод `total_cost()` — сумма всех вызовов в долларах\n- Метод `summary()` — словарь `{model: {calls, total_input, total_output, cost}}`\n\nЦены: Haiku ($0.80/$4), Sonnet ($3/$15), Opus ($15/$75) — за 1M токенов.",
      starterCode: `class CostTracker:
    PRICES = {
        "haiku":  (0.80, 4.00),
        "sonnet": (3.00, 15.00),
        "opus":   (15.00, 75.00),
    }

    def __init__(self):
        self.records = []

    def record(self, model: str, input_tokens: int, output_tokens: int) -> None:
        # Допиши
        pass

    def total_cost(self) -> float:
        # Допиши
        pass

    def summary(self) -> dict:
        # Допиши
        pass


t = CostTracker()
t.record("haiku", 1000, 500)
t.record("haiku", 2000, 800)
t.record("sonnet", 500, 300)

print(f"Всего: $\${t.total_cost():.6f}")

import json
print(json.dumps(t.summary(), indent=2, ensure_ascii=False))
`,
      solutionCode: `class CostTracker:
    PRICES = {
        "haiku":  (0.80, 4.00),
        "sonnet": (3.00, 15.00),
        "opus":   (15.00, 75.00),
    }

    def __init__(self):
        self.records = []

    def _cost(self, model: str, inp: int, out: int) -> float:
        ip, op = self.PRICES[model]
        return (inp / 1_000_000) * ip + (out / 1_000_000) * op

    def record(self, model: str, input_tokens: int, output_tokens: int) -> None:
        self.records.append({
            "model": model,
            "input": input_tokens,
            "output": output_tokens,
            "cost": self._cost(model, input_tokens, output_tokens),
        })

    def total_cost(self) -> float:
        return sum(r["cost"] for r in self.records)

    def summary(self) -> dict:
        out = {}
        for r in self.records:
            m = r["model"]
            if m not in out:
                out[m] = {"calls": 0, "total_input": 0, "total_output": 0, "cost": 0.0}
            out[m]["calls"] += 1
            out[m]["total_input"] += r["input"]
            out[m]["total_output"] += r["output"]
            out[m]["cost"] += r["cost"]
        return out


t = CostTracker()
t.record("haiku", 1000, 500)
t.record("haiku", 2000, 800)
t.record("sonnet", 500, 300)

print(f"Всего: $\${t.total_cost():.6f}")

import json
print(json.dumps(t.summary(), indent=2, ensure_ascii=False))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: первый реальный вызов",
      description:
        "Делается на твоей машине, нужен API-ключ.\n\n**Шаги:**\n\n1. В терминале: `pip install anthropic python-dotenv`\n2. Получи ключ на https://console.anthropic.com → пополни баланс на $5\n3. Создай `.env` в папке проекта:\n```\nANTHROPIC_API_KEY=sk-ant-...\n```\n4. Добавь `.env` в `.gitignore`!\n5. Напиши скрипт `hello.py` (см. ниже)\n6. Запусти, посмотри ответ\n7. Поэкспериментируй: смени system, температуру, модель",
      starterCode: `from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic()

# Попробуй разные комбинации:
message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=1024,
    system="Ты дружелюбный помощник.",
    messages=[
        {"role": "user", "content": "Расскажи интересный факт про осьминогов"}
    ],
    temperature=0.7,
)

print(message.content[0].text)
print(f"\\nТокены: in={message.usage.input_tokens}, out={message.usage.output_tokens}")
print(f"Stop reason: {message.stop_reason}")
`,
      language: "python",
      runnable: false,
      hints: [
        "Если получаешь 401 — ключ неверный или баланс на нуле.",
        "Имена моделей могут меняться — посмотри актуальные на docs.anthropic.com/en/docs/about-claude/models",
      ],
    },
  ],
  checkpoint: [
    "Получил API-ключ Anthropic, защитил его через .env + .gitignore",
    "Сделал первый реальный вызов к Claude локально",
    "Понимаешь структуру ответа: content, usage, stop_reason",
    "Умеешь обрабатывать типичные ошибки (Auth, RateLimit, BadRequest)",
    "Можешь посчитать стоимость вызова в долларах",
  ],
};
