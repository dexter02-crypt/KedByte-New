import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
      raf = requestAnimationFrame(loop);
    };

    const over = (e) => {
      if (e.target.closest("a, button, [role='button'], input, textarea, select")) {
        ring.current?.style.setProperty("scale", "1.7");
        ring.current?.style.setProperty("background", "rgba(0,240,255,0.12)");
      } else {
        ring.current?.style.setProperty("scale", "1");
        ring.current?.style.setProperty("background", "transparent");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring hidden md:block" style={{ transition: "scale 0.25s, background 0.25s" }} />
      <div ref={dot} className="cursor-dot hidden md:block" />
    </>
  );
}
