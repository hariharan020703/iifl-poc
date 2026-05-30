import type { SignalColor, TrendDirection } from "../types";
import { formatPctChange } from "../utils/metricHelpers";

interface SignalBadgeProps {
  signal: SignalColor;
  trend: TrendDirection;
  pctChange: number | null;
  size?: "sm" | "md";
}

const CONFIG: Record<SignalColor, { badge: string; dot: string }> = {
  green:   { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  red:     { badge: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500"     },
  amber:   { badge: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
  neutral: { badge: "bg-slate-100 text-slate-500 border-slate-200",      dot: "bg-slate-400"   },
};

const ARROW: Record<TrendDirection, string> = {
  up:   "↑",
  down: "↓",
  flat: "→",
};

export function SignalBadge({ signal, trend, pctChange, size = "md" }: SignalBadgeProps) {
  const c = CONFIG[signal];
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border rounded-full font-semibold
        ${textSize} ${c.badge}
        ${size === "sm" ? "px-1.5 py-0.5" : "px-2.5 py-0.5"}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      <span>{ARROW[trend]} {formatPctChange(pctChange)}</span>
    </span>
  );
}
