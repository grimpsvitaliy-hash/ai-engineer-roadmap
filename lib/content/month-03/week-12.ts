import type { Lesson } from "../types";

export const week12: Lesson = {
  id: "m3-w12",
  monthId: "month-03",
  weekNumber: 12,
  title: "Портфолио-проект #1: Research Assistant",
  goal: "Собираешь первый серьёзный портфолио-проект — агент, который сам исследует тему. Tool use + agent loop + evals = реальное приложение.",
  estimatedHours: "8 ч",
  theory: [
    {
      id: "project-overview",
      title: "Что строим: Research Assistant",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Research Assistant** — агент, который по запросу пользователя самостоятельно проводит мини-исследование: ищет в интернете, читает страницы, сохраняет заметки, выдаёт сводку с источниками.",
        },
        {
          type: "code",
          language: "text",
          content: `Ты: Исследуй тему "vector databases для RAG", сохрани ключевые выводы.

[agent]
→ search_web(query="vector databases RAG")
→ fetch_url("https://...")
→ fetch_url("https://...")
→ save_note(title="vector_db_for_rag", content="...")

Готово. Сохранил заметку. Главные выводы:
1. Vector DB — специализированные хранилища для embeddings...
2. Популярные: Pinecone, Qdrant, Chroma, pgvector...
3. Ключевой выбор — managed vs self-hosted...

Источники:
- https://...
- https://...`,
        },
      ],
    },
    {
      id: "tools-spec",
      title: "Какие tools нужны",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `# 1. Поиск в интернете
{
    "name": "search_web",
    "description": (
        "Search the web for information. "
        "Returns a list of {title, url, snippet}. "
        "Use to find sources for the user's research topic."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query"}
        },
        "required": ["query"]
    }
}

# 2. Чтение страницы
{
    "name": "fetch_url",
    "description": (
        "Fetches a web page and returns its main text content (no HTML). "
        "Use after search_web when you've selected promising URLs to read in full."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "url": {"type": "string", "description": "URL to fetch"}
        },
        "required": ["url"]
    }
}

# 3. Сохранить заметку
{
    "name": "save_note",
    "description": (
        "Saves a research note to disk. "
        "Use at the end of research to persist key findings. "
        "Filename will be derived from title (slug)."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "content": {"type": "string", "description": "Markdown content of the note"},
            "sources": {"type": "array", "items": {"type": "string"}, "description": "List of source URLs"}
        },
        "required": ["title", "content"]
    }
}

# 4. Список заметок
{
    "name": "list_notes",
    "description": "Returns titles of all saved notes. Use when user asks 'what have you researched'.",
    "input_schema": {"type": "object", "properties": {}}
}`,
        },
      ],
    },
    {
      id: "implementation-tips",
      title: "Технические детали",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Search API:**\n\n- [Tavily](https://tavily.com/) — специально для LLM, 1000 запросов/месяц бесплатно\n- [DuckDuckGo Search](https://pypi.org/project/duckduckgo-search/) — без ключа, но менее стабильный\n- Google Custom Search — есть бесплатный tier, но настройка сложная",
        },
        {
          type: "text",
          content:
            "**Парсинг страниц:**\n\n```python\nimport httpx\nfrom readability import Document\nfrom bs4 import BeautifulSoup\n\ndef fetch_text(url: str) -> str:\n    resp = httpx.get(url, timeout=10, follow_redirects=True)\n    doc = Document(resp.text)\n    html = doc.summary()\n    text = BeautifulSoup(html, 'html.parser').get_text()\n    return text[:10000]  # ограничь до 10K символов\n```\n\n`pip install httpx readability-lxml beautifulsoup4`",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Защита от больших страниц",
          content:
            "Всегда обрезай результат `fetch_url` (например, до 10К символов). Иначе одна длинная страница забьёт весь контекст и убьёт следующие шаги агента.",
        },
      ],
    },
    {
      id: "project-structure",
      title: "Структура проекта",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "code",
          language: "text",
          content: `research-assistant/
├── tools/
│   ├── __init__.py
│   ├── search.py          # search_web
│   ├── fetch.py           # fetch_url
│   └── notes.py           # save_note, list_notes
├── agent.py               # run_agent + tool dispatching
├── prompts.py             # SYSTEM_PROMPT
├── main.py                # CLI loop
├── evals/
│   ├── dataset.jsonl
│   └── run_evals.py
├── notes/                 # сюда складываются заметки (в .gitignore)
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md`,
        },
      ],
    },
    {
      id: "checklist",
      title: "Чек-лист портфолио-проекта",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Минимум для портфолио:**\n\n- ✅ Отдельный публичный репозиторий с осмысленным названием\n- ✅ Минимум 3 рабочих tool\n- ✅ Agent loop с защитой от бесконечности (`max_iterations=10`)\n- ✅ Конфиг через `.env`, `.env.example` без секретов\n- ✅ **Логирование** вызовов: какой tool, аргументы, результат, время\n- ✅ **Eval-датасет** с 10+ примерами и скрипт оценки\n- ✅ **README:**\n  - что делает (с примером диалога)\n  - архитектурная диаграмма (Excalidraw, Mermaid)\n  - стек технологий\n  - инструкция запуска\n  - примеры использования\n  - **«что бы улучшил дальше»** — показывает зрелость\n- ✅ `requirements.txt` зафиксирован\n- ✅ Чистый код, минимум type hints у публичных функций",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Что НЕ делать в портфолио",
          content:
            "❌ Не пиши «реализовал на LangChain» — оценщик хочет увидеть, что **ты** понимаешь как работает agent loop, а не что ты вызвал готовое решение.\n\n❌ Не делай 10 фичей плохо — лучше 3 фичи отлично.\n\n❌ Не забывай удалить из репо API-ключи перед пушем (используй [trufflehog](https://github.com/trufflesecurity/trufflehog) для проверки).",
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
              title: "Tavily API",
              url: "https://tavily.com/",
              description: "Поисковый API для LLM, бесплатный tier.",
            },
            {
              title: "readability-lxml",
              url: "https://github.com/buriy/python-readability",
              description: "Извлечение основного контента из HTML.",
            },
            {
              title: "Excalidraw",
              url: "https://excalidraw.com/",
              description: "Для архитектурных диаграмм в README. Вручную и красиво.",
            },
            {
              title: "Anthropic Cookbook — Customer support agent",
              url: "https://github.com/anthropics/anthropic-cookbook/tree/main/skills/customer_support_agent",
              description: "Пример продвинутого агента — для вдохновения структурой.",
            },
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Какие tools минимально нужны для research-агента? (несколько)",
      options: [
        { id: "a", text: "search_web — поиск в интернете" },
        { id: "b", text: "fetch_url — скачать страницу" },
        { id: "c", text: "save_note — сохранить заметку" },
        { id: "d", text: "send_email — отправить пользователю" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Минимум: найти → прочитать → сохранить. Email — это уже доп. фича не из core-функционала ресёрча.",
    },
    {
      id: "q2",
      type: "single-choice",
      question:
        "Почему важно ограничивать длину результата `fetch_url` (например, до 10К символов)?",
      options: [
        { id: "a", text: "Чтобы файлы меньше весили" },
        { id: "b", text: "Одна большая страница забьёт контекст и убьёт следующие шаги агента" },
        { id: "c", text: "Это требование Anthropic API" },
        { id: "d", text: "Для красоты вывода" },
      ],
      correctOptionId: "b",
      explanation:
        "Контекстное окно общее для всего диалога. Большой fetch съест место и agent не сможет провести следующие действия.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Что **обязательно** должно быть в защите agent loop?",
      options: [
        { id: "a", text: "Авторизация через GitHub" },
        { id: "b", text: "max_iterations — потолок числа шагов" },
        { id: "c", text: "Кэш Redis" },
        { id: "d", text: "Docker container" },
      ],
      correctOptionId: "b",
      explanation:
        "Без max_iterations агент может уйти в цикл и сжечь весь бюджет за минуты. Это #1 защита.",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "Что должно быть в README портфолио-проекта? (несколько)",
      options: [
        { id: "a", text: "Что делает и зачем" },
        { id: "b", text: "Архитектурная схема" },
        { id: "c", text: "Инструкция запуска" },
        { id: "d", text: "Раздел 'что бы улучшил в будущем'" },
        { id: "e", text: "Твой API-ключ для удобства" },
      ],
      correctOptionIds: ["a", "b", "c", "d"],
      explanation:
        "API-ключ в репо — катастрофа (бот его украдёт за минуты). Все остальные пункты обязательны для серьёзного портфолио.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Какой подход HR будет ценить больше?",
      options: [
        { id: "a", text: "10 проектов на LangChain без своего кода" },
        { id: "b", text: "1-2 проекта на raw API с пониманием как всё устроено" },
        { id: "c", text: "Куча мелких туториал-проектов" },
        { id: "d", text: "Один большой монорепо со всеми экспериментами" },
      ],
      correctOptionId: "b",
      explanation:
        "На собесе тебя будут спрашивать «как ты бы реализовал X». Если ты только звал готовые решения — ответить нечего. Своя реализация = глубокое понимание.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Slug для имени файла",
      description:
        "Заголовок заметки нужно превратить в безопасное имя файла:\n\n- Lowercase\n- Пробелы → дефисы\n- Удалить всё кроме [a-z0-9-]\n- Не более 50 символов\n\n«Vector DBs для RAG (2026)» → `vector-dbs-2026`",
      starterCode: `import re


def slugify(title: str, max_length: int = 50) -> str:
    # 1. lowercase
    # 2. заменить пробелы на дефисы
    # 3. удалить всё кроме a-z, 0-9, -
    # 4. убрать повторяющиеся и крайние дефисы
    # 5. обрезать до max_length
    pass


print(slugify("Vector DBs для RAG (2026)"))
print(slugify("  Hello,    World!  "))
print(slugify("очень-длинное-название-заметки-которое-длиннее-пятидесяти-символов"))
print(slugify("!!!"))
`,
      solutionCode: `import re


def slugify(title: str, max_length: int = 50) -> str:
    s = title.lower()
    s = re.sub(r"\\s+", "-", s)
    s = re.sub(r"[^a-z0-9-]", "", s)
    s = re.sub(r"-+", "-", s)
    s = s.strip("-")
    return s[:max_length]


print(slugify("Vector DBs для RAG (2026)"))
print(slugify("  Hello,    World!  "))
print(slugify("очень-длинное-название-заметки-которое-длиннее-пятидесяти-символов"))
print(slugify("!!!"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Хранилище заметок в памяти",
      description:
        "Класс `NotesStore`:\n- `save(title, content, sources=None)` → возвращает `slug`\n- `get(slug)` → словарь заметки или None\n- `list()` → список `{slug, title, created_at}` отсортированный по времени\n- `delete(slug)` → True если удалили, False если не было",
      starterCode: `from datetime import datetime
import re


def slugify(title: str) -> str:
    s = re.sub(r"\\s+", "-", title.lower())
    return re.sub(r"[^a-z0-9-]", "", s)[:50]


class NotesStore:
    def __init__(self):
        self._notes: dict[str, dict] = {}

    def save(self, title: str, content: str, sources: list[str] = None) -> str:
        # Допиши
        pass

    def get(self, slug: str) -> dict | None:
        # Допиши
        pass

    def list(self) -> list[dict]:
        # Допиши: отсортируй по created_at
        pass

    def delete(self, slug: str) -> bool:
        # Допиши
        pass


store = NotesStore()
import time
slug1 = store.save("Vector DBs", "Content 1", sources=["https://a.com"])
time.sleep(0.01)
slug2 = store.save("RAG basics", "Content 2")

print(f"Slugs: {slug1}, {slug2}")
print(f"List: {store.list()}")
print(f"Get vector-dbs: {store.get('vector-dbs')}")
print(f"Delete: {store.delete('vector-dbs')}, {store.delete('missing')}")
print(f"After delete: {store.list()}")
`,
      solutionCode: `from datetime import datetime
import re


def slugify(title: str) -> str:
    s = re.sub(r"\\s+", "-", title.lower())
    return re.sub(r"[^a-z0-9-]", "", s)[:50]


class NotesStore:
    def __init__(self):
        self._notes: dict[str, dict] = {}

    def save(self, title: str, content: str, sources: list[str] = None) -> str:
        slug = slugify(title)
        self._notes[slug] = {
            "slug": slug,
            "title": title,
            "content": content,
            "sources": sources or [],
            "created_at": datetime.now().isoformat(),
        }
        return slug

    def get(self, slug: str) -> dict | None:
        return self._notes.get(slug)

    def list(self) -> list[dict]:
        items = [
            {"slug": n["slug"], "title": n["title"], "created_at": n["created_at"]}
            for n in self._notes.values()
        ]
        return sorted(items, key=lambda x: x["created_at"])

    def delete(self, slug: str) -> bool:
        return self._notes.pop(slug, None) is not None


store = NotesStore()
import time
slug1 = store.save("Vector DBs", "Content 1", sources=["https://a.com"])
time.sleep(0.01)
slug2 = store.save("RAG basics", "Content 2")

print(f"Slugs: {slug1}, {slug2}")
print(f"List: {store.list()}")
print(f"Get vector-dbs: {store.get('vector-dbs')}")
print(f"Delete: {store.delete('vector-dbs')}, {store.delete('missing')}")
print(f"After delete: {store.list()}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Trim длинного текста",
      description:
        "Функция `trim_text(text, max_chars, prefer_sentences=True)`:\n- Обрезает текст до `max_chars`\n- Если `prefer_sentences=True` — обрезает по последней точке/восклицанию/вопросу перед лимитом\n- Возвращает обрезанный текст + информацию: `(text, was_trimmed: bool, original_length: int)`",
      starterCode: `def trim_text(
    text: str,
    max_chars: int,
    prefer_sentences: bool = True,
) -> tuple[str, bool, int]:
    original_length = len(text)

    if original_length <= max_chars:
        return text, False, original_length

    # Допиши: обрежь и если prefer_sentences=True - обрежь по последнему [.!?]
    pass


text = "Первое предложение. Второе предложение! А вот третье? И четвёртое тоже. Пятое последнее."

print(trim_text(text, max_chars=40))
print(trim_text(text, max_chars=40, prefer_sentences=False))
print(trim_text(text, max_chars=500))
`,
      solutionCode: `def trim_text(
    text: str,
    max_chars: int,
    prefer_sentences: bool = True,
) -> tuple[str, bool, int]:
    original_length = len(text)

    if original_length <= max_chars:
        return text, False, original_length

    cut = text[:max_chars]

    if prefer_sentences:
        # ищем последний .!? в обрезанном куске
        last = max(cut.rfind("."), cut.rfind("!"), cut.rfind("?"))
        if last > max_chars // 2:  # только если разумно близко к концу
            cut = cut[: last + 1]

    return cut + " [...]", True, original_length


text = "Первое предложение. Второе предложение! А вот третье? И четвёртое тоже. Пятое последнее."

print(trim_text(text, max_chars=40))
print(trim_text(text, max_chars=40, prefer_sentences=False))
print(trim_text(text, max_chars=500))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Research Assistant — полная сборка",
      description:
        "Это твой первый портфолио-проект для GitHub. Бери на 4-6 часов работы.\n\n**Шаги:**\n\n1. Создай новый репо `llm-research-assistant`\n2. Структура:\n```\nresearch-assistant/\n├── tools/\n│   ├── search.py    # Tavily или DuckDuckGo\n│   ├── fetch.py     # requests + readability-lxml\n│   └── notes.py     # NotesStore с файловым хранилищем\n├── agent.py         # run_agent с max_iterations\n├── prompts.py\n├── main.py\n├── evals/\n│   ├── dataset.jsonl  # 10+ research-запросов\n│   └── run.py\n├── notes/.gitkeep\n├── .env.example\n├── .gitignore       # .env, notes/*.md\n├── requirements.txt\n└── README.md\n```\n3. Реализуй tools, agent loop, CLI\n4. Прогон через 10 разных запросов, фиксация багов\n5. README с архитектурной диаграммой + примеры диалогов + что улучшил\n6. Опубликуй пост: «Сделал AI-агента, который исследует тему за меня...»",
      starterCode: `# agent.py — скелет
from anthropic import Anthropic
from tools.search import search_web
from tools.fetch import fetch_url
from tools.notes import NotesStore
from prompts import SYSTEM
import time

client = Anthropic()
notes_store = NotesStore("./notes")


def execute_tool(name: str, args: dict) -> str:
    t0 = time.time()
    try:
        if name == "search_web":
            result = search_web(args["query"])
        elif name == "fetch_url":
            result = fetch_url(args["url"])
        elif name == "save_note":
            result = notes_store.save(args["title"], args["content"], args.get("sources"))
        elif name == "list_notes":
            result = [{"slug": n["slug"], "title": n["title"]} for n in notes_store.list()]
        else:
            return f"ERROR: unknown tool {name}"
    except Exception as e:
        result = f"ERROR: {e}"
    elapsed = time.time() - t0
    print(f"  [tool {name} took {elapsed:.2f}s]")
    return str(result)[:5000]  # обрезаем огромные ответы


TOOLS = [
    # ...описания всех 4 tools (см. теорию)...
]


def run_agent(user_message: str, max_iter: int = 10) -> str:
    messages = [{"role": "user", "content": user_message}]
    total_cost = 0.0

    for i in range(max_iter):
        print(f"\\n── Iteration {i+1} ──")
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=SYSTEM,
            tools=TOOLS,
            messages=messages,
        )
        total_cost += (response.usage.input_tokens / 1e6) * 3
        total_cost += (response.usage.output_tokens / 1e6) * 15

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":
            for block in response.content:
                if block.type == "text":
                    print(f"\\n=== FINAL (cost \${total_cost:.4f}) ===\\n")
                    return block.text
            return "(no text)"

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"→ {block.name}({list(block.input.keys())})")
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })

        messages.append({"role": "user", "content": tool_results})

    return f"MAX ITERATIONS reached. Cost so far: \${total_cost:.4f}"


# main.py:
if __name__ == "__main__":
    while True:
        query = input("\\nИсследуй: ").strip()
        if not query or query == "/quit":
            break
        print(run_agent(query))
`,
      language: "python",
      runnable: false,
      hints: [
        "Начни с одного tool (например, search_web), убедись что работает, потом добавляй остальные.",
        "Логируй каждый вызов: имя, аргументы, время, размер результата. Без логов отладка агента — ад.",
        "Если агент циклится — посмотри последние сообщения, поправь description tools.",
      ],
    },
  ],
  checkpoint: [
    "Создан отдельный публичный репозиторий llm-research-assistant",
    "Минимум 3 рабочих tool, agent loop с защитой от бесконечности",
    "Папка evals/ с датасетом и скриптом запуска",
    "README с архитектурной диаграммой и примерами диалогов",
    "Раздел «что бы улучшил в будущем» — показывает зрелость инженера",
    "Опубликован пост в соцсетях с ссылкой на репо",
    "Можешь рассказать на собесе как устроен agent loop и какие были проблемы",
  ],
};
