import type { Lesson } from "../types";

export const week02: Lesson = {
  id: "m1-w2",
  monthId: "month-01",
  weekNumber: 2,
  title: "Списки, словари, функции, файлы",
  goal: "Понимаешь разницу между списком и словарём, умеешь объявлять и вызывать функции, читаешь и пишешь в файлы.",
  estimatedHours: "7-8 ч",
  theory: [
    {
      id: "lists",
      title: "Списки (lists)",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Список — это упорядоченная коллекция элементов. Элементы могут быть любого типа, в том числе разных.",
        },
        {
          type: "code",
          language: "python",
          content: `# Создание
numbers = [1, 2, 3, 4, 5]
mixed = ["text", 42, 3.14, True]
empty = []

# Доступ по индексу (с нуля)
print(numbers[0])    # 1
print(numbers[-1])   # 5 (последний)

# Длина
print(len(numbers))  # 5

# Добавление
numbers.append(6)    # [1, 2, 3, 4, 5, 6]

# Удаление по индексу
numbers.pop(0)       # удалит 1

# Срезы — самая мощная фича
print(numbers[1:3])  # [3, 4]
print(numbers[:2])   # [2, 3] первые 2
print(numbers[-2:])  # последние 2
print(numbers[::-1]) # развернуть`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Перебор списка",
          content:
            "Не нужно `for i in range(len(numbers))` — пиши `for num in numbers`. Это питонично.",
        },
        {
          type: "code",
          language: "python",
          content: `fruits = ["apple", "banana", "cherry"]

# Хорошо ✅
for fruit in fruits:
    print(fruit.upper())

# Если нужен индекс — enumerate
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")`,
        },
      ],
    },
    {
      id: "dicts",
      title: "Словари (dicts) — главная структура в AI",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Словарь — это пары `ключ: значение`. **JSON, который возвращает Claude API, парсится в словари Python.** Это абсолютно ключевая структура.",
        },
        {
          type: "code",
          language: "python",
          content: `# Создание
person = {
    "name": "Анна",
    "age": 28,
    "skills": ["Python", "ML", "FastAPI"]
}

# Доступ
print(person["name"])           # Анна
print(person.get("email"))      # None (нет ошибки, если ключа нет)
print(person.get("email", "—")) # —

# Добавление / обновление
person["email"] = "anna@example.com"
person["age"] = 29

# Удаление
del person["skills"]

# Перебор
for key in person:
    print(key, person[key])

# Или сразу пары
for key, value in person.items():
    print(f"{key}: {value}")

# Только ключи / только значения
print(person.keys())
print(person.values())`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "Разница `[]` и `.get()`",
          content:
            "`person['xxx']` — если ключа нет, упадёт с `KeyError`. `person.get('xxx')` — вернёт `None`. Используй `.get()`, когда не уверен, что ключ есть.",
        },
      ],
    },
    {
      id: "functions",
      title: "Функции",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Функция — это переиспользуемый блок кода. Один из главных приёмов борьбы со сложностью.",
        },
        {
          type: "code",
          language: "python",
          content: `def greet(name):
    return f"Привет, {name}!"

print(greet("Иван"))

# Несколько параметров
def calculate_price(quantity, price, discount=0):
    """Считает итоговую цену с учётом скидки."""
    return quantity * price * (1 - discount)

# Можно вызывать позиционно
print(calculate_price(3, 100))                   # 300
print(calculate_price(3, 100, 0.1))              # 270

# Или по имени — читабельнее
print(calculate_price(quantity=3, price=100, discount=0.1))`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Type hints — пиши их сразу",
          content:
            "Современный Python — с типами. Это помогает IDE, читателю и тебе самому через 3 месяца.",
        },
        {
          type: "code",
          language: "python",
          content: `def calculate_price(quantity: int, price: float, discount: float = 0) -> float:
    """Считает итоговую цену с учётом скидки."""
    return quantity * price * (1 - discount)`,
        },
      ],
    },
    {
      id: "files",
      title: "Чтение и запись файлов",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Всегда используй `with open(...) as f:` — это автоматически закрывает файл, даже если случилась ошибка.",
        },
        {
          type: "code",
          language: "python",
          content: `# Запись
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("Первая строка\\n")
    f.write("Вторая строка\\n")

# Чтение целиком
with open("notes.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# Чтение по строкам
with open("notes.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())  # strip() убирает \\n и пробелы

# Добавление в конец ("a" = append)
with open("notes.txt", "a", encoding="utf-8") as f:
    f.write("Третья строка\\n")`,
        },
        {
          type: "callout",
          variant: "danger",
          title: "Кодировка",
          content:
            "Всегда указывай `encoding=\"utf-8\"`. На Windows по умолчанию cp1251 — это сломает русский текст.",
        },
      ],
    },
    {
      id: "json",
      title: "JSON — формат, на котором живёт интернет",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "JSON — это текстовый формат, очень похожий на словари Python. **API Claude/OpenAI отдают тебе JSON.** Поэтому знать как с ним работать — критично.",
        },
        {
          type: "code",
          language: "python",
          content: `import json

# Словарь → JSON-строка
person = {"name": "Анна", "age": 28, "skills": ["Python", "ML"]}
json_str = json.dumps(person, ensure_ascii=False, indent=2)
print(json_str)
# {
#   "name": "Анна",
#   "age": 28,
#   "skills": ["Python", "ML"]
# }

# JSON-строка → словарь
parsed = json.loads(json_str)
print(parsed["name"])

# Запись JSON в файл
with open("person.json", "w", encoding="utf-8") as f:
    json.dump(person, f, ensure_ascii=False, indent=2)

# Чтение из файла
with open("person.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Запомни 4 функции",
          content:
            "`json.dumps()` — словарь в строку.\n`json.loads()` — строка в словарь.\n`json.dump()` — словарь в файл.\n`json.load()` — файл в словарь.\n\nС `s` на конце — работа со строками, без — с файлами.",
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
              title: "Real Python: списки",
              url: "https://realpython.com/python-lists-tuples/",
              description: "Глубокий разбор на английском.",
            },
            {
              title: "Python Tutor — визуализатор",
              url: "https://pythontutor.com/",
              description: "Запусти свой код и посмотри пошагово, как меняется состояние.",
            },
            {
              title: "Python type hints — официальные доки",
              url: "https://docs.python.org/3/library/typing.html",
              description: "Когда захочешь типизации глубже.",
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
          emoji: "0️⃣",
          title: "Почему индексы с нуля",
          content:
            "Списки начинаются с **0**, а не с 1. Это историческое: в C индекс — это смещение от начала массива в памяти, и у первого элемента смещение 0. Эдгар Дейкстра в 1982 написал [знаменитую заметку](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD831.html) с аргументами почему «0-based» лучше. С тех пор «off-by-one error» — главный мем разработчиков.",
        },
        {
          type: "funfact",
          emoji: "🧩",
          title: "Hash table спасли мир",
          content:
            "Словари Python (dict) — это **hash tables**. Их изобрёл Hans Peter Luhn в IBM **в 1953 году**. Без них не было бы баз данных, кэшей, JSON-парсеров, маршрутизаторов. Когда ты пишешь `data[\"key\"]`, ты пользуешься алгоритмом 70-летней давности — и быстрее этого человечество пока не придумало.",
        },
        {
          type: "funfact",
          emoji: "😱",
          title: "Самый дорогой баг в истории",
          content:
            "В 1996 году ракета **Ariane 5** взорвалась через 37 секунд после старта. Причина — `int overflow`: переменная с типом 16-bit signed integer не вместила значение из 64-bit float. Убытки: **$370 миллионов**. С тех пор type safety и проверки переполнения стали серьёзной темой. Питоновский `int` неограниченной разрядности — реакция в том числе на такие истории.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Что выведет `print([1, 2, 3, 4, 5][1:4])`?",
      options: [
        { id: "a", text: "[1, 2, 3, 4]" },
        { id: "b", text: "[2, 3, 4]" },
        { id: "c", text: "[2, 3, 4, 5]" },
        { id: "d", text: "[1, 2, 3]" },
      ],
      correctOptionId: "b",
      explanation:
        "Срез `[start:stop]` берёт элементы начиная с индекса `start` (включая) до `stop` (НЕ включая). Индексы с нуля: позиции 1, 2, 3 — это 2, 3, 4.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Дан словарь `d = {'name': 'Anna'}`. Что произойдёт при `d['email']`?",
      options: [
        { id: "a", text: "Вернёт None" },
        { id: "b", text: "Вернёт пустую строку" },
        { id: "c", text: "Упадёт с ошибкой KeyError" },
        { id: "d", text: "Создаст ключ 'email' со значением None" },
      ],
      correctOptionId: "c",
      explanation:
        "Обращение по ключу через `[]` к отсутствующему ключу выбросит `KeyError`. Безопасный вариант: `d.get('email')` — вернёт `None`.",
      hint: "Подумай: что лучше — резко упасть или вернуть пустоту?",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Какие способы перебора списка `fruits` питоничны? (несколько)",
      options: [
        { id: "a", text: "for fruit in fruits: ..." },
        { id: "b", text: "for i in range(len(fruits)): print(fruits[i])" },
        { id: "c", text: "for i, fruit in enumerate(fruits): ..." },
        { id: "d", text: "i = 0; while i < len(fruits): ..." },
      ],
      correctOptionIds: ["a", "c"],
      explanation:
        "Прямой `for x in list` — это идиома Python. `enumerate` — когда нужен индекс. `range(len(...))` и `while` — стиль из C/Java, в Python избегается.",
    },
    {
      id: "q4",
      type: "text-input",
      question:
        "Какую функцию модуля `json` ты используешь, чтобы превратить строку JSON в Python-словарь?\n\nВведи только название функции (без `json.` и без скобок).",
      correctAnswers: ["loads"],
      caseSensitive: true,
      explanation:
        "`json.loads(s)` — **loa**d **s**tring. Загружает (loads) из строки в Python-объект. `json.dumps()` — наоборот, словарь в строку. Без `s` — работа с файлами.",
    },
    {
      id: "q5",
      type: "single-choice",
      question:
        "Что выведет код?\n\n```python\ndef calc(a, b=10, c=2):\n    return a * b - c\n\nprint(calc(5, c=3))\n```",
      options: [
        { id: "a", text: "47" },
        { id: "b", text: "12" },
        { id: "c", text: "13" },
        { id: "d", text: "Ошибка" },
      ],
      correctOptionId: "a",
      explanation:
        "Вызываем `calc(5, c=3)`. Позиционно: `a=5`. `b` не указан — берётся default `10`. `c=3` по имени. Результат: `5 * 10 - 3 = 47`.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Почему стоит писать `with open(...) as f:` вместо `f = open(...)`?",
      options: [
        { id: "a", text: "with-блок автоматически закрывает файл" },
        { id: "b", text: "Это работает быстрее" },
        { id: "c", text: "Без with файл нельзя записать" },
        { id: "d", text: "with позволяет читать сразу несколько файлов" },
      ],
      correctOptionId: "a",
      explanation:
        "`with` — это context manager. Он гарантирует, что `f.close()` будет вызван, даже если в блоке случилась ошибка. Это правильный современный стиль.",
    },
    {
      id: "q7",
      type: "text-input",
      question:
        "Дополни type hint: функция принимает строку, возвращает число с плавающей точкой.\n\n`def parse(text: str) -> ???:`\n\nЧто вместо `???`?",
      correctAnswers: ["float"],
      caseSensitive: true,
      explanation:
        "Стрелка `->` указывает тип возвращаемого значения. Для дробных чисел — `float`. Для целых — `int`, для строки — `str`, для словаря — `dict`.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Подсчёт слов в тексте",
      description:
        "Напиши функцию `count_words(text)`, которая принимает строку и возвращает словарь `{слово: количество_вхождений}`.\n\n**Пример:**\n```python\ncount_words(\"кот и пёс и кот\")\n# {'кот': 2, 'и': 2, 'пёс': 1}\n```",
      starterCode: `def count_words(text: str) -> dict:
    # Разбей строку на слова (text.split())
    # Пройдись по словам и накапливай в словаре
    counts = {}
    # Допиши здесь
    return counts


# Тест
result = count_words("кот и пёс и кот")
print(result)
`,
      solutionCode: `def count_words(text: str) -> dict:
    counts = {}
    for word in text.split():
        counts[word] = counts.get(word, 0) + 1
    return counts


result = count_words("кот и пёс и кот")
print(result)`,
      language: "python",
      runnable: true,
      hints: [
        "`text.split()` без аргументов разделяет по пробелам.",
        "Используй `counts.get(word, 0) + 1` — если слова ещё нет, get вернёт 0.",
      ],
    },
    {
      id: "p2",
      title: "Самые длинные слова",
      description:
        "Напиши функцию `longest_words(text, n)`, которая возвращает `n` самых длинных уникальных слов из текста.\n\n**Пример:**\n```python\nlongest_words(\"я люблю программирование на питоне\", 2)\n# ['программирование', 'питоне']\n```",
      starterCode: `def longest_words(text: str, n: int) -> list:
    # Шаги:
    # 1. Разбить на слова
    # 2. Убрать дубликаты (set)
    # 3. Отсортировать по длине, по убыванию
    # 4. Взять первые n
    pass


print(longest_words("я люблю программирование на питоне", 2))
`,
      solutionCode: `def longest_words(text: str, n: int) -> list:
    unique = set(text.split())
    sorted_words = sorted(unique, key=len, reverse=True)
    return sorted_words[:n]


print(longest_words("я люблю программирование на питоне", 2))`,
      language: "python",
      runnable: true,
      hints: [
        "`set(text.split())` уберёт дубликаты.",
        "`sorted(items, key=len, reverse=True)` — отсортирует по длине от большего к меньшему.",
        "Срез `[:n]` берёт первые n элементов.",
      ],
    },
    {
      id: "p3",
      title: "JSON: запись и чтение",
      description:
        "Сохрани словарь в JSON-файл, потом прочитай обратно и проверь, что данные совпадают.\n\nДолжна выйти такая последовательность:\n1. Записать `data` в `data.json`\n2. Прочитать обратно в `loaded`\n3. Вывести `loaded == data` (должно быть True)",
      starterCode: `import json

data = {
    "user": "Иван",
    "age": 30,
    "languages": ["Python", "JavaScript", "Go"]
}

# 1. Запиши data в data.json (с ensure_ascii=False, indent=2)

# 2. Прочитай обратно в loaded

# 3. Сравни и выведи результат
`,
      solutionCode: `import json

data = {
    "user": "Иван",
    "age": 30,
    "languages": ["Python", "JavaScript", "Go"]
}

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

print("Совпадает:", loaded == data)
print(loaded)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "Валидация email",
      description:
        "Напиши функцию `is_valid_email(email)` — возвращает True, если строка похожа на email.\n\n**Правила (упрощённые):**\n- Не пустая\n- Содержит ровно один `@`\n- После `@` есть точка\n- До `@` минимум 1 символ, между `@` и `.` минимум 1 символ, после `.` минимум 2 символа\n\n**Примеры:**\n- `user@example.com` → True\n- `bad@.com` → False\n- `noatsign.com` → False",
      starterCode: `def is_valid_email(email: str) -> bool:
    if not email:
        return False
    if email.count("@") != 1:
        return False

    # Разделим на части
    local, domain = email.split("@")

    # Допиши проверки
    pass


# Тесты
print(is_valid_email("user@example.com"))    # True
print(is_valid_email("bad@.com"))             # False
print(is_valid_email("noatsign.com"))         # False
print(is_valid_email("@nolocal.com"))         # False
print(is_valid_email(""))                     # False
`,
      solutionCode: `def is_valid_email(email: str) -> bool:
    if not email:
        return False
    if email.count("@") != 1:
        return False

    local, domain = email.split("@")
    if len(local) < 1:
        return False
    if "." not in domain:
        return False

    name, _, tld = domain.rpartition(".")
    if len(name) < 1 or len(tld) < 2:
        return False

    return True


print(is_valid_email("user@example.com"))
print(is_valid_email("bad@.com"))
print(is_valid_email("noatsign.com"))
print(is_valid_email("@nolocal.com"))
print(is_valid_email(""))`,
      language: "python",
      runnable: true,
      hints: [
        "`email.split('@')` вернёт список из двух частей — до и после '@'.",
        "Используй `domain.rpartition('.')` — разделит по последней точке.",
      ],
    },
    {
      id: "p5",
      title: "Простая записная книжка",
      description:
        "Напиши функцию `add_contact(contacts, name, phone)`, которая добавляет контакт в словарь `contacts` (имя → телефон) и возвращает обновлённый словарь.\n\nИ функцию `find_contact(contacts, name)` — возвращает телефон или `'Не найден'`.",
      starterCode: `def add_contact(contacts: dict, name: str, phone: str) -> dict:
    # Допиши
    pass


def find_contact(contacts: dict, name: str) -> str:
    # Допиши
    pass


# Тест
book = {}
book = add_contact(book, "Анна", "+7-900-111-22-33")
book = add_contact(book, "Иван", "+7-900-444-55-66")

print(find_contact(book, "Анна"))     # +7-900-111-22-33
print(find_contact(book, "Мария"))    # Не найден
`,
      solutionCode: `def add_contact(contacts: dict, name: str, phone: str) -> dict:
    contacts[name] = phone
    return contacts


def find_contact(contacts: dict, name: str) -> str:
    return contacts.get(name, "Не найден")


book = {}
book = add_contact(book, "Анна", "+7-900-111-22-33")
book = add_contact(book, "Иван", "+7-900-444-55-66")

print(find_contact(book, "Анна"))
print(find_contact(book, "Мария"))`,
      language: "python",
      runnable: true,
    },
  ],
  checkpoint: [
    "Папка `week-02/` с 5 задачами",
    "Push на GitHub с осмысленным commit-сообщением (`Week 2: lists, dicts, functions`)",
    "В `README.md` появилась секция 'Что изучено' с галочками",
    "Можешь объяснить разницу между списком и словарём за 30 секунд",
  ],
};
