import type { Lesson } from "../types";

export const week16: Lesson = {
  id: "m4-w16",
  monthId: "month-04",
  weekNumber: 16,
  title: "Улучшения RAG + Портфолио-проект #2",
  goal: "Знаешь продвинутые техники (hybrid, reranking, query rewriting, contextual retrieval). Полируешь свой RAG до портфолио-уровня с эвалами в цифрах.",
  estimatedHours: "8 ч",
  theory: [
    {
      id: "why-mvp-bad",
      title: "Почему первая версия RAG почти всегда плохая",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "callout",
          variant: "warning",
          title: "Типичная ошибка джуна",
          content:
            "«Я сделал RAG, он работает» — обычно значит «работает на 3 моих демо-вопросах». На реальных пользователях баг-репорты сыпятся через неделю. Без эвалов и улучшений RAG плохой по умолчанию.",
        },
        {
          type: "text",
          content:
            "**Где обычно ломается:**\n\n1. **Запрос пользователя плохо ищется** — он спрашивает «как пофиксить ошибку 500», а в базе документ «troubleshooting internal server errors»\n2. **Top-K чанков нерелевантны** — нашлись похожие слова, но не по теме\n3. **Только semantic пропускает точные совпадения** — конкретные имена, коды ошибок, цифры\n4. **Контекста слишком много / слишком мало** — нужно подбирать K\n5. **Чанк без контекста** — «эта функция возвращает X» — но какая функция, в каком файле?\n6. **Метаданные не используются** — нет фильтрации",
        },
      ],
    },
    {
      id: "query-rewriting",
      title: "Query rewriting",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Идея:** прежде чем искать, LLM перефразирует запрос пользователя в более качественный для retrieval.",
        },
        {
          type: "code",
          language: "python",
          content: `def rewrite_query(user_query: str) -> str:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=200,
        temperature=0,
        system=(
            "Ты переформулируешь вопросы пользователей для поиска в технической документации. "
            "Преврати разговорный вопрос в формальный поисковый запрос, добавь синонимы и термины."
        ),
        messages=[{"role": "user", "content": user_query}]
    )
    return response.content[0].text


# "как пофиксить ошибку 500"
# → "HTTP 500 internal server error troubleshooting fix resolve"`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Multi-query",
          content:
            "Продвинутая версия: попроси LLM сгенерировать **3-5 разных перефразировок**, ищи по каждой, объединяй результаты (`top-K по объединению`). Часто +10% к Recall@K.",
        },
      ],
    },
    {
      id: "reranking",
      title: "Reranking",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Идея:** retrieve много (top-20), потом отдельной моделью переранжируй и оставь лучшие (top-5).\n\nПервый этап (vector search) — быстрый, грубый. Второй этап (reranker) — медленнее, но точнее.",
        },
        {
          type: "code",
          language: "python",
          content: `import voyageai

vo = voyageai.Client()


def rerank(query: str, candidates: list[str], top_k: int = 5) -> list[dict]:
    result = vo.rerank(
        query=query,
        documents=candidates,
        model="rerank-2",
        top_k=top_k
    )
    return [
        {"text": candidates[r.index], "score": r.relevance_score}
        for r in result.results
    ]


# Пример: после vector search получили 20, оставляем 5 лучших
top20 = chroma.query(query_texts=[user_query], n_results=20)
candidates = top20["documents"][0]

top5 = rerank(user_query, candidates, top_k=5)
# Дальше в промпт идёт только top5`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Cost",
          content:
            "Voyage `rerank-2`: $0.05 / 1M токенов. Cohere Rerank — $1 за 1000 запросов. Это **дороже** embeddings, но всё ещё намного дешевле LLM-вызовов.",
        },
      ],
    },
    {
      id: "hybrid-search",
      title: "Hybrid search (BM25 + embeddings)",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Идея:** объединить **keyword** (BM25) и **semantic** (embeddings).\n\n- Keyword ловит точные совпадения (коды ошибок, имена API, цифры)\n- Semantic ловит смысловые совпадения\n- Объединяем через **Reciprocal Rank Fusion (RRF)**",
        },
        {
          type: "code",
          language: "python",
          content: `from rank_bm25 import BM25Okapi


def reciprocal_rank_fusion(rankings: list[list[str]], k: int = 60) -> dict[str, float]:
    """Объединяет несколько ранжированных списков в один score."""
    scores = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, 1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return scores


def hybrid_search(query: str, top_k: int = 5):
    # 1. Semantic
    semantic_ids = [r["id"] for r in vector_search(query, top_k=20)]

    # 2. Keyword
    keyword_ids = [r["id"] for r in bm25_search(query, top_k=20)]

    # 3. RRF
    fused = reciprocal_rank_fusion([semantic_ids, keyword_ids])
    sorted_ids = sorted(fused.items(), key=lambda x: x[1], reverse=True)
    return [id for id, _ in sorted_ids[:top_k]]`,
        },
      ],
    },
    {
      id: "contextual-retrieval",
      title: "Contextual Retrieval (Anthropic подход)",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Идея от Anthropic:** перед embedding каждого chunk добавь к нему **короткое описание контекста** — где он в документе, что в нём.",
        },
        {
          type: "code",
          language: "text",
          content: `Обычный chunk:
"Эта функция возвращает None если значение отсутствует."

Contextualized chunk:
"Из документации API authentication, секция parse_token().
Эта функция возвращает None если значение отсутствует."

→ Этот chunk теперь findable по запросам типа
  "parse_token возвращаемое значение" или
  "что возвращает auth API"`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Цена и эффект",
          content:
            "Anthropic утверждает: +49% к точности retrieval. Стоимость: один Haiku-вызов на каждый chunk при ingestion + prompt caching (длинный документ остаётся в кеше) делает это окупаемым.",
        },
      ],
    },
    {
      id: "portfolio-polish",
      title: "Превращаем MVP в портфолио-проект",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**План на неделю:**\n\n1. Возьми RAG из недели 15\n2. **Сначала эвалы** — измерь baseline (recall@5, answer correctness)\n3. **Внедри 1-2 улучшения** (не больше) — например, reranking + query rewriting\n4. **Замерь после** — на сколько % улучшилось\n5. **UI** через Streamlit (1 день)\n6. **README** с цифрами «было / стало», диаграммой архитектуры, скриншотами\n7. **Деплой** через Streamlit Community Cloud (бесплатно)",
        },
        {
          type: "code",
          language: "python",
          content: `# Streamlit UI — минимум, но выглядит профессионально
import streamlit as st
from query import answer

st.set_page_config(page_title="My RAG", page_icon="📚")

st.title("📚 RAG над моей документацией")

with st.sidebar:
    k = st.slider("Top-K chunks", 1, 10, 5)
    st.markdown("---")
    st.markdown("**Stats**")
    st.metric("Docs", "127")
    st.metric("Chunks", "1,432")

question = st.text_input("Задай вопрос:")

if question:
    with st.spinner("Ищу..."):
        result = answer(question, k=k)

    st.markdown("### Ответ")
    st.markdown(result["answer"])

    with st.expander(f"📎 Источники ({len(result['sources'])})"):
        for src in result["sources"]:
            st.markdown(f"- \`{src}\`")`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Числа в README — самое важное",
          content:
            "На собесе твоё «улучшил RAG» — пустые слова. «Поднял Recall@5 с 67% до 84% через reranking + query rewriting на 50-вопросном датасете» — **это говорит «он инженер»**.",
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
              title: "Anthropic — Contextual Retrieval",
              url: "https://www.anthropic.com/news/contextual-retrieval",
              description: "Обязательный пост. +49% к качеству при правильной реализации.",
            },
            {
              title: "Voyage Rerank API",
              url: "https://docs.voyageai.com/docs/reranker",
              description: "Документация по reranker. Бесплатный tier есть.",
            },
            {
              title: "Pinecone — Hybrid Search",
              url: "https://www.pinecone.io/learn/hybrid-search/",
              description: "Глубокий разбор hybrid с RRF.",
            },
            {
              title: "Streamlit Community Cloud",
              url: "https://streamlit.io/cloud",
              description: "Бесплатный хостинг для Streamlit-приложений.",
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
      question: "Что такое query rewriting в контексте RAG?",
      options: [
        { id: "a", text: "Сжатие запроса для экономии токенов" },
        { id: "b", text: "LLM перефразирует запрос пользователя в более качественный для retrieval" },
        { id: "c", text: "Перевод запроса на английский" },
        { id: "d", text: "Удаление стоп-слов" },
      ],
      correctOptionId: "b",
      explanation:
        "«Как пофиксить ошибку 500» → «HTTP 500 internal server error troubleshooting» — теперь retrieval находит лучше.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Зачем нужен reranking?",
      options: [
        { id: "a", text: "Это альтернатива vector search" },
        { id: "b", text: "Второй этап после vector search: retrieve много (top-20), оставить лучшие (top-5) точнее" },
        { id: "c", text: "Сжать ответ" },
        { id: "d", text: "Перевести результаты на другой язык" },
      ],
      correctOptionId: "b",
      explanation:
        "Vector search быстрый но грубый. Reranker — медленнее но точнее. Двухступенчатый подход даёт лучший recall.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Что входит в hybrid search? (несколько)",
      options: [
        { id: "a", text: "BM25 (keyword)" },
        { id: "b", text: "Embeddings (semantic)" },
        { id: "c", text: "Reciprocal Rank Fusion для объединения" },
        { id: "d", text: "Несколько LLM подряд" },
      ],
      correctOptionIds: ["a", "b", "c"],
      explanation:
        "Hybrid = keyword + semantic, объединённые через RRF (или взвешенную сумму скоров).",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Что такое Contextual Retrieval (Anthropic подход)?",
      options: [
        { id: "a", text: "Передавать в LLM большой контекст" },
        { id: "b", text: "К каждому chunk добавляется короткое описание его контекста перед embedding" },
        { id: "c", text: "Использовать модели с большим контекстным окном" },
        { id: "d", text: "Сохранять историю диалога" },
      ],
      correctOptionId: "b",
      explanation:
        "К каждому chunk прикрепляется описание «где он в документе и о чём» (генерируется через Haiku). По данным Anthropic, +49% к качеству retrieval.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Что больше всего ценится в портфолио-RAG на собеседовании?",
      options: [
        { id: "a", text: "Использование LangChain" },
        { id: "b", text: "Цифры эвалов: «улучшил recall@5 с 67% до 84% через X+Y на датасете из 50 вопросов»" },
        { id: "c", text: "Самая большая база документов" },
        { id: "d", text: "Современный UI" },
      ],
      correctOptionId: "b",
      explanation:
        "Числа = доказательство инженерного подхода. «Сделал RAG» — общие слова. «Поднял метрику с X до Y» — это работа senior-инженера.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Reciprocal Rank Fusion",
      description:
        "RRF — стандартный способ объединить несколько ранжированных списков (keyword + semantic + ...).\n\nФормула: для документа d → `sum(1 / (k + rank_in_list))` по всем спискам.\n\nК=60 — обычное значение.",
      starterCode: `def reciprocal_rank_fusion(rankings: list[list[str]], k: int = 60) -> dict[str, float]:
    """
    rankings: список ранжированных списков doc_id
    Возвращает: словарь {doc_id: combined_score}
    """
    # Допиши
    pass


# Тест
semantic = ["doc1", "doc3", "doc2", "doc4"]  # semantic search top-4
keyword =  ["doc2", "doc1", "doc5", "doc3"]  # keyword search top-4

scores = reciprocal_rank_fusion([semantic, keyword])
sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)

print("Объединённый ранжированный список:")
for doc, score in sorted_docs:
    print(f"  {doc}: {score:.4f}")
`,
      solutionCode: `def reciprocal_rank_fusion(rankings: list[list[str]], k: int = 60) -> dict[str, float]:
    scores = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, 1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return scores


semantic = ["doc1", "doc3", "doc2", "doc4"]
keyword =  ["doc2", "doc1", "doc5", "doc3"]

scores = reciprocal_rank_fusion([semantic, keyword])
sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)

print("Объединённый ранжированный список:")
for doc, score in sorted_docs:
    print(f"  {doc}: {score:.4f}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Simple BM25 implementation",
      description:
        "Простой BM25 для понимания того что под капотом keyword-поиска. Реализуй упрощённую версию:\n\nДля каждого документа подсчитай **score** относительно запроса как сумму:\n- За каждое слово запроса, встречающееся в документе: `tf * idf`\n- `tf` = частота слова в документе\n- `idf` = log(N / df), где N = общее число документов, df = в скольки документах встречается",
      starterCode: `import math
import re


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zа-я0-9]+", text.lower())


