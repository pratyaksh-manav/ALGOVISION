import { motion } from "framer-motion";
import AlgorithmSidebar from "../components/AlgorithmSidebar";
import ComplexityPanel from "../components/ComplexityPanel";
import ControlBar from "../components/ControlBar";
import InputPanel from "../components/InputPanel";
import CodePanel from "../components/CodePanel";
import AITutorPanel from "../components/AITutorPanel";
import VisualizerCanvas from "../visualizations/VisualizerCanvas";
import { useSimulation } from "../hooks/useSimulation";

export default function Dashboard() {
  const simulation = useSimulation();

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 text-ink md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute bottom-12 left-1/3 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
      </div>
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative mx-auto mb-6 max-w-[1600px] overflow-hidden rounded-[2.75rem] p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_28%)]" />
        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
              ALGOVISION.AI
            </p>
            <p className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Interactive Learning Studio
            </p>
          </div>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px] xl:items-end">
            <div>
              <h1 className="max-w-4xl font-display text-4xl leading-[0.95] text-ink sm:text-5xl lg:text-7xl">
              Learn algorithms like a guided lab, not a static slide deck.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 lg:text-base">
                Explore searching, sorting, data structures, and graph traversal with animated state changes,
                complexity breakdowns, and an AI tutor that explains every move without turning the UI into a dead textbook.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Algorithms</div>
                  <div className="font-display text-2xl text-ink">{simulation.algorithms.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Tutor Mode</div>
                  <div className="font-display text-2xl text-ink">Live + Instant</div>
                </div>
              </div>
            </div>
            <div className="mesh-card rounded-[2rem] border border-slate-200/70 p-5">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Current Session</div>
              <div className="mt-3 rounded-[1.5rem] bg-slate-950 px-5 py-5 text-white">
                <div className="text-sm text-slate-400">Selected</div>
                <div className="mt-1 font-display text-3xl">{simulation.selectedAlgorithm?.name}</div>
                <div className="mt-3 text-sm text-slate-300">
                  Avg complexity: {simulation.selectedAlgorithm?.complexity?.average}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative mx-auto grid max-w-[1720px] gap-6 xl:grid-cols-[280px_minmax(0,1fr)_480px] 2xl:grid-cols-[300px_minmax(0,1fr)_540px]">
        <AlgorithmSidebar
          algorithms={simulation.algorithms}
          selectedId={simulation.selectedId}
          onSelect={simulation.setSelectedId}
        />

        <main className="space-y-6">
          <VisualizerCanvas algorithmId={simulation.selectedId} step={simulation.currentStep} />
          <ControlBar
            isPlaying={simulation.isPlaying}
            isLoading={simulation.isLoading}
            speed={simulation.speed}
            speedOptions={simulation.speedOptions}
            onSpeedChange={simulation.setSpeed}
            onPlayPause={() => simulation.setIsPlaying((value) => !value)}
            onNext={simulation.nextStep}
            onReset={simulation.reset}
            onRun={simulation.rerun}
          />
          {simulation.error && (
            <div className="glass-panel rounded-2xl border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700">
              {simulation.error}
            </div>
          )}
          <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
            <InputPanel
              fields={simulation.selectedAlgorithm?.inputSchema ?? []}
              values={simulation.inputValues[simulation.selectedId] ?? {}}
              onChange={simulation.updateInput}
            />
            <ComplexityPanel algorithm={simulation.selectedAlgorithm} currentStep={simulation.currentStep} />
          </div>
          <CodePanel algorithm={simulation.selectedAlgorithm} />
        </main>

        <AITutorPanel
          algorithm={simulation.selectedAlgorithm}
          currentStep={simulation.currentStep}
          steps={simulation.steps}
        />
      </div>
    </div>
  );
}
