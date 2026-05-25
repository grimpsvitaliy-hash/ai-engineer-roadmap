import type { Month } from "../types";
import { week09 } from "./week-09";
import { week10 } from "./week-10";
import { week11 } from "./week-11";
import { week12 } from "./week-12";

export const month03: Month = {
  id: "month-03",
  number: 3,
  title: "Prompt engineering и tool use",
  description:
    "Промптинг как ремесло: few-shot, CoT, structured prompting. Tool use и agent loop. Evals — как тестировать LLM. Первый портфолио-проект.",
  goal:
    "Знаешь техники промптинга, можешь дать LLM инструменты, тестируешь систему на числах. К концу — первый серьёзный проект в GitHub.",
  mainArtifact:
    "Портфолио-проект #1: Research Assistant — агент с search/fetch/notes tools, agent loop, evals и красивым README.",
  weeks: [week09, week10, week11, week12],
  available: true,
};
