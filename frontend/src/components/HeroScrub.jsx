import { useEffect, useRef } from "react";

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

export default function HeroScrub({ progress, poster, posterSet, alt }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    const images = new Array(FRAME_COUNT).fill(null);
    let disposed = false;
    let shown = false;
    let drawnIndex = -1;
    let targetIndex = 0;
    let rafId = 0;

    const nearestLoaded = (i) => {
      if (images[i]) return i;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };

    const draw = () => {
      rafId = 0;
      const idx = nearestLoaded(targetIndex);
      if (idx === -1 || idx === drawnIndex) return;
      const { width: cw, height: ch } = canvas;
      if (!cw || !ch) return;
      // object-fit: cover
      const scale = Math.max(cw / NATIVE_W, ch / NATIVE_H);
      const dw = NATIVE_W * scale;
      const dh = NATIVE_H * scale;
      ctx.drawImage(images[idx], (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawnIndex = idx;
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
      drawnIndex = -1; // canvas reset cleared the bitmap
      schedule();
    };

    const load = (i) =>
      new Promise((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.onload = () => {
          if (!disposed) {
            images[i] = img;
            // Repaint if this frame is at or near the current scroll position
            if (nearestLoaded(targetIndex) !== drawnIndex) schedule();
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
      targetIndex = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(v * (FRAME_COUNT - 1)))
      );
      schedule();
    });

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [progress]);

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
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300"
      />
    </div>
  );
}
