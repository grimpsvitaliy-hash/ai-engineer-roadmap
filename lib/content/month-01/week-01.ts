import type { Lesson } from "../types";

export const week01: Lesson = {
  id: "m1-w1",
  monthId: "month-01",
  weekNumber: 1,
  title: "Синтаксис, переменные, условия, циклы",
  goal: "К концу недели ты умеешь написать программу, которая считает что-то полезное: например, факториал, FizzBuzz или конвертер температур.",
  estimatedHours: "7-8 ч",
  theory: [
    {
      id: "intro",
      title: "Что такое Python и зачем он нужен",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Python** — язык программирования общего назначения. В мире AI он де-факто стандарт: все библиотеки (Anthropic SDK, OpenAI SDK, LangChain, PyTorch, TensorFlow) пишутся под Python в первую очередь.",
        },
        {
          type: "text",
          content:
            "Почему Python победил в AI:\n\n- Простой синтаксис — близкий к английскому\n- Гигантская экосистема библиотек\n- Хорошо стыкуется с C/C++ для скорости (numpy, torch написаны на C под капотом)\n- Удобен для исследований (Jupyter notebooks)",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Для AI инженера",
          content:
            "Тебе **не нужно** быть Python-гуру. Нужно уверенное знание основ: переменные, циклы, функции, классы, словари, работа с библиотеками. Этого хватает для 90% задач.",
        },
      ],
    },
    {
      id: "variables-types",
      title: "Переменные и типы данных",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Переменная — это имя для значения. В Python ты не указываешь тип переменной заранее — он определяется автоматически.",
        },
        {
          type: "code",
          language: "python",
          content: `# Целое число (int)
age = 25

# Дробное число (float)
height = 1.75

# Строка (str)
name = "Анна"

# Логический тип (bool)
is_student = True

# Проверим тип
print(type(age))     # <class 'int'>
print(type(name))    # <class 'str'>`,
        },
        {
          type: "text",
          content:
            "**Арифметические операторы:**\n\n- `+` сложение\n- `-` вычитание\n- `*` умножение\n- `/` деление (всегда float: `10 / 3 = 3.333`)\n- `//` целочисленное деление (`10 // 3 = 3`)\n- `%` остаток от деления (`10 % 3 = 1`)\n- `**` возведение в степень (`2 ** 10 = 1024`)",
        },
        {
          type: "code",
          language: "python",
          content: `price = 1500
discount = 0.15
final_price = price * (1 - discount)
print(final_price)  # 1275.0`,
        },
      ],
    },
    {
      id: "strings",
      title: "Строки и f-строки",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Строки можно склеивать, повторять, нарезать. Главный современный способ собирать строки — **f-строки** (форматные строки).",
        },
        {
          type: "code",
          language: "python",
          content: `name = "Иван"
age = 30

# Старый способ (избегай)
msg = "Привет, " + name + "! Тебе " + str(age) + " лет."

# Современный — f-строка
msg = f"Привет, {name}! Тебе {age} лет."
print(msg)

# Внутри {} можно писать выражения
print(f"Через 5 лет тебе будет {age + 5}.")

# Форматирование чисел
pi = 3.14159265
print(f"Pi ≈ {pi:.2f}")  # Pi ≈ 3.14`,
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "Всегда используй f-строки. Конкатенация через `+` — это код из 2010 года.",
        },
      ],
    },
    {
      id: "if-else",
      title: "Условные операторы: if / elif / else",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "В Python блоки кода выделяются **отступами** (обычно 4 пробела), а не фигурными скобками. После `if`, `for`, `while`, `def` — всегда двоеточие.",
        },
        {
          type: "code",
          language: "python",
          content: `temperature = 18

if temperature > 25:
    print("Жарко")
elif temperature > 15:
    print("Тепло")
elif temperature > 5:
    print("Прохладно")
else:
    print("Холодно")`,
        },
        {
          type: "text",
          content:
            "**Операторы сравнения**: `==`, `!=`, `<`, `>`, `<=`, `>=`\n\n**Логические операторы**: `and`, `or`, `not`",
        },
        {
          type: "code",
          language: "python",
          content: `age = 22
has_passport = True

if age >= 18 and has_passport:
    print("Можно лететь за границу")

# Проверка на вхождение в диапазон — питонично:
if 18 <= age <= 30:
    print("Молодой взрослый")`,
        },
      ],
    },
    {
      id: "loops",
      title: "Циклы: for и while",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "**`for`** — для перебора готовой последовательности (списка, диапазона чисел, символов строки).\n\n**`while`** — пока условие истинно.",
        },
        {
          type: "code",
          language: "python",
          content: `# for через range()
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop, step)
for i in range(2, 11, 2):
    print(i)  # 2, 4, 6, 8, 10

# Перебор символов строки
for ch in "AI":
    print(ch)  # A, I

# while
count = 0
while count < 3:
    print(f"Попытка {count + 1}")
    count += 1`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "break и continue",
          content:
            "`break` — выйти из цикла. `continue` — пропустить текущую итерацию и пойти на следующую.",
        },
        {
          type: "code",
          language: "python",
          content: `for i in range(10):
    if i == 5:
        break       # выходим из цикла
    if i % 2 == 0:
        continue    # пропускаем чётные
    print(i)        # выведет 1, 3`,
        },
      ],
    },
    {
      id: "input-output",
      title: "Ввод и вывод",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "code",
          language: "python",
          content: `# Вывод
print("Привет, мир!")
print("a", "b", "c", sep="-")  # a-b-c

# Ввод (всегда возвращает строку!)
name = input("Как тебя зовут? ")
print(f"Привет, {name}!")

# Если нужно число — конвертируй
age_str = input("Возраст: ")
age = int(age_str)
print(f"Через год тебе будет {age + 1}")`,
        },
        {
          type: "callout",
          variant: "warning",
          title: "input() всегда строка",
          content:
            "Даже если пользователь ввёл `42`, ты получишь строку `'42'`. Чтобы получить число — оберни в `int()` или `float()`.",
        },
      ],
    },
    {
      id: "resources",
      title: "Что почитать и посмотреть",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "resources",
          items: [
            {
              title: "Stepik: Поколение Python для начинающих",
              url: "https://stepik.org/course/58852/",
              description: "Лучший русскоязычный бесплатный курс. Пройди первые 5 модулей.",
            },
            {
              title: "learnpython.org",
              url: "https://www.learnpython.org/",
              description: "Интерактивные уроки в браузере, на английском.",
            },
            {
              title: "Python Tutor — визуализатор выполнения кода",
              url: "https://pythontutor.com/",
              description: "Видишь шаг за шагом, как меняются переменные. Идеально для понимания.",
            },
            {
              title: "Python для начинающих — Sentdex (YouTube)",
              url: "https://www.youtube.com/watch?v=eXBD2bB9-RA&list=PLQVvvaa0QuDeAams7fkdcwOGBpGdHpXln",
              description: "Англоязычный видеокурс с нуля.",
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
      question: "Что выведет `print(10 // 3)`?",
      options: [
        { id: "a", text: "3.333" },
        { id: "b", text: "3" },
        { id: "c", text: "1" },
        { id: "d", text: "Ошибка" },
      ],
      correctOptionId: "b",
      explanation:
        "`//` — это целочисленное деление, отбрасывает дробную часть. `10 / 3` дал бы `3.333`, а `10 % 3` — остаток `1`.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Какой тип у переменной `x = input('число: ')`, даже если пользователь ввёл `42`?",
      options: [
        { id: "a", text: "int" },
        { id: "b", text: "float" },
        { id: "c", text: "str" },
        { id: "d", text: "bool" },
      ],
      correctOptionId: "c",
      explanation:
        "`input()` **всегда** возвращает строку (`str`). Чтобы получить число — оберни в `int(x)` или `float(x)`.",
      hint: "Подумай: input — это всегда текст, который ввёл пользователь.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Какие из этих утверждений про Python верны? (несколько вариантов)",
      options: [
        { id: "a", text: "Блоки кода выделяются отступами, а не скобками" },
        { id: "b", text: "Тип переменной нужно указывать заранее" },
        { id: "c", text: "f-строки — современный способ собирать строки" },
        { id: "d", text: "После if обязательно ставится двоеточие" },
      ],
      correctOptionIds: ["a", "c", "d"],
      explanation:
        "В Python типы определяются автоматически (так называемая dynamic typing), указывать заранее не нужно. Остальные три утверждения верны.",
    },
    {
      id: "q4",
      type: "text-input",
      question: "Какой оператор используется для возведения в степень в Python? (введи только сам оператор, например: `+`)",
      correctAnswers: ["**", "** "],
      explanation: "`2 ** 10 = 1024`. Это два символа умножения подряд.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Что выведет этот код?\n\n```python\nfor i in range(3, 8, 2):\n    print(i, end=' ')\n```",
      options: [
        { id: "a", text: "3 4 5 6 7" },
        { id: "b", text: "3 5 7" },
        { id: "c", text: "3 5 7 9" },
        { id: "d", text: "2 4 6" },
      ],
      correctOptionId: "b",
      explanation:
        "`range(3, 8, 2)` — старт 3, стоп 8 (не включая), шаг 2. Получаем: 3, 5, 7.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Что произойдёт при выполнении этого кода?\n\n```python\nage = 17\nif 18 <= age <= 30:\n    print('взрослый')\nelse:\n    print('не подходит')\n```",
      options: [
        { id: "a", text: "Выведет 'взрослый'" },
        { id: "b", text: "Выведет 'не подходит'" },
        { id: "c", text: "Синтаксическая ошибка — нельзя писать два сравнения подряд" },
        { id: "d", text: "Ничего не выведет" },
      ],
      correctOptionId: "b",
      explanation:
        "В Python можно писать цепочки сравнений: `18 <= age <= 30` равносильно `18 <= age and age <= 30`. Поскольку 17 < 18, условие ложно — идём в else.",
    },
    {
      id: "q7",
      type: "text-input",
      question:
        "Допиши f-строку, чтобы вывести число pi с двумя знаками после запятой:\n\n`f\"Pi ≈ {pi:???}\"` — что вместо `???`?",
      correctAnswers: [".2f"],
      caseSensitive: true,
      explanation:
        "Спецификатор `.2f` означает: дробное число с 2 знаками после точки. Если бы хотели 4 знака — `.4f`.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Калькулятор двух чисел",
      description:
        "Программа должна попросить ввести два числа и вывести их сумму, разность, произведение и частное.\n\n**Ожидаемый вывод:**\n```\nЧисло 1: 10\nЧисло 2: 3\nСумма: 13\nРазность: 7\nПроизведение: 30\nЧастное: 3.3333333333333335\n```",
      starterCode: `# Подсказка: используй input() и не забудь конвертировать в int или float

a = float(input("Число 1: "))
b = float(input("Число 2: "))

# Допиши здесь
`,
      solutionCode: `a = float(input("Число 1: "))
b = float(input("Число 2: "))

print(f"Сумма: {a + b}")
print(f"Разность: {a - b}")
print(f"Произведение: {a * b}")
print(f"Частное: {a / b}")`,
      language: "python",
      runnable: true,
      hints: [
        "input() возвращает строку — конвертируй в float() или int().",
        "Используй f-строки для красивого вывода: f\"Сумма: {a + b}\".",
      ],
    },
    {
      id: "p2",
      title: "Категория возраста",
      description:
        "Программа спрашивает возраст и выводит категорию:\n\n- < 12 → `Ребёнок`\n- 12-17 → `Подросток`\n- 18-64 → `Взрослый`\n- 65+ → `Пожилой`",
      starterCode: `age = int(input("Возраст: "))

# Используй if / elif / else
`,
      solutionCode: `age = int(input("Возраст: "))

if age < 12:
    print("Ребёнок")
elif age < 18:
    print("Подросток")
elif age < 65:
    print("Взрослый")
else:
    print("Пожилой")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "FizzBuzz — классическая задача",
      description:
        "Выведи числа от 1 до 30. Но:\n\n- Если число делится на 3 — выведи `Fizz` вместо числа\n- Если на 5 — `Buzz`\n- Если и на 3, и на 5 — `FizzBuzz`\n\n**Зачем:** это **легендарная** задача с собеседований. Если ты её можешь — ты программист.\n\n**Ожидаемый вывод:**\n```\n1\n2\nFizz\n4\nBuzz\nFizz\n7\n...\n```",
      starterCode: `for i in range(1, 31):
    # Допиши здесь
    pass
`,
      solutionCode: `for i in range(1, 31):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
      language: "python",
      runnable: true,
      hints: [
        "Сначала проверяй самый специфичный случай — деление и на 3, и на 5. Иначе число 15 попадёт в первую же ветку про 3.",
        "Деление и на 3, и на 5 — это деление на 15. Используй `i % 15 == 0`.",
      ],
    },
    {
      id: "p4",
      title: "Сумма от 1 до N",
      description:
        "Программа просит число N и выводит сумму всех чисел от 1 до N (включительно).\n\n**Пример:** N = 5 → сумма = 1+2+3+4+5 = 15",
      starterCode: `n = int(input("N = "))

total = 0
# Используй for и range
`,
      solutionCode: `n = int(input("N = "))

total = 0
for i in range(1, n + 1):
    total += i

print(f"Сумма: {total}")`,
      language: "python",
      runnable: true,
      hints: [
        "range(1, n+1) даст числа от 1 до n включительно.",
        "Накапливай сумму в переменной total через `total += i`.",
      ],
    },
    {
      id: "p5",
      title: "Угадай пароль",
      description:
        "Программа в цикле просит ввести пароль. Если ввели `secret123` — выводит `Доступ разрешён` и завершается. Иначе — `Неверно, попробуй ещё раз`.",
      starterCode: `# Используй while True и break

while True:
    password = input("Пароль: ")
    # Допиши проверку
`,
      solutionCode: `while True:
    password = input("Пароль: ")
    if password == "secret123":
        print("Доступ разрешён")
        break
    else:
        print("Неверно, попробуй ещё раз")`,
      language: "python",
      runnable: true,
      hints: [
        "Бесконечный цикл — `while True`. Выход — через `break` при правильном пароле.",
      ],
    },
  ],
  checkpoint: [
    "Создан репозиторий `python-learning` на GitHub",
    "В нём папка `week-01/` с пятью файлами задач",
    "Есть `README.md` с описанием 'Я учусь Python, неделя 1'",
    "Сделан первый push на GitHub",
    "Можешь объяснить разницу между `=` и `==`",
  ],
};
