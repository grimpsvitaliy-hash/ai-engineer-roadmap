import type { Lesson } from "../types";

export const week13: Lesson = {
  id: "m4-w13",
  monthId: "month-04",
  weekNumber: 13,
  title: "Embeddings и векторный поиск",
  goal: "Понимаешь что такое embedding (вектор смысла текста), считаешь похожесть через cosine similarity, делаешь первый семантический поиск.",
  estimatedHours: "6-7 ч",
  theory: [
    {
      id: "what-is-embedding",
      title: "Что такое embedding",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Embedding** — это вектор (массив чисел фиксированной длины) представляющий смысл текста в пространстве признаков.",
        },
        {
          type: "code",
          language: "text",
          content: `"собака"   → [0.21, -0.43, 0.55, ...]   (1536 чисел)
"пёс"      → [0.20, -0.41, 0.56, ...]   (близко!)
"квантовое уравнение" → [-0.71, 0.32, -0.11, ...] (далеко)`,
        },
        {
          type: "text",
          content:
            "**Ключевое свойство:** похожие по смыслу тексты дают похожие векторы. Это позволяет искать «по смыслу», а не «по словам».",
        },
        {
          type: "callout",
          variant: "info",
          title: "Размерность",
          content:
            "Типичные размерности: 384 (sentence-transformers), 1024 (Voyage), 1536 (OpenAI ada-002 / text-embedding-3-small), 3072 (text-embedding-3-large). Чем больше — обычно точнее, но дороже хранить и считать.",
        },
      ],
    },
    {
      id: "semantic-vs-keyword",
      title: "Семантический vs полнотекстовый поиск",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Keyword search** ищет тексты, в которых **физически встречаются** слова из запроса.\n\n**Semantic search** ищет тексты, **близкие по смыслу** — даже если слова другие.",
        },
        {
          type: "code",
          language: "text",
          content: `Запрос: "как защитить пароль"

Корпус документов:
1. "Хранение credentials в зашифрованном виде"
2. "Способы безопасности учётных записей"
3. "Установка пароля на роутер"
4. "Шифрование данных в покое"

Keyword search → находит #3 (там слово "пароль")
Semantic search → находит #1, #2, #4 (по смыслу про защиту учётных данных)`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "В продакшене — гибрид",
          content:
            "Лучшие RAG-системы используют **hybrid search**: BM25 (keyword) + embeddings (semantic), потом объединяют. Это часто +10-20% к качеству над чистым semantic.",
        },
      ],
    },
    {
      id: "embedding-providers",
      title: "Какие модели использовать",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Платные cloud (рекомендую для портфолио):**\n\n- **Voyage AI** (`voyage-3`) — партнёр Anthropic, лучшее качество для RAG. https://voyageai.com\n- **OpenAI** (`text-embedding-3-small` / `large`) — дёшево, отлично, индустриальный стандарт\n- **Cohere** (`embed-v3`) — есть бесплатный tier",
        },
        {
          type: "text",
          content:
            "**Open-source локально (если без интернета):**\n\n- **sentence-transformers** — Python библиотека, миллион моделей\n- `all-MiniLM-L6-v2` — компактная (384 dim), быстрая\n- `BAAI/bge-large-en-v1.5` — крупная, очень хорошая\n- Для русского: `sergeyzh/rubert-tiny-turbo`",
        },
        {
          type: "callout",
          variant: "info",
          title: "Цены примерно",
          content:
            "Voyage `voyage-3`: $0.06 / 1M токенов. OpenAI `text-embedding-3-small`: $0.02 / 1M. Это **в десятки раз дешевле** LLM-генерации.",
        },
      ],
    },
    {
      id: "cosine-similarity",
      title: "Cosine similarity — мера похожести",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Cosine similarity** — стандартная метрика для сравнения embeddings. Возвращает значение от -1 до 1:\n\n- **1.0** — идентичны\n- **0.7-0.9** — очень похожи\n- **0.4-0.7** — слабо связаны\n- **< 0.3** — не похожи\n- **0** — ортогональны\n- **-1** — противоположны (редко на практике)",
        },
        {
          type: "code",
          language: "python",
          content: `import numpy as np


def cosine_similarity(a, b) -> float:
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# Применение
query_emb = embed("как защитить пароль")
candidates = [embed(text) for text in corpus]

scores = [(cosine_similarity(query_emb, c), text)
          for c, text in zip(candidates, corpus)]
scores.sort(reverse=True)

for score, text in scores[:3]:
    print(f"{score:.3f} | {text[:80]}")`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Альтернативы",
          content:
            "Можно использовать **dot product** (без нормализации) — быстрее на больших объёмах, и **Euclidean distance** — для некоторых моделей. Но cosine — самый распространённый.",
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
              title: "Pinecone — What are Vector Embeddings",
              url: "https://www.pinecone.io/learn/vector-embeddings/",
              description: "Лучшее введение в embeddings с картинками.",
            },
            {
              title: "Voyage AI docs",
              url: "https://docs.voyageai.com/",
              description: "Документация по embeddings-моделям Voyage (партнёр Anthropic).",
            },
            {
              title: "OpenAI Cookbook — Semantic search",
              url: "https://cookbook.openai.com/examples/semantic_text_search_using_embeddings",
              description: "Готовый туториал по семантическому поиску.",
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
      question: "Что такое embedding текста?",
      options: [
        { id: "a", text: "Сжатая версия текста" },
        { id: "b", text: "Вектор фиксированной длины, представляющий смысл текста" },
        { id: "c", text: "Перевод текста в другой язык" },
        { id: "d", text: "Хеш-сумма текста" },
      ],
      correctOptionId: "b",
      explanation:
        "Embedding — это вектор (например, 1536 чисел). Похожие по смыслу тексты дают близкие векторы — это основа семантического поиска.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question:
        "Запрос «как защитить пароль». Какие документы найдёт semantic search, но не keyword? (несколько)",
      options: [
        { id: "a", text: "«Установка пароля на роутер»" },
        { id: "b", text: "«Хранение credentials в зашифрованном виде»" },
        { id: "c", text: "«Способы безопасности учётных записей»" },
        { id: "d", text: "«Шифрование данных в покое»" },
      ],
      correctOptionIds: ["b", "c", "d"],
      explanation:
        "(a) keyword тоже найдёт — там есть слово «пароль». Остальные — без слова «пароль», но семантически релевантны, найдёт только semantic.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Cosine similarity между двумя идентичными текстами равна:",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "0.5" },
        { id: "c", text: "1.0" },
        { id: "d", text: "Infinity" },
      ],
      correctOptionId: "c",
      explanation:
        "Идентичные векторы → косинус угла между ними = 1.0 (угол 0°).",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Hybrid search — это...",
      options: [
        { id: "a", text: "Использование двух LLM" },
        { id: "b", text: "Комбинация keyword (BM25) и semantic (embeddings) поиска" },
        { id: "c", text: "Поиск на нескольких языках" },
        { id: "d", text: "Кеширование результатов" },
      ],
      correctOptionId: "b",
      explanation:
        "Hybrid берёт лучшее от двух: keyword находит точные совпадения, semantic — близкие по смыслу. Часто +10-20% к качеству.",
    },
    {
      id: "q5",
      type: "text-input",
      question:
        "Какую популярную модель embeddings от OpenAI рекомендуют как «бюджетный default»?\nВведи название модели как в API.",
      correctAnswers: ["text-embedding-3-small"],
      caseSensitive: false,
      explanation:
        "`text-embedding-3-small` — 1536 dim, $0.02 / 1M токенов, отличное соотношение цена/качество. Для максимума есть `-3-large`.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Что примерно стоит embed для типичного документа в 1000 слов?",
      options: [
        { id: "a", text: "~$0.0003 — копейки" },
        { id: "b", text: "~$0.03" },
        { id: "c", text: "~$0.30" },
        { id: "d", text: "~$3" },
      ],
      correctOptionId: "a",
      explanation:
        "1000 слов ≈ 1500 токенов. Voyage $0.06/1M или OpenAI $0.02/1M. 1500/1M × $0.02 = $0.00003. Embeddings — намного дешевле генерации.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Cosine similarity своими руками",
      description:
        "Реализуй `cosine_similarity(a, b)` без numpy — на чистом Python со списками.\n\nФормула: `dot(a,b) / (||a|| * ||b||)`",
      starterCode: `import math


def cosine_similarity(a: list[float], b: list[float]) -> float:
    if len(a) != len(b):
        raise ValueError("Vectors must have same length")
    # Допиши
    pass


# Тесты
print(cosine_similarity([1, 0, 0], [1, 0, 0]))    # 1.0
print(cosine_similarity([1, 0, 0], [0, 1, 0]))    # 0.0
print(cosine_similarity([1, 1, 0], [1, 0, 0]))    # ~0.707
print(cosine_similarity([1, 2, 3], [4, 5, 6]))    # ~0.974

try:
    cosine_similarity([1, 2], [1, 2, 3])
except ValueError as e:
    print(f"OK: {e}")
`,
      solutionCode: `import math


def cosine_similarity(a: list[float], b: list[float]) -> float:
    if len(a) != len(b):
        raise ValueError("Vectors must have same length")
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


print(cosine_similarity([1, 0, 0], [1, 0, 0]))
print(cosine_similarity([1, 0, 0], [0, 1, 0]))
print(cosine_similarity([1, 1, 0], [1, 0, 0]))
print(cosine_similarity([1, 2, 3], [4, 5, 6]))

try:
    cosine_similarity([1, 2], [1, 2, 3])
except ValueError as e:
    print(f"OK: {e}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Top-K похожих документов",
      description:
        "Дан индекс — список `{id, text, embedding}`. Напиши функцию `top_k(query_emb, index, k=3)`, возвращающую `k` самых похожих документов отсортированных по убыванию score.\n\nКаждый результат: `{id, text, score}`.",
      starterCode: `import math


def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(y*y for y in b))
    return dot / (na * nb) if na and nb else 0.0


