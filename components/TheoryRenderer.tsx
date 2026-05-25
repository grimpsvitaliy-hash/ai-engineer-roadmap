"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { TheoryBlock, TheorySection } from "@/lib/content/types";
import { Callout } from "@/components/ui/callout";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getLessonProgress, markTheoryRead } from "@/lib/progress";

function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

function BlockRenderer({ block }: { block: TheoryBlock }) {
  switch (block.type) {
    case "text":
      return <Markdown>{block.content}</Markdown>;
    case "code":
      return (
        <div className="my-4">
          <Markdown>{`\`\`\`${block.language}\n${block.content}\n\`\`\``}</Markdown>
          {block.caption && (
            <div className="-mt-2 px-1 text-xs italic text-muted-foreground">
              {block.caption}
            </div>
          )}
        </div>
      );
    case "callout":
      return (
        <Callout variant={block.variant} title={block.title}>
          <Markdown>{block.content}</Markdown>
        </Callout>
      );
    case "resources":
      return (
        <div className="my-4 grid gap-2 sm:grid-cols-2">
          {block.items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-surface p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-tight group-hover:text-primary">
                    {item.title}
                  </div>
                  {item.description && (
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      );
  }
}

export function TheoryRenderer({
  sections,
  lessonId,
}: {
  sections: TheorySection[];
  lessonId: string;
}) {
  const [readSections, setReadSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const p = getLessonProgress(lessonId);
    setReadSections(new Set(p.theorySectionsRead));
  }, [lessonId]);

  function markRead(sectionId: string) {
    const p = markTheoryRead(lessonId, sectionId);
    setReadSections(new Set(p.lessons[lessonId]?.theorySectionsRead ?? []));
  }

  return (
    <div className="space-y-10">
      {sections.map((section, idx) => {
        const isRead = readSections.has(section.id);
        return (
          <section key={section.id} className="space-y-3 fade-in-up">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-semibold tabular-nums transition-colors ${
                    isRead
                      ? "bg-success/15 text-success"
                      : "bg-theory/10 text-theory"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  {section.title}
                </h2>
                {section.estimatedMinutes > 0 && (
                  <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    ~{section.estimatedMinutes} мин
                  </span>
                )}
              </div>
              {isRead ? (
                <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
                  <Check className="h-3 w-3" /> прочитано
                </span>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => markRead(section.id)}>
                  Отметить
                </Button>
              )}
            </div>
            <div className="space-y-1 pl-11">
              {section.blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
