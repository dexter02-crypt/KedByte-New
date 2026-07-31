import { useEffect, useRef } from "react";
import { chooseScrubEngine } from "@/lib/scrubEngine";

/**
 * HeroScrub — desktop-only scroll-scrubbed hero background.
 *
 * 75 WebP frames (public/hero-seq, ~950 KB total) cut from a single
 * constant-speed camera move past the brand monolith; scroll position
 * drives the frame index, so the scrub easing comes entirely from the
 * user's scroll (Lenis included) — the shot itself has no easing.
 *
 * Mounted only when hover-capable AND motion-safe (Home decides); mobile
 * and reduced-motion render the static hero exactly as before, so this
 * file never needs its own gating.
 *
 * Loading never blocks first paint: the static poster <img> renders
 * immediately (same attrs as the static hero, so CLS stays 0), then
 * frames stream in three passes — every 8th, every 2nd, then all —
 * and the canvas fades in over the poster once frame 0 has decoded.
 * Until a frame's own file arrives, the nearest loaded neighbour is
 * drawn, so early scrubbing degrades to a coarser step, never a blank.
 */
const FRAME_COUNT = 75;
const NATIVE_W = 1172;
const NATIVE_H = 784;
// Fill cost cap: hero canvas is viewport-sized; above 1.5x DPR the extra
// pixels are invisible on a moving dark frame but double the raster work.
const MAX_DPR = 1.5;

const frameSrc = (i) => `/hero-seq/f_${String(i + 1).padStart(3, "0")}.webp`;

// Same engine decision as the journey chapters (lib/scrubEngine.js):
// all-keyframe MP4 via currentTime on Chromium/Safari, frame canvas
// elsewhere. The hero video's frame 0 is the same still the poster shows
// and the intro lands on, so every handoff stays pixel-consistent.
const ENGINE = typeof window !== "undefined" ? chooseScrubEngine() : "frames";
const VIDEO_DURATION_FALLBACK = 10.04;

export default function HeroScrub({ progress, poster, posterSet, alt }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const useVideo = ENGINE === "video";

  // Video engine: seek pacing identical to JourneyChapter — one seek in
  // flight, newest target applied on 'seeked'; no torn frames possible.
  useEffect(() => {
    if (!useVideo) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

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
        video.style.opacity = "1";
      }
      applySeek();
    };
    const onMeta = () => applySeek();
    const onEmptied = () => {
      seeking = false; // a load() reset aborts seeks without 'seeked'
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("emptied", onEmptied);
    if (video.readyState === 0) video.load();

    const unsubscribe = progress.on("change", (v) => {
      const dur = video.duration || VIDEO_DURATION_FALLBACK;
      desired = Math.min(dur - 1 / 30, Math.max(0, v) * dur);
      applySeek();
    });

    return () => {
      unsubscribe();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("emptied", onEmptied);
    };
  }, [useVideo, progress]);

  useEffect(() => {
    if (useVideo) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    const images = new Array(FRAME_COUNT).fill(null);
    let disposed = false;
    let shown = false;
    let drawnKey = -1;
    let targetFloat = 0; // continuous frame position for sub-frame blending
    let rafId = 0;

    const nearestLoaded = (i) => {
      if (images[i]) return i;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };

    // Adaptive sub-frame interpolation (see lib/frameScrub.js): cross-blend
    // at slow scrub speeds where discrete frame steps would read as stutter;
    // single-frame draws during fast movement where they can't.
    const draw = () => {
      rafId = 0;
      const { width: cw, height: ch } = canvas;
      if (!cw || !ch) return;
      const speed = drawnKey === -1 ? FRAME_COUNT : Math.abs(targetFloat - drawnKey);
      const i0 = Math.floor(targetFloat);
      const i1 = Math.min(FRAME_COUNT - 1, i0 + 1);
      const frac = targetFloat - i0;
      const a = nearestLoaded(i0);
      if (a === -1) return;
      // Gate 1.5 + smoothstep alpha (see lib/frameScrub.js, tuning round 2)
      const canBlend = speed < 1.5 && images[i0] && images[i1] && i1 !== i0;
      const blend = canBlend ? frac * frac * (3 - 2 * frac) : 0;
      const key = canBlend ? i0 + blend : images[Math.round(targetFloat)] ? Math.round(targetFloat) : a;
      if (Math.abs(key - drawnKey) < 0.02) return;
      // object-fit: cover
      const scale = Math.max(cw / NATIVE_W, ch / NATIVE_H);
      const dw = NATIVE_W * scale;
      const dh = NATIVE_H * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(images[canBlend ? i0 : Math.floor(key)] || images[a], dx, dy, dw, dh);
      if (blend > 0.01) {
        ctx.globalAlpha = blend;
        ctx.drawImage(images[i1], dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }
      drawnKey = key;
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
      }
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawnKey = -1; // canvas reset cleared the bitmap
      schedule();
    };

    const load = (i) =>
      new Promise((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.onload = async () => {
          // Pre-decode so the first drawImage of a frame never pays the
          // decode cost mid-scrub
          try {
            await img.decode();
          } catch {
            /* still renders via drawImage's sync path */
          }
          if (!disposed) {
            images[i] = img;
            // Repaint only when this frame is near the scrub position or
            // nothing has painted yet (see lib/frameScrub.js)
            if (drawnKey === -1 || Math.abs(i - targetFloat) <= 8) schedule();
          }
          resolve();
        };
        img.onerror = resolve; // missing frame: neighbours keep covering it
        img.src = frameSrc(i);
      });

    const loadPass = async (stride) => {
      const jobs = [];
      for (let i = 0; i < FRAME_COUNT; i += stride) jobs.push(load(i));
      await Promise.all(jobs);
    };

    (async () => {
      await loadPass(8);
      if (disposed) return;
      await loadPass(2);
      if (disposed) return;
      await loadPass(1);
    })();

    resize();
    window.addEventListener("resize", resize);
    const unsubscribe = progress.on("change", (v) => {
      targetFloat = Math.max(0, Math.min(FRAME_COUNT - 1, v * (FRAME_COUNT - 1)));
      schedule();
    });

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [useVideo, progress]);

  return (
    <div className="relative h-full w-full" data-testid="hero-scrub">
      {/* Poster: identical to the static hero image, on screen from first
          paint until frame 0 decodes (and permanently underneath after) */}
      <img
        ref={imgRef}
        src={poster}
        srcSet={posterSet}
        sizes="100vw"
        width={1600}
        height={1067}
        loading="eager"
        fetchPriority="high"
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {useVideo ? (
        <video
          ref={videoRef}
          src="/hero-seq/hero-scrub.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
        />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300"
        />
      )}
    </div>
  );
}
