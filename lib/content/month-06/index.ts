import type { Month } from "../types";
import { week21 } from "./week-21";
import { week22 } from "./week-22";
import { week23 } from "./week-23";
import { week24 } from "./week-24";
import { week25 } from "./week-25";
import { week26 } from "./week-26";

export const month06: Month = {
  id: "month-06",
  number: 6,
  title: "Агенты, портфолио polish и поиск работы",
  description:
    "Финальный месяц: паттерны агентов, полировка главного проекта, резюме, GitHub, LinkedIn, стратегия поиска, собеседования, ретроспектива.",
  goal:
    "К концу — оффер или близко к нему. Главное — система: ежедневные отклики, фидбек, ретроспектива.",
  mainArtifact:
    "Junior/middle оффер AI Engineer. Резюме на 1 страницу. Чистый GitHub. Опубликованная ретроспектива 6 месяцев.",
  weeks: [week21, week22, week23, week24, week25, week26],
  available: true,
};
