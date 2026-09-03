import Boot from "./Boot";
import Terminal from "./Terminal";

type Project = {
  name: string;
  tagline: string;
  desc: string;
  lang: string[];
  color: string;
  links: { label: string; href: string }[];
  features: string[];
  status: string;
};

const projects: Project[] = [
  {
    name: "gilma",
    tagline: "file sync — 4 variants",
    desc: "Minimal file sync — delta sync, hash-verified. Same protocol, four implementations. Raw TCP, no frameworks, no magic.",
    lang: ["Rust", "C++17"],
    color: "#1793D1",
    status: "4 versions",
    features: ["delta sync + SHA-256 verify", "raw TCP sockets, zero deps", "manifest-based multi-project sync"],
    links: [
      { label: "gilma", href: "https://github.com/LokajithPT/gilma" },
      { label: "gilmaclientside", href: "https://github.com/LokajithPT/gilmaclientside" },
      { label: "rustygilma", href: "https://github.com/LokajithPT/rustygilma" },
      { label: "gilmacpp", href: "https://github.com/LokajithPT/gilmacpp" },
    ],
  },
  {
    name: "knotApp",
    tagline: "personal knowledge graph",
    desc: "Personal knowledge graph — tie your ideas together. CLI + visualization with D3.js. Three implementations and counting.",
    lang: ["Dart", "Go"],
    color: "#ffbd2e",
    status: "in progress",
    features: ["knowledge graph core", "D3.js visualization", "CLI + app variants"],
    links: [
      { label: "knotApp", href: "https://github.com/LokajithPT/knotApp" },
      { label: "knot", href: "https://github.com/LokajithPT/knot" },
      { label: "knotgo", href: "https://github.com/LokajithPT/knotgo" },
    ],
  },
  {
    name: "lkey",
    tagline: "lowkey — a readable programming language",
    desc: "A simple, readable programming language. `var name is \"Alice\"` and `say \"hello\"`. Lexer → Parser → Interpreter, hand-rolled in C++.",
    lang: ["C++17", "CMake"],
    color: "#7c5cff",
    status: "32 commits",
    features: ["word-operators: plus / minus / into / div", "how to add with a, b so ... thats how", "classes, loops, questions"],
    links: [
      { label: "lkey", href: "https://github.com/LokajithPT/lkey" },
      { label: "Lowkey (python proto)", href: "https://github.com/LokajithPT/Lowkey" },
    ],
  },
  {
    name: "leviathan",
    tagline: "modular workspace",
    desc: "CLI, server, game and mobile experiments — modular tools and prototypes in one workspace.",
    lang: ["Python", "C"],
    color: "#00d9a5",
    status: "active",
    features: ["cli.py + cli.c — CLI", "serv.py server core", "game / templates / windows"],
    links: [{ label: "leviathan", href: "https://github.com/LokajithPT/leviathan" }],
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-zinc-100">
      <Boot />
      {/* grid bg */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-zinc-900/20 via-transparent to-transparent" />

      {/* INTERACTIVE TERMINAL — top */}
      <Terminal />

      {/* NAV — arch style */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0a0a0a]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2 font-mono text-sm tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#1793D1] text-white font-bold">A</span>
            <span className="font-semibold">LokajithPT</span>
            <span className="hidden sm:inline text-zinc-500">/ arch · rust</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-[11px] text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              i3 / arch
            </span>
            <a
              href="https://github.com/LokajithPT"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              ↗ github
            </a>
          </div>
        </div>
      </nav>

      {/* HERO — neofetch / terminal style */}
      <header className="mx-auto w-full max-w-6xl px-6 pt-10 pb-10 sm:pt-16 sm:pb-14">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
          {/* terminal bar */}
          <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-xs text-zinc-500">lokajith@arch: ~</span>
            <span className="ml-auto font-mono text-[10px] text-zinc-600">zsh · 6.10.3-arch1-1</span>
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            {/* arch ascii */}
            <pre className="select-none text-[8px] leading-[8px] text-[#1793D1] sm:text-[9px] sm:leading-[9px]">
{`                  -\`
                 .o+\`
                \`ooo/
               \`+oooo:
              \`+oooooo:
              -+oooooo+:
            \`/:-:++oooo+:
           \`/++++/+++++++:
          \`/++++++++++++++:
         \`/+++ooooooooooooo/\`
        ./ooosssso++osssssso+\`
       .oos\`soooooo\`ossssss+o/\`
      -osss \`sooooo\`osssssssso/\`
     :ossss \`sooooo\`ossssssssss/\`
    /ossss  \`sooooo\`ossssssssssss/\`
   :ossss   \`sooooo\`osssssssssso
  /ossss    \`soooo\` ossssssso
 /ossss     \`sooo\`  osssso
:ossss       \`so\`   ossso
/ossso         \`.     \`/os
\`ossso\`              \`/oss
 \`osso\`              \`/oss\``}
            </pre>

            {/* neofetch info */}
            <div className="font-mono text-xs leading-6">
              <p>
                <span className="text-[#1793D1]">lokajith</span>
                <span className="text-zinc-600">@</span>
                <span className="text-[#1793D1]">arch</span>
              </p>
              <p className="text-zinc-600">───────────────</p>
              <p>
                <span className="text-[#1793D1] font-bold">OS:</span> <span className="text-zinc-300">Arch Linux x86_64</span>
              </p>
              <p>
                <span className="text-[#1793D1] font-bold">Kernel:</span> <span className="text-zinc-300">6.10.3-arch1-1</span>
              </p>
              <p>
                <span className="text-[#1793D1] font-bold">WM:</span> <span className="text-zinc-300">i3</span>
              </p>
              <p>
                <span className="text-[#1793D1] font-bold">Shell:</span> <span className="text-zinc-300">zsh</span>
              </p>
              <p>
                <span className="text-[#1793D1] font-bold">Role:</span> <span className="text-zinc-300">backend dev · rust</span>
              </p>
              <p>
                <span className="text-[#1793D1] font-bold">Loves:</span> <span className="text-zinc-300">linux · systems · parsers · sockets</span>
              </p>
              <p className="mt-4 text-sm">
                <span className="text-white font-medium">making questionable decisions</span>
                <span className="text-zinc-500"> and </span>
                <span className="bg-white px-1 py-0.5 font-bold text-black">pushing to prod</span>
                <span className="text-zinc-500">.</span>
              </p>
              <p className="mt-2 flex gap-1.5">
                <span className="h-3 w-6 bg-[#1793D1]" />
                <span className="h-3 w-6 bg-zinc-800" />
                <span className="h-3 w-6 bg-white" />
                <span className="h-3 w-6 bg-zinc-600" />
              </p>
            </div>
          </div>

          {/* command line preview */}
          <div className="border-t border-zinc-900 bg-black px-6 py-3 font-mono text-xs">
            <span className="text-emerald-400">➜</span> <span className="text-[#1793D1]">~</span> <span className="text-zinc-500">cargo --version</span>
            <span className="ml-4 text-zinc-600">cargo 1.85.0</span>
            <span className="ml-6 hidden sm:inline text-zinc-700">|</span>
            <span className="ml-6 hidden sm:inline">
              <span className="text-emerald-400">➜</span> <span className="text-[#1793D1]">~</span> <span className="text-zinc-500">ls projects/</span>
              <span className="ml-2 text-zinc-300">gilma/ knotApp/ lkey/ leviathan/</span>
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            view projects ↓
          </a>
          <a
            href="https://github.com/LokajithPT?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.53 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            all repos
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs text-zinc-500">
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">rust</span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">arch linux</span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">systems</span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">tcp sockets</span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">parsers</span>
        </div>
      </header>

      {/* PROJECTS */}
      <section id="projects" className="mx-auto w-full max-w-6xl px-6 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">projects</h2>
          <span className="hidden font-mono text-xs text-zinc-600 sm:inline">rust · linux · built from scratch</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((p) => (
            <article
              key={p.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur transition hover:border-zinc-700 hover:bg-zinc-900/60"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-60" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20 transition group-hover:opacity-30" style={{ background: p.color }} />

              <div className="relative p-6 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-medium tracking-widest text-zinc-500" style={{ color: p.color }}>
                    ● {p.status}
                  </span>
                  <span className="flex gap-1.5">
                    {p.lang.map((l) => (
                      <span key={l} className="rounded-full border border-zinc-800 bg-black px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-400">
                        {l}
                      </span>
                    ))}
                  </span>
                </div>

                <h3 className="font-mono text-2xl font-black tracking-tighter text-white">{p.name}</h3>
                <p className="font-mono text-xs tracking-wide text-zinc-500">{p.tagline}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{p.desc}</p>

                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 font-mono text-xs leading-5 text-zinc-500">
                      <span className="text-zinc-700">›</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 border-t border-zinc-800/80 bg-black/30 p-4">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                  >
                    {l.label} <span className="text-zinc-600">↗</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* extra repos strip */}
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">more on github</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["rustybun", "private — in progress", "https://github.com/LokajithPT/rustybun"],
              ["mytutor", "tutor platform", "https://github.com/LokajithPT/mytutor"],
            ].map(([name, desc, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-black px-3 py-1.5 transition hover:border-zinc-700"
              >
                <span className="font-mono text-xs font-semibold text-zinc-200 group-hover:text-white">{name}</span>
                <span className="hidden text-xs text-zinc-600 sm:inline">— {desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / MANIFESTO */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-white p-6 text-black md:col-span-3">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">manifesto — backend brain</p>
            <p className="mt-3 text-lg font-semibold leading-7">backend dev in rust. linux is home. arch is the way.</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              i build systems-level tools — file sync over raw sockets, language frontends from scratch, knowledge graphs that actually link. no heavy frameworks. just rust, c++, and a terminal that never closes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
              <span className="rounded-full bg-[#1793D1] px-3 py-1 text-white">btw i use arch</span>
              <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-700">rust &gt; everything</span>
              <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-700">linux-first</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">stack</p>
              <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
                {["Rust", "C++17", "Linux / Arch", "TCP / Sockets", "Cargo / CMake", "Python", "Tokio / Async", "Git / GH Actions"].map((s) => (
                  <span key={s} className="rounded-lg border border-zinc-800 bg-black px-3 py-2 text-zinc-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-500">currently</p>
              <p className="mt-3 font-mono text-sm leading-6 text-zinc-300">
                polishing gilma & lkey · building knotApp · writing more rust · always on linux
              </p>
              <a
                href="https://github.com/LokajithPT"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200"
              >
                view on github →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-zinc-800 bg-black">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-xs leading-5 text-zinc-500">
            <span className="font-semibold text-zinc-300">LokajithPT</span> © {new Date().getFullYear()} · built with next.js & tailwind.
            <br />
            <span className="text-zinc-600">arch linux · rust · i3 — btw i use arch</span>
            <br />
            <span className="mt-2 inline-block text-[11px] italic text-zinc-500">
              if u think this whole portfolio is vibe-coded — ur goddamn right cause i hate frontend.
            </span>
          </div>
          <div className="flex gap-3 font-mono text-xs">
            <a href="https://github.com/LokajithPT" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">
              github
            </a>
            <span className="text-zinc-800">/</span>
            <a href="#projects" className="text-zinc-500 hover:text-white">
              projects
            </a>
            <span className="text-zinc-800">/</span>
            <a href="https://github.com/LokajithPT/LokajithPT.github.io" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">
              source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
