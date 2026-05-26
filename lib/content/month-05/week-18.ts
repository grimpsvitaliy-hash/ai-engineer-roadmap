import type { Lesson } from "../types";

export const week18: Lesson = {
  id: "m5-w18",
  monthId: "month-05",
  weekNumber: 18,
  title: "Docker — контейнеризация",
  goal: "Можешь упаковать своё приложение в Docker-контейнер, который запустится одной командой на любой машине. Базовый Dockerfile, docker-compose, оптимизация.",
  estimatedHours: "6-8 ч",
  theory: [
    {
      id: "what-is-docker",
      title: "Что такое Docker и зачем",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Docker** — это изолированная среда (контейнер), в которой запускается твоё приложение со всеми зависимостями (Python, пакеты, конфиги). Гарантирует «у меня работает = у тебя работает».",
        },
        {
          type: "text",
          content:
            "**Зачем тебе:**\n\n1. **Воспроизводимость** — на любом серве/ноуте один и тот же runtime\n2. **Изоляция** — приложение не конфликтует с системными пакетами\n3. **Деплой** — почти все хостинги принимают Docker-образ\n4. **Сборка стека** через docker-compose: API + БД + Redis + Qdrant — одной командой",
        },
        {
          type: "callout",
          variant: "info",
          title: "Ключевые понятия",
          content:
            "**Image** (образ) — шаблон, описанный Dockerfile. **Container** — запущенный экземпляр image. Образ можно запустить много раз = много контейнеров.",
        },
      ],
    },
    {
      id: "dockerfile",
      title: "Dockerfile для Python-приложения",
      estimatedMinutes: 15,
      blocks: [
        {
          type: "code",
          language: "dockerfile",
          content: `# Базовый образ — slim это компактная Python без лишних утилит
FROM python:3.12-slim

# Рабочая директория внутри контейнера
WORKDIR /app

# Сначала только requirements.txt — для лучшего кэширования слоёв
# Если изменятся только .py файлы, pip install не будет пересчитан
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Теперь весь код
COPY . .

# Какой порт контейнер открывает (для документации, не магия)
EXPOSE 8000

# Команда запуска
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Порядок слоёв важен",
          content:
            "Docker кеширует каждый шаг (RUN/COPY) как слой. Если изменится строка — все слои **после** пересчитаются. Поэтому сначала копируем requirements.txt + install (редко меняется), потом код (часто меняется).",
        },
        {
          type: "code",
          language: "text",
          content: `# .dockerignore — что НЕ копировать в образ
.env
.git
__pycache__
*.pyc
venv
.venv
node_modules
.next
*.log
.DS_Store`,
        },
      ],
    },
    {
      id: "commands",
      title: "Базовые команды",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "code",
          language: "bash",
          content: `# Установка Docker Desktop: https://www.docker.com/products/docker-desktop/

# Собрать образ из Dockerfile в текущей папке
docker build -t my-rag-api .

# Запустить контейнер
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=sk-ant-... my-rag-api
# -p 8000:8000  — пробросить порт: host:container
# -e VAR=value  — передать переменную окружения
# --rm          — удалить контейнер после остановки
# -d            — detached (в фоне)
# --name foo    — имя контейнера для удобства

# Список запущенных контейнеров
docker ps

# Логи
docker logs <container_id_or_name>
docker logs -f <name>   # follow (как tail -f)

# Войти внутрь контейнера shell-ом
docker exec -it <name> bash

# Остановить
docker stop <name>

# Удалить
docker rm <name>

# Список образов
docker images

# Удалить образ
docker rmi my-rag-api`,
        },
      ],
    },
    {
      id: "docker-compose",
      title: "docker-compose — оркестрация нескольких сервисов",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "Когда у тебя API + векторная БД + Redis — описать всё в `docker-compose.yml` и запустить одной командой.",
        },
        {
          type: "code",
          language: "yaml",
          content: `# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - QDRANT_URL=http://qdrant:6333
    depends_on:
      - qdrant
      - redis
    volumes:
      - ./data:/app/data   # для разработки — код синхронизируется

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  qdrant_storage:`,
        },
        {
          type: "code",
          language: "bash",
          content: `# Запустить всё
docker compose up -d

# Логи всех сервисов
docker compose logs -f

# Только api
docker compose logs -f api

# Остановить всё
docker compose down

# Пересобрать и запустить
docker compose up --build`,
        },
      ],
    },
    {
      id: "optimization",
      title: "Оптимизация размера образа",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Сравнение Python образов:**\n\n- `python:3.12` → ~1 ГБ (полный Debian, полно утилит)\n- `python:3.12-slim` → ~150 МБ ✅ default выбор\n- `python:3.12-alpine` → ~50 МБ — но Alpine использует musl libc, у некоторых пакетов (numpy, lxml) могут быть проблемы со сборкой\n\nДля LLM-приложений с numpy/scipy — `slim`, не `alpine`.",
        },
        {
          type: "text",
          content:
            "**Multi-stage build** — продвинуто, для compile-time зависимостей:",
        },
        {
          type: "code",
          language: "dockerfile",
          content: `# Stage 1: builder — здесь компилируется всё нужное
FROM python:3.12-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


# Stage 2: runtime — финальный лёгкий образ
FROM python:3.12-slim

WORKDIR /app
# Берём только установленные пакеты из builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

EXPOSE 8000
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]`,
        },
        {
          type: "callout",
          variant: "tip",
          title: "Целевой размер",
          content:
            "Для LLM-приложения с FastAPI и парой клиентов — норма 200-400 МБ. Если у тебя 1+ ГБ — что-то лишнее (например, dev-зависимости, кеши, dataset в образе).",
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
              title: "Docker Desktop — установка",
              url: "https://www.docker.com/products/docker-desktop/",
              description: "Для Windows / Mac. Запускает Docker через WSL2 / VM.",
            },
            {
              title: "Docker — Get Started",
              url: "https://docs.docker.com/get-started/",
              description: "Официальный гайд.",
            },
            {
              title: "TechWorld with Nana — Docker Tutorial",
              url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
              description: "1.5h туториал на YouTube, очень понятный.",
            },
            {
              title: "Awesome Compose",
              url: "https://github.com/docker/awesome-compose",
              description: "Сотни готовых docker-compose файлов для разных стеков.",
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
          emoji: "🐳",
          title: "«It works on my machine» → Docker",
          content:
            "Соломон Хайкс в 2013 году на PyCon показал маленькую утилиту «dotCloud» (потом переименованную в Docker). До этого DevOps был адом: «у меня работает, у тебя нет» — главный мем индустрии. Docker превратил приложение в **изолированную коробку**, и фраза стала **«It works in my container»** — и это работает. Хайкс продал Docker, но компания пережила несколько near-death экспериментов.",
        },
        {
          type: "funfact",
          emoji: "📏",
          title: "Один из размеров образов",
          content:
            "Самый маленький Docker-образ в мире — **`scratch`** (0 байт, чисто метаданные). Внутри ничего нет, кроме того что ты сам положишь. На втором месте — **`alpine`** ~5 МБ — мини-Linux на musl libc. Для сравнения: образ **`ubuntu:22.04`** ~75 МБ, **`python:3.12`** ~1 ГБ. Кэнаэт инженер 2010-х не понял бы — образ ОС весит меньше чем игра, в которую он играл на PSX.",
        },
        {
          type: "funfact",
          emoji: "🏔️",
          title: "Kubernetes — детище гугла, побеждённое сложностью",
          content:
            "**Kubernetes (k8s)** — open-source инструмент для оркестрации контейнеров от Google (2014). Идея: «как Borg, наш внутренний кластерный менеджер, только для всех». На практике k8s стал **синонимом complexity**: учебники по 1000 страниц, сертификации, целые команды для поддержки. Появилось целое движение **«анти-k8s»** — «может тебе не нужен k8s, тебе нужен Heroku/Railway/Fly». В пет-проектах — точно не нужен.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "В чём разница между Docker image и Docker container?",
      options: [
        { id: "a", text: "Это синонимы" },
        { id: "b", text: "Image — шаблон, container — запущенный экземпляр image. Из одного image можно запустить много containers" },
        { id: "c", text: "Image — для Mac, container — для Linux" },
        { id: "d", text: "Image — старое название, сейчас используют container" },
      ],
      correctOptionId: "b",
      explanation:
        "Image — как класс. Container — как объект (экземпляр класса). Один и тот же image можно запустить много раз — получишь много контейнеров.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Почему в Dockerfile сначала COPY requirements.txt и pip install, а потом COPY весь код?",
      options: [
        { id: "a", text: "Так требует Docker" },
        { id: "b", text: "Лучшее кэширование слоёв: если меняется только код, не пересчитываем pip install (долго)" },
        { id: "c", text: "Это правильный алфавитный порядок" },
        { id: "d", text: "Иначе не работает" },
      ],
      correctOptionId: "b",
      explanation:
        "Docker кеширует каждый шаг. requirements.txt меняется редко → слой с pip install кешируется. Иначе каждое изменение кода = долгая пересборка зависимостей.",
    },
    {
      id: "q3",
      type: "single-choice",
      question: "Какой Python-образ обычно лучший выбор для LLM-приложений с FastAPI?",
      options: [
        { id: "a", text: "python:3.12 — полный, ~1 ГБ" },
        { id: "b", text: "python:3.12-slim — ~150 МБ" },
        { id: "c", text: "python:3.12-alpine — ~50 МБ" },
        { id: "d", text: "ubuntu:22.04" },
      ],
      correctOptionId: "b",
      explanation:
        "slim — баланс размера и совместимости. Alpine использует musl libc, на котором numpy/scipy/lxml бывает ломаются.",
    },
    {
      id: "q4",
      type: "single-choice",
      question:
        "В команде `docker run -p 8000:8000 my-app` — что значит `-p 8000:8000`?",
      options: [
        { id: "a", text: "Запустить с порядковым номером 8000" },
        { id: "b", text: "Пробросить порт: 8000 на хосте → 8000 в контейнере" },
        { id: "c", text: "Использовать 8000 ядер CPU" },
        { id: "d", text: "Дать 8000 МБ памяти" },
      ],
      correctOptionId: "b",
      explanation:
        "Формат `host_port:container_port`. Можно мапить разные: `-p 9000:8000` — обращаешься на 9000 на хосте, попадаешь в 8000 в контейнере.",
    },
    {
      id: "q5",
      type: "single-choice",
      question: "Что делает `.dockerignore`?",
      options: [
        { id: "a", text: "Игнорирует файлы при сборке образа (как .gitignore)" },
        { id: "b", text: "Отключает Docker" },
        { id: "c", text: "Список разрешённых пользователей" },
        { id: "d", text: "Конфиг для multi-stage build" },
      ],
      correctOptionId: "a",
      explanation:
        "`.dockerignore` исключает файлы из контекста сборки (`.env`, `__pycache__`, `node_modules`). Делает образы меньше и безопаснее.",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question: "Что хорошо иметь в docker-compose для типичного LLM-проекта? (несколько)",
      options: [
        { id: "a", text: "Сервис api (твой FastAPI)" },
        { id: "b", text: "Сервис vector DB (qdrant/chroma)" },
        { id: "c", text: "Сервис кеша (redis)" },
        { id: "d", text: "depends_on — порядок запуска" },
      ],
      correctOptionIds: ["a", "b", "c", "d"],
      explanation:
        "Все четыре — стандарт. compose позволяет одной командой поднять весь стек локально.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Анализ Dockerfile",
      description:
        "Дан Dockerfile с ошибками/неоптимальностями. Найди их в комментариях ниже и исправь.\n\nЭто не runnable — отметь «сделано» когда напишешь правильную версию в коде ниже.",
      starterCode: `# Текущий Dockerfile (с ошибками):
"""
FROM python:3.12

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8000
CMD uvicorn api:app
"""

# Ошибки:
# 1. python:3.12 — слишком большой образ (~1ГБ). Лучше python:3.12-slim
# 2. COPY . /app до WORKDIR — работает, но обычно WORKDIR ставят первым
# 3. COPY всего кода до pip install — плохой кеш. Сначала requirements.txt
# 4. pip install без --no-cache-dir — лишние ~100МБ
# 5. CMD без [] — будет shell form, не reload-able. Лучше exec form ["..."]
# 6. uvicorn без --host 0.0.0.0 — будет слушать только 127.0.0.1, не доступен снаружи

# Напиши правильную версию ниже (в строке):
FIXED_DOCKERFILE = """
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
"""

print(FIXED_DOCKERFILE)
print("\\n✓ Поправил 6 ошибок")
`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "Парсер docker run команды",
      description:
        "Напиши функцию `parse_docker_run(command)` которая разбирает команду `docker run` и возвращает словарь с её параметрами:\n\n- `image` — образ\n- `ports` — словарь `{host_port: container_port}` (`-p 8000:8000`)\n- `env` — словарь переменных окружения (`-e KEY=VALUE`)\n- `detached` — bool (`-d`)",
      starterCode: `def parse_docker_run(command: str) -> dict:
    # Удалим "docker run" в начале
    parts = command.split()
    if parts[:2] == ["docker", "run"]:
        parts = parts[2:]

    result = {"image": None, "ports": {}, "env": {}, "detached": False}

    i = 0
    while i < len(parts):
        token = parts[i]
        # Допиши обработку -p, -e, -d, и image (последний non-flag)
        i += 1

    return result


# Тесты
cases = [
    "docker run -p 8000:8000 my-app",
    "docker run -d -p 8000:8000 -e ANTHROPIC_API_KEY=sk-ant my-rag-api",
    "docker run -p 9000:8000 -p 6379:6379 -e DEBUG=1 multiservice",
]

import json
for c in cases:
    print(f"\\nИн: {c}")
    print(f"Out: {json.dumps(parse_docker_run(c), indent=2)}")
`,
      solutionCode: `def parse_docker_run(command: str) -> dict:
    parts = command.split()
    if parts[:2] == ["docker", "run"]:
        parts = parts[2:]

    result = {"image": None, "ports": {}, "env": {}, "detached": False}

    i = 0
    while i < len(parts):
        token = parts[i]
        if token == "-d":
            result["detached"] = True
            i += 1
        elif token == "-p" and i + 1 < len(parts):
            host_port, container_port = parts[i + 1].split(":")
            result["ports"][int(host_port)] = int(container_port)
            i += 2
        elif token == "-e" and i + 1 < len(parts):
            key, value = parts[i + 1].split("=", 1)
            result["env"][key] = value
            i += 2
        else:
            # последний non-flag токен = image
            result["image"] = token
            i += 1

    return result


cases = [
    "docker run -p 8000:8000 my-app",
    "docker run -d -p 8000:8000 -e ANTHROPIC_API_KEY=sk-ant my-rag-api",
    "docker run -p 9000:8000 -p 6379:6379 -e DEBUG=1 multiservice",
]

import json
for c in cases:
    print(f"\\nIn: {c}")
    print(f"Out: {json.dumps(parse_docker_run(c), indent=2)}")`,
      language: "python",
      runnable: true,
    },
    {
      id: "p3",
      title: "Генератор docker-compose",
      description:
        "Функция `gen_compose(services)` принимает список словарей сервисов и возвращает YAML-строку docker-compose файла.\n\nКаждый сервис: `{name, image_or_build, ports?, environment?, depends_on?}`",
      starterCode: `def gen_compose(services: list[dict]) -> str:
    lines = ["services:"]

    for svc in services:
        lines.append(f"  {svc['name']}:")

        # build или image
        if svc.get("build"):
            lines.append(f"    build: {svc['build']}")
        elif svc.get("image"):
            lines.append(f"    image: {svc['image']}")

        # ports
        if svc.get("ports"):
            lines.append("    ports:")
            for p in svc["ports"]:
                lines.append(f'      - "{p}"')

        # environment
        if svc.get("environment"):
            lines.append("    environment:")
            for key, val in svc["environment"].items():
                lines.append(f'      - {key}={val}')

        # depends_on
        if svc.get("depends_on"):
            lines.append("    depends_on:")
            for d in svc["depends_on"]:
                lines.append(f"      - {d}")

    return "\\n".join(lines)


services = [
    {
        "name": "api",
        "build": ".",
        "ports": ["8000:8000"],
        "environment": {"DEBUG": "1", "QDRANT_URL": "http://qdrant:6333"},
        "depends_on": ["qdrant", "redis"],
    },
    {
        "name": "qdrant",
        "image": "qdrant/qdrant:latest",
        "ports": ["6333:6333"],
    },
    {
        "name": "redis",
        "image": "redis:7-alpine",
        "ports": ["6379:6379"],
    },
]

print(gen_compose(services))
`,
      solutionCode: `def gen_compose(services: list[dict]) -> str:
    lines = ["services:"]

    for svc in services:
        lines.append(f"  {svc['name']}:")

        if svc.get("build"):
            lines.append(f"    build: {svc['build']}")
        elif svc.get("image"):
            lines.append(f"    image: {svc['image']}")

        if svc.get("ports"):
            lines.append("    ports:")
            for p in svc["ports"]:
                lines.append(f'      - "{p}"')

        if svc.get("environment"):
            lines.append("    environment:")
            for key, val in svc["environment"].items():
                lines.append(f'      - {key}={val}')

        if svc.get("depends_on"):
            lines.append("    depends_on:")
            for d in svc["depends_on"]:
                lines.append(f"      - {d}")

    return "\\n".join(lines)


services = [
    {
        "name": "api",
        "build": ".",
        "ports": ["8000:8000"],
        "environment": {"DEBUG": "1", "QDRANT_URL": "http://qdrant:6333"},
        "depends_on": ["qdrant", "redis"],
    },
    {
        "name": "qdrant",
        "image": "qdrant/qdrant:latest",
        "ports": ["6333:6333"],
    },
    {
        "name": "redis",
        "image": "redis:7-alpine",
        "ports": ["6379:6379"],
    },
]

print(gen_compose(services))`,
      language: "python",
      runnable: true,
    },
    {
      id: "p4",
      title: "ЛОКАЛЬНО: Dockerize свой RAG-проект",
      description:
        "Возьми RAG-проект из недели 16 (с FastAPI из недели 17) и контейнеризуй его.\n\n**Шаги:**\n\n1. **Установи Docker Desktop**: https://www.docker.com/products/docker-desktop/\n2. В корне проекта создай `Dockerfile` (см. теорию)\n3. Создай `.dockerignore` со списком исключений\n4. Собери: `docker build -t my-rag .`\n5. Запусти: `docker run -p 8000:8000 -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY my-rag`\n6. Открой http://localhost:8000/docs — должно работать\n7. **Bonus**: добавь Qdrant вместо Chroma и опиши всё в `docker-compose.yml`. Запусти `docker compose up`.\n8. Проверь размер итогового образа: `docker images` — должен быть < 500 МБ",
      starterCode: `# Dockerfile (положи в корень проекта)
FROM python:3.12-slim

WORKDIR /app

# Системные зависимости (если нужны для сборки колёс)
# RUN apt-get update && apt-get install -y --no-install-recommends \\
#     gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]


# .dockerignore
"""
.env
.git
__pycache__
*.pyc
venv
.venv
*.log
.DS_Store
chroma_db/
data/raw/
.pytest_cache
"""


# docker-compose.yml (опционально)
"""
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - QDRANT_URL=http://qdrant:6333
    depends_on:
      - qdrant
    volumes:
      - ./data:/app/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
"""

# Сборка и запуск:
# docker build -t my-rag .
# docker run --rm -p 8000:8000 -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY my-rag
# или
# docker compose up --build
`,
      language: "python",
      runnable: false,
      hints: [
        "Если Docker не запускается на Windows — включи WSL2 в настройках Windows и Docker Desktop.",
        "Если образ получается > 1 ГБ — посмотри что попало внутрь: `docker run --rm -it my-rag sh` → `du -sh /app/* /usr/local/lib/python*/site-packages/*`.",
      ],
    },
  ],
  checkpoint: [
    "Установлен Docker Desktop, понимаешь image vs container",
    "Написал Dockerfile с правильным порядком слоёв",
    "Локально собран и запущен RAG-API в Docker",
    "Образ < 500 МБ",
    "Опционально — настроен docker-compose с api + qdrant",
  ],
};
