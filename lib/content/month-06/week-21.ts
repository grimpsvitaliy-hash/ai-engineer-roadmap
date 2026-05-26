import type { Lesson } from "../types";

export const week21: Lesson = {
  id: "m6-w21",
  monthId: "month-06",
  weekNumber: 21,
  title: "Агенты: паттерны и frameworks",
  goal: "Прочитал Anthropic «Building Effective Agents». Знаешь 5 паттернов проектирования агентов. Можешь выбрать подход под задачу.",
  estimatedHours: "5-6 ч",
  theory: [
    {
      id: "what-is-agent",
      title: "Что такое агент (на самом деле)",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "В индустрии «agent» — перегруженный термин. Anthropic делит на два смысла:\n\n- **Workflow** — фиксированная последовательность шагов, на каждом шаге LLM делает конкретную задачу. Предсказуемо.\n- **Agent** — LLM сама решает какие шаги делать, в каком порядке, когда остановиться. Гибко, но непредсказуемо.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Главное правило",
          content:
            "Большинство задач решаются workflow, а не агентами. Чем больше автономии — тем дороже, сложнее тестировать, больше неожиданностей. **Начинай с минимальной автономии.**",
        },
      ],
    },
    {
      id: "5-patterns",
      title: "5 паттернов проектирования (Anthropic)",
      estimatedMinutes: 20,
      blocks: [
        {
          type: "text",
          content:
            "**1. Prompt chaining** — последовательность шагов, каждый принимает выход предыдущего.",
        },
        {
          type: "code",
          language: "text",
          content: `[user input] → LLM1 (извлечь данные) → LLM2 (валидировать) → LLM3 (саммаризировать) → [output]

Использовать когда задача декомпозируется на чёткие этапы.`,
        },
        {
          type: "text",
          content:
            "**2. Routing** — LLM-классификатор решает, в какую ветку workflow отправить запрос.",
        },
        {
          type: "code",
          language: "text",
          content: `[user query] → Router LLM (классифицировать)
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   billing-flow   technical-flow   general-flow

Использовать когда у тебя есть N специализированных handlers и нужен dispatcher.`,
        },
        {
          type: "text",
          content:
            "**3. Parallelization** — одна задача запускается параллельно несколько раз (для voting / aggregation).",
        },
        {
          type: "code",
          language: "text",
          content: `[input] → LLM × 3 → vote/aggregate → [output]

Использовать для повышения качества важных решений или для нескольких независимых задач сразу.`,
        },
        {
          type: "text",
          content:
            "**4. Orchestrator-workers** — главный LLM решает что нужно сделать, делегирует под-задачи worker-LLM-ам.",
        },
        {
          type: "code",
          language: "text",
          content: `[task] → Orchestrator (план + декомпозиция)
                ↓
        ┌───────┼───────┐
        ↓       ↓       ↓
     worker  worker  worker
        ↓       ↓       ↓
        └───────┼───────┘
                ↓
         Synthesizer → [output]

Использовать для сложных задач которые нельзя заранее разбить (например, исследование темы).`,
        },
        {
          type: "text",
          content:
            "**5. Evaluator-optimizer** — генератор + критик в цикле, пока критик не удовлетворён.",
        },
        {
          type: "code",
          language: "text",
          content: `[task] → Generator → result → Evaluator
                                      ↓
                               (нужны правки?)
                                      ↓ да
                  ┌───────────────────┘
                  ↓
            ← improved result

Использовать когда критерий качества чёткий и итеративные улучшения помогают.`,
        },
      ],
    },
    {
      id: "when-agents",
      title: "Когда стоит делать «настоящего» агента",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "Признаки задачи под агента",
          content:
            "✅ Невозможно заранее разбить на шаги — нужно адаптироваться по ходу.\n✅ Количество шагов варьируется в разы (от 2 до 20).\n✅ Действия зависят от результатов предыдущих.\n✅ Цена ошибки приемлема (если агент сделает чушь — это исправимо).",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Когда НЕ нужен агент",
          content:
            "❌ Задача структурирована (workflow подойдёт).\n❌ Цена ошибки высокая (медицина, финансы — нужны human-in-the-loop).\n❌ Стоимость критична (агент = N вызовов LLM).\n❌ Latency критична (агент медленный).",
        },
      ],
    },
    {
      id: "frameworks",
      title: "Frameworks — обзор",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Минималистичные (рекомендую начинать с них):**\n\n- **Свой код на raw API** — то что мы делали в месяце 3. Полный контроль, никаких абстракций.\n- **Claude Agent SDK** — официальный от Anthropic. Минимальный, чистый.",
        },
        {
          type: "text",
          content:
            "**Полноценные frameworks:**\n\n- **LangGraph** — граф состояний. Мощно, гибко, не легко. Хорошо для production.\n- **LlamaIndex Agents** — если у тебя уже LlamaIndex для RAG.\n- **CrewAI** — multi-agent (несколько агентов с разными ролями). Модно, часто оверкилл.\n- **AutoGen (Microsoft)** — multi-agent, инженерный подход.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Совет на собес",
          content:
            "Хорошо упомянуть «знаком с LangGraph, делал на нём X», но **в портфолио** покажи реализацию **без** фреймворка. Это показывает что ты понимаешь как всё работает.",
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
              title: "Anthropic — Building Effective Agents",
              url: "https://www.anthropic.com/research/building-effective-agents",
              description: "MUST READ. Лучшая статья про дизайн агентов в индустрии. Прочитай дважды.",
            },
            {
              title: "Claude Agent SDK docs",
              url: "https://docs.anthropic.com/en/api/agent-sdk",
              description: "Официальный минималистичный SDK от Anthropic.",
            },
            {
              title: "LangGraph quickstart",
              url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/",
              description: "Главный production-grade фреймворк для агентов.",
            },
            {
              title: "Lilian Weng — Agent overview",
              url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
              description: "Классическая статья про архитектуры агентов.",
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
          emoji: "🤖",
          title: "Слово «agent» — из 1980-х",
          content:
            "Термин **«AI agent»** появился в **1986 году** в работах Марвина Минского. Его книга «Society of Mind» описывала разум как множество маленьких агентов, каждый со своей функцией. Современные LLM-агенты — реализация той самой идеи, только через 40 лет. Минский (Massachusetts Institute of Technology) — один из основателей AI как науки и в 1969 году получил премию Тьюринга.",
        },
        {
          type: "funfact",
          emoji: "🤔",
          title: "ReAct — паттерн победитель",
          content:
            "В 2022 Princeton/Google выпустили статью **ReAct (Reasoning + Acting)**. Формула: модель чередует **«размышление»** (думает что делать) и **«действие»** (вызывает tool). Это **стало стандартом** всех LLM-агентов. В 2024 даже Anthropic применяет ReAct под капотом многих своих скиллов. Когда GPT/Claude «думает вслух» прежде чем что-то сделать — это и есть ReAct.",
        },
        {
          type: "funfact",
          emoji: "🎼",
          title: "LangChain vs LlamaIndex — соперничество",
          content:
            "**LangChain** (Harrison Chase) и **LlamaIndex** (Jerry Liu) запустились в **октябре 2022** — буквально с разницей в недели. Они конкурируют до сих пор. LangChain побольше и универсальнее, LlamaIndex заточен на RAG. Совет от индустрии: **сначала пиши сам**, потом если нужно — выбирай конкретно под задачу. Большинство проектов **не нуждается** ни в том, ни в другом.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "В чём разница между workflow и agent (по Anthropic)?",
      options: [
        { id: "a", text: "Workflow — для текста, agent — для голоса" },
        { id: "b", text: "Workflow — фиксированные шаги. Agent — LLM сама решает что и когда делать" },
        { id: "c", text: "Workflow — один LLM, agent — несколько" },
        { id: "d", text: "Workflow — синхронный, agent — асинхронный" },
      ],
      correctOptionId: "b",
      explanation:
        "Workflow предсказуем, agent — нет. Большинство задач лучше делать workflow. Agent — для случаев когда декомпозиция невозможна заранее.",
    },
    {
      id: "q2",
      type: "single-choice",
      question:
        "У тебя есть classifier (3 категории) и 3 разных handlers для каждой. Какой паттерн?",
      options: [
        { id: "a", text: "Prompt chaining" },
        { id: "b", text: "Routing" },
        { id: "c", text: "Parallelization" },
        { id: "d", text: "Orchestrator-workers" },
      ],
      correctOptionId: "b",
      explanation:
        "Routing — LLM-классификатор решает в какую ветку workflow отправить запрос. Классический паттерн для customer support / triage систем.",
    },
    {
      id: "q3",
      type: "single-choice",
      question:
        "Задача: «исследуй тему X и напиши отчёт» — какие шаги нужны заранее неизвестно. Какой паттерн?",
      options: [
        { id: "a", text: "Prompt chaining" },
        { id: "b", text: "Routing" },
        { id: "c", text: "Orchestrator-workers (или агент с tool use)" },
        { id: "d", text: "Evaluator-optimizer" },
      ],
      correctOptionId: "c",
      explanation:
        "Когда декомпозиция возникает по ходу — нужен orchestrator (или полноценный agent). Это паттерн research-assistant и кодинг-ассистентов.",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "Когда «настоящий» агент с tool use — правильный выбор? (несколько)",
      options: [
        { id: "a", text: "Шагов варьируется от 2 до 20" },
        { id: "b", text: "Действия зависят от результатов предыдущих" },
        { id: "c", text: "Невозможно заранее разбить на шаги" },
        { id: "d", text: "Каждый запрос требует ровно одного LLM-вызова" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "(d) — это workflow с одним шагом, агент не нужен. Остальные три — классические сигналы что нужна автономия.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Какой фреймворк рекомендуют использовать в портфолио-проекте?",
      options: [
        { id: "a", text: "LangChain — самый популярный" },
        { id: "b", text: "LangGraph — самый мощный" },
        { id: "c", text: "Свой код на raw API — показывает понимание как всё работает" },
        { id: "d", text: "Не важно, главное результат" },
      ],
      correctOptionId: "c",
      explanation:
        "На собесе тебя будут спрашивать «как это устроено». Если ты только звал LangChain — ответить нечего. Свой код = глубокое понимание.",
    },
    {
      id: "q6",
      type: "text-input",
      question:
        "Как называется паттерн, в котором генератор и критик работают в цикле, пока критик не удовлетворён?\n\nВведи название (по-русски или английским).",
      correctAnswers: [
        "evaluator-optimizer",
        "evaluator optimizer",
        "оценщик-оптимизатор",
        "evaluator/optimizer",
      ],
      caseSensitive: false,
      explanation:
        "Evaluator-optimizer — паттерн «генератор + критик в цикле». Полезен для задач с чётким критерием качества (код, переводы).",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Routing — выбор handler по категории",
      description:
        "Реализуй простой router. Функция `route(query)` сначала классифицирует запрос (через мок), потом вызывает подходящий handler.\n\nКатегории: `billing`, `technical`, `general`.",
      starterCode: `def classify(query: str) -> str:
    """Мок классификатор."""
    q = query.lower()
    if any(w in q for w in ["счёт", "оплат", "тариф", "billing", "invoice"]):
        return "billing"
    if any(w in q for w in ["ошибк", "не работает", "баг", "error", "bug"]):
        return "technical"
    return "general"


def handle_billing(q): return f"[billing] {q}"
def handle_technical(q): return f"[technical] {q}"
def handle_general(q): return f"[general] {q}"


def route(query: str) -> str:
    category = classify(query)
    # Допиши: вызови подходящий handler по category
    pass


queries = [
    "Когда придёт счёт?",
    "У меня ошибка при логине",
    "Привет, как дела?",
    "Хочу повысить тариф",
]

for q in queries:
    print(f"  '{q}' → {route(q)}")
`,
      solutionCode: `def classify(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ["счёт", "оплат", "тариф", "billing", "invoice"]):
        return "billing"
    if any(w in q for w in ["ошибк", "не работает", "баг", "error", "bug"]):
        return "technical"
    return "general"


def handle_billing(q): return f"[billing] {q}"
def handle_technical(q): return f"[technical] {q}"
def handle_general(q): return f"[general] {q}"


HANDLERS = {
    "billing": handle_billing,
    "technical": handle_technical,
    "general": handle_general,
}


def route(query: str) -> str:
    category = classify(query)
    handler = HANDLERS.get(category, handle_general)
    return handler(query)


queries = [
    "Когда придёт счёт?",
    "У меня ошибка при логине",
    "Привет, как дела?",
    "Хочу повысить тариф",
]

for q in queries:
    print(f"  '{q}' → {route(q)}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Prompt chaining",
      description:
        "Сделай цепочку из трёх шагов: extract → validate → summarize.\n\nКаждый шаг — функция с моком LLM. Если на любом шаге провал — возвращаем ошибку, цепочка прерывается.",
      starterCode: `def step_extract(text: str) -> dict:
    # Мок: извлекаем имя и возраст
    import re
    m = re.search(r"(\\w+),?\\s*(\\d+)", text)
    if not m:
        return {"error": "couldn't extract"}
    return {"name": m.group(1), "age": int(m.group(2))}


def step_validate(data: dict) -> dict:
    if "error" in data:
        return data
    if data["age"] < 0 or data["age"] > 150:
        return {"error": f"invalid age {data['age']}"}
    return data


def step_summarize(data: dict) -> dict:
    if "error" in data:
        return data
    return {"summary": f"{data['name']} ({data['age']} лет)"}


def pipeline(text: str) -> dict:
    # Допиши: прогон через 3 шага, прерывание при ошибке
    pass


tests = [
    "Иван, 25",
    "Анна, 999",
    "просто текст без данных",
]

for t in tests:
    print(f"  '{t}' → {pipeline(t)}")
`,
      solutionCode: `def step_extract(text: str) -> dict:
    import re
    m = re.search(r"(\\w+),?\\s*(\\d+)", text)
    if not m:
        return {"error": "couldn't extract"}
    return {"name": m.group(1), "age": int(m.group(2))}


def step_validate(data: dict) -> dict:
    if "error" in data:
        return data
    if data["age"] < 0 or data["age"] > 150:
        return {"error": f"invalid age {data['age']}"}
    return data


def step_summarize(data: dict) -> dict:
    if "error" in data:
        return data
    return {"summary": f"{data['name']} ({data['age']} лет)"}


def pipeline(text: str) -> dict:
    result = step_extract(text)
    if "error" in result:
        return result
    result = step_validate(result)
    if "error" in result:
        return result
    return step_summarize(result)


tests = [
    "Иван, 25",
    "Анна, 999",
    "просто текст без данных",
]

for t in tests:
    print(f"  '{t}' → {pipeline(t)}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Evaluator-optimizer",
      description:
        "Цикл «генератор + критик». Функция `improve_until_good(initial, generator_fn, evaluator_fn, max_iters=3)`:\n- Генератор делает версию\n- Evaluator возвращает `(score: float, feedback: str)`\n- Если score >= 0.8 → возвращаем результат\n- Если меньше → генератор делает новую версию с учётом feedback\n- Максимум max_iters попыток",
      starterCode: `def improve_until_good(initial: str, generator_fn, evaluator_fn, max_iters: int = 3) -> dict:
    current = initial
    history = []

    for i in range(max_iters):
        score, feedback = evaluator_fn(current)
        history.append({"iteration": i, "version": current, "score": score, "feedback": feedback})

        if score >= 0.8:
            return {"final": current, "iterations": i + 1, "history": history}

        # Иначе — генерим улучшение
        current = generator_fn(current, feedback)

    return {"final": current, "iterations": max_iters, "history": history, "note": "max iters reached"}


# Моки
def mock_generator(prev: str, feedback: str) -> str:
    # Каждая итерация — текст становится "лучше"
    return prev + " [улучшено по: " + feedback + "]"


def mock_evaluator(text: str):
    # Просто оцениваем по длине — длиннее = "лучше"
    score = min(1.0, len(text) / 100)
    feedback = "слишком коротко" if score < 0.8 else "ок"
    return score, feedback


result = improve_until_good(
    initial="короткий ответ",
    generator_fn=mock_generator,
    evaluator_fn=mock_evaluator,
    max_iters=4,
)

import json
print(json.dumps(result, indent=2, ensure_ascii=False))
`,
      solutionCode: `def improve_until_good(initial: str, generator_fn, evaluator_fn, max_iters: int = 3) -> dict:
    current = initial
    history = []

    for i in range(max_iters):
        score, feedback = evaluator_fn(current)
        history.append({"iteration": i, "version": current, "score": score, "feedback": feedback})

        if score >= 0.8:
            return {"final": current, "iterations": i + 1, "history": history}

        current = generator_fn(current, feedback)

    return {"final": current, "iterations": max_iters, "history": history, "note": "max iters reached"}


def mock_generator(prev: str, feedback: str) -> str:
    return prev + " [улучшено по: " + feedback + "]"


def mock_evaluator(text: str):
    score = min(1.0, len(text) / 100)
    feedback = "слишком коротко" if score < 0.8 else "ок"
    return score, feedback


result = improve_until_good(
    initial="короткий ответ",
    generator_fn=mock_generator,
    evaluator_fn=mock_evaluator,
    max_iters=4,
)

import json
print(json.dumps(result, indent=2, ensure_ascii=False))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: прочитать «Building Effective Agents»",
      description:
        "Это не код, а **обязательное** теоретическое задание.\n\n1. Прочитай https://www.anthropic.com/research/building-effective-agents целиком (~15 минут)\n2. В своём `notes/agents.md` запиши:\n   - 5 паттернов с собственным примером для каждого\n   - Когда использовать workflow vs agent\n   - Какой паттерн ты использовал в Research Assistant из месяца 3? Объясни почему\n   - Какой паттерн ты бы использовал в идее своего следующего проекта?\n3. **Бонус**: посмотри Claude Agent SDK — попробуй переписать Research Assistant из месяца 3 с использованием SDK. Сравни количество кода и читаемость.",
      starterCode: `# Этот «практический» задача — на чтение и заметки, а не код.
# Запиши свои выводы здесь:

notes = """
МОЙ КОНСПЕКТ "Building Effective Agents" (Anthropic)

1. Prompt chaining
   Пример из моих проектов: ...

2. Routing
   Пример: ...

3. Parallelization
   Пример: ...

4. Orchestrator-workers
   Пример: ...

5. Evaluator-optimizer
   Пример: ...

КОГДА WORKFLOW vs AGENT:
- Workflow подходит когда: ...
- Agent оправдан когда: ...

МОЙ RESEARCH ASSISTANT (месяц 3):
Я использовал паттерн: ...
Почему: ...
Можно было использовать вместо: ...

СЛЕДУЮЩИЙ ПРОЕКТ:
Идея: ...
Подходящий паттерн: ...
"""

print(notes)
`,
      language: "python",
      runnable: false,
    },
  ],
  checkpoint: [
    "Прочитал «Building Effective Agents» — есть конспект",
    "Знаешь 5 паттернов и можешь привести пример для каждого",
    "Понимаешь когда workflow, а когда agent",
    "Знаешь о frameworks (Claude Agent SDK, LangGraph) — упомянуть на собесе",
    "Готов улучшить старые проекты с правильным паттерном",
  ],
};
