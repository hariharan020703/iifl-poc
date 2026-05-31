import type { ParsedMetric } from "../types";
import { CATEGORY_COLORS } from "../data/sections";
import { formatPctChange } from "../utils/metricHelpers";

interface CategoryGroupProps {
  category: string;
  metrics: ParsedMetric[];
  isFiltered?: boolean;
}

// Financial Ledger Row Themes
const ROW_THEMES: Record<string, {
  dotBg: string;
  valueColor: string;
  pctBg: string;
}> = {
  green: {
    dotBg: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    valueColor: "text-emerald-600 dark:text-emerald-400 font-bold",
    pctBg: "bg-emerald-50/50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/10",
  },
  red: {
    dotBg: "bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse",
    valueColor: "text-red-650 dark:text-rose-400 font-bold",
    pctBg: "bg-red-50/50 text-red-700 border-red-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-500/10",
  },
  amber: {
    dotBg: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
    valueColor: "text-amber-600 dark:text-amber-400 font-bold",
    pctBg: "bg-amber-50/50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-500/10",
  },
  neutral: {
    dotBg: "bg-slate-400 dark:bg-slate-650",
    valueColor: "text-slate-855 dark:text-slate-200 font-semibold",
    pctBg: "bg-slate-50 text-slate-500 border-slate-150 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-850",
  },
};

// Compact financial list row item
function MetricRowItem({ metric }: { metric: ParsedMetric }) {
  const t = ROW_THEMES[metric.signal] || ROW_THEMES.neutral;
  const pctString = formatPctChange(metric.pctChange);

  return (
    <div className="flex items-center justify-between py-2 px-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-all duration-150 text-[11px] font-sans group gap-4">
      
      {/* 1. Metrics Name */}
      <div className="flex-1 min-w-0">
        <span className="font-bold text-slate-700 dark:text-slate-250 truncate block group-hover:text-slate-950 dark:group-hover:text-white transition-colors" title={metric.metricName}>
          {metric.metricName}
        </span>
      </div>

      {/* 2. Current Month Value */}
      <div className="w-20 text-right flex-shrink-0">
        <span className="font-mono text-[12px] font-black text-slate-700 dark:text-slate-200">
          {metric.formattedCurrent}
        </span>
      </div>

      {/* 3. Previous Month Value */}
      <div className="w-20 text-right flex-shrink-0 text-slate-450 dark:text-slate-500 font-medium">
        <span className="font-mono text-[11px]">{metric.formattedPrevious}</span>
      </div>

      {/* 4. Compare Percentage */}
      <div className="w-16 text-right flex-shrink-0 flex justify-end">
        {metric.pctChange !== null ? (
          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-md border leading-none transition-colors ${t.pctBg}`}>
            {pctString}
          </span>
        ) : (
          <span className="text-[9px] text-slate-300 dark:text-slate-700 font-mono">—</span>
        )}
      </div>

      {/* 5. Indicator */}
      <div className="w-6 flex items-center justify-end flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${t.dotBg}`} />
      </div>

    </div>
  );
}

export function CategoryGroup({ category, metrics, isFiltered }: CategoryGroupProps) {
  if (!metrics.length) return null;

  // If a filter is active, bypass accordions and show metrics directly in a single, flat list
  if (isFiltered) {
    return (
      <div className="animate-fadeIn">
        {/* Simple elegant label for the category */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {category}
          </span>
          <span className="text-[9px] font-bold font-mono text-slate-400">
            ({metrics.length})
          </span>
        </div>
        
        {/* Consolidate matching metrics "one-by-one" in a clean ledger list */}
        <div className="bg-white/40 dark:bg-slate-950/20 border border-slate-150/50 dark:border-slate-900 rounded-xl overflow-hidden shadow-inner divide-y divide-slate-100 dark:divide-slate-900/60 mb-4">
          {/* Column Headers */}
          <div className="flex items-center justify-between py-2 px-3.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-150/50 dark:border-slate-900/60 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 gap-4 select-none">
            <div className="flex-1 min-w-0 text-left">Metrics</div>
            <div className="w-20 text-right flex-shrink-0">{metrics[0]?.currentMonthLabel || "Current"}</div>
            <div className="w-20 text-right flex-shrink-0">{metrics[0]?.previousMonthLabel || "Previous"}</div>
            <div className="w-16 text-right flex-shrink-0 whitespace-nowrap">Delta Change</div>
            <div className="w-6 flex items-center justify-end flex-shrink-0">RAG</div>
          </div>

          {metrics.map((m, i) => (
            <MetricRowItem key={`${m.category}-${m.metricName}-${i}`} metric={m} />
          ))}
        </div>
      </div>
    );
  }

  const accentColor = CATEGORY_COLORS[category] ?? "#64748B";

  // Group metrics by subgroup
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
    <div className="animate-fadeIn">
      <div className="space-y-3">
        {groupOrder.map((groupName) => {
          const groupMetrics = groups[groupName];
          const groupRed = groupMetrics.filter((m) => m.signal === "red").length;
          const groupAmber = groupMetrics.filter((m) => m.signal === "amber").length;
          const groupGreen = groupMetrics.filter((m) => m.signal === "green").length;

          return (
            <div key={groupName} className="animate-fadeIn">
              
              {/* Header Panel */}
              <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/35 border border-slate-150/40 dark:border-slate-900/80 rounded-xl px-4 py-2 flex-wrap gap-2">
                {/* Left side: colored bar, title, and count */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none">
                    {groupName}
                  </h4>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-wider ml-1">
                    ({groupMetrics.length})
                  </span>
                </div>

                {/* Right side: micro indicator pills */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* {groupGreen > 0 && ( */}
                      <span className="text-[8px] font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-150/40 dark:border-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {groupGreen} On Track
                      </span>
                    {/* )} */}
                    {/* {groupAmber > 0 && ( */}
                      <span className="text-[8px] font-extrabold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-150/40 dark:border-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {groupAmber} Monitor
                      </span>
                    {/* )} */}
                    {/* {groupRed > 0 && ( */}
                      <span className="text-[8px] font-extrabold bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-150/40 dark:border-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        {groupRed} Off Track
                      </span>
                    {/* )} */}
                  </div>
                </div>
              </div>

              {/* Body: Modern Ticker Ledger Row Table */}
              <div className="animate-fadeIn bg-white/40 dark:bg-slate-950/20 border border-slate-150/50 dark:border-slate-900 rounded-xl overflow-hidden shadow-inner divide-y divide-slate-100 dark:divide-slate-900/60 mt-1.5 mb-4">
                {/* Column Headers */}
                <div className="flex items-center justify-between py-2 px-3.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-150/50 dark:border-slate-900/60 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 gap-4 select-none">
                  <div className="flex-1 min-w-0 text-left">Metrics</div>
                  <div className="w-20 text-right flex-shrink-0">{groupMetrics[0]?.currentMonthLabel || "Current"}</div>
                  <div className="w-20 text-right flex-shrink-0">{groupMetrics[0]?.previousMonthLabel || "Previous"}</div>
                  <div className="w-16 text-right flex-shrink-0 whitespace-nowrap">Delta Change</div>
                  <div className="w-6 flex items-center justify-end flex-shrink-0">RAG</div>
                </div>

                {groupMetrics.map((m, i) => (
                  <MetricRowItem key={`${m.category}-${groupName}-${m.metricName}-${i}`} metric={m} />
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
