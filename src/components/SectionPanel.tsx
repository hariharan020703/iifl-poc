import type { Section, ParsedMetric } from "../types";
import { CategoryGroup } from "./CategoryGroup";

interface SectionPanelProps {
  section: Section;
  metrics: ParsedMetric[];
}

export function SectionPanel({ section, metrics }: SectionPanelProps) {
  const sectionMetrics = metrics.filter((m) =>
    section.categories.includes(m.category)
  );

  if (sectionMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">
          {section.icon}
        </div>
        <p className="text-sm font-semibold text-slate-500">No data for this section</p>
        <p className="text-xs text-slate-400 mt-1">
          Upload an Excel with a{" "}
          <span className="font-semibold">{section.categories.join(" / ")}</span> category
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {section.categories.map((cat) => {
        const catMetrics = sectionMetrics.filter((m) => m.category === cat);
        return (
          <CategoryGroup key={cat} category={cat} metrics={catMetrics} />
        );
      })}
    </div>
  );
}
