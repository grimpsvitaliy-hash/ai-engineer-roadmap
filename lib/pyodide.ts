"use client";

const PYODIDE_VERSION = "0.26.4";
const CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string; stdout?: (msg: string) => void; stderr?: (msg: string) => void }) => Promise<PyodideInterface>;
  }
}

export type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdin: (config: { stdin: () => string | null }) => void;
  globals: {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown;
  };
};

let pyodidePromise: Promise<PyodideInterface> | null = null;
let activeStdout: ((msg: string) => void) | null = null;
let activeStderr: ((msg: string) => void) | null = null;
let activeStdin: (() => string | null) | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export async function getPyodide(): Promise<PyodideInterface> {
  if (typeof window === "undefined") {
    throw new Error("Pyodide can only run in the browser");
  }
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScript(`${CDN_URL}pyodide.js`);
      if (!window.loadPyodide) {
        throw new Error("Pyodide failed to attach to window");
      }
      const py = await window.loadPyodide({
        indexURL: CDN_URL,
        stdout: (msg: string) => activeStdout?.(msg),
        stderr: (msg: string) => activeStderr?.(msg),
      });
      py.setStdin({ stdin: () => activeStdin?.() ?? null });
      return py;
    })();
  }
  return pyodidePromise;
}

export type RunResult = {
  output: string;
  error: string | null;
};

function makeStdinFromQueue(queue: string[]): () => string | null {
  let idx = 0;
  return () => {
    if (idx >= queue.length) return null;
    return queue[idx++];
  };
}

export async function runPython(
  code: string,
  options: { stdinLines?: string[] } = {},
): Promise<RunResult> {
  const lines: string[] = [];
  const errors: string[] = [];

  const py = await getPyodide();

  activeStdout = (msg: string) => lines.push(msg);
  activeStderr = (msg: string) => errors.push(msg);
  activeStdin = makeStdinFromQueue(options.stdinLines ?? []);

  try {
    await py.runPythonAsync(code);
    return {
      output: lines.join("\n"),
      error: errors.length > 0 ? errors.join("\n") : null,
    };
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    return {
      output: lines.join("\n"),
      error: errMsg,
    };
  } finally {
    activeStdout = null;
    activeStderr = null;
    activeStdin = null;
  }
}

export function extractInputPrompts(code: string): string[] {
  const regex = /input\s*\(\s*["']([^"']*)["']\s*\)/g;
  const prompts: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    prompts.push(match[1]);
  }
  return prompts;
}
