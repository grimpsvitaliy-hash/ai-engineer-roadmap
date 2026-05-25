import type { Lesson } from "../types";

export const week07: Lesson = {
  id: "m2-w7",
  monthId: "month-02",
  weekNumber: 7,
  title: "Многоходовой диалог и structured outputs",
  goal: "Можешь построить чат с памятью контекста. Получаешь от LLM строго структурированный JSON, который надёжно парсится.",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "stateless",
      title: "LLM stateless: память — на твоей стороне",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "Ключевая идея",
          content:
            "LLM ничего не помнит между запросами. Каждый запрос — это полный диалог, отправляемый заново. «Память» чат-бота — это просто **список сообщений на твоей стороне**, который ты дописываешь и отправляешь целиком.",
        },
        {
          type: "code",
          language: "python",
          content: `# Простой чат с памятью
history = []

while True:
    user_input = input("Ты: ")
    if user_input == "/quit":
        break

    # Добавляем ввод в историю
    history.append({"role": "user", "content": user_input})

    # Отправляем ВСЮ историю
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system="Ты дружелюбный ассистент.",
        messages=history,  # <— всё, что было до этого момента
    )

    reply = response.content[0].text
    history.append({"role": "assistant", "content": reply})
    print(f"Бот: {reply}\\n")`,
        },
      ],
    },
    {
      id: "context-overflow",
      title: "Что делать с раздувшейся историей",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "После 50-100 сообщений диалог растёт и:\n\n1. **Дорожает** — каждый запрос платит за всю историю\n2. **Тормозит** — больше input токенов → больше latency\n3. **Размывает фокус** — модель теряется в шуме",
        },
        {
          type: "text",
          content:
            "**Три стратегии:**",
        },
        {
          type: "code",
          language: "python",
          content: `# 1. Sliding window — оставляем только последние N сообщений
def trim_history(history, max_messages=20):
    return history[-max_messages:]


# 2. Summarization — длинная история превращается в краткое summary
def summarize_old(history, keep_recent=10):
    if len(history) <= keep_recent:
        return history
    to_summarize = history[:-keep_recent]
    recent = history[-keep_recent:]

    summary_text = "\\n".join(f"{m['role']}: {m['content']}" for m in to_summarize)
    summary_resp = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"Суммаризируй эту переписку в 5 предложений:\\n\\n{summary_text}"
        }]
    )
    summary = summary_resp.content[0].text

    return [
        {"role": "user", "content": f"[Контекст из предыдущей беседы]: {summary}"},
        {"role": "assistant", "content": "Понял, продолжаем."},
        *recent
    ]


# 3. Гибрид — суммаризация + sliding window`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Прагматично",
          content:
            "Для большинства приложений хватит **простого sliding window** (последние 20-40 сообщений). Суммаризация имеет смысл для длинных консультаций / обучения / терапии — где старый контекст реально нужен.",
        },
      ],
    },
    {
      id: "structured-outputs",
      title: "Structured outputs — JSON по контракту",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**Проблема:** LLM возвращает текст. Чтобы программа его использовала, нужен **предсказуемый формат**. Парсить свободный текст регекспами — путь к боли.",
        },
        {
          type: "text",
          content:
            "**Решение:** заставить модель отвечать в JSON по схеме.",
        },
        {
          type: "text",
          content:
            "**Подход 1 — Просто попросить:**",
        },
        {
          type: "code",
          language: "python",
          content: `system_prompt = """Ты извлекаешь данные из текста.
Отвечай ТОЛЬКО валидным JSON, без markdown-обёртки, без пояснений.

Схема:
{
  "name": string,
  "age": int | null,
  "skills": string[]
}
"""

response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=500,
    system=system_prompt,
    messages=[{
        "role": "user",
        "content": "Вася Пупкин, 28 лет, знает Python и SQL"
    }]
)

import json
data = json.loads(response.content[0].text)
print(data)
# {"name": "Вася Пупкин", "age": 28, "skills": ["Python", "SQL"]}`,
        },
        {
          type: "text",
          content:
            "**Подход 2 — Tool use для гарантированной структуры** (надёжнее):",
        },
        {
          type: "code",
          language: "python",
          content: `# Tools будем глубже изучать в месяце 3.
# Здесь — превью: tool становится «контрактом» для ответа.

extract_tool = {
    "name": "extract_person",
    "description": "Извлекает данные о человеке из текста",
    "input_schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "age": {"type": "integer", "nullable": True},
            "skills": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["name", "skills"]
    }
}

response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=500,
    tools=[extract_tool],
    tool_choice={"type": "tool", "name": "extract_person"},
    messages=[{"role": "user", "content": "Вася Пупкин, 28 лет, знает Python"}]
)

# Структура гарантирована схемой:
data = response.content[0].input
print(data)`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Защитное парсинг",
          content:
            "Даже с подходом 1 — модель иногда оборачивает JSON в ` ```json ... ``` ` или добавляет «Вот ваш ответ:». Делай функцию `extract_json(text)` которая аккуратно вырезает первый `{...}` блок.",
        },
        {
          type: "code",
          language: "python",
          content: `import json
import re

def extract_json(text: str) -> dict:
    # Убираем markdown-обёртки
    text = re.sub(r"^\\s*\`\`\`(?:json)?", "", text)
    text = re.sub(r"\`\`\`\\s*$", "", text)
    # Ищем первый JSON-объект
    match = re.search(r"\\{.*\\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"JSON не найден в: {text[:100]}")
    return json.loads(match.group(0))`,
        },
      ],
    },
    {
      id: "tips",
      title: "Прагматика",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Чек-лист хорошего диалогового кода:**\n\n- ✅ История хранится явно (список dict-ов), не где-то в глобале SDK\n- ✅ Есть стратегия от переполнения (sliding или summarize)\n- ✅ Все ответы, идущие в код, — через structured output\n- ✅ Все «голые» строки от пользователя — экранируются от prompt injection (об этом в месяце 3)\n- ✅ Есть `try/except json.JSONDecodeError` с понятным сообщением\n- ✅ Логируешь токены и стоимость на каждый вызов",
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
              title: "Anthropic — Tool use (для structured output)",
              url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
              description: "Главный способ получить гарантированно структурированный ответ.",
            },
            {
              title: "Anthropic Cookbook — Structured outputs",
              url: "https://github.com/anthropics/anthropic-cookbook/tree/main/misc",
              description: "Готовые примеры извлечения данных.",
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
      question: "Где хранится «память» чат-бота между запросами к Claude?",
      options: [
        { id: "a", text: "На сервере Anthropic — модель помнит сессии" },
        { id: "b", text: "На стороне клиента — это список сообщений, отправляемый каждый раз" },
        { id: "c", text: "В файле логов модели" },
        { id: "d", text: "В cookie браузера" },
      ],
      correctOptionId: "b",
      explanation:
        "LLM абсолютно stateless. Между запросами она ничего не помнит. «Память» — иллюзия, создаваемая тем, что ты каждый раз отправляешь весь предыдущий диалог.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Какие проблемы возникают, когда история диалога растёт? (несколько)",
      options: [
        { id: "a", text: "Каждый запрос становится дороже (платим за всю историю)" },
        { id: "b", text: "Растёт время ответа" },
        { id: "c", text: "Модель может потерять фокус из-за шума" },
        { id: "d", text: "Anthropic блокирует длинные диалоги" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Все три проблемы реальны. Anthropic ничего не блокирует пока ты в пределах контекстного окна.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Простейшая стратегия борьбы с раздуванием истории называется...",
      options: [
        { id: "a", text: "Quantization" },
        { id: "b", text: "Sliding window — оставляем последние N сообщений" },
        { id: "c", text: "Fine-tuning" },
        { id: "d", text: "RAG" },
      ],
      correctOptionId: "b",
      explanation:
        "Sliding window — самый простой и часто достаточный. Суммаризация — мощнее, но дороже (доп. вызов LLM).",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Почему лучше получать ответ LLM в формате JSON по схеме, чем парсить свободный текст?",
      options: [
        { id: "a", text: "JSON быстрее по сети" },
        { id: "b", text: "Это контракт — код, потребляющий JSON, надёжнее парсинга текста" },
        { id: "c", text: "LLM лучше думают в JSON" },
        { id: "d", text: "Anthropic берёт меньше денег за JSON" },
      ],
      correctOptionId: "b",
      explanation:
        "Это инженерный аргумент: предсказуемая структура → меньше edge cases в твоём коде → меньше багов.",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "Какие 2 подхода применяют для получения структурированного ответа от Claude?",
      options: [
        { id: "a", text: "Просить ответить в JSON в system prompt + парсить вручную" },
        { id: "b", text: "Использовать tool use со схемой — гарантированный формат" },
        { id: "c", text: "Звонить в support Anthropic" },
        { id: "d", text: "Использовать регулярные выражения по тексту" },
      ],
      correctOptionIds: ["a", "b"],
      explanation:
        "(a) — простой подход, работает в 90% случаев. (b) — надёжнее через tool use со схемой JSON Schema. (d) — антипаттерн, регексп ломается на первом неожиданном символе.",
    },
    {
      id: "q6",
      type: "single-choice",
      question:
        "Ты получил от Claude ответ, в котором JSON обёрнут в markdown:\n\n```\n```json\n{\"name\": \"Anna\"}\n```\n```\n\nЧто делать?",
      options: [
        { id: "a", text: "Передать в json.loads() как есть" },
        { id: "b", text: "Написать защитный парсер, который вырежет markdown-обёртку" },
        { id: "c", text: "Пожаловаться Anthropic" },
        { id: "d", text: "Передать обратно Claude чтобы переделал" },
      ],
      correctOptionId: "b",
      explanation:
        "Defensive parsing — стандарт. Можно усилить промпт «без markdown», но **всегда** парси защитно: модель может ошибиться.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Sliding window для истории",
      description:
        "Напиши функцию `trim_history(history, max_messages)`, которая возвращает последние `max_messages` сообщений из истории.\n\nДополнительно: гарантируй что **первое** сообщение всегда `'user'` (если первое — `'assistant'`, удали его).",
      starterCode: `def trim_history(history: list[dict], max_messages: int) -> list[dict]:
    # Шаг 1: взять последние max_messages
    # Шаг 2: если первое сообщение - assistant, отрезать его
    pass


# Тесты
h = [
    {"role": "user", "content": "msg1"},
    {"role": "assistant", "content": "msg2"},
    {"role": "user", "content": "msg3"},
    {"role": "assistant", "content": "msg4"},
    {"role": "user", "content": "msg5"},
    {"role": "assistant", "content": "msg6"},
]

print(trim_history(h, 4))
# Должно начинаться с user, всего 3 или 4 сообщения
`,
      solutionCode: `def trim_history(history: list[dict], max_messages: int) -> list[dict]:
    trimmed = history[-max_messages:]
    while trimmed and trimmed[0]["role"] == "assistant":
        trimmed = trimmed[1:]
    return trimmed


h = [
    {"role": "user", "content": "msg1"},
    {"role": "assistant", "content": "msg2"},
    {"role": "user", "content": "msg3"},
    {"role": "assistant", "content": "msg4"},
    {"role": "user", "content": "msg5"},
    {"role": "assistant", "content": "msg6"},
]

print(trim_history(h, 4))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Защитный парсинг JSON",
      description:
        "Реальная LLM иногда возвращает JSON с обёрткой. Напиши функцию `extract_json(text)`, которая извлекает первый JSON-объект из любого текста.\n\nДолжна работать на:\n- Чистый JSON\n- JSON в markdown ` ```json ... ``` `\n- JSON с пояснениями до и после\n- Бросает `ValueError` если JSON не найден",
      starterCode: `import json
import re


def extract_json(text: str) -> dict:
    # Подсказка: re.search(r"\\{.*\\}", text, re.DOTALL) найдёт первый {...} блок
    pass


# Тесты
test_cases = [
    '{"name": "Anna"}',
    '\`\`\`json\\n{"name": "Boris", "age": 30}\\n\`\`\`',
    'Вот ваш JSON: {"city": "Moscow"} надеюсь подходит',
    '\`\`\`\\n{"nested": {"a": 1, "b": [2, 3]}}\\n\`\`\`',
]

for t in test_cases:
    try:
        result = extract_json(t)
        print(f"OK: {result}")
    except Exception as e:
        print(f"FAIL: {e}")

# Должна упасть:
try:
    extract_json("вообще нет json здесь")
except ValueError as e:
    print(f"Ожидаемая ошибка: {e}")
`,
      solutionCode: `import json
import re


def extract_json(text: str) -> dict:
    match = re.search(r"\\{.*\\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"JSON-объект не найден в тексте: {text[:80]}...")
    return json.loads(match.group(0))


test_cases = [
    '{"name": "Anna"}',
    '\`\`\`json\\n{"name": "Boris", "age": 30}\\n\`\`\`',
    'Вот ваш JSON: {"city": "Moscow"} надеюсь подходит',
    '\`\`\`\\n{"nested": {"a": 1, "b": [2, 3]}}\\n\`\`\`',
]

for t in test_cases:
    try:
        result = extract_json(t)
        print(f"OK: {result}")
    except Exception as e:
        print(f"FAIL: {e}")

try:
    extract_json("вообще нет json здесь")
except ValueError as e:
    print(f"Ожидаемая ошибка: {e}")`,
      language: "python",
      runnable: true,
      hints: [
        "Регексп `\\{.*\\}` с флагом `re.DOTALL` найдёт первый JSON-блок включая переносы строк.",
        "`re.DOTALL` делает `.` совпадать с переводом строки тоже.",
      ],
    },
    {
      id: "p3",
      title: "Класс ChatSession",
      description:
        "Сложи всё вместе. Класс `ChatSession`:\n\n- `__init__(system, max_history=20)` — стартовые установки\n- `send(user_message)` → возвращает «ответ» (для теста — заглушку `'Echo: {message}'`)\n- Автоматически обрезает историю до `max_history` сообщений\n- Поле `messages` — текущая история в формате API\n- `reset()` — очищает историю",
      starterCode: `class ChatSession:
    def __init__(self, system: str, max_history: int = 20):
        self.system = system
        self.max_history = max_history
        self.messages = []

    def send(self, user_message: str) -> str:
        # 1. Добавить user-сообщение
        # 2. "Получить" ответ (заглушка: f"Echo: {user_message}")
        # 3. Добавить ответ ассистента в историю
        # 4. Обрезать историю до max_history
        # 5. Вернуть ответ
        pass

    def reset(self) -> None:
        self.messages = []


# Тест
chat = ChatSession(system="Ты бот", max_history=4)
print(chat.send("Привет"))
print(chat.send("Как дела?"))
print(chat.send("Что нового?"))
print(chat.send("Ещё раз"))
print(f"\\nИстория ({len(chat.messages)} сообщений):")
for m in chat.messages:
    print(f"  {m['role']}: {m['content']}")
`,
      solutionCode: `class ChatSession:
    def __init__(self, system: str, max_history: int = 20):
        self.system = system
        self.max_history = max_history
        self.messages = []

    def send(self, user_message: str) -> str:
        self.messages.append({"role": "user", "content": user_message})
        reply = f"Echo: {user_message}"
        self.messages.append({"role": "assistant", "content": reply})
        if len(self.messages) > self.max_history:
            self.messages = self.messages[-self.max_history:]
            while self.messages and self.messages[0]["role"] == "assistant":
                self.messages = self.messages[1:]
        return reply

    def reset(self) -> None:
        self.messages = []


chat = ChatSession(system="Ты бот", max_history=4)
print(chat.send("Привет"))
print(chat.send("Как дела?"))
print(chat.send("Что нового?"))
print(chat.send("Ещё раз"))
print(f"\\nИстория ({len(chat.messages)} сообщений):")
for m in chat.messages:
    print(f"  {m['role']}: {m['content']}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: извлечение данных через Claude",
      description:
        "На своей машине напиши скрипт, который через Claude извлекает структурированные данные из свободного текста.\n\n**Что построить:**\n\nФункция `extract_person(text)` → возвращает dict вида:\n```python\n{\"name\": str, \"age\": int | None, \"city\": str | None, \"skills\": list[str]}\n```\n\n**Тестовые входы:**\n- «Маша, 25 лет, из Питера, знает React и TypeScript»\n- «Боря программист на Go из Москвы»\n- «Анна, опыт в маркетинге»\n\n**Требования:**\n- System prompt с чёткой схемой\n- Извлечение JSON через защитный парсер из практики 2\n- Логирование стоимости через CostTracker из недели 6\n- temperature=0 (для воспроизводимости)",
      starterCode: `from anthropic import Anthropic
from dotenv import load_dotenv
import json
import re

load_dotenv()
client = Anthropic()

SYSTEM = """Ты извлекаешь информацию о человеке из текста.
Отвечай ТОЛЬКО валидным JSON, без markdown-обёртки.

Схема:
{
  "name": string,
  "age": integer | null,
  "city": string | null,
  "skills": string[]
}

Если поля нет в тексте — ставь null или пустой массив."""


def extract_json(text: str) -> dict:
    match = re.search(r"\\{.*\\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"JSON не найден: {text[:80]}")
    return json.loads(match.group(0))


def extract_person(text: str) -> dict:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        temperature=0,
        system=SYSTEM,
        messages=[{"role": "user", "content": text}]
    )
    return extract_json(response.content[0].text)


# Тесты
texts = [
    "Маша, 25 лет, из Питера, знает React и TypeScript",
    "Боря программист на Go из Москвы",
    "Анна, опыт в маркетинге",
]

for t in texts:
    print(f"\\nВход: {t}")
    print(f"Извлечено: {extract_person(t)}")
`,
      language: "python",
      runnable: false,
      hints: [
        "Если LLM не следует JSON — усиль system prompt: 'Ответь ТОЛЬКО JSON, без объяснений, без markdown'.",
        "Защитный парсер из практики 2 уберёт обёртки если они появятся.",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь, что LLM stateless и память — на твоей стороне",
    "Можешь построить чат с автоматическим обрезанием истории",
    "Получаешь JSON по схеме и надёжно парсишь",
    "Знаешь паттерн structured output (preview tool use)",
    "Локально извлёк структурированные данные через Claude",
  ],
};