def top_k(query_emb: list[float], index: list[dict], k: int = 3) -> list[dict]:
    # Допиши
    pass


# Тест с маленькими "embeddings" для наглядности
index = [
    {"id": "doc1", "text": "About cats and dogs", "embedding": [1.0, 0.0, 0.0]},
    {"id": "doc2", "text": "Cooking pasta recipe", "embedding": [0.0, 1.0, 0.0]},
    {"id": "doc3", "text": "Pets care guide", "embedding": [0.9, 0.1, 0.0]},
    {"id": "doc4", "text": "Cloud computing", "embedding": [0.0, 0.0, 1.0]},
]

query = [1.0, 0.0, 0.0]  # тема "питомцы"
results = top_k(query, index, k=2)
for r in results:
    print(f"  {r['score']:.3f} | {r['id']} | {r['text']}")
`,
      solutionCode: `import math


def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(y*y for y in b))
    return dot / (na * nb) if na and nb else 0.0


def top_k(query_emb: list[float], index: list[dict], k: int = 3) -> list[dict]:
    scored = []
    for item in index:
        score = cosine(query_emb, item["embedding"])
        scored.append({"id": item["id"], "text": item["text"], "score": score})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:k]


index = [
    {"id": "doc1", "text": "About cats and dogs", "embedding": [1.0, 0.0, 0.0]},
    {"id": "doc2", "text": "Cooking pasta recipe", "embedding": [0.0, 1.0, 0.0]},
    {"id": "doc3", "text": "Pets care guide", "embedding": [0.9, 0.1, 0.0]},
    {"id": "doc4", "text": "Cloud computing", "embedding": [0.0, 0.0, 1.0]},
]

