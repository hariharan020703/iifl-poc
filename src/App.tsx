import { useState, useEffect } from "react";
import { useExcelData } from "./hooks/useExcelData";
import { buildParsedMetrics } from "./utils/metricHelpers";
import { SECTIONS } from "./data/sections";
import { DashboardHeader } from "./components/DashboardHeader";
import { SectionPanel } from "./components/SectionPanel";
import { SignalFiltersCard } from "./components/SignalFiltersCard";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  // Sync theme class to document node
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const {
    allRows,
    availableMonths,
    selectedMonth,
    rowsForMonth,
    isLoading,
    error,
    loadDefaultData,
    setSelectedMonth,
  } = useExcelData();

  const [activeSignalFilter, setActiveSignalFilter] = useState<string | null>(null);

  const allMetricsForMonth = buildParsedMetrics(rowsForMonth, allRows);
  const hasData = allMetricsForMonth.length > 0;

  // Filter metrics by active signal filter if toggled
  const metrics = activeSignalFilter
    ? allMetricsForMonth.filter((m) => m.signal === activeSignalFilter)
    : allMetricsForMonth;

  // Filter sections dynamically to only include those that have active metrics matching the current filter state
  const visibleSections = SECTIONS.filter((section) => {
    const sectionMetrics = metrics.filter((m) =>
      section.categories.includes(m.category)
    );
    return sectionMetrics.length > 0;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative font-sans transition-colors duration-205">

      {/* ── Dashboard Header ── */}
      <DashboardHeader
        metrics={allMetricsForMonth}
        availableMonths={availableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        activeSignalFilter={activeSignalFilter}
        onSignalFilterToggle={(filter) => {
          if (filter === "all") {
            setActiveSignalFilter(null);
          } else {
            setActiveSignalFilter(activeSignalFilter === filter ? null : filter);
          }
        }}
      />

      {/* ── Main Canvas Content Area ── */}
      <div className="max-w-screen-2xl mx-auto px-6 py-6 flex flex-col gap-6">
        {hasData && !isLoading && !error && (
          <div className="flex flex-wrap gap-4 items-stretch select-none">
            {/* Separate Overall Overview Card */}
            <SignalFiltersCard
              metrics={allMetricsForMonth}
              activeSignalFilter={activeSignalFilter}
              onSignalFilterToggle={(filter) => {
                if (filter === "all") {
                  setActiveSignalFilter(null);
                } else {
                  setActiveSignalFilter(activeSignalFilter === filter ? null : filter);
                }
              }}
            />

            {/* Tri-Color Spectrum Filters Card */}
            <button
              onClick={() => setActiveSignalFilter(null)}
              className={`w-28 flex flex-col justify-between items-center rounded-xl border p-3.5 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer hover:shadow-md ${activeSignalFilter === null
                ? "bg-white border-slate-805 text-slate-850 dark:bg-slate-900 dark:border-slate-200 dark:text-white font-black shadow-[0_0_12px_rgba(0,0,0,0.03)]"
                : "bg-white dark:bg-slate-900 border-slate-150/60 dark:border-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                }`}
              title="Clear active status filter and show all metrics"
            >
              <span className={`text-sm font-black tracking-tight leading-none h-12 flex items-center transition-colors ${activeSignalFilter === null 
                ? "text-slate-850 dark:text-white" 
                : "text-slate-400 dark:text-slate-500"
                }`}>
                {allMetricsForMonth.length}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-widest mt-2.5 transition-all duration-300 ${activeSignalFilter === null
                ? "text-slate-850 dark:text-white"
                : "text-slate-300 dark:text-slate-700 opacity-40 scale-95"
                }`}>
                Overview
              </span>
            </button>
          </div>
        )}

        <main className="w-full">
          {/* Loading HUD Panel */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-36">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-6 relative">
                <span className="w-8 h-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-550 dark:text-slate-300 transition-colors">Loading Dashboard...</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 transition-colors">Fetching performance data</p>
            </div>
          )}

          {/* Error HUD Panel */}
          {error && !isLoading && (
            <div className="max-w-md mx-auto my-16 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-red-100 dark:border-rose-900/30 rounded-2xl p-8 text-center shadow-md dark:shadow-[0_0_20px_rgba(244,63,94,0.05)] animate-fadeIn transition-colors">
              <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-rose-950/20 border border-red-550/20 dark:border-rose-500/20 flex items-center justify-center text-2xl mx-auto mb-5 shadow-sm">
                ⚠️
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-red-500 dark:text-rose-400 transition-colors">Failed to Load Dashboard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed transition-colors font-medium">
                {error}
              </p>
              <button
                onClick={loadDefaultData}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-red-600 dark:bg-rose-600 rounded-xl hover:bg-red-700 dark:hover:bg-rose-700 active:scale-95 transition-all shadow-md dark:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                Retry Loading
              </button>
            </div>
          )}

          {/* Dashboard Sections in a dynamic fluid grid layout */}
          {hasData && !isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-fadeIn">
              {visibleSections.map((section, idx) => {
                const sectionMetrics = metrics.filter((m) =>
                  section.categories.includes(m.category)
                );

                const isOddCount = visibleSections.length % 2 !== 0;
                const isLast = idx === visibleSections.length - 1;
                const colSpanClass = isLast && isOddCount ? "lg:col-span-2" : "";

                return (
                  <section
                    key={section.id}
                    className={`relative bg-white/40 dark:bg-slate-900/10 dark:backdrop-blur-md rounded-xl border border-slate-150/60 dark:border-slate-900 p-4.5 shadow-sm transition-all duration-300 hover:shadow-md ${colSpanClass}`}
                  >
                    {/* Section Title Header */}
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-900">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] uppercase tracking-tight flex-shrink-0"
                        style={{
                          backgroundColor: `${section.accentColor}15`,
                          color: section.accentColor,
                          border: `1px solid ${section.accentColor}30`,
                        }}
                      >
                        {section.label[0]}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h2 className="text-xs font-black text-slate-855 dark:text-slate-105 uppercase tracking-widest leading-none">
                          {section.label}
                        </h2>
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[9px] font-black px-1.5 shadow-sm">
                          {sectionMetrics.length}
                        </span>
                      </div>
                    </div>

                    {/* Section categories and cards */}
                    <SectionPanel section={section} metrics={metrics} activeSignalFilter={activeSignalFilter} />
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
