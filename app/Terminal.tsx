"use client";
import { useEffect, useRef, useState } from "react";

type Entry = { type: "in" | "out"; text: string };

const USER_FLAG = "flag{user_cool_nerd_lokajith_7f3a9e2c}";
const ROOT_FLAG = "flag{root_vibe_coded_arch_masta_9b2c1f8a}";

let FS: Record<string, string> = {
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
  "user.txt": `hi if i typed "ls" and u were able to open this file then u are so cool . and so am i . so i have a userflag in here and also a root flag in here ... try to find it ... if u do it u will get my number and if u send me the flag then i will not give u any money . atleast ill know there are more nerds like me

${USER_FLAG}

— lokajith
hint: root flag at /root/root.txt — try 'id', 'sudo -l' — cargo is sus`,
  "root.txt": ROOT_FLAG,
  "/root/root.txt": ROOT_FLAG,
  "/etc/os-release": `NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=arch
BUILD_ID=rolling
VERSION_ID="2026-09-03"
HOME_URL="https://archlinux.org/"`,
  "/etc/hostname": `arch`,
  "/proc/cpuinfo": `processor : 0
model name : AMD Ryzen 7 7840U
cpu cores : 8
flags : fpu vme sse sse2 ht vmx`,
};

const HELP = `arch terminal — all commands actually work:

  ─ ctf ─
  ls [path]         list files (ls, ls projects, ls -la)
  cat <file>        cat README.md, cat user.txt, cat /etc/os-release
  grep <pat> [file] grep rust, grep flag user.txt
  find <path> -name <f>   find . -name user.txt
  sudo -l           check sudo perms (cargo is sus)
  sudo <cmd>        sudo cat root.txt — try cargo privesc
  id                show uid/gid

  ─ arch / system ─
  neofetch          arch neofetch
  uname [-a]        kernel info
  whoami            user
  pwd               current dir
  env / printenv    env vars
  history           command history
  clear             clear screen

  ─ arch linux ─
  iwctl             iwd wireless (try: iwctl station list)
  journalctl [-b]   systemd logs (journalctl, journalctl -b)
  systemctl <arg>   systemctl status, systemctl list-units
  ip [a/link]       ip a, ip link
  lsblk             block devices
  pacman [-Q/-Qs]   pacman -Q, pacman -Qs rust
  yay [-Qs]         yay -Qs <pkg>
  df [-h]           disk usage
  du [-sh]          du -sh .
  free [-h]         memory
  ps [aux]          processes (ps aux)
  htop / top        htop
  lspci             pci devices
  lsusb             usb devices
  dmesg             kernel ring
  tree [path]       tree projects

  ─ dev ─
  rustc --version   rust version
  cargo --version   cargo version (try: cargo new pwn; sudo cargo run)
  cargo new <name>  create rust project (for privesc)
  git <arg>         git status, git log --oneline
  curl <url>        curl example.com
  ping <host>       ping archlinux.org
  echo <text> > <file>  echo hello > /tmp/x
  mkdir <dir>       mkdir pwn`;

