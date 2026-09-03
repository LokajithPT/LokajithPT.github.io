"use client";
import { useEffect, useRef, useState } from "react";

type Entry = { type: "in" | "out"; text: string };

const FS: Record<string, string> = {
  "projects/gilma": `gilma — file sync — 4 variants
  repos: gilma, gilmaclientside, rustygilma, gilmacpp
  stack: Rust, C++17 · delta sync · SHA-256 · raw TCP sockets`,
  "projects/knotApp": `knotApp — personal knowledge graph
  repos: knotApp, knot, knotgo
  stack: Dart, Go · D3.js visualization`,
  "projects/lkey": `lkey — readable programming language
  repos: lkey, Lowkey
  stack: C++17, CMake · lexer → parser → interpreter`,
  "projects/leviathan": `leviathan — modular workspace
  repo: leviathan
  stack: Python, C · cli + server + game`,
  "README.md": `LokajithPT — backend dev in rust · arch linux · i3
  projects: gilma (4 variants), knotApp, lkey, leviathan
  tip: type 'help' for commands`,
};

const HELP = `available commands:
  help              show this
  ls [path]         list files (try: ls, ls projects)
  cat <file>        print file (try: cat README.md, cat projects/gilma)
  grep <pat> [file] search (try: grep rust, grep gilma projects/gilma)
  echo <text>       print text
  whoami            who are you
  uname -a          kernel info
  rustc --version   rust version
  cargo --version   cargo version
  neofetch          arch neofetch
  clear             clear terminal`;

