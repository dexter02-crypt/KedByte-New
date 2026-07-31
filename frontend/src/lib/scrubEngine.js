/**
 * Chooses the journey scrub engine once per load.
 *
 * Engines:
 *   "video"  — all-keyframe MP4 driven by currentTime (241 seekable frames
 *              per chapter, ~8.4px of scroll per frame). Streams on demand;
 *              no decoded-bitmap cache in JS.
 *   "frames" — 75-frame WebP canvas scrub with adaptive sub-frame blending
 *              (the Phase 14 pipeline, kept as the fallback).
 *
 * Measured seek latency on the all-keyframe encodes (ch03 medians,
 * 2026-07-31, seeked-event round trip): Chromium 5-6ms fwd/rev; WebKit
 * (Safari engine) 1ms fwd/rev — all-intra encoding removes Safari's usual
 * GOP-seek penalty. Both are far under one 60fps frame (16.7ms), so both
 * default to video. Firefox is unmeasured → conservative frame fallback.
 *
 * Save-data / slow connections get frames (smaller transfer), matching the
 * intro's connection courtesy. ?engine=video|frames stays as an explicit
 * override — the A/B escape hatch for future tuning phases.
 */
export function chooseScrubEngine() {
  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || ""))) {
    return "frames";
  }
  const q = new URLSearchParams(window.location.search).get("engine");
  if (q === "video" || q === "frames") return q;
  const ua = navigator.userAgent;
  const isChromium = /Chrom(e|ium)|Edg\//.test(ua);
  const isSafari = /Safari\//.test(ua) && !isChromium;
  return isChromium || isSafari ? "video" : "frames";
}
