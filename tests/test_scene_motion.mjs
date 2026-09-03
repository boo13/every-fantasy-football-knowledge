import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../site/scene.js', import.meta.url), 'utf8');
const { createScene } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const art = JSON.parse(await readFile(new URL('../site/assets/sprites.json', import.meta.url), 'utf8'));

function events(target = {}) {
  const listeners = new Map();
  return Object.assign(target, {
    listeners,
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); },
    dispatch(type, event = {}) { listeners.get(type)?.(event); },
  });
}

function canvas() {
  const context = {
    pixels: new Map(), drawings: [], fields: 0,
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    putImageData() { this.fields++; },
    fillRect(x, y) { this.pixels.set(`${x},${y}`, this.fillStyle); },
    clearRect() { this.drawings = []; },
    drawImage(image, ...bounds) { this.drawings.push({ image, bounds }); },
    beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {},
  };
  return events({ width: 0, height: 0, dataset: {}, style: {}, context, getContext: () => context });
}

function harness(t, { reduced = false, width = 960 } = {}) {
  const originals = new Map(), frames = new Map(), observers = [];
  let frameId = 0, now = 0, selected = 'fixture-C', resolveFonts;
  const players = 'ABCDEFGH'.split('').map(slot => ({ id: `fixture-${slot}`, slot, skin: '#bc8054' }));
  const rect = (left, top, w, h) => ({ left, top, width: w, height: h, right: left + w, bottom: top + h });
  const stage = events({ clientWidth: width, clientHeight: 380, dataset: {}, style: {}, getBoundingClientRect: () => rect(0, 0, stage.clientWidth, 380) });
  const field = canvas(), layer = canvas();
  layer.getBoundingClientRect = () => rect(0, 0, stage.clientWidth, 380);
  const actor = { style: {} };
  const bubble = { style: {}, dataset: {}, offsetWidth: 100, getBoundingClientRect: () => rect(500, 60, 100, 70) };
  const plate = { style: {}, offsetWidth: 130, offsetHeight: 20, getBoundingClientRect: () => rect(200, 200, 130, 20) };
  const hud = { getBoundingClientRect: () => rect(740, 310, 200, 60) };
  const nodes = { '.pd-stadium': stage, '.pd-field': field, '.pd-player-layer': layer, '.pd-actor': actor, '#pd-bubble': bubble, '#pd-nameplate': plate, '.pd-scene-detail': hud };
  const root = { dataset: { motion: 'on' }, querySelector: selector => nodes[selector] };
  const documentRef = events({ hidden: false, fonts: { ready: new Promise(resolve => { resolveFonts = resolve; }) }, createElement: () => canvas() });
  const media = events({ matches: reduced });
  class Observer {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  for (const [key, value] of Object.entries({ document: documentRef, matchMedia: () => media, ResizeObserver: Observer, IntersectionObserver: Observer,
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; }, cancelAnimationFrame: id => frames.delete(id) })) {
    originals.set(key, globalThis[key]); globalThis[key] = value;
  }
  const scene = createScene(root, art, { actors: () => players, selected: () => selected });
  scene.draw();
  t.after(() => { scene.destroy?.(); for (const [key, value] of originals) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } });
  return { scene, layer, field, actor, stage, root, players, media, documentRef, frames, observers, resolveFonts,
    actors: () => JSON.parse(layer.dataset.scene),
    select(id) { selected = id; scene.draw(); },
    tick(milliseconds = 180) { now += milliseconds; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now)); },
    hit(id) {
      const p = JSON.parse(layer.dataset.scene).find(player => player.id === id);
      const drawing = layer.context.drawings.findLast(value => value.bounds[0] === p.x && value.bounds[1] === p.y);
      const [x, y] = [...drawing.image.context.pixels.keys()].map(key => key.split(',').map(Number)).find(([x, y]) => y >= 18 && y <= 25 && x >= 14 && x <= 20);
      layer.dispatch('pointermove', { clientX: (p.x + (x + .5) * p.width / 32) * 2, clientY: (p.y + (y + .5) * p.height / 48) * 2, pointerType: 'mouse' });
    },
  };
}

test('finite reaction frames and perspective geometry stay compatible', t => {
  const h = harness(t);
  const geometry = h.actors().map(({ id, x, y, width, height, depth }) => ({ id, x, y, width, height, depth }));
  h.scene.react('picked', 'fixture-A'); h.scene.draw(3);
  assert.equal(h.layer.dataset.frame, '3');
  assert.match(h.actors().find(p => p.id === 'fixture-C').frameKey, /^front-picked-/);
  assert.equal(h.actors().find(p => p.id === 'fixture-A').pose, 'annoyed');
  h.scene.draw(0); h.scene.react('picked');
  assert.equal(h.layer.dataset.frame, '0');
  assert.deepEqual(h.actors().map(({ id, x, y, width, height, depth }) => ({ id, x, y, width, height, depth })), geometry);
});

