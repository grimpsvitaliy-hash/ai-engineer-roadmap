import type { Lesson } from "../types";

export const week05: Lesson = {
  id: "m2-w5",
  monthId: "month-02",
  weekNumber: 5,
  title: "Как устроен LLM (без формул)",
  goal: "Можешь объяснить за 5 минут: что такое LLM, токен, контекстное окно, температура, почему модель иногда галлюцинирует.",
  estimatedHours: "5-7 ч",
  theory: [
    {
      id: "what-is-llm",
      title: "Что такое LLM",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Large Language Model** — это модель, которая по входному тексту предсказывает **следующий токен**. Всё остальное — производное от этого простого механизма.",
        },
        {
          type: "text",
          content:
            "Когда ты задаёшь Claude вопрос, под капотом:\n\n1. Текст разрезается на **токены**\n2. Модель смотрит на токены и предсказывает наиболее вероятный следующий\n3. Добавляет его в выход\n4. Повторяет — теперь вход = твой вопрос + сгенерированный кусок ответа\n5. Останавливается когда выпадет токен «конец»",
        },
        {
          type: "callout",
          variant: "info",
          title: "Главная иллюзия",
          content:
            "LLM не «понимает» и не «думает» в человеческом смысле. Она статистически предсказывает следующий токен на основе паттернов из обучающих данных. Но при правильной архитектуре и масштабе это создаёт **поведение**, неотличимое от рассуждения.",
        },
      ],
    },
    {
      id: "tokens",
      title: "Токены — не слова",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**Токен** — это не слово и не символ. Это кусок текста, на который модель разрезает вход. Обычно 3-4 символа в английском.",
        },
        {
          type: "code",
          language: "text",
          content: `"Hello, world!"
        ↓ токенизация
["Hello", ",", " world", "!"]
       (4 токена)

"Привет, мир!"
        ↓
["П", "ри", "вет", ",", " м", "ир", "!"]
       (~7 токенов)`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Русский дороже",
          content:
            "Английский: ~1 токен на 0.75 слова. Русский: ~1 токен на 0.3-0.5 слова. **Один и тот же смысл на русском — в 2-3 раза дороже**.",
        },
        {
          type: "text",
          content:
            "**Зачем это знать:**\n\n- API считает деньги по токенам, не по словам\n- Контекстное окно измеряется в токенах\n- Время ответа пропорционально количеству выходных токенов\n- Длина выхода ограничена в токенах (`max_tokens`)",
        },
        {
          type: "resources",
          items: [
            {
              title: "OpenAI Tokenizer Playground",
              url: "https://platform.openai.com/tokenizer",
              description: "Вставь текст — посмотри как он разбивается на токены. Очень наглядно.",
            },
            {
              title: "Anthropic Token Counting",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/token-counting",
              description: "Официальные доки про подсчёт токенов в Claude API.",
            },
          ],
        },
      ],
    },
    {
      id: "context-window",
      title: "Контекстное окно",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Контекстное окно** — это максимальное количество токенов, которые модель может «видеть» за один запрос. Включает:\n\n- Системный промпт\n- Всю историю диалога\n- Текущий вопрос\n- Сгенерированный ответ",
        },
        {
          type: "text",
          content:
            "Текущие модели Claude (2026):\n\n- **Haiku 4.5** — 200K токенов\n- **Sonnet 4.6** — 200K токенов\n- **Opus 4.7** — 200K токенов\n\n200K токенов ≈ 150 000 английских слов ≈ книга на 500 страниц.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Если контекст переполнен",
          content:
            "Стратегии: **обрезать** старые сообщения, **суммаризировать** длинные куски в короткое summary (другим запросом к LLM), **RAG** — хранить знания снаружи и подгружать только релевантные куски.",
        },
      ],
    },
    {
      id: "temperature",
      title: "Температура и параметры генерации",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Температура** (`temperature`, 0.0 — 1.0) — параметр случайности.\n\n- **0** — детерминированный, всегда одинаковый ответ\n- **0.3** — слегка вариативный (стандарт для большинства задач)\n- **0.7** — креативный (стандарт для генерации текста)\n- **1.0** — максимум разнообразия (для брейншторма)",
        },
        {
          type: "code",
          language: "python",
          content: `# Классификация — детерминизм важнее креативности
response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    temperature=0,
    messages=[...]
)

# Генерация креативного текста
response = client.messages.create(
    model="claude-opus-4-7",
    temperature=0.7,
    messages=[...]
)`,
        },
        {
          type: "text",
          content:
            "Другие параметры:\n\n- `max_tokens` — максимум токенов на выходе\n- `top_p` (nucleus sampling) — альтернатива temperature\n- `stop_sequences` — список стоп-слов, при появлении которых генерация прекращается",
        },
      ],
    },
    {
      id: "system-vs-user",
      title: "System prompt vs User message",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**System prompt** — инструкция «кто ты, как себя ведёшь». Пишется один раз, действует на весь диалог.\n\n**User message** — конкретный запрос пользователя.",
        },
        {
          type: "code",
          language: "python",
          content: `client.messages.create(
    model="claude-haiku-4-5-20251001",
    system="Ты профессиональный переводчик с английского на русский. "
           "Сохраняй стиль оригинала. Не объясняй переводы.",
    messages=[
        {"role": "user", "content": "Translate: The quick brown fox"}
    ]
)`,
        },
      ],
    },
    {
      id: "hallucinations",
      title: "Почему LLM галлюцинируют",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Галлюцинация** — модель уверенно сообщает вымышленную информацию. Это не баг, а **фундаментальное свойство** LLM:",
        },
        {
          type: "text",
          content:
            "- Модель оптимизирована на **правдоподобный** ответ, а не **правдивый**\n- Она не знает, что она знает (нет калибровки уверенности)\n- При нехватке данных «дорисовывает» по паттернам\n- Особенно опасно с цифрами, датами, цитатами, ссылками",
        },
        {
          type: "callout",
          variant: "danger",
          title: "Реальные примеры",
          content:
            "Адвокат использовал ChatGPT для подготовки иска. Модель сгенерировала список «прецедентов», которые **не существовали**. Адвоката оштрафовали. Всегда проверяй фактические утверждения LLM, особенно ссылки и числа.",
        },
        {
          type: "text",
          content:
            "**Как бороться:**\n\n1. **RAG** — давай модели достоверный контекст, требуй опираться на него\n2. **Tool use** — для фактов вызывай реальные инструменты (поиск, БД)\n3. **Низкая температура** — меньше «креативности»\n4. **Эвалы** — систематически тестируй на правдивость\n5. **Уточняй неуверенность** — «если не знаешь, скажи „не знаю“»",
        },
      ],
    },
    {
      id: "resources-llm",
      title: "Ресурсы",
      estimatedMinutes: 0,
      blocks: [
        {
          type: "resources",
          items: [
            {
              title: "Andrej Karpathy — Intro to LLMs (1h, YouTube)",
              url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
              description: "Лучшее введение в LLM в мире. Обязательно к просмотру.",
            },
            {
              title: "3Blue1Brown — Neural networks series",
              url: "https://www.youtube.com/@3blue1brown",
              description: "Визуальное объяснение нейросетей и трансформеров.",
            },
            {
              title: "Anthropic Models — документация",
              url: "https://docs.anthropic.com/en/docs/about-claude/models",
              description: "Сравнение моделей Claude, лимиты, цены.",
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
          emoji: "🏎️",
          title: "Параметры росли как сумасшедшие",
          content:
            "**GPT-1 (2018)** — 117M параметров. **GPT-2** — 1.5B. **GPT-3** — 175B. **GPT-4** — оценочно 1.7T. За 6 лет рост в **14 500 раз**. Для сравнения: человеческий мозг — около 86B нейронов с триллионами связей. Но скилл за параметры: модель в 1B параметров может уверенно объяснить тебе квантовую механику, а 14B — превзойти среднего студента на ЕГЭ.",
        },
        {
          type: "funfact",
          emoji: "📜",
          title: "Claude назван в честь Клода Шеннона",
          content:
            "**Клод Шеннон** — отец теории информации, в 1948 году он ввёл понятие **бита**. Anthropic, основанная экс-сотрудниками OpenAI (Dario и Daniela Amodei), назвала свою модель в его честь. У OpenAI же модели «GPT» — Generative Pretrained Transformer, скучно. У Anthropic — Claude. У Google — Gemini. У Meta — Llama. AI-индустрия любит имена собственные.",
        },
        {
          type: "funfact",
          emoji: "🎭",
          title: "Галлюцинации с историческим именем",
          content:
            "Термин «галлюцинации LLM» закрепился случайно. До 2020 года говорили «confabulation» (как у людей с амнезией). Но «hallucination» прижилось из-за статей по computer vision, где модели «видели» несуществующие объекты. Сейчас в академических кругах **спорят, что это плохой термин** — модель не видит вещи, она статистически предсказывает. Но мем уже не убрать.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Что LLM делает на самом базовом уровне?",
      options: [
        { id: "a", text: "Понимает смысл текста и формирует ответ" },
        { id: "b", text: "Предсказывает следующий токен" },
        { id: "c", text: "Ищет ответ в базе данных" },
        { id: "d", text: "Генерирует случайный текст по правилам" },
      ],
      correctOptionId: "b",
      explanation:
        "LLM — это next-token predictor. Всё остальное (диалог, рассуждения, код) — эмерджентные свойства этого простого механизма при достаточном масштабе.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Сколько примерно токенов в фразе 'Hello, world!' (английский)?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "3-4" },
        { id: "c", text: "12 (по символам)" },
        { id: "d", text: "2 (по словам)" },
      ],
      correctOptionId: "b",
      explanation:
        "Английский: примерно 1 токен на 0.75 слова. 'Hello, world!' разбивается на ~4 токена. Русский текст той же длины — в 2-3 раза больше токенов.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Что входит в контекстное окно LLM? (несколько)",
      options: [
        { id: "a", text: "Системный промпт" },
        { id: "b", text: "Вся история сообщений диалога" },
        { id: "c", text: "Сгенерированный ответ" },
        { id: "d", text: "Веса модели" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Контекст — это всё, что модель «видит» в одном запросе. Веса модели — это её обученное «знание», они существуют отдельно от контекста и не считаются.",
    },
    {
      id: "q4",
      type: "single-choice",
      question:
        "Тебе нужно сделать классификатор отзывов (positive/negative/neutral). Какая температура подходит лучше?",
      options: [
        { id: "a", text: "0 — нужен детерминированный ответ" },
        { id: "b", text: "0.5 — баланс" },
        { id: "c", text: "1.0 — креативность важна" },
        { id: "d", text: "Любая, не имеет значения" },
      ],
      correctOptionId: "a",
      explanation:
        "Для классификации нужна стабильность и воспроизводимость. Один и тот же отзыв должен классифицироваться одинаково. Температура 0 это даёт.",
    },
    {
      id: "q5",
      type: "text-input",
      question:
        "Какой параметр API задаёт максимальную длину выходного ответа в токенах?\nВведи только название поля (как в API).",
      correctAnswers: ["max_tokens", "max-tokens"],
      caseSensitive: false,
      explanation:
        "`max_tokens` — обязательный параметр в Anthropic API. Если ответ превысит лимит — он будет обрезан с `stop_reason: 'max_tokens'`.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Почему LLM могут уверенно врать (галлюцинировать)?",
      options: [
        { id: "a", text: "Из-за бага в коде модели" },
        { id: "b", text: "Они оптимизированы на правдоподобие, а не правдивость" },
        { id: "c", text: "Они намеренно обманывают" },
        { id: "d", text: "Только старые модели — в новых это починили" },
      ],
      correctOptionId: "b",
      explanation:
        "Это фундаментальное свойство: модель выбирает следующий токен по вероятности, а правдоподобный ≠ правдивый. Современные модели галлюцинируют меньше, но не нулём.",
    },
    {
      id: "q7",
      type: "multiple-choice",
      question: "Какие техники помогают **снизить** галлюцинации? (несколько)",
      options: [
        { id: "a", text: "RAG — давать модели проверенный контекст" },
        { id: "b", text: "Tool use — для фактов звать реальные инструменты" },
        { id: "c", text: "Повысить температуру для разнообразия" },
        { id: "d", text: "В промпте просить ответить 'не знаю', если не уверена" },
      ],
      correctOptionIds: ["a", "b", "d"],
      explanation:
        "Высокая температура наоборот **увеличивает** галлюцинации (больше разнообразия — больше шанс выдумки). Остальные три — стандартные приёмы.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Эвристическая оценка токенов",
      description:
        "Напиши функцию `estimate_tokens(text, lang)`, которая грубо оценивает количество токенов:\n\n- Для английского: 1 токен ≈ 4 символа\n- Для русского: 1 токен ≈ 2 символа\n\nЭто не точно (на реальной токенизации цифры будут другие), но даёт интуицию.",
      starterCode: `def estimate_tokens(text: str, lang: str = "en") -> int:
    # Допиши
    pass


# Тесты
print(estimate_tokens("Hello, world!", "en"))     # ~3
print(estimate_tokens("Привет, мир!", "ru"))      # ~6
print(estimate_tokens("a" * 100, "en"))           # 25
print(estimate_tokens("я" * 100, "ru"))           # 50
`,
      solutionCode: `def estimate_tokens(text: str, lang: str = "en") -> int:
    if not text:
        return 0
    divisor = 4 if lang == "en" else 2
    return max(1, len(text) // divisor)


print(estimate_tokens("Hello, world!", "en"))
print(estimate_tokens("Привет, мир!", "ru"))
print(estimate_tokens("a" * 100, "en"))
print(estimate_tokens("я" * 100, "ru"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Калькулятор стоимости запроса",
      description:
        "Цены Anthropic Claude Haiku 4.5: **$0.80** за 1M input tokens, **$4** за 1M output tokens.\n\nНапиши функцию `calc_cost(input_tokens, output_tokens)`, которая возвращает стоимость в долларах.\n\nЗатем посчитай: сколько будет стоить чат-бот, который в день отвечает на 10000 запросов (средний запрос: 500 input + 200 output токенов)?",
      starterCode: `INPUT_COST_PER_M = 0.80
OUTPUT_COST_PER_M = 4.00


def calc_cost(input_tokens: int, output_tokens: int) -> float:
    # Допиши
    pass


# Один запрос
print(f"Один запрос: $\${calc_cost(500, 200):.4f}")

# 10000 запросов в день
daily = calc_cost(500 * 10000, 200 * 10000)
print(f"В день: $\${daily:.2f}")
print(f"В месяц (~30 дней): $\${daily * 30:.2f}")
`,
      solutionCode: `INPUT_COST_PER_M = 0.80
OUTPUT_COST_PER_M = 4.00


def calc_cost(input_tokens: int, output_tokens: int) -> float:
    input_cost = (input_tokens / 1_000_000) * INPUT_COST_PER_M
    output_cost = (output_tokens / 1_000_000) * OUTPUT_COST_PER_M
    return input_cost + output_cost


print(f"Один запрос: $\${calc_cost(500, 200):.4f}")
daily = calc_cost(500 * 10000, 200 * 10000)
print(f"В день: $\${daily:.2f}")
print(f"В месяц (~30 дней): $\${daily * 30:.2f}")`,
      language: "python",
      runnable: true,
      hints: [
        "Делишь количество токенов на 1_000_000, умножаешь на цену за миллион.",
        "Не забудь сложить input cost и output cost.",
      ],
    },
    {
      id: "p3",
      title: "Сравнение моделей: какую выбрать",
      description:
        "Дан словарь с характеристиками моделей. Напиши функцию `pick_model(task)`, которая по описанию задачи рекомендует модель:\n\n- Если задача содержит 'classify' / 'extract' / 'simple' → `haiku` (быстрая, дешёвая)\n- Если 'analyze' / 'code' / 'medium' → `sonnet` (баланс)\n- Если 'reasoning' / 'creative' / 'hard' → `opus` (самая мощная)\n- Иначе → `sonnet` (default)",
      starterCode: `MODELS = {
    "haiku": {"name": "claude-haiku-4-5", "input_per_m": 0.80, "output_per_m": 4.00},
    "sonnet": {"name": "claude-sonnet-4-6", "input_per_m": 3.00, "output_per_m": 15.00},
    "opus": {"name": "claude-opus-4-7", "input_per_m": 15.00, "output_per_m": 75.00},
}


def pick_model(task: str) -> str:
    task = task.lower()
    # Допиши логику
    pass


# Тесты
print(pick_model("classify this review"))           # haiku
print(pick_model("analyze the user behavior"))      # sonnet
print(pick_model("hard reasoning problem"))         # opus
print(pick_model("generate poem about love"))       # opus (creative)
print(pick_model("something random"))               # sonnet (default)
`,
      solutionCode: `MODELS = {
    "haiku": {"name": "claude-haiku-4-5", "input_per_m": 0.80, "output_per_m": 4.00},
    "sonnet": {"name": "claude-sonnet-4-6", "input_per_m": 3.00, "output_per_m": 15.00},
    "opus": {"name": "claude-opus-4-7", "input_per_m": 15.00, "output_per_m": 75.00},
}


def pick_model(task: str) -> str:
    task = task.lower()
    haiku_kw = ["classify", "extract", "simple"]
    opus_kw = ["reasoning", "creative", "hard"]
    if any(kw in task for kw in haiku_kw):
        return "haiku"
    if any(kw in task for kw in opus_kw):
        return "opus"
    return "sonnet"


print(pick_model("classify this review"))
print(pick_model("analyze the user behavior"))
print(pick_model("hard reasoning problem"))
print(pick_model("generate poem about love"))
print(pick_model("something random"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "Сборка messages для API",
      description:
        "Anthropic API ожидает диалог в формате `[{\"role\": \"user\"|\"assistant\", \"content\": \"...\"}]`.\n\nНапиши функцию `build_messages(history)`, которая принимает список кортежей `[(role, text), ...]` и возвращает корректную структуру для API.",
      starterCode: `def build_messages(history: list[tuple[str, str]]) -> list[dict]:
    # Допиши
    pass


history = [
    ("user", "Привет, кто ты?"),
    ("assistant", "Я Claude, помощник от Anthropic."),
    ("user", "Что ты умеешь?"),
]

import json
print(json.dumps(build_messages(history), ensure_ascii=False, indent=2))
`,
      solutionCode: `def build_messages(history: list[tuple[str, str]]) -> list[dict]:
    return [{"role": role, "content": text} for role, text in history]


history = [
    ("user", "Привет, кто ты?"),
    ("assistant", "Я Claude, помощник от Anthropic."),
    ("user", "Что ты умеешь?"),
]

import json
print(json.dumps(build_messages(history), ensure_ascii=False, indent=2))`,
      language: "python",
      runnable: true,
    },
  ],
  checkpoint: [
    "Можешь объяснить за 5 минут: токен, контекстное окно, температура",
    "Понимаешь, почему русский в 2-3 раза дороже английского по токенам",
    "Знаешь, чем отличаются Haiku/Sonnet/Opus по применению и цене",
    "Понимаешь, почему LLM галлюцинируют и как это снизить",
    "Готов на следующей неделе делать реальные API-вызовы к Claude",
  ],
};
