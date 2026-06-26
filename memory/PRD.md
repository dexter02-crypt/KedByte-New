# Kedbyte Marketing Site — PRD

## Original Problem Statement
Clone the KedByte repository (multi-page marketing site for a full-service SaaS/tech company) and continue development. Iteratively the user has requested: environment setup, preview URL fix, custom cursor alignment fix, and a massive UI/UX overhaul with premium futuristic animations (Word Scramble, Morphing Text, Parallax, Terminal Typing, Page Scroll Indicator, and finally a cursor-tracking ambient glow background).

## Architecture
- Backend: FastAPI + Motor (Mongo) on port 8001. Contact form endpoint `/api/contact`, list `/api/contacts`.
- Frontend: React 19 + Tailwind + Framer Motion on port 3000. Routes: `/`, `/services`, `/about`, `/careers`, `/contact`, 404.
- Smooth scroll via Lenis. Global custom cursor + ambient glow + scroll progress + page scroll indicator.

## Completed (as of 2026-02)
- Environment + preview URL routing fixed.
- Custom Cursor alignment fix (Cursor.jsx + index.css).
- Animation overhaul: SplitText, MouseTilt3D, ParallaxLayer, AnimatedCounter, Spotlight, FloatingParticles, WordScramble, ScrollConnectedPath, TextScramble, BeamCursor, MorphingText, WaveText, GlitchText.
- Terminal "System Boot" typing animation in TerminalCard.
- Services intra-page smooth-scroll links + Header fade behaviors fixed.
- **CursorGlow ambient background** — deep midnight-blue radial glow (rgba(15,20,35,0.6)) with 180px blur, z-index -1 behind all content, pointer-events none, spring-damped follow. Verified on all 5 routes (100% pass, iteration_2.json, 2026-02).
- Orphaned files removed: SystemDeployAnimation.jsx, SystemDeployHero.jsx, Home.jsx.backup.

## Backlog / P1
- Resend email integration for contact form (requires user-provided API key).
- Pre-existing framer-motion warnings (low priority cleanup):
  - `animate maxWidth from "none" to "160"` — initialize numeric maxWidth on the offending component.
  - `useScroll target ref on static-positioned container` — add `position: relative` to that container.
- Optional CursorGlow perf nit: drive translate via x/y motion values instead of left/top for GPU efficiency.

## P2 / Future
- Contact form Resend wiring + admin notification.
- Accessibility audit (prefers-reduced-motion, focus rings, color contrast).
- Lighthouse pass on all routes.

## Files of Note
- `frontend/src/components/CursorGlow.jsx` — ambient cursor-tracking glow.
- `frontend/src/App.js` — renders CursorGlow as first child of App container.
- `frontend/src/index.css` — html bg #000000, body transparent (so negative z-index glow shows).
- `frontend/src/components/TerminalCard.jsx` — System Boot typing.
- `frontend/src/components/{WordScramble,MorphingText,PageScrollIndicator,WaveText,GlitchText,TextScramble,BeamCursor,ScrollConnectedPath}.jsx` — premium animations.
