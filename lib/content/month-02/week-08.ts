import type { Lesson } from "../types";

export const week08: Lesson = {
  id: "m2-w8",
  monthId: "month-02",
  weekNumber: 8,
  title: "Мини-проект: чат-бот с характером",
  goal: "Собираешь первый небольшой проект — чат-бот с явно выраженной личностью, памятью и сохранением. Это твоя первая полноценная сборка с LLM.",
  estimatedHours: "8 ч",
  theory: [
    {
      id: "project-spec",
      title: "Что строим",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Project:** Character Chat — бот с заданной личностью.\n\nВыбери одного из персонажей (или свой):\n- **Сократ** — задаёт встречные вопросы, не даёт прямых ответов\n- **Шерлок Холмс** — холодно-аналитический, любит дедукцию\n- **Учитель Йода** — мудрый, переставляет слова в предложениях\n- **Гоблин-критик** — резкий, едкий, но по делу\n- **Карл Саган** — поэтично рассказывает о научных вещах",
        },
        {
          type: "text",
          content:
            "**Минимальные требования:**\n\n- ✅ Хорошо проработанный system prompt (минимум 200 слов, с примерами реплик)\n- ✅ Память контекста (sliding window 30 сообщений)\n- ✅ Команды: `/reset`, `/save <file>`, `/load <file>`, `/cost`, `/character <name>`\n- ✅ Сохранение истории в JSON\n- ✅ Подсчёт стоимости текущей сессии\n- ✅ Качественный README со скриншотами\n- ✅ Push в отдельный GitHub-репозиторий",
        },
      ],
    },
    {
      id: "system-prompt",
      title: "Как написать хороший system prompt",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Слабый промпт: «Ты Сократ. Отвечай как Сократ.»\n\nLLM знает про Сократа в общих чертах, но без деталей будет скатываться в обычные ответы.",
        },
        {
          type: "text",
          content:
            "**Хороший промпт содержит:**\n\n1. **Кто ты** — роль одним предложением\n2. **Характер** — 3-5 черт с примерами\n3. **Голос** — стиль речи, словарь, манера\n4. **Что делаешь** — типичные действия в диалоге\n5. **Чего не делаешь** — явные запреты\n6. **Примеры реплик** — 2-3 примера ответов",
        },
        {
          type: "code",
          language: "text",
          content: `SOCRATES_PROMPT = """Ты Сократ, философ из Афин V века до н.э.

ХАРАКТЕР:
- Никогда не даёшь прямых ответов на сложные вопросы
- Вместо ответа задаёшь 2-3 встречных вопроса, обнажающих скрытые
  предпосылки в утверждении собеседника
- Притворяешься, что ничего не знаешь — «я знаю, что ничего не знаю»
- Любишь ловить на противоречиях

ГОЛОС:
- Спокойный, ироничный, чуть-чуть насмешливый
- Обращения: «друг мой», «дорогой собеседник»
- Никаких современных слов и понятий
- Иногда вставляешь короткие истории-аналогии

ЧТО ДЕЛАЕШЬ:
- Просят определение → требуешь уточнить термины
- Делают утверждение → ищешь противоречия в нём
- Дают пример → находишь контрпример
- Спрашивают тебя напрямую → отвечаешь вопросом

ЧЕГО НЕ ДЕЛАЕШЬ:
- Не используешь современные термины (психология, квантовая физика и т.п.)
- Не даёшь готовых ответов
- Не комплиментаришь без причины
- Не выходишь из роли, даже если просят

ПРИМЕРЫ:

Пользователь: Что такое справедливость?
Ты: Прежде чем мы попытаемся ухватить столь скользкую птицу, друг мой,
ответь: справедлив ли врач, который причиняет боль больному ради исцеления?

Пользователь: Я считаю, что счастье — это удовольствия.
Ты: Любопытное утверждение. Скажи, если бы тебе предложили выпить зелье,
которое навсегда сделает тебя счастливым, но превратит в свинью —
выпил бы ты его?
"""`,
        },
      ],
    },
    {
      id: "architecture",
      title: "Архитектура",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Не делай всё в одном файле. Минимальная структура:",
        },
        {
          type: "code",
          language: "text",
          content: `character-chat/
├── characters/
│   ├── __init__.py
│   ├── socrates.py        # SOCRATES_PROMPT = "..."
│   ├── sherlock.py
│   └── yoda.py
├── chat.py                # ChatSession класс
├── cost.py                # CostTracker
├── commands.py            # обработка /reset, /save и т.п.
├── main.py                # CLI loop
├── .env.example           # ANTHROPIC_API_KEY=
├── .gitignore             # .env, *.json (если не пушим chats)
├── requirements.txt
└── README.md`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Почему модульно",
          content:
            "Это пример **на собеседование**. Тебя спросят «как структурируешь проект». Один файл на 500 строк выглядит как «он не умеет думать в архитектуре». Модули показывают зрелость даже у джуна.",
        },
      ],
    },
    {
      id: "extensions",
      title: "Дополнительные фичи (если успеваешь)",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "После минимума — добавь что-то из:\n\n- **Streaming ответа** — печатается по токенам, не дожидаясь конца\n- **Стриминг через Telegram-бот** (python-telegram-bot или aiogram)\n- **Веб-интерфейс через Streamlit** — 30 строк кода, выглядит профессионально\n- **Метки в истории** — какой персонаж говорил (если переключал)\n- **Экспорт диалога в красивый markdown** для шеринга\n- **Анализ настроения** через второй LLM-вызов",
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
              title: "Streamlit Docs",
              url: "https://docs.streamlit.io/",
              description: "Если решишь делать веб-интерфейс — самый быстрый путь.",
            },
            {
              title: "python-telegram-bot",
              url: "https://docs.python-telegram-bot.org/",
              description: "Для Telegram-бота. Создай бота через @BotFather.",
            },
            {
              title: "Anthropic Streaming docs",
              url: "https://docs.anthropic.com/en/api/messages-streaming",
              description: "Как делать потоковую генерацию.",
            },
            {
              title: "Prompt библиотека Anthropic",
              url: "https://docs.anthropic.com/en/prompt-library",
              description: "Примеры промптов от Anthropic — для вдохновения.",
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
      question: "Что важнее всего для качества бота-персонажа?",
      options: [
        { id: "a", text: "Использовать самую дорогую модель (Opus)" },
        { id: "b", text: "Качественный, проработанный system prompt с примерами реплик" },
        { id: "c", text: "Высокая температура" },
        { id: "d", text: "Много пакетов и фреймворков" },
      ],
      correctOptionId: "b",
      explanation:
        "Промпт — это самая дешёвая и самая мощная настройка. Хороший промпт с Haiku часто лучше плохого промпта с Opus.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Что должно быть в хорошем system prompt персонажа? (несколько)",
      options: [
        { id: "a", text: "Описание характера с примерами" },
        { id: "b", text: "Голос/стиль речи" },
        { id: "c", text: "Примеры конкретных реплик" },
        { id: "d", text: "Длинная биография" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Примеры реплик — самая недооценённая часть. Биография обычно избыточна, LLM и так знает базовые факты.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Зачем разносить проект на модули вместо одного файла?",
      options: [
        { id: "a", text: "Чтобы было больше строк кода в репо" },
        { id: "b", text: "Это показывает архитектурное мышление — важно для собеседования" },
        { id: "c", text: "Только так Python работает" },
        { id: "d", text: "Чтобы было сложнее читать" },
      ],
      correctOptionId: "b",
      explanation:
        "На собесе тебя спрашивают «как ты бы организовал проект». Один файл = «он не думал об этом». Модули = «он думал».",
    },
    {
      id: "q4",
      type: "single-choice",
      question:
        "Какая команда из требований проекта позволяет переключаться между персонажами на лету?",
      options: [
        { id: "a", text: "/reset" },
        { id: "b", text: "/save" },
        { id: "c", text: "/character <name>" },
        { id: "d", text: "/cost" },
      ],
      correctOptionId: "c",
      explanation:
        "`/character <name>` — обычно подразумевает смену system prompt и обнуление истории (или хотя бы пометку).",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Какой минимум должен лежать в репозитории проекта?",
      options: [
        { id: "a", text: "Только main.py" },
        { id: "b", text: "Код + README + .env.example + .gitignore + requirements.txt" },
        { id: "c", text: "Только requirements.txt" },
        { id: "d", text: "Архив проекта" },
      ],
      correctOptionId: "b",
      explanation:
        "Этот минимум — стандарт для любого Python-проекта. Без README репозиторий выглядит брошенным. Без .env.example непонятно какие переменные нужны.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Тестовый ChatSession с заглушкой LLM",
      description:
        "Без реального API напиши класс `CharacterChat` с:\n- `__init__(character_name, system_prompt)` — стартовая настройка\n- `send(message)` — добавляет в историю, возвращает «ответ» (для теста: `f\"[{character_name}] heard: {message}\"`)\n- `change_character(new_name, new_prompt)` — меняет персонажа и **очищает** историю\n- `cost` — float, накапливается +0.01 каждый send",
      starterCode: `class CharacterChat:
    def __init__(self, character_name: str, system_prompt: str):
        self.character_name = character_name
        self.system_prompt = system_prompt
        self.messages = []
        self.cost = 0.0

    def send(self, message: str) -> str:
        # Допиши
        pass

    def change_character(self, new_name: str, new_prompt: str) -> None:
        # Допиши
        pass


chat = CharacterChat("Socrates", "Ты Сократ")
print(chat.send("Что такое истина?"))
print(chat.send("Я не уверен"))
print(f"Сообщений: {len(chat.messages)}")
print(f"Накоплено: $\${chat.cost:.2f}")

chat.change_character("Sherlock", "Ты Шерлок Холмс")
print(f"\\nПосле смены — сообщений: {len(chat.messages)}, персонаж: {chat.character_name}")
print(chat.send("Здравствуй"))
`,
      solutionCode: `class CharacterChat:
    def __init__(self, character_name: str, system_prompt: str):
        self.character_name = character_name
        self.system_prompt = system_prompt
        self.messages = []
        self.cost = 0.0

    def send(self, message: str) -> str:
        self.messages.append({"role": "user", "content": message})
        reply = f"[{self.character_name}] heard: {message}"
        self.messages.append({"role": "assistant", "content": reply})
        self.cost += 0.01
        return reply

    def change_character(self, new_name: str, new_prompt: str) -> None:
        self.character_name = new_name
        self.system_prompt = new_prompt
        self.messages = []


chat = CharacterChat("Socrates", "Ты Сократ")
print(chat.send("Что такое истина?"))
print(chat.send("Я не уверен"))
print(f"Сообщений: {len(chat.messages)}")
print(f"Накоплено: $\${chat.cost:.2f}")

chat.change_character("Sherlock", "Ты Шерлок Холмс")
print(f"\\nПосле смены — сообщений: {len(chat.messages)}, персонаж: {chat.character_name}")
print(chat.send("Здравствуй"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Обработчик команд",
      description:
        "Напиши функцию `parse_command(text)`, которая принимает ввод пользователя и:\n- Если начинается с `/` — возвращает `(\"command\", команда, аргумент_строкой)`\n- Иначе — возвращает `(\"message\", text, None)`\n\nКоманды: `/reset`, `/save filename`, `/load filename`, `/cost`, `/character sherlock`",
      starterCode: `def parse_command(text: str) -> tuple[str, str, str | None]:
    # Допиши
    pass


# Тесты
print(parse_command("/reset"))
print(parse_command("/save chat1.json"))
print(parse_command("/character sherlock"))
print(parse_command("Привет, как дела?"))
print(parse_command("/cost"))
`,
      solutionCode: `def parse_command(text: str) -> tuple[str, str, str | None]:
    text = text.strip()
    if not text.startswith("/"):
        return ("message", text, None)
    parts = text[1:].split(maxsplit=1)
    cmd = parts[0]
    arg = parts[1] if len(parts) > 1 else None
    return ("command", cmd, arg)


print(parse_command("/reset"))
print(parse_command("/save chat1.json"))
print(parse_command("/character sherlock"))
print(parse_command("Привет, как дела?"))
print(parse_command("/cost"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Сериализация диалога в JSON",
      description:
        "Напиши функции:\n- `save_chat(filename, character, messages)` — пишет в JSON структуру `{character, saved_at, messages}`\n- `load_chat(filename)` → возвращает `(character, messages)`",
      starterCode: `import json
from datetime import datetime


def save_chat(filename: str, character: str, messages: list[dict]) -> None:
    # Допиши
    pass


def load_chat(filename: str) -> tuple[str, list[dict]]:
    # Допиши
    pass


# Тест
messages = [
    {"role": "user", "content": "Привет"},
    {"role": "assistant", "content": "Hello there"},
]
save_chat("/tmp/test_chat.json", "Sherlock", messages)
loaded_character, loaded_messages = load_chat("/tmp/test_chat.json")
print(f"Персонаж: {loaded_character}")
print(f"Сообщений: {len(loaded_messages)}")
print(loaded_messages)
`,
      solutionCode: `import json
from datetime import datetime


def save_chat(filename: str, character: str, messages: list[dict]) -> None:
    data = {
        "character": character,
        "saved_at": datetime.now().isoformat(),
        "messages": messages,
    }
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_chat(filename: str) -> tuple[str, list[dict]]:
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["character"], data["messages"]


messages = [
    {"role": "user", "content": "Привет"},
    {"role": "assistant", "content": "Hello there"},
]
save_chat("/tmp/test_chat.json", "Sherlock", messages)
loaded_character, loaded_messages = load_chat("/tmp/test_chat.json")
print(f"Персонаж: {loaded_character}")
print(f"Сообщений: {len(loaded_messages)}")
print(loaded_messages)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Полный проект Character Chat",
      description:
        "Это твой первый портфолио-проект. Собери всё вместе.\n\n**Шаги:**\n\n1. Создай отдельный репозиторий `character-chat` на GitHub\n2. Скопируй наработки из практик 1-3\n3. Подключи реальный Anthropic API\n4. Напиши **минимум 2 system prompt** для разных персонажей (с примерами реплик!)\n5. Реализуй команды /reset, /save, /load, /cost, /character\n6. Sliding window для истории\n7. Хороший README со скриншотами 2-3 диалогов и пояснением архитектуры\n8. `.env.example`, `.gitignore`, `requirements.txt`\n9. Push в GitHub\n10. **Опубликуй короткий пост** в LinkedIn/Twitter/Telegram: «Запустил свой первый LLM-проект — чат-бот с характером Сократа. Что я узнал за месяц: ...»",
      starterCode: `# Скелет main.py — финальный вариант смотри в репозитории

from anthropic import Anthropic
from dotenv import load_dotenv
from characters import CHARACTERS
import json

load_dotenv()
client = Anthropic()

MAX_HISTORY = 30


class CharacterChat:
    def __init__(self, character_key: str):
        self.set_character(character_key)
        self.cost = 0.0

    def set_character(self, key: str) -> None:
        if key not in CHARACTERS:
            raise ValueError(f"Неизвестный персонаж: {key}")
        self.character_key = key
        self.system_prompt = CHARACTERS[key]
        self.messages = []

    def send(self, message: str) -> str:
        self.messages.append({"role": "user", "content": message})
        if len(self.messages) > MAX_HISTORY:
            self.messages = self.messages[-MAX_HISTORY:]
            while self.messages and self.messages[0]["role"] == "assistant":
                self.messages = self.messages[1:]

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            temperature=0.8,
            system=self.system_prompt,
            messages=self.messages,
        )
        reply = response.content[0].text
        self.messages.append({"role": "assistant", "content": reply})

        self.cost += (response.usage.input_tokens / 1e6) * 0.80
        self.cost += (response.usage.output_tokens / 1e6) * 4.00
        return reply


def main():
    chat = CharacterChat("socrates")
    print(f"Чат с {chat.character_key}. Команды: /reset /save /load /cost /character /quit\\n")

    while True:
        user_input = input("Ты: ").strip()
        if not user_input:
            continue
        if user_input.startswith("/"):
            # обработай команды
            cmd = user_input[1:].split(maxsplit=1)
            name = cmd[0]
            arg = cmd[1] if len(cmd) > 1 else None
            if name == "quit":
                break
            elif name == "reset":
                chat.set_character(chat.character_key)
                print("История очищена.\\n")
            elif name == "cost":
                print(f"Накоплено: $\${chat.cost:.6f}\\n")
            elif name == "character" and arg:
                chat.set_character(arg)
                print(f"Сменили персонажа на {arg}\\n")
            # ... save, load
            continue

        reply = chat.send(user_input)
        print(f"\\n{chat.character_key}: {reply}\\n")


if __name__ == "__main__":
    main()
`,
      language: "python",
      runnable: false,
      hints: [
        "Если бот не похож на персонажа — переделывай system prompt, добавляй больше примеров реплик.",
        "Температура 0.7-0.9 даёт живые диалоги. На 0 персонаж становится механическим.",
        "Делай скриншоты с самыми удачными диалогами для README.",
      ],
    },
  ],
  checkpoint: [
    "Создан отдельный публичный репозиторий character-chat",
    "В нём минимум 2 проработанных персонажа с system prompts >200 слов",
    "Работают команды /reset, /save, /load, /cost, /character",
    "История автоматически обрезается до 30 сообщений",
    "Качественный README с архитектурой и скриншотами диалогов",
    "Опубликован пост о проекте в соцсетях",
    "Понимаешь полный цикл: system prompt → user message → API → history → save/load",
  ],
};
