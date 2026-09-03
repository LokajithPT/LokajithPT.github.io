import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl rounded-2xl border border-red-900/40 bg-zinc-950 overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-red-900/30 bg-red-950/20 px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <span className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-red-400">kernel panic — not syncing</span>
          </div>
          <div className="p-6 sm:p-8 text-xs leading-5 overflow-x-auto">
            <p className="text-red-400 font-bold">Kernel panic - not syncing: Attempted to kill init! exitcode=0x00007f00</p>
            <p className="mt-3 text-zinc-400">CPU: 0 PID: 1 Comm: page Not tainted 6.10.3-arch1-1 #1</p>
            <p className="text-zinc-500">Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)</p>
            <p className="mt-3 text-zinc-300">RIP: 0010:page_not_found+0x42/0x2a0</p>
            <p className="text-zinc-500">RSP: 0018:ffffc90000003e58 EFLAGS: 00000046</p>
            <p className="mt-3 text-zinc-400">Call Trace:</p>
            <p className="text-zinc-500 pl-2"> &lt;TASK&gt;</p>
            <p className="text-zinc-500 pl-4"> show_page+0x42/0xff</p>
            <p className="text-zinc-500 pl-4"> route_not_found+0x1a2/0x2b0</p>
            <p className="text-zinc-500 pl-4"> handle_404+0x88/0x120</p>
            <p className="text-zinc-500 pl-2"> &lt;/TASK&gt;</p>
            <p className="mt-3 text-red-400">---[ end Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0) ]---</p>

            <div className="mt-8 border-t border-zinc-800 pt-6">
              <p className="text-2xl font-black tracking-tighter text-white">404 <span className="text-zinc-600 font-normal">— page not found</span></p>
              <p className="mt-2 text-sm text-zinc-400">the page you&apos;re looking for has been <span className="text-red-400 font-mono">rm -rf&apos;d</span></p>
              <p className="mt-1 text-xs text-zinc-600">it probably never existed. like your motivation on monday mornings.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition">
                  ← back to /home/lokajith
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition">
                  reboot
                </Link>
              </div>
              <p className="mt-6 text-[11px] text-zinc-600">
                tip: try <span className="text-[#1793D1]">man lokajith</span> or <span className="text-[#1793D1]">sl</span> in the terminal — if you can find it.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-[11px] text-zinc-600">arch linux 6.10.3-arch1-1 · lokajith@arch · <span className="text-zinc-500">btw i use arch</span></p>
      </div>
    </div>
  );
}