test('motion caches turf while distinct articulated poses change without moving the feet or labels', t => {
  const h = harness(t), fields = h.field.context.fields, label = h.actor.style.cssText;
  const initial = h.actors();
  const seen = new Map(initial.map(p => [p.id, new Set([p.frameKey])]));
  const bootPixels = image => [...image.context.pixels].filter(([key]) => Number(key.split(',')[1]) >= 43);
  const boots = new Map(initial.map((p, index) => [p.id, bootPixels(h.layer.context.drawings[index].image)]));
  const pixels = new Map(initial.map(p => [p.id, new Set()]));
  for (let tick = 0; tick < 45; tick++) {
    h.tick(); h.actors().forEach((p, index) => {
      const image = h.layer.context.drawings[index].image;
      seen.get(p.id).add(p.frameKey); pixels.get(p.id).add(JSON.stringify([...image.context.pixels]));
      assert.deepEqual(bootPixels(image), boots.get(p.id));
    });
  }
  assert.ok([...seen.values()].every(keys => keys.size > 1));
  assert.ok([...pixels.values()].every(variants => variants.size > 1));
  assert.ok(new Set(h.actors().map(p => p.motionStep)).size > 1);
  assert.ok(h.actors().some(p => p.motion === 'idle'));
  assert.equal(h.layer.dataset.frame, '0');
  assert.equal(h.field.context.fields, fields);
  assert.equal(h.actor.style.cssText, label);
  assert.deepEqual(h.actors().map(({ x, y, width, height }) => ({ x, y, width, height })), initial.map(({ x, y, width, height }) => ({ x, y, width, height })));
  h.scene.draw(3); h.scene.draw(4);
  assert.equal(h.field.context.fields, fields);
  h.stage.clientWidth = 800; h.scene.draw();
  assert.equal(h.field.context.fields, fields + 1);
});

test('narrow-screen selection invalidates the camera cache but animation does not', t => {
  const h = harness(t, { width: 390 }), fields = h.field.context.fields;
  h.select('fixture-A');
  assert.equal(h.field.context.fields, fields + 1);
  h.scene.draw(1); h.tick(); h.tick();
  assert.equal(h.field.context.fields, fields + 1);
});

test('hover targets only an exact rendered player, never selection or an off-field replacement', t => {
  const h = harness(t), selectedBounds = h.actor.style.cssText;
  h.scene.hover('fixture-D');
  assert.deepEqual(h.actors().filter(p => p.motion === 'hover').map(p => p.id), ['fixture-D']);
  assert.equal(h.actor.style.cssText, selectedBounds);
  h.scene.hover('fixture-not-rendered');
  assert.ok(h.actors().every(p => p.motion !== 'hover'));
  h.scene.hover('fixture-D'); h.players.splice(h.players.findIndex(p => p.id === 'fixture-D'), 1); h.scene.draw();
  assert.ok(h.actors().every(p => p.motion !== 'hover'));
  h.scene.hover(null);
});

test('field pointer hit-testing uses painted pixels, not the rectangular canvas or transparent corners', t => {
  const h = harness(t);
  h.hit('fixture-A');
  assert.deepEqual(h.actors().filter(p => p.motion === 'hover').map(p => p.id), ['fixture-A']);
  const p = h.actors().find(player => player.id === 'fixture-A');
  h.layer.dispatch('pointermove', { clientX: p.x * 2, clientY: p.y * 2, pointerType: 'mouse' });
  assert.ok(h.actors().every(player => player.motion !== 'hover'));
  h.hit('fixture-A'); h.layer.dispatch('pointerleave');
  assert.ok(h.actors().every(player => player.motion !== 'hover'));
});

test('idle and hover cannot replace finite pick or passed-over frames', t => {
  const h = harness(t);
  h.scene.react('picked', 'fixture-A'); h.scene.draw(3);
  h.scene.hover('fixture-C'); h.tick(); h.tick();
  assert.equal(h.actors().find(p => p.id === 'fixture-C').motion, 'reaction');
  assert.equal(h.actors().find(p => p.id === 'fixture-C').frameKey, 'front-picked-2');
  h.scene.hover('fixture-A'); h.tick();
  assert.equal(h.actors().find(p => p.id === 'fixture-A').frameKey, 'front-annoyed-3');
  assert.equal(h.layer.dataset.frame, '3');
  h.scene.draw(0); h.scene.react('picked');
  assert.equal(h.layer.dataset.frame, '0');
});

test('disabled and reduced motion hold a stable authored still with no scheduled work', t => {
  const h = harness(t);
  h.scene.setMotion(false); h.scene.hover('fixture-D');
  const still = h.layer.dataset.scene;
  for (let tick = 0; tick < 5; tick++) h.tick();
  assert.equal(h.frames.size, 0); assert.equal(h.layer.dataset.scene, still);
  assert.ok(h.actors().every(p => p.motion === 'still'));
  h.scene.setMotion(true); assert.equal(h.frames.size, 1);
  h.media.matches = true; h.media.dispatch('change');
  assert.equal(h.frames.size, 0); assert.ok(h.actors().every(p => p.motion === 'still'));
  h.media.matches = false; h.media.dispatch('change');
  assert.equal(h.frames.size, 1);
});

test('hidden and offscreen fields pause safely; destroy cancels every listener, observer and late font draw', async t => {
  const h = harness(t);
  h.documentRef.hidden = true; h.documentRef.dispatch('visibilitychange'); assert.equal(h.frames.size, 0);
  h.documentRef.hidden = false; h.documentRef.dispatch('visibilitychange'); assert.equal(h.frames.size, 1);
  const intersection = h.observers.find(observer => observer !== h.observers[0]);
  intersection.callback([{ isIntersecting: false }]); assert.equal(h.frames.size, 0);
  intersection.callback([{ isIntersecting: true }]); assert.equal(h.frames.size, 1);
  h.scene.destroy(); const fields = h.field.context.fields, scene = h.layer.dataset.scene;
  h.resolveFonts(); await Promise.resolve(); h.tick();
  assert.equal(h.frames.size, 0); assert.ok(h.observers.every(observer => observer.disconnected));
  assert.equal(h.documentRef.listeners.size, 0); assert.equal(h.media.listeners.size, 0); assert.equal(h.layer.listeners.size, 0);
  assert.equal(h.field.context.fields, fields); assert.equal(h.layer.dataset.scene, scene);
});
