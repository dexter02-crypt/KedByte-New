import { Link } from "react-router-dom";

export default function Logo({ to = "/", className = "", size = "h-7", showWord = true, testid = "logo-link" }) {
  const content = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo-mark.png" alt="Kedbyte" className={`${size} w-auto`} />
      {showWord && (
        <span className="font-heading font-black text-xl tracking-tighter text-white">
          KED<span className="text-cyan-accent">BYTE</span>
        </span>
      )}
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} data-testid={testid} className="inline-flex items-center group">
      {content}
    </Link>
  );
}
