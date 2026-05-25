import type { Lesson } from "../types";

export const week09: Lesson = {
  id: "m3-w9",
  monthId: "month-03",
  weekNumber: 9,
  title: "Prompt engineering — техники",
  goal: "У тебя в голове 5-7 проверенных техник промпта, и ты знаешь, когда какую применять. Это уже ремесло, а не магия.",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "why-matters",
      title: "Почему промпт — это ремесло",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Между «работает на отвали» и «работает в продакшене» — разница в качестве промпта. Один и тот же Claude:",
        },
        {
          type: "code",
          language: "text",
          content: `Промпт A:
"Извлеки имя из текста: {text}"
→ 65% точность

Промпт B:
"Ты извлекаешь данные из текста.
Шаг 1: найди упоминание человека (имя+фамилия).
Шаг 2: верни ТОЛЬКО имя без фамилии.
Шаг 3: если человека нет — верни "—".

Текст: {text}
Имя:"
→ 92% точность

Один и тот же Claude. Та же модель. Разница: $0 vs $X в году на эвалах.`,
        },
      ],
    },
    {
      id: "zero-shot-few-shot",
      title: "Zero-shot vs Few-shot",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Zero-shot** — просто инструкция:",
        },
        {
          type: "code",
          language: "text",
          content: `Классифицируй отзыв как позитивный/негативный/нейтральный:
"Сервис ужасный, никогда не вернусь"`,
        },
        {
          type: "text",
          content:
            "**Few-shot** — даёшь 2-5 примеров перед задачей:",
        },
        {
          type: "code",
          language: "text",
          content: `Классифицируй отзыв (позитивный/негативный/нейтральный):

Отзыв: "Всё супер, оформили быстро"        → позитивный
Отзыв: "Сломалось через неделю"            → негативный
Отзыв: "Работает как ожидалось"            → нейтральный

Отзыв: "Сервис ужасный, никогда не вернусь" → ?`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Когда какой",
          content:
            "**Zero-shot** для очевидных задач (перевод, суммаризация). **Few-shot** — для классификаций, специфичных форматов, нестандартных правил. Few-shot обычно даёт +10-30% точности.",
        },
      ],
    },
    {
      id: "cot",
      title: "Chain-of-Thought (CoT)",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Идея:** заставь модель **рассуждать вслух** перед ответом. Это даёт ей больше «вычислительного времени» и повышает точность на логических задачах.",
        },
        {
          type: "code",
          language: "text",
          content: `Без CoT:
"У Маши 7 яблок. Она отдала половину Пете,
потом купила ещё 4. Сколько у неё яблок?"

→ "7" (ошибка)


С CoT:
"У Маши 7 яблок. Она отдала половину Пете,
потом купила ещё 4. Сколько у неё яблок?
Думай пошагово."

→ "Шаг 1: половина от 7 — это 3.5, округляем до 3.
   Шаг 2: 7 - 3 = 4 яблока у Маши.
   Шаг 3: 4 + 4 = 8 яблок.
   Ответ: 8" (правильно)`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Магические слова",
          content:
            "«Думай пошагово», «Сначала разбери задачу на шаги», «Покажи рассуждение» — всё это включает CoT. На современных моделях работает лучше всего на математике, логике, дебаге кода.",
        },
      ],
    },
    {
      id: "structured",
      title: "Structured prompting (XML-теги)",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Когда промпт сложный — разделяй его на блоки. Anthropic рекомендует **XML-теги**: Claude их различает особо хорошо.",
        },
        {
          type: "code",
          language: "text",
          content: `<role>
Ты редактор технического блога.
</role>

<task>
Перепиши черновик в финальную версию.
</task>

<style>
- Активный залог
- Параграфы не длиннее 3 предложений
- Никаких "Давайте поговорим о..."
- Конкретные примеры вместо абстракций
</style>

<draft>
{draft_text}
</draft>

<output_format>
Markdown. Заголовок H1, потом текст. Без вступительного "Вот ваша статья".
</output_format>`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Почему теги",
          content:
            "Без тегов — длинный промпт «всё сразу», модель путается что есть что. С тегами — чёткое разделение «вот роль / вот задача / вот данные / вот формат». Я лично использую это **везде** где промпт > 100 слов.",
        },
      ],
    },
    {
      id: "output-format",
      title: "Output formatting и stop sequences",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Управляй форматом явно:**\n\n- «Ответь одним словом: positive/negative/neutral»\n- «Ответь только числом без единиц»\n- «Ответь в виде маркированного списка из 5 пунктов»\n- «Ответь markdown-таблицей»\n- «Не используй markdown»",
        },
        {
          type: "code",
          language: "python",
          content: `# stop_sequences — гарантируют что модель не выйдет за рамки
response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=100,
    messages=[{"role": "user", "content": "Назови 3 столицы. Формат:\\n1. ...\\n2. ...\\n3. ...\\nКОНЕЦ"}],
    stop_sequences=["КОНЕЦ"],
)`,
        },
      ],
    },
    {
      id: "self-critique",
      title: "Self-critique (продвинуто)",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Two-pass prompting:** сначала ответ → потом критика → потом исправление.",
        },
        {
          type: "code",
          language: "python",
          content: `# Шаг 1: первичный ответ
draft = ask("Напиши краткое объяснение что такое RAG")

# Шаг 2: критика
critique = ask(f"""Вот черновик объяснения:
<draft>{draft}</draft>

Найди 3 проблемы:
- Что неточно?
- Что упущено?
- Что слишком сложно для новичка?""")

# Шаг 3: исправление
final = ask(f"""Перепиши черновик с учётом критики.

Черновик:
<draft>{draft}</draft>

Критика:
<critique>{critique}</critique>""")`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Цена",
          content:
            "Self-critique = 3x вызовов = 3x стоимости. Используй для важных однократных задач, не для real-time.",
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
              title: "Anthropic Prompt Engineering Guide",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
              description: "Официальный гайд. Обязателен.",
            },
            {
              title: "Anthropic Prompt Library",
              url: "https://docs.anthropic.com/en/prompt-library",
              description: "Готовые промпты от Anthropic для типовых задач.",
            },
            {
              title: "DeepLearning.AI — Prompt Engineering for Developers",
              url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
              description: "Бесплатный курс 1.5 часа. Andrew Ng + OpenAI.",
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
      question: "Что такое few-shot prompting?",
      options: [
        { id: "a", text: "Промпт длиной несколько слов" },
        { id: "b", text: "Даёшь модели несколько примеров перед задачей" },
        { id: "c", text: "Используешь Few framework вместо Anthropic SDK" },
        { id: "d", text: "Делаешь несколько вызовов параллельно" },
      ],
      correctOptionId: "b",
      explanation:
        "Few-shot = «несколько примеров». 2-5 примеров перед задачей резко повышают точность на классификациях и специфичных форматах.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Chain-of-Thought (CoT) — это...",
      options: [
        { id: "a", text: "Цепочка нескольких вызовов LLM" },
        { id: "b", text: "Просьба модели рассуждать пошагово перед ответом" },
        { id: "c", text: "Тип нейросети" },
        { id: "d", text: "Криптовалюта" },
      ],
      correctOptionId: "b",
      explanation:
        "«Думай пошагово» — простейший CoT-триггер. Особенно помогает на математике, логике, дебаге.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Что Anthropic рекомендует для разделения частей сложного промпта?",
      options: [
        { id: "a", text: "XML-теги вроде <task>, <context>, <examples>" },
        { id: "b", text: "Markdown заголовки H1/H2/H3" },
        { id: "c", text: "Просто пустые строки" },
        { id: "d", text: "ASCII-арт разделители" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "Claude обучен особенно хорошо различать XML-теги. Markdown тоже работает, но XML — рекомендация номер один Anthropic.",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Когда лучше использовать zero-shot, а когда few-shot?",
      options: [
        { id: "a", text: "Few-shot всегда лучше" },
        { id: "b", text: "Few-shot для специфичных форматов и классификаций; zero-shot для очевидного" },
        { id: "c", text: "Zero-shot для дорогих моделей, few-shot для дешёвых" },
        { id: "d", text: "Только zero-shot на проде, few-shot только для отладки" },
      ],
      correctOptionId: "b",
      explanation:
        "Few-shot тратит токены на примеры, потому не нужен для очевидных задач. Но для нюансов он бесценен.",
    },
    {
      id: "q5",
      type: "text-input",
      question:
        "Параметр API, который гарантированно прекращает генерацию при появлении указанного текста — это...\nВведи название поля.",
      correctAnswers: ["stop_sequences", "stop-sequences"],
      caseSensitive: false,
      explanation:
        "`stop_sequences=['КОНЕЦ']` — модель остановится сразу как сгенерирует «КОНЕЦ» (и сам токен в ответе не появится).",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Self-critique — это техника когда...",
      options: [
        { id: "a", text: "LLM критикует себя в одном вызове" },
        { id: "b", text: "Двух- или трёхходовой паттерн: ответ → критика → исправление" },
        { id: "c", text: "Человек ревьюит ответы LLM" },
        { id: "d", text: "LLM просит пользователя дать обратную связь" },
      ],
      correctOptionId: "b",
      explanation:
        "Многоходовой — обычно 3 вызова. Дорого, но даёт качество выше одиночного вызова. Используется для важных однократных задач.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Промптбук — твоя личная библиотека",
      description:
        "Класс `PromptBook` для хранения промптов:\n- `add(name, template, description=None)` — добавить шаблон с переменными `{var}`\n- `render(name, **vars)` — подставить переменные и вернуть строку\n- `list_names()` — список всех имён\n- При попытке отрендерить с отсутствующей переменной — `KeyError` с понятным сообщением",
      starterCode: `class PromptBook:
    def __init__(self):
        self.prompts: dict[str, dict] = {}

    def add(self, name: str, template: str, description: str = None) -> None:
        # Допиши
        pass

    def render(self, name: str, **vars) -> str:
        # str.format(**vars) бросит KeyError если переменной нет — оберни в осмысленное сообщение
        pass

    def list_names(self) -> list[str]:
        # Допиши
        pass


book = PromptBook()
book.add(
    "classify_review",
    "Классифицируй отзыв (positive/negative/neutral):\\n{review}\\n\\nКатегория:",
    description="Классификация отзыва"
)
book.add(
    "extract_name",
    "<task>Извлеки имя из текста</task>\\n<text>{text}</text>\\n<output>Только имя, ничего больше</output>"
)

print(book.list_names())
print()
print(book.render("classify_review", review="Сервис отличный, спасибо!"))
print()
try:
    book.render("extract_name", wrong_var="...")
except KeyError as e:
    print(f"Ожидаемая ошибка: {e}")
`,
      solutionCode: `class PromptBook:
    def __init__(self):
        self.prompts: dict[str, dict] = {}

    def add(self, name: str, template: str, description: str = None) -> None:
        self.prompts[name] = {"template": template, "description": description}

    def render(self, name: str, **vars) -> str:
        if name not in self.prompts:
            raise KeyError(f"Промпт '{name}' не найден")
        template = self.prompts[name]["template"]
        try:
            return template.format(**vars)
        except KeyError as e:
            raise KeyError(f"В промпте '{name}' не указана переменная: {e}")

    def list_names(self) -> list[str]:
        return list(self.prompts.keys())


book = PromptBook()
book.add("classify_review", "Классифицируй отзыв (positive/negative/neutral):\\n{review}\\n\\nКатегория:")
book.add("extract_name", "<task>Извлеки имя из текста</task>\\n<text>{text}</text>\\n<output>Только имя, ничего больше</output>")

print(book.list_names())
print()
print(book.render("classify_review", review="Сервис отличный, спасибо!"))
print()
try:
    book.render("extract_name", wrong_var="...")
except KeyError as e:
    print(f"Ожидаемая ошибка: {e}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Few-shot builder",
      description:
        "Утилита, которая собирает few-shot промпт из примеров.\n\nФункция `build_few_shot(instruction, examples, query)`:\n- `instruction` — строка инструкции\n- `examples` — список `[(input, output), ...]`\n- `query` — текущий вопрос\n\nФормат вывода:\n```\n{instruction}\n\nПример 1:\nВход: {ex_input}\nВыход: {ex_output}\n\n(остальные примеры)\n\nВход: {query}\nВыход:\n```",
      starterCode: `def build_few_shot(
    instruction: str,
    examples: list[tuple[str, str]],
    query: str,
) -> str:
    # Допиши
    pass


prompt = build_few_shot(
    instruction="Классифицируй отзыв (positive/negative/neutral)",
    examples=[
        ("Очень доволен покупкой", "positive"),
        ("Сломалось через неделю", "negative"),
        ("Работает", "neutral"),
    ],
    query="Сервис ужасный, никогда не вернусь"
)

print(prompt)
`,
      solutionCode: `def build_few_shot(
    instruction: str,
    examples: list[tuple[str, str]],
    query: str,
) -> str:
    parts = [instruction, ""]
    for i, (inp, out) in enumerate(examples, 1):
        parts.append(f"Пример {i}:")
        parts.append(f"Вход: {inp}")
        parts.append(f"Выход: {out}")
        parts.append("")
    parts.append(f"Вход: {query}")
    parts.append("Выход:")
    return "\\n".join(parts)


prompt = build_few_shot(
    instruction="Классифицируй отзыв (positive/negative/neutral)",
    examples=[
        ("Очень доволен покупкой", "positive"),
        ("Сломалось через неделю", "negative"),
        ("Работает", "neutral"),
    ],
    query="Сервис ужасный, никогда не вернусь"
)

print(prompt)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Структурированный промпт в XML",
      description:
        "Функция `build_xml_prompt(sections)` принимает словарь `{tag: content}` и собирает XML-промпт.\n\nПорядок тегов = порядок ключей в словаре (Python 3.7+ сохраняет insertion order).",
      starterCode: `def build_xml_prompt(sections: dict[str, str]) -> str:
    # Каждая секция: <tag>\\ncontent\\n</tag>\\n\\n
    pass


prompt = build_xml_prompt({
    "role": "Ты опытный редактор",
    "task": "Перепиши текст в активном залоге",
    "draft": "Документ был подписан вчера комиссией.",
    "output_format": "Только переписанный текст, без комментариев",
})

print(prompt)
`,
      solutionCode: `def build_xml_prompt(sections: dict[str, str]) -> str:
    parts = []
    for tag, content in sections.items():
        parts.append(f"<{tag}>\\n{content}\\n</{tag}>")
    return "\\n\\n".join(parts)


prompt = build_xml_prompt({
    "role": "Ты опытный редактор",
    "task": "Перепиши текст в активном залоге",
    "draft": "Документ был подписан вчера комиссией.",
    "output_format": "Только переписанный текст, без комментариев",
})

print(prompt)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: сравни промпты на эвалах",
      description:
        "Возьми любую задачу классификации (например, тон отзыва). Напиши **два** промпта:\n\n- **Версия A** — zero-shot, простая инструкция\n- **Версия B** — XML-структурированный + few-shot с 3 примерами\n\n**Шаги:**\n\n1. Подбери 20 тестовых отзывов с известным правильным ответом\n2. Прогоняй каждый через оба промпта (Haiku, temperature=0)\n3. Считай точность: сколько раз модель угадала из 20\n4. Считай стоимость каждого прогона\n5. Сделай вывод: на сколько % B лучше A, на сколько % дороже\n\n**Это твой первый эвал!** Без таких сравнений ты не сможешь понять, делает ли promt-engineering лучше.",
      starterCode: `# Скелет
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()

# Датасет (расширь до 20)
TESTS = [
    ("Сервис отличный, всё в срок", "positive"),
    ("Сломалось через неделю", "negative"),
    ("Работает как ожидал", "neutral"),
    # ...
]

PROMPT_A = """Классифицируй отзыв (positive/negative/neutral):
{review}

Ответ:"""

PROMPT_B = """<role>Ты классификатор тональности отзывов</role>

<task>Определи тональность: positive / negative / neutral</task>

<examples>
Отзыв: "Очень доволен покупкой"      → positive
Отзыв: "Не работает после месяца"     → negative
Отзыв: "Работает, как заявлено"       → neutral
</examples>

<input>{review}</input>

<output>Только одно слово: positive / negative / neutral</output>"""


def classify(prompt_template: str, review: str) -> tuple[str, int, int]:
    prompt = prompt_template.format(review=review)
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=10,
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    answer = response.content[0].text.strip().lower()
    return answer, response.usage.input_tokens, response.usage.output_tokens


def evaluate(prompt_name: str, prompt: str, tests: list) -> None:
    correct = 0
    total_input = 0
    total_output = 0
    for review, expected in tests:
        answer, inp, out = classify(prompt, review)
        total_input += inp
        total_output += out
        if expected in answer:
            correct += 1
        else:
            print(f"  ✗ '{review[:40]}' → ожидали {expected}, получили {answer}")
    accuracy = correct / len(tests) * 100
    cost = (total_input / 1e6) * 0.80 + (total_output / 1e6) * 4.00
    print(f"\\n{prompt_name}: {accuracy:.1f}% точность, $\${cost:.6f} на {len(tests)} запросов\\n")


evaluate("Версия A (zero-shot)", PROMPT_A, TESTS)
evaluate("Версия B (few-shot + XML)", PROMPT_B, TESTS)
`,
      language: "python",
      runnable: false,
      hints: [
        "Закладывай разнообразие в тестовый датасет — короткие, длинные, с сарказмом.",
        "Если на 20 примерах разница не видна — увеличь до 50.",
      ],
    },
  ],
  checkpoint: [
    "Знаешь когда применять zero-shot vs few-shot",
    "Применяешь Chain-of-Thought для логических задач",
    "Структурируешь сложные промпты через XML-теги",
    "Завёл и пополняешь свой promptbook",
    "Локально провёл свой первый эвал двух версий промпта",
  ],
};
