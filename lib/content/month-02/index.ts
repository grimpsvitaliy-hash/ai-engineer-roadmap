import type { Month } from "../types";
import { week05 } from "./week-05";
import { week06 } from "./week-06";
import { week07 } from "./week-07";
import { week08 } from "./week-08";

export const month02: Month = {
  id: "month-02",
  number: 2,
  title: "Основы LLM и первые API-вызовы",
  description:
    "От концепций к практике: токены, температура, контекстное окно. Первые реальные запросы к Claude. Чат с памятью. Structured outputs.",
  goal:
    "Понимаешь, как устроены LLM. Уверенно работаешь с Anthropic API. Получаешь структурированные ответы.",
  mainArtifact:
    "Чат-бот с заданной личностью (Сократ / Шерлок / др.). Помнит контекст, сохраняет диалоги, считает стоимость. В отдельном GitHub-репозитории.",
  weeks: [week05, week06, week07, week08],
  available: true,
};
