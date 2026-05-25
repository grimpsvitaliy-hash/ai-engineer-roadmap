import type { Month } from "../types";
import { week17 } from "./week-17";
import { week18 } from "./week-18";
import { week19 } from "./week-19";
import { week20 } from "./week-20";

export const month05: Month = {
  id: "month-05",
  number: 5,
  title: "Продакшн: FastAPI, Docker, деплой",
  description:
    "От «работает у меня на ноуте» к «живёт в интернете». FastAPI, async, Pydantic, Docker, streaming, кеширование, мониторинг, деплой.",
  goal:
    "К концу месяца у тебя есть задеплоенное приложение по публичному URL — не просто проект в репо, а реально работающий сервис.",
  mainArtifact:
    "Портфолио-проект #3: задеплоенное LLM-приложение (FastAPI + Docker + Streamlit) на Railway/Render с публичной ссылкой в README.",
  weeks: [week17, week18, week19, week20],
  available: true,
};
