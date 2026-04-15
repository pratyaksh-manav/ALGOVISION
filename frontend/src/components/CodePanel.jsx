import { useState } from "react";

const tabs = [
  ["python", "Python"],
  ["cpp", "C++"],
  ["java", "Java"]
];

export default function CodePanel({ algorithm }) {
  const [language, setLanguage] = useState("python");

  return (
    <section className="overflow-hidden rounded-[2.2rem] border border-slate-800/70 bg-slate-950 p-5 text-white shadow-float">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Bonus</p>
          <h3 className="font-display text-2xl">Code Explorer</h3>
        </div>
        <div className="flex gap-2">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setLanguage(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                language === id ? "bg-[linear-gradient(135deg,#f97316,#fb7185)] text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[1.8rem] border border-slate-800 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_30%),rgba(2,6,23,0.6)] p-4">
        <pre className="overflow-x-auto font-mono text-sm leading-6 text-slate-200">
          <code>{algorithm.code[language]}</code>
        </pre>
      </div>
      <p className="mt-3 text-sm text-slate-400">
        The AI tutor can explain the selected code line by line from the current algorithm context.
      </p>
    </section>
  );
}
