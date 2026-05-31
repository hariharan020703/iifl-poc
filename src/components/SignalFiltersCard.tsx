import type { ParsedMetric } from "../types";

interface SignalFiltersCardProps {
  metrics: ParsedMetric[];
  activeSignalFilter: string | null;
  onSignalFilterToggle: (filter: string) => void;
}

export function SignalFiltersCard({
  activeSignalFilter,
  onSignalFilterToggle,
}: SignalFiltersCardProps) {

  return (
    <div className="w-full flex-1 lg:max-w-[calc(25%-12px)] flex items-center">
      {/* Tri-Color Equal Sized Segmented Bar */}
      <div className="h-10 w-full rounded-lg overflow-hidden flex border border-slate-150/60 dark:border-slate-900 shadow-inner bg-white dark:bg-slate-900">

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
        </button>

      </div>
    </div>
  );
}
