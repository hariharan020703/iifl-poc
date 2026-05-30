import type { ParsedMetric } from "../types";
import { formatPctChange } from "../utils/metricHelpers";

interface MetricCardProps {
  metric: ParsedMetric;
}

const THEMES: Record<string, {
  cardBg: string;
  hoverBorder: string;
  dotBg: string;
  dotGlow: string;
  valueColor: string;
  pctBg: string;
}> = {
  green: {
    cardBg: "bg-emerald-50/10 border-emerald-100/60 dark:bg-emerald-950/10 dark:border-emerald-500/10",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-500/40 dark:hover:shadow-[0_0_22px_rgba(16,185,129,0.12)]",
    dotBg: "bg-emerald-500 dark:bg-emerald-400",
    dotGlow: "shadow-emerald-500/20 dark:shadow-emerald-400/50 dark:ring-emerald-400/20",
    valueColor: "text-emerald-700 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]",
    pctBg: "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  red: {
    cardBg: "bg-red-50/10 border-red-100/60 dark:bg-rose-950/10 dark:border-rose-500/10",
    hoverBorder: "hover:border-red-200 dark:hover:border-rose-500/40 dark:hover:shadow-[0_0_22px_rgba(244,63,94,0.12)]",
    dotBg: "bg-red-500 dark:bg-rose-400",
    dotGlow: "shadow-red-500/20 dark:shadow-rose-400/50 dark:ring-rose-400/20",
    valueColor: "text-red-700 dark:text-rose-400 dark:drop-shadow-[0_0_8px_rgba(251,113,133,0.2)]",
    pctBg: "bg-red-50 text-red-700 border-red-150 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500/20",
  },
  amber: {
    cardBg: "bg-amber-50/10 border-amber-100/60 dark:bg-amber-950/10 dark:border-amber-500/10",
    hoverBorder: "hover:border-amber-250 dark:hover:border-amber-500/40 dark:hover:shadow-[0_0_22px_rgba(245,158,11,0.12)]",
    dotBg: "bg-amber-500 dark:bg-amber-400",
    dotGlow: "shadow-amber-500/20 dark:shadow-amber-400/50 dark:ring-amber-400/20",
    valueColor: "text-amber-700 dark:text-amber-400 dark:drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]",
    pctBg: "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/20",
  },
  neutral: {
    cardBg: "bg-slate-50/40 border-slate-100 dark:bg-slate-900/10 dark:border-slate-800/80",
    hoverBorder: "hover:border-slate-200 dark:hover:border-slate-700/60 dark:hover:shadow-[0_0_22px_rgba(148,163,184,0.08)]",
    dotBg: "bg-slate-450 dark:bg-slate-400",
    dotGlow: "shadow-slate-450/10 dark:shadow-slate-400/50 dark:ring-slate-400/10",
    valueColor: "text-slate-855 dark:text-slate-100",
    pctBg: "bg-slate-50 text-slate-500 border-slate-150 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-850",
  },
};

export function MetricCard({ metric }: MetricCardProps) {
  const t = THEMES[metric.signal] || THEMES.neutral;
  const pctString = formatPctChange(metric.pctChange);

  return (
    <div
      className={`
        group relative flex items-center justify-between p-5 rounded-2xl border
        transition-all duration-300 ${t.cardBg} ${t.hoverBorder}
        hover:-translate-y-0.5 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]
        bg-white dark:backdrop-blur-md
      `}
    >
      {/* Left accent border-indicator */}
      <div
        className={`absolute top-4 bottom-4 left-0 w-1 rounded-r-full transition-all duration-300 ${t.dotBg}`}
      />

      {/* Left side: Name and previous value */}
      <div className="flex-1 pr-4 pl-2.5">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
          {metric.metricName}
        </h4>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-3 transition-colors">
          Prev: <span className="font-mono text-slate-600 dark:text-slate-350">{metric.formattedPrevious}</span>
        </p>
      </div>

      {/* Right side: Current Month Value, percentage diff, and custom indicator rings */}
      <div className="flex flex-col items-end justify-center flex-shrink-0 text-right">
        {/* Current Month Value (standard corporate vs neon HUD text) */}
        <span className={`text-2xl font-black font-mono tracking-tight leading-none transition-colors ${t.valueColor}`}>
          {metric.formattedCurrent}
        </span>

        {/* Pct Change & Indicator */}
        <div className="flex items-center gap-2.5 mt-2.5">
          {metric.pctChange !== null && (
            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg border transition-colors ${t.pctBg}`}>
              {pctString}
            </span>
          )}

          {/* Glowing breathing indicator in dark mode, clean circle in light mode */}
          <div className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
            {metric.signal !== "neutral" && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 dark:inline-flex hidden ${t.dotBg}`} />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${t.dotBg} ${t.dotGlow}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
