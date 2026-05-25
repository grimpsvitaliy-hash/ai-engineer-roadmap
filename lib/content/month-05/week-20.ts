import type { Lesson } from "../types";

export const week20: Lesson = {
  id: "m5-w20",
  monthId: "month-05",
  weekNumber: 20,
  title: "Деплой + Портфолио-проект #3",
  goal: "Твоё приложение живёт по публичному URL. Не «у меня на ноуте», а на проде. К концу — третий портфолио-проект на GitHub.",
  estimatedHours: "8 ч",
  theory: [
    {
      id: "why-deploy",
      title: "Почему деплой критичен",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "callout",
          variant: "tip",
          title: "Реальность собеседований",
          content:
            "Вопрос «ты сам деплоил что-то?» — один из решающих для junior. Кандидат А: «нет». Кандидат Б: «да, вот ссылка на демо». На следующий этап позовут Б.",
        },
        {
          type: "text",
          content:
            "Деплой = пройденный «последний рубеж». Локально работает у всех. На проде живёт меньшинство. Иметь хотя бы один задеплоенный проект — это **обязательное** требование для джуна в AI-команде.",
        },
      ],
    },
    {
      id: "platforms",
      title: "Платформы для деплоя пет-проектов",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Топ выбор для LLM-приложений с FastAPI:**",
        },
        {
          type: "code",
          language: "text",
          content: `Railway     — railway.app — самый простой, $5/мес starter (есть free credits)
              ✅ Docker, auto-deploy из GitHub
              ✅ env vars в UI, hosting Postgres / Redis встроен
              ✅ Логи и метрики из коробки

Render      — render.com — есть полностью free tier для web services
              ⚠️ Free сервисы «засыпают» при простое (просыпаются медленно)
              ✅ Хорошо для демо

Fly.io      — fly.io — гибче, чуть сложнее, есть free tier
              ✅ Edge deployment в разных регионах
              ⚠️ CLI-first подход, не GUI

HuggingFace Spaces — для Gradio/Streamlit демо, free
                   ✅ Идеально для ML-демо

Streamlit Community Cloud — free для Streamlit
                          ✅ One-click из GitHub репо

Vercel      — отлично для Next.js / frontend
              ⚠️ Python поддерживается, но через Edge Functions (ограничения)`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Для твоего проекта",
          content:
            "Backend (FastAPI + RAG): **Railway** или **Render**.\n\nUI (Streamlit): **Streamlit Cloud** или **HuggingFace Spaces**.\n\nNext.js frontend (если будет): **Vercel**.",
        },
      ],
    },
    {
      id: "railway-deploy",
      title: "Railway — пошагово",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Подготовка:**\n\n1. У тебя должен быть GitHub-репозиторий с Dockerfile (или просто requirements.txt + app)\n2. Регистрация на https://railway.app (через GitHub)\n3. Привязать платёжную карту (даже для free tier — обычная защита от бот-аккаунтов)",
        },
        {
          type: "text",
          content:
            "**Деплой:**\n\n1. Railway dashboard → **New Project** → **Deploy from GitHub repo** → выбери репо\n2. Railway автоматически определит Dockerfile (или Python через nixpacks)\n3. **Settings → Variables** → добавь `ANTHROPIC_API_KEY` и др.\n4. **Settings → Networking → Generate Domain** — получишь URL вида `your-app.up.railway.app`\n5. Готово",
        },
        {
          type: "code",
          language: "text",
          content: `# При каждом push в main — автоматический redeploy
# Логи: Project → Deployments → последний → View Logs
# Метрики: Memory, CPU, Network в UI

# Стоимость: ~$5 credits в месяц, мелкое приложение помещается`,
        },
      ],
    },
    {
      id: "env-management",
      title: "Управление секретами в проде",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "callout",
          variant: "danger",
          title: "Главное правило",
          content:
            "**Никогда** не пушь .env в репо. **Никогда** не вшивай ключи в Dockerfile. Все секреты — только через environment variables платформы (Railway UI / Render Secrets / Fly secrets).",
        },
        {
          type: "code",
          language: "bash",
          content: `# В коде читай через os.environ
import os
api_key = os.environ["ANTHROPIC_API_KEY"]

# Railway / Render автоматически прокидывают env vars в контейнер
# Локально — через .env (но .env в .gitignore!)

# Проверка перед пушем — нет ли случайных secret-ов
git diff --cached | grep -E "sk-ant-|sk-proj-|ghp_"`,
        },
      ],
    },
    {
      id: "post-deploy",
      title: "Что делать после деплоя",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Чек-лист «приложение в проде»:**\n\n- ✅ Health-check endpoint (`/healthz`) — для мониторинга\n- ✅ Логирование всех ошибок + sample успешных запросов\n- ✅ Rate limiting (slowapi или nginx) — защита от runaway costs\n- ✅ Лимит на пользователя в день — защита от хейтеров\n- ✅ Мониторинг счёта Anthropic — настрой budget alerts в console.anthropic.com\n- ✅ CORS-настройки если фронт на другом домене\n- ✅ HTTPS (Railway / Render дают автоматически)",
        },
      ],
    },
    {
      id: "portfolio-3-spec",
      title: "Портфолио-проект #3 — варианты",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Выбери одно** (или свой проект). Делай то, что **тебе интересно** — на собесе будешь рассказывать с энтузиазмом.",
        },
        {
          type: "text",
          content:
            "**Вариант A: AI Code Reviewer**\n\n- POST endpoint принимает GitHub diff (или ссылку на PR)\n- LLM анализирует и возвращает список замечаний (баги, безопасность, стиль)\n- Streamlit UI или GitHub Action для автоматического ревью",
        },
        {
          type: "text",
          content:
            "**Вариант B: Email Triage**\n\n- Принимает текст письма\n- Возвращает: категория (urgent/normal/spam), summary, предлагаемый ответ\n- Опционально — извлечение дат встреч в календарь",
        },
        {
          type: "text",
          content:
            "**Вариант C: Meeting Notes Summarizer**\n\n- Загружает транскрипт встречи (текст)\n- Возвращает: summary, action items, decisions, открытые вопросы\n- Streamlit UI с экспортом в markdown",
        },
        {
          type: "text",
          content:
            "**Вариант D: Свой проект**\n\nИдеально — решение твоей **реальной проблемы**. Например:\n\n- AI-помощник для подготовки 1С-конфигураций (если ты 1С-инженер)\n- Бот для семейного бюджета\n- Парсер чеков из фото + категоризация\n- Что-то для твоего хобби",
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
              title: "Railway docs",
              url: "https://docs.railway.app/",
              description: "Простой и понятный, начни отсюда.",
            },
            {
              title: "Render docs",
              url: "https://render.com/docs",
              description: "Альтернатива Railway, есть полностью бесплатный tier.",
            },
            {
              title: "Streamlit Community Cloud",
              url: "https://streamlit.io/cloud",
              description: "Бесплатный хостинг для Streamlit-приложений.",
            },
            {
              title: "Anthropic Console — Usage & Limits",
              url: "https://console.anthropic.com/settings/limits",
              description: "Настройте лимиты, чтобы не получить $500 счёт от взлома.",
            },
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Какая платформа проще всего для деплоя FastAPI с Dockerfile?",
      options: [
        { id: "a", text: "AWS EC2 — настраиваешь всё сам" },
        { id: "b", text: "Railway / Render — push в GitHub → auto-deploy" },
        { id: "c", text: "Kubernetes" },
        { id: "d", text: "DigitalOcean Droplet" },
      ],
      correctOptionId: "b",
      explanation:
        "PaaS типа Railway / Render — идеально для пет-проектов. Один клик из GitHub. AWS / Kubernetes — для опытных, и не нужны для джуна.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Как правильно передать API-ключ в задеплоенное приложение?",
      options: [
        { id: "a", text: "Захардкодить в Dockerfile" },
        { id: "b", text: "Положить .env в репо" },
        { id: "c", text: "Через environment variables в UI платформы (Railway Variables, Render Secrets)" },
        { id: "d", text: "Отправить в Telegram себе и копировать на сервер вручную" },
      ],
      correctOptionId: "c",
      explanation:
        "Платформы дают UI для secrets. Они автоматически прокидываются в контейнер как env vars. Это безопасно и удобно для ротации.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Что обязательно в production-готовом LLM-приложении? (несколько)",
      options: [
        { id: "a", text: "Health-check endpoint" },
        { id: "b", text: "Логирование ошибок и метрик" },
        { id: "c", text: "Rate limiting (защита от runaway costs)" },
        { id: "d", text: "Budget alerts на API-провайдере" },
        { id: "e", text: "API-ключ в репо для удобства" },
      ],
      correctOptionIds: ["a", "b", "c", "d"],
      explanation:
        "(e) — катастрофа: бот украдёт и сожжёт твой бюджет. Остальные четыре — must-have для prod.",
    },
    {
      id: "q4",
      type: "single-choice",
      question:
        "Какой главный риск, если задеплоить LLM-приложение без rate limiting?",
      options: [
        { id: "a", text: "Медленная работа" },
        { id: "b", text: "Кто-то может зациклить запросы и сжечь весь твой бюджет (десятки/сотни долларов за час)" },
        { id: "c", text: "Сервер упадёт" },
        { id: "d", text: "Юридические проблемы" },
      ],
      correctOptionId: "b",
      explanation:
        "Один пользователь со скриптом за час может сжечь $100+. Защиты: rate limit (slowapi), лимит на user_id, budget alerts.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Что лучше всего рассказать на собесе про твой задеплоенный проект?",
      options: [
        { id: "a", text: "Что использовал самую новую модель" },
        { id: "b", text: "Архитектуру, trade-offs, метрики, что бы улучшил — со ссылкой на живое демо" },
        { id: "c", text: "Сколько строк кода" },
        { id: "d", text: "Сколько фреймворков использовал" },
      ],
      correctOptionId: "b",
      explanation:
        "Структурный рассказ про инженерные решения + живая ссылка = впечатление «он реально умеет». А «использовал GPT-5» само по себе ничего не значит.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Health-check endpoint",
      description:
        "Опиши `HealthStatus` — Pydantic-модель для ответа `/healthz`. Включи: `status`, `version`, `uptime_seconds`, `dependencies` (словарь сервисов → ok/down).",
      starterCode: `from pydantic import BaseModel
from typing import Literal
import time


APP_START = time.time()


class HealthStatus(BaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    version: str
    uptime_seconds: int
    dependencies: dict[str, str]  # {service_name: "ok" | "down"}


def check_health() -> HealthStatus:
    # Проверки: anthropic API, vector DB, etc.
    deps = {
        "anthropic_api": "ok",   # тут реально пингуем
        "vector_db": "ok",
        "redis": "ok",
    }
    all_ok = all(s == "ok" for s in deps.values())
    return HealthStatus(
        status="healthy" if all_ok else "degraded",
        version="1.2.0",
        uptime_seconds=int(time.time() - APP_START),
        dependencies=deps,
    )


import json
status = check_health()
print(json.dumps(status.model_dump(), indent=2))
`,
      solutionCode: `from pydantic import BaseModel
from typing import Literal
import time


APP_START = time.time()


class HealthStatus(BaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    version: str
    uptime_seconds: int
    dependencies: dict[str, str]


def check_health() -> HealthStatus:
    deps = {
        "anthropic_api": "ok",
        "vector_db": "ok",
        "redis": "ok",
    }
    all_ok = all(s == "ok" for s in deps.values())
    return HealthStatus(
        status="healthy" if all_ok else "degraded",
        version="1.2.0",
        uptime_seconds=int(time.time() - APP_START),
        dependencies=deps,
    )


import json
status = check_health()
print(json.dumps(status.model_dump(), indent=2))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Простой rate limiter",
      description:
        "Класс `RateLimiter` — sliding window. Метод `allow(user_id)` возвращает True/False.\n\nЛимит: 10 запросов в 60 секунд на user_id.",
      starterCode: `import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self.user_requests: dict[str, deque] = defaultdict(deque)

    def allow(self, user_id: str) -> bool:
        now = time.time()
        history = self.user_requests[user_id]

        # Удалим старые таймстампы (вышедшие из окна)
        while history and now - history[0] > self.window:
            history.popleft()

        # Допиши: проверь не превышен ли лимит, если нет — добавь и верни True
        pass


# Тест
limiter = RateLimiter(max_requests=3, window_seconds=2)

results = []
for i in range(5):
    ok = limiter.allow("alice")
    results.append(("alice", i, ok))

print("Alice (3 запроса/2с):")
for u, i, ok in results:
    print(f"  Запрос {i+1}: {'✓' if ok else '✗ заблокирован'}")

# Bob — отдельный лимит
print(f"\\nBob: {limiter.allow('bob')}")  # True
print(f"Bob 2: {limiter.allow('bob')}")  # True

# Подождём окно
time.sleep(2.1)
print(f"\\nAlice после 2с: {limiter.allow('alice')}")  # True снова
`,
      solutionCode: `import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self.user_requests: dict[str, deque] = defaultdict(deque)

    def allow(self, user_id: str) -> bool:
        now = time.time()
        history = self.user_requests[user_id]

        while history and now - history[0] > self.window:
            history.popleft()

        if len(history) >= self.max_requests:
            return False

        history.append(now)
        return True


limiter = RateLimiter(max_requests=3, window_seconds=2)

results = []
for i in range(5):
    ok = limiter.allow("alice")
    results.append(("alice", i, ok))

print("Alice (3 запроса/2с):")
for u, i, ok in results:
    print(f"  Запрос {i+1}: {'✓' if ok else '✗ заблокирован'}")

print(f"\\nBob: {limiter.allow('bob')}")
print(f"Bob 2: {limiter.allow('bob')}")

time.sleep(2.1)
print(f"\\nAlice после 2с: {limiter.allow('alice')}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Configuration через env",
      description:
        "Класс `Settings` — Pydantic-модель для конфига приложения. Читает из env vars с fallback на default.",
      starterCode: `from pydantic import Field
from pydantic_settings import BaseSettings  # pip install pydantic-settings


# Если pydantic-settings нет — простая альтернатива через pydantic BaseModel + os.environ
import os
from pydantic import BaseModel


class Settings(BaseModel):
    anthropic_api_key: str
    redis_url: str = "redis://localhost:6379"
    log_level: str = "INFO"
    max_tokens_per_request: int = 2048
    rate_limit_per_minute: int = 30

    @classmethod
    def from_env(cls):
        return cls(
            anthropic_api_key=os.environ.get("ANTHROPIC_API_KEY", ""),
            redis_url=os.environ.get("REDIS_URL", "redis://localhost:6379"),
            log_level=os.environ.get("LOG_LEVEL", "INFO"),
            max_tokens_per_request=int(os.environ.get("MAX_TOKENS_PER_REQUEST", "2048")),
            rate_limit_per_minute=int(os.environ.get("RATE_LIMIT_PER_MINUTE", "30")),
        )


# Имитируем env
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-test"
os.environ["LOG_LEVEL"] = "DEBUG"

settings = Settings.from_env()
print(settings)

# Валидация — если ключа нет
del os.environ["ANTHROPIC_API_KEY"]
try:
    s = Settings.from_env()
    if not s.anthropic_api_key:
        print("\\n⚠️  ANTHROPIC_API_KEY не задан!")
except Exception as e:
    print(f"\\nERROR: {e}")
`,
      solutionCode: `import os
from pydantic import BaseModel


class Settings(BaseModel):
    anthropic_api_key: str
    redis_url: str = "redis://localhost:6379"
    log_level: str = "INFO"
    max_tokens_per_request: int = 2048
    rate_limit_per_minute: int = 30

    @classmethod
    def from_env(cls):
        return cls(
            anthropic_api_key=os.environ.get("ANTHROPIC_API_KEY", ""),
            redis_url=os.environ.get("REDIS_URL", "redis://localhost:6379"),
            log_level=os.environ.get("LOG_LEVEL", "INFO"),
            max_tokens_per_request=int(os.environ.get("MAX_TOKENS_PER_REQUEST", "2048")),
            rate_limit_per_minute=int(os.environ.get("RATE_LIMIT_PER_MINUTE", "30")),
        )


os.environ["ANTHROPIC_API_KEY"] = "sk-ant-test"
os.environ["LOG_LEVEL"] = "DEBUG"

settings = Settings.from_env()
print(settings)

del os.environ["ANTHROPIC_API_KEY"]
try:
    s = Settings.from_env()
    if not s.anthropic_api_key:
        print("\\n⚠️  ANTHROPIC_API_KEY не задан!")
except Exception as e:
    print(f"\\nERROR: {e}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Портфолио-проект #3 — задеплоить!",
      description:
        "Это финальный портфолио-проект на 6-8 часов работы.\n\n**План:**\n\n1. **Выбери проект** (вариант A/B/C из теории или свой)\n2. **Backend**: FastAPI + Pydantic + кеш + логирование + rate limit (всё из недель 17-19)\n3. **UI**: Streamlit или Gradio (несколько часов)\n4. **Dockerize**: Dockerfile + docker-compose (из недели 18)\n5. **GitHub repo** с подробным README\n6. **Деплой на Railway / Render / Streamlit Cloud**\n7. **Health-check** + budget alerts в Anthropic Console\n8. **Тест в проде** — проверь работает с разных устройств\n9. **README** обнови: ссылка на демо, скриншоты, архитектура, метрики\n10. **Пост**: «Задеплоил свой третий AI-проект. Стек: FastAPI + Claude + Chroma + Docker, деплой на Railway. Ссылка: ...»\n\nЭто **очень важный** момент в твоём пути — у тебя теперь 3 готовых, видимых проекта.",
      starterCode: `# Скелет proj/api.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
import time, os
from loguru import logger

logger.add("app.log", serialize=True, rotation="50 MB")

APP_START = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("startup")
    yield
    logger.info("shutdown")


app = FastAPI(
    title="My AI Project",
    description="...",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/healthz")
def healthz():
    return {
        "status": "healthy",
        "uptime": int(time.time() - APP_START),
    }


# Твой основной endpoint
class Request(BaseModel):
    text: str = Field(..., min_length=10, max_length=10000)


class Response(BaseModel):
    result: str
    cost: float


@app.post("/process", response_model=Response)
async def process(req: Request):
    # 1. Rate limit (через slowapi)
    # 2. Cache check
    # 3. LLM call
    # 4. Log metrics
    # 5. Return
    ...

# Dockerfile (см. неделю 18)

# Railway:
# 1. railway.app → New Project → Deploy from GitHub
# 2. Settings → Variables → ANTHROPIC_API_KEY
# 3. Settings → Networking → Generate Domain
# 4. Готово! https://my-app.up.railway.app
`,
      language: "python",
      runnable: false,
      hints: [
        "Не пытайся сделать «всё идеально» — сделай core-функционал, задеплой, потом улучшай. Главное — живая ссылка.",
        "Защити budget: в Anthropic Console установи hard cap например $20/мес — даже если что-то пойдёт не так, не разорит.",
      ],
    },
  ],
  checkpoint: [
    "Зарегистрирован на Railway / Render / Streamlit Cloud",
    "Третий портфолио-проект собран и работает локально",
    "Образ в Docker, без секретов в репо",
    "Задеплоен — есть **публичная ссылка**",
    "Настроены budget alerts на Anthropic Console",
    "README со ссылкой на демо, скриншотами, архитектурой",
    "Опубликован пост — у тебя теперь 3 живых AI-проекта",
  ],
};
