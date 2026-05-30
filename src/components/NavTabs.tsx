import type { Section, SectionId } from "../types";

interface NavTabsProps {
  sections: Section[];
  activeSection: SectionId;
  onSelect: (id: SectionId) => void;
  isDark: boolean;
}

export function NavTabs({ sections, activeSection, onSelect, isDark }: NavTabsProps) {
  return (
    <nav className="flex flex-col gap-3 w-full">
      {/* Sidebar header (visible on desktop) */}
      <div className="px-3.5 mb-1 hidden lg:block">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Navigation
        </span>
      </div>

      {sections.map((s) => {
        const isActive = s.id === activeSection;

        const activeStyle = isActive
          ? (isDark
              ? {
                  boxShadow: `0 0 15px -4px ${s.accentColor}30`,
                }
              : {
                  boxShadow: `0 4px 12px -3px rgba(0,0,0,0.05), 0 2px 4px -2px ${s.accentColor}10`,
                }
            )
          : {};

        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`
              group relative text-left p-4 rounded-2xl border transition-all duration-300 ease-out cursor-pointer select-none flex items-center justify-between gap-4 w-full
              ${isActive
                ? isDark
                  ? "bg-slate-900/85 text-white border"
                  : ""
                : isDark
                  ? "bg-slate-950/20 border-slate-900/40 text-slate-450 hover:border-slate-800 hover:bg-slate-900/30"
                  : ""
              }
            `}
            style={activeStyle}
          >
            {/* Left accent color bar */}
            <div
              className={`absolute left-0 top-3.5 bottom-3.5 w-1 rounded-r-full transition-all duration-300
                ${isActive ? "opacity-100" : "opacity-0"}
              `}
              style={isActive ? { backgroundColor: s.accentColor } : {}}
            />

            <div className="flex flex-col pr-2 pl-2">
              <div className="flex items-center gap-2">
                {/* <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? "animate-pulse" : "opacity-30"}`}
                  style={{
                    backgroundColor: isActive ? s.accentColor : "currentColor",
                    boxShadow: isActive ? `0 0 6px ${s.accentColor}` : "none"
                  }}
                /> */}
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
