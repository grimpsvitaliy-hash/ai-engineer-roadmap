import type { Lesson } from "../types";

export const week22: Lesson = {
  id: "m6-w22",
  monthId: "month-06",
  weekNumber: 22,
  title: "Полировка одного проекта до wow-уровня",
  goal: "Выбираешь один из 3 портфолио-проектов и доводишь его до состояния «гордости». Это твой главный talking point на интервью.",
  estimatedHours: "8-10 ч",
  theory: [
    {
      id: "why-one",
      title: "Почему один отличный, а не три средних",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "Реальность собеседований",
          content:
            "Тебя будут спрашивать про **один** проект 30+ минут. Глубокий разбор архитектуры, решений, trade-offs. «Я сделал 10 проектов» — менее впечатляюще чем «вот мой главный проект, я могу рассказывать про него час».",
        },
      ],
    },
    {
      id: "what-to-improve",
      title: "Что улучшать",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**Технические улучшения (выбери что больше всего повлияет):**\n\n- 🎯 **Эвалы с цифрами** — если их нет, добавь. Если есть — улучши датасет, добавь LLM-as-judge\n- 🚀 **Streaming** — если ещё не стримит, добавь (+UX)\n- 💰 **Caching** (prompt caching + client-side) — снижение цены\n- 📊 **Observability** — логирование с метриками, опционально Langfuse\n- 🔒 **Rate limiting** + лимиты на пользователя\n- ⚙️ **Тесты** — pytest для критических функций (даже 5-10 тестов сильно повышают доверие)",
        },
        {
          type: "text",
          content:
            "**UX/Documentation:**\n\n- 🎨 **UI** — Streamlit/Gradio до wow-уровня, тёмная тема, мобильная адаптация\n- 📹 **Loom-демо** на 2-3 минуты — встроить в README\n- 📐 **Архитектурная диаграмма** в Excalidraw / Mermaid\n- 📝 **README** на английском, разделы: что/зачем/как/trade-offs/что бы улучшил\n- 🏷️ **Скриншоты** ключевых экранов\n- 💡 **Design decisions** — раздел почему выбрал X, а не Y",
        },
      ],
    },
    {
      id: "code-quality",
      title: "Чистота кода",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "code",
          language: "bash",
          content: `# Установи и прогони:
pip install ruff
ruff check . --fix
ruff format .

# Type hints
pip install mypy
mypy main.py  # должен пройти без ошибок

# Тесты
pip install pytest pytest-asyncio
pytest -v`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Что искать в своём коде",
          content:
            "✅ Type hints у всех публичных функций.\n✅ Docstrings у нетривиальных функций.\n✅ Нет magic numbers — выноси в константы.\n✅ Нет огромных функций — разбивай на 20-50 строк.\n✅ `if __name__ == '__main__'` есть у точек входа.\n✅ Логирование вместо `print`.",
        },
      ],
    },
    {
      id: "readme-template",
      title: "README — шаблон",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "code",
          language: "markdown",
          content: `# My LLM Project

> One-sentence pitch: what it does and why anyone cares.

[🔗 Live demo](https://your-app.up.railway.app) · [📹 Video](https://loom.com/xxx)

![screenshot](docs/screenshot.png)

## What it does

Объяснение в 2-3 параграфах. Что делает, для кого, какую проблему решает.

## How it works

Архитектурная диаграмма (Mermaid или PNG из Excalidraw).

\`\`\`mermaid
graph LR
    A[User] --> B[FastAPI]
    B --> C[RAG retriever]
    C --> D[Chroma Vector DB]
    B --> E[Claude API]
\`\`\`

Объяснение каждого компонента.

## Tech stack

- **LLM**: Claude Sonnet 4.6 (via Anthropic API)
- **Backend**: FastAPI + Pydantic + AsyncAnthropic
- **Vector DB**: Chroma
- **Embeddings**: Voyage AI \`voyage-3-lite\`
- **Frontend**: Streamlit
- **Deploy**: Railway + Docker

## Metrics

| Metric | Baseline | After improvements |
|--------|----------|-------------------|
| Recall@5 | 67% | **84%** |
| Latency p50 | 3.2s | **1.8s** |
| Cost per query | $0.012 | **$0.004** |

Eval dataset: 50 questions, see [\`evals/dataset.jsonl\`](evals/dataset.jsonl).

## Design decisions

- **Why Chroma not Pinecone**: embedded, no separate service, perfect for solo project.
- **Why hybrid search**: pure semantic missed exact term matches (error codes).
- **Why streaming**: improves perceived latency 3-5x.

## What I'd improve

- Add user authentication (currently single-user demo)
- Switch from in-memory cache to Redis for multi-instance deploy
- Implement contextual retrieval (Anthropic) for +10% recall
- Migrate to Qdrant for production-grade vector DB

## Run locally

\`\`\`bash
git clone ...
cd ...
cp .env.example .env  # add your ANTHROPIC_API_KEY
docker compose up
\`\`\`

Open http://localhost:8000

## License

MIT`,
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
              title: "Excalidraw",
              url: "https://excalidraw.com/",
              description: "Архитектурные диаграммы вручную, выглядят как от профессионала.",
            },
            {
              title: "Mermaid Live Editor",
              url: "https://mermaid.live/",
              description: "Диаграммы как код. Идёт в GitHub markdown нативно.",
            },
            {
              title: "Loom",
              url: "https://loom.com/",
              description: "Запись 2-3 минутного демо. Бесплатно для пет-проектов.",
            },
            {
              title: "ruff",
              url: "https://docs.astral.sh/ruff/",
              description: "Современный быстрый линтер/форматтер для Python.",
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
          emoji: "🎯",
          title: "Done is better than perfect",
          content:
            "Цитата приписывается Шерил Сэндберг (COO Facebook): **«Done is better than perfect»**. В Meta это даже висело в офисах. Идея: **законченный неидеальный проект** > бесконечно дорабатываемого идеала. Особенно в портфолио — лучше задеплоить «достаточно хорошо», чем 6 месяцев полировать в локалке. Воркфлоу-героев индустрии (Linus Torvalds, DHH) тоже **по сути про это**.",
        },
        {
          type: "funfact",
          emoji: "⏰",
          title: "Закон Хофштадтера",
          content:
            "**«Любая задача занимает больше времени, чем планировалось, даже с учётом этого закона»** — Закон Хофштадтера. Применяется к ВСЕМУ. Когда ты думаешь «закончу проект за выходные» — это будет неделя. Думаешь неделя — будет месяц. Опытные инженеры умножают свою оценку на **2-3x**, и всё равно ошибаются. Поэтому планировать буферы — это не лень, а инженерия.",
        },
        {
          type: "funfact",
          emoji: "💎",
          title: "Loom — открытие про деманды",
          content:
            "Loom (видеосообщения) запустили в 2016. Первая сотня клиентов появилась случайно — основатели расшарили видео-демо в Twitter, и **тысячи людей** просили доступ к их «магическому инструменту записи». В 2023 Atlassian купил Loom за **$975 миллионов**. Урок: иногда лучшая презентация — это **показ продукта в действии**, а не его описание. Поэтому видео-демо в README это сильно.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Почему лучше **один** идеальный проект, а не **три** средних?",
      options: [
        { id: "a", text: "Меньше работы" },
        { id: "b", text: "На собесе ты будешь рассказывать про один проект 30+ минут — он должен впечатлять" },
        { id: "c", text: "Это требование GitHub" },
        { id: "d", text: "Так быстрее проходишь все туториалы" },
      ],
      correctOptionId: "b",
      explanation:
        "Интервьюер копает в детали одного проекта. Глубина > ширина. «Я могу час рассказывать про X» сильнее чем «у меня 10 проектов».",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Что должно быть в README портфолио-проекта? (несколько)",
      options: [
        { id: "a", text: "Ссылка на живое демо" },
        { id: "b", text: "Архитектурная диаграмма" },
        { id: "c", text: "Метрики «до/после» в таблице" },
        { id: "d", text: "Раздел «design decisions» — почему так, а не иначе" },
        { id: "e", text: "Раздел «what I'd improve»" },
      ],
      correctOptionIds: ["a", "b", "c", "d", "e"],
      explanation:
        "Всё пять — то, что делает README профессиональным. Особенно «design decisions» и «what I'd improve» — они показывают зрелость инженера.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Зачем добавлять Loom-видео в README?",
      options: [
        { id: "a", text: "Чтобы было модно" },
        { id: "b", text: "Рекрутёр не будет клонировать репо и запускать; видео — самый быстрый способ показать продукт" },
        { id: "c", text: "Это требование Loom" },
        { id: "d", text: "Это бесполезно" },
      ],
      correctOptionId: "b",
      explanation:
        "На рекрутёра у тебя ~30 секунд внимания. Видео-демо за 2 минуты показывает всё что текстом не передашь.",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Какой пункт в README покажет инженерную зрелость даже у джуна?",
      options: [
        { id: "a", text: "Список всех использованных пакетов" },
        { id: "b", text: "Раздел «Что бы улучшил в будущем» — анализ trade-offs и ограничений" },
        { id: "c", text: "Дата создания проекта" },
        { id: "d", text: "Скриншот терминала" },
      ],
      correctOptionId: "b",
      explanation:
        "«Я знаю, что мой проект не идеален, вот что бы я сделал дальше» — это речь senior. Джуны обычно либо не видят недостатков, либо стесняются их.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Чек-лист зрелости проекта",
      description:
        "Запусти этот чек-лист на своём главном проекте — отметь что есть, чего нет.\n\nЦель — после доработки иметь 18+ из 22.",
      starterCode: `CHECKLIST = {
    "code_quality": [
        "Type hints у публичных функций",
        "Docstrings у нетривиальных функций",
        "Логирование вместо print",
        "Нет magic numbers — все вынесены в константы",
        "Прошёл ruff check без ошибок",
    ],
    "tests": [
        "Есть pytest-тесты на критические функции (минимум 5)",
        "Eval-датасет минимум 20 примеров",
        "В CI прогоняются тесты при push",
    ],
    "production": [
        "Health-check endpoint",
        "Rate limiting",
        "Логирование запросов с метриками",
        "Caching (prompt-cache или client-cache)",
        "Обработка типичных API-ошибок (Auth, RateLimit)",
        "Конфиг через env vars (не хардкод)",
        "Dockerfile + .dockerignore",
        "Задеплоено с публичной ссылкой",
    ],
    "documentation": [
        "README на английском, > 200 слов",
        "Архитектурная диаграмма",
        "Таблица метрик baseline → after",
        "Раздел design decisions",
        "Раздел what I'd improve",
        "2-3 минутное Loom-видео",
    ],
}


def report(my_status: dict[str, list[bool]]):
    total = sum(len(items) for items in CHECKLIST.values())
    done = sum(sum(s) for s in my_status.values())

    print(f"=== Maturity Score: {done}/{total} ({done/total*100:.0f}%) ===\\n")

    for category, items in CHECKLIST.items():
        statuses = my_status.get(category, [False] * len(items))
        cat_done = sum(statuses)
        print(f"--- {category} ({cat_done}/{len(items)}) ---")
        for item, ok in zip(items, statuses):
            mark = "✓" if ok else "✗"
            print(f"  [{mark}] {item}")
        print()


# Заполни честно для своего проекта (True/False)
my_status = {
    "code_quality": [True, False, True, False, False],
    "tests": [False, True, False],
    "production": [True, False, True, False, True, True, True, False],
    "documentation": [True, False, False, False, False, False],
}

report(my_status)

# После доработок — обнови статусы и прогоняй заново
`,
      solutionCode: `CHECKLIST = {
    "code_quality": [
        "Type hints у публичных функций",
        "Docstrings у нетривиальных функций",
        "Логирование вместо print",
        "Нет magic numbers — все вынесены в константы",
        "Прошёл ruff check без ошибок",
    ],
    "tests": [
        "Есть pytest-тесты на критические функции (минимум 5)",
        "Eval-датасет минимум 20 примеров",
        "В CI прогоняются тесты при push",
    ],
    "production": [
        "Health-check endpoint",
        "Rate limiting",
        "Логирование запросов с метриками",
        "Caching (prompt-cache или client-cache)",
        "Обработка типичных API-ошибок (Auth, RateLimit)",
        "Конфиг через env vars (не хардкод)",
        "Dockerfile + .dockerignore",
        "Задеплоено с публичной ссылкой",
    ],
    "documentation": [
        "README на английском, > 200 слов",
        "Архитектурная диаграмма",
        "Таблица метрик baseline → after",
        "Раздел design decisions",
        "Раздел what I'd improve",
        "2-3 минутное Loom-видео",
    ],
}


def report(my_status: dict[str, list[bool]]):
    total = sum(len(items) for items in CHECKLIST.values())
    done = sum(sum(s) for s in my_status.values())

    print(f"=== Maturity Score: {done}/{total} ({done/total*100:.0f}%) ===\\n")

    for category, items in CHECKLIST.items():
        statuses = my_status.get(category, [False] * len(items))
        cat_done = sum(statuses)
        print(f"--- {category} ({cat_done}/{len(items)}) ---")
        for item, ok in zip(items, statuses):
            mark = "✓" if ok else "✗"
            print(f"  [{mark}] {item}")
        print()


my_status = {
    "code_quality": [True, False, True, False, False],
    "tests": [False, True, False],
    "production": [True, False, True, False, True, True, True, False],
    "documentation": [True, False, False, False, False, False],
}

report(my_status)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "ЛОКАЛЬНО: довести проект до wow",
      description:
        "Возьми **один** из трёх портфолио-проектов и потрать неделю на доведение его до wow-уровня по чек-листу из практики 1.\n\nЦель: 18+ из 22 пунктов.\n\nКонкретные шаги:\n\n1. Pытнись прогнать `ruff check . --fix` — исправит большинство стилистики\n2. Если нет тестов — напиши хотя бы 5 unit-тестов на критические функции\n3. Если нет эвалов — собери датасет из 20 вопросов с эталонными ответами\n4. Перепиши README по шаблону из теории\n5. Нарисуй архитектурную диаграмму в Excalidraw или Mermaid\n6. Запиши Loom-демо 2-3 минуты — встрой ссылку в README\n7. Сделай красивые скриншоты, положи в `docs/`\n8. Опубликуй **глубокий технический пост** про проект (LinkedIn / dev.to / Хабр)",
      starterCode: `# Эта задача — на работу с проектом, не код тут писать.
# Когда закончишь полировку — поставь галочку.
print("Прошёл по чек-листу из практики 1, обновил статусы — отметь как сделанную.")
`,
      language: "python",
      runnable: false,
    },
  ],
  checkpoint: [
    "Один из проектов доведён до 18+/22 по чек-листу зрелости",
    "README переписан по профессиональному шаблону",
    "Архитектурная диаграмма создана",
    "Записано Loom-видео и встроено в README",
    "Опубликован глубокий технический пост о проекте",
    "Готов рассказывать про этот проект 30+ минут — он твой главный talking point",
  ],
};