query = [1.0, 0.0, 0.0]
results = top_k(query, index, k=2)
for r in results:
    print(f"  {r['score']:.3f} | {r['id']} | {r['text']}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "In-memory vector store",
      description:
        "Класс `MemoryVectorStore`:\n- `add(id, text, embedding)` — добавить запись\n- `search(query_emb, k)` — top-k по cosine\n- `count()` — сколько записей\n- `__contains__(id)` — поддержка `\"doc1\" in store`",
      starterCode: `import math


class MemoryVectorStore:
    def __init__(self):
        self._items: list[dict] = []

    def add(self, id: str, text: str, embedding: list[float]) -> None:
        # Допиши
        pass

    def search(self, query_emb: list[float], k: int = 5) -> list[dict]:
        # Допиши
        pass

    def count(self) -> int:
        return len(self._items)

    def __contains__(self, id: str) -> bool:
        # Допиши
        pass


store = MemoryVectorStore()
store.add("a", "About cats", [1.0, 0.1, 0.0])
store.add("b", "About dogs", [0.9, 0.2, 0.0])
store.add("c", "About cloud", [0.0, 0.1, 1.0])

print(f"Count: {store.count()}")
print(f"'a' in store: {'a' in store}")
print(f"'z' in store: {'z' in store}")

for r in store.search([1.0, 0.0, 0.0], k=2):
    print(f"  {r['score']:.3f} | {r['text']}")
`,
      solutionCode: `import math


def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(y*y for y in b))
    return dot / (na * nb) if na and nb else 0.0


class MemoryVectorStore:
    def __init__(self):
        self._items: list[dict] = []

    def add(self, id: str, text: str, embedding: list[float]) -> None:
        self._items.append({"id": id, "text": text, "embedding": embedding})

    def search(self, query_emb: list[float], k: int = 5) -> list[dict]:
        scored = []
        for item in self._items:
            score = cosine(query_emb, item["embedding"])
            scored.append({"id": item["id"], "text": item["text"], "score": score})
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:k]

    def count(self) -> int:
        return len(self._items)

    def __contains__(self, id: str) -> bool:
        return any(item["id"] == id for item in self._items)


store = MemoryVectorStore()
store.add("a", "About cats", [1.0, 0.1, 0.0])
store.add("b", "About dogs", [0.9, 0.2, 0.0])
store.add("c", "About cloud", [0.0, 0.1, 1.0])

print(f"Count: {store.count()}")
print(f"'a' in store: {'a' in store}")
print(f"'z' in store: {'z' in store}")

for r in store.search([1.0, 0.0, 0.0], k=2):
    print(f"  {r['score']:.3f} | {r['text']}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: первый semantic search",
      description:
        "На своей машине:\n\n1. `pip install voyageai numpy` (или используй OpenAI)\n2. Получи ключ Voyage: https://voyageai.com → `VOYAGE_API_KEY` в .env\n3. Возьми ~20 коротких текстов на одну тему (новостные заголовки, описания товаров, FAQ)\n4. Получи embeddings для каждого\n5. Введи в консоли запрос → найди top-3 похожих\n\n**Сравни** с keyword-поиском (просто `if query in text`) — насколько разные результаты?",
      starterCode: `import os
import voyageai
import numpy as np
from dotenv import load_dotenv

load_dotenv()
vo = voyageai.Client()

CORPUS = [
    "Apple представил новый iPhone с улучшенной камерой",
    "Tesla запустила производство Cybertruck",
    "Microsoft купила Activision Blizzard за $69 миллиардов",
    "Google показал новую модель Gemini",
    "Anthropic выпустил Claude 4",
    "Boeing 737 MAX вернулся к полётам",
    "SpaceX успешно запустил Starship",
    "Meta переименовалась из Facebook",
    "NVIDIA достигла капитализации $3 трлн",
    "OpenAI представил GPT-5",
    # ... добавь ещё 10
]


def embed(texts: list[str]) -> list[list[float]]:
    result = vo.embed(texts, model="voyage-3-lite", input_type="document")
    return result.embeddings


def cosine(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def semantic_search(query: str, k: int = 3) -> list[tuple[float, str]]:
    query_emb = vo.embed([query], model="voyage-3-lite", input_type="query").embeddings[0]
    scored = [(cosine(query_emb, emb), text) for emb, text in zip(corpus_embs, CORPUS)]
    scored.sort(reverse=True)
    return scored[:k]


def keyword_search(query: str, k: int = 3) -> list[str]:
    query_words = set(query.lower().split())
    scored = []
    for text in CORPUS:
        text_words = set(text.lower().split())
        overlap = len(query_words & text_words)
        if overlap > 0:
            scored.append((overlap, text))
    scored.sort(reverse=True)
    return [text for _, text in scored[:k]]


# Один раз embed весь корпус
print("Считаю embeddings...")
corpus_embs = embed(CORPUS)
print(f"Готово, {len(corpus_embs)} векторов размерности {len(corpus_embs[0])}")

# Запросы
queries = [
    "новости автопрома",
    "искусственный интеллект",
    "космические запуски",
    "крупные технологические сделки",
]

for q in queries:
    print(f"\\n=== Запрос: '{q}' ===")
    print("Semantic:")
    for score, text in semantic_search(q):
        print(f"  {score:.3f} | {text}")
    print("Keyword:")
    for text in keyword_search(q):
        print(f"        | {text}")
`,
      language: "python",
      runnable: false,
      hints: [
        "Если нет аккаунта Voyage — используй OpenAI: `pip install openai`, `client.embeddings.create(model='text-embedding-3-small', input=texts)`.",
        "Семантический поиск может находить новости про космос даже если в запросе слова «звёзды».",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь что embedding = вектор смысла",
    "Знаешь разницу между keyword и semantic search",
    "Можешь объяснить cosine similarity на пальцах",
    "Локально провёл семантический поиск через настоящий API",
    "Понимаешь концепт гибридного поиска (BM25 + embeddings)",
  ],
};
