import { useState, useEffect } from "react";
import type { SectionId } from "./types";
import { useExcelData } from "./hooks/useExcelData";
import { buildParsedMetrics } from "./utils/metricHelpers";
import { SECTIONS } from "./data/sections";
import { DashboardHeader } from "./components/DashboardHeader";
import { NavTabs } from "./components/NavTabs";
import { SectionPanel } from "./components/SectionPanel";
import { SignalLegend } from "./components/SignalLegend";

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("loan-products");
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
  const activeSecDef = SECTIONS.find((s) => s.id === activeSection)!;
  const hasData = allMetricsForMonth.length > 0;

  // Filter metrics by active signal filter if toggled
  const metrics = activeSignalFilter
    ? allMetricsForMonth.filter((m) => m.signal === activeSignalFilter)
    : allMetricsForMonth;

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

      {/* ── Main Layout Split Grid ── */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-[85px] h-fit">
          <NavTabs
            sections={SECTIONS}
            activeSection={activeSection}
            onSelect={(id) => {
              setActiveSection(id);
              setActiveSignalFilter(null);
            }}
            isDark={isDark}
          />
          {hasData && (
            <div className="mt-6 border-t border-slate-150 dark:border-slate-900 pt-6 px-3.5 hidden lg:block">
              <SignalLegend />
            </div>
          )}
        </aside>

        {/* Main Canvas Content Area */}
        <main className="flex-1 min-w-0">
          {/* Signal Legend on mobile (horizontal list) */}
          {hasData && (
            <div className="mb-6 block lg:hidden border-b border-slate-150 dark:border-slate-905/30 pb-3.5">
              <SignalLegend />
            </div>
          )}

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
            <div className="max-w-md mx-auto my-16 bg-white dark:bg-slate-900/60 backdrop-blur-md border border-red-100 dark:border-rose-900/30 rounded-3xl p-8 text-center shadow-md dark:shadow-[0_0_20px_rgba(244,63,94,0.05)] animate-fadeIn transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-rose-950/20 border border-red-550/20 dark:border-rose-500/20 flex items-center justify-center text-2xl mx-auto mb-5 shadow-sm">
                ⚠️
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-red-500 dark:text-rose-400 transition-colors">Failed to Load Dashboard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed transition-colors font-medium">
                {error}
              </p>
              <button
                onClick={loadDefaultData}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-red-600 dark:bg-rose-600 rounded-2xl hover:bg-red-700 dark:hover:bg-rose-700 active:scale-95 transition-all shadow-md dark:shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                Retry Loading
              </button>
            </div>
          )}

          {/* Dashboard Panels */}
          {hasData && !isLoading && !error && (
            <>
              {/* Active Control Panel */}
              <SectionPanel section={activeSecDef} metrics={metrics} />
            </>
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
