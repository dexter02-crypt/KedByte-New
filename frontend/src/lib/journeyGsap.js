import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, imported everywhere the journey needs it. Lenis drives the
// REAL window scroll (see SmoothScroll), so ScrollTrigger needs no
// scrollerProxy — the only wiring required is ScrollTrigger.update on Lenis's
// scroll event (done in Home), and the smoothing stays single-sourced:
// Lenis smooths, ScrollTrigger reads. scrub: true everywhere — a second
// smoothing layer (scrub: <n>) would double-smooth against Lenis.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
