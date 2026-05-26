import type { Lesson } from "../types";

export const week26: Lesson = {
  id: "m6-w26",
  monthId: "month-06",
  weekNumber: 26,
  title: "Финальный спринт + ретроспектива",
  goal: "Активно идёшь по интервью. К концу — есть оффер (или близко). Завершаешь полугодие с планом следующего этапа.",
  estimatedHours: "8+ ч",
  theory: [
    {
      id: "final-sprint",
      title: "Стратегия финального спринта",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "**Что делаешь дни 1-5:**\n\n- Продолжай отклики (15-20 в день)\n- **Реально проходи интервью** — каждое = +20% уверенности\n- После каждого интервью — **записывай в дневник** что спросили, как ответил, что подтянуть\n- **Если получаешь отказ — спроси фидбек** (короткий email рекрутёру). Многие дают, ты узнаёшь свои слабые стороны.\n- Делай ежедневный «retro» (5 мин в конце дня): что узнал нового про себя сегодня",
        },
      ],
    },
    {
      id: "offer-negotiation",
      title: "Если предлагают оффер",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "callout",
          variant: "tip",
          title: "Не соглашайся на первое число",
          content:
            "Юниоров часто пытаются нанять за «отвечает ожиданиям» сумму. Даже простое «спасибо за оффер, можем ли мы обсудить total compensation чуть выше?» в 70% случаев даёт +10-20%. Платить надо вам — никто не оскорбится за переговоры.",
        },
        {
          type: "text",
          content:
            "**Что обсуждать кроме зарплаты:**\n\n- Удалёнка / гибрид / офис\n- Опции / equity (для стартапов)\n- Sign-on bonus (для крупных компаний)\n- Бюджет на обучение / конференции\n- Гибкий график\n- Дни отпуска\n- Корпоративные ноут / оборудование",
        },
        {
          type: "callout",
          variant: "info",
          title: "Бенчмарки зарплат AI Junior (2026, ориентир)",
          content:
            "Россия (Москва): 150-300К ₽ / мес\nЕвропа (remote): €40-80K / год\nСША (remote/onsite): $70-150K / год\nСтартапы — обычно ниже base + опции\n\nЗависит от локации компании, удалёнка/нет, твоего бэкграунда.",
        },
      ],
    },
    {
      id: "no-offer",
      title: "Если оффера ещё нет — что дальше",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "**6 месяцев — не магия. Многие тратят 8-12.** Это не повод бросать. Что делать:",
        },
        {
          type: "text",
          content:
            "**1. Не учи новое — углубляй текущее.** Возьми один проект, сделай его невероятным.\n\n**2. Open source contributions.** Найди AI-проект (LangChain, LlamaIndex, Chroma, llama.cpp) → сделай 2-3 PR. Это сильнейший сигнал.\n\n**3. Контент.** Один глубокий пост в неделю в LinkedIn / dev.to / Хабр. На полугодовой дистанции рекрутёры тебя замечают.\n\n**4. Пересмотри подачу.** Если из 100 откликов 0 ответов — проблема в резюме / профиле, не в рынке. Покажи кому-то опытному.\n\n**5. Стажировка / контракт.** Не отказывайся от не-полных позиций. Стажировка → полная работа через 3-6 месяцев — норма.\n\n**6. Понизь планку временно.** Junior backend в AI-команде — за полгода ты внутри. Главное войти.",
        },
      ],
    },
    {
      id: "retrospective",
      title: "Ретроспектива 6 месяцев",
      estimatedMinutes: 10,
      blocks: [
        {
          type: "text",
          content:
            "В файле `RETROSPECTIVE.md` ответь:",
        },
        {
          type: "code",
          language: "markdown",
          content: `# 6-месячная ретроспектива: путь в AI Engineer

## Что я узнал
- (топ-10 ключевых концепций / навыков)

## Что не получилось
- (честно: где буксовал, что забросил)

## Лучший проект и почему
- ...

## Самый ценный навык, который я приобрёл
- ...

## Если бы начинал заново
- Что бы сделал по-другому?
- На что не тратил бы время?
- Чему уделил бы больше внимания?

## Следующие 6 месяцев (план)
- ...

## Кому я благодарен
- ...
`,
        },
      ],
    },
    {
      id: "next-steps",
      title: "Куда расти дальше",
      estimatedMinutes: 5,
      blocks: [
        {
          type: "text",
          content:
            "После junior — направления роста:\n\n**Глубже в инженерию:**\n- LangGraph / production agent orchestration\n- LLM inference оптимизация (vLLM, TGI)\n- Distributed systems, Kubernetes\n- Observability глубже (OpenTelemetry, Langfuse)\n\n**Глубже в ML:**\n- Fine-tuning (LoRA, PEFT)\n- Базовая math для NLP\n- Классический ML (sklearn, XGBoost)\n- Deep learning (PyTorch)\n\n**В стороны:**\n- AI product management — если хочется строить продукт\n- DevRel / Developer Advocate — если любишь писать и говорить\n- Research engineer — если хочется в академическую часть\n- Indie founder — свой AI-стартап",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Главное",
          content:
            "Применяй то что построил за 6 месяцев в реальной работе. Через 6 месяцев работы ты будешь middle уровня. Через 2 года — senior. Скорость развития в AI огромная, и опыт «реального продукта» оценивается выше любой теории.",
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
              title: "Levels.fyi — зарплатные бенчмарки",
              url: "https://www.levels.fyi/",
              description: "Реальные зарплаты AI/ML инженеров в разных компаниях.",
            },
            {
              title: "Habr Salary",
              url: "https://habr.com/ru/specials/salaries/",
              description: "Зарплатный калькулятор для России.",
            },
            {
              title: "First-time founders guide",
              url: "https://www.ycombinator.com/library",
              description: "Если потянуло в свой стартап — Y Combinator Library.",
            },
            {
              title: "Awesome LLM apps",
              url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
              description: "Сотни open-source LLM-приложений для вдохновения и контрибуций.",
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
          emoji: "🌳",
          title: "Лучшее время начать — сейчас",
          content:
            "Китайская поговорка: **«Лучшее время посадить дерево — 20 лет назад. Второе лучшее — сегодня»**. То же про карьеру: если бы ты начал учиться AI в 2021 — сейчас был бы senior. Но второе лучшее время — сейчас. Через год ты будешь говорить «жаль я не начал в 2026» или «как удачно я начал в 2026». Выбор за тобой, и он делается каждый день.",
        },
        {
          type: "funfact",
          emoji: "📈",
          title: "Закон сложного процента в карьере",
          content:
            "Если ты ежедневно становишься **на 1% лучше**, через год ты в **37 раз** круче (1.01^365 = 37.78). А если каждый день **на 1% слабее** — через год от тебя останется 3% (0.99^365 = 0.026). Карьерный рост — это **сложный процент над привычками**: ежедневный пост в LinkedIn, ежедневная задача, ежедневное чтение. Через год — другой уровень.",
        },
        {
          type: "funfact",
          emoji: "🎓",
          title: "Юристы тоже переходят в AI",
          content:
            "В 2024 году 30% новых студентов курсов AI Engineering приходят **не из tech**: юристы, врачи, маркетологи, бухгалтеры, **переводчики**. Они быстрее осваивают LLM — потому что **умеют формулировать**. Прог-бэкграунд иногда даже мешает — «нужно написать алгоритм» → теряют возможность «попросить модель». Если ты **пишешь хорошо и думаешь чётко** — половина пути уже пройдена.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      type: "single-choice",
      question:
        "Тебе сделали оффер с зарплатой ниже ожидаемого. Что делать?",
      options: [
        { id: "a", text: "Согласиться сразу — могут передумать" },
        { id: "b", text: "Отказаться сразу — это оскорбительно" },
        { id: "c", text: "Спасибо за оффер. Можем обсудить total compensation чуть выше / другие компоненты (бонус, обучение, отпуск)?" },
        { id: "d", text: "Молчать и ждать что они сами поднимут" },
      ],
      correctOptionId: "c",
      explanation:
        "Переговоры — стандарт. В 70% случаев улучшают условия. Никто не «обидится». Главное — вежливо, конкретно, с обоснованием.",
    },
    {
      id: "q2",
      type: "single-choice",
      question: "Получил отказ после интервью. Что лучше сделать?",
      options: [
        { id: "a", text: "Удалить контакт и забыть" },
        { id: "b", text: "Написать благодарственный email + попросить короткий фидбек что улучшить" },
        { id: "c", text: "Написать что они ошиблись" },
        { id: "d", text: "Подать заявку снова через 2 недели" },
      ],
      correctOptionId: "b",
      explanation:
        "Фидбек — самое ценное. Многие дают. Узнаешь свои слабые стороны. Бонус — компания тебя запомнит как профессионального кандидата (через год могут позвать сами).",
    },
    {
      id: "q3",
      type: "single-choice",
      question:
        "Через 6 месяцев оффера ещё нет. Что **НЕ** делать?",
      options: [
        { id: "a", text: "Бросить и вернуться в старую профессию" },
        { id: "b", text: "Углубить текущие проекты, добавить open source contributions, разбавить контентом" },
        { id: "c", text: "Подавать на смежные позиции (backend в AI-команде, ML data engineer)" },
        { id: "d", text: "Пересмотреть резюме с опытным наставником" },
      ],
      correctOptionId: "a",
      explanation:
        "Многие тратят 8-12 месяцев — это норма. Главное — не бросать. Все остальные варианты — конструктивные шаги.",
    },
    {
      id: "q4",
      type: "single-choice",
      question:
        "Куда стоит расти после получения junior-позиции?",
      options: [
        { id: "a", text: "Тут же искать middle где-то ещё" },
        { id: "b", text: "Применять навыки в реальной работе 1-2 года, набирать опыт продакшна — это самое ценное" },
        { id: "c", text: "Бросать всё и идти учиться PhD" },
        { id: "d", text: "Учить ещё 100 фреймворков" },
      ],
      correctOptionId: "b",
      explanation:
        "Опыт реального продукта оценивается выше любой теории. Через 1-2 года работы ты middle, через 2-3 senior. Не спеши.",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "Что должно быть в ретроспективе 6 месяцев? (несколько)",
      options: [
        { id: "a", text: "Что узнал" },
        { id: "b", text: "Что не получилось (честно)" },
        { id: "c", text: "Если бы начинал заново — что иначе" },
        { id: "d", text: "План на следующие 6 месяцев" },
      ],
      correctOptionIds: ["a", "b", "c", "d"],
      explanation:
        "Все четыре. Особенно важна честность в «что не получилось» — это основа роста. Без анализа провалов ты будешь повторять их.",
    },
  ],
  practice: [
    {
      id: "p1",
      title: "Калькулятор оффера",
      description:
        "Класс `OfferComparator` чтобы сравнить 2 оффера по разным компонентам.\n\nКаждый offer: `{company, base_salary_monthly, bonus_annual?, equity_4_year?, vacation_days?, learning_budget_annual?, remote: bool}`",
      starterCode: `class OfferComparator:
    def __init__(self):
        self.offers: list[dict] = []

    def add(self, **kwargs):
        offer = {
            "company": kwargs["company"],
            "base_monthly": kwargs["base_salary_monthly"],
            "bonus_annual": kwargs.get("bonus_annual", 0),
            "equity_4y": kwargs.get("equity_4_year", 0),
            "vacation_days": kwargs.get("vacation_days", 20),
            "learning_budget": kwargs.get("learning_budget_annual", 0),
            "remote": kwargs.get("remote", False),
        }
        offer["total_first_year"] = (
            offer["base_monthly"] * 12
            + offer["bonus_annual"]
            + offer["equity_4y"] / 4
            + offer["learning_budget"]
        )
        self.offers.append(offer)

    def compare(self) -> None:
        # Таблица сравнения
        keys = ["company", "base_monthly", "bonus_annual", "equity_4y",
                "vacation_days", "learning_budget", "remote", "total_first_year"]

        # Заголовок
        col_width = 18
        header = "".join(f"{k:<{col_width}}" for k in keys)
        print(header)
        print("-" * len(header))

        for offer in self.offers:
            row = "".join(f"{str(offer[k]):<{col_width}}" for k in keys)
            print(row)

        # Победитель по total
        winner = max(self.offers, key=lambda o: o["total_first_year"])
        print(f"\\n🏆 По total (1 год): {winner['company']} = $\${winner['total_first_year']:,.0f}")


cmp = OfferComparator()

cmp.add(
    company="Startup A",
    base_salary_monthly=8000,
    bonus_annual=0,
    equity_4_year=40000,
    vacation_days=25,
    learning_budget_annual=2000,
    remote=True,
)

cmp.add(
    company="Corp B",
    base_salary_monthly=10000,
    bonus_annual=12000,
    equity_4_year=0,
    vacation_days=20,
    learning_budget_annual=500,
    remote=False,
)

cmp.compare()
`,
      solutionCode: `class OfferComparator:
    def __init__(self):
        self.offers: list[dict] = []

    def add(self, **kwargs):
        offer = {
            "company": kwargs["company"],
            "base_monthly": kwargs["base_salary_monthly"],
            "bonus_annual": kwargs.get("bonus_annual", 0),
            "equity_4y": kwargs.get("equity_4_year", 0),
            "vacation_days": kwargs.get("vacation_days", 20),
            "learning_budget": kwargs.get("learning_budget_annual", 0),
            "remote": kwargs.get("remote", False),
        }
        offer["total_first_year"] = (
            offer["base_monthly"] * 12
            + offer["bonus_annual"]
            + offer["equity_4y"] / 4
            + offer["learning_budget"]
        )
        self.offers.append(offer)

    def compare(self) -> None:
        keys = ["company", "base_monthly", "bonus_annual", "equity_4y",
                "vacation_days", "learning_budget", "remote", "total_first_year"]

        col_width = 18
        header = "".join(f"{k:<{col_width}}" for k in keys)
        print(header)
        print("-" * len(header))

        for offer in self.offers:
            row = "".join(f"{str(offer[k]):<{col_width}}" for k in keys)
            print(row)

        winner = max(self.offers, key=lambda o: o["total_first_year"])
        print(f"\\n🏆 По total (1 год): {winner['company']} = $\${winner['total_first_year']:,.0f}")


cmp = OfferComparator()

cmp.add(company="Startup A", base_salary_monthly=8000, equity_4_year=40000, vacation_days=25, learning_budget_annual=2000, remote=True)
cmp.add(company="Corp B", base_salary_monthly=10000, bonus_annual=12000, vacation_days=20, learning_budget_annual=500, remote=False)

cmp.compare()`,
      language: "python",
      runnable: true,
    },
    {
      id: "p2",
      title: "ЛОКАЛЬНО: финальная ретроспектива",
      description:
        "Последняя задача в курсе.\n\n1. **Создай** `RETROSPECTIVE.md` (по шаблону из теории)\n2. **Заполни честно** все секции\n3. **Запиши план** на следующие 6 месяцев:\n   - Если оффер есть: как буду расти, какие навыки подтяну в первые 3 месяца на работе\n   - Если оффера нет: каких ещё подать, что улучшить в подаче, какой следующий проект сделать\n4. **Поставь** новые цели через 6 месяцев (junior → middle? новые скиллы? open source?)\n5. **Запости** ретроспективу публично — на LinkedIn / dev.to / Хабр. Это твой главный success-marker за 6 месяцев.\n\n**И главное — гордись собой.** Прошёл путь от нуля до AI Engineer за 6 месяцев — это огромная работа. Дальше — проще, потому что есть **фундамент**.",
      starterCode: `# Шаблон RETROSPECTIVE.md

template = """
# 6 месяцев в AI: моя ретроспектива

## TL;DR
Полгода назад я не знал что такое токен. Сегодня я ...

## Что я узнал
1. Python с нуля до уверенного использования
2. Как устроены LLM (концептуально)
3. Prompt engineering — техники
4. Tool use и agent loops
5. RAG end-to-end
6. Production: FastAPI, Docker, деплой
7. Эвалы и метрики
8. ...

## Главные проекты
1. **Research Assistant** — [link]
2. **RAG Assistant** — [link]
3. **[Третий проект]** — [link]

## Что не получилось
- ...

## Лучший момент
- ...

## Худший момент
- ...

## Если бы начинал заново
- ...

## Цифры
- Сделано: 3 портфолио-проекта
- Подано: X откликов
- Пройдено: Y интервью
- Получено: Z офферов

## Следующие 6 месяцев
- ...

## Спасибо
- Тем, кто помог: ...
- Тем, кто читал эти посты: ...
"""

print("Создай файл RETROSPECTIVE.md и заполни по шаблону.")
print("Опубликуй версию на LinkedIn / dev.to.")
print()
print("Поздравляю с финишем 6-месячного курса! 🎉")
`,
      language: "python",
      runnable: true,
    },
  ],
  checkpoint: [
    "Активно проходил интервью последнюю неделю",
    "Получил оффер ИЛИ оффер близко ИЛИ есть чёткий план на следующие N месяцев",
    "Написана ретроспектива 6 месяцев",
    "Поставлены цели на следующие 6 месяцев",
    "Опубликована публично — ты теперь часть AI-сообщества",
  ],
};
