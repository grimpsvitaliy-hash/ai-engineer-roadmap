import type { Lesson } from "../types";

export const week23: Lesson = {
  id: "m6-w23",
  monthId: "month-06",
  weekNumber: 23,
  title: "Резюме, GitHub, LinkedIn",
  goal: "У тебя есть резюме на 1 страницу на английском, чистый GitHub-профиль с 3 закреплёнными проектами, актуальный LinkedIn.",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "resume-structure",
      title: "Резюме AI Engineer junior",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "Правила",
          content:
            "✅ Одна страница, не больше.\n✅ На английском (даже для российских вакансий — выглядит профессионально).\n✅ ATS-friendly формат (PDF, обычный текст без сложной вёрстки).\n❌ Без фотки.\n❌ Без шкалы «уровень владения Python: ▰▰▰▰▱».\n❌ Без личных данных (адрес, дата рождения).",
        },
        {
          type: "code",
          language: "markdown",
          content: `# Ivan Petrov
**AI Engineer — LLM Applications, Python**
ivan@example.com · github.com/ivan · linkedin.com/in/ivan · Remote

## Summary
AI Engineer focused on building LLM-powered applications. Recent transition
from 1C development. Hands-on with Anthropic Claude API, RAG systems,
agent design. Looking for junior/middle Applied AI Engineer roles.

## Skills
**Languages**: Python (intermediate), TypeScript (basic), SQL
**AI/LLM**: Anthropic Claude API, OpenAI API, prompt engineering, tool use,
agent design, RAG (Chroma, Qdrant), evals
**Backend**: FastAPI, Pydantic, async Python, Docker, REST APIs
**Tools**: Git, Linux, PostgreSQL, Redis
**English**: B2 (Cambridge FCE)

## Projects

### Research Assistant — AI agent for topic research
[github.com/ivan/research-assistant](https://...) · [live demo](https://...)
Autonomous agent that searches web, fetches pages, summarizes findings.
- Implemented agent loop with tool use (search/fetch/notes) without LangChain
- Evals on 30 research queries: 87% completion rate, $0.04 avg cost
- Stack: Python, Anthropic Claude, Tavily API, FastAPI

### RAG Assistant — semantic search over documentation
[github.com/ivan/rag-assistant](https://...) · [live demo](https://...)
RAG system answering questions over technical docs with source citations.
- Improved retrieval Recall@5 from 67% to 84% via hybrid search + reranking
- Latency p50: 1.8s, cost $0.004/query
- Stack: Python, Chroma, Voyage embeddings, Claude Sonnet, Streamlit

### AI Code Reviewer — automated PR review
[github.com/ivan/code-reviewer](https://...) · [live demo](https://...)
Service that analyzes GitHub PRs and posts inline comments with suggestions.
- Streaming responses, prompt caching for 60% cost reduction
- Deployed on Railway with rate limiting and budget alerts
- Stack: FastAPI, Docker, Claude Sonnet, GitHub API

## Experience
**Junior Developer** · ACME Corp · Jan 2024 — Present
1C:Enterprise development for retail clients. Migrated 3 modules to web-based UI.

## Education
Bachelor in Computer Science · University X · 2020`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Ключевой принцип проектов",
          content:
            "Каждый проект — **3-4 строки** максимум. Что делает (1 строка). **Цифровое достижение** (1 строка). Стек (1 строка). Никакой воды.",
        },
      ],
    },
    {
      id: "github-profile",
      title: "GitHub-профиль",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Что HR видит первым:**\n\n- Аватарка (поставь нормальное фото или нейтральный аватар, не аниме)\n- Bio (1 строка): «AI Engineer · LLM, RAG, Python · Open to work»\n- Закреплённые (pinned) репозитории — **3-4 портфолио-проекта**, не больше",
        },
        {
          type: "text",
          content:
            "**README профиля** — создай репозиторий с именем = твой username, добавь README. Он отображается на главной профиля.",
        },
        {
          type: "code",
          language: "markdown",
          content: `# Hi, I'm Ivan 👋

**AI Engineer** focused on building applications with LLMs.
Currently transitioning from 1C development to Applied AI roles.

## What I do
- Build LLM-powered apps with Claude / OpenAI APIs
- Design RAG systems and agents
- Care about evals, cost optimization, production observability

## Featured projects
- 🔍 [research-assistant](https://...) — autonomous research agent
- 📚 [rag-assistant](https://...) — semantic search over docs
- 🤖 [code-reviewer](https://...) — AI PR review service

## Currently learning
- Production-grade agent orchestration (LangGraph)
- Distributed systems for LLM inference

## Reach out
📧 ivan@example.com · 💼 [LinkedIn](https://...)`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Уберите шум",
          content:
            "Заархивируй или удали мёртвые/учебные репозитории (`hello-world`, `todo-app-v2`, `learning-python`). Они создают впечатление «начал — забросил». Лучше 4 чистых, чем 20 пёстрых.",
        },
      ],
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Headline** (под именем): `AI Engineer | LLM Applications | Python · Open to junior/middle roles`\n\n**About** — 3-4 параграфа: бэкграунд → переход в AI → что сейчас делаешь → что ищешь.\n\n**Projects** — добавь все 3 портфолио-проекта со ссылками.\n\n**Skills** — топ-15: Python, FastAPI, Docker, Anthropic Claude API, OpenAI API, RAG, Chroma, LangChain, Prompt Engineering, Async Python, REST APIs, Git, SQL, English (B2), Pydantic.\n\n**Open to Work** — включи (можно только для рекрутёров, чтобы коллеги не видели).",
        },
      ],
    },
    {
      id: "portfolio-site",
      title: "Портфолио-сайт (опционально)",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "Сайт — приятный бонус, не обязателен. Если решишь делать:\n\n- Простая статичная страница\n- Шаблоны: https://github.com/topics/portfolio-template\n- Хостинг: GitHub Pages, Vercel, Netlify (бесплатно)\n- Контент: краткое о себе + 3 проекта (как в LinkedIn, но красиво)\n- Можно использовать твой же Next.js (т.е. это AI-engineer-app) и добавить страницу /about",
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
              title: "Rezi — ATS-оптимизированный конструктор резюме",
              url: "https://www.rezi.ai/",
              description: "Бесплатный, проверяет на ATS-совместимость.",
            },
            {
              title: "FlowCV",
              url: "https://flowcv.com/",
              description: "Drag-and-drop конструктор, выглядит профессионально.",
            },
            {
              title: "Awesome Resume",
              url: "https://github.com/posquit0/Awesome-CV",
              description: "LaTeX-шаблоны если хочешь идеальную вёрстку.",
            },
            {
              title: "LinkedIn Headline examples",
              url: "https://www.linkedin.com/jobs/career-advice/build-a-headline",
              description: "Идеи формулировок для headline.",
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
          emoji: "👀",
          title: "Резюме читают 7 секунд",
          content:
            "Исследование Ladders (2018) с eye-tracking показало: рекрутёр тратит на резюме **в среднем 7.4 секунды**. За это время глаз сканирует: имя → должность → последний работодатель → достижения. Если в этих местах нет «зацепки» — резюме в отказ. Поэтому **первый экран = всё**. Образование, языки, hobbies — это для второго прохода, если он будет.",
        },
        {
          type: "funfact",
          emoji: "🚪",
          title: "Octocat — талисман GitHub",
          content:
            "Логотип GitHub — это **Octocat**, наполовину кот, наполовину осьминог. Его придумала **Cameron McEfee** в 2008 году. К 2014 году было нарисовано **более 200 уникальных Octocat-вариаций** (рыцарь, ниндзя, повар, доктор и т.д.). У них даже есть [галерея](https://octodex.github.com/). Когда GitHub был куплен Microsoft за $7.5B в 2018, Octocat выжил — Microsoft не стал убивать культовый бренд.",
        },
        {
          type: "funfact",
          emoji: "🏆",
          title: "Open Source — лучшее портфолио",
          content:
            "В 2023 году рекрутёры в AI-сфере признались (опрос State of AI Engineering): **GitHub профиль кандидата ценится выше резюме** на 40% случаев. Несколько хороших PR в популярных репозиториях (LangChain, Hugging Face, Anthropic Cookbook) **сильнее** чем 3 года в неизвестной компании. Если ищешь работу — потрать неделю на 2-3 PR в реальный AI-проект.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Какая длина у нормального резюме junior AI Engineer?",
      options: [
        { id: "a", text: "1 страница" },
        { id: "b", text: "2-3 страницы" },
        { id: "c", text: "Не важно" },
        { id: "d", text: "Чем длиннее, тем серьёзнее" },
      ],
      correctOptionId: "a",
      explanation:
        "Junior = одна страница, всегда. Рекрутёр тратит на резюме 6-15 секунд. Длинное — пролистает.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Что НЕ должно быть в современном tech-резюме? (несколько)",
      options: [
        { id: "a", text: "Фотография" },
        { id: "b", text: "Шкалы «уровень владения Python ▰▰▰▰▱»" },
        { id: "c", text: "Дата рождения, адрес проживания" },
        { id: "d", text: "Контакты email + GitHub + LinkedIn" },
        { id: "e", text: "Ссылки на портфолио-проекты" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Фото — не нужно (даже минус для anti-bias в международных компаниях). Шкалы — детский сад. ЛИЧНЫЕ данные — лишнее, не нужны.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Как описать проект в резюме лучше всего?",
      options: [
        { id: "a", text: "Список всех использованных технологий на пол-страницы" },
        { id: "b", text: "Что делает + цифровое достижение + стек, всё в 3-4 строки" },
        { id: "c", text: "Хвалить себя без цифр" },
        { id: "d", text: "Цитировать комментарии пользователей" },
      ],
      correctOptionId: "b",
      explanation:
        "Структура: 1) название + ссылки, 2) что делает в 1 предложении, 3) ИЗМЕРИМОЕ достижение, 4) стек. Никакой воды.",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Что делать с мёртвыми/учебными репозиториями на GitHub?",
      options: [
        { id: "a", text: "Оставить — больше репо лучше" },
        { id: "b", text: "Заархивировать или удалить — чистый профиль производит лучшее впечатление" },
        { id: "c", text: "Сделать приватными — но они исчезнут из счётчика" },
        { id: "d", text: "Назвать их fork-ами популярных проектов" },
      ],
      correctOptionId: "b",
      explanation:
        "20 репо «начал-забросил» хуже чем 4 чистых. Лучше архив или удалить. Закрепи (pin) 3-4 главных.",
    },
    {
      id: "q5",
      type: "text-input",
      question:
        "В GitHub есть специальный репозиторий, README которого отображается на главной твоего профиля. Как он называется?\n\nВведи только имя (без user/).",
      correctAnswers: ["твой username", "username"],
      caseSensitive: false,
      explanation:
        "Создаёшь репозиторий с именем = твой username (например `ivan/ivan`), в нём `README.md` — он автоматически появится на главной твоего профиля.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Чек-лист резюме",
      description:
        "Прогон твоего резюме по чек-листу. Открой свой draft и проверь.",
      starterCode: `RESUME_CHECKLIST = [
    "Одна страница",
    "На английском",
    "Контакты: email + GitHub + LinkedIn",
    "Headline под именем: 'AI Engineer | LLM | Python'",
    "Summary 2-3 строки про переход в AI",
    "Секция Skills с конкретными технологиями (Claude API, RAG, FastAPI и т.д.)",
    "3 проекта, каждый: название + ссылка + 1 строка что делает + 1 строка с цифрами + стек",
    "Опыт работы (если релевантный)",
    "Образование (1-2 строки в конце)",
    "Уровень English",
    "НЕТ фотографии",
    "НЕТ шкал владения",
    "НЕТ дата рождения / адрес",
    "PDF без сложной вёрстки (ATS-friendly)",
]


def check(my_status: list[bool]):
    done = sum(my_status)
    total = len(RESUME_CHECKLIST)
    print(f"=== Resume score: {done}/{total} ({done/total*100:.0f}%) ===\\n")
    for item, ok in zip(RESUME_CHECKLIST, my_status):
        mark = "✓" if ok else "✗"
        print(f"  [{mark}] {item}")


# Заполни честно
my_status = [True, True, True, False, False, True, True, True, True, True, True, True, True, False]

check(my_status)
`,
      solutionCode: `RESUME_CHECKLIST = [
    "Одна страница",
    "На английском",
    "Контакты: email + GitHub + LinkedIn",
    "Headline под именем: 'AI Engineer | LLM | Python'",
    "Summary 2-3 строки про переход в AI",
    "Секция Skills с конкретными технологиями",
    "3 проекта, каждый: название + ссылка + 1 строка что делает + 1 строка с цифрами + стек",
    "Опыт работы (если релевантный)",
    "Образование (1-2 строки в конце)",
    "Уровень English",
    "НЕТ фотографии",
    "НЕТ шкал владения",
    "НЕТ дата рождения / адрес",
    "PDF без сложной вёрстки (ATS-friendly)",
]


def check(my_status: list[bool]):
    done = sum(my_status)
    total = len(RESUME_CHECKLIST)
    print(f"=== Resume score: {done}/{total} ({done/total*100:.0f}%) ===\\n")
    for item, ok in zip(RESUME_CHECKLIST, my_status):
        mark = "✓" if ok else "✗"
        print(f"  [{mark}] {item}")


my_status = [True, True, True, False, False, True, True, True, True, True, True, True, True, False]
check(my_status)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "ЛОКАЛЬНО: написать всё",
      description:
        "Тратишь неделю на 4 задачи:\n\n1. **Резюме на английском** — 1 страница, PDF, по шаблону из теории. Прогон через ATS-checker.\n2. **GitHub profile README** — создай `username/username` репозиторий с README, заархивируй старые репо, закрепи 3-4 главных проекта.\n3. **LinkedIn** — обнови Headline, About, Projects (с ссылками), Skills. Включи Open to Work.\n4. **Опционально**: запусти портфолио-сайт через GitHub Pages / Vercel.\n\n**Самопроверка**: попроси друга / Claude посмотреть на твой LinkedIn и GitHub. Что бросается в глаза? Что непонятно?",
      starterCode: `# Эта задача — внешняя. Ничего runnable.
# Когда сделаешь — отметь как сделанную.

todo = """
[ ] Резюме на английском, 1 страница, PDF — готово
[ ] Прогнал резюме через https://www.rezi.ai/ — score > 80
[ ] GitHub profile README создан
[ ] Заархивировал мёртвые репо
[ ] Закрепил 3-4 главных проекта (Pin Featured)
[ ] LinkedIn Headline обновлён
[ ] LinkedIn About — 3 параграфа
[ ] LinkedIn Projects — добавлены все портфолио
[ ] LinkedIn Open to Work — включено
[ ] Скинул резюме другу / коллеге на ревью
"""
print(todo)
`,
      language: "python",
      runnable: false,
    },
  ],
  checkpoint: [
    "Резюме на 1 страницу на английском, PDF",
    "GitHub-профиль выглядит чисто и профессионально",
    "Pinned — 3-4 главных проекта",
    "LinkedIn полностью обновлён",
    "Open to Work включён",
    "Опционально — портфолио-сайт",
  ],
};
