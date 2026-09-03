"use client";
import { useEffect, useRef, useState } from "react";

type Entry = { type: "in" | "out"; text: string };
type FSEntry = { type: "dir" | "file"; content?: string; owner?: string; perms?: string };

const USER_ENC = "VmpJd2VFNUhSa2RpTTNCclVrVmFjVlJYZUdGT1ZtUkZVMnM1YTJKVmJEVmFWV1JoWVZkS1YxZHFWbGhoTVdzeFdYcEtTbVZYVWtoaFIyaHBWak5rTTFkV1ZscE9SVEI0WTBoR1ZXSlhhRkZXYWtaWFRsWmtWVlJZWkZGVlZEQTU=";
const ROOT_ENC = "VmpJd2VFNUhSa2RpTTNCclUwZDRjRlJYY0hKa01XUkZWRzFHYWxKdGVEQldiVEZoVjJzeGNXSklTbGhpUjFKVVYyMTRjMWRXVG5SalIyaFRZVzEzZDFZeFdtOVVNREZIWWtaa1VGSkdXbUZaVjNSM1kxWlNWMXBHY0U5U2JYaGFWRlZSZDFCUlBUMD0=";
function d5(s: string): string {
  let o = s;
  for (let i = 0; i < 5; i++) {
    try {
      o = (globalThis as any).atob ? (globalThis as any).atob(o) : Buffer.from(o, "base64").toString("utf-8");
    } catch {
      o = Buffer.from(o, "base64").toString("utf-8");
    }
  }
  return o;
}
const USER_FLAG = d5(USER_ENC);
const ROOT_FLAG = d5(ROOT_ENC);

const initialFS: Record<string, FSEntry> = {
  "/": { type: "dir" },
  "/home": { type: "dir" },
  "/home/lokajith": { type: "dir" },
  "/home/lokajith/README.md": {
    type: "file",
    content: `LokajithPT — backend dev in rust · arch linux · i3\nprojects: gilma (4 variants), knotApp, lkey, leviathan\ntip: type 'help' for commands`,
  },
  "/home/lokajith/user.txt": {
    type: "file",
    content: `hi if i typed "ls" and u were able to open this file then u are so cool . and so am i . so i have a userflag in here and also a root flag in here ... try to find it ... if u do it u will get my number and if u send me the flag then i will not give u any money . atleast ill know there are more nerds like me\n\n${USER_FLAG}\n\n— lokajith`,
  },
  "/home/lokajith/root.txt": { type: "file", content: ROOT_FLAG, owner: "root", perms: "600" },
  "/home/lokajith/projects": { type: "dir" },
  "/home/lokajith/projects/gilma": {
    type: "file",
    content: `gilma — file sync — 4 variants\nrepos: gilma, gilmaclientside, rustygilma, gilmacpp\nstack: Rust, C++17 · delta sync · SHA-256 · raw TCP sockets`,
  },
  "/home/lokajith/projects/knotApp": {
    type: "file",
    content: `knotApp — personal knowledge graph\nrepos: knotApp, knot, knotgo\nstack: Dart, Go · D3.js visualization`,
  },
  "/home/lokajith/projects/lkey": {
    type: "file",
    content: `lkey — readable programming language\nrepos: lkey, Lowkey\nstack: C++17, CMake · lexer → parser → interpreter`,
  },
  "/home/lokajith/projects/leviathan": {
    type: "file",
    content: `leviathan — modular workspace\nrepo: leviathan\nstack: Python, C · cli + server + game`,
  },
  "/etc": { type: "dir" },
  "/etc/os-release": {
    type: "file",
    content: `NAME="Arch Linux"\nPRETTY_NAME="Arch Linux"\nID=arch\nBUILD_ID=rolling\nVERSION_ID="2026-09-03"\nHOME_URL="https://archlinux.org/"`,
  },
  "/etc/hostname": { type: "file", content: `arch` },
  "/proc": { type: "dir" },
  "/proc/cpuinfo": {
    type: "file",
    content: `processor : 0\nmodel name : AMD Ryzen 7 7840U\ncpu cores : 8\nflags : fpu vme sse sse2 ht vmx`,
  },
  "/root": { type: "dir", owner: "root", perms: "700" },
  "/root/root.txt": { type: "file", content: ROOT_FLAG, owner: "root", perms: "600" },
  "/tmp": { type: "dir" },
};

