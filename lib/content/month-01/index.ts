import type { Month } from "../types";
import { week01 } from "./week-01";
import { week02 } from "./week-02";
import { week03 } from "./week-03";
import { week04 } from "./week-04";

export const month01: Month = {
  id: "month-01",
  number: 1,
  title: "Python с нуля до первого API-вызова",
  description:
    "Базовый Python — синтаксис, структуры данных, функции, классы, работа с файлами и HTTP. Без этого LLM-разработка невозможна.",
  goal:
    "К концу месяца ты пишешь Python-скрипт, который делает HTTP-запрос к API, парсит JSON и красиво выводит результат.",
  mainArtifact:
    "CLI-приложение Weather CLI: спрашивает у тебя город и показывает погоду через OpenWeather API. Лежит в GitHub.",
  weeks: [week01, week02, week03, week04],
  available: true,
};
