# AI Engineer Roadmap

Интерактивное приложение для становления **LLM Applied AI Engineer** за 6 месяцев с нуля.

- Теория с код-примерами и ссылками на ресурсы
- Опросники с моментальной проверкой (single-choice, multiple-choice, текстовый ввод)
- Практика на Python — **запускается прямо в браузере** (Pyodide / WebAssembly)
- Прогресс сохраняется в браузере (localStorage)
- Минималистичный дизайн в стиле Linear / Vercel
- Тёмная и светлая темы

Сейчас доступен **Месяц 1: Python с нуля до первого API-вызова** (4 недели, ~30 разделов теории, ~30 вопросов, ~20 практик).

---

## Быстрый старт

### Один раз: установить Node.js

Скачай LTS-версию (20.x или 22.x): https://nodejs.org/

Если Windows ругается на политику исполнения скриптов:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Каждый день: режим разработки

```powershell
npm install        # один раз, ~3-5 минут
npm run dev        # запустит на http://localhost:3000
```

Hot reload — поправил файл, страница сама обновилась.

---

## Запустить на другом компьютере

Есть три варианта — от простого к сложному.

### Вариант 1 — статическая сборка (рекомендую)

Приложение собирается в обычную папку `out/` с HTML/CSS/JS. Её можно открыть на **любом** компьютере, флешке, в DropBox, опубликовать на любом статическом хостинге.

**Собрать:**
```powershell
npm run build
```
В папке `out/` появится готовое приложение.

**Или одним кликом** — двойной клик на [`build-standalone.bat`](build-standalone.bat) — он сам всё установит и соберёт.

**Что делать с папкой `out/`:**

| Цель | Как |
|------|-----|
| Запустить локально на твоём компе | `npm run preview` (откроет http://localhost:3000) |
| Запустить на другом компе с Node.js | Скопируй папку `out/` + `run-anywhere.bat` → двойной клик |
| Опубликовать в интернете | Перетащи папку `out/` на [Netlify Drop](https://app.netlify.com/drop) — за 10 сек получишь URL |
| Бесплатный хостинг с своим доменом | Любой статический хостинг: Vercel, Netlify, Cloudflare Pages, GitHub Pages |

### Вариант 2 — Vercel (получить публичный URL)

Если хочешь, чтобы приложение жило в интернете и было доступно с телефона/любого браузера:

1. Зарегистрируйся на https://vercel.com (бесплатно)
2. Установи CLI: `npm install -g vercel`
3. В папке проекта: `vercel`
4. Следуй инструкциям — получишь URL вида `ai-engineer-app-shalay.vercel.app`

Vercel сам пересобирает при каждом коммите в GitHub. Бесплатно для пет-проектов.

### Вариант 3 — Запуск через Live Server в VS Code

Самый простой "ничего не устанавливать":
1. Собери: `npm run build` (или `build-standalone.bat`)
2. Открой папку `out/` в VS Code
3. Установи расширение **Live Server** (от Ritwick Dey)
4. Правый клик на `index.html` → "Open with Live Server"

---

## Ограничения

1. **Pyodide грузится с CDN при первом запуске практики** (~10 МБ, разовая загрузка, кешируется браузером). Если хочешь полностью offline — нужно положить Pyodide локально в `public/pyodide/` (отдельная работа).
2. **Прогресс хранится в браузере** — не синхронизируется между компьютерами. Если откроешь приложение на другом устройстве, прогресс будет нулевой. Решение в будущем: добавить экспорт/импорт прогресса в JSON.
3. **API-вызовы из практики** (`requests` к Claude/OpenAI) не работают в браузере из-за CORS — такие задачи помечены как «Локально», их делаешь у себя в VS Code.

---

## Структура проекта

```
ai-engineer-app/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # главная (план)
│   ├── month/[monthId]/page.tsx      # обзор месяца
│   ├── week/[weekId]/page.tsx        # урок недели
│   └── playground/page.tsx           # Python-песочница
├── components/
│   ├── ui/                           # Button, Card, Badge, Tabs, Progress, Callout
│   ├── LessonView.tsx                # вкладки: Теория / Квиз / Практика / Чекпоинт
│   ├── TheoryRenderer.tsx
│   ├── Quiz.tsx
│   ├── PracticeTask.tsx
│   ├── CodeEditor.tsx                # Monaco Editor wrapper
│   └── ...
├── lib/
│   ├── content/                      # контент уроков как TypeScript-модули
│   │   ├── types.ts
│   │   └── month-01/week-01..04.ts
│   ├── progress.ts                   # localStorage helpers
│   ├── pyodide.ts                    # Python в браузере
│   └── utils.ts
├── build-standalone.bat              # одним кликом: install + build
├── run-anywhere.bat                  # одним кликом: запуск out/ на любом компе
└── package.json
```

## Как добавить новые уроки

Каждый урок — это TypeScript-объект по схеме `Lesson` из [lib/content/types.ts](lib/content/types.ts).

Скелет для новой недели:

```ts
// lib/content/month-02/week-05.ts
import type { Lesson } from "../types";

export const week05: Lesson = {
  id: "m2-w5",
  monthId: "month-02",
  weekNumber: 5,
  title: "Как устроен LLM",
  goal: "Цель недели...",
  estimatedHours: "5-7 ч",
  theory: [
    {
      id: "intro",
      title: "Что такое LLM",
      estimatedMinutes: 10,
      blocks: [
        { type: "text", content: "Markdown поддерживается **внутри**." },
        { type: "code", language: "python", content: "print('hi')" },
        { type: "callout", variant: "tip", title: "Совет", content: "..." },
        { type: "resources", items: [{ title: "Karpathy", url: "https://..." }] },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question: "Что такое токен?",
      options: [
        { id: "a", text: "Слово" },
        { id: "b", text: "Минимальная единица для LLM" },
      ],
      correctOptionId: "b",
      explanation: "...",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Подсчёт токенов",
      description: "Напиши функцию...",
      starterCode: "def count(text): pass",
      solutionCode: "def count(text): return len(text.split())",
      language: "python",
      runnable: true,
    },
  ],
  checkpoint: ["Понимаешь токен"],
};
```

Импортируй в `lib/content/month-02/index.ts` и активируй месяц в `lib/content/index.ts` (`available: true`).

## Технологии

- **Next.js 15** (App Router, static export) + **React 19**
- **TypeScript** — типизация контента и компонентов
- **Tailwind CSS** — стилизация, минималистичная палитра zinc + один акцент
- **shadcn-style компоненты** (вручную) — Button, Card, Badge, Tabs, Progress, Callout
- **Monaco Editor** — тот же редактор кода, что в VS Code, но в браузере
- **Pyodide** — Python в WebAssembly, грузится с CDN
- **react-markdown** + **rehype-highlight** — markdown с подсветкой кода
- **lucide-react** — иконки