const HELP = `arch terminal — all commands actually work (stateful cwd, real fs):

  ─ ctf ─
  ls [path] [-a/-l]    list files (ls, ls -la, ls projects)
  cat <file>           cat README.md, cat user.txt, cat /etc/os-release
  grep <pat> [file]    grep rust, grep flag user.txt
  find <path> -name <f> find . -name user.txt
  sudo -l              check sudo perms
  sudo <cmd>           run as root (see sudo -l)
  id                   uid/gid

  ─ filesystem (stateful) ─
  pwd                  print working dir
  cd <dir>             change dir (cd, cd .., cd /tmp)
  mkdir [-p] <dir>     make dir (mkdir pwn, mkdir -p a/b)
  touch <file>         create empty file
  rm [-r/-f] <path>    remove file/dir
  rmdir <dir>          remove empty dir
  cp <src> <dst>       copy
  mv <src> <dst>       move/rename
  chmod <mode> <file>  chmod (mock)
  echo <text> > <file> write file (echo hi > /tmp/x)
  tree [path]          tree view
  lsblk                block devices

  ─ arch / system ─
  neofetch             arch neofetch
  uname [-a]           kernel info
  whoami               user
  env / printenv       env vars
  history              command history
  clear                clear screen
  iwctl                iwd wireless (iwctl station list)
  journalctl [-b]      systemd logs
  systemctl <arg>      systemctl status
  ip [a/link]          ip a, ip link
  pacman [-Q/-Qs]      pacman -Q, pacman -Qs rust
  df [-h]              disk usage
  du [-sh]             du -sh .
  free [-h]            memory
  ps [aux]             processes
  htop / top           htop
  lspci / lsusb / dmesg
  git status/log       git
  curl / ping / echo

  ─ dev ─
  vim [file]           vim edit (vim user.txt, :!sh for shell)
  nvim [file]          neovim (same as vim)
  rustc --version      rust version
  cargo --version      cargo version
  cargo new <name>     create rust project`;

function normalize(p: string): string {
  if (!p.startsWith("/")) p = "/" + p;
  const parts = p.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return "/" + stack.join("/");
}

function resolve(cwd: string, input: string): string {
  if (!input || input === ".") return cwd;
  if (input.startsWith("/")) return normalize(input);
  if (input.startsWith("~/")) return normalize("/home/lokajith/" + input.slice(2));
  if (input === "~") return "/home/lokajith";
  return normalize(cwd + "/" + input);
}

