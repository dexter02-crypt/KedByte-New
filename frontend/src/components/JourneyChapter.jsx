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

export default function JourneyChapter({
  active,
  chapter, // "ch02" .. "ch05"
  frames = 75,
  nativeW = 1280,
  nativeH = 720,
  lead = true,
  restAtEnd = false, // ch05: hold the lit final frame instead of dipping out
  // Glass window: the progress span where cards go glass. Aligned per
  // chapter to the shot's LUMINOUS segment so the through-view is always
  // visibly alive — outside it, cards rest as their Phase 13 stills.
  glassWindow = [0.02, 0.98],
  children,
  testid,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const useVideo = ENGINE === "video";
  const [glassFrom, glassTo] = glassWindow;

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

    // PER-CARD glass state: RESTING (Phase 13 still) is the dominant state.
    // A card frosts ONLY when (a) the chapter is inside its luminous window
    // AND (b) the actual video pixels behind that card's rect — sampled
    // through the cover-fit mapping on THIS viewport's geometry — exceed a
    // luminance floor. Structurally, glass can never trade a visible image
    // for a black rectangle: no verified light, no frost. Sampling runs at
    // ~10Hz with hysteresis (on >16/255, off <10/255) to avoid flicker.
    const cards = Array.from(root.querySelectorAll(".glow-card"));
    const sampler = document.createElement("canvas");
    sampler.width = 32;
    sampler.height = 18;
    const sctx = sampler.getContext("2d", { willReadFrequently: true });
    let lastSampleAt = 0;
    const debug = window.location.search.includes("glassdebug");
    let badge = null;
    if (debug) {
      badge = document.createElement("div");
      badge.className = "glassdebug-badge";
      root.querySelector(".sticky")?.appendChild(badge);
    }

    const unfrostAll = () => {
      for (const c of cards) c.classList.remove("card-glass");
    };

    const sampleCards = (now) => {
      if (now - lastSampleAt < 100 || video.readyState < 2) return;
      lastSampleAt = now;
      const vw = video.videoWidth;
      const vhv = video.videoHeight;
      if (!vw || !vhv) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const scale = Math.max(cw / vw, ch / vhv);
      const dx = (cw - vw * scale) / 2;
      const dy = (ch - vhv * scale) / 2;
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > ch) continue;
        const sx = (Math.max(0, r.left) - dx) / scale;
        const sy = (Math.max(0, r.top) - dy) / scale;
        const sw = Math.min(r.width, cw - Math.max(0, r.left)) / scale;
        const sh = Math.min(r.height, ch - Math.max(0, r.top)) / scale;
        try {
          sctx.drawImage(video, sx, sy, sw, sh, 0, 0, 32, 18);
          const d = sctx.getImageData(0, 0, 32, 18).data;
          let sum = 0;
          for (let i = 0; i < d.length; i += 4) {
            sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
          }
          const lum = sum / (d.length / 4);
          const frosted = c.classList.contains("card-glass");
          if (!frosted && lum > 16) c.classList.add("card-glass");
          else if (frosted && lum < 10) c.classList.remove("card-glass");
        } catch {
          // Sampling unavailable (tainted/at-fault) → keep the still
          c.classList.remove("card-glass");
        }
      }
    };

    // Progress from the section's viewport traversal — same mapping as
    // ScrollTrigger's "top bottom" → "bottom top", derived directly from
    // the Lenis-smoothed native scroll position. The video engine needs no
    // GSAP at all (video-engine visitors never fetch the GSAP chunk).
    let rafId = 0;
    let wasLive = false;
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
      // chapter-live scopes the scrim relax to the luminous window
      const live = p > glassFrom && p < glassTo;
      if (live !== wasLive) {
        wasLive = live;
        root.classList.toggle("chapter-live", live);
        if (!live) unfrostAll();
      }
      if (live) sampleCards(performance.now());
      if (badge) {
        badge.textContent = `${chapter}  p=${p.toFixed(3)}  window=${live ? "IN" : "out"}  glass=${cards.filter((c) => c.classList.contains("card-glass")).length}/${cards.length}`;
      }
      applySeek();
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    // Re-sample after each landed seek too: at rest mid-window the frame
    // under a card is only final once the seek completes.
    const onSeekedSample = () => {
      if (wasLive) sampleCards(performance.now());
    };
    video.addEventListener("seeked", onSeekedSample);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("seeked", onSeekedSample);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("emptied", onEmptied);
      if (badge) badge.remove();
      unfrostAll();
    };
  }, [active, useVideo, chapter, restAtEnd, glassFrom, glassTo]);

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
          // Frames fallback keeps the Phase 13 stills always: without the
          // video element there is no per-card luminance sampling, and the
          // structural rule is "no verified light behind, no frost".
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
  }, [active, useVideo, chapter, frames, nativeW, nativeH, restAtEnd, glassFrom, glassTo]);

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
        {/* Footage dimmed, content never: flat scrim + vertical gradient.
            The flat scrim relaxes during the glass window (CSS below) so
            the world visibly breathes through the cards. */}
        <div className="journey-scrim absolute inset-0 bg-ink/45" />
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
