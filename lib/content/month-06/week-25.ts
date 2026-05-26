import type { Lesson } from "../types";

export const week25: Lesson = {
  id: "m6-w25",
  monthId: "month-06",
  weekNumber: 25,
  title: "Подготовка к собеседованиям",
  goal: "Готов отвечать на типичные вопросы технического собеседования AI Engineer. Прошёл 3+ mock-интервью.",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "interview-structure",
      title: "Структура собеса AI Engineer junior",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Типичная цепочка для junior:**\n\n1. **Recruiter screen** (15-30 мин) — про опыт, мотивацию, ожидания по зарплате. Не технический.\n2. **Тех. интервью #1** (45-60 мин) — твои проекты + базовые вопросы по LLM\n3. **Тех. интервью #2** (60 мин) — coding или system design\n4. **Final / team fit** (45 мин) — с руководителем / командой",
        },
      ],
    },
    {
      id: "common-questions",
      title: "Топ-вопросов с собесов AI Engineer",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**Блок 1: LLM основы**\n\n- Что такое токен? Почему он важен?\n- Что такое контекстное окно? Что делать если не помещается?\n- Чем отличается system prompt от user message?\n- Что такое температура? Когда 0, когда 1?\n- Почему LLM галлюцинируют? Как с этим бороться?\n- Расскажи про разные модели Claude/GPT — в чём разница, цена, применение?",
        },
        {
          type: "text",
          content:
            "**Блок 2: Prompt engineering**\n\n- Расскажи про техники: few-shot, CoT, structured prompting.\n- Что лучше: один большой промпт или цепочка маленьких?\n- Как тестировать промпт? Как понять что новая версия лучше?",
        },
        {
          type: "text",
          content:
            "**Блок 3: RAG**\n\n- Объясни RAG на пальцах.\n- Какую векторную БД ты использовал? Почему?\n- Как ты делал chunking? Какие были проблемы?\n- Что такое reranking? Зачем нужен?\n- RAG vs fine-tuning — что когда?\n- Что такое hybrid search?\n- Что такое prompt injection через документы и как защититься?",
        },
        {
          type: "text",
          content:
            "**Блок 4: Tool use / агенты**\n\n- Как работает function calling?\n- Что такое agent loop?\n- Когда нужен агент, а когда хватит pipeline / workflow?\n- Какие риски у автономного агента? Как ты их митигируешь?",
        },
        {
          type: "text",
          content:
            "**Блок 5: Production**\n\n- Как ты деплоил? Какой стек?\n- Как считаешь стоимость API в день/месяц?\n- Как ты бы оптимизировал стоимость 10x?\n- Что такое prompt caching?\n- Как обрабатываешь ошибки API?\n- Как тестируешь LLM-приложение?",
        },
        {
          type: "text",
          content:
            "**Блок 6: System design**\n\n- «Спроектируй чат-бота по документации компании на 50К страниц»\n- «Спроектируй ассистента для триажа email»\n- «Как ты будешь мониторить качество LLM-приложения в проде?»",
        },
        {
          type: "text",
          content:
            "**Блок 7: Behavioral**\n\n- Расскажи про сложный момент в проекте\n- Почему AI? Почему ты?\n- Где видишь себя через 2 года?\n- Расскажи когда не сработало — что узнал?",
        },
      ],
    },
    {
      id: "system-design-frame",
      title: "Frame для system design ответа",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Если спросят «спроектируй X на основе LLM», иди по структуре:\n\n**1. Уточняющие вопросы (1-2 мин)** — НЕ начинай сразу решать.\n- Какой объём данных / запросов в день?\n- Какие требования по latency и cost?\n- Real-time или batch?\n- Какой стек у команды?\n\n**2. Высокоуровневая архитектура (5 мин)**\n- Нарисуй на доске (Excalidraw / маркер)\n- API gateway → preprocessing → retrieval → LLM → postprocessing\n- Какие сервисы внешние (LLM API, Vector DB)\n\n**3. Углубление в компоненты (15 мин)**\n- Какой LLM выбрал и почему\n- Какой RAG-подход (если применимо)\n- Где кеш, где БД, где Redis\n- Как тестируешь качество (evals)\n\n**4. Trade-offs и риски (5 мин)**\n- Cost vs latency vs quality\n- Что делать при отказе LLM API\n- Защита от prompt injection / rate abuse\n- Как масштабируется на 10x нагрузку",
        },
      ],
    },
    {
      id: "mock-interviews",
      title: "Mock-интервью",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Как практиковаться:**\n\n1. **С Claude/ChatGPT** — попроси сыграть роль интервьюера, провести 30 минут технического собеса по LLM, давать фидбек после каждого вопроса\n2. **С друзьями-разработчиками** — даже не из AI, попроси задать вопросы по списку выше\n3. **Pramp** (https://pramp.com) — бесплатные mock-интервью с другими кандидатами\n4. **interviewing.io** — есть anonymous free tier",
        },
        {
          type: "code",
          language: "text",
          content: `Промпт для Claude/ChatGPT в качестве интервьюера:

"Привет, ты технический интервьюер на позицию Junior AI Engineer.
Проведи 30-минутное собеседование со мной.

Правила:
- Задавай по одному вопросу, жди ответа
- После каждого ответа дай короткий фидбек (что хорошо, что улучшить)
- Покрой темы: LLM основы, RAG, prompt engineering, tool use, production
- Один из вопросов сделай system design
- В конце — summary моих сильных и слабых сторон

Начинай."`,
        },
      ],
    },
    {
      id: "interview-day-tips",
      title: "В день собеса",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "callout",
          variant: "tip",
          title: "Чек-лист",
          content:
            "✅ Проверь технику за час до — камера, микрофон, интернет.\n✅ Держи на втором мониторе: резюме, портфолио, описание вакансии.\n✅ Стакан воды рядом.\n✅ После каждого вопроса делай паузу 2-3 секунды — лучше подумать чем тараторить.\n✅ Если не знаешь ответ — скажи **«Не знаю, но рассуждать я бы стал так...»**, никогда не выдумывай.\n✅ В конце задавай свои вопросы (про team, tech stack, growth).",
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
              title: "Pramp — бесплатные mock интервью",
              url: "https://www.pramp.com/",
              description: "Партнёрит тебя с другим кандидатом, проводите взаимные mock.",
            },
            {
              title: "interviewing.io",
              url: "https://interviewing.io/",
              description: "Анонимные технические собесы. Бесплатные slots иногда.",
            },
            {
              title: "System Design for ML",
              url: "https://www.educative.io/courses/machine-learning-system-design",
              description: "Курс по ML system design (есть free preview).",
            },
            {
              title: "Awesome LLM Interview Questions",
              url: "https://github.com/llmgenai/LLMInterviewQuestions",
              description: "Список вопросов с собесов по LLM.",
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
          emoji: "🗣️",
          title: "94% собесов начинаются одинаково",
          content:
            "По данным Glassdoor, **«Tell me about yourself»** — самый частый первый вопрос на интервью (94% случаев). Несмотря на это, **большинство кандидатов отвечает плохо**: длинные несвязные истории жизни. Правильный ответ — **3 предложения**: кем являлся → что делаю сейчас → куда иду. Подготовь и отрепетируй именно этот ответ — он задаст тон всему собеседованию.",
        },
        {
          type: "funfact",
          emoji: "🤐",
          title: "Тишина — твой друг",
          content:
            "Психологическое исследование показало: **средний человек терпит максимум 4 секунды тишины** в разговоре, потом начинает заполнять её речью. Опытные интервьюеры **специально молчат** после твоего ответа — чтобы ты добавил детали. На собесе **остановись после ответа**, не паникуй. Если интервьюер захочет глубже — он спросит. А ты не выдашь лишнее под прессингом.",
        },
        {
          type: "funfact",
          emoji: "💡",
          title: "Mock interview = +20% confidence",
          content:
            "В работе Boucher et al. (2019) изучали кандидатов: те кто прошёл **3+ mock-интервью** показывали уровень тревоги на 40% ниже и получали офферы на **20% чаще**. Не нужны платформы — даже **с другом за пивом** разговор по списку вопросов работает. Ещё лучше — **с Claude/ChatGPT** в роли интервьюера: можно делать неограниченно бесплатно.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question:
        "На собесе тебя спросили «как считать стоимость моего RAG в проде?». Что отвечать?",
      options: [
        { id: "a", text: "Скажу что не знаю" },
        { id: "b", text: "Логировать каждый вызов с usage tokens, по pricing считать долл/вызов, мониторить P50/P99 cost, alerts при превышении бюджета" },
        { id: "c", text: "Использую только бесплатные модели" },
        { id: "d", text: "Это работа DevOps" },
      ],
      correctOptionId: "b",
      explanation:
        "Структурный ответ: что измеряю → как считаю → как мониторю → когда алерты. Это типичный production-вопрос, ответ должен показать инженерное мышление.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Если не знаешь точного ответа на технический вопрос, как лучше всего поступить?",
      options: [
        { id: "a", text: "Выдумать ответ — может прокатит" },
        { id: "b", text: "Молчать 30 секунд" },
        { id: "c", text: "«Не знаю точно, но рассуждать я бы стал так: ...» — рассуждать вслух" },
        { id: "d", text: "Перейти к другому вопросу" },
      ],
      correctOptionId: "c",
      explanation:
        "Интервьюер ценит мышление больше чем заученные ответы. Видеть как ты думаешь — намного полезнее чем «знаю / не знаю». Никогда не выдумывай — палится мгновенно.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question:
        "На system design вопросе «спроектируй чат-бота по 50К страниц документации» что **обязательно** сделать в начале?",
      options: [
        { id: "a", text: "Задать уточняющие вопросы (нагрузка, latency, бюджет)" },
        { id: "b", text: "Сразу нарисовать архитектуру" },
        { id: "c", text: "Сказать «возьму LangChain» и закончить" },
        { id: "d", text: "Молчать 5 минут" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "Уточняющие вопросы — главный сигнал зрелого инженера. Кто сразу бросается решать — обычно «пишет код раньше, чем подумает».",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Что делать в конце собеса когда спрашивают «есть ли у тебя вопросы»?",
      options: [
        { id: "a", text: "Сказать «нет, всё ясно» — быстро закончу" },
        { id: "b", text: "Задать 2-3 содержательных вопроса про команду, стек, growth" },
        { id: "c", text: "Сразу про зарплату" },
        { id: "d", text: "Спросить почему компания существует" },
      ],
      correctOptionId: "b",
      explanation:
        "«Нет вопросов» = «мне не очень-то и интересно». Задавай: «как выглядит ваш типичный sprint?», «какой главный challenge сейчас у команды?», «как обычно растёт junior до middle?».",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Самый эффективный способ подготовиться к собеседованиям:",
      options: [
        { id: "a", text: "Заучить ответы на 100 вопросов" },
        { id: "b", text: "Реально проходить собесы — даже на нежелательные позиции для тренировки" },
        { id: "c", text: "Читать книги по теории" },
        { id: "d", text: "Смотреть YouTube" },
      ],
      correctOptionId: "b",
      explanation:
        "Тренировка в боевых условиях. Каждое реальное собеседование = +20% уверенности. Не отказывайся даже от «не моих» позиций — это бесплатный тренинг.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Карточки вопрос-ответ",
      description:
        "Реализуй простой quiz-runner для подготовки. Класс `InterviewQuizzer`:\n- Хранит список `{question, answer_points: list[str]}`\n- Метод `ask_random()` — задаёт случайный вопрос\n- Метод `show_answer()` — показывает ключевые пункты ответа\n- Веди счётчик: правильно/неправильно (по самооценке)",
      starterCode: `import random


class InterviewQuizzer:
    def __init__(self, questions: list[dict]):
        self.questions = questions
        self.current = None
        self.right = 0
        self.wrong = 0

    def ask_random(self) -> str:
        self.current = random.choice(self.questions)
        return self.current["question"]

    def show_answer(self) -> list[str]:
        if not self.current:
            return []
        return self.current["answer_points"]

    def record(self, correct: bool) -> None:
        if correct:
            self.right += 1
        else:
            self.wrong += 1

    def score(self) -> dict:
        total = self.right + self.wrong
        return {
            "right": self.right,
            "wrong": self.wrong,
            "total": total,
            "accuracy": round(self.right / total * 100, 1) if total else 0,
        }


# База вопросов
QUESTIONS = [
    {
        "question": "Что такое токен в LLM?",
        "answer_points": [
            "Минимальная единица текста для модели",
            "Не слово и не символ — кусок (~3-4 символа в англ.)",
            "Влияет на: стоимость, контекстное окно, скорость",
            "Русский ~ в 2x дороже английского",
        ]
    },
    {
        "question": "Зачем нужен reranking в RAG?",
        "answer_points": [
            "Vector search — быстрый но грубый, может пропустить релевантное",
            "Двухэтапный подход: retrieve top-20 → rerank до top-5",
            "Reranker — специализированная модель (Voyage rerank, Cohere)",
            "Часто +10-20% к точности",
        ]
    },
    # Добавь свои 8-10 вопросов
]


# Симуляция сессии тренировки
quizzer = InterviewQuizzer(QUESTIONS)

for _ in range(3):
    print(f"\\nQ: {quizzer.ask_random()}")
    # Симулируем что мы ответили
    print("(твой ответ...)")
    print(f"\\nКлючевые пункты:")
    for p in quizzer.show_answer():
        print(f"  • {p}")
    # Самооценка
    quizzer.record(correct=random.choice([True, False]))

print(f"\\n=== Score ===")
print(quizzer.score())
`,
      solutionCode: `import random


class InterviewQuizzer:
    def __init__(self, questions: list[dict]):
        self.questions = questions
        self.current = None
        self.right = 0
        self.wrong = 0

    def ask_random(self) -> str:
        self.current = random.choice(self.questions)
        return self.current["question"]

    def show_answer(self) -> list[str]:
        if not self.current:
            return []
        return self.current["answer_points"]

    def record(self, correct: bool) -> None:
        if correct:
            self.right += 1
        else:
            self.wrong += 1

    def score(self) -> dict:
        total = self.right + self.wrong
        return {
            "right": self.right,
            "wrong": self.wrong,
            "total": total,
            "accuracy": round(self.right / total * 100, 1) if total else 0,
        }


QUESTIONS = [
    {
        "question": "Что такое токен в LLM?",
        "answer_points": [
            "Минимальная единица текста для модели",
            "Не слово и не символ — кусок (~3-4 символа в англ.)",
            "Влияет на: стоимость, контекстное окно, скорость",
            "Русский ~ в 2x дороже английского",
        ]
    },
    {
        "question": "Зачем нужен reranking в RAG?",
        "answer_points": [
            "Vector search — быстрый но грубый, может пропустить релевантное",
            "Двухэтапный подход: retrieve top-20 → rerank до top-5",
            "Reranker — специализированная модель (Voyage rerank, Cohere)",
            "Часто +10-20% к точности",
        ]
    },
]


quizzer = InterviewQuizzer(QUESTIONS)

for _ in range(3):
    print(f"\\nQ: {quizzer.ask_random()}")
    print("(твой ответ...)")
    print(f"\\nКлючевые пункты:")
    for p in quizzer.show_answer():
        print(f"  • {p}")
    quizzer.record(correct=random.choice([True, False]))

print(f"\\n=== Score ===")
print(quizzer.score())`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "ЛОКАЛЬНО: 3 mock-интервью + ответы на 30 вопросов",
      description:
        "Сложная неделя — много soft-практики:\n\n1. **Письменно ответь на 30 типичных вопросов** (см. теорию). Веди в `notes/interview-prep.md`. Перечитывай в дороге.\n2. **Минимум 3 mock-интервью**:\n   - С Claude/ChatGPT (бесплатно, 30 мин)\n   - С другом-разработчиком\n   - На Pramp\n3. **Видео-питч твоего главного проекта** на 8-10 минут:\n   - Что делает, зачем\n   - Архитектура, ключевые решения\n   - Сложности и как решал\n   - Что бы улучшил\n4. **Пересмотри запись** — стыдно? Сними ещё раз\n5. **System design тренировка**: возьми 3 разных задачи («чат-бот по 50К доков», «email triage», «AI код-ревьюер») — за 30 минут каждую распиши на бумаге по структуре из теории",
      starterCode: `# Шаблон для notes/interview-prep.md

template = """
# Подготовка к интервью AI Engineer

## Блок 1: LLM основы

### Что такое токен?
- ...

### Что такое контекстное окно?
- ...

### Чем отличается system prompt от user message?
- ...

### Что такое температура?
- ...

### Почему LLM галлюцинируют?
- ...

### Чем отличаются Haiku / Sonnet / Opus?
- ...


## Блок 2: Prompt engineering

### Расскажи про few-shot
- ...

### Что такое Chain-of-Thought?
- ...

### Как тестировать промпт?
- ...


## Блок 3: RAG

### Объясни RAG на пальцах
- ...

### Какую vector DB использовал и почему?
- ...

### Как делал chunking?
- ...

### Что такое reranking?
- ...

### RAG vs fine-tuning?
- ...

### Что такое prompt injection через документы?
- ...


## Блок 4: Tool use / агенты

### Как работает function calling?
- ...

### Когда workflow vs agent?
- ...

### Риски автономного агента?
- ...


## Блок 5: Production

### Как считаешь стоимость API в день?
- ...

### Как оптимизировал стоимость 10x?
- ...

### Что такое prompt caching?
- ...

### Как тестировал LLM-приложение?
- ...


## Блок 6: System design

### Чат-бот по 50К страниц документации
- Уточнения: ...
- Архитектура: ...
- Trade-offs: ...

### Email triage assistant
- ...

### AI код-ревьюер
- ...


## Блок 7: Behavioral

### Расскажи про сложный момент в проекте
- ...

### Почему AI?
- ...

### Где видишь себя через 2 года?
- ...
"""

print("Скопируй шаблон в свой файл notes/interview-prep.md и заполни каждый пункт.")
`,
      language: "python",
      runnable: false,
    },
  ],
  checkpoint: [
    "Письменные ответы на 30+ типичных вопросов",
    "Минимум 3 mock-интервью пройдено",
    "Видео-питч главного проекта записан и пересмотрен",
    "Прошёл 3 system design задачи на бумаге",
    "Знаешь как отвечать на «не знаю» — рассуждать вслух",
    "Готов задавать свои вопросы в конце собеса",
  ],
};
