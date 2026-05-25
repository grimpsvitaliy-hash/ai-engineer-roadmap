import type { Lesson } from "../types";

export const week03: Lesson = {
  id: "m1-w3",
  monthId: "month-01",
  weekNumber: 3,
  title: "ООП, исключения, virtual environments, pip",
  goal: "Можешь объявить класс с методами, обрабатываешь ошибки через try/except, понимаешь зачем нужны виртуальные окружения, ставишь пакеты через pip.",
  estimatedHours: "7-8 ч",
  theory: [
    {
      id: "oop-basics",
      title: "Классы и объекты — основы ООП",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Класс — это шаблон. Объект — экземпляр класса. Класс описывает, какие у объекта будут поля (атрибуты) и что он умеет делать (методы).",
        },
        {
          type: "code",
          language: "python",
          content: `class Person:
    def __init__(self, name: str, age: int):
        # __init__ — конструктор, вызывается при создании объекта
        # self — это сам объект, ссылка на текущий экземпляр
        self.name = name
        self.age = age

    def greet(self) -> str:
        return f"Привет, я {self.name}, мне {self.age}."

    def have_birthday(self) -> None:
        self.age += 1


# Создаём объект
ivan = Person("Иван", 30)
print(ivan.greet())   # Привет, я Иван, мне 30.

ivan.have_birthday()
print(ivan.age)       # 31

anna = Person("Анна", 25)
print(anna.greet())   # независимый объект`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Зачем `self`",
          content:
            "`self` — это ссылка на конкретный объект. Через `self.name` ты обращаешься к полю **этого** объекта. У ivan свой `self.name = 'Иван'`, у anna свой.",
        },
      ],
    },
    {
      id: "oop-in-llm",
      title: "Зачем ООП в LLM-разработке",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Anthropic SDK устроен через классы. Когда ты пишешь:",
        },
        {
          type: "code",
          language: "python",
          content: `from anthropic import Anthropic

client = Anthropic()  # создаёшь объект класса Anthropic

message = client.messages.create(  # вызываешь метод create
    model="claude-haiku-4-5-20251001",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hi"}]
)

print(message.content[0].text)  # обращаешься к полям ответа`,
        },
        {
          type: "text",
          content:
            "Здесь:\n- `Anthropic` — это класс\n- `client` — объект (экземпляр) этого класса\n- `messages` — это атрибут объекта (тоже объект, вложенный)\n- `create()` — метод\n- `message` — объект-ответ, у которого есть поля `content`, `usage`, `model` и т.д.\n\nЕсли ты не понимаешь ООП — ты не понимаешь, **что вообще происходит** при работе с любой современной библиотекой.",
        },
      ],
    },
    {
      id: "exceptions",
      title: "Исключения: try / except",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Исключение — это ошибка во время выполнения. Если её не поймать, программа упадёт. `try / except` позволяет перехватить и обработать.",
        },
        {
          type: "code",
          language: "python",
          content: `# Без обработки — упадёт
# value = int("abc")  # ValueError

try:
    value = int(input("Число: "))
    result = 100 / value
    print(f"Результат: {result}")
except ValueError:
    print("Это не число!")
except ZeroDivisionError:
    print("На ноль делить нельзя!")
except Exception as e:
    print(f"Неожиданная ошибка: {e}")
finally:
    print("Эта строка выполнится всегда")`,
        },
        {
          type: "callout",
          variant: "danger",
          title: "Не делай так",
          content:
            "**Никогда** не пиши `except:` или `except Exception: pass` — это глушит все ошибки, включая опечатки. Программа будет молча работать неправильно. Лови **конкретные** типы исключений.",
        },
        {
          type: "text",
          content:
            "**Свои исключения** через `raise`:",
        },
        {
          type: "code",
          language: "python",
          content: `def withdraw(balance: float, amount: float) -> float:
    if amount < 0:
        raise ValueError("Сумма должна быть положительной")
    if amount > balance:
        raise ValueError(f"Недостаточно средств: {balance} < {amount}")
    return balance - amount


try:
    new_balance = withdraw(100, 200)
except ValueError as e:
    print(f"Ошибка: {e}")`,
        },
      ],
    },
    {
      id: "venv",
      title: "Virtual environments — священная корова Python",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Каждый Python-проект должен иметь **своё** виртуальное окружение (venv). Это изолированная папка с зависимостями.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Почему это важно",
          content:
            "Проект A требует `anthropic==0.40.0`, а проект B — `anthropic==0.45.0`. Если ставить глобально — конфликт. С venv — каждый изолирован.",
        },
        {
          type: "text",
          content:
            "**Команды (запомни наизусть, будешь использовать каждый день):**",
        },
        {
          type: "code",
          language: "bash",
          content: `# Создать виртуальное окружение в папке venv
python -m venv venv

# Активировать (Windows PowerShell)
venv\\Scripts\\Activate.ps1

# Активировать (Windows cmd)
venv\\Scripts\\activate.bat

# Активировать (Mac/Linux)
source venv/bin/activate

# В терминале должно появиться (venv) — значит активировано

# Установить пакет
pip install requests

# Установить конкретную версию
pip install anthropic==0.45.0

# Сохранить список зависимостей в файл
pip freeze > requirements.txt

# Установить всё из requirements.txt (на новой машине)
pip install -r requirements.txt

# Выйти из окружения
deactivate`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Правило",
          content:
            "Каждый новый проект — `python -m venv venv` сразу в первый день. Папку `venv/` — добавь в `.gitignore` (никогда не коммитим). Зато `requirements.txt` — обязательно в git.",
        },
      ],
    },
    {
      id: "pip-packages",
      title: "pip — менеджер пакетов",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "pip — это то, через что ты ставишь любую библиотеку Python. Все библиотеки лежат на сайте https://pypi.org/.",
        },
        {
          type: "code",
          language: "bash",
          content: `# Найти все установленные пакеты
pip list

# Информация о пакете
pip show anthropic

# Обновить пакет
pip install --upgrade anthropic

# Удалить пакет
pip uninstall anthropic`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Альтернатива — uv",
          content:
            "В 2025 появился `uv` — современная замена pip от Astral. Быстрее в 10-100 раз. Когда освоишься с pip — можешь попробовать `uv` для своих проектов. https://github.com/astral-sh/uv",
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
              title: "Real Python — Classes",
              url: "https://realpython.com/python3-object-oriented-programming/",
              description: "Глубокий разбор ООП на английском.",
            },
            {
              title: "Python venv official docs",
              url: "https://docs.python.org/3/library/venv.html",
              description: "Официальная документация venv.",
            },
            {
              title: "PyPI — каталог пакетов",
              url: "https://pypi.org/",
              description: "Здесь живут все библиотеки Python.",
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
      question: "Что такое `self` в методах класса?",
      options: [
        { id: "a", text: "Ссылка на сам класс (общая для всех объектов)" },
        { id: "b", text: "Ссылка на конкретный объект, у которого вызвали метод" },
        { id: "c", text: "Зарезервированное слово, как `if` или `for`" },
        { id: "d", text: "Имя файла, в котором определён класс" },
      ],
      correctOptionId: "b",
      explanation:
        "`self` — это автоматически передаваемая ссылка на конкретный экземпляр. У каждого объекта свой `self.name`, `self.age` и т.д.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Какой метод вызывается автоматически при создании объекта класса?",
      options: [
        { id: "a", text: "`__create__`" },
        { id: "b", text: "`__new__`" },
        { id: "c", text: "`__init__`" },
        { id: "d", text: "`__start__`" },
      ],
      correctOptionId: "c",
      explanation:
        "`__init__` (читается 'init') — это конструктор. Вызывается при `Person(...)`. Это самый используемый dunder-метод.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Какие из этих утверждений про виртуальные окружения верны? (несколько)",
      options: [
        { id: "a", text: "Каждый проект должен иметь своё venv" },
        { id: "b", text: "Папку venv нужно коммитить в git" },
        { id: "c", text: "requirements.txt нужно коммитить в git" },
        { id: "d", text: "venv позволяет иметь разные версии библиотек в разных проектах" },
      ],
      correctOptionIds: ["a", "c", "d"],
      explanation:
        "venv папку никогда не коммитят — она тяжёлая и зависит от ОС. А `requirements.txt` — наоборот, обязательно. Остальные коллеги по нему восстановят окружение.",
    },
    {
      id: "q4",
      type: "text-input",
      question:
        "Какая команда сохранит все установленные пакеты в файл requirements.txt?\n\n`pip ??? > requirements.txt` — что вместо `???`?",
      correctAnswers: ["freeze"],
      caseSensitive: true,
      explanation:
        "`pip freeze` выводит все установленные пакеты в формате `имя==версия`. Перенаправляем в файл через `>`.",
    },
    {
      id: "q5",
      type: "single-choice",
      question:
        "Что выведет код?\n\n```python\ntry:\n    x = int('abc')\nexcept ValueError:\n    print('A')\nexcept Exception:\n    print('B')\nfinally:\n    print('C')\n```",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B C" },
        { id: "c", text: "A C" },
        { id: "d", text: "C" },
      ],
      correctOptionId: "c",
      explanation:
        "`int('abc')` бросает `ValueError` — поймается первым except, выведет 'A'. `finally` выполнится всегда — выведет 'C'. Второй except не сработает.",
    },
    {
      id: "q6",
      type: "single-choice",
      question: "Почему `except: pass` — антипаттерн?",
      options: [
        { id: "a", text: "Это не работает — синтаксическая ошибка" },
        { id: "b", text: "Перехватывает все ошибки и молча игнорирует — баги станет невозможно найти" },
        { id: "c", text: "Медленно работает" },
        { id: "d", text: "Это устаревший синтаксис Python 2" },
      ],
      correctOptionId: "b",
      explanation:
        "Голый `except:` ловит вообще всё, включая опечатки в именах переменных. `pass` молча проглатывает. Программа продолжит работать неправильно, а ты ничего не заметишь.",
    },
    {
      id: "q7",
      type: "text-input",
      question:
        "Какое ключевое слово используется, чтобы вручную выбросить исключение?\n\nНапример: `??? ValueError('сообщение')`",
      correctAnswers: ["raise"],
      caseSensitive: true,
      explanation:
        "`raise ValueError(...)` поднимает (raise) исключение. Часто используется для валидации входных данных в функциях.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Класс BankAccount",
      description:
        "Реализуй класс `BankAccount`:\n- В конструкторе `__init__` принимает `owner` (имя) и `balance` (начальный баланс)\n- Метод `deposit(amount)` — увеличивает баланс\n- Метод `withdraw(amount)` — уменьшает, но **бросает `ValueError`**, если средств недостаточно\n- Метод `__str__` — возвращает строку вроде `\"Account[owner=Иван, balance=500]\"`",
      starterCode: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        # Допиши
        pass

    def withdraw(self, amount: float) -> None:
        # Допиши с проверкой и raise
        pass

    def __str__(self) -> str:
        # Допиши
        pass


# Тест
acc = BankAccount("Иван", 1000)
acc.deposit(500)
print(acc)              # Account[owner=Иван, balance=1500]

acc.withdraw(200)
print(acc.balance)      # 1300

try:
    acc.withdraw(99999)
except ValueError as e:
    print(f"Ошибка: {e}")
`,
      solutionCode: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        self.balance += amount

    def withdraw(self, amount: float) -> None:
        if amount > self.balance:
            raise ValueError(f"Недостаточно средств: {self.balance} < {amount}")
        self.balance -= amount

    def __str__(self) -> str:
        return f"Account[owner={self.owner}, balance={self.balance}]"


acc = BankAccount("Иван", 1000)
acc.deposit(500)
print(acc)

acc.withdraw(200)
print(acc.balance)

try:
    acc.withdraw(99999)
except ValueError as e:
    print(f"Ошибка: {e}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Класс TodoList с сохранением в JSON",
      description:
        "Реализуй класс `TodoList`:\n- Поле `tasks: list` — список задач (каждая — словарь `{'task': str, 'done': bool}`)\n- `add(task: str)` — добавить новую задачу с `done=False`\n- `complete(index: int)` — отметить задачу как done\n- `show()` — вывести задачи с галочками: `[✓] купить хлеб`",
      starterCode: `class TodoList:
    def __init__(self):
        self.tasks = []

    def add(self, task: str) -> None:
        # Допиши
        pass

    def complete(self, index: int) -> None:
        # Допиши с проверкой границ (raise IndexError если индекс плохой)
        pass

    def show(self) -> None:
        # Выведи все задачи: [✓] или [ ] + текст
        pass


# Тест
todo = TodoList()
todo.add("купить хлеб")
todo.add("позвонить маме")
todo.add("сделать неделю 3")
todo.complete(2)
todo.show()
# [ ] купить хлеб
# [ ] позвонить маме
# [✓] сделать неделю 3
`,
      solutionCode: `class TodoList:
    def __init__(self):
        self.tasks = []

    def add(self, task: str) -> None:
        self.tasks.append({"task": task, "done": False})

    def complete(self, index: int) -> None:
        if not 0 <= index < len(self.tasks):
            raise IndexError(f"Нет задачи с индексом {index}")
        self.tasks[index]["done"] = True

    def show(self) -> None:
        for t in self.tasks:
            mark = "✓" if t["done"] else " "
            print(f"[{mark}] {t['task']}")


todo = TodoList()
todo.add("купить хлеб")
todo.add("позвонить маме")
todo.add("сделать неделю 3")
todo.complete(2)
todo.show()`,
      language: "python",
      runnable: true,
      hints: [
        "Каждая задача — словарь с двумя ключами: 'task' и 'done'.",
        "В `show()` пройдись циклом и выведи метку '✓' или ' ' в зависимости от done.",
      ],
    },
    {
      id: "p3",
      title: "Безопасное деление",
      description:
        "Напиши функцию `safe_divide(a, b)`, которая возвращает результат деления, но обрабатывает:\n\n- Деление на ноль → возвращает `None` и печатает `\"Деление на ноль\"`\n- Нечисловые аргументы → возвращает `None` и печатает `\"Не число: {value}\"`",
      starterCode: `def safe_divide(a, b):
    try:
        # Допиши
        pass
    except ZeroDivisionError:
        print("Деление на ноль")
        return None
    except TypeError:
        # Хороший вопрос: что вывести? Можно "Не число"
        pass


print(safe_divide(10, 2))     # 5.0
print(safe_divide(10, 0))     # Деление на ноль / None
print(safe_divide(10, "x"))   # Не число / None
`,
      solutionCode: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("Деление на ноль")
        return None
    except TypeError as e:
        print(f"Не число: {e}")
        return None


print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "x"))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "Класс Counter — счётчик с историей",
      description:
        "Класс `Counter`:\n- `__init__(start=0)` — стартовое значение\n- `inc(n=1)` — увеличить на n\n- `dec(n=1)` — уменьшить на n\n- Поле `history` — список всех значений после каждой операции\n- `__str__` — `\"Counter(value=5, history=[0, 1, 2, 5])\"`",
      starterCode: `class Counter:
    def __init__(self, start: int = 0):
        self.value = start
        self.history = [start]

    def inc(self, n: int = 1) -> None:
        # Допиши
        pass

    def dec(self, n: int = 1) -> None:
        # Допиши
        pass

    def __str__(self) -> str:
        # Допиши
        pass


c = Counter()
c.inc()
c.inc(5)
c.dec(2)
print(c)   # Counter(value=4, history=[0, 1, 6, 4])
`,
      solutionCode: `class Counter:
    def __init__(self, start: int = 0):
        self.value = start
        self.history = [start]

    def inc(self, n: int = 1) -> None:
        self.value += n
        self.history.append(self.value)

    def dec(self, n: int = 1) -> None:
        self.value -= n
        self.history.append(self.value)

    def __str__(self) -> str:
        return f"Counter(value={self.value}, history={self.history})"


c = Counter()
c.inc()
c.inc(5)
c.dec(2)
print(c)`,
      language: "python",
      runnable: true,
    },
    {
      id: "p5",
      title: "Локальная задача: создать новый репозиторий",
      description:
        "Эту задачу нужно сделать у себя на компьютере (она не запускается в браузере):\n\n1. Создай папку `weather-cli` (она понадобится на следующей неделе)\n2. Зайди в неё в терминале\n3. Создай виртуальное окружение: `python -m venv venv`\n4. Активируй его\n5. Установи `requests`: `pip install requests`\n6. Сохрани зависимости: `pip freeze > requirements.txt`\n7. Создай `.gitignore` с содержимым `venv/` и `.env`\n8. `git init`, добавь файлы, сделай первый коммит и запушь\n\n**Нажми 'Сделано', когда выполнишь все шаги локально.**",
      starterCode: "# Эта задача выполняется в терминале, а не в браузере",
      language: "python",
      runnable: false,
      hints: [
        "Если git ещё не сконфигурирован — `git config --global user.name 'Имя'` и `git config --global user.email 'email'`.",
        "На GitHub создай пустой репозиторий, потом подключи его: `git remote add origin URL` и `git push -u origin main`.",
      ],
    },
  ],
  checkpoint: [
    "Папка `week-03/` с задачами по классам и исключениям",
    "Создан репозиторий `weather-cli` с активированным venv и `requirements.txt`",
    "Понимаешь, что такое класс и что такое объект",
    "Можешь объяснить, зачем нужно виртуальное окружение",
    "Знаешь, чем плох голый `except:`",
  ],
};