def simple_bm25_score(query: str, doc: str, all_docs: list[str]) -> float:
    query_terms = set(tokenize(query))
    doc_terms = tokenize(doc)
    if not doc_terms:
        return 0.0

    N = len(all_docs)
    score = 0.0
    for term in query_terms:
        tf = doc_terms.count(term)
        if tf == 0:
            continue
        # idf: сколько документов содержат term
        df = sum(1 for d in all_docs if term in tokenize(d))
        idf = math.log((N - df + 0.5) / (df + 0.5) + 1)
        score += tf * idf
    return score


def bm25_search(query: str, docs: list[dict], k: int = 3) -> list[dict]:
    scored = [
        {"id": d["id"], "text": d["text"], "score": simple_bm25_score(query, d["text"], [x["text"] for x in docs])}
        for d in docs
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)
    return [s for s in scored[:k] if s["score"] > 0]


docs = [
    {"id": "d1", "text": "Python is a programming language"},
    {"id": "d2", "text": "FastAPI is a Python web framework"},
    {"id": "d3", "text": "Docker for containerization"},
    {"id": "d4", "text": "JavaScript for browser programming"},
    {"id": "d5", "text": "Python web frameworks comparison"},
]

print("Query: 'Python web'")
for r in bm25_search("Python web", docs, k=3):
    print(f"  {r['score']:.3f} | {r['id']}: {r['text']}")
