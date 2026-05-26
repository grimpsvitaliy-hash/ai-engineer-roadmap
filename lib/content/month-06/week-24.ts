import type { Lesson } from "../types";

export const week24: Lesson = {
  id: "m6-w24",
  monthId: "month-06",
  weekNumber: 24,
  title: "Поиск работы — стратегия",
  goal: "Активно подаёшь резюме. К концу недели — минимум 30 откликов в таблице, первые ответы.",
  estimatedHours: "8 ч (потом продолжаешь параллельно)",
  theory: [
    {
      id: "where",
      title: "Где искать вакансии",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Россия / СНГ:**\n\n- **hh.ru** — основной\n- **Хабр Карьера**\n- **Geekjob.ru**\n- **Telegram-каналы**: @forallengineers, @aijobsme, @ml_jobs, @hr_data, @MLvacancies\n- **Чаты вакансий** в Telegram (поиск «AI engineer вакансии»)",
        },
        {
          type: "text",
          content:
            "**Международные:**\n\n- **LinkedIn Jobs** — включи job alerts по `AI Engineer`, `LLM Engineer`, `Prompt Engineer`, `ML Engineer`\n- **https://aijobs.net/** — специализированная биржа\n- **https://wellfound.com/** — стартапы (бывший AngelList)\n- **https://workatastartup.com/** — Y Combinator стартапы\n- **https://www.ycombinator.com/jobs**\n- **Twitter/X** — много стартапов постят «we're hiring AI engineer» в треды\n- **GitHub Jobs** в issues популярных AI-репозиториев",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Скрытый канал — outreach",
          content:
            "**Cold outreach** в LinkedIn компаниям, у которых нет открытой вакансии — работает удивительно часто в AI-сфере. Многие стартапы готовы нанимать «когда находят правильного человека», без формального процесса.",
        },
      ],
    },
    {
      id: "strategy",
      title: "Стратегия подачи",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Правило 80/20:**\n\n- **80% массовые отклики** — 15-30 в день, типовое сопроводительное письмо\n- **20% точечные** — 3-5 в неделю, персонализированный кавер на интересные позиции",
        },
        {
          type: "text",
          content:
            "**Воронка реалистичных конверсий:**",
        },
        {
          type: "code",
          language: "text",
          content: `100 откликов
   ↓ (10% ответят)
10 ответов
   ↓ (70% — скрининг, 30% — отказ)
7 скринингов
   ↓ (50% — техническое)
3-4 технических интервью
   ↓ (30% — финал)
1 финальное
   ↓ (50% — оффер)
~1 оффер

→ нужно ~100 откликов для одного оффера на старте.
   Дальше воронка улучшается по мере опыта.`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Не отчаивайся",
          content:
            "Многие тратят 8-12 месяцев. Это нормально. Главное — **система**: каждый день 10-20 откликов, каждое интервью разбирай, фиксируй фидбек.",
        },
      ],
    },
    {
      id: "cover-letter",
      title: "Cover letter — 3 абзаца",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "code",
          language: "text",
          content: `Subject: Application — AI Engineer (job ID: 1234)

Hi [name or "team"],

I'm applying for the AI Engineer position at [Company]. I'm transitioning
from 5 years of backend development into Applied AI, focusing on LLM
applications and RAG systems.

What caught my attention about [Company]: [конкретное — продукт, статья,
основатель, что-то ваше]. I'd love to contribute to [конкретный аспект].

Relevant work in my portfolio:
- Research Assistant (autonomous agent with tool use): [link]
- RAG over technical docs (improved Recall@5 from 67% to 84%): [link]
- Production deployment with FastAPI + Docker on Railway: [link]

Resume attached. Happy to discuss any of these in detail.

Best,
Ivan
[email] · [LinkedIn] · [GitHub]`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Что НЕ работает",
          content:
            "❌ «Я страстный и трудолюбивый» — пусто.\n❌ «У вас классная компания» — без конкретики не верят.\n❌ Длинная история жизни — никто не читает.\n✅ **Конкретика про компанию + конкретные релевантные проекты + 1-2 цифры.**",
        },
      ],
    },
    {
      id: "tracking",
      title: "Учёт откликов",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "Веди таблицу в Notion / Google Sheets:\n\n| Company | Position | URL | Applied | Status | Last contact | Notes |\n|---------|----------|-----|---------|--------|--------------|-------|\n| Acme   | AI Eng   | ... | 25/11 | screen sched 02/12 | 28/11 | T1 — стартап про RAG |\n\n**Статусы:** applied → no response → rejected → screen scheduled → screen done → tech interview → final → offer / no.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Зачем",
          content:
            "Через 2 недели ты не вспомнишь, куда подал. Без таблицы — будешь подаваться дважды в одну компанию (это плохо) или пропускать follow-up.",
        },
      ],
    },
    {
      id: "networking",
      title: "Нетворкинг — 5 outreach в неделю",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "Напиши **5 людям в неделю** в LinkedIn — это бесплатный способ найти работу через знакомства, а не конкуренцию.",
        },
        {
          type: "code",
          language: "text",
          content: `Subject: Quick question about your AI path

Hi [Name],

I noticed your work at [Company] on [specific project / their post].
Really interesting approach to [specific thing].

I'm transitioning from [your bg] into Applied AI, currently building
portfolio projects (research agent + RAG system, links in profile).

Would you have 15 minutes for a quick call to share how you entered
the field and any advice for someone at my stage? Happy to be flexible
with timing.

Thanks!
Ivan`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Конверсия 20-30%",
          content:
            "Из 5 outreach сообщений 1-2 ответят. Через 4 недели у тебя 5-10 контактов в индустрии. Часто кто-то говорит «у нас как раз ищут такого как ты, давай я свяжу с командой».",
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
              title: "aijobs.net",
              url: "https://aijobs.net/",
              description: "Главная биржа AI-вакансий в мире.",
            },
            {
              title: "Work at a Startup (Y Combinator)",
              url: "https://www.workatastartup.com/",
              description: "Стартапы из YC. Много AI/LLM вакансий.",
            },
            {
              title: "Telegram: @aijobsme",
              url: "https://t.me/aijobsme",
              description: "Канал с AI/ML вакансиями (RU).",
            },
            {
              title: "Notion Template — Job Application Tracker",
              url: "https://www.notion.so/templates/category/job-search",
              description: "Готовые шаблоны для отслеживания откликов.",
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
          emoji: "🤝",
          title: "80% вакансий не публикуются",
          content:
            "Исследование LinkedIn 2022: **70-80% вакансий заполняются через networking**, а не через job boards. Это называется **«hidden job market»**. Поэтому **5 outreach сообщений в неделю** даст конверсию выше чем 100 откликов на hh.ru. Парадокс: учат искать работу через резюме, а реальная работа находится через знакомых. Лучше всего работает: бывшие коллеги, выпускники одного университета, contributors одного open-source проекта.",
        },
        {
          type: "funfact",
          emoji: "🎲",
          title: "Числа честных собеседований",
          content:
            "Реальная статистика junior AI Engineer в 2024 (анонимные данные с levels.fyi): **100 applied → 8 responded → 4 phone screens → 2 tech interviews → 1 offer**. Это значит для одного оффера нужно ~100 откликов в среднем. Не разочаровывайся после первых 30 без ответа — это **в пределах нормы**. После 200 без оффера — пора пересматривать резюме.",
        },
        {
          type: "funfact",
          emoji: "📈",
          title: "AI Engineer — самый молодой тайтл",
          content:
            "Должность **«AI Engineer»** массово появилась в job descriptions в **2023 году**. До этого было «ML Engineer» или «MLOps». Разница: AI Engineer строит **продукты на готовых моделях** (LLM API), ML Engineer **обучает свои модели**. Эта новая профессия растёт **на 200% в год** по данным LinkedIn — это **самый быстрорастущий job title** в IT с момента появления Data Scientist.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Сколько откликов в среднем нужно для одного оффера на старте?",
      options: [
        { id: "a", text: "5-10" },
        { id: "b", text: "~100" },
        { id: "c", text: "1000+" },
        { id: "d", text: "Без разницы — главное качество резюме" },
      ],
      correctOptionId: "b",
      explanation:
        "Воронка: 100 откликов → 10 ответов → 3-4 интервью → 1 оффер. Это **нормально** для джуна. Не отчаивайся после первых 20 без ответа.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Какое разделение откликов оптимально?",
      options: [
        { id: "a", text: "100% массовые типовые" },
        { id: "b", text: "80% массовые + 20% точечные персонализированные на интересные позиции" },
        { id: "c", text: "100% точечные — только идеальные совпадения" },
        { id: "d", text: "50/50" },
      ],
      correctOptionId: "b",
      explanation:
        "80/20 — баланс охвата и качества. Только массовые → плохая конверсия. Только точечные → слишком мало откликов в день.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Что должно быть в хорошем cover letter? (несколько)",
      options: [
        { id: "a", text: "Конкретика про компанию (продукт, статья, что заметил)" },
        { id: "b", text: "2-3 релевантных проекта со ссылками" },
        { id: "c", text: "1-2 цифровых достижения" },
        { id: "d", text: "Длинная история твоей жизни" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Кавер на 3 абзаца. Конкретика про них + конкретика про твои проекты + цифры. Длинные истории не работают — никто не читает.",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Зачем вести таблицу откликов?",
      options: [
        { id: "a", text: "Чтобы хвастаться" },
        { id: "b", text: "Через 2 недели не вспомнишь куда подал — будешь подаваться дважды или пропускать follow-up" },
        { id: "c", text: "Это требование HH.ru" },
        { id: "d", text: "Для бухгалтерии" },
      ],
      correctOptionId: "b",
      explanation:
        "Без системы поиск работы превращается в хаос. Базовая таблица в Google Sheets экономит часы и нервы.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Сколько cold-outreach сообщений в неделю рекомендуется писать?",
      options: [
        { id: "a", text: "0 — лучше не беспокоить" },
        { id: "b", text: "~5 в неделю — небольшие персональные сообщения людям в индустрии" },
        { id: "c", text: "50+ в день — массовый спам" },
        { id: "d", text: "Только когда есть конкретный повод" },
      ],
      correctOptionId: "b",
      explanation:
        "5 в неделю — не спам, не отказ. 1-2 ответят. Через месяц у тебя 5-10 контактов в индустрии — это уже сеть.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Таблица откликов",
      description:
        "Класс `JobApplicationTracker` — простой in-memory tracker. Сделай минимальный:\n- `add(company, position, url)` → возвращает application_id\n- `update_status(id, new_status)` — статус из enum\n- `summary()` → словарь `{status: count}`\n- `stale(days)` → отклики которые > N дней без обновления статуса",
      starterCode: `from datetime import datetime, timedelta
from enum import Enum
from typing import Optional


class Status(str, Enum):
    APPLIED = "applied"
    NO_RESPONSE = "no_response"
    REJECTED = "rejected"
    SCREEN_SCHEDULED = "screen_scheduled"
    SCREEN_DONE = "screen_done"
    TECH_INTERVIEW = "tech_interview"
    FINAL = "final"
    OFFER = "offer"


class JobApplicationTracker:
    def __init__(self):
        self.apps: list[dict] = []

    def add(self, company: str, position: str, url: str) -> int:
        # Допиши: добавь запись со status=APPLIED, applied_at=now, last_update=now
        # Верни id (индекс в списке + 1)
        pass

    def update_status(self, id: int, new_status: Status) -> None:
        # Допиши
        pass

    def summary(self) -> dict[str, int]:
        # Допиши
        pass

    def stale(self, days: int = 7) -> list[dict]:
        # Допиши: отклики без обновления > days дней назад
        pass


# Тест
t = JobApplicationTracker()
id1 = t.add("Anthropic", "AI Engineer", "https://...")
id2 = t.add("OpenAI", "Junior ML", "https://...")
id3 = t.add("Local startup", "LLM Engineer", "https://...")

t.update_status(id1, Status.SCREEN_SCHEDULED)
t.update_status(id2, Status.REJECTED)

# Эмулируем что 3-й отклик старый
t.apps[id3 - 1]["last_update"] = datetime.now() - timedelta(days=10)

print(f"Summary: {t.summary()}")
print(f"\\nStale > 7 дней:")
for app in t.stale(7):
    print(f"  {app['company']} - {app['position']}: {app['status']}")
`,
      solutionCode: `from datetime import datetime, timedelta
from enum import Enum


class Status(str, Enum):
    APPLIED = "applied"
    NO_RESPONSE = "no_response"
    REJECTED = "rejected"
    SCREEN_SCHEDULED = "screen_scheduled"
    SCREEN_DONE = "screen_done"
    TECH_INTERVIEW = "tech_interview"
    FINAL = "final"
    OFFER = "offer"


class JobApplicationTracker:
    def __init__(self):
        self.apps: list[dict] = []

    def add(self, company: str, position: str, url: str) -> int:
        now = datetime.now()
        self.apps.append({
            "id": len(self.apps) + 1,
            "company": company,
            "position": position,
            "url": url,
            "status": Status.APPLIED.value,
            "applied_at": now,
            "last_update": now,
        })
        return self.apps[-1]["id"]

    def update_status(self, id: int, new_status: Status) -> None:
        for app in self.apps:
            if app["id"] == id:
                app["status"] = new_status.value
                app["last_update"] = datetime.now()
                return
        raise KeyError(f"Application {id} not found")

    def summary(self) -> dict[str, int]:
        result = {}
        for app in self.apps:
            result[app["status"]] = result.get(app["status"], 0) + 1
        return result

    def stale(self, days: int = 7) -> list[dict]:
        threshold = datetime.now() - timedelta(days=days)
        return [a for a in self.apps if a["last_update"] < threshold]


t = JobApplicationTracker()
id1 = t.add("Anthropic", "AI Engineer", "https://...")
id2 = t.add("OpenAI", "Junior ML", "https://...")
id3 = t.add("Local startup", "LLM Engineer", "https://...")

t.update_status(id1, Status.SCREEN_SCHEDULED)
t.update_status(id2, Status.REJECTED)

t.apps[id3 - 1]["last_update"] = datetime.now() - timedelta(days=10)

print(f"Summary: {t.summary()}")
print(f"\\nStale > 7 дней:")
for app in t.stale(7):
    print(f"  {app['company']} - {app['position']}: {app['status']}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "ЛОКАЛЬНО: 30 откликов за неделю",
      description:
        "**Неделя поиска работы:**\n\n1. **Создай таблицу** (Google Sheets / Notion) с колонками: Company, Position, URL, Applied date, Status, Notes\n2. **Подпишись на 5 каналов** с вакансиями в Telegram + 5 alerts в LinkedIn\n3. **Подай минимум 30 откликов** за неделю:\n   - 25 массовых через hh.ru / LinkedIn easy apply\n   - 5 точечных с персонализированным кавером\n4. **Cold outreach**: напиши 5 людям в LinkedIn — попроси совет по входу в AI\n5. **Подпишись и комментируй** 10 AI/LLM каналов / influencers в Twitter — постепенно тебя начнут замечать",
      starterCode: `# Шаблон для текста cold outreach
COLD_OUTREACH_TEMPLATE = """
Hi {name},

I noticed your work at {company} on {specific_project_or_post}.
Really interesting approach to {specific_thing}.

I'm transitioning from {your_background} into Applied AI, currently building
portfolio projects (research agent + RAG system, links in profile).

Would you have 15 minutes for a quick call to share how you entered
the field and any advice for someone at my stage?

Thanks!
{your_name}
"""

# Чек на неделю
WEEKLY_GOALS = {
    "applications_total": 30,
    "applications_targeted": 5,
    "cold_outreach": 5,
    "interviews_secured": 1,
    "follow_ups": 3,
}

print("Цели на эту неделю:")
for k, v in WEEKLY_GOALS.items():
    print(f"  {k}: {v}")
`,
      language: "python",
      runnable: false,
    },
  ],
  checkpoint: [
    "Таблица откликов с минимум 30 строк",
    "Включены LinkedIn job alerts и Telegram-каналы",
    "5 cold-outreach сообщений отправлено",
    "Первые ответы (или отказы) пришли",
    "Готов к интервью на следующей неделе",
  ],
};