function runCmd(input: string): string[] {
  const raw = input.trim();
  if (!raw) return [];
  const [cmd, ...args] = raw.split(/\s+/);

  // pipe support: "cat README.md | grep rust"
  if (raw.includes("|")) {
    const [left, right] = raw.split("|").map((s) => s.trim());
    const leftOut = runCmd(left).join("\n");
    const m = right.match(/^grep\s+(.+)/);
    if (m) {
      const pat = m[1].replace(/^["']|["']$/g, "");
      return leftOut
        .split("\n")
        .filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
    }
    return [leftOut];
  }

  switch (cmd) {
    case "help":
      return [HELP];
    case "clear":
      return ["__CLEAR__"];
    case "ls": {
      const p = args[0] || "";
      if (!p || p === "." || p === "./") return ["README.md  projects/"];
      if (p === "projects" || p === "projects/" || p === "projects/gilma" || p.startsWith("projects")) {
        if (p === "projects" || p === "projects/") return ["gilma  knotApp  lkey  leviathan"];
        const key = p.replace(/\/$/, "");
        if (FS[key]) return [FS[key].split("\n")[0]];
        return [`ls: cannot access '${p}': No such file or directory`];
      }
      return [`ls: cannot access '${p}': No such file or directory`];
    }
    case "cat": {
      const p = args[0];
      if (!p) return ["cat: missing operand"];
      const content = FS[p] || FS[p.replace(/\/$/, "")];
      if (content) return [content];
      if (p === "README.md" || p === "./README.md") return [FS["README.md"]];
      return [`cat: ${p}: No such file or directory`];
    }
    case "grep": {
      if (args.length === 0) return ["grep: missing pattern"];
      const pat = args[0].replace(/^["']|["']$/g, "");
      const file = args[1];
      const search = (text: string) =>
        text
          .split("\n")
          .filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
      if (file) {
        const content = FS[file] || FS[file.replace(/\/$/, "")];
        if (!content) return [`grep: ${file}: No such file or directory`];
        const res = search(content);
        return res.length ? res : ["(no matches)"];
      }
      // grep without file: search all FS + projects
      const all = Object.entries(FS)
        .flatMap(([k, v]) => v.split("\n").map((l) => `${k}: ${l}`))
        .filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
      return all.length ? all : ["(no matches)"];
    }
    case "echo":
      return [args.join(" ")];
    case "whoami":
      return ["lokajith"];
    case "uname":
      return ["Linux arch 6.10.3-arch1-1 #1 SMP PREEMPT x86_64 GNU/Linux"];
    case "rustc":
      if (args[0] === "--version") return ["rustc 1.85.0 (stable) — backend · arch btw"];
      return ["rustc: try 'rustc --version'"];
    case "cargo":
      if (args[0] === "--version") return ["cargo 1.85.0"];
      return ["cargo: try 'cargo --version'"];
    case "neofetch": {
      return [
`                   -\\` 
+ "                 .o+`",
`                \`ooo/`,
`               \`+oooo:`,
`              \`+oooooo:`,
`              -+oooooo+:`,
`            \`/:-:++oooo+:`,
`           \`/++++/+++++++:`,
`          \`/++++++++++++++:`,
`         \`/+++ooooooooooooo/\``,
`lokajith@arch`,
`───────────────`,
`OS: Arch Linux x86_64`,
`Kernel: 6.10.3-arch1-1`,
`WM: i3   Shell: zsh`,
`Role: backend dev · rust`,
`Projects: gilma · knotApp · lkey · leviathan`,
      ];
    }
    case "pwd":
      return ["/home/lokajith"];
    case "cowsay": {
      const msg = args.join(" ") || "btw i use arch";
      return [` < ${msg} >`, "  \\   ^__^", "   \\  (oo)\\_______", "      (__)\\       )\\/\\", "          ||----w |", "          ||     ||"];
    }
    default:
      return [`zsh: command not found: ${cmd} — type 'help'`];
  }
}

export default function Terminal() {
  const [history, setHistory] = useState<Entry[]>([
    { type: "out", text: "arch terminal — type 'help' to start · try: ls, cat README.md, grep rust, neofetch" },
  ]);
  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  }, [history]);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed && input === "") return;
    // keep cmd history for up/down
    if (trimmed) setCmdHistory((h) => [...h, trimmed]);
    setHistIdx(null);

    const outLines = runCmd(trimmed === "" ? "" : input);
    if (outLines[0] === "__CLEAR__") {
      setHistory([]);
      setInput("");
      return;
    }
    setHistory((h) => [
      ...h,
      { type: "in", text: input },
      ...outLines.flatMap((l) => l.split("\n")).map((t) => ({ type: "out" as const, text: t })),
    ]);
    setInput("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-zinc-500">lokajith@arch: ~ — interactive</span>
          <span className="ml-auto hidden sm:inline font-mono text-[10px] text-zinc-600">zsh · grep · cat · ls · neofetch</span>
        </div>

        <div
          ref={boxRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[280px] overflow-y-auto bg-black p-4 font-mono text-xs leading-5 cursor-text sm:h-[300px]"
        >
          {history.map((e, i) => (
            <div key={i} className={e.type === "in" ? "text-zinc-100" : "text-zinc-400 whitespace-pre-wrap"}>
              {e.type === "in" ? (
                <span>
                  <span className="text-emerald-400">➜</span> <span className="text-[#1793D1]">~</span> <span>{e.text}</span>
                </span>
              ) : (
                e.text
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <span className="text-emerald-400">➜</span>
            <span className="text-[#1793D1]">~</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (cmdHistory.length === 0) return;
                  const next = histIdx === null ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
                  setHistIdx(next);
                  setInput(cmdHistory[next]);
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (histIdx === null) return;
                  const next = histIdx + 1;
                  if (next >= cmdHistory.length) {
                    setHistIdx(null);
                    setInput("");
                  } else {
                    setHistIdx(next);
                    setInput(cmdHistory[next]);
                  }
                }
                if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  setHistory([]);
                }
              }}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
              placeholder="type help, ls, cat README.md, grep rust..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-zinc-900 bg-zinc-950 px-3 py-2">
          {[
            "help",
            "ls projects",
            "cat README.md",
            "grep rust",
            "neofetch",
            "clear",
          ].map((c) => (
            <button
              key={c}
              onClick={() => {
                setInput(c);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-400 hover:border-zinc-700 hover:text-white"
            >
              {c}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[10px] text-zinc-600 sm:inline">↑↓ history · ctrl+l clear · pipe: cat README.md | grep rust</span>
        </div>
      </div>
    </div>
  );
}