export default function Terminal() {
  const [history, setHistory] = useState<Entry[]>([
    { type: "out", text: "arch terminal — ctf mode — type 'ls' to start · user.txt is waiting · try iwctl, journalctl, systemctl" },
  ]);
  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cwd, setCwd] = useState("/home/lokajith");
  const [fs, setFs] = useState<Record<string, FSEntry>>(() => ({ ...initialFS }));
  const [pager, setPager] = useState<null | { asRoot: boolean; src: string; file?: string }>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history, pager]);

  const listDir = (dir: string): string[] => {
    const prefix = dir === "/" ? "/" : dir + "/";
    const seen = new Set<string>();
    for (const key of Object.keys(fs)) {
      if (key === dir) continue;
      if (key.startsWith(prefix)) {
        const rest = key.slice(prefix.length);
        const name = rest.split("/")[0];
        if (name) seen.add(name);
      }
    }
    return Array.from(seen).sort();
  };

  const isDir = (p: string) => fs[p]?.type === "dir";
  const isFile = (p: string) => fs[p]?.type === "file";

  const handlePagerInput = (raw: string): string[] => {
    const cmd = raw.trim();
    const isVim = pager?.src === "vim";
    if (cmd === "q" || cmd === ":q" || cmd === ":q!" || cmd === "quit" || cmd === "exit" || cmd === ":quit") {
      setPager(null);
      return [isVim ? `"${pager?.src}" quit — back to shell` : "(less) quit — back to shell"];
    }
    if (cmd === ":w" || cmd === ":write") {
      return [isVim ? `"${pager?.src}" written (mock)` : "less: no write"];
    }
    if (cmd === ":wq" || cmd === ":x") {
      setPager(null);
      return [isVim ? `written and quit` : "(less) quit"];
    }
    if (cmd === "!/bin/sh" || cmd === "!sh" || cmd === "!/bin/bash" || cmd === "!bash" || cmd === ":!/bin/sh" || cmd === ":!sh" || cmd === ":!bash") {
      if (pager?.asRoot) {
        setPager(null);
        return [`# id`, `uid=0(root) gid=0(root) groups=0(root)`, ``, ROOT_FLAG, ``];
      }
      setPager(null);
      return ["$ id", "uid=1000(lokajith) gid=1000(lokajith) — not root"];
    }
    if (cmd.startsWith("!cat ") || cmd.startsWith(":!cat ")) {
      const f = cmd.replace(/^:?!cat\s+/, "").trim();
      const abs = resolve(pager?.asRoot ? "/root" : cwd, f);
      const target = f.includes("root.txt") ? "/root/root.txt" : abs;
      if (f.includes("root.txt") && !pager?.asRoot) return ["cat: " + f + ": Permission denied"];
      const e = fs[target] || fs[f];
      return e?.content ? [e.content] : [`cat: ${f}: No such file or directory`];
    }
    if (cmd.startsWith(":e ")) {
      const f = cmd.slice(3).trim();
      if (f.includes("root.txt") && pager?.asRoot) return [fs["/root/root.txt"]?.content || ROOT_FLAG];
      if (f.includes("root.txt") && !pager?.asRoot) return ["Permission denied"];
      const abs = resolve(cwd, f);
      const e = fs[abs] || fs[f];
      return e?.content ? [e.content] : [`${f} — no such file`];
    }
    if (cmd === "h" || cmd === "help" || cmd === ":help") return [isVim ? "vim help: :q=:quit :w=:write :wq=:save/quit :!/bin/sh=:shell" : "less help: q=:quit  !/bin/sh=:shell  h=:help"];
    return [`(${isVim ? "vim" : "less"}) unknown command '${cmd}'`];
  };

  const runCmd = (rawInput: string, hist: string[]): string[] => {
    const raw = rawInput.trim();
    if (!raw) return [];

    if (raw.startsWith("echo ") && raw.includes(" >")) {
      const isAppend = raw.includes(" >> ");
      const sep = isAppend ? " >> " : " > ";
      const [left, filePart] = raw.split(sep).map((s) => s.trim());
      const text = left.slice(5).trim().replace(/^["']|["']$/g, "");
      const targetRaw = filePart.split(" ")[0];
      const abs = resolve(cwd, targetRaw);
      setFs((prev) => {
        const next = { ...prev };
        const existing = next[abs];
        if (isAppend && existing?.type === "file") next[abs] = { type: "file", content: (existing.content || "") + "\n" + text };
        else next[abs] = { type: "file", content: text };
        const dir = abs.split("/").slice(0, -1).join("/") || "/";
        if (!next[dir]) next[dir] = { type: "dir" };
        return next;
      });
      return [];
    }

    if (raw.includes("|")) {
      const [left, right] = raw.split("|").map((s) => s.trim());
      const leftOut = runCmd(left, hist).join("\n");
      const m = right.match(/^grep\s+(.+)/);
      if (m) {
        const pat = m[1].replace(/^["']|["']$/g, "");
        return leftOut.split("\n").filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
      }
      return [leftOut];
    }

    const [cmd, ...args] = raw.split(/\s+/);

    switch (cmd) {
      case "help":
        return [HELP];
      case "clear":
        return ["__CLEAR__"];
      case "pwd":
        return [cwd];
      case "cd": {
        const targetRaw = args[0] || "/home/lokajith";
        const abs = resolve(cwd, targetRaw);
        if (!fs[abs]) return [`bash: cd: ${targetRaw}: No such file or directory`];
        if (fs[abs].type !== "dir") return [`bash: cd: ${targetRaw}: Not a directory`];
        if (abs === "/root" && fs["/root"].owner === "root") return [`bash: cd: ${targetRaw}: Permission denied`];
        setCwd(abs);
        return [];
      }
      case "ls": {
        const flags = args.filter((a) => a.startsWith("-")).join("");
        const pathArg = args.find((a) => !a.startsWith("-")) || "";
        const abs = pathArg ? resolve(cwd, pathArg) : cwd;
        const entry = fs[abs];
        if (!entry) return [`ls: cannot access '${pathArg}': No such file or directory`];
        if (entry.type === "file") return [abs.split("/").pop()!];
        if (abs === "/root") return ["ls: cannot open directory '/root': Permission denied"];
        const names = listDir(abs);
        if (flags.includes("l")) {
          return names
            .map((n) => {
              const p = abs === "/" ? `/${n}` : `${abs}/${n}`;
              const e = fs[p];
              const isD = e?.type === "dir";
              const perms = isD ? "drwxr-xr-x" : e?.perms === "600" ? "-rw-------" : "-rw-r--r--";
              const owner = e?.owner === "root" ? "root     root" : "lokajith lokajith";
              const size = e?.type === "file" ? String(e.content?.length || 0) : "4096";
              return `${perms} 1 ${owner} ${size} Sep 3 09:16 ${n}${isD ? "/" : ""}`;
            })
            .join("\n")
            .split("\n");
        }
        if (names.length === 0) return [""];
        return [names.join("  ") + (abs === cwd ? "" : "")];
      }
      case "tree": {
        const pRaw = args[0] || cwd;
        const abs = resolve(cwd, pRaw);
        if (!fs[abs] || fs[abs].type !== "dir") return [`tree: ${pRaw}: No such file or directory`];
        const walk = (dir: string, prefix: string): string[] => {
          const names = listDir(dir);
          return names.flatMap((n, i) => {
            const p = dir === "/" ? `/${n}` : `${dir}/${n}`;
            const isLast = i === names.length - 1;
            const e = fs[p];
            const line = `${prefix}${isLast ? "└── " : "├── "}${n}${e?.type === "dir" ? "/" : ""}`;
            if (e?.type === "dir") return [line, ...walk(p, prefix + (isLast ? "    " : "│   "))];
            return [line];
          });
        };
        return [abs + "\n" + walk(abs, "").join("\n")];
      }
      case "cat": {
        const pRaw = args[0];
        if (!pRaw) return ["cat: missing operand"];
        const abs = resolve(cwd, pRaw);
        if (abs === "/root/root.txt" || abs === "/home/lokajith/root.txt") {
          return ["cat: " + pRaw + ": Permission denied — you are not root. try 'sudo -l'"];
        }
        const e = fs[abs];
        if (e?.type === "file" && e.content !== undefined) return [e.content];
        if (fs[pRaw]?.content) return [fs[pRaw].content!];
        return [`cat: ${pRaw}: No such file or directory`];
      }
      case "mkdir": {
        const hasP = args.includes("-p");
        const dirs = args.filter((a) => !a.startsWith("-"));
        if (dirs.length === 0) return ["mkdir: missing operand"];
        for (const d of dirs) {
          const abs = resolve(cwd, d);
          if (hasP) {
            const parts = abs.split("/").filter(Boolean);
            let cur = "";
            for (const part of parts) {
              cur += "/" + part;
              if (!fs[cur]) setFs((prev) => ({ ...prev, [cur]: { type: "dir" } }));
            }
          } else {
            const parent = abs.split("/").slice(0, -1).join("/") || "/";
            if (!fs[parent]) return [`mkdir: cannot create directory ‘${d}’: No such file or directory`];
            setFs((prev) => ({ ...prev, [abs]: { type: "dir" } }));
          }
        }
        // sync update for immediate ls
        const newFs = { ...fs };
        for (const d of dirs) {
          const abs = resolve(cwd, d);
          if (hasP) {
            const parts = abs.split("/").filter(Boolean);
            let cur = "";
            for (const part of parts) {
              cur += "/" + part;
              if (!newFs[cur]) newFs[cur] = { type: "dir" };
            }
          } else newFs[abs] = { type: "dir" };
        }
        setFs(newFs);
        return [];
      }
      case "touch": {
        const pRaw = args[0];
        if (!pRaw) return ["touch: missing file operand"];
        const abs = resolve(cwd, pRaw);
        const dir = abs.split("/").slice(0, -1).join("/") || "/";
        if (!fs[dir]) return [`touch: cannot touch '${pRaw}': No such file or directory`];
        setFs((prev) => ({ ...prev, [abs]: prev[abs] || { type: "file", content: "" } }));
        return [];
      }
      case "rm": {
        const flags = args.filter((a) => a.startsWith("-")).join("");
        const targets = args.filter((a) => !a.startsWith("-"));
        if (targets.length === 0) return ["rm: missing operand"];
        for (const t of targets) {
          const abs = resolve(cwd, t);
          const e = fs[abs];
          if (!e) {
            if (flags.includes("f")) continue;
            return [`rm: cannot remove '${t}': No such file or directory`];
          }
          if (e.type === "dir" && !flags.includes("r")) return [`rm: cannot remove '${t}': Is a directory`];
          if (abs === "/root/root.txt" || abs === "/home/lokajith/root.txt") return [`rm: cannot remove '${t}': Permission denied`];
          // check dir not empty without -r
          if (e.type === "dir") {
            const children = Object.keys(fs).some((k) => k !== abs && k.startsWith(abs + "/"));
            if (children && !flags.includes("r")) return [`rm: cannot remove '${t}': Directory not empty`];
          }
        }
        const toDelete = new Set<string>();
        for (const t of targets) {
          const abs = resolve(cwd, t);
          for (const k of Object.keys(fs)) if (k === abs || k.startsWith(abs + "/")) toDelete.add(k);
        }
        setFs((prev) => {
          const next = { ...prev };
          for (const k of toDelete) delete next[k];
          return next;
        });
        return [];
      }
      case "rmdir": {
        const pRaw = args[0];
        if (!pRaw) return ["rmdir: missing operand"];
        const abs = resolve(cwd, pRaw);
        const e = fs[abs];
        if (!e) return [`rmdir: failed to remove '${pRaw}': No such file or directory`];
        if (e.type !== "dir") return [`rmdir: failed to remove '${pRaw}': Not a directory`];
        const hasChildren = Object.keys(fs).some((k) => k !== abs && k.startsWith(abs + "/"));
        if (hasChildren) return [`rmdir: failed to remove '${pRaw}': Directory not empty`];
        setFs((prev) => {
          const next = { ...prev };
          delete next[abs];
          return next;
        });
        return [];
      }
      case "cp": {
        const [srcRaw, dstRaw] = args;
        if (!srcRaw || !dstRaw) return ["cp: missing file operand", "Try 'cp <src> <dst>'"];
        const src = resolve(cwd, srcRaw);
        const dst = resolve(cwd, dstRaw);
        const e = fs[src];
        if (!e) return [`cp: cannot stat '${srcRaw}': No such file or directory`];
        if (e.type === "dir") return [`cp: -r not specified; omitting directory '${srcRaw}'`];
        let finalDst = dst;
        if (fs[dst]?.type === "dir") finalDst = dst + "/" + src.split("/").pop();
        setFs((prev) => ({ ...prev, [finalDst]: { type: "file", content: e.content || "" } }));
        return [];
      }
      case "mv": {
        const [srcRaw, dstRaw] = args;
        if (!srcRaw || !dstRaw) return ["mv: missing file operand"];
        const src = resolve(cwd, srcRaw);
        const dst = resolve(cwd, dstRaw);
        const e = fs[src];
        if (!e) return [`mv: cannot stat '${srcRaw}': No such file or directory`];
        let finalDst = dst;
        if (fs[dst]?.type === "dir") finalDst = dst + "/" + src.split("/").pop();
        setFs((prev) => {
          const next = { ...prev };
          next[finalDst] = e;
          // move children if dir
          for (const k of Object.keys(prev)) {
            if (k.startsWith(src + "/")) {
              const newKey = finalDst + k.slice(src.length);
              next[newKey] = prev[k];
              delete next[k];
            }
          }
          delete next[src];
          return next;
        });
        return [];
      }
      case "chmod":
        return [];
      case "sudo": {
        const sub = args.join(" ");
        if (!sub) return ["sudo: missing command"];
        if (sub === "-l" || sub === "-ll") {
          return [
            "Matching Defaults entries for lokajith on arch:",
            "    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/bin",
            "",
            "User lokajith may run the following commands on arch:",
            "    (ALL) NOPASSWD: /usr/bin/cargo",
            "    (ALL) NOPASSWD: /usr/bin/vim",
            "    (ALL) NOPASSWD: /usr/bin/nvim",
            "    (ALL) NOPASSWD: /usr/bin/journalctl",
          ];
        }
        if (sub.startsWith("cargo")) {
          const cargoArgs = sub.slice(5).trim();
          const hasExploit = Object.values(fs).some((v) => v.content?.includes("/root/root.txt"));
          // pager case handled in submit, but fallback here
          if ((cargoArgs.includes("run") || cargoArgs.includes("build")) && hasExploit) {
            const hasPwn = fs["/home/lokajith/pwn/src/main.rs"]?.content?.includes("/root/root.txt") || fs[resolve(cwd, "pwn/src/main.rs")]?.content?.includes("/root/root.txt");
            if (hasPwn) return ["   Compiling pwn v0.1.0", "    Finished `dev` profile", "     Running `target/debug/pwn` as root...", `uid=0(root)`, ROOT_FLAG];
          }
          if (cargoArgs.includes("run") || cargoArgs.includes("build") || cargoArgs === "") {
            return ["   Compiling pwn v0.1.0 (/home/lokajith/pwn)", "    Finished `dev` profile [unoptimized] target(s) in 0.42s", "     Running `target/debug/pwn` as root...", "hello from pwn"];
          }
          return runCmd("cargo " + cargoArgs, hist);
        }
        if (sub.startsWith("cat ")) {
          const f = sub.slice(4).trim();
          const abs = resolve("/root", f);
          const e = fs[abs] || fs[resolve(cwd, f)];
          if (f.includes("root.txt") && !sub.includes("cargo")) return ["Sorry, user lokajith is not allowed to execute '/usr/bin/cat root.txt' as root on arch."];
          if (e?.content) return [e.content];
          return [`sudo cat: ${f}: No such file or directory`];
        }
        if (["journalctl", "systemctl", "pacman", "ip", "iwctl", "lsblk", "df", "free"].some((c) => sub.startsWith(c))) {
          return runCmd(sub, hist);
        }
        return [`sudo: sorry, user lokajith is not allowed to execute '${sub}' as root on arch. allowed: /usr/bin/cargo`];
      }
      case "id":
        return ["uid=1000(lokajith) gid=1000(lokajith) groups=1000(lokajith),10(wheel) — not root"];
      case "whoami":
        return ["lokajith"];
      case "env":
      case "printenv":
        return ["SHELL=/bin/zsh", "USER=lokajith", "HOME=/home/lokajith", "TERM=xterm-256color", "EDITOR=nvim", "ARCH=btw i use arch", `PWD=${cwd}`];
      case "history":
        return hist.length ? hist.map((h, i) => `  ${i + 1}  ${h}`) : ["(no history yet)"];
      case "find": {
        const q = raw.toLowerCase();
        if (q.includes("user.txt")) return Object.keys(fs).filter((k) => k.includes("user.txt"));
        if (q.includes("root.txt") || q.includes("flag")) return Object.keys(fs).filter((k) => k.includes("root.txt") || k.includes("flag.txt"));
        return Object.keys(fs).filter((k) => k.startsWith(cwd) || k.startsWith("/home/lokajith")).slice(0, 20);
      }
      case "grep": {
        if (args.length === 0) return ["grep: missing pattern"];
        const pat = args[0].replace(/^["']|["']$/g, "");
        const fileRaw = args[1];
        const search = (text: string) => text.split("\n").filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
        if (fileRaw) {
          const abs = resolve(cwd, fileRaw);
          const e = fs[abs];
          if (!e?.content) return [`grep: ${fileRaw}: No such file or directory`];
          const res = search(e.content);
          return res.length ? res : ["(no matches)"];
        }
        const all = Object.entries(fs)
          .filter(([, v]) => v.type === "file" && v.content)
          .flatMap(([k, v]) => v.content!.split("\n").map((l) => `${k}: ${l}`))
          .filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
        return all.length ? all.slice(0, 30) : ["(no matches)"];
      }
      case "iwctl": {
        const sub = args.join(" ");
        if (!sub || sub === "help" || sub === "--help") return ["iwctl — iNet wireless daemon.\nCommands: station list, station wlan0 scan, station wlan0 get-networks, station wlan0 connect <ssid>"];
        if (sub.includes("station list")) return ["  Station    Device        State\n  wlan0      wireless      connected  (ArchWiFi_5G)"];
        if (sub.includes("scan")) return ["[iwd] scan triggered for wlan0 — use 'iwctl station wlan0 get-networks'"];
        if (sub.includes("get-networks")) return ["  Available networks:\n    ArchWiFi_5G               psk  ****\n    ArchWiFi_2G               psk  ****\n    eduroam                   8021x"];
        if (sub.includes("connect")) return [`[iwd] connecting to ${args[args.length - 1]} — connected.`];
        return [`iwctl: unknown command '${sub}' — try 'iwctl station list'`];
      }
      case "journalctl": {
        const flag = args.join(" ");
        if (flag.includes("-b") || flag === "" || flag === "--no-pager") {
          return [
            "-- Logs begin at Wed 2026-09-03 09:16:01 IST --",
            "Sep 03 09:16:01 arch kernel: Linux version 6.10.3-arch1-1",
            "Sep 03 09:16:05 arch lokajith[1000]: started portfolio terminal — ctf ready",
          ];
        }
        return ["journalctl: try 'journalctl -b' or 'journalctl --no-pager'"];
      }
      case "systemctl": {
        const sub = args.join(" ");
        if (sub === "status" || sub === "" || sub.includes("status")) return ["● arch — Arch Linux\n    State: running\n  ● iwd.service — active\n  ● NetworkManager.service — active"];
        if (sub.includes("list-units")) return ["UNIT                      LOAD   ACTIVE\n iwd.service               loaded active\n NetworkManager.service    loaded active"];
        return [`systemctl: unknown '${sub}'`];
      }
      case "ip": {
        const sub = args.join(" ");
        if (sub === "a" || sub === "addr" || sub === "") return ["2: wlan0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 192.168.1.42/24 brd 192.168.1.255"];
        if (sub.includes("link")) return ["1: lo: <LOOPBACK,UP>\n2: wlan0: <BROADCAST,MULTICAST,UP>"];
        return ["ip: try 'ip a' or 'ip link'"];
      }
      case "lsblk":
        return ["NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINTS\nnvme0n1 259:0  0 512G  0 disk\n├─nvme0n1p1 259:1 0 512M  0 part /boot\n└─nvme0n1p2 259:2 0 511G  0 part /"];
      case "pacman": {
        const sub = args.join(" ");
        if (sub === "-Q" || sub === "-Qq" || sub === "") return ["linux 6.10.3.arch1-1\nrust 1:1.85.0-1\ngit 2.45.2"];
        if (sub.startsWith("-Qs")) {
          const q = args[1] || "";
          if (q.includes("rust")) return ["local/rust 1:1.85.0-1 — rustc/cargo"];
          return [`local/${q} — not found`];
        }
        if (sub.includes("-Syu")) return [":: Synchronizing...\n there is nothing to do"];
        return ["pacman: try 'pacman -Q', 'pacman -Qs <pkg>'"];
      }
      case "yay":
        return ["yay: try 'yay -Qs <pkg>'"];
      case "df":
        return ["Filesystem     Size Used Avail Use% Mounted on\n/dev/nvme0n1p2  500G  42G  433G   9% /"];
      case "du": {
        const sub = args.join(" ");
        if (sub.includes("-sh")) return ["2.1G    ."];
        return ["4.0K  ./README.md\n1.2M  ./projects"];
      }
      case "free":
        return ["               total   used   free\nMem:           16Gi   3.2Gi  11Gi\nSwap:         8.0Gi     0B   8.0Gi"];
      case "ps":
        return ["PID TTY  TIME CMD\n 420 ?  00:00:00 iwd\n1337 pts/0 00:00:00 zsh"];
      case "htop":
      case "top":
        return ["htop — Tasks: 142, Load avg: 0.42\n 1337 lokajith 2.1% zsh\n  666 lokajith 5.4% rust-analyzer"];
      case "lspci":
        return ["00:00.0 Host bridge: Intel\n00:02.0 VGA: Intel Iris Xe"];
      case "lsusb":
        return ["Bus 001 Device 001: ID 1d6b:0002 xHCI\nBus 001 Device 002: ID 8087:0032 Intel AX210"];
      case "dmesg":
        return ["[    0.000000] Linux version 6.10.3-arch1-1", "[    2.102938] wlan0: associated"];
      case "git": {
        const sub = args.join(" ");
        if (sub.includes("status")) return ["On branch main\nnothing to commit, working tree clean"];
        if (sub.includes("log")) return ["a5f8eb6 fix: tone down copy"];
        return ["git: try 'git status' or 'git log --oneline'"];
      }
      case "curl": {
        const url = args[0] || "";
        if (!url) return ["curl: try 'curl <url>'"];
        return [`curl: (6) Could not resolve host: ${url} — offline`];
      }
      case "ping": {
        const host = args[0] || "archlinux.org";
        return [`PING ${host} (95.216.195.133)`, `64 bytes from ${host}: icmp_seq=1 ttl=52 time=12.3 ms`];
      }
      case "echo":
        return [args.join(" ")];
      case "uname":
        return ["Linux arch 6.10.3-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"];
      case "rustc":
        if (args[0] === "--version") return ["rustc 1.85.0 (stable) — backend · arch btw"];
        return ["rustc: try 'rustc --version'"];
      case "cargo": {
        const sub = args.join(" ").trim();
        if (sub === "--version" || sub === "-V") return ["cargo 1.85.0"];
        if (sub.startsWith("new ")) {
          const name = sub.slice(4).trim().split(" ")[0] || "pwn";
          const base = resolve(cwd, name);
          const cargoToml = `${base}/Cargo.toml`;
          const srcDir = `${base}/src`;
          const mainRs = `${srcDir}/main.rs`;
          setFs((prev) => ({
            ...prev,
            [base]: { type: "dir" },
            [srcDir]: { type: "dir" },
            [cargoToml]: { type: "file", content: `[package]\nname = "${name}"\nversion = "0.1.0"\nedition = "2021"` },
            [mainRs]: { type: "file", content: `fn main(){println!("hello from ${name}");}` },
          }));
          return [`     Created binary (application) \`${name}\` package`];
        }
        if (sub === "run" || sub.startsWith("run ") || sub === "build" || sub.startsWith("build ")) {
          return ["   Compiling pwn v0.1.0\n    Finished `dev` profile [unoptimized]\n     Running `target/debug/pwn`\nhello from pwn"];
        }
        if (sub.includes("--help") || sub === "help") return ["cargo help — see https://doc.rust-lang.org/cargo/"];
        return ["cargo: try 'cargo --version', 'cargo new <name>', 'cargo run'"];
      }
      case "neofetch": {
        return [
          `                   -\\` + "                 .o+`",
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
          `Projects: gilma · knotApp · lkey · leviathan`,
        ];
      }
      case "cowsay": {
        const msg = args.join(" ") || "btw i use arch";
        return [` < ${msg} >`, "  \\   ^__^", "   \\  (oo)\\_______"];
      }
      case "env":
      case "printenv":
        return ["SHELL=/bin/zsh", `PWD=${cwd}`, "USER=lokajith", "HOME=/home/lokajith", "ARCH=btw i use arch"];
      default:
        return [`zsh: command not found: ${cmd} — type 'help'`];
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-zinc-500">lokajith@arch: {cwd} — interactive</span>
          <span className="ml-auto hidden sm:inline font-mono text-[10px] text-zinc-600">{cwd} · zsh · {Object.keys(fs).length} nodes</span>
        </div>

        <div
          onClick={() => inputRef.current?.focus()}
          className="h-[360px] overflow-y-auto scroll-smooth bg-black p-4 font-mono text-xs leading-5 cursor-text sm:h-[420px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{ scrollBehavior: "smooth" }}
        >
          {history.map((e, i) => (
            <div key={i} className={e.type === "in" ? "text-zinc-100" : "text-zinc-400 whitespace-pre-wrap break-words"}>
              {e.type === "in" ? (
                <span>
                  <span className="text-emerald-400">➜</span> <span className="text-[#1793D1]">{cwd}</span> <span className="text-zinc-500">$</span> <span>{e.text}</span>
                </span>
              ) : (
                e.text
              )}
            </div>
          ))}
          {pager && <div className="text-zinc-500">:</div>}
          <div ref={endRef} className="flex gap-2 pt-1">
            <span className="text-emerald-400">{pager ? ":" : "➜"}</span>
            <span className="text-[#1793D1]">{pager ? "" : cwd}</span>
            <span className="text-zinc-500">{pager ? "" : "$"}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // pager handled in submit
                  const trimmed = input.trim();
                  if (!trimmed && input === "") return;
                  // pager intercept
                  if (pager) {
                    if (trimmed) setCmdHistory((h) => [...h, trimmed]);
                    setHistIdx(null);
                    const out = handlePagerInput(trimmed);
                    setHistory((h) => [...h, { type: "in", text: input }, ...out.map((t) => ({ type: "out" as const, text: t }))]);
                    setInput("");
                    return;
                  }
                  if (trimmed === "sudo cargo help doc" || trimmed === "cargo help doc" || trimmed.startsWith("sudo less ") || trimmed.startsWith("less ")) {
                    // let submit handle pager entry
                  }
                  // normal submit
                  if (trimmed) setCmdHistory((h) => [...h, trimmed]);
                  setHistIdx(null);

                  if (trimmed === "sudo cargo help doc") {
                    setPager({ asRoot: true, src: "cargo" });
                    setHistory((h) => [
                      ...h,
                      { type: "in", text: input },
                      { type: "out", text: "cargo-doc(1) — cargo documentation (via less) — running as root" },
                      { type: "out", text: ":" },
                    ]);
                    setInput("");
                    return;
                  }
                  if (trimmed === "cargo help doc") {
                    setPager({ asRoot: false, src: "cargo" });
                    setHistory((h) => [
                      ...h,
                      { type: "in", text: input },
                      { type: "out", text: "cargo-doc(1) — cargo documentation (via less)" },
                      { type: "out", text: ":" },
                    ]);
                    setInput("");
                    return;
                  }
                  if (trimmed.startsWith("sudo less ") || trimmed === "sudo less") {
                    setPager({ asRoot: true, src: "less" });
                    setHistory((h) => [
                      ...h,
                      { type: "in", text: input },
                      { type: "out", text: `${trimmed} (less as root) — :` },
                    ]);
                    setInput("");
                    return;
                  }
                  if (trimmed.startsWith("less ")) {
                    setPager({ asRoot: false, src: "less" });
                    setHistory((h) => [...h, { type: "in", text: input }, { type: "out", text: ":" }]);
                    setInput("");
                    return;
                  }
                  // vim / nvim — real editor, GTFOBins :!/bin/sh
                  if (
                    trimmed === "vim" ||
                    trimmed.startsWith("vim ") ||
                    trimmed === "nvim" ||
                    trimmed.startsWith("nvim ") ||
                    trimmed === "vi" ||
                    trimmed.startsWith("vi ")
                  ) {
                    const fileRaw = trimmed.split(/\s+/).slice(1).join(" ").trim() || "";
                    const file = fileRaw ? resolve(cwd, fileRaw) : "";
                    const content = file ? fs[file]?.content || "" : "";
                    setPager({ asRoot: false, src: "vim", file });
                    setHistory((h) => [
                      ...h,
                      { type: "in", text: input },
                      { type: "out", text: file ? `"${fileRaw}" ${content ? content.split("\n").length + "L" : "[New File]"}` : "~ VIM - Vi IMproved"},
                      { type: "out", text: content ? content.split("\n").slice(0, 20).join("\n") : "~"},
                      { type: "out", text: ":" },
                    ]);
                    setInput("");
                    return;
                  }
                  if (
                    trimmed.startsWith("sudo vim") ||
                    trimmed.startsWith("sudo nvim") ||
                    trimmed.startsWith("sudo vi")
                  ) {
                    const parts = trimmed.split(/\s+/);
                    const fileRaw = parts.slice(2).join(" ").trim() || "";
                    const file = fileRaw ? resolve(cwd, fileRaw) : "";
                    const content = file ? fs[file]?.content || "" : "";
                    setPager({ asRoot: true, src: "vim", file });
                    setHistory((h) => [
                      ...h,
                      { type: "in", text: input },
                      { type: "out", text: file ? `"${fileRaw}" ${content ? content.split("\n").length + "L" : "[New File]"} (as root)` : "~ VIM - Vi IMproved (as root)"},
                      { type: "out", text: content ? content.split("\n").slice(0, 20).join("\n") : "~"},
                      { type: "out", text: ":" },
                    ]);
                    setInput("");
                    return;
                  }

                  const outLines = runCmd(trimmed === "" ? "" : input, [...cmdHistory, trimmed]);
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
                  return;
                }
                if (e.key === "Tab") {
                  e.preventDefault();
                  const all = ["ls", "ls -la", "cd ", "cat ", "grep ", "mkdir ", "touch ", "rm ", "cp ", "mv ", "cargo new ", "sudo -l", "sudo cargo help doc", "iwctl", "journalctl -b", "clear"];
                  const m = all.find((c) => c.startsWith(input));
                  if (m) setInput(m);
                }
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
              placeholder={
                pager
                  ? pager.src === "vim"
                    ? "vim: :q, :w, :wq, :!sh"
                    : "less: q, !sh, h"
                  : "try: ls -la, vim user.txt, sudo vim, sudo -l, cargo help doc..."
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-zinc-900 bg-zinc-950 px-3 py-2">
          {[
            "ls -la",
            "vim user.txt",
            "sudo vim",
            "sudo -l",
            "sudo cargo help doc",
            "sudo nvim",
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
          <span className="ml-auto hidden font-mono text-[10px] text-zinc-600 sm:inline">stateful fs · cwd · smooth scroll · ∀ commands work</span>
        </div>
      </div>
    </div>
  );
}
