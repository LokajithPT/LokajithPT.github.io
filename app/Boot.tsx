"use client";
import { useEffect, useState } from "react";

const bootLines = [
  { ok: true, text: "Mounted /boot." },
  { ok: true, text: "Started Load Kernel Modules." },
  { ok: true, text: "Started Apply Kernel Variables." },
  { ok: true, text: "Reached target Network is Online." },
  { ok: true, text: "Started User Login Management." },
  { ok: true, text: "Started System Logging Service." },
  { ok: true, text: "Reached target Multi-User System." },
  { ok: true, text: "Reached target Graphical Interface." },
  { ok: true, text: "Started Cargo Registry Cache." },
  { ok: true, text: "Started Rust Analyzer." },
];

export default function Boot() {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // reveal lines one by one
    bootLines.forEach((_, i) => {
      timers.push(setTimeout(() => setLines(i + 1), 120 + i * 90));
    });
    // start fade after all lines shown + pause
    timers.push(
      setTimeout(() => setFading(true), 120 + bootLines.length * 90 + 900)
    );
    timers.push(setTimeout(() => setVisible(false), 120 + bootLines.length * 90 + 1500));
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black px-6 font-mono text-xs leading-5 transition-opacity duration-700 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-2xl">
        {/* Arch header */}
        <div className="mb-6 flex gap-6">
          <pre className="hidden select-none text-[9px] leading-[9px] text-[#1793D1] sm:block">
{`                   -\`
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
     /ossss \`sooooo\`ossssssssssss/\`
    /ossss \`sooooo\`osssssssssssss/\`
   :ossss \`sooooo\`osssssssssssssso
  /ossss  \`soooo\` ossssssssssssssso
 /ossss   \`sooo\`  ossssssssssssssso`}
          </pre>
          <div className="flex-1">
            <p className="text-[#1793D1] font-bold">Arch Linux</p>
            <p className="text-zinc-600">6.10.3-arch1-1 · x86_64 · tty1</p>
            <div className="mt-3 space-y-0.5 text-zinc-300">
              <p>
                <span className="text-zinc-500">lokajith@arch</span>
                <span className="text-white"> ~</span> <span className="text-zinc-500">$</span> uname -r
              </p>
              <p className="text-zinc-500">6.10.3-arch1-1</p>
              <p className="mt-2">
                <span className="text-zinc-500">lokajith@arch</span>
                <span className="text-white"> ~</span> <span className="text-zinc-500">$</span> rustc --version
              </p>
              <p className="text-zinc-500">rustc 1.85.0 · backend · btw i use arch</p>
            </div>
          </div>
        </div>

        {/* boot log */}
        <div className="space-y-0.5 border-t border-zinc-900 pt-4">
          {bootLines.slice(0, lines).map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-emerald-400 font-bold">[  OK  ]</span>
              <span className="text-zinc-400">{l.text}</span>
            </div>
          ))}
          {lines === bootLines.length && (
            <p className="pt-3 text-zinc-500">
              <span className="text-zinc-300">lokajith@arch</span> ~ $ <span className="inline-block h-3 w-2 translate-y-0.5 animate-pulse bg-zinc-300" />
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] tracking-widest text-zinc-600">loading portfolio · niri + rust + linux</p>
      </div>
    </div>
  );
}
