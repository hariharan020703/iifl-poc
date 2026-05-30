import type { ParsedMetric } from "../types";
import { MonthSelector } from "./MonthSelector";

interface DashboardHeaderProps {
  metrics: ParsedMetric[];
  availableMonths: string[];
  selectedMonth: string | null;
  onMonthChange: (month: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  activeSignalFilter: string | null;
  onSignalFilterToggle: (filter: string) => void;
}

export function DashboardHeader({
  metrics,
  availableMonths,
  selectedMonth,
  onMonthChange,
  isDark,
  onThemeToggle,
  activeSignalFilter,
  onSignalFilterToggle,
}: DashboardHeaderProps) {
  const total   = metrics.length;
  const greens  = metrics.filter((m) => m.signal === "green").length;
  const reds    = metrics.filter((m) => m.signal === "red").length;
  const ambers  = metrics.filter((m) => m.signal === "amber").length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-100 dark:bg-slate-950/70 dark:border-slate-900/80 backdrop-blur-xl transition-all duration-200 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      {/* Top bar */}
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between gap-6 flex-wrap">

        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white dark:bg-red-500/10 dark:border dark:border-red-500/40 dark:text-red-500 flex items-center justify-center shadow dark:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-200">
            <span className="font-black text-[11px] tracking-tight leading-none">IIFL</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight transition-colors">Digital Loans Review</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase leading-tight mt-0.5 transition-colors">Management Dashboard</p>
          </div>
        </div>

        {/* Signal summary */}
        {total > 0 && (
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onSignalFilterToggle("all")}
              className={`text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer select-none py-1.5 px-3 rounded-xl border ${
                activeSignalFilter === null
                  ? "text-slate-800 border-slate-200 bg-slate-50 dark:text-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm"
                  : "text-slate-400 border-transparent hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350"
              }`}
              title="Clear active signal filter and show all"
            >
              Overview: {total} Metrics
            </button>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 transition-colors" />
            <Pill
              color="emerald"
              count={greens}
              label="On Track"
              isSelected={activeSignalFilter === "green"}
              isAnySelected={activeSignalFilter !== null}
              onClick={() => onSignalFilterToggle("green")}
            />
            <Pill
              color="amber"
              count={ambers}
              label="Monitor"
              isSelected={activeSignalFilter === "amber"}
              isAnySelected={activeSignalFilter !== null}
              onClick={() => onSignalFilterToggle("amber")}
            />
            <Pill
              color="red"
              count={reds}
              label="Off Track"
              isSelected={activeSignalFilter === "red"}
              isAnySelected={activeSignalFilter !== null}
              onClick={() => onSignalFilterToggle("red")}
            />
          </div>
        )}

        {/* Right side: month selector & theme toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <MonthSelector
            months={availableMonths}
            selected={selectedMonth}
            onChange={onMonthChange}
          />
          
          <button
            onClick={onThemeToggle}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-650 transition-all dark:bg-slate-900/40 dark:border-slate-800 dark:text-cyan-400 dark:hover:border-slate-700 shadow-sm active:scale-95 cursor-pointer"
            title={isDark ? "Switch to Corporate Light" : "Switch to 2050 Cyberpunk HUD"}
          >
            <span className="text-sm leading-none">{isDark ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

interface PillProps {
  color: "emerald" | "amber" | "red";
  count: number;
  label: string;
  isSelected: boolean;
  isAnySelected: boolean;
  onClick: () => void;
}

function Pill({ color, count, label, isSelected, isAnySelected, onClick }: PillProps) {
  const styles: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20 dark:shadow-[0_0_10px_rgba(16,185,129,0.06)]",
    amber:   "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-500/20 dark:shadow-[0_0_10px_rgba(245,158,11,0.06)]",
    red:     "bg-red-50 text-red-700 border-red-150 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-500/20 dark:shadow-[0_0_10px_rgba(244,63,94,0.06)]",
  };
  const dots: Record<string, string> = {
    emerald: "bg-emerald-500 dark:shadow-[0_0_6px_#10b981]",
    amber:   "bg-amber-500 dark:shadow-[0_0_6px_#f59e0b]",
    red:     "bg-rose-500 dark:bg-rose-500 dark:shadow-[0_0_6px_#f43f5e] animate-pulse",
  };

  const activeBorder: Record<string, string> = {
    emerald: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400 dark:ring-emerald-400/20",
    amber:   "border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-400 dark:ring-amber-400/20",
    red:     "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-450 dark:ring-rose-450/20",
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 cursor-pointer select-none active:scale-95
        ${styles[color]}
        ${isSelected ? activeBorder[color] : "border-transparent opacity-80"}
        ${isAnySelected && !isSelected ? "opacity-35 scale-95" : "hover:opacity-100 hover:scale-102"}
      `}
      title={`Filter by ${label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[color]}`} />
      {count} {label}
    </button>
  );
}
