"use client";
import { useEffect, useState } from "react";

const KERNEL_LINES = [
  "Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)",
  "CPU: 0 PID: 1 Comm: rm Not tainted 6.10.3-arch1-1 #1",
  "Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)",
  "Call Trace:",
  " <TASK>",
  "  dump_stack+0x8f/0xd0",
  "  panic+0x12e/0x2f3",
  "  mount_block_root+0x1a2/0x2a0",
  "  prepare_namespace+0x132/0x170",
  "  kernel_init+0x12a/0x130",
  "  ret_from_fork+0x22/0x30",
  " </TASK>",
  "---[ end Kernel panic - not syncing ]---",
];

export default function GlobalNuke() {
  const [nuked, setNuked] = useState(false);
  const [phase, setPhase] = useState<"shake" | "panic">("shake");

  useEffect(() => {
    const onNuke = () => {
      setNuked(true);
      setPhase("shake");
      document.documentElement.classList.add("nuked");
      document.body.style.overflow = "hidden";
      // after 1.1s show panic (synced with Terminal.tsx timeout)
      setTimeout(() => setPhase("panic"), 1100);
    };
    const onReboot = () => {
      setNuked(false);
      setPhase("shake");
      document.documentElement.classList.remove("nuked");
      document.body.style.overflow = "";
    };
    window.addEventListener("rmrf-nuke", onNuke as EventListener);
    window.addEventListener("rmrf-reboot", onReboot as EventListener);
    return () => {
      window.removeEventListener("rmrf-nuke", onNuke as EventListener);
      window.removeEventListener("rmrf-reboot", onReboot as EventListener);
      document.documentElement.classList.remove("nuked");
      document.body.style.overflow = "";
    };
  }, []);

  if (!nuked) return null;

  return (
    <>
      <style>{`
        html.nuked { filter: contrast(1.15) hue-rotate(-6deg) saturate(0.6) blur(0.3px); animation: globalShake 0.12s ease-in-out infinite; }
        html.nuked body { pointer-events: none; overflow: hidden !important; }
        html.nuked * { cursor: not-allowed !important; }
        html.nuked nav, html.nuked header, html.nuked section, html.nuked footer { filter: grayscale(0.7) brightness(0.6); opacity: 0.45; pointer-events: none; }
        @keyframes globalShake { 0%{transform:translate(0,0)} 20%{transform:translate(-3px,2px)} 40%{transform:translate(3px,-2px)} 60%{transform:translate(-2px,-1px)} 80%{transform:translate(2px,1px)} 100%{transform:translate(0,0)} }
        @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.88} }
        @keyframes glitch { 0%{transform:translate(0)} 20%{transform:translate(-1px,0)} 40%{transform:translate(1px,0)} 60%{transform:translate(0,1px)} 80%{transform:translate(0,-1px)} 100%{transform:translate(0)} }
      `}</style>
      {/* global shake overlay - covers everything, pointer-events none during shake phase makes it feel frozen */}
      {phase === "shake" && (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none" style={{ animation: "globalShake 0.12s ease-in-out infinite, flicker 0.15s infinite" }}>
          <div className="font-mono text-xs text-red-400 text-center">
            <p className="animate-pulse">deleting / ...</p>
            <p className="mt-2 text-[10px] text-zinc-500">EXT4-fs error: �I/O� filesystem corrupted</p>
          </div>
        </div>
      )}
      {phase === "panic" && (
        <div className="fixed inset-0 z-[99] bg-black/95 backdrop-blur-sm p-4 sm:p-8 font-mono text-xs leading-5 overflow-y-auto flex flex-col pointer-events-auto" style={{ animation: "flicker 0.14s infinite" }}>
          <div className="max-w-3xl mx-auto w-full flex-1">
            <div className="rounded-2xl border border-red-900/40 bg-zinc-950 overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-red-900/30 bg-red-950/20 px-4 py-2">
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-red-400">kernel panic — system halted</span>
                <span className="ml-auto text-[10px] text-red-800">initramfs — niri/fish session killed</span>
              </div>
              <div className="p-6">
                {KERNEL_LINES.map((l, i) => (
                  <div key={i} className={`${i === 0 ? "text-red-500 font-bold" : "text-zinc-500"} ${i === 0 ? "text-sm" : ""}`} style={{ animation: i < 2 ? "glitch 0.2s infinite" : undefined }}>
                    {l}
                  </div>
                ))}
                <div className="mt-6 border-t border-zinc-800 pt-4">
                  <p className="text-white font-bold">you just <span className="text-red-400">rm -rf / --no-preserve-root</span></p>
                  <p className="mt-2 text-zinc-400">what did you expect to happen? every element is now frozen. niri is dead. fish is dead. your projects are gone (not really).</p>
                  <p className="mt-2 text-zinc-500 text-[11px]">filesystem: <span className="text-red-400">corrupted</span> · inodes: <span className="text-red-400">wiped</span> · projects: <span className="text-red-400">unreachable</span> · cursor: <span className="text-red-400">not-allowed</span></p>
                  <div className="mt-4 font-mono text-[11px] text-zinc-600">
                    <p>$ ls projects/</p>
                    <p className="text-red-400">ls: cannot access &apos;projects/&apos;: Input/output error</p>
                    <p className="mt-1">$ whoami</p>
                    <p className="text-red-400">whoami: cannot find name for user ID 1000 — �</p>
                    <p className="mt-1">$ pwd</p>
                    <p className="text-red-400">/dev/null</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("rmrf-reboot"));
                        // also tell Terminal to reset via same event (Terminal listens to rmrf-reboot)
                      }}
                      className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition pointer-events-auto"
                    >
                      ↻ reboot — undo rm -rf /
                    </button>
                    <button onClick={() => window.location.reload()} className="rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-white pointer-events-auto">
                      hard refresh (F5)
                    </button>
                  </div>
                  <p className="mt-3 text-[10px] text-zinc-600">tip: next time try <span className="text-[#1793D1]">man lokajith</span> instead of deleting the OS, nerd.</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[10px] text-zinc-700">arch linux 6.10.3-arch1-1 · niri · fish — btw i use arch (not anymore)</p>
        </div>
      )}
    </>
  );
}
