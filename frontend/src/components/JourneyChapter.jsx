import { useEffect, useRef } from "react";
import { createFrameScrubber } from "@/lib/frameScrub";
import { chooseScrubEngine } from "@/lib/scrubEngine";

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
// Engine decided once per load — see lib/scrubEngine.js for the measured
// defaults (video on Chromium + Safari, frames on Firefox / save-data).
// Video engine: all-keyframe MP4 driven by currentTime — 241 seekable
// frames per chapter (~8.4px of scroll per frame). Seeks are paced to the
// decoder: one seek in flight, latest target applied on 'seeked', so the
// element only ever displays fully decoded frames (no tearing possible).
const ENGINE = typeof window !== "undefined" ? chooseScrubEngine() : "frames";
const VIDEO_DURATION_FALLBACK = 10.04;

// DECISION SPIKE (?journey=flow): renders the would-be-pinned chapters as
// free-flowing sections — content scrolls 1:1, the world still scrubs
// behind (same film layer + black-dip junctions), micro-parallax becomes
// pure section-transit motion. No sticky content, no scroll-distance tax.
// The client A/Bs this against the default pinned build by hand; the
// winner becomes the shipped architecture.
const FLOW =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("journey") === "flow";

export default function JourneyChapter({
  active,
  chapter, // "ch02" .. "ch05"
  frames = 75,
  nativeW = 1280,
  nativeH = 720,
  lead = true,
  restAtEnd = false, // ch05: hold the lit final frame instead of dipping out
  // pinContent: the chapter's content group (heading + cards) rides a
  // sticky pin through a 125vh track (trimmed from 160vh: at flick
  // velocity the pin distance reads as resistance — the visitor now pays
  // only ~25vh of held scroll per chapter). The pin is NEVER static:
  // a scroll-linked drift (±30px, cos-velocity profile — fastest at the
  // pin edges so it blends into the unpin) plus per-card micro-parallax
  // keeps the foreground visibly responding to every wheel tick.
  pinContent = false,
  children,
  testid,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const useVideo = ENGINE === "video";
  const pinned = pinContent && !FLOW;

  // Video engine path
  useEffect(() => {
    if (!active || !useVideo) return undefined;
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return undefined;

    let desired = 0;
    let seeking = false;
    let shown = false;

    const applySeek = () => {
      if (seeking || video.readyState < 1) return;
      if (Math.abs(video.currentTime - desired) < 1 / 60) return;
      seeking = true;
      video.currentTime = desired;
    };
    const onSeeked = () => {
      seeking = false;
      if (!shown) {
        shown = true;
        video.style.visibility = "visible";
      }
      applySeek(); // catch up if the target moved during the seek
    };
    const onMeta = () => applySeek();
    // load() resets the media element and silently ABORTS any in-flight
    // seek ('seeked' never fires) — 'emptied' releases the pacing flag so
    // the post-reset 'loadedmetadata' can re-apply the newest target.
    const onEmptied = () => {
      seeking = false;
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("emptied", onEmptied);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          // Upgrade buffering as the chapter approaches. Only force load()
          // on an uninitialized element — resetting one that already has
          // metadata would abort seeks and refetch from byte 0.
          video.preload = "auto";
          if (video.readyState === 0) video.load();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 150% 0px" }
    );
    io.observe(root);

    // Progress from the section's viewport traversal — same mapping as
    // ScrollTrigger's "top bottom" → "bottom top", derived directly from
    // the Lenis-smoothed native scroll position. The video engine needs no
    // GSAP at all (video-engine visitors never fetch the GSAP chunk).
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh)));
      const dur = video.duration || VIDEO_DURATION_FALLBACK;
      desired = Math.min(dur - 1 / 30, p * dur);
      // Black-dip edge ramp (ch05 rests lit at its final frame)
      const edgeIn = Math.min(1, p / 0.04);
      const edgeOut = restAtEnd ? 1 : Math.min(1, (1 - p) / 0.04);
      video.style.opacity = String(Math.min(edgeIn, edgeOut));
      applySeek();
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("emptied", onEmptied);
    };
  }, [active, useVideo, chapter, restAtEnd, pinContent]);

  useEffect(() => {
    if (!active || useVideo) return undefined;
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
  }, [active, useVideo, chapter, frames, nativeW, nativeH, restAtEnd, pinContent]);

  // Scroll-linked drift for pinned content (engine-agnostic). Total travel
  // ±30px across the stuck span with a cos-velocity profile: v(u) ∝
  // 1 + 0.8·cos(2πu) — fastest at the pin boundaries (≈0.18px per scroll
  // px) so the release into 1:1 scrolling has no hard velocity step, and
  // gentlest mid-dwell. Per-card micro-parallax rides the same value at
  // different rates. All motion is DIRECT translate3d writes on the few
  // target elements in the same rAF — no CSS-variable indirection, which
  // would invalidate computed style for the whole chapter subtree every
  // scroll frame and starve high-refresh (120Hz) budgets. CLS-safe.
  useEffect(() => {
    if (!active || !pinContent) return undefined;
    const root = rootRef.current;
    const track = root ? root.querySelector(".journey-track") : null;
    const driftEl = root ? root.querySelector(".journey-drift") : null;
    const PARA_RATES = { "journey-para-0": 0.22, "journey-para-1": -0.15, "journey-para-2": 0.1 };
    const paras = root
      ? Array.from(
          root.querySelectorAll(".journey-para-0, .journey-para-1, .journey-para-2")
        ).map((el) => {
          const key = Object.keys(PARA_RATES).find((k) => el.classList.contains(k));
          return { el, rate: PARA_RATES[key] || 0 };
        })
      : [];

    // FLOW variant: no pin, content 1:1 — micro-parallax only, driven by
    // the section's viewport transit (a few px of relative card motion).
    if (FLOW) {
      if (!root || paras.length === 0) return undefined;
      let rafId = 0;
      const update = () => {
        rafId = 0;
        const r = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
        const v = (0.5 - p) * 80;
        for (const { el, rate } of paras) {
          el.style.transform = `translate3d(0, ${(v * rate).toFixed(2)}px, 0)`;
        }
      };
      const onScroll = () => {
        if (!rafId) rafId = requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (rafId) cancelAnimationFrame(rafId);
        for (const { el } of paras) el.style.transform = "";
      };
    }

    if (!root || !track || !driftEl) return undefined;
    // Drift velocity profile (px of drift per px of scroll): NEAR-LINEAR.
    // The old cos profile bottomed at ~0.02 px/px mid-dwell — beneath the
    // eye's visibility threshold, which read as a frozen foreground. Now:
    // constant R across the dwell (R = 0.14 ≥ the 0.125 visibility floor,
    // i.e. ≥3.4px per 24px scroll step) with 10% eased shoulders at BOTH
    // ends rising to V_EDGE, so the catch into the pin and the release
    // out of it blend toward 1:1 scrolling with no hard velocity step.
    const R = 0.14;
    const V_EDGE = 0.35;
    const E = 0.1; // shoulder width in dwell fraction
    const K = V_EDGE - R;
    // Closed-form integral of the velocity profile from 0..u (per unit u)
    const integ = (u) => {
      const shoulderArea = (K * E) / 3;
      if (u <= E) {
        return R * u + shoulderArea * (1 - Math.pow((E - u) / E, 3));
      }
      if (u <= 1 - E) {
        return R * u + shoulderArea;
      }
      return R * u + shoulderArea + shoulderArea * Math.pow((u - (1 - E)) / E, 3);
    };
    const TOTAL = integ(1); // fraction of span travelled by the drift
    let rafId = 0;
    const apply = (v) => {
      driftEl.style.transform = `translate3d(0, ${v.toFixed(2)}px, 0)`;
      for (const { el, rate } of paras) {
        el.style.transform = `translate3d(0, ${(v * rate).toFixed(2)}px, 0)`;
      }
    };
    const update = () => {
      rafId = 0;
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) {
        // Pin released (e.g. work panel open) — no drift offset
        apply(0);
        return;
      }
      const u = Math.min(1, Math.max(0, -r.top / span));
      // Centered: starts at +span·TOTAL/2, ends at −span·TOTAL/2
      const drift = span * (TOTAL / 2 - integ(u));
      apply(drift);
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      apply(0);
    };
  }, [active, pinContent]);

  if (!active) return children;

  return (
    <div ref={rootRef} className="journey-scope relative" data-testid={testid}>
      {/* Sticky film layer — behind everything in this chapter */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" aria-hidden="true">
        {useVideo ? (
          <video
            ref={videoRef}
            src={`/journey/${chapter}-scrub.mp4`}
            muted
            playsInline
            preload="none"
            className="h-full w-full object-cover"
            style={{ visibility: "hidden", opacity: 0 }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{ visibility: "hidden", opacity: 0 }}
          />
        )}
        {/* Readability-minimum scrims: the moving world stays visibly
            alive behind the solid cards at all times. */}
        <div className="absolute inset-0 bg-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/60" />
      </div>
      {/* Existing section content flows OVER the film — pulled back up over
          the sticky viewport. Pinned chapters ride a 300vh track: the
          content group sticks fully composed through p≈0.25-0.75 (the
          shot's heart), then exits. The pin releases while the Selected
          Work case panel is open (:has CSS) so its expand/scroll behavior
          stays native. */}
      <div className="relative z-10 -mt-[100vh]">
        {pinned ? (
          <div className="journey-track min-h-[125vh]">
            <div className="journey-content-pin sticky top-0 flex min-h-screen flex-col justify-center">
              <div className="journey-drift">{children}</div>
            </div>
          </div>
        ) : (
          <div className={lead ? "pt-[30vh]" : ""}>{children}</div>
        )}
      </div>
    </div>
  );
}
