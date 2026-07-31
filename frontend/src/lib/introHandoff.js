// Set once by App when the cinematic intro hands off to the app. Home reads
// it to skip the hero's entrance-only black overlay and entrance zoom — the
// intro has already landed on the hero's resting frame, so replaying those
// would flash the scene. Module state (not sessionStorage): it must be true
// only for the load where the handoff actually happened.
let handoff = false;

export const markIntroHandoff = () => {
  handoff = true;
};

export const wasIntroHandoff = () => handoff;
