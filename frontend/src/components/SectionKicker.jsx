export default function SectionKicker({ index, children, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {index && (
        <span className="font-mono text-xs text-cyan-accent">{index}</span>
      )}
      <span className="h-px w-8 bg-cyan-accent/50" />
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500">
        {children}
      </span>
    </div>
  );
}
