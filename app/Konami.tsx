"use client";
import { useEffect, useState } from "react";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function Konami() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let pos = 0;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = CODE[pos].toLowerCase();
      if (key === expected) {
        pos++;
        if (pos === CODE.length) {
          pos = 0;
          setActive(true);
          setCount((c) => c + 1);
          setTimeout(() => setActive(false), 3200);
        }
      } else {
        pos = key === CODE[0].toLowerCase() ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 font-mono animate-[flicker_0.12s_infinite]">
      <style>{`@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.92}} @keyframes scrollUp{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}`}</style>
      <div className="text-center">
        <pre className="text-[7px] leading-[7px] sm:text-[8px] sm:leading-[8px] text-[#1793D1] select-none">
{`                  -\\                 .o+\`
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
        <p className="mt-4 text-lg font-black tracking-tighter text-white">
          BTW <span className="text-[#1793D1]">I USE ARCH</span> BTW
        </p>
        <p className="mt-1 text-xs text-zinc-400">konami code activated · you found the arch way {count > 1 ? `×${count}` : ""}</p>
        <p className="mt-2 text-[11px] text-zinc-600">psst — try <span className="text-zinc-300">man lokajith</span> or <span className="text-zinc-300">rm -rf /</span> in the terminal (i dare you)</p>
        <button
          onClick={() => setActive(false)}
          className="mt-6 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white"
        >
          close (or wait 3s)
        </button>
      </div>
    </div>
  );
}
