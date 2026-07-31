import { useEffect, useRef } from "react";
import { createFrameScrubber } from "@/lib/frameScrub";

/**
 * JourneyChapter — one scroll chapter of the Obsidian Journey (Home only).
 *
 * Architecture: the chapter shot lives on a CSS-sticky full-viewport canvas
 * behind the existing section content, which flows over it in normal
 * document flow. ScrollTrigger owns the choreography (scrub: true maps the
 * section's traversal to the frame index, plus the black-dip edge fades) but
 * deliberately does NOT pin: sticky delivers the identical pinned feel while
 * keeping native scroll untrapped, anchors reachable, the Selected Work
 * expand/collapse working (its height changes mid-chapter would invalidate a
 * GSAP pin's cached measurements), and CLS at zero by construction.
 *
 * Readability (standing gate): the footage is dimmed by a flat ink scrim +
 * vertical gradient BELOW the content layer — footage is dimmed, content
 * never is. `lead` adds an establishing beat of clear footage before the
 * content scrolls in.
 *
 * When `active` is false (touch or reduced-motion) this renders children
 * unchanged — the current non-pinned page, zero canvas, zero GSAP.
 */
export default function JourneyChapter({
  active,
  chapter, // "ch02" .. "ch05"
  frames = 75,
  nativeW = 1280,
  nativeH = 720,
  lead = true,
  restAtEnd = false, // ch05: hold the lit final frame instead of dipping out
  children,
  testid,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;
    // GSAP arrives via dynamic import (desktop-only async chunk) — touch
    // devices never pay for it. `dead` guards the async gap on unmount.
    let dead = false;
    let st = null;

    const scrubber = createFrameScrubber(canvas, {
      basePath: `/journey/${chapter}`,
      count: frames,
      nativeW,
      nativeH,
    });
    scrubber.onFirstDraw(() => {
      canvas.style.visibility = "visible";
    });
    scrubber.resize();
    const onResize = () => scrubber.resize();
    window.addEventListener("resize", onResize);

    // Frames fetch when the chapter approaches (~1.5 viewports out); nothing
    // at first paint. rootMargin only extends the bottom edge so a reader
    // parked mid-page doesn't pull every chapter at once.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          scrubber.load();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 150% 0px" }
    );
    io.observe(root);

    import("@/lib/journeyGsap").then(({ ScrollTrigger }) => {
      if (dead) return;
      st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          scrubber.setProgress(p);
          // Black-dip edge ramp: guarantees an invisible junction even where
          // an endpoint frame isn't perfectly black. ch05 rests lit at its
          // final frame (the CTA background), so it only ramps in.
          const edgeIn = Math.min(1, p / 0.04);
          const edgeOut = restAtEnd ? 1 : Math.min(1, (1 - p) / 0.04);
          canvas.style.opacity = String(Math.min(edgeIn, edgeOut));
        },
      });
    });

    return () => {
      dead = true;
      if (st) st.kill();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      scrubber.dispose();
    };
  }, [active, chapter, frames, nativeW, nativeH, restAtEnd]);

  if (!active) return children;

  return (
    <div ref={rootRef} className="relative" data-testid={testid}>
      {/* Sticky film layer — behind everything in this chapter */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" aria-hidden="true">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ visibility: "hidden", opacity: 0 }}
        />
        {/* Footage dimmed, content never: flat scrim + vertical gradient */}
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/60" />
      </div>
      {/* Existing section content flows OVER the film in normal document
          flow — pull it back up over the sticky viewport */}
      <div className={`relative z-10 -mt-[100vh] ${lead ? "pt-[30vh]" : ""}`}>
        {children}
      </div>
    </div>
  );
}
