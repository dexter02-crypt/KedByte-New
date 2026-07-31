/**
 * createFrameScrubber — canvas frame-sequence scrubber shared by the journey
 * chapters (the hero keeps its own equivalent in HeroScrub, verified in
 * Phase 13; not unified to avoid touching a shipped component).
 *
 * Frames stream in three passes (every 8th, every 2nd, all) started by
 * load(); until a frame's file arrives the nearest loaded neighbour draws,
 * so early scrubbing degrades to a coarser step, never a blank. Cover-fit
 * drawing, DPR capped at 1.5 (dark moving footage gains nothing above that
 * and the fill cost doubles).
 */
export function createFrameScrubber(canvas, { basePath, count, nativeW, nativeH }) {
  const ctx = canvas.getContext("2d");
  const images = new Array(count).fill(null);
  let disposed = false;
  let loading = false;
  let drawnKey = -1;
  let targetFloat = 0; // continuous frame position, e.g. 41.37
  let rafId = 0;
  let onFirstDraw = null;

  const src = (i) => `${basePath}/f_${String(i + 1).padStart(3, "0")}.webp`;

  const nearestLoaded = (i) => {
    if (images[i]) return i;
    for (let d = 1; d < count; d++) {
      if (images[i - d]) return i - d;
      if (images[i + d]) return i + d;
    }
    return -1;
  };

  // ADAPTIVE sub-frame interpolation. The chapters cover 20-30px of scroll
  // per source frame, which reads as stutter when frames swap discretely —
  // but only at SLOW scroll speeds: during fast movement the source frames
  // themselves advance every repaint and discrete steps are imperceptible.
  // So: below ~1 frame of movement per repaint, cross-blend the two
  // neighbouring frames at the fractional position (perceived-continuous
  // motion, two GPU drawImage calls); at or above it, draw the single
  // nearest frame (halves the raster cost exactly when repaints are most
  // frequent — this kept the 4x-throttle trace jank-free).
  const draw = () => {
    rafId = 0;
    const { width: cw, height: ch } = canvas;
    if (!cw || !ch) return;
    const speed = drawnKey === -1 ? count : Math.abs(targetFloat - drawnKey);
    const i0 = Math.floor(targetFloat);
    const i1 = Math.min(count - 1, i0 + 1);
    const frac = targetFloat - i0;
    const a = nearestLoaded(i0);
    if (a === -1) return;
    // Feel-tuning round 2: gate raised 0.9 → 1.5 (blend persists through
    // medium speeds) and the alpha is smoothstepped — linear alpha spends
    // equal time "half-ghosted" between frames; smoothstep snaps residency
    // toward the nearer frame, which reads as less micro-judder at creep.
    const canBlend = speed < 1.5 && images[i0] && images[i1] && i1 !== i0;
    const blend = canBlend ? frac * frac * (3 - 2 * frac) : 0;
    const key = canBlend ? i0 + blend : images[Math.round(targetFloat)] ? Math.round(targetFloat) : a;
    // 0.02 frame units ≈ 0.5px of scroll — below perception; skips the
    // near-idle repaints at the end of Lenis's settle tail
    if (Math.abs(key - drawnKey) < 0.02) return;
    const scale = Math.max(cw / nativeW, ch / nativeH);
    const dw = nativeW * scale;
    const dh = nativeH * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.drawImage(images[canBlend ? i0 : Math.floor(key)] || images[a], dx, dy, dw, dh);
    if (blend > 0.01) {
      ctx.globalAlpha = blend;
      ctx.drawImage(images[i1], dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    }
    drawnKey = key;
    if (onFirstDraw) {
      onFirstDraw();
      onFirstDraw = null;
    }
  };

  const schedule = () => {
    if (!rafId) rafId = requestAnimationFrame(draw);
  };

  const loadOne = (i) =>
    new Promise((resolve) => {
      if (images[i]) return resolve();
      const img = new Image();
      img.onload = async () => {
        // Pre-decode off the display path: without this the first drawImage
        // of each frame pays the decode cost mid-scrub and hitches.
        try {
          await img.decode();
        } catch {
          /* decode failure still renders via drawImage's sync path */
        }
        if (!disposed) {
          images[i] = img;
          // Repaint only when this frame can change the current draw:
          // it's near the scrub position (within one pass-1 stride) or
          // nothing has been drawn yet. Without this guard the load
          // bursts trigger a repaint per arriving frame — a draw storm
          // that showed up as long frames under 4x throttle.
          if (drawnKey === -1 || Math.abs(i - targetFloat) <= 8) schedule();
        }
        resolve();
      };
      img.onerror = resolve;
      img.src = src(i);
    });

  const loadPass = async (stride) => {
    const jobs = [];
    for (let i = 0; i < count; i += stride) jobs.push(loadOne(i));
    await Promise.all(jobs);
  };

  return {
    load() {
      if (loading || disposed) return;
      loading = true;
      (async () => {
        await loadPass(8);
        if (disposed) return;
        await loadPass(2);
        if (disposed) return;
        await loadPass(1);
      })();
    },
    setProgress(p) {
      targetFloat = Math.max(0, Math.min(count - 1, p * (count - 1)));
      schedule();
    },
    resize() {
      // 1.25 (vs the hero's 1.5): chapter footage now repaints every scroll
      // delta with a two-draw blend — the extra pixels above 1.25 are
      // invisible on dark motion frames but cost ~30% more raster time,
      // which showed up as long frames in the 4x-throttle trace.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawnKey = -1;
      schedule();
    },
    onFirstDraw(cb) {
      onFirstDraw = cb;
    },
    dispose() {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
