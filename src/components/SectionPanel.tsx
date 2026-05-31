import type { Section, ParsedMetric } from "../types";
import { CategoryGroup } from "./CategoryGroup";

interface SectionPanelProps {
  section: Section;
  metrics: ParsedMetric[];
  activeSignalFilter?: string | null;
}

export function SectionPanel({ section, metrics, activeSignalFilter }: SectionPanelProps) {
  const sectionMetrics = metrics.filter((m) =>
    section.categories.includes(m.category)
  );

  if (sectionMetrics.length === 0) {
    const filterLabel = activeSignalFilter === "green" 
      ? "On Track" 
      : activeSignalFilter === "amber" 
      ? "Watchlist" 
      : activeSignalFilter === "red" 
      ? "Off Track" 
      : activeSignalFilter;

    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center text-xl mb-3 border border-slate-100 dark:border-slate-800">
          {activeSignalFilter ? "✨" : section.icon}
        </div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {activeSignalFilter 
            ? `No ${filterLabel} metrics`
            : "No data for this section"
          }
        </p>
        {!activeSignalFilter && (
          <p className="text-[10px] text-slate-400 mt-1">
            Upload an Excel with a{" "}
            <span className="font-semibold">{section.categories.join(" / ")}</span> category
          </p>
        )}
      </div>
    );
  }

  // Split categories side-by-side if the section has multiple categories and NO active filters.
  // When a filter is active, stack them vertically ("one by one inside the card not beside of each other").
  const isMultiCategory = section.categories.length > 1;
  const gridClass = (isMultiCategory && !activeSignalFilter)
    ? "grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
    : "space-y-6";

  return (
    <div className={`animate-fadeIn ${gridClass}`}>
      {section.categories.map((cat) => {
        const catMetrics = sectionMetrics.filter((m) => m.category === cat);
        return (
          <CategoryGroup
            key={cat}
            category={cat}
            metrics={catMetrics}
            isFiltered={!!activeSignalFilter}
          />
        );
      })}
    </div>
  );
}
