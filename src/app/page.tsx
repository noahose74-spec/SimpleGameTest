import Randomizer from "@/components/Randomizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-12">
        <header className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-2">
            ✨ Free & Simple
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 tracking-tight">
            Team Random Selector
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto font-medium">
            Paste a list of names or items. We&apos;ll pick one fairly, with style. Share the URL to keep everyone on the same page.
          </p>
        </header>

        <Randomizer />
      </div>
    </main>
  );
}
