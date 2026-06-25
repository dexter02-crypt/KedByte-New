export default function Corners({ className = "" }) {
  const base = "absolute h-3 w-3 border-cyan-accent/60 transition-all duration-500";
  return (
    <span className={`pointer-events-none ${className}`} aria-hidden>
      <span className={`${base} left-3 top-3 border-l border-t`} />
      <span className={`${base} right-3 top-3 border-r border-t`} />
      <span className={`${base} left-3 bottom-3 border-l border-b`} />
      <span className={`${base} right-3 bottom-3 border-r border-b`} />
    </span>
  );
}
