"use client";
import { useEffect, useMemo, useState } from "react";

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
  const [phase, setPhase] = useState<"shake" | "disintegrate" | "panic">("shake");

  const pixels = useMemo(() => {
    const cols = 40;
    const rows = 24;
    const total = cols * rows;
    return Array.from({ length: total }, (_, i) => {
      const delay = Math.random() * 2200;
      const isArtifact = Math.random() < 0.06;
      const artifactColor = isArtifact
        ? ["#ff0040", "#00ffea", "#7c5cff", "#ffbd2e", "#00ff41"][Math.floor(Math.random() * 5)]
        : "#000";
      return { id: i, delay, isArtifact, artifactColor };
    });
  }, []);

  useEffect(() => {
    const onNuke = () => {
      setNuked(true);
      setPhase("shake");
      document.documentElement.classList.add("nuked");
      document.body.style.overflow = "hidden";
      setTimeout(() => setPhase("disintegrate"), 450);
      setTimeout(() => setPhase("panic"), 3400);
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
        html.nuked { filter: contrast(1.25) hue-rotate(-4deg) saturate(0.5) blur(0.4px); }
        html.nuked body { pointer-events: none; overflow: hidden !important; image-rendering: pixelated; }
        html.nuked * { cursor: not-allowed !important; }
        html.nuked nav, html.nuked header, html.nuked section, html.nuked footer { filter: grayscale(0.8) brightness(0.55) contrast(1.2); }
        @keyframes globalShake { 0%{transform:translate(0,0)} 20%{transform:translate(-4px,2px)} 40%{transform:translate(4px,-2px)} 60%{transform:translate(-3px,-1px)} 80%{transform:translate(3px,1px)} 100%{transform:translate(0,0)} }
        @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.86} }
        @keyframes pixelDie { 0%{opacity:0; transform:scale(1)} 100%{opacity:1; transform:scale(1)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes artifactFlicker { 0%,100%{opacity:0} 10%{opacity:0.9} 20%{opacity:0} 50%{opacity:0.7} }
      `}</style>

      {/* shake phase - brief violent shake */}
      {phase === "shake" && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center pointer-events-none" style={{ animation: "globalShake 0.09s ease-in-out infinite, flicker 0.12s infinite" }}>
          <div className="font-mono text-xs text-red-400 text-center">
            <p className="text-sm font-bold tracking-widest">rm: removing &apos;/&apos; recursively</p>
            <p className="mt-2 text-[11px] text-zinc-300">gpu: niri compositor lost — wayland connection severed</p>
            <p className="mt-1 text-[10px] text-red-500">drm: GPU HANG — ecode 9:1:0x85dffffb</p>
          </div>
        </div>
      )}

      {/* disintegrate phase — every element vanishes pixel by pixel */}
      {phase === "disintegrate" && (
        <>
          {/* base violent shake + flicker on whole page */}
          <div className="fixed inset-0 z-[91] pointer-events-none" style={{ animation: "globalShake 0.11s ease-in-out infinite" }} />
          {/* pixel grid that eats the screen block by block */}
          <div className="fixed inset-0 z-[92] grid pointer-events-none" style={{ gridTemplateColumns: "repeat(40, 1fr)", gridTemplateRows: "repeat(24, 1fr)" }}>
            {pixels.map((p) => (
              <div
                key={p.id}
                className="pointer-events-none"
                style={{
                  background: p.isArtifact ? p.artifactColor : "#000",
                  opacity: 0,
                  animation: `pixelDie 120ms forwards`,
                  animationDelay: `${p.delay}ms`,
                  boxShadow: p.isArtifact ? `0 0 6px ${p.artifactColor}` : undefined,
                }}
              />
            ))}
          </div>
          {/* scanlines — gpu driver death vibe */}
          <div className="fixed inset-0 z-[93] pointer-events-none opacity-[0.12]" style={{ background: `repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #fff 2px, #fff 3px)`, mixBlendMode: "overlay" }} />
          <div className="fixed inset-0 z-[93] pointer-events-none overflow-hidden opacity-30">
            <div className="h-[2px] w-full bg-cyan-400/60" style={{ animation: "scanline 0.9s linear infinite" }} />
            <div className="h-[1px] w-full bg-red-500/40 mt-[40vh]" style={{ animation: "scanline 1.1s linear infinite reverse" }} />
          </div>
          {/* random artifact flashes */}
          <div className="fixed inset-0 z-[94] pointer-events-none font-mono text-[9px] leading-3 p-4 opacity-80" style={{ animation: "artifactFlicker 0.35s steps(4) infinite" }}>
            <span className="text-cyan-400">▓▓▓ GPU FAULT ▓▓▓</span> <span className="text-red-400">VRAM corrupted</span> — <span className="text-white bg-red-600 px-1">niri: output disappeared</span>
          </div>
          <div className="fixed bottom-4 left-4 z-[94] pointer-events-none font-mono text-[10px] text-white/70">
            <p>pixel disintegration: {(pixels.length)} blocks · wayland compositor: <span className="text-red-400">dead</span></p>
            <p className="text-zinc-500">fish: process 1337 terminated — I/O error</p>
          </div>
        </>
      )}

      {phase === "panic" && (
        <div className="fixed inset-0 z-[99] bg-black p-4 sm:p-8 font-mono text-xs leading-5 overflow-y-auto flex flex-col pointer-events-auto" style={{ animation: "flicker 0.16s infinite", imageRendering: "pixelated" }}>
          {/* pixelated top bar like dead gpu */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-red-600 via-cyan-400 to-red-600 opacity-60" style={{ imageRendering: "pixelated" }} />
          <div className="max-w-3xl mx-auto w-full flex-1">
            <div className="rounded-none border-2 border-red-900/60 bg-zinc-950 overflow-hidden" style={{ boxShadow: "0 0 0 2px #000, 4px 4px 0 #ff0040" }}>
              <div className="flex items-center gap-1.5 border-b-2 border-red-900/40 bg-red-950/30 px-4 py-2">
                <span className="h-3 w-3 rounded-none bg-red-500 animate-pulse" style={{ imageRendering: "pixelated" }} />
                <span className="h-3 w-3 bg-yellow-500/60" />
                <span className="h-3 w-3 bg-green-500/60" />
                <span className="ml-3 text-xs text-red-400 tracking-widest">GPU HANG — SYSTEM HALTED</span>
                <span className="ml-auto text-[10px] text-red-800 hidden sm:inline">niri: no outputs · fish: no tty · drm: wedged</span>
              </div>
              <div className="p-6">
                {KERNEL_LINES.map((l, i) => (
                  <div key={i} className={`${i === 0 ? "text-red-500 font-bold" : "text-zinc-500"} ${i === 0 ? "text-sm" : ""}`}>
                    {l}
                  </div>
                ))}
                <div className="mt-4 p-2 bg-black border border-zinc-800 text-[10px] text-zinc-600 leading-4">
                  <p className="text-red-400">[drm] *ERROR* Atomic update failure on pipe A</p>
                  <p>[drm] *ERROR* GPU HANG: ecode 9:1:0x85dffffb</p>
                  <p className="text-cyan-400">niri[420]: wayland: compositor terminated — no GPU</p>
                  <p>fish[1337]: I/O error — cannot read / — filesystem vanished</p>
                </div>
                <div className="mt-6 border-t-2 border-zinc-800 pt-4">
                  <p className="text-white font-bold tracking-tight">you <span className="bg-red-600 text-white px-1">rm -rf / --no-preserve-root</span> and the gpu died</p>
                  <p className="mt-2 text-zinc-400">every pixel vanished block by block — like a real driver wedge. niri lost all outputs, fish lost its tty, wayland is gone.</p>
                  <p className="mt-2 text-zinc-500 text-[11px]">filesystem: <span className="text-red-400">vanished</span> · pixels: <span className="text-red-400">dead</span> · compositor: <span className="text-red-400">niri — no GPU</span> · shell: <span className="text-red-400">fish — no I/O</span></p>
                  <div className="mt-4 font-mono text-[11px] text-zinc-600">
                    <p>$ ls projects/</p>
                    <p className="text-red-400">ls: cannot access &apos;projects/&apos;: I/O error — pixel buffer lost</p>
                    <p className="mt-1">$ niri msg outputs</p>
                    <p className="text-red-400">niri: failed to connect to wayland — No such file or directory</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("rmrf-reboot"))}
                      className="rounded-none border-2 border-white bg-white px-5 py-2.5 text-xs font-black tracking-widest text-black hover:bg-zinc-200 transition pointer-events-auto"
                      style={{ boxShadow: "3px 3px 0 #ff0040", imageRendering: "pixelated" }}
                    >
                      ↻ REBOOT
                    </button>
                    <button onClick={() => window.location.reload()} className="rounded-none border-2 border-zinc-700 bg-zinc-900 px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-white pointer-events-auto">
                      hard refresh
                    </button>
                  </div>
                  <p className="mt-3 text-[10px] text-zinc-600">next time maybe just <span className="text-[#1793D1]">sl</span> or <span className="text-[#1793D1]">man lokajith</span>?</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[10px] text-zinc-600 tracking-widest">arch linux 6.10.3 · niri · fish — <span className="text-red-800">GPU: wedged</span> · driver: dead</p>
        </div>
      )}
    </>
  );
}
