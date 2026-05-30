interface MonthSelectorProps {
  months: string[];
  selected: string | null;
  onChange: (month: string) => void;
}

export function MonthSelector({ months, selected, onChange }: MonthSelectorProps) {
  if (!months.length) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Timeframe</span>
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-900/80 rounded-2xl p-1">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200
              ${selected === m
                ? "bg-white dark:bg-cyan-500/10 border border-slate-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 shadow-sm dark:shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                : "border border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 dark:hover:bg-slate-900/30"
              }
            `}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
