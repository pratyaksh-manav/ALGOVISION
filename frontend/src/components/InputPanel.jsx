const fieldLabels = {
  array: "Array / Values",
  target: "Target",
  operations: "Operations",
  graph: "Graph",
  start: "Start Node"
};

const placeholders = {
  array: "5,1,4,2,8",
  target: "15",
  operations: "push 5,push 9,pop",
  graph: "A:B,C;B:D,E;C:F",
  start: "A"
};

export default function InputPanel({ fields, values, onChange }) {
  return (
    <section className="glass-panel mesh-card rounded-[2.2rem] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Simulation Mode</p>
      <h3 className="font-display text-2xl text-ink">Custom Inputs</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">Change the input values and rerun to explore new execution paths.</p>
      <div className="mt-4 grid gap-3">
        {fields.map((field) => (
          <label key={field} className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">{fieldLabels[field]}</span>
            <input
              value={values[field] ?? ""}
              onChange={(event) => onChange(field, event.target.value)}
              placeholder={placeholders[field]}
              className="w-full rounded-[1.4rem] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky focus:bg-white"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
