import test from 'node:test';
import assert from 'node:assert/strict';
import { INTRO_DURATION, createIntro, sceneAt } from '../site/intro.mjs';

test('the attract sequence gives all five shots a readable interval before its wipe', () => {
  const starts = [0, 4400, 8500, 13000, 17200, 22600];
  const names = ['stadium', 'crowd', 'bench', 'referee', 'snap', 'wipe'];
  starts.forEach((start, index) => {
    const end = starts[index + 1] ?? INTRO_DURATION;
    assert.deepEqual(sceneAt(start), { name: names[index], index, elapsed: 0, duration: end - start });
    assert.equal(sceneAt(end - 1).name, names[index]);
  });
});

test('the loop wraps deterministically and invalid capture times use the opening still', () => {
  assert.equal(INTRO_DURATION, 24000);
  for (const time of [0, 2100, 6300, 10800, 15600, 20600, 23300]) {
    assert.deepEqual(sceneAt(time + INTRO_DURATION * 3), sceneAt(time));
  }
  assert.deepEqual(sceneAt(-1), sceneAt(INTRO_DURATION - 1));
  for (const time of [NaN, Infinity, -Infinity, undefined]) assert.deepEqual(sceneAt(time), sceneAt(0));
});

function harness(t, onSceneChange) {
  const frames = new Map(), removed = [];
  let now = 0, sequence = 0, observer;
  const media = Object.assign(new EventTarget(), { matches: false });
  const doc = Object.assign(new EventTarget(), { hidden: false });
  for (const target of [media, doc]) {
    const remove = target.removeEventListener.bind(target);
    target.removeEventListener = (type, callback) => { removed.push([target, type]); remove(type, callback); };
  }
  doc.defaultView = {
    innerWidth: 1000, innerHeight: 1000, matchMedia: () => media, performance: { now: () => now },
    requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; this.disconnected = false; observer = this; }
      observe(target) { this.target = target; }
      disconnect() { this.disconnected = true; }
    },
  };
  const canvas = { ownerDocument: doc, dataset: {}, style: {}, getContext: () => ({ fillRect() {} }), getBoundingClientRect: () => ({ width: 480, height: 240, top: 0, left: 0, bottom: 240, right: 480 }) };
  const intro = createIntro(canvas, { onSceneChange });
  t.after(() => intro.destroy());
  return { intro, canvas, doc, media, frames, removed, observer,
    tick(milliseconds) { now += milliseconds; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now)); },
  };
}

test('intro hidden/resume preserves elapsed time and schedules only one frame', t => {
  const h = harness(t);
  assert.equal(h.frames.size, 0);
  h.intro.setMotion(true); h.intro.setMotion(true);
  assert.equal(h.frames.size, 1);
  h.tick(0); h.tick(1000);
  const frame = h.canvas.dataset.frame, paints = h.canvas.dataset.paintCount;
  h.doc.hidden = true; h.doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(h.frames.size, 0);
  h.tick(5000);
  assert.equal(h.canvas.dataset.paintCount, paints);
  h.doc.hidden = false; h.doc.dispatchEvent(new Event('visibilitychange'));
  h.doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(h.frames.size, 1);
  h.tick(0);
  assert.equal(h.canvas.dataset.frame, frame);
  h.tick(4400);
  assert.equal(h.canvas.dataset.scene, 'crowd');
});

test('intro destroy cancels work, removes listeners, and ignores late callbacks', t => {
  const h = harness(t);
  h.intro.setMotion(true);
  const lateFrame = [...h.frames.values()][0], paints = h.canvas.dataset.paintCount;
  h.intro.destroy();
  assert.equal(h.frames.size, 0);
  assert.equal(h.observer.disconnected, true);
  assert.deepEqual(h.removed, [[h.doc, 'visibilitychange'], [h.media, 'change']]);
  h.doc.dispatchEvent(new Event('visibilitychange')); h.media.dispatchEvent(new Event('change'));
  h.observer.callback([{ target: h.canvas, isIntersecting: true, intersectionRatio: 1 }]);
  lateFrame(5000); h.intro.setMotion(true); h.intro.renderAt(6000); h.intro.destroy();
  assert.equal(h.frames.size, 0);
  assert.equal(h.canvas.dataset.paintCount, paints);
  assert.equal(h.canvas.dataset.playing, 'false');
});

test('intro scene callbacks may stop playback without another frame being queued', t => {
  let intro;
  const h = harness(t, name => { if (name === 'crowd') intro.destroy(); });
  intro = h.intro;
  intro.setMotion(true); h.tick(0); h.tick(5000);
  assert.equal(h.canvas.dataset.scene, 'crowd');
  assert.equal(h.frames.size, 0);
  assert.equal(h.canvas.dataset.playing, 'false');
});
