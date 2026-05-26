import type { Lesson } from "../types";

export const week14: Lesson = {
  id: "m4-w14",
  monthId: "month-04",
  weekNumber: 14,
  title: "Vector databases и chunking",
  goal: "Знаешь что такое векторная БД и выбираешь подходящую. Понимаешь chunking — самую частую причину плохого RAG. Реализуешь 3 стратегии нарезки.",
  estimatedHours: "7-8 ч",
  theory: [
    {
      id: "why-vector-db",
      title: "Зачем нужна векторная БД",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "При 1000 документов поиск перебором (loop по всем embeddings) работает мгновенно.\n\nПри 1М документов — секунды.\n\nПри 100М — минуты.\n\nВекторные БД используют **ANN** (Approximate Nearest Neighbors) — индексы HNSW/IVF, которые ищут за миллисекунды на миллионах векторов.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Когда обходишься без БД",
          content:
            "Для пет-проекта с 100-10К документов **простой in-memory словарь + numpy** работает достаточно. Векторная БД нужна когда у тебя 100К+ записей или нужна персистентность.",
        },
      ],
    },
    {
      id: "vector-db-options",
      title: "Какую выбрать",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Локально (без аккаунтов, идеально для пет-проектов):**\n\n- **Chroma** — самая простая, `pip install chromadb`. Хранит в файлах, embedded в Python.\n- **Qdrant** в Docker — production-ready, можно запустить локально через docker run\n- **LanceDB** — новая, очень быстрая, embedded\n- **FAISS** (Facebook) — низкоуровневая, без полноценного DB API",
        },
        {
          type: "text",
          content:
            "**Managed cloud (production):**\n\n- **Pinecone** — самая популярная, free tier есть. https://pinecone.io\n- **Qdrant Cloud** — open-source + managed. https://qdrant.tech\n- **Weaviate**, **Milvus** — крупные платформы\n- **pgvector** — расширение PostgreSQL, если у тебя уже Postgres",
        },
        {
          type: "code",
          language: "python",
          content: `# Chroma — простейший пример
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="docs")

# Добавить (embedding посчитается автоматически дефолтной моделью,
# или можно передать свои embeddings)
collection.add(
    documents=["Первый текст", "Второй текст", "Третий текст"],
    metadatas=[{"source": "a.md"}, {"source": "b.md"}, {"source": "c.md"}],
    ids=["1", "2", "3"]
)

# Поиск
results = collection.query(
    query_texts=["поиск по смыслу"],
    n_results=2
)
print(results)`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Рекомендация для портфолио",
          content:
            "Используй **Chroma** для месяца 4 — никаких аккаунтов и контейнеров не надо. Для месяца 5 (production) попробуй Qdrant в Docker — будет ярче в резюме.",
        },
      ],
    },
    {
      id: "chunking-why",
      title: "Chunking — главная проблема RAG-инженера",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Chunking** — нарезка документа на куски (chunks) для embedding и поиска.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Зачем нарезать",
          content:
            "Не можешь засунуть PDF на 500 страниц в один embedding — потеряешь все детали. Большие чанки → плохая точность поиска. Маленькие чанки → потеря контекста. Это инженерный компромисс, и от него **сильнее всего** зависит качество RAG.",
        },
        {
          type: "text",
          content:
            "**Параметры chunking:**\n\n- **chunk_size** — размер куска в токенах или символах (обычно 200-800 токенов)\n- **chunk_overlap** — пересечение соседних кусков (10-20% от size)\n- **strategy** — как именно резать",
        },
      ],
    },
    {
      id: "chunking-strategies",
      title: "5 стратегий chunking",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**1. Fixed-size** — режем по N символам/токенам.\n\n✅ Просто. ❌ Рвёт смысл посреди предложения.",
        },
        {
          type: "code",
          language: "python",
          content: `def chunk_fixed(text: str, size: int = 500, overlap: int = 50) -> list[str]:
    chunks = []
    i = 0
    while i < len(text):
        chunks.append(text[i:i + size])
        i += size - overlap
    return chunks`,
        },
        {
          type: "text",
          content:
            "**2. Sentence-based** — режем по предложениям, группируем.\n\n✅ Не рвёт мысли. ❌ Сложнее с языками без чётких границ.",
        },
        {
          type: "text",
          content:
            "**3. Recursive** — иерархически: сначала по абзацам (`\\n\\n`), потом если кусок слишком большой — по предложениям, потом по словам. **Это default в LangChain и большинстве реальных систем.**",
        },
        {
          type: "code",
          language: "python",
          content: `def chunk_recursive(text: str, max_size: int = 500) -> list[str]:
    # Сначала по абзацам
    paragraphs = text.split("\\n\\n")
    chunks = []
    current = ""

    for p in paragraphs:
        if len(current) + len(p) <= max_size:
            current += p + "\\n\\n"
        else:
            if current:
                chunks.append(current.strip())
            if len(p) > max_size:
                # Параграф слишком большой — режем по предложениям
                sentences = re.split(r'(?<=[.!?])\\s+', p)
                # ... рекурсивно
                current = ""
            else:
                current = p + "\\n\\n"

    if current:
        chunks.append(current.strip())
    return chunks`,
        },
        {
          type: "text",
          content:
            "**4. Semantic chunking** — определяет границы по смысловым переходам (через embeddings). Сложнее, но качественнее на длинных документах.",
        },
        {
          type: "text",
          content:
            "**5. Document-aware** — для **markdown** — по заголовкам H1/H2; для **кода** — по функциям/классам; для **PDF** — по секциям из оглавления.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Прагматика",
          content:
            "Начинай с **recursive** + chunk_size 500-800 + overlap 50-100. Это даёт 80% качества на 5% усилий. Усложняй (semantic / document-aware) — только если эвалы покажут что recursive не справляется.",
        },
      ],
    },
    {
      id: "metadata",
      title: "Метаданные — недооценённая мощь",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "Кроме `text` и `embedding`, к каждому чанку прикрепляй **метаданные**:",
        },
        {
          type: "code",
          language: "python",
          content: `{
    "source": "user_manual_v2.pdf",
    "page": 47,
    "section": "Troubleshooting",
    "created_at": "2026-03-15",
    "lang": "ru",
    "type": "official_doc"
}`,
        },
        {
          type: "text",
          content:
            "**Что это даёт:**\n\n- Фильтрация при поиске: «искать только в документах после 2025» / «только русские» / «только в Troubleshooting»\n- Цитирование источников в ответе: «согласно user_manual_v2.pdf, стр. 47...»\n- Дебаг проблем: видно из каких документов модель взяла контекст",
        },
        {
          type: "code",
          language: "python",
          content: `# Chroma умеет фильтрацию по метаданным
results = collection.query(
    query_texts=["как починить ошибку"],
    n_results=5,
    where={"lang": "ru", "type": "official_doc"}
)`,
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
              title: "Pinecone — Chunking strategies",
              url: "https://www.pinecone.io/learn/chunking-strategies/",
              description: "Лучший разбор всех стратегий с картинками.",
            },
            {
              title: "Chroma docs",
              url: "https://docs.trychroma.com/",
              description: "Документация Chroma. Простая и понятная.",
            },
            {
              title: "LangChain text_splitter",
              url: "https://python.langchain.com/docs/concepts/text_splitters/",
              description: "Готовые сплиттеры — посмотри их код как референс.",
            },
            {
              title: "Anthropic Contextual Retrieval",
              url: "https://www.anthropic.com/news/contextual-retrieval",
              description: "Продвинутый подход для месяца 4 неделя 4.",
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
          emoji: "💰",
          title: "Pinecone — $750M на хранении векторов",
          content:
            "**Pinecone**, основанная Эдо Либерти в 2019, привлекла к 2024 году более **$138M инвестиций** при оценке **$750M**. Их продукт — managed vector database. То есть компанию ценят в три четверти миллиарда долларов за «хранение чисел в нужном порядке для быстрого поиска похожих». Сейчас прибыль vector DB рынка превышает **$2B/год**, и растёт на 30% в год.",
        },
        {
          type: "funfact",
          emoji: "✂️",
          title: "Chunking — главная боль RAG",
          content:
            "Hamel Husain (один из мировых экспертов по AI evals): «На моих консультациях с 50+ компаниями **главная причина плохого RAG — chunking**». Не модель, не embedding, не векторная БД — то, как ты режешь документ. Многие компании потратили миллионы на reranking/hybrid/contextual, а потом обнаружили что **просто chunk size 1000 → 300 решает 80% проблем**.",
        },
        {
          type: "funfact",
          emoji: "🚀",
          title: "Chroma — embedded и непобедимый",
          content:
            "**Chroma** запустился в 2023 как «SQLite для векторов». В отличие от Pinecone/Qdrant — никакого сервера, просто библиотека. За год набрал **>10K GitHub stars**, попал в почти каждый туториал по RAG. Основатели Jeff Huber и Anton Troynikov из Robust Intelligence. Их секрет: **сделать самое простое что можно**, а не самое мощное.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Когда **обязательно** нужна векторная БД, а не in-memory словарь?",
      options: [
        { id: "a", text: "Всегда — это правило хорошего тона" },
        { id: "b", text: "Когда документов сотни тысяч и больше, или нужна персистентность" },
        { id: "c", text: "Никогда, словарь всегда лучше" },
        { id: "d", text: "Только в production" },
      ],
      correctOptionId: "b",
      explanation:
        "До ~10К документов numpy/dict работают. Векторные БД нужны для больших объёмов (ANN-индексы) или когда нужно хранить данные между запусками.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Какая векторная БД проще всего для пет-проектов?",
      options: [
        { id: "a", text: "Pinecone — нужен аккаунт" },
        { id: "b", text: "Chroma — pip install и работает" },
        { id: "c", text: "Milvus — нужен Kubernetes" },
        { id: "d", text: "Weaviate — нужен Docker" },
      ],
      correctOptionId: "b",
      explanation:
        "Chroma — embedded, не требует отдельного сервиса. `pip install chromadb` и можно работать. Идеально для портфолио.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Почему chunking — главная проблема RAG-инженера? (несколько)",
      options: [
        { id: "a", text: "От размера chunks сильно зависит качество поиска" },
        { id: "b", text: "Слишком большие чанки → плохая точность" },
        { id: "c", text: "Слишком маленькие → потеря контекста" },
        { id: "d", text: "Это занимает много CPU" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Chunking — инженерный компромисс между точностью и контекстом. CPU тут ни при чём — операция дешёвая.",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Какая стратегия chunking считается default-выбором в большинстве реальных систем?",
      options: [
        { id: "a", text: "Fixed-size — режем по N символам" },
        { id: "b", text: "Recursive — иерархически по абзацам/предложениям/словам" },
        { id: "c", text: "Semantic chunking" },
        { id: "d", text: "Один документ = один chunk" },
      ],
      correctOptionId: "b",
      explanation:
        "Recursive — стандарт в LangChain и большинстве боевых RAG. Хороший компромисс простоты и качества.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Что такое chunk_overlap и зачем нужен?",
      options: [
        { id: "a", text: "Размер чанка в токенах" },
        { id: "b", text: "Пересечение соседних чанков (обычно 10-20%), чтобы не терять смысл на границе" },
        { id: "c", text: "Количество чанков в одной странице" },
        { id: "d", text: "Минимальное расстояние между чанками" },
      ],
      correctOptionId: "b",
      explanation:
        "Без overlap — мысль, которая занимает 2 предложения подряд, может попасть на границу и потеряться. Overlap 50-100 токенов решает.",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question: "Что хорошо положить в метаданные чанка? (несколько)",
      options: [
        { id: "a", text: "source — откуда документ" },
        { id: "b", text: "page / section — где в документе" },
        { id: "c", text: "created_at — для фильтрации по дате" },
        { id: "d", text: "lang — для фильтрации по языку" },
        { id: "e", text: "embedding — сам вектор" },
      ],
      correctOptionIds: ["a", "b", "c", "d"],
      explanation:
        "Embedding не в метаданных — он отдельным полем. Метаданные — это контекстная информация для фильтрации и цитирования.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Fixed-size chunking с overlap",
      description:
        "Функция `chunk_fixed(text, size, overlap)` режет строку на куски заданного размера с перекрытием.\n\nПример: `chunk_fixed(\"abcdefghij\", size=5, overlap=2)` → `[\"abcde\", \"defgh\", \"ghij\"]`",
      starterCode: `def chunk_fixed(text: str, size: int = 5, overlap: int = 2) -> list[str]:
    if size <= overlap:
        raise ValueError("size должен быть больше overlap")
    # Допиши
    pass


# Тесты
print(chunk_fixed("abcdefghij", size=5, overlap=2))
# ['abcde', 'defgh', 'ghij']

print(chunk_fixed("short", size=10, overlap=0))
# ['short']

print(chunk_fixed("a" * 12, size=4, overlap=1))
# ['aaaa', 'aaaa', 'aaaa', 'aaa']  или близкое разделение
`,
      solutionCode: `def chunk_fixed(text: str, size: int = 5, overlap: int = 2) -> list[str]:
    if size <= overlap:
        raise ValueError("size должен быть больше overlap")
    if not text:
        return []
    chunks = []
    step = size - overlap
    i = 0
    while i < len(text):
        chunks.append(text[i:i + size])
        if i + size >= len(text):
            break
        i += step
    return chunks


print(chunk_fixed("abcdefghij", size=5, overlap=2))
print(chunk_fixed("short", size=10, overlap=0))
print(chunk_fixed("a" * 12, size=4, overlap=1))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Sentence-based chunking",
      description:
        "Функция `chunk_sentences(text, max_sentences=3)` режет текст на куски по `max_sentences` предложений каждый.\n\nПредложения разделяются по `.`, `!`, `?` + пробел.",
      starterCode: `import re


def split_sentences(text: str) -> list[str]:
    # Разделим по .!? за которыми идёт пробел или конец
    parts = re.split(r"(?<=[.!?])\\s+", text.strip())
    return [p for p in parts if p]


def chunk_sentences(text: str, max_sentences: int = 3) -> list[str]:
    sentences = split_sentences(text)
    # Допиши: группируй по max_sentences
    pass


text = "Первое предложение. Второе предложение! А третье? Четвёртое. Пятое. Шестое!"

for i, chunk in enumerate(chunk_sentences(text, max_sentences=2), 1):
    print(f"Chunk {i}: {chunk}")
`,
      solutionCode: `import re


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\\s+", text.strip())
    return [p for p in parts if p]


def chunk_sentences(text: str, max_sentences: int = 3) -> list[str]:
    sentences = split_sentences(text)
    chunks = []
    for i in range(0, len(sentences), max_sentences):
        chunk = " ".join(sentences[i:i + max_sentences])
        chunks.append(chunk)
    return chunks


text = "Первое предложение. Второе предложение! А третье? Четвёртое. Пятое. Шестое!"
for i, chunk in enumerate(chunk_sentences(text, max_sentences=2), 1):
    print(f"Chunk {i}: {chunk}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Recursive chunking (упрощённый)",
      description:
        "Реализуй упрощённый recursive splitter:\n\n1. Разрезать по `\\n\\n` (абзацы)\n2. Сгруппировать абзацы в чанки до `max_size` символов\n3. Если один абзац длиннее `max_size` — разделить его по предложениям\n4. Если предложение длиннее `max_size` — fixed-split",
      starterCode: `import re


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\\s+", text.strip())
    return [p for p in parts if p]


def chunk_recursive(text: str, max_size: int = 200) -> list[str]:
    # Шаг 1: разрезать по двойным переводам
    paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]

    chunks = []
    current = ""

    for p in paragraphs:
        if len(p) > max_size:
            # Сначала flush текущего буфера
            if current:
                chunks.append(current.strip())
                current = ""
            # Разделим параграф на предложения
            for sentence in split_sentences(p):
                if len(sentence) > max_size:
                    # Fallback: hard-split по символам
                    for i in range(0, len(sentence), max_size):
                        chunks.append(sentence[i:i + max_size])
                else:
                    if len(current) + len(sentence) + 1 <= max_size:
                        current += sentence + " "
                    else:
                        if current:
                            chunks.append(current.strip())
                        current = sentence + " "
        else:
            if len(current) + len(p) + 2 <= max_size:
                current += p + "\\n\\n"
            else:
                if current:
                    chunks.append(current.strip())
                current = p + "\\n\\n"

    if current.strip():
        chunks.append(current.strip())
    return chunks


text = """Первый абзац короткий. И ещё одно предложение.

Второй абзац тоже не очень длинный, всего два предложения. Вот ещё одно.

Третий абзац может быть очень-очень длинным, настолько что нам придётся разбивать его на предложения. Это первое предложение. Это второе. Это третье очень длинное предложение со множеством слов и идей, которые автор хотел донести до читателя в одном завершённом и важном высказывании.

Короткий четвёртый.
"""

for i, chunk in enumerate(chunk_recursive(text, max_size=150), 1):
    print(f"--- Chunk {i} (len={len(chunk)}) ---")
    print(chunk)
    print()
`,
      solutionCode: `import re


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\\s+", text.strip())
    return [p for p in parts if p]


def chunk_recursive(text: str, max_size: int = 200) -> list[str]:
    paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]
    chunks = []
    current = ""

    for p in paragraphs:
        if len(p) > max_size:
            if current:
                chunks.append(current.strip())
                current = ""
            for sentence in split_sentences(p):
                if len(sentence) > max_size:
                    for i in range(0, len(sentence), max_size):
                        chunks.append(sentence[i:i + max_size])
                else:
                    if len(current) + len(sentence) + 1 <= max_size:
                        current += sentence + " "
                    else:
                        if current:
                            chunks.append(current.strip())
                        current = sentence + " "
        else:
            if len(current) + len(p) + 2 <= max_size:
                current += p + "\\n\\n"
            else:
                if current:
                    chunks.append(current.strip())
                current = p + "\\n\\n"

    if current.strip():
        chunks.append(current.strip())
    return chunks


text = """Первый абзац короткий. И ещё одно предложение.

Второй абзац тоже не очень длинный, всего два предложения. Вот ещё одно.

Третий абзац может быть очень-очень длинным, настолько что нам придётся разбивать его на предложения. Это первое предложение. Это второе. Это третье очень длинное предложение со множеством слов и идей, которые автор хотел донести до читателя в одном завершённом и важном высказывании.

Короткий четвёртый.
"""

for i, chunk in enumerate(chunk_recursive(text, max_size=150), 1):
    print(f"--- Chunk {i} (len={len(chunk)}) ---")
    print(chunk)
    print()`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Chroma + chunking pipeline",
      description:
        "На своей машине:\n\n1. `pip install chromadb`\n2. Возьми любой длинный текст: статья из Википедии, главы книги, документация (Markdown)\n3. Нарежь на чанки (используй recursive splitter из практики 3 или LangChain)\n4. Положи в Chroma с метаданными `{source, chunk_index, length}`\n5. Сделай 5 запросов, выведи top-3 и их источники\n6. Поэкспериментируй с `chunk_size`: 200 vs 800 — где лучше результат?",
      starterCode: `import chromadb
from chromadb.config import Settings

# Создаём persistent клиент — сохраняется на диск
client = chromadb.PersistentClient(path="./chroma_db")

# Получаем или создаём коллекцию
collection = client.get_or_create_collection(
    name="my_first_rag",
    metadata={"description": "Эксперимент с chunking"}
)


def ingest_document(text: str, source: str, chunk_fn) -> int:
    chunks = chunk_fn(text)
    ids = [f"{source}#{i}" for i in range(len(chunks))]
    metadatas = [
        {"source": source, "chunk_index": i, "length": len(c)}
        for i, c in enumerate(chunks)
    ]
    collection.add(documents=chunks, ids=ids, metadatas=metadatas)
    return len(chunks)


def search(query: str, k: int = 3):
    results = collection.query(query_texts=[query], n_results=k)
    return list(zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ))


# Подключи свой recursive splitter из практики 3
# from your_module import chunk_recursive

# Пример загрузки
with open("article.md", encoding="utf-8") as f:
    text = f.read()

n = ingest_document(text, source="article.md", chunk_fn=lambda t: chunk_recursive(t, max_size=500))
print(f"Загружено {n} chunks")

queries = ["Что такое X?", "Как работает Y?", "Когда применять Z?"]
for q in queries:
    print(f"\\n=== {q} ===")
    for text, meta, dist in search(q, k=3):
        print(f"  [{dist:.3f}] {meta['source']}#{meta['chunk_index']}")
        print(f"        {text[:150]}...")
`,
      language: "python",
      runnable: false,
      hints: [
        "Chroma по умолчанию использует свою embedding-модель (sentence-transformers). Для лучшего качества можно подключить OpenAI или Voyage через embedding_function.",
        "Меньшие chunks (200) → точнее поиск, больше шума. Большие (800) → шире контекст, меньше точность. Эксперимент покажет sweet spot для твоих данных.",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь зачем нужна векторная БД (ANN-индексы, персистентность)",
    "Знаешь основные опции (Chroma / Qdrant / Pinecone) и когда какую выбрать",
    "Реализовал 3 стратегии chunking своими руками",
    "Локально настроил Chroma, загрузил документы, провёл поиск",
    "Понимаешь зачем нужны метаданные у чанков",
  ],
};