function runCmd(input: string, hist: string[]): string[] {
  const raw = input.trim();
  if (!raw) return [];

  // handle echo with redirection: echo "foo" > file
  if (raw.startsWith("echo ") && raw.includes(" > ")) {
    const [left, file] = raw.split(" > ").map((s) => s.trim());
    const text = left.slice(5).trim().replace(/^["']|["']$/g, "");
    const target = file.split(" ")[0];
    FS[target] = text;
    FS[target.replace(/^\.\//, "")] = text;
    return [];
  }

  const [cmd, ...args] = raw.split(/\s+/);

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

  switch (cmd) {
    case "help":
      return [HELP];
    case "clear":
      return ["__CLEAR__"];
    case "ls": {
      const p = args.join(" ").trim();
      if (!p || p === "." || p === "./" || p === "-la" || p === "-a" || p === "-lah") {
        return ["total 24\n-rw-r--r-- 1 lokajith lokajith  220 Sep 3 09:16 README.md\n-rw-r--r-- 1 lokajith lokajith  380 Sep 3 09:16 user.txt\n-rw------- 1 root     root       38 Sep 3 09:16 root.txt\ndrwxr-xr-x 2 lokajith lokajith   80 Sep 3 09:16 projects/"];
      }
      if (p === "projects" || p === "projects/" || p.startsWith("projects")) {
        if (p === "projects" || p === "projects/") return ["gilma  knotApp  lkey  leviathan"];
        const key = p.replace(/\/$/, "");
        if (FS[key]) return [FS[key].split("\n")[0]];
        return [`ls: cannot access '${p}': No such file or directory`];
      }
      if (p === "/etc" || p === "/etc/") return ["os-release  hostname  pacman.conf"];
      return [`ls: cannot access '${p}': No such file or directory`];
    }
    case "tree": {
      const p = args[0] || ".";
      if (p === "." || p === "./" || p === "projects" || p === "projects/") {
        return [".\n├── README.md\n├── user.txt\n├── root.txt\n└── projects/\n    ├── gilma\n    ├── knotApp\n    ├── lkey\n    └── leviathan"];
      }
      return [`tree: ${p}: No such file or directory`];
    }
    case "cat": {
      const p = args[0];
      if (!p) return ["cat: missing operand"];
      if (p === "root.txt" || p === "./root.txt" || p === "/root/root.txt" || p === "/root.txt") {
        return ["cat: root.txt: Permission denied — you are not root. try 'sudo cat root.txt' or find the privesc (coming soon)"];
      }
      const content = FS[p] || FS[p.replace(/\/$/, "")] || FS[p.replace(/^\.\//, "")];
      if (content) return [content];
      if (p === "/etc/os-release") return [FS["/etc/os-release"]];
      if (p === "/etc/hostname") return [FS["/etc/hostname"]];
      if (p === "/proc/cpuinfo") return [FS["/proc/cpuinfo"]];
      return [`cat: ${p}: No such file or directory`];
    }
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
          "    (ALL) NOPASSWD: /usr/bin/journalctl",
          "",
          "hint: cargo is GTFOBins — try 'cargo new pwn' then 'sudo cargo run' or check https://gtfobins.github.io/gtfobins/cargo/",
        ];
      }
      if (sub === "cat root.txt" || sub === "cat /root/root.txt" || sub === "cat ./root.txt" || sub === "cat /root/root.txt") {
        return ["sudo: lokajith is not in the sudoers file for cat. Only cargo is allowed — try cargo privesc."];
      }
      if (sub.startsWith("cargo")) {
        // cargo GTFOBins privesc: sudo cargo run/build with build.rs execution as root
        const cargoArgs = sub.slice(5).trim();
        if (cargoArgs.includes("run") || cargoArgs.includes("build") || cargoArgs === "" || cargoArgs.includes("--manifest-path")) {
          return [
            "   Compiling pwn v0.1.0 (/home/lokajith/pwn)",
            "    Finished `dev` profile [unoptimized] target(s) in 0.42s",
            "     Running `target/debug/pwn` as root...",
            `uid=0(root) gid=0(root) groups=0(root)`,
            `cat /root/root.txt:`,
            ROOT_FLAG,
            "",
            "— nice. you pwned cargo. send this flag to lokajith, he owes you nothing but respect.",
          ];
        }
        if (cargoArgs.includes("--help") || cargoArgs.includes("-h")) {
          return ["cargo GTFOBins: sudo cargo run --manifest-path pwn/Cargo.toml — build.rs runs as root"];
        }
        return runCmd("cargo " + cargoArgs, hist);
      }
      if (sub.startsWith("cat ")) {
        const f = sub.slice(4).trim();
        const c = FS[f] || FS[f.replace(/\/$/, "")];
        if (c) return [c];
        return [`sudo cat: ${f}: No such file or directory`];
      }
      if (sub.startsWith("journalctl") || sub.startsWith("systemctl") || sub.startsWith("pacman") || sub.startsWith("ip") || sub.startsWith("iwctl")) {
        return runCmd(sub, hist);
      }
      return [`sudo: sorry, user lokajith is not allowed to execute '${sub}' as root on arch. allowed: /usr/bin/cargo`];
    }
    case "id":
      return ["uid=1000(lokajith) gid=1000(lokajith) groups=1000(lokajith),10(wheel) — not root"];
    case "whoami":
      return ["lokajith"];
    case "pwd":
      return ["/home/lokajith"];
    case "env":
    case "printenv":
      return ["SHELL=/bin/zsh", "USER=lokajith", "HOME=/home/lokajith", "TERM=xterm-256color", "EDITOR=nvim", "ARCH=btw i use arch"];
    case "history":
      return hist.length ? hist.map((h, i) => `  ${i + 1}  ${h}`) : ["(no history yet)"];
    case "find": {
      const q = raw.toLowerCase();
      if (q.includes("user.txt")) return ["./user.txt"];
      if (q.includes("root.txt") || q.includes("flag")) return ["./user.txt", "./root.txt  (permission denied)", "/root/root.txt  (permission denied)"];
      return ["./README.md", "./user.txt", "./root.txt", "./projects/gilma", "./projects/knotApp", "./projects/lkey", "./projects/leviathan", "/etc/os-release"];
    }
    case "grep": {
      if (args.length === 0) return ["grep: missing pattern"];
      const pat = args[0].replace(/^["']|["']$/g, "");
      const file = args[1];
      const search = (text: string) => text.split("\n").filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
      if (file) {
        const content = FS[file] || FS[file.replace(/\/$/, "")];
        if (!content) return [`grep: ${file}: No such file or directory`];
        const res = search(content);
        return res.length ? res : ["(no matches)"];
      }
      const all = Object.entries(FS)
        .flatMap(([k, v]) => v.split("\n").map((l) => `${k}: ${l}`))
        .filter((l) => l.toLowerCase().includes(pat.toLowerCase()));
      return all.length ? all : ["(no matches)"];
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
          "Sep 03 09:16:01 arch systemd[1]: Started Hostname Service.",
          "Sep 03 09:16:02 arch systemd[1]: Started Network Manager.",
          "Sep 03 09:16:02 arch iwd[420]: station wlan0 connected to ArchWiFi_5G",
          "Sep 03 09:16:03 arch systemd[1]: Reached target Multi-User System.",
          "Sep 03 09:16:03 arch systemd[1]: Reached target Graphical Interface.",
          "Sep 03 09:16:04 arch cargo[1337]: crates.io index updated — rust 1.85.0",
          "Sep 03 09:16:05 arch lokajith[1000]: started portfolio terminal — ctf ready",
        ];
      }
      return ["journalctl: try 'journalctl -b' or 'journalctl --no-pager'"];
    }
    case "systemctl": {
      const sub = args.join(" ");
      if (sub === "status" || sub === "" || sub.includes("status")) {
        return [
          "● arch — Arch Linux",
          "    State: running",
          "    Units: 142 loaded (running: 98)",
          "  ● iwd.service — active (running)",
          "  ● NetworkManager.service — active (running)",
          "  ● cargo-registry.service — active (running)",
        ];
      }
      if (sub.includes("list-units")) return ["UNIT                      LOAD   ACTIVE  DESCRIPTION\n iwd.service               loaded active  Wireless service\n NetworkManager.service    loaded active  Network Manager\n ... 142 units"];
      if (sub.includes("is-active")) return ["active"];
      return [`systemctl: unknown '${sub}' — try 'systemctl status' or 'systemctl list-units'`];
    }
    case "ip": {
      const sub = args.join(" ");
      if (sub === "a" || sub === "addr" || sub === "" || sub.includes("addr")) {
        return ["2: wlan0: <BROADCAST,MULTICAST,UP> mtu 1500", "    inet 192.168.1.42/24 brd 192.168.1.255 scope global wlan0", "    inet6 fe80::a1b2:c3d4:e5f6/64 scope link"];
      }
      if (sub.includes("link")) return ["1: lo: <LOOPBACK,UP> mtu 65536\n2: wlan0: <BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state UP"];
      return ["ip: try 'ip a' or 'ip link'"];
    }
    case "lsblk":
      return ["NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINTS\nnvme0n1 259:0  0 512G  0 disk\n├─nvme0n1p1 259:1 0 512M  0 part /boot\n└─nvme0n1p2 259:2 0 511G  0 part /\n"];
    case "pacman": {
      const sub = args.join(" ");
      if (sub === "-Q" || sub === "-Qq" || sub === "") return ["linux 6.10.3.arch1-1\nrust 1:1.85.0-1\ngit 2.45.2\nneovim 0.10.1\niwd 2.18"];
      if (sub.startsWith("-Qs")) {
        const q = args[1] || "";
        if (!q) return ["pacman -Qs: missing query"];
        if (q.includes("rust")) return ["local/rust 1:1.85.0-1 — rustc/cargo\nlocal/rust-analyzer 20240901"];
        if (q.includes("linux")) return ["local/linux 6.10.3.arch1-1\nlocal/linux-headers 6.10.3"];
        return [`local/${q} — not found`];
      }
      if (sub.includes("-Syu")) return [":: Synchronizing package databases...\n core is up to date\n extra is up to date\n:: Starting full system upgrade...\n there is nothing to do"];
      return ["pacman: try 'pacman -Q', 'pacman -Qs <pkg>', 'pacman -Syu'"];
    }
    case "yay": {
      const sub = args.join(" ");
      if (sub.startsWith("-Qs")) {
        const q = args[1] || "";
        return [`yay -Qs ${q}: local/${q} 1.0-1 (AUR) — found`];
      }
      return ["yay: try 'yay -Qs <pkg>'"];
    }
    case "df":
      return ["Filesystem     Size Used Avail Use% Mounted on\n/dev/nvme0n1p2  500G  42G  433G   9% /\n/dev/nvme0n1p1  512M  120M  392M  24% /boot"];
    case "du": {
      const sub = args.join(" ");
      if (sub.includes("-sh")) return ["2.1G    ."];
      return ["4.0K  ./README.md\n1.2M  ./projects"];
    }
    case "free":
      return ["               total   used   free  shared  buff/cache  available\nMem:           16Gi   3.2Gi  11Gi   0.5Gi       1.8Gi      12Gi\nSwap:         8.0Gi     0B   8.0Gi"];
    case "ps":
      return ["PID TTY  TIME CMD\n 420 ?  00:00:00 iwd\n 666 ?  00:00:01 rust-analyzer\n1337 pts/0 00:00:00 zsh\n2042 pts/0 00:00:00 ps"];
    case "htop":
    case "top":
      return ["htop — Tasks: 142, Load avg: 0.42 0.38 0.35\n  PID USER  CPU% MEM% COMMAND\n 1337 lokajith 2.1  1.2  zsh\n  666 lokajith 5.4  3.8  rust-analyzer\n  420 root    0.1  0.3  iwd"];
    case "lspci":
      return ["00:00.0 Host bridge: Intel Alder Lake-P\n00:02.0 VGA compatible: Intel Iris Xe\n00:14.3 Network: Intel Wi-Fi 6 AX210"];
    case "lsusb":
      return ["Bus 001 Device 001: ID 1d6b:0002 xHCI Host Controller\nBus 001 Device 002: ID 8087:0032 Intel AX210 Bluetooth"];
    case "dmesg":
      return [
        "[    0.000000] Linux version 6.10.3-arch1-1",
        "[    1.234567] iwlwifi 0000:00:14.3: loaded firmware version 72.a764baea",
        "[    2.102938] wlan0: associated to ArchWiFi_5G",
        "[    3.001122] systemd[1]: Started portfolio terminal",
      ];
    case "git": {
      const sub = args.join(" ");
      if (sub.includes("status")) return ["On branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean"];
      if (sub.includes("log")) return ["a5f8eb6 fix: tone down copy\n34f8f9c feat: portfolio — gilma · lkey · leviathan\n61f3298 Initial commit"];
      return ["git: try 'git status' or 'git log --oneline'"];
    }
    case "curl": {
      const url = args[0] || "";
      if (!url) return ["curl: try 'curl <url>'"];
      return [`curl: (6) Could not resolve host: ${url} — offline in this browser terminal`];
    }
    case "ping": {
      const host = args[0] || "archlinux.org";
      return [`PING ${host} (95.216.195.133) 56(84) bytes of data.`, `64 bytes from ${host}: icmp_seq=1 ttl=52 time=12.3 ms`, `--- ${host} ping statistics ---`, `1 packets transmitted, 1 received, 0% packet loss`];
    }
    case "echo":
      return [args.join(" ")];
    case "uname":
      return ["Linux arch 6.10.3-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"];
    case "rustc":
      if (args[0] === "--version") return ["rustc 1.85.0 (stable) — backend · arch btw"];
      return ["rustc: try 'rustc --version'"];
    case "mkdir": {
      const p = args[0];
      if (!p) return ["mkdir: missing operand"];
      FS[p] = "";
      FS[p + "/"] = "";
      return [];
    }
    case "touch": {
      const p = args[0];
      if (!p) return ["touch: missing file operand"];
      if (!FS[p]) FS[p] = "";
      return [];
    }
    case "cargo": {
      const sub = args.join(" ").trim();
      if (sub === "--version" || sub === "-V") return ["cargo 1.85.0"];
      if (sub.startsWith("new ")) {
        const name = sub.slice(4).trim().split(" ")[0] || "pwn";
        FS[`${name}/Cargo.toml`] = `[package]\nname = "${name}"\nversion = "0.1.0"\nedition = "2021"\n\n[dependencies]`;
        FS[`${name}/src/main.rs`] = `fn main(){println!("hello from ${name}");}`;
        FS[`${name}`] = `Cargo.toml  src/`;
        return [`     Created binary (application) \`${name}\` package`];
      }
      if (sub === "run" || sub.startsWith("run ") || sub === "build" || sub.startsWith("build ")) {
        return ["   Compiling pwn v0.1.0\n    Finished `dev` profile [unoptimized]\n     Running `target/debug/pwn`\nhello from pwn — try 'sudo cargo run' for root"];
      }
      if (sub.includes("--help") || sub === "help") return ["cargo GTFOBins: cargo new pwn; sudo cargo run — build.rs runs as root. also try 'sudo -l'"];
      return ["cargo: try 'cargo --version', 'cargo new pwn', 'cargo run', 'sudo cargo run' (privesc)"];
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
    case "env":
    case "printenv":
      return ["SHELL=/bin/zsh", "USER=lokajith", "HOME=/home/lokajith", "TERM=xterm-256color", "EDITOR=nvim", "ARCH=btw i use arch"];
    default:
      return [`zsh: command not found: ${cmd} — type 'help'`];
  }
}

export default function Terminal() {
  const [history, setHistory] = useState<Entry[]>([
    { type: "out", text: "arch terminal — ctf mode — type 'ls' to start · user.txt is waiting · try iwctl, journalctl, systemctl" },
  ]);
  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history]);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed && input === "") return;
    if (trimmed) setCmdHistory((h) => [...h, trimmed]);
    setHistIdx(null);

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
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-zinc-500">lokajith@arch: ~ — interactive</span>
          <span className="ml-auto hidden sm:inline font-mono text-[10px] text-zinc-600">iwctl · journalctl · systemctl · pacman</span>
        </div>

        <div
          ref={boxRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[320px] overflow-y-auto scroll-smooth bg-black p-4 font-mono text-xs leading-5 cursor-text sm:h-[360px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ scrollBehavior: "smooth" }}
        >
          {history.map((e, i) => (
            <div key={i} className={e.type === "in" ? "text-zinc-100" : "text-zinc-400 whitespace-pre-wrap break-words"}>
              {e.type === "in" ? (
                <span>
                  <span className="text-emerald-400">➜</span> <span className="text-[#1793D1]">~</span> <span>{e.text}</span>
                </span>
              ) : (
                e.text
              )}
            </div>
          ))}

          <div ref={endRef} className="flex gap-2 pt-1">
            <span className="text-emerald-400">➜</span>
            <span className="text-[#1793D1]">~</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Tab") {
                  e.preventDefault();
                  const all = ["ls", "cat ", "grep ", "iwctl", "journalctl", "systemctl", "ip a", "lsblk", "pacman -Q", "find ", "clear", "neofetch", "cat user.txt"];
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
              placeholder="try: iwctl station list, journalctl -b, systemctl status, ip a, pacman -Q..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-zinc-900 bg-zinc-950 px-3 py-2">
          {[
            "ls",
            "cat user.txt",
            "iwctl station list",
            "journalctl -b",
            "systemctl status",
            "ip a",
            "pacman -Q",
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
          <span className="ml-auto hidden font-mono text-[10px] text-zinc-600 sm:inline">tab complete · ↑↓ history · smooth scroll · pipe: cat user.txt | grep flag</span>
        </div>
      </div>
    </div>
  );
}
