import type { ParsedMetric } from "../types";
import { MetricCard } from "./MetricCard";
import { CATEGORY_COLORS } from "../data/sections";

interface CategoryGroupProps {
  category: string;
  metrics: ParsedMetric[];
}

export function CategoryGroup({ category, metrics }: CategoryGroupProps) {
  if (!metrics.length) return null;

  const accentColor = CATEGORY_COLORS[category] ?? "#64748B";

  // Group metrics by their sub-metric value (e.g. SBL, Flow Rate)
  const groups: Record<string, ParsedMetric[]> = {};
  const groupOrder: string[] = [];

  for (const m of metrics) {
    const groupName = m.metrics || "General";
    if (!groups[groupName]) {
      groups[groupName] = [];
      groupOrder.push(groupName);
    }
    groups[groupName].push(m);
  }

  return (
    <div className="mb-12 animate-fadeIn">
      {/* Sub-groups based on the Metrics column */}
      <div className="space-y-12">
        {groupOrder.map((groupName) => {
          const groupMetrics = groups[groupName];
          const groupRed = groupMetrics.filter((m) => m.signal === "red").length;
          const groupGreen = groupMetrics.filter((m) => m.signal === "green").length;

          return (
            <div key={groupName} className="animate-fadeIn">
              {/* Sub-group header (Highlighted as section title) */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div
                  className="w-1.5 h-5 rounded-full flex-shrink-0 shadow-[0_0_10px_currentColor]"
                  style={{ backgroundColor: accentColor, color: accentColor }}
                />
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                  {groupName}
                </h4>

                {/* Micro stats for the sub-group */}
                <div className="flex items-center gap-2 flex-wrap">
                  {groupGreen > 0 && (
                    <span className="text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {groupGreen} On Track
                    </span>
                  )}
                  {groupRed > 0 && (
                    <span className="text-[9px] font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-150 dark:border-rose-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      {groupRed} Off Track
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider ml-1">
                    ({groupMetrics.length} metrics)
                  </span>
                </div>

                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-900" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {groupMetrics.map((m, i) => (
                  <MetricCard key={`${m.category}-${groupName}-${m.metricName}-${i}`} metric={m} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
