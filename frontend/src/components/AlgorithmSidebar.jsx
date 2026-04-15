import { motion } from "framer-motion";

const grouped = (algorithms) =>
  algorithms.reduce((accumulator, algorithm) => {
    accumulator[algorithm.category] ??= [];
    accumulator[algorithm.category].push(algorithm);
    return accumulator;
  }, {});

export default function AlgorithmSidebar({ algorithms, selectedId, onSelect }) {
  const sections = grouped(algorithms);

  return (
    <aside className="glass-panel sticky top-6 rounded-[2.3rem] p-5">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Algorithms</p>
        <h2 className="font-display text-2xl text-ink">Learning Paths</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Browse by concept and jump between visual labs.</p>
      </div>
      <div className="space-y-5">
        {Object.entries(sections).map(([category, items]) => (
          <div key={category}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{category}</p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((algorithm) => {
                const active = algorithm.id === selectedId;
                return (
                  <motion.button
                    key={algorithm.id}
                    whileHover={{ x: 6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSelect(algorithm.id)}
                    className={`w-full rounded-[1.4rem] border px-4 py-3 text-left transition ${
                      active
                        ? "border-transparent bg-[linear-gradient(135deg,#f97316,#0f172a)] text-white shadow-lg"
                        : "border-slate-200/80 bg-white/75 text-slate-700 hover:border-sky hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{algorithm.name}</div>
                        <div className={`mt-1 text-xs ${active ? "text-orange-100" : "text-slate-400"}`}>
                          {algorithm.complexity.average} average time
                        </div>
                      </div>
                      <div
                        className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                          active ? "bg-white" : "bg-slate-300"
                        }`}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
