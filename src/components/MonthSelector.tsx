interface MonthSelectorProps {
  months: string[];
  selected: string | null;
  onChange: (month: string) => void;
}

export function MonthSelector({ months, selected, onChange }: MonthSelectorProps) {
  if (!months.length) return null;

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
        Month
      </span>
      <div className="relative flex items-center">
        <select
          value={selected ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="
            appearance-none cursor-pointer text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border
            bg-slate-50 dark:bg-slate-900/70 text-slate-800 dark:text-cyan-400
            border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700
            shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20
          "
        >
          {months.map((m) => (
            <option
              key={m}
              value={m}
              className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
            >
              {m}
            </option>
          ))}
        </select>
        {/* Custom Chevron Arrow icon */}
        <div className="absolute right-2.5 flex items-center pointer-events-none text-slate-400 dark:text-cyan-600/70">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
