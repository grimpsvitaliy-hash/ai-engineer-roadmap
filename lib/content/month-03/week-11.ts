import type { Lesson } from "../types";

export const week11: Lesson = {
  id: "m3-w11",
  monthId: "month-03",
  weekNumber: 11,
  title: "Evals — как тестировать LLM-приложения",
  goal: "Понимаешь почему обычные unit-тесты не работают для LLM. Знаешь 3-4 подхода к эвалам. Можешь измерить улучшение промпта в цифрах.",
  estimatedHours: "6-7 ч",
  theory: [
    {
      id: "why-evals",
      title: "Почему обычные тесты не работают",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "callout",
          variant: "info",
          title: "Главная разница",
          content:
            "Для классического кода: `assert add(2, 3) == 5` — однозначно. Для LLM: «расскажи про Париж» — нет одного правильного ответа, есть тысячи приемлемых вариантов.",
        },
        {
          type: "text",
          content:
            "**Особенности LLM, которые ломают традиционное тестирование:**\n\n1. **Недетерминированность** — даже `temperature=0` не гарантирует битовое совпадение\n2. **Множество правильных ответов** — особенно для генеративных задач\n3. **Качество — субъективно** — «хорошее» резюме не имеет единственной формы\n4. **Регрессии незаметны** — изменил промпт → 5% задач стало хуже, ты не узнаешь",
        },
        {
          type: "callout",
          variant: "danger",
          title: "Без эвалов ты летишь вслепую",
          content:
            "Большинство джунов не отвечают на собесе на вопрос «как ты тестировал свой LLM-проект?». Если ответишь — **выделишься**. Это критичный навык в индустрии.",
        },
      ],
    },
    {
      id: "eval-dataset",
      title: "Eval dataset — твой главный артефакт",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Eval dataset** — это набор пар «вход + критерий правильности», против которого ты прогоняешь систему.",
        },
        {
          type: "code",
          language: "jsonl",
          content: `{"input": "Сервис ужасный", "expected_label": "negative"}
{"input": "Доставка вовремя", "expected_label": "positive"}
{"input": "Работает", "expected_label": "neutral"}
{"input": "Не знаю что сказать", "expected_label": "neutral"}
{"input": "Отвратительно!", "expected_label": "negative"}
... (минимум 20-50 примеров)`,
        },
        {
          type: "text",
          content:
            "**Правила хорошего датасета:**\n\n- ✅ Минимум **20-50** примеров (на меньшем — статистический шум)\n- ✅ **Разнообразие** — короткие/длинные, простые/каверзные, типичные/edge cases\n- ✅ Включай **сарказм, опечатки, эмодзи** — реальные пользователи их используют\n- ✅ Веди в **JSONL** (одна запись = одна строка) — легко добавлять и парсить\n- ✅ Регулярно **обновляй**: нашёл баг в проде → добавил в датасет",
        },
      ],
    },
    {
      id: "types-evals",
      title: "4 типа эвалов",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**1. Code-based (проверка кодом)** — когда ответ можно проверить программно:",
        },
        {
          type: "code",
          language: "python",
          content: `def eval_classification(pred: str, expected: str) -> bool:
    return pred.strip().lower() == expected.lower()

def eval_json_valid(pred: str) -> bool:
    try:
        json.loads(pred)
        return True
    except:
        return False

def eval_contains(pred: str, must_contain: list[str]) -> bool:
    return all(s.lower() in pred.lower() for s in must_contain)`,
        },
        {
          type: "text",
          content:
            "**2. LLM-as-judge** — другая LLM оценивает качество:",
        },
        {
          type: "code",
          language: "python",
          content: `def judge_helpfulness(question: str, answer: str) -> int:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=100,
        temperature=0,
        system="Ты оцениваешь полезность ответов. Отвечай ТОЛЬКО числом 1-5.",
        messages=[{
            "role": "user",
            "content": f"Вопрос: {question}\\n\\nОтвет: {answer}\\n\\nОценка (1=бесполезно, 5=супер):"
        }]
    )
    return int(response.content[0].text.strip())`,
        },
        {
          type: "text",
          content:
            "**3. Human evals** — золотой стандарт, но дорогой:",
        },
        {
          type: "text",
          content:
            "Используй для финального QA важных систем. Несколько людей просматривают N случайных примеров → договариваются по rubric → результат — точка истины.",
        },
        {
          type: "text",
          content:
            "**4. A/B testing на проде** — после деплоя:",
        },
        {
          type: "text",
          content:
            "Половине пользователей — версия A, половине — B. Сравниваешь метрики (CSAT, conversion, retention). Самый дорогой, но самый правдивый эвал.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Прагматично",
          content:
            "Для пет-проекта и собеса: **code-based + LLM-as-judge** хватит. Human eval — только если делаешь что-то серьёзное.",
        },
      ],
    },
    {
      id: "metrics",
      title: "Что мерить",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "Для **классификации**: accuracy, precision, recall, F1.\n\nДля **извлечения** (NER, structured): field-level precision/recall.\n\nДля **генерации**:\n- Faithfulness — отвечает ли ответ на основе контекста (для RAG)\n- Relevance — релевантность теме\n- Coherence — связность\n- Toxicity — отсутствие вреда\n- Hallucination rate — % фактических ошибок\n\nДля **агентов**:\n- Task completion rate — % задач, доведённых до конца\n- Tool selection accuracy — правильность выбора tool\n- Steps to completion — сколько итераций потребовалось",
        },
      ],
    },
    {
      id: "process",
      title: "Процесс работы с эвалами",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**Цикл «измерил → улучшил»:**\n\n1. Создал eval dataset (20-50 примеров)\n2. Запустил baseline — текущая система → 65% accuracy\n3. Поменял что-то (промпт / модель / температуру)\n4. Прогнал на том же датасете → 78%\n5. Проанализировал на чём всё ещё ошибается → добавил эти кейсы в датасет\n6. Goto 3",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Antipattern: тюнинг под тест",
          content:
            "Если ты слишком оптимизируешь под маленький eval set — модель «переобучится» на конкретные кейсы. Имей **eval set + holdout set** (10-20% для финальной проверки, не используется в итерациях).",
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
              title: "Hamel Husain — Your AI Product Needs Evals",
              url: "https://hamel.dev/blog/posts/evals/",
              description: "Лучший пост про эвалы в индустрии. Прочитай дважды.",
            },
            {
              title: "Eugene Yan — Evaluation patterns",
              url: "https://eugeneyan.com/writing/evals/",
              description: "Глубокая статья про паттерны эвалов.",
            },
            {
              title: "Anthropic — Test and evaluate",
              url: "https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool",
              description: "Официальный инструмент Anthropic.",
            },
            {
              title: "Promptfoo — CLI для тестирования промптов",
              url: "https://www.promptfoo.dev/",
              description: "Готовый фреймворк когда захочешь масштабироваться.",
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
          emoji: "📏",
          title: "Закон Друкера и Гудхарта",
          content:
            "**Peter Drucker**: «You can't manage what you don't measure». Без эвалов улучшать LLM-приложение всё равно что чинить машину с завязанными глазами. Но есть и **Закон Гудхарта**: «когда метрика становится целью, она перестаёт быть хорошей метрикой». Если оптимизировать только под benchmark — система начинает обманывать тебя. Эвалы должны меняться так же быстро как продукт.",
        },
        {
          type: "funfact",
          emoji: "🤥",
          title: "Самый известный AI-фейл",
          content:
            "В 2023 адвокат Стивен Шварц использовал ChatGPT для подготовки иска. Модель сгенерировала **6 ссылок на судебные прецеденты, которые НЕ существовали**. Адвокат не проверил. Судья поймал, выписал штраф **$5000** и публично пристыдил. С тех пор это **классический пример галлюцинаций LLM**. И теперь во всех LLM-курсах есть слайд: «Mata v. Avianca, 2023».",
        },
        {
          type: "funfact",
          emoji: "🤖",
          title: "LLM судит LLM — это правда работает",
          content:
            "**LLM-as-judge** звучит странно — модель оценивает другую модель. Но исследования показывают что **корреляция с человеческими оценками — 80%+** для большинства задач. Anthropic использует Claude для оценки Claude. OpenAI — GPT-4 для оценки GPT-4o. Это дешёво, быстро и масштабируется. Парадокс: модели становятся лучше в оценке себя быстрее, чем в выполнении самих задач.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Почему обычные unit-тесты плохо работают для LLM?",
      options: [
        { id: "a", text: "LLM работают слишком быстро для тестов" },
        { id: "b", text: "Ответ недетерминирован, и часто нет одного «правильного» ответа" },
        { id: "c", text: "pytest не поддерживает Python > 3.10" },
        { id: "d", text: "Они работают идеально, тесты не нужны" },
      ],
      correctOptionId: "b",
      explanation:
        "Главная проблема — нет однозначного assert. Нужны статистические эвалы на больших датасетах, а не точечные проверки.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Сколько примеров минимум должно быть в начальном eval dataset?",
      options: [
        { id: "a", text: "3-5 — главное чтобы были" },
        { id: "b", text: "20-50 — иначе статистический шум" },
        { id: "c", text: "Тысячи — иначе бесполезно" },
        { id: "d", text: "Зависит от настроения" },
      ],
      correctOptionId: "b",
      explanation:
        "На 10 примерах разница в один ответ = 10%, легко поверить случайному улучшению. 20-50 — минимальный осмысленный размер.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Какие типы эвалов существуют? (несколько)",
      options: [
        { id: "a", text: "Code-based — программная проверка" },
        { id: "b", text: "LLM-as-judge — другая LLM оценивает" },
        { id: "c", text: "Human evals — люди ставят оценки" },
        { id: "d", text: "A/B testing на проде" },
      ],
      correctOptionIds: ["a", "b", "c", "d"],
      explanation:
        "Все четыре — реальные подходы. У каждого свой trade-off: code-based (дёшево/ограничено), judge (масштабируемо/субъективно), human (точно/дорого), A/B (правдиво/требует прода).",
    },
    {
      id: "q4",
      type: "single-choice",
      question: "Что такое holdout set?",
      options: [
        { id: "a", text: "Папка с забытыми файлами" },
        { id: "b", text: "Отложенная часть датасета, которая не используется в итерациях" },
        { id: "c", text: "Резервная копия модели" },
        { id: "d", text: "Пользователи, которым не показывают новые фичи" },
      ],
      correctOptionId: "b",
      explanation:
        "Holdout — защита от «переобучения промпта» под eval set. Финальная проверка на нём показывает реальное качество.",
    },
    {
      id: "q5",
      type: "single-choice",
      question:
        "Тебе нужно оценить генеративную задачу (бот пишет письма). У тебя 50 пар «контекст → ожидаемые свойства письма». Какой эвал лучше всего подходит?",
      options: [
        { id: "a", text: "Strict string equality" },
        { id: "b", text: "LLM-as-judge с rubric (структура, тон, наличие ключевых пунктов)" },
        { id: "c", text: "Regular expressions" },
        { id: "d", text: "Не тестировать вообще" },
      ],
      correctOptionId: "b",
      explanation:
        "Генеративные задачи плохо подходят под code-based: ответы разные. LLM-judge с чёткой rubric — стандартное решение.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Antipattern в работе с эвалами:",
      options: [
        { id: "a", text: "Регулярно добавлять новые кейсы из реальных багов" },
        { id: "b", text: "Очень сильно оптимизировать под маленький eval set без holdout" },
        { id: "c", text: "Использовать LLM-as-judge" },
        { id: "d", text: "Считать процент правильных ответов" },
      ],
      correctOptionId: "b",
      explanation:
        "Это называется overfitting on eval set. Решение — иметь holdout, не использовавшийся в итерациях.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Загрузка JSONL-датасета",
      description:
        "Напиши функцию `load_jsonl(path)` которая читает файл формата JSONL (одна JSON-запись на строке) и возвращает список словарей.\n\nДолжна корректно обрабатывать пустые строки и комментарии (`# ...`).",
      starterCode: `import json
from io import StringIO


def load_jsonl(source) -> list[dict]:
    """source: путь к файлу ИЛИ файловый объект"""
    if isinstance(source, str):
        f = open(source, "r", encoding="utf-8")
        close_after = True
    else:
        f = source
        close_after = False

    try:
        out = []
        for line in f:
            # Допиши обработку
            pass
        return out
    finally:
        if close_after:
            f.close()


# Тест на in-memory файле
sample = '''
{"input": "Привет", "expected": "positive"}
# это комментарий
{"input": "Ужасно", "expected": "negative"}

{"input": "Норм", "expected": "neutral"}
'''

data = load_jsonl(StringIO(sample))
print(f"Загружено: {len(data)}")
for d in data:
    print(f"  {d}")
`,
      solutionCode: `import json
from io import StringIO


def load_jsonl(source) -> list[dict]:
    if isinstance(source, str):
        f = open(source, "r", encoding="utf-8")
        close_after = True
    else:
        f = source
        close_after = False

    try:
        out = []
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            out.append(json.loads(line))
        return out
    finally:
        if close_after:
            f.close()


sample = '''
{"input": "Привет", "expected": "positive"}
# это комментарий
{"input": "Ужасно", "expected": "negative"}

{"input": "Норм", "expected": "neutral"}
'''

data = load_jsonl(StringIO(sample))
print(f"Загружено: {len(data)}")
for d in data:
    print(f"  {d}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Метрики классификации",
      description:
        "Напиши функцию `compute_metrics(predictions, expected)`, которая возвращает словарь с метриками:\n\n- `accuracy` — доля совпадений\n- `per_class` — для каждого класса: `{correct, total, precision}`\n\nНе используй sklearn — реализуй вручную, это полезно для понимания.",
      starterCode: `def compute_metrics(predictions: list[str], expected: list[str]) -> dict:
    if len(predictions) != len(expected):
        raise ValueError("Длины списков не совпадают")

    # Допиши: accuracy + per_class
    pass


# Тест
predictions = ["positive", "negative", "positive", "neutral", "positive", "negative"]
expected    = ["positive", "negative", "negative", "neutral", "positive", "positive"]

import json
print(json.dumps(compute_metrics(predictions, expected), indent=2, ensure_ascii=False))
`,
      solutionCode: `def compute_metrics(predictions: list[str], expected: list[str]) -> dict:
    if len(predictions) != len(expected):
        raise ValueError("Длины списков не совпадают")

    total = len(predictions)
    correct = sum(p == e for p, e in zip(predictions, expected))
    accuracy = correct / total if total > 0 else 0.0

    per_class = {}
    classes = set(expected) | set(predictions)
    for cls in classes:
        # precision: из всех предсказаний этого класса — сколько верных
        predicted_as = [i for i, p in enumerate(predictions) if p == cls]
        correct_pred = [i for i in predicted_as if predictions[i] == expected[i]]
        precision = len(correct_pred) / len(predicted_as) if predicted_as else 0.0

        per_class[cls] = {
            "correct": len(correct_pred),
            "predicted_total": len(predicted_as),
            "precision": round(precision, 3),
        }

    return {
        "accuracy": round(accuracy, 3),
        "total": total,
        "per_class": per_class,
    }


predictions = ["positive", "negative", "positive", "neutral", "positive", "negative"]
expected    = ["positive", "negative", "negative", "neutral", "positive", "positive"]

import json
print(json.dumps(compute_metrics(predictions, expected), indent=2, ensure_ascii=False))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Eval runner с моком LLM",
      description:
        "Запускаем эвал. Класс `EvalRunner`:\n- `__init__(model_fn)` где `model_fn(input) -> prediction`\n- `run(dataset)` → пробегает по датасету, возвращает результаты\n- `report(results)` → печатает таблицу: input, expected, prediction, ✓/✗",
      starterCode: `class EvalRunner:
    def __init__(self, model_fn):
        self.model_fn = model_fn

    def run(self, dataset: list[dict]) -> list[dict]:
        results = []
        for item in dataset:
            # Допиши: вызови model_fn, сохрани результат
            pass
        return results

    def report(self, results: list[dict]) -> None:
        # Таблица + accuracy
        pass


# Мок модели: знает что 'хорошо', 'плохо', 'нормально'
def mock_model(text: str) -> str:
    text = text.lower()
    if any(w in text for w in ["хорошо", "отлично", "супер"]):
        return "positive"
    if any(w in text for w in ["плохо", "ужас", "отвратительно"]):
        return "negative"
    return "neutral"


dataset = [
    {"input": "Всё хорошо", "expected": "positive"},
    {"input": "Это ужасно", "expected": "negative"},
    {"input": "Нормально", "expected": "neutral"},
    {"input": "Супер сервис", "expected": "positive"},
    {"input": "Не очень", "expected": "negative"},  # модель тут ошибётся
]

runner = EvalRunner(mock_model)
results = runner.run(dataset)
runner.report(results)
`,
      solutionCode: `class EvalRunner:
    def __init__(self, model_fn):
        self.model_fn = model_fn

    def run(self, dataset: list[dict]) -> list[dict]:
        results = []
        for item in dataset:
            pred = self.model_fn(item["input"])
            results.append({
                "input": item["input"],
                "expected": item["expected"],
                "prediction": pred,
                "correct": pred == item["expected"],
            })
        return results

    def report(self, results: list[dict]) -> None:
        correct = sum(r["correct"] for r in results)
        total = len(results)
        accuracy = correct / total * 100 if total else 0

        print(f"{'  ':4}{'INPUT':<25} {'EXPECTED':<10} {'PRED':<10} {'OK'}")
        print("─" * 60)
        for r in results:
            mark = "✓" if r["correct"] else "✗"
            print(f"{mark:4}{r['input'][:23]:<25} {r['expected']:<10} {r['prediction']:<10}")
        print("─" * 60)
        print(f"Accuracy: {correct}/{total} = {accuracy:.1f}%")


def mock_model(text: str) -> str:
    text = text.lower()
    if any(w in text for w in ["хорошо", "отлично", "супер"]):
        return "positive"
    if any(w in text for w in ["плохо", "ужас", "отвратительно"]):
        return "negative"
    return "neutral"


dataset = [
    {"input": "Всё хорошо", "expected": "positive"},
    {"input": "Это ужасно", "expected": "negative"},
    {"input": "Нормально", "expected": "neutral"},
    {"input": "Супер сервис", "expected": "positive"},
    {"input": "Не очень", "expected": "negative"},
]

runner = EvalRunner(mock_model)
results = runner.run(dataset)
runner.report(results)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: эвал реального промпта",
      description:
        "Возьми свой character-chat из прошлой недели или новую задачу классификации.\n\n**Шаги:**\n\n1. Создай `eval_dataset.jsonl` минимум на 20 примеров с эталонными ответами\n2. Напиши `evals.py` — прогоняет датасет через твою функцию, считает метрики\n3. Прогон **базовой** версии промпта → запиши accuracy\n4. Изменил промпт (улучшил формулировки, добавил few-shot) → прогон\n5. Запиши **сравнительную таблицу**: версия → accuracy → стоимость → выводы\n6. Положи в README главного проекта",
      starterCode: `# Скелет evals.py
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()


def load_jsonl(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip() and not line.startswith("#")]


def classify(prompt_template: str, text: str) -> tuple[str, float]:
    prompt = prompt_template.format(text=text)
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=10,
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    answer = response.content[0].text.strip().lower()
    cost = (response.usage.input_tokens / 1e6) * 0.80 + (response.usage.output_tokens / 1e6) * 4.00
    return answer, cost


def eval_prompt(name: str, prompt_template: str, dataset: list[dict]) -> dict:
    correct = 0
    total_cost = 0
    errors = []

    for item in dataset:
        pred, cost = classify(prompt_template, item["input"])
        total_cost += cost
        if item["expected"] in pred:
            correct += 1
        else:
            errors.append({"input": item["input"], "expected": item["expected"], "got": pred})

    accuracy = correct / len(dataset) * 100
    print(f"\\n=== {name} ===")
    print(f"Accuracy: {correct}/{len(dataset)} = {accuracy:.1f}%")
    print(f"Cost: $\${total_cost:.6f}")
    if errors:
        print(f"Errors ({len(errors)}):")
        for e in errors[:5]:
            print(f"  '{e['input'][:40]}' → {e['expected']} ≠ {e['got']}")

    return {"name": name, "accuracy": accuracy, "cost": total_cost, "errors": errors}


# Версии промпта
V1 = """Классифицируй (positive/negative/neutral):
{text}
Ответ:"""

V2 = """<task>Классификация тональности отзыва</task>
<labels>positive | negative | neutral</labels>
<examples>
"Сервис отличный" → positive
"Сломалось" → negative
"Работает" → neutral
</examples>
<input>{text}</input>
<output>Одно слово из labels</output>"""


dataset = load_jsonl("eval_dataset.jsonl")
print(f"Тестов: {len(dataset)}")

r1 = eval_prompt("V1 (zero-shot)", V1, dataset)
r2 = eval_prompt("V2 (few-shot XML)", V2, dataset)

print(f"\\n=== Сравнение ===")
print(f"V1 → V2: {r1['accuracy']:.1f}% → {r2['accuracy']:.1f}% ({r2['accuracy'] - r1['accuracy']:+.1f}%)")
print(f"Cost ratio: V2 / V1 = {r2['cost'] / r1['cost']:.2f}x")
`,
      language: "python",
      runnable: false,
      hints: [
        "Чем разнообразнее датасет — тем точнее эвал. Включи короткие/длинные, сарказм, опечатки.",
        "Если V2 хуже V1 — нормально. Это и есть результат эвала: ты узнал, что улучшение не сработало.",
      ],
    },
  ],
  checkpoint: [
    "Понимаешь, почему обычные тесты не работают для LLM",
    "Можешь создать eval dataset из 20+ примеров",
    "Знаешь 4 типа эвалов и когда какой использовать",
    "Реализовал eval runner с метриками",
    "Локально провёл сравнение двух версий промпта в цифрах",
  ],
};
