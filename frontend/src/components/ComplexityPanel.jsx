export default function ComplexityPanel({ algorithm, currentStep }) {
  return (
    <section className="glass-panel rounded-[2.2rem] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Complexity</p>
          <h3 className="font-display text-2xl text-ink">{algorithm.name}</h3>
        </div>
        <div className="rounded-full bg-[linear-gradient(135deg,#0f172a,#334155)] px-3 py-1 text-xs font-semibold text-white">
          {algorithm.category}
        </div>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600">{algorithm.explanation}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.6rem] border border-orange-100 bg-orange-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Best Case</p>
          <p className="mt-1 text-lg font-bold text-ink">{algorithm.complexity.best}</p>
        </div>
        <div className="rounded-[1.6rem] border border-sky-100 bg-sky-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Case</p>
          <p className="mt-1 text-lg font-bold text-ink">{algorithm.complexity.average}</p>
        </div>
        <div className="rounded-[1.6rem] border border-amber-100 bg-amber-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Worst Case</p>
          <p className="mt-1 text-lg font-bold text-ink">{algorithm.complexity.worst}</p>
        </div>
        <div className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Space</p>
          <p className="mt-1 text-lg font-bold text-ink">{algorithm.complexity.space}</p>
        </div>
      </div>
      <div className="mt-4 rounded-[1.8rem] border border-dashed border-slate-200 bg-white/75 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Step</p>
        <p className="mt-2 text-sm font-semibold text-ink">{currentStep?.title ?? "Ready"}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{currentStep?.description ?? "Run the simulation."}</p>
      </div>
    </section>
  );
}
