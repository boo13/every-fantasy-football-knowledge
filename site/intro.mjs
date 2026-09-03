import { drawIntroFrame } from './intro-art.mjs';

export const INTRO_DURATION = 24000;
const SCENES = [
  ['stadium', 0, 4400],
  ['crowd', 4400, 4100],
  ['bench', 8500, 4500],
  ['referee', 13000, 4200],
  ['snap', 17200, 5400],
  ['wipe', 22600, 1400]
];
const FRAME_INTERVAL = 1000 / 15;
const loopTime = value => Number.isFinite(value) ? ((value % INTRO_DURATION) + INTRO_DURATION) % INTRO_DURATION : 0;

export function sceneAt(milliseconds) {
  const time = loopTime(milliseconds);
  const index = SCENES.findIndex(([, start, duration]) => time >= start && time < start + duration);
  const [name, start, duration] = SCENES[index];
  return { name, index, elapsed: time - start, duration };
}

export function createIntro(canvas, { onSceneChange } = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('The football intro requires a 2D canvas.');
  const doc = canvas.ownerDocument;
  const win = doc.defaultView;
  const reduce = win.matchMedia('(prefers-reduced-motion: reduce)');
  const bounds = canvas.getBoundingClientRect();
  let visible = bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.right > 0 && bounds.top < win.innerHeight && bounds.left < win.innerWidth;
  let requested = false, destroyed = false, frame = null, anchor = null, elapsed = 0, lastPaint = -Infinity, paints = 0, currentScene = null;
  canvas.width = 480;
  canvas.height = 240;
  canvas.style.imageRendering = 'pixelated';
  canvas.dataset.playing = 'false';

  function paint(milliseconds) {
    const time = loopTime(milliseconds), scene = sceneAt(time);
    drawIntroFrame(ctx, scene.name, scene.elapsed);
    canvas.dataset.scene = scene.name;
    canvas.dataset.frame = String(Math.floor(time / FRAME_INTERVAL));
    canvas.dataset.paintCount = String(++paints);
    if (currentScene !== scene.name) {
      currentScene = scene.name;
      onSceneChange?.(scene.name, scene);
    }
  }

  function canPlay() {
    return requested && !destroyed && !reduce.matches && !doc.hidden && visible;
  }

  function stop() {
    if (anchor !== null) elapsed = loopTime(elapsed + win.performance.now() - anchor);
    anchor = null;
    if (frame !== null) win.cancelAnimationFrame(frame);
    frame = null;
    canvas.dataset.playing = 'false';
  }

  function tick(now) {
    frame = null;
    if (!canPlay()) { stop(); return; }
    if (anchor === null) anchor = now;
    if (now - lastPaint >= FRAME_INTERVAL) {
      paint(elapsed + now - anchor);
      lastPaint = now;
    }
    if (canPlay()) frame = win.requestAnimationFrame(tick);
  }

  function sync() {
    if (!canPlay()) { stop(); return; }
    canvas.dataset.playing = 'true';
    if (frame === null) {
      lastPaint = -Infinity;
      frame = win.requestAnimationFrame(tick);
    }
  }

  const observer = new win.IntersectionObserver(entries => {
    const entry = entries.find(item => item.target === canvas);
    if (entry) { visible = entry.isIntersecting && entry.intersectionRatio > 0; sync(); }
  }, { threshold: 0 });
  observer.observe(canvas);
  doc.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  paint(0);

  return {
    setMotion(enabled) {
      if (destroyed) return;
      requested = Boolean(enabled);
      sync();
    },
    renderAt(milliseconds) {
      if (destroyed) return;
      requested = false;
      stop();
      elapsed = loopTime(milliseconds);
      paint(elapsed);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      requested = false;
      stop();
      observer.disconnect();
      doc.removeEventListener('visibilitychange', sync);
      reduce.removeEventListener('change', sync);
    }
  };
}
