import type { Lesson } from "../types";

export const week04: Lesson = {
  id: "m1-w4",
  monthId: "month-01",
  weekNumber: 4,
  title: "HTTP, JSON, API — первый проект Weather CLI",
  goal: "Делаешь GET-запрос к публичному API, парсишь JSON, красиво выводишь данные. Это уже база для работы с Claude/OpenAI API.",
  estimatedHours: "8 ч",
  theory: [
    {
      id: "http-basics",
      title: "Как устроен HTTP",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "HTTP — это протокол общения между клиентом (твоей программой / браузером) и сервером. Когда ты делаешь запрос к Claude API — это HTTP-запрос.",
        },
        {
          type: "text",
          content:
            "**Структура HTTP-запроса:**\n\n- **Метод**: что делаем (GET — получить, POST — отправить, PUT — обновить, DELETE — удалить)\n- **URL**: куда отправляем\n- **Заголовки (headers)**: дополнительная инфа (например, API-ключ)\n- **Тело (body)**: данные для POST/PUT (обычно JSON)",
        },
        {
          type: "text",
          content:
            "**Статус-коды ответа** — важно знать:\n\n- **2xx** — успех (200 OK, 201 Created)\n- **4xx** — ты накосячил (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests)\n- **5xx** — сервер накосячил (500, 502, 503)",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Запомни 401 и 429",
          content:
            "При работе с LLM API: **401** — твой ключ неверный или закончился. **429** — ты превысил лимит запросов в минуту (rate limit). Это две самые частые ошибки.",
        },
      ],
    },
    {
      id: "what-is-api",
      title: "Что такое REST API",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**API** (Application Programming Interface) — это контракт между двумя программами. **REST API** — это API, который общается через HTTP и обычно отдаёт JSON.",
        },
        {
          type: "text",
          content:
            "Что такое API на пальцах:\n\nПредставь сервер как ресторан с меню. Меню = документация API. Ты делаешь заказ (запрос) — официант приносит блюдо (ответ). Тебе не важно, как готовится — важно, что ты получаешь.",
        },
        {
          type: "code",
          language: "text",
          content: `Запрос:
GET https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=ABC123

Ответ (JSON):
{
  "name": "Moscow",
  "main": { "temp": -3.5, "humidity": 87 },
  "weather": [{"description": "light snow"}]
}`,
        },
      ],
    },
    {
      id: "requests",
      title: "Библиотека requests",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "text",
          content:
            "Стандарт де-факто для HTTP в Python. Простая, всем знакомая, в любом проекте.",
        },
        {
          type: "code",
          language: "python",
          content: `import requests

# Простой GET
response = requests.get("https://api.github.com")
print(response.status_code)   # 200
print(response.json())        # автоматически парсит JSON в словарь

# GET с параметрами
response = requests.get(
    "https://api.github.com/search/repositories",
    params={"q": "anthropic", "per_page": 5}
)
data = response.json()
print(data["total_count"])

# POST с JSON в теле
response = requests.post(
    "https://api.example.com/users",
    json={"name": "Иван", "email": "ivan@example.com"}
)

# С заголовками (для авторизации)
response = requests.get(
    "https://api.example.com/me",
    headers={"Authorization": "Bearer твой_токен"}
)`,
        },
        {
          type: "text",
          content:
            "**Полезные свойства Response:**\n\n- `response.status_code` — код ответа (200, 404 и т.д.)\n- `response.json()` — распарсить тело как JSON\n- `response.text` — тело как строка\n- `response.headers` — заголовки ответа\n- `response.ok` — True если статус 2xx",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Всегда проверяй статус",
          content:
            "Не доверяй, что запрос прошёл успешно. Проверяй `response.status_code` или используй `response.raise_for_status()` — выбросит исключение при 4xx/5xx.",
        },
      ],
    },
    {
      id: "api-keys",
      title: "API-ключи и переменные окружения",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "API-ключ — это твой пароль для сервиса. **Никогда** не пиши его прямо в коде. Никогда не коммить его в git.",
        },
        {
          type: "callout",
          variant: "danger",
          title: "Реальная история",
          content:
            "Каждый день тысячи разработчиков коммитят ключи в публичные репозитории. Боты сканируют GitHub и за минуты используют их. Можно проснуться со счётом на тысячи долларов. **Защита: переменные окружения + .gitignore**.",
        },
        {
          type: "text",
          content:
            "**Правильный подход — файл `.env`:**",
        },
        {
          type: "code",
          language: "bash",
          content: `# .env (НЕ коммитить!)
OPENWEATHER_API_KEY=abc123xyz
ANTHROPIC_API_KEY=sk-ant-...`,
        },
        {
          type: "code",
          language: "python",
          content: `import os
from dotenv import load_dotenv

# Загружает переменные из .env в os.environ
load_dotenv()

# Читаем
api_key = os.environ["OPENWEATHER_API_KEY"]
# или безопаснее (с дефолтом):
api_key = os.getenv("OPENWEATHER_API_KEY", "")

if not api_key:
    raise RuntimeError("OPENWEATHER_API_KEY не задан в .env")`,
        },
        {
          type: "code",
          language: "bash",
          content: `# .gitignore — обязательно
.env
venv/
__pycache__/
*.pyc`,
        },
      ],
    },
    {
      id: "project-spec",
      title: "Проект недели: Weather CLI",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "К концу недели ты сделаешь свой первый настоящий проект — CLI-программу для просмотра погоды через API.",
        },
        {
          type: "text",
          content:
            "**Что нужно сделать:**\n\n1. Зарегистрироваться на https://openweathermap.org/api (бесплатный план, нужна почта)\n2. Получить API-ключ (в личном кабинете)\n3. Создать проект `weather-cli` со структурой:\n```\nweather-cli/\n├── main.py\n├── .env          # ключ\n├── .gitignore    # .env, venv/\n├── requirements.txt\n└── README.md\n```\n4. Реализовать функции `get_weather(city)`, `print_weather(data)`\n5. В `main()` — цикл: пользователь вводит город → видит погоду → продолжает или выходит",
        },
        {
          type: "callout",
          variant: "info",
          title: "Endpoint OpenWeather",
          content:
            "`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric&lang=ru`\n\n- `units=metric` — температура в Цельсиях\n- `lang=ru` — описание погоды на русском",
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
              title: "requests — официальная документация",
              url: "https://requests.readthedocs.io/",
              description: "Главный источник правды по requests.",
            },
            {
              title: "OpenWeatherMap API",
              url: "https://openweathermap.org/current",
              description: "Документация endpoint погоды.",
            },
            {
              title: "MDN: HTTP overview",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
              description: "Лучшее введение в HTTP в мире.",
            },
            {
              title: "python-dotenv",
              url: "https://github.com/theskumar/python-dotenv",
              description: "Библиотека для работы с .env.",
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
      question: "Что значит HTTP-статус 401?",
      options: [
        { id: "a", text: "Сервер недоступен" },
        { id: "b", text: "Не найдено (404 это)" },
        { id: "c", text: "Не авторизован — неверный или отсутствует ключ/токен" },
        { id: "d", text: "Слишком много запросов" },
      ],
      correctOptionId: "c",
      explanation:
        "401 Unauthorized — твоя авторизация недействительна. При работе с LLM API это значит, что ключ неверный, истёк, или ты забыл его передать.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Какой HTTP-метод обычно используется для отправки новых данных?",
      options: [
        { id: "a", text: "GET" },
        { id: "b", text: "POST" },
        { id: "c", text: "DELETE" },
        { id: "d", text: "FETCH" },
      ],
      correctOptionId: "b",
      explanation:
        "POST — для создания нового ресурса или отправки данных на обработку. GET — только для получения. DELETE — для удаления. FETCH такого метода нет.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "Какие действия со своим API-ключом — НЕПРАВИЛЬНЫЕ? (несколько)",
      options: [
        { id: "a", text: "Записать в .env, добавить .env в .gitignore" },
        { id: "b", text: "Захардкодить прямо в коде: API_KEY = 'sk-abc...'" },
        { id: "c", text: "Запушить в публичный репозиторий (для удобства)" },
        { id: "d", text: "Читать через os.environ из переменных окружения" },
      ],
      correctOptionIds: ["b", "c"],
      explanation:
        "Хардкод в коде и пуш в репо — главные способы случайно слить ключ. Правильно — .env + .gitignore + os.environ.",
    },
    {
      id: "q4",
      type: "text-input",
      question:
        "У тебя есть `response = requests.get(...)`. Какой метод вернёт тело ответа в виде Python-словаря (предполагая, что сервер ответил JSON)?\n\nВведи без скобок, например: `text`",
      correctAnswers: ["json"],
      caseSensitive: true,
      explanation:
        "`response.json()` распарсит тело как JSON и вернёт словарь/список. Не путай с `response.text` (вернёт сырую строку).",
    },
    {
      id: "q5",
      type: "single-choice",
      question:
        "Что произойдёт при запуске?\n\n```python\nimport requests\nr = requests.get('https://api.github.com/users/octocat')\nprint(r.json()['login'])\n```",
      options: [
        { id: "a", text: "Выведет 'octocat'" },
        { id: "b", text: "Выведет полный JSON" },
        { id: "c", text: "Ошибка — нужна авторизация" },
        { id: "d", text: "Ошибка — нельзя обращаться по ключу к response" },
      ],
      correctOptionId: "a",
      explanation:
        "`r.json()` вернёт словарь, в нём есть ключ `'login'` со значением `'octocat'`. GitHub API позволяет неавторизованные запросы (с лимитами).",
    },
    {
      id: "q6",
      type: "single-choice",
      question:
        "Какой код правильно передаёт API-ключ как параметр запроса?",
      options: [
        { id: "a", text: "requests.get(url, key=API_KEY)" },
        { id: "b", text: "requests.get(url, params={'appid': API_KEY})" },
        { id: "c", text: "requests.get(url + API_KEY)" },
        { id: "d", text: "requests.get(url, auth=API_KEY)" },
      ],
      correctOptionId: "b",
      explanation:
        "`params={}` — это словарь query-параметров, которые добавятся к URL как `?key=value&key2=value2`. Это правильный способ для OpenWeather и многих других API.",
    },
    {
      id: "q7",
      type: "text-input",
      question:
        "Какую библиотеку обычно используют для загрузки переменных из файла .env?\n\nВведи название пакета (как пишется в pip install):",
      correctAnswers: ["python-dotenv", "dotenv"],
      caseSensitive: false,
      explanation:
        "`pip install python-dotenv`. В коде импортируется как `from dotenv import load_dotenv`.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Парсинг JSON: достать поля",
      description:
        "Дан JSON-ответ от вымышленного weather API. Напиши функцию `extract(data)`, которая возвращает кортеж: `(город, температура, описание)`.",
      starterCode: `data = {
    "name": "Москва",
    "main": {"temp": -3.5, "feels_like": -8, "humidity": 87},
    "weather": [{"id": 600, "main": "Snow", "description": "лёгкий снег"}],
    "wind": {"speed": 4.0}
}


def extract(data: dict) -> tuple:
    # Шаги:
    # 1. Достать data["name"]
    # 2. Достать data["main"]["temp"]
    # 3. Достать data["weather"][0]["description"]
    pass


city, temp, desc = extract(data)
print(f"{city}: {temp}°C, {desc}")
# Москва: -3.5°C, лёгкий снег
`,
      solutionCode: `data = {
    "name": "Москва",
    "main": {"temp": -3.5, "feels_like": -8, "humidity": 87},
    "weather": [{"id": 600, "main": "Snow", "description": "лёгкий снег"}],
    "wind": {"speed": 4.0}
}


def extract(data: dict) -> tuple:
    city = data["name"]
    temp = data["main"]["temp"]
    desc = data["weather"][0]["description"]
    return city, temp, desc


city, temp, desc = extract(data)
print(f"{city}: {temp}°C, {desc}")`,
      language: "python",
      runnable: true,
      hints: [
        "weather — это список, поэтому нужен `[0]` чтобы взять первый элемент.",
        "Описание погоды лежит в `data['weather'][0]['description']`.",
      ],
    },
    {
      id: "p2",
      title: "Безопасная обработка ответа",
      description:
        "Перепиши `extract`, чтобы она не падала, если каких-то полей нет. Возвращай дефолты: город — `'Неизвестно'`, температура — `None`, описание — `'нет данных'`.",
      starterCode: `def safe_extract(data: dict) -> tuple:
    # Используй .get() с дефолтами
    # Для вложенных — сначала .get() для main, потом .get() для temp
    city = data.get("name", "Неизвестно")

    # Допиши temp и desc безопасно
    pass


# Тесты
print(safe_extract({"name": "Москва", "main": {"temp": -3.5}, "weather": [{"description": "снег"}]}))
print(safe_extract({}))                                       # все дефолты
print(safe_extract({"name": "Берлин", "main": {}}))           # без температуры
print(safe_extract({"name": "Париж", "main": {"temp": 10}}))  # без weather
`,
      solutionCode: `def safe_extract(data: dict) -> tuple:
    city = data.get("name", "Неизвестно")
    temp = data.get("main", {}).get("temp", None)
    weather_list = data.get("weather", [])
    desc = weather_list[0].get("description", "нет данных") if weather_list else "нет данных"
    return city, temp, desc


print(safe_extract({"name": "Москва", "main": {"temp": -3.5}, "weather": [{"description": "снег"}]}))
print(safe_extract({}))
print(safe_extract({"name": "Берлин", "main": {}}))
print(safe_extract({"name": "Париж", "main": {"temp": 10}}))`,
      language: "python",
      runnable: true,
      hints: [
        "`data.get('main', {})` вернёт пустой словарь, если ключа нет — потом на нём можно вызвать .get() ещё раз.",
        "Для списка проверь, что он не пустой, прежде чем брать `[0]`.",
      ],
    },
    {
      id: "p3",
      title: "Мок HTTP-запроса",
      description:
        "Реализуй функцию `fetch_user(user_id)`, которая будет имитировать API-вызов. Логика:\n- Если user_id < 1 → выбросить `ValueError`\n- Если user_id > 100 → имитировать 404, вернуть `None`\n- Иначе → вернуть словарь `{'id': user_id, 'name': f'User{user_id}', 'email': f'user{user_id}@example.com'}`\n\nЭто упражнение перед настоящим API на следующем шаге.",
      starterCode: `def fetch_user(user_id: int) -> dict | None:
    # Допиши логику с условиями
    pass


# Тесты
print(fetch_user(5))    # {'id': 5, 'name': 'User5', 'email': 'user5@example.com'}
print(fetch_user(150))  # None

try:
    fetch_user(0)
except ValueError as e:
    print(f"Ошибка: {e}")
`,
      solutionCode: `def fetch_user(user_id: int) -> dict | None:
    if user_id < 1:
        raise ValueError(f"user_id должен быть >= 1, получено {user_id}")
    if user_id > 100:
        return None
    return {
        "id": user_id,
        "name": f"User{user_id}",
        "email": f"user{user_id}@example.com"
    }


print(fetch_user(5))
print(fetch_user(150))

try:
    fetch_user(0)
except ValueError as e:
    print(f"Ошибка: {e}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Weather CLI MVP",
      description:
        "Эту задачу делаешь у себя на компьютере (в созданном на прошлой неделе репозитории `weather-cli`).\n\n**Шаги:**\n\n1. Зарегистрируйся на https://openweathermap.org/api, получи API-ключ (бесплатный)\n2. В корне проекта создай `.env`:\n```\nOPENWEATHER_API_KEY=твой_ключ\n```\n3. Установи зависимости:\n```bash\npip install requests python-dotenv\npip freeze > requirements.txt\n```\n4. Напиши `main.py`:\n   - Функция `get_weather(city: str) -> dict` — делает запрос, возвращает данные\n   - Функция `print_weather(data: dict)` — красиво выводит\n   - В `main()` — цикл с вводом города\n5. Запусти, протестируй на 3-4 городах\n6. Закоммить и запушь\n\n**Нажми 'Сделано', когда работает на твоей машине.**",
      starterCode: `# Пример структуры (для справки):

import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather(city: str) -> dict:
    response = requests.get(
        BASE_URL,
        params={"q": city, "appid": API_KEY, "units": "metric", "lang": "ru"}
    )
    if response.status_code == 404:
        raise ValueError(f"Город '{city}' не найден")
    response.raise_for_status()
    return response.json()


def print_weather(data: dict) -> None:
    city = data["name"]
    temp = data["main"]["temp"]
    feels = data["main"]["feels_like"]
    desc = data["weather"][0]["description"]
    humidity = data["main"]["humidity"]
    wind = data["wind"]["speed"]
    print(f"\\n🌤  Погода в {city}:")
    print(f"   Температура: {temp}°C (ощущается как {feels}°C)")
    print(f"   {desc.capitalize()}")
    print(f"   Влажность: {humidity}%, ветер: {wind} м/с")


def main():
    while True:
        city = input("\\nГород (или 'q' для выхода): ").strip()
        if city.lower() in ("q", "quit", "exit"):
            break
        try:
            data = get_weather(city)
            print_weather(data)
        except ValueError as e:
            print(f"❌ {e}")
        except requests.RequestException as e:
            print(f"❌ Ошибка сети: {e}")


if __name__ == "__main__":
    main()
`,
      language: "python",
      runnable: false,
      hints: [
        "Если получаешь 401 — ключ не активирован. После регистрации OpenWeather активирует ключ за 5-30 минут.",
        "Если хочешь прогноз на 5 дней — другой endpoint: `/data/2.5/forecast`.",
      ],
    },
  ],
  checkpoint: [
    "Репозиторий `weather-cli` работает и задокументирован",
    "Понимаешь, как делается HTTP-запрос",
    "Понимаешь, зачем нужны API-ключи и почему их нельзя коммитить",
    "Понимаешь, что такое JSON и как его парсить",
    "Готов на следующий месяц работать с Claude API — он устроен точно так же",
  ],
};
