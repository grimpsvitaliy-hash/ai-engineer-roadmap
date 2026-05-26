import type { Lesson } from "../types";

export const week17: Lesson = {
  id: "m5-w17",
  monthId: "month-05",
  weekNumber: 17,
  title: "FastAPI — REST API для LLM",
  goal: "Можешь обернуть любую свою функцию в HTTP API. Понимаешь request/response, валидацию через Pydantic, async (критично для LLM).",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "why-fastapi",
      title: "Почему FastAPI",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**FastAPI** — современный Python-фреймворк для API. В 2026 — индустриальный стандарт для backend на Python.",
        },
        {
          type: "text",
          content:
            "**Почему именно FastAPI для LLM:**\n\n- **Async из коробки** — критично для LLM (вызов длится секунды, надо обрабатывать тысячи параллельно)\n- **Автоматическая валидация** через Pydantic — твои request/response — типизированные dataclass\n- **Автоматическая документация** Swagger UI на `/docs`\n- **Type hints везде** — IDE подсказывает, ошибки видны до запуска\n- Простой синтаксис, короткий код",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Альтернативы",
          content:
            "**Flask** — старая школа, sync (плохо для LLM). **Django** — слишком тяжёлый для API. **Litestar** — конкурент FastAPI, тоже хороший. Для LLM-проектов в 2026 — FastAPI default.",
        },
      ],
    },
    {
      id: "hello-fastapi",
      title: "Hello, FastAPI",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "bash",
          content: `pip install "fastapi[standard]" uvicorn`,
        },
        {
          type: "code",
          language: "python",
          content: `# main.py
from fastapi import FastAPI

app = FastAPI(title="My LLM API")


@app.get("/")
def root():
    return {"status": "ok", "service": "llm-api"}


@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"Привет, {name}!"}`,
        },
        {
          type: "code",
          language: "bash",
          content: `# Запуск с hot reload
uvicorn main:app --reload

# Открой:
# http://127.0.0.1:8000          → endpoint /
# http://127.0.0.1:8000/hello/Vasya
# http://127.0.0.1:8000/docs     → автоматический Swagger UI`,
        },
      ],
    },
    {
      id: "pydantic",
      title: "Pydantic — валидация и схемы",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**Pydantic** превращает обычные Python-классы в строго типизированные модели. FastAPI использует их для валидации запросов и ответов.",
        },
        {
          type: "code",
          language: "python",
          content: `from pydantic import BaseModel, Field
from typing import Literal


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    system: str | None = None
    temperature: float = Field(default=0.7, ge=0, le=1)
    model: Literal["haiku", "sonnet", "opus"] = "haiku"


class ChatResponse(BaseModel):
    reply: str
    tokens_used: int
    cost_usd: float
    model: str`,
        },
        {
          type: "text",
          content:
            "Используем в endpoint:",
        },
        {
          type: "code",
          language: "python",
          content: `from fastapi import FastAPI

app = FastAPI()


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    # request — это уже валидированный объект
    # Если message пуст или больше 4000 — FastAPI вернёт 422 автоматически
    # Если temperature > 1 — 422
    # Если model не из списка — 422

    reply = call_claude(request.message, request.system, request.model)

    return ChatResponse(
        reply=reply.text,
        tokens_used=reply.usage.total,
        cost_usd=reply.cost,
        model=request.model,
    )`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Что даёт Pydantic",
          content:
            "✅ Автоматическая валидация — клиент шлёт мусор → 422 с понятной ошибкой. ✅ Type hints для IDE. ✅ Автоматическая генерация JSON Schema → красивая документация на /docs. ✅ Сериализация в JSON.",
        },
      ],
    },
    {
      id: "async",
      title: "Async — критично для LLM",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "Почему это важно",
          content:
            "LLM-вызов длится 1-30 секунд. Если делать sync — пока один запрос ждёт ответ от Anthropic, твой сервер заблокирован для всех остальных. С async — он спокойно обрабатывает тысячи параллельных запросов.",
        },
        {
          type: "code",
          language: "python",
          content: `# ПЛОХО: sync — блокирует worker на время LLM-вызова
from anthropic import Anthropic

client = Anthropic()


@app.post("/chat")
def chat(req: ChatRequest):
    response = client.messages.create(...)  # БЛОКИРУЕТ
    return ChatResponse(...)


# ХОРОШО: async — освобождает worker пока ждём LLM
from anthropic import AsyncAnthropic

client = AsyncAnthropic()


@app.post("/chat")
async def chat(req: ChatRequest):
    response = await client.messages.create(...)  # НЕ блокирует
    return ChatResponse(...)`,
        },
        {
          type: "text",
          content:
            "**Правила:**\n\n- ✅ Endpoint, который ждёт I/O (API, БД, файлы) → `async def`\n- ✅ Используй `AsyncAnthropic` вместо `Anthropic`\n- ✅ Все библиотеки тоже async (asyncpg вместо psycopg2, httpx вместо requests)\n- ❌ Внутри `async` функции **никогда** не вызывай sync I/O — заблокируешь event loop",
        },
      ],
    },
    {
      id: "errors",
      title: "Обработка ошибок и HTTPException",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `from fastapi import HTTPException
import anthropic


@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        response = await client.messages.create(...)
        return ChatResponse(...)

    except anthropic.AuthenticationError:
        # 500 — серверная проблема (не клиента)
        raise HTTPException(status_code=500, detail="LLM service auth failed")

    except anthropic.RateLimitError:
        # 429 — слишком много запросов
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Try again in a few seconds.",
        )

    except anthropic.BadRequestError as e:
        # 400 — что-то с входом (например, контекст превышен)
        raise HTTPException(status_code=400, detail=str(e))`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Глобальный handler",
          content:
            "Для DRY — можно повесить `@app.exception_handler(anthropic.APIError)` который автоматически конвертирует исключения в HTTP-ответы.",
        },
      ],
    },
    {
      id: "dependencies",
      title: "Dependency injection",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "FastAPI `Depends()` — встроенный механизм для общей логики (авторизация, БД-сессии, общие клиенты).",
        },
        {
          type: "code",
          language: "python",
          content: `from fastapi import Depends, Header, HTTPException


async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != "secret":
        raise HTTPException(401, "Invalid API key")
    return x_api_key


@app.post("/chat", dependencies=[Depends(verify_api_key)])
async def chat(req: ChatRequest):
    # этот endpoint доступен только с правильным X-API-Key
    ...`,
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
              title: "FastAPI Tutorial",
              url: "https://fastapi.tiangolo.com/tutorial/",
              description: "Лучший туториал для backend-фреймворка в мире. Пройди до Body - Multiple Parameters.",
            },
            {
              title: "Pydantic docs",
              url: "https://docs.pydantic.dev/",
              description: "Документация Pydantic v2.",
            },
            {
              title: "Async Python — Real Python",
              url: "https://realpython.com/async-io-python/",
              description: "Глубокое введение в async/await.",
            },
            {
              title: "Anthropic async examples",
              url: "https://github.com/anthropics/anthropic-sdk-python#async-usage",
              description: "Примеры использования AsyncAnthropic.",
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
          emoji: "🇨🇴",
          title: "FastAPI родом из Колумбии",
          content:
            "**Себастьян Рамирез** — колумбийский разработчик из Боготы. В 2018 он работал в маленьком стартапе и каждый раз писал boilerplate для API. Создал FastAPI как **side-project**. Сейчас FastAPI используют **более 50% всех новых Python web-проектов**, обогнав Flask и Django. Sebastian работает в Sourcegraph. Себастьян регулярно отвечает на issues в одиночку — то ли он cyborg, то ли просто кофеман.",
        },
        {
          type: "funfact",
          emoji: "🐍",
          title: "GIL — миф или реальность",
          content:
            "**GIL (Global Interpreter Lock)** в Python — холивар-тема десятилетий. «Python однопоточный!» — кричат критики. На деле для I/O (HTTP-запросы, БД) GIL отпускается, и **async работает прекрасно**. В Python 3.13 (2024) появилась экспериментальная сборка **БЕЗ GIL** (PEP 703). Через ещё пару лет холивар закончится. Жаль, столько мемов пропадёт.",
        },
        {
          type: "funfact",
          emoji: "📜",
          title: "Pydantic — победитель типизации",
          content:
            "**Pydantic** написан Samuel Colvin почти в одиночку. В 2017 он искал лучший способ валидировать данные в Python. Pydantic v2 (2023) был **переписан на Rust** для скорости — некоторые операции стали в **17 раз быстрее**. Сейчас Pydantic используют OpenAI, Anthropic, Google, Microsoft. Парадокс: самый популярный «питоновский» инструмент валидации работает на не-питоне.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Почему FastAPI хорош именно для LLM-приложений? (несколько)",
      options: [
        { id: "a", text: "Async поддержка — нужна для параллельных LLM-вызовов" },
        { id: "b", text: "Автоматическая валидация через Pydantic" },
        { id: "c", text: "Автоматическая Swagger-документация" },
        { id: "d", text: "Не нужен код — всё генерируется" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "(d) — нет, код писать нужно. Остальные три — реальные преимущества над Flask/Django.",
    },
    {
      id: "q2",
      type: "single-choice",
      question:
        "В sync endpoint ты делаешь `response = client.messages.create(...)` (sync API). Что плохого?",
      options: [
        { id: "a", text: "Это не работает — Anthropic не поддерживает" },
        { id: "b", text: "Worker процесса блокируется на время LLM-вызова (1-30 сек), нельзя обрабатывать другие запросы" },
        { id: "c", text: "Нарушает PEP-8" },
        { id: "d", text: "Это медленнее на одном запросе" },
      ],
      correctOptionId: "b",
      explanation:
        "Sync = блокировка worker. С 4 workers ты можешь обрабатывать только 4 параллельных пользователя. Async же — тысячи.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Что делает Pydantic в FastAPI?",
      options: [
        { id: "a", text: "Запускает сервер" },
        { id: "b", text: "Валидирует входящие данные, генерирует JSON Schema, сериализует ответы" },
        { id: "c", text: "Деплоит приложение" },
        { id: "d", text: "Кеширует ответы" },
      ],
      correctOptionId: "b",
      explanation:
        "Pydantic — это валидация + типизация + сериализация. Без него FastAPI не отличался бы от Flask.",
    },
    {
      id: "q4",
      type: "text-input",
      question:
        "По какому URL по умолчанию FastAPI показывает Swagger UI с автодокументацией?\nВведи только path (например `/api/v1`).",
      correctAnswers: ["/docs"],
      caseSensitive: false,
      explanation:
        "`/docs` — Swagger UI. Также есть `/redoc` — альтернативная документация в другом стиле. Оба генерируются автоматически.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Если поле в Pydantic-модели не проходит валидацию, какой HTTP-код вернёт FastAPI?",
      options: [
        { id: "a", text: "200" },
        { id: "b", text: "400 Bad Request" },
        { id: "c", text: "422 Unprocessable Entity" },
        { id: "d", text: "500 Internal Server Error" },
      ],
      correctOptionId: "c",
      explanation:
        "FastAPI использует 422 (Unprocessable Entity) для ошибок валидации. С телом, в котором указано, какое поле не прошло и почему.",
    },
    {
      id: "q6",
      type: "single-choice",
      question:
        "Внутри `async def endpoint()` ты пишешь `requests.get('https://api.example.com')`. Что плохо?",
      options: [
        { id: "a", text: "requests запрещён в FastAPI" },
        { id: "b", text: "requests — sync, он заблокирует event loop. Нужен httpx (async)" },
        { id: "c", text: "Ничего, это нормально" },
        { id: "d", text: "Только если запрос к стороннему API" },
      ],
      correctOptionId: "b",
      explanation:
        "Sync I/O внутри async — главный антипаттерн. Заменяй: `requests` → `httpx`, `psycopg2` → `asyncpg`, `Anthropic()` → `AsyncAnthropic()`.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Pydantic-модель для request",
      description:
        "Опиши Pydantic-модель `SummarizeRequest`:\n- `text: str` — обязательное, min 10 символов, max 50000\n- `max_sentences: int` — default 3, от 1 до 10\n- `language: Literal['en', 'ru', 'auto']` — default 'auto'\n\nПроверь валидацию вручную (без FastAPI).",
      starterCode: `from pydantic import BaseModel, Field, ValidationError
from typing import Literal


class SummarizeRequest(BaseModel):
    # Допиши
    pass


# Тесты — должны пройти валидацию
valid_cases = [
    {"text": "Достаточно длинный текст для саммари."},
    {"text": "Достаточно длинный.", "max_sentences": 5, "language": "ru"},
]

# Должны упасть на валидации
invalid_cases = [
    {"text": "short"},                                    # слишком короткий
    {"text": "ok text long enough", "max_sentences": 20}, # max_sentences > 10
    {"text": "ok text long enough", "language": "fr"},    # неизвестный язык
]

print("=== Valid ===")
for case in valid_cases:
    try:
        r = SummarizeRequest(**case)
        print(f"  OK: {r}")
    except ValidationError as e:
        print(f"  FAIL: {e}")

print("\\n=== Invalid (должны упасть) ===")
for case in invalid_cases:
    try:
        SummarizeRequest(**case)
        print(f"  FAIL (не должно было пройти): {case}")
    except ValidationError as e:
        print(f"  OK поймали: {case} → {e.errors()[0]['msg']}")
`,
      solutionCode: `from pydantic import BaseModel, Field, ValidationError
from typing import Literal


class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=50000)
    max_sentences: int = Field(default=3, ge=1, le=10)
    language: Literal["en", "ru", "auto"] = "auto"


valid_cases = [
    {"text": "Достаточно длинный текст для саммари."},
    {"text": "Достаточно длинный.", "max_sentences": 5, "language": "ru"},
]

invalid_cases = [
    {"text": "short"},
    {"text": "ok text long enough", "max_sentences": 20},
    {"text": "ok text long enough", "language": "fr"},
]

print("=== Valid ===")
for case in valid_cases:
    try:
        r = SummarizeRequest(**case)
        print(f"  OK: {r}")
    except ValidationError as e:
        print(f"  FAIL: {e}")

print("\\n=== Invalid ===")
for case in invalid_cases:
    try:
        SummarizeRequest(**case)
        print(f"  FAIL: {case}")
    except ValidationError as e:
        print(f"  OK: {case} → {e.errors()[0]['msg']}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Класс маршрутизатор",
      description:
        "Без реального FastAPI — простой роутер, имитирующий его поведение.\n\nКласс `Router`:\n- `@route('GET', '/path')` — декоратор для регистрации\n- `dispatch(method, path)` → вызывает функцию или возвращает 404",
      starterCode: `class Router:
    def __init__(self):
        self.routes: dict[tuple[str, str], callable] = {}

    def route(self, method: str, path: str):
        def decorator(fn):
            self.routes[(method, path)] = fn
            return fn
        return decorator

    def dispatch(self, method: str, path: str):
        # Допиши: вызови функцию или верни {"status": 404}
        pass


router = Router()


@router.route("GET", "/")
def root():
    return {"hello": "world"}


@router.route("GET", "/users")
def list_users():
    return [{"id": 1, "name": "Anna"}, {"id": 2, "name": "Boris"}]


@router.route("POST", "/users")
def create_user():
    return {"created": True}


print(router.dispatch("GET", "/"))
print(router.dispatch("GET", "/users"))
print(router.dispatch("POST", "/users"))
print(router.dispatch("DELETE", "/users"))
print(router.dispatch("GET", "/missing"))
`,
      solutionCode: `class Router:
    def __init__(self):
        self.routes: dict[tuple[str, str], callable] = {}

    def route(self, method: str, path: str):
        def decorator(fn):
            self.routes[(method, path)] = fn
            return fn
        return decorator

    def dispatch(self, method: str, path: str):
        handler = self.routes.get((method, path))
        if not handler:
            return {"status": 404, "error": f"Not found: {method} {path}"}
        return handler()


router = Router()


@router.route("GET", "/")
def root():
    return {"hello": "world"}


@router.route("GET", "/users")
def list_users():
    return [{"id": 1, "name": "Anna"}, {"id": 2, "name": "Boris"}]


@router.route("POST", "/users")
def create_user():
    return {"created": True}


print(router.dispatch("GET", "/"))
print(router.dispatch("GET", "/users"))
print(router.dispatch("POST", "/users"))
print(router.dispatch("DELETE", "/users"))
print(router.dispatch("GET", "/missing"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Базовая аутентификация",
      description:
        "Класс `APIKeyAuth`:\n- `__init__(valid_keys)` — список валидных ключей\n- `check(provided_key)` → возвращает True или бросает `HTTPException(401)` (заменим её на ValueError для теста)",
      starterCode: `class HTTPException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(f"{status_code}: {detail}")


class APIKeyAuth:
    def __init__(self, valid_keys: set[str]):
        self.valid_keys = valid_keys

    def check(self, provided_key: str | None) -> bool:
        # Допиши: бросай HTTPException(401, ...) если ключ невалиден или None
        pass


auth = APIKeyAuth({"secret-1", "secret-2"})

# Должно вернуть True
print(auth.check("secret-1"))

# Должно упасть
for bad in [None, "", "wrong-key"]:
    try:
        auth.check(bad)
    except HTTPException as e:
        print(f"  OK: {bad!r} → {e}")
`,
      solutionCode: `class HTTPException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(f"{status_code}: {detail}")


class APIKeyAuth:
    def __init__(self, valid_keys: set[str]):
        self.valid_keys = valid_keys

    def check(self, provided_key: str | None) -> bool:
        if not provided_key:
            raise HTTPException(401, "API key required (header X-API-Key)")
        if provided_key not in self.valid_keys:
            raise HTTPException(401, "Invalid API key")
        return True


auth = APIKeyAuth({"secret-1", "secret-2"})

print(auth.check("secret-1"))

for bad in [None, "", "wrong-key"]:
    try:
        auth.check(bad)
    except HTTPException as e:
        print(f"  OK: {bad!r} → {e}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: FastAPI обёртка над RAG",
      description:
        "Возьми свой RAG-проект из недели 16 и оберни его в REST API через FastAPI.\n\n**Шаги:**\n\n1. `pip install \"fastapi[standard]\" uvicorn`\n2. Создай `api.py`:\n```python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel, Field\nfrom typing import List\nfrom rag import answer  # твой RAG-модуль\n\napp = FastAPI(title=\"RAG API\")\n\n\nclass QueryRequest(BaseModel):\n    question: str = Field(..., min_length=3, max_length=1000)\n    k: int = Field(default=5, ge=1, le=20)\n\n\nclass QueryResponse(BaseModel):\n    answer: str\n    sources: List[str]\n    chunks_used: int\n\n\n@app.post(\"/query\", response_model=QueryResponse)\nasync def query(req: QueryRequest):\n    result = await answer(req.question, k=req.k)\n    return QueryResponse(**result)\n\n\n@app.get(\"/healthz\")\ndef healthz():\n    return {\"status\": \"ok\"}\n```\n3. Запусти: `uvicorn api:app --reload`\n4. Открой http://127.0.0.1:8000/docs — попробуй endpoint через Swagger\n5. Сделай POST через curl: `curl -X POST http://127.0.0.1:8000/query -H \"Content-Type: application/json\" -d '{\"question\":\"что такое X?\"}'`\n6. Добавь обработку ошибок (rate limit, неверные запросы)",
      starterCode: `# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from contextlib import asynccontextmanager

# Замени на свой импорт RAG
async def answer(question: str, k: int) -> dict:
    """Это твоя функция из rag.py. Здесь — заглушка."""
    return {
        "answer": f"Mock answer for: {question}",
        "sources": ["doc1.md", "doc2.md"],
        "chunks_used": k,
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Здесь можно прогреть Pyodide / открыть подключение к Chroma
    print("Startup")
    yield
    print("Shutdown")


app = FastAPI(title="RAG API", version="0.1.0", lifespan=lifespan)


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)
    k: int = Field(default=5, ge=1, le=20)


class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    chunks_used: int


@app.post("/query", response_model=QueryResponse)
async def query(req: QueryRequest):
    try:
        result = await answer(req.question, k=req.k)
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


# Запуск:
# uvicorn api:app --reload
`,
      language: "python",
      runnable: false,
      hints: [
        "После запуска открой http://127.0.0.1:8000/docs — Swagger UI с готовыми примерами запросов.",
        "Если у тебя RAG-функция sync — оберни в `await asyncio.to_thread(...)` для async endpoint.",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь зачем async для LLM-приложений",
    "Можешь описать Pydantic-модель с валидацией",
    "Знаешь как ошибки конвертируются в HTTP-коды (422/429/500)",
    "Локально завернул RAG в FastAPI, потестил через Swagger",
    "Понимаешь dependency injection через Depends()",
  ],
};
