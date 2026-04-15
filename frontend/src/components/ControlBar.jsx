export default function ControlBar({
  isPlaying,
  isLoading,
  speed,
  speedOptions,
  onSpeedChange,
  onPlayPause,
  onNext,
  onReset,
  onRun
}) {
  const buttonClass =
    "rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[2rem] p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          className={`${buttonClass} bg-[linear-gradient(135deg,#0f172a,#334155)] text-white`}
          onClick={onPlayPause}
          disabled={isLoading}
        >
        {isPlaying ? "Pause" : "Play"}
        </button>
        <button className={`${buttonClass} bg-[linear-gradient(135deg,#0ea5e9,#0369a1)] text-white`} onClick={onNext} disabled={isLoading}>
        Next Step
        </button>
        <button className={`${buttonClass} border border-slate-200 bg-white text-slate-700`} onClick={onReset} disabled={isLoading}>
        Reset
        </button>
        <button className={`${buttonClass} bg-[linear-gradient(135deg,#f97316,#fb7185)] text-white`} onClick={onRun} disabled={isLoading}>
        {isLoading ? "Running..." : "Run Simulation"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Controls
        </div>
        <div className="flex items-center gap-2 rounded-[1.3rem] border border-slate-200 bg-white px-3 py-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Speed</span>
          <div className="flex gap-1">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSpeedChange(option.value)}
                disabled={isLoading}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  speed === option.value
                    ? "bg-[linear-gradient(135deg,#f97316,#fb7185)] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
