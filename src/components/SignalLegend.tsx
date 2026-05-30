export function SignalLegend() {
  return (
    <div className="flex items-center gap-5 flex-wrap py-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signal:</span>
      {[
        { dot: "bg-emerald-500", label: "On Track >1%" },
        { dot: "bg-amber-500",   label: "Monitor ≤1%" },
        { dot: "bg-red-500",     label: "Off Track >1%" },
      ].map(({ dot, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {label}
        </div>
      ))}
    </div>
  );
}
