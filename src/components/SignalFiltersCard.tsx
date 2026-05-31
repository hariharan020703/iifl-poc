import type { ParsedMetric } from "../types";

interface SignalFiltersCardProps {
  metrics: ParsedMetric[];
  activeSignalFilter: string | null;
  onSignalFilterToggle: (filter: string) => void;
}

export function SignalFiltersCard({
  metrics,
  activeSignalFilter,
  onSignalFilterToggle,
}: SignalFiltersCardProps) {
  const greens = metrics.filter((m) => m.signal === "green").length;
  const ambers = metrics.filter((m) => m.signal === "amber").length;
  const reds = metrics.filter((m) => m.signal === "red").length;

  return (
    <div className="w-full flex-1 lg:max-w-[calc(25%-12px)] bg-white dark:bg-slate-900 rounded-xl border border-slate-150/60 dark:border-slate-900 p-3.5 shadow-sm hover:shadow-md transition-all duration-300">

      {/* Tri-Color Equal Sized Segmented Bar */}
      <div className="h-12 w-full rounded-lg overflow-hidden flex border border-slate-150/40 dark:border-slate-900/80 shadow-inner">

        {/* On Track Bar */}
        <button
          onClick={() => onSignalFilterToggle("green")}
          className={`flex-1 h-full transition-all duration-300 relative flex items-center justify-center cursor-pointer border-r border-slate-200/20 dark:border-slate-900/20 last:border-none ${activeSignalFilter === "green"
              ? "bg-emerald-600 dark:bg-emerald-500 shadow-[inset_0_0_12px_rgba(0,0,0,0.15)]"
              : activeSignalFilter !== null
                ? "bg-emerald-600/20 dark:bg-emerald-500/10 hover:bg-emerald-600/30"
                : "bg-emerald-600 hover:bg-emerald-705 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            }`}
          title="Filter by On Track"
        >
          <span className={`text-sm font-black tracking-tight transition-colors ${activeSignalFilter === "green"
              ? "text-white drop-shadow-sm"
              : activeSignalFilter !== null
                ? "text-emerald-600/60 dark:text-emerald-400/40"
                : "text-white drop-shadow-sm"
            }`}>
            {greens}
          </span>
        </button>

        {/* Monitor Bar */}
        <button
          onClick={() => onSignalFilterToggle("amber")}
          className={`flex-1 h-full transition-all duration-300 relative flex items-center justify-center cursor-pointer border-r border-slate-200/20 dark:border-slate-900/20 last:border-none ${activeSignalFilter === "amber"
              ? "bg-amber-500 dark:bg-amber-500 shadow-[inset_0_0_12px_rgba(0,0,0,0.15)]"
              : activeSignalFilter !== null
                ? "bg-amber-500/20 dark:bg-amber-500/10 hover:bg-amber-500/30"
                : "bg-amber-500 hover:bg-amber-605 dark:bg-amber-500 dark:hover:bg-amber-600"
            }`}
          title="Filter by Monitor"
        >
          <span className={`text-sm font-black tracking-tight transition-colors ${activeSignalFilter === "amber"
              ? "text-white drop-shadow-sm"
              : activeSignalFilter !== null
                ? "text-amber-600/60 dark:text-amber-400/40"
                : "text-white drop-shadow-sm"
            }`}>
            {ambers}
          </span>
        </button>

        {/* Off Track Bar */}
        <button
          onClick={() => onSignalFilterToggle("red")}
          className={`flex-1 h-full transition-all duration-300 relative flex items-center justify-center cursor-pointer ${activeSignalFilter === "red"
              ? "bg-rose-600 dark:bg-rose-600 shadow-[inset_0_0_12px_rgba(0,0,0,0.15)]"
              : activeSignalFilter !== null
                ? "bg-rose-600/20 dark:bg-rose-600/10 hover:bg-rose-600/30"
                : "bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500"
            }`}
          title="Filter by Off Track"
        >
          <span className={`text-sm font-black tracking-tight transition-colors ${activeSignalFilter === "red"
              ? "text-white drop-shadow-sm"
              : activeSignalFilter !== null
                ? "text-rose-600/60 dark:text-rose-400/40"
                : "text-white drop-shadow-sm"
            }`}>
            {reds}
          </span>
        </button>

      </div>

      {/* Text Labels Below Each Bar Respectively */}
      <div className="grid grid-cols-3 text-center mt-2 select-none font-black uppercase tracking-widest text-[9px]">
        {/* On Track Label */}
        <div className={`transition-all duration-350 ${activeSignalFilter === "green"
            ? "text-emerald-600 dark:text-emerald-400 scale-105"
            : activeSignalFilter !== null
              ? "text-slate-300 dark:text-slate-700 opacity-40 scale-95"
              : "text-emerald-600/80 dark:text-emerald-400/80 hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}>
          On Track
        </div>

        {/* Monitor Label */}
        <div className={`transition-all duration-350 ${activeSignalFilter === "amber"
            ? "text-amber-600 dark:text-amber-400 scale-105"
            : activeSignalFilter !== null
              ? "text-slate-300 dark:text-slate-700 opacity-40 scale-95"
              : "text-amber-600/80 dark:text-amber-400/80 hover:text-amber-600 dark:hover:text-amber-400"
          }`}>
          Monitor
        </div>

        {/* Off Track Label */}
        <div className={`transition-all duration-350 ${activeSignalFilter === "red"
            ? "text-rose-600 dark:text-rose-400 scale-105"
            : activeSignalFilter !== null
              ? "text-slate-300 dark:text-slate-700 opacity-40 scale-95"
              : "text-rose-600/80 dark:text-rose-400/80 hover:text-rose-600 dark:hover:text-rose-400"
          }`}>
          Off Track
        </div>
      </div>

    </div>
  );
}
