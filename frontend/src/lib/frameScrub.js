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
  let drawnIndex = -1;
  let targetIndex = 0;
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

  const draw = () => {
    rafId = 0;
    const idx = nearestLoaded(targetIndex);
    if (idx === -1 || idx === drawnIndex) return;
    const { width: cw, height: ch } = canvas;
    if (!cw || !ch) return;
    const scale = Math.max(cw / nativeW, ch / nativeH);
    const dw = nativeW * scale;
    const dh = nativeH * scale;
    ctx.drawImage(images[idx], (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    drawnIndex = idx;
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
      img.onload = () => {
        if (!disposed) {
          images[i] = img;
          if (nearestLoaded(targetIndex) !== drawnIndex) schedule();
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
      targetIndex = Math.max(0, Math.min(count - 1, Math.round(p * (count - 1))));
      schedule();
    },
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawnIndex = -1;
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