`,
      solutionCode: `import math
import re


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zа-я0-9]+", text.lower())


def simple_bm25_score(query: str, doc: str, all_docs: list[str]) -> float:
    query_terms = set(tokenize(query))
    doc_terms = tokenize(doc)
    if not doc_terms:
        return 0.0

    N = len(all_docs)
    score = 0.0
    for term in query_terms:
        tf = doc_terms.count(term)
        if tf == 0:
            continue
        df = sum(1 for d in all_docs if term in tokenize(d))
        idf = math.log((N - df + 0.5) / (df + 0.5) + 1)
        score += tf * idf
    return score


def bm25_search(query: str, docs: list[dict], k: int = 3) -> list[dict]:
    scored = [
        {"id": d["id"], "text": d["text"], "score": simple_bm25_score(query, d["text"], [x["text"] for x in docs])}
        for d in docs
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)
    return [s for s in scored[:k] if s["score"] > 0]


docs = [
    {"id": "d1", "text": "Python is a programming language"},
    {"id": "d2", "text": "FastAPI is a Python web framework"},
    {"id": "d3", "text": "Docker for containerization"},
    {"id": "d4", "text": "JavaScript for browser programming"},
    {"id": "d5", "text": "Python web frameworks comparison"},
]

print("Query: 'Python web'")
for r in bm25_search("Python web", docs, k=3):
    print(f"  {r['score']:.3f} | {r['id']}: {r['text']}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Шаблон для contextual chunk",
      description:
        "Контекстуализация по Anthropic: для каждого chunk сгенерировать короткое описание его контекста.\n\nНапиши функцию `make_contextual_prompt(document, chunk)` которая возвращает промпт для LLM, чтобы получить контекстное описание.",
      starterCode: `def make_contextual_prompt(document: str, chunk: str) -> str:
    """Возвращает промпт, который, отправленный в Claude,
    даст короткое (1-2 предложения) описание контекста chunk-а."""
    return f"""<document>
{document}
</document>

<chunk>
{chunk}
</chunk>

Дай короткое (1-2 предложения) описание о чём этот chunk и где он находится в документе.
Это описание будет добавлено к chunk для улучшения retrieval.
НЕ повторяй сам chunk, просто опиши контекст.

Контекст:"""


def contextualize(chunk: str, context_description: str) -> str:
    """Соединяет контекст и chunk перед embedding."""
    return f"{context_description}\\n\\n{chunk}"


# Демо
doc = """API Authentication Guide v2.0

Этот документ описывает методы аутентификации в нашем API.

## Bearer Token

Самый простой способ. Передавайте токен в заголовке.

## OAuth 2.0

Для интеграций с третьими сторонами. Поддерживает все стандартные flows.

## Метод parse_token

Эта функция возвращает None если значение отсутствует или невалидно.
В случае успеха возвращает словарь с полями user_id и expires_at.
"""

chunk = "Эта функция возвращает None если значение отсутствует или невалидно. В случае успеха возвращает словарь с полями user_id и expires_at."

prompt = make_contextual_prompt(doc, chunk)
print(prompt)
print()

# Имитируем ответ Claude
mock_context = "Описание функции parse_token из раздела API Authentication."
contextualized = contextualize(chunk, mock_context)
print("=" * 50)
print("FINAL CHUNK (что пойдёт в embedding):")
print(contextualized)
`,
      solutionCode: `def make_contextual_prompt(document: str, chunk: str) -> str:
    return f"""<document>
{document}
</document>

<chunk>
{chunk}
</chunk>

Дай короткое (1-2 предложения) описание о чём этот chunk и где он находится в документе.
Это описание будет добавлено к chunk для улучшения retrieval.
НЕ повторяй сам chunk, просто опиши контекст.

Контекст:"""


def contextualize(chunk: str, context_description: str) -> str:
    return f"{context_description}\\n\\n{chunk}"


doc = """API Authentication Guide v2.0

Этот документ описывает методы аутентификации в нашем API.

## Bearer Token

Самый простой способ.

## Метод parse_token

Эта функция возвращает None если значение отсутствует.
"""

chunk = "Эта функция возвращает None если значение отсутствует или невалидно. В случае успеха возвращает словарь с полями user_id и expires_at."

prompt = make_contextual_prompt(doc, chunk)
print(prompt)
print()

mock_context = "Описание функции parse_token из раздела API Authentication."
contextualized = contextualize(chunk, mock_context)
print("=" * 50)
print("FINAL CHUNK:")
print(contextualized)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Портфолио-проект #2 — RAG-ассистент",
      description:
        "Это твой **второй портфолио-проект** для GitHub. Большая работа на 6-8 часов.\n\n**План:**\n\n1. Возьми MVP RAG из недели 15\n2. **Эвал baseline** — 30 вопросов, измерь Recall@5 + Answer correctness\n3. **Внедри ОДНО улучшение** на выбор:\n   - Reranking через Voyage (проще всего, заметный эффект)\n   - Query rewriting (1 доп вызов LLM)\n   - Hybrid search (BM25 + semantic + RRF)\n4. **Эвал после** — те же 30 вопросов, новые цифры\n5. **Streamlit UI** — поле вопроса, ответ, expander со списком источников\n6. **README** с:\n   - архитектурной диаграммой (Excalidraw/Mermaid)\n   - таблицей метрик «было → стало»\n   - стеком технологий\n   - инструкцией запуска\n   - разделом «что бы улучшил ещё»\n7. **Deploy** на Streamlit Community Cloud (бесплатно, требует GitHub)\n8. **Пост** в соцсетях с ссылкой на демо",
      starterCode: `# Структура проекта rag-assistant/
#
# ├── data/                    # твои документы (markdown/pdf)
# ├── ingest.py                # один раз: chunk + embed + load to Chroma
# ├── retriever.py             # vector + (опц.) bm25 + (опц.) rerank
# ├── rag.py                   # answer() — полный pipeline
# ├── evals/
# │   ├── dataset.jsonl        # 30 вопросов с expected_facts и expected_source
# │   └── run.py
# ├── app.py                   # Streamlit
# ├── requirements.txt
# ├── .env.example
# ├── .gitignore               # data/, chroma_db/, .env
# └── README.md

# app.py — пример Streamlit UI
import streamlit as st
from rag import answer

st.set_page_config(page_title="My RAG Assistant", page_icon="📚", layout="wide")

st.title("📚 RAG Assistant")
st.caption("Ответы по моей базе документации с цитированием источников")

with st.sidebar:
    st.header("Настройки")
    k = st.slider("Top-K", 1, 10, 5)
    use_rerank = st.checkbox("Reranking", value=True)
    st.markdown("---")
    st.markdown("### Stats")
    st.metric("Документов", "42")
    st.metric("Chunks", "1,287")
    st.markdown("---")
    st.caption("Built with Chroma + Voyage + Claude")

question = st.text_input("Задай вопрос", placeholder="Какой порт у FastAPI?")

if question:
    with st.spinner("Ищу..."):
        result = answer(question, k=k, rerank=use_rerank)

    st.markdown("### Ответ")
    st.markdown(result["answer"])

    with st.expander(f"📎 Источники ({len(result['sources'])})"):
        for src in result["sources"]:
            st.markdown(f"- \`{src}\`")

    with st.expander("⚙️ Технические детали"):
        st.json({
            "chunks_retrieved": result.get("chunks_count"),
            "rerank_used": use_rerank,
            "tokens": result.get("tokens"),
            "cost_usd": result.get("cost"),
        })
`,
      language: "python",
      runnable: false,
      hints: [
        "Главное — числа в README. Делай таблицу «До → После» с конкретными метриками на конкретном датасете.",
        "Деплой Streamlit Cloud: запушь в GitHub → подключи на streamlit.io/cloud → секреты из .env через UI.",
        "Не пытайся внедрить все 5 улучшений сразу — одно отличное лучше пяти средних.",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь почему MVP RAG обычно плохой и где он ломается",
    "Знаешь 4 техники улучшения: query rewriting, reranking, hybrid, contextual",
    "Внедрил минимум одно улучшение и замерил эффект на эвалах",
    "Создан второй портфолио-проект с UI на Streamlit",
    "Желательно — задеплоено на Streamlit Cloud со ссылкой в README",
    "В README — таблица метрик baseline → after",
    "Опубликован пост о проекте с цифрами улучшения",
  ],
};
