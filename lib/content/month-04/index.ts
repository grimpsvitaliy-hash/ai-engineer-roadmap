import type { Month } from "../types";
import { week13 } from "./week-13";
import { week14 } from "./week-14";
import { week15 } from "./week-15";
import { week16 } from "./week-16";

export const month04: Month = {
  id: "month-04",
  number: 4,
  title: "RAG — Retrieval-Augmented Generation",
  description:
    "Главный коммерческий навык: научи LLM отвечать по твоим документам. Embeddings, vector DB, chunking, pipeline, продвинутые техники.",
  goal:
    "Можешь построить production-grade RAG end-to-end: от документа до задеплоенного приложения с цитированием источников и измеренными метриками.",
  mainArtifact:
    "Портфолио-проект #2: RAG-ассистент по корпусу документов. Streamlit UI, опц. задеплоен. README с таблицей «было → стало» по эвалам.",
  weeks: [week13, week14, week15, week16],
  available: true,
};
