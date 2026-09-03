const C = {
  ink: '#101b20', deep: '#192a2e', slate: '#34474a', steel: '#62726a', concrete: '#8e9b8b',
  pale: '#d2d5b7', white: '#f1efd2', sky: '#558a9a', skyLight: '#92b4aa',
  grass: '#427d16', grassLight: '#55981c', grassDark: '#2d6516', grassShade: '#244c1d',
  gold: '#d5ae37', goldLight: '#f2d568', goldShade: '#947025', green: '#265739',
  greenLight: '#487447', greenDark: '#16382c', orange: '#c8562e', orangeLight: '#e98043',
  skin: '#bf8a58', skinLight: '#dfac73', skinShade: '#805234', brown: '#633924', ball: '#945031'
};
const SHIRTS = ['#ba5435', '#e0c05e', '#416478', '#294e3b', '#d2d5b7', '#654753', '#738152'];
const SKINS = [['#cd9565', '#e2b480', '#885734'], ['#936344', '#b48155', '#593e2c'], ['#c39b77', '#e2ba8c', '#865b3d']];
const clamp = value => Math.max(0, Math.min(1, value));
const ramp = (time, start, end) => clamp((time - start) / (end - start));
const hash = (x, y, seed = 0) => ((Math.imul(x + seed + 19, 374761393) ^ Math.imul(y + 73, 668265263)) >>> 0);

function pen(ctx) {
  const rect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  };
  const poly = (points, color) => {
    const top = Math.max(0, Math.floor(Math.min(...points.map(p => p[1]))));
    const bottom = Math.min(240, Math.ceil(Math.max(...points.map(p => p[1]))));
    ctx.fillStyle = color;
    // Scanline spans keep every edge on the original pixel grid, without canvas antialiasing.
    for (let y = top; y < bottom; y++) {
      const edges = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i], b = points[(i + 1) % points.length];
        if ((a[1] <= y + .5 && b[1] > y + .5) || (b[1] <= y + .5 && a[1] > y + .5)) {
          edges.push(a[0] + (y + .5 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
        }
      }
      edges.sort((a, b) => a - b);
      for (let i = 0; i + 1 < edges.length; i += 2) ctx.fillRect(Math.round(edges[i]), y, Math.round(edges[i + 1]) - Math.round(edges[i]), 1);
    }
  };
  const line = (x0, y0, x1, y1, color, width = 1) => {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    while (true) {
      rect(x0 - Math.floor(width / 2), y0 - Math.floor(width / 2), width, width, color);
      if (x0 === x1 && y0 === y1) break;
      const next = error * 2;
      if (next >= dy) { error += dy; x0 += sx; }
      if (next <= dx) { error += dx; y0 += sy; }
    }
  };
  const oval = (x, y, width, height, color) => {
    for (let row = 0; row < height; row++) {
      const span = Math.sqrt(Math.max(0, 1 - ((row + .5 - height / 2) / (height / 2)) ** 2)) * width / 2;
      rect(x + width / 2 - span, y + row, span * 2, 1, color);
    }
  };
  const limb = (a, b, width, base, light, shade) => {
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = -(b[1] - a[1]) / length * width / 2, ny = (b[0] - a[0]) / length * width / 2;
    poly([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], shade);
    line(a[0], a[1], b[0], b[1], base, Math.max(2, width - 3));
    line(a[0] - 1, a[1], b[0] - 1, b[1], light, Math.max(1, Math.floor(width / 4)));
  };
  return { rect, poly, line, oval, limb };
}

function turf(ctx, horizon = 76) {
  const { rect } = pen(ctx);
  rect(0, horizon, 480, 240 - horizon, C.grass);
  for (let y = horizon; y < 240; y++) {
    const shade = Math.floor((y - horizon) / (13 + (y - horizon) * .16)) % 2 ? C.grassLight : C.grass;
    rect(0, y, 480, 1, shade);
    for (let x = (y * 7) % 5; x < 480; x += 5) {
      const n = hash(x, y);
      if (n % 7 < 3) rect(x, y, 1 + (n % 3 === 0 ? 1 : 0), 1, n % 2 ? '#5b8f22' : '#366e19');
    }
  }
}

function distantStands(ctx, top = 0, bottom = 71, seed = 0) {
  const { rect, line } = pen(ctx);
  rect(0, top, 480, bottom - top, C.deep);
  for (let y = top + 4; y < bottom - 4; y += 6) {
    line(0, y + 4, 480, y + 4, C.slate);
    for (let x = (y % 3) * 2; x < 480; x += 5) {
      const n = hash(x, y, seed);
      rect(x, y, 2, 2, SHIRTS[n % SHIRTS.length]);
      if (n % 4 === 0) rect(x + 1, y - 2, 1, 2, C.skin);
    }
  }
  rect(0, bottom - 5, 480, 5, C.pale);
  rect(0, bottom - 5, 480, 1, C.white);
  for (let x = 20; x < 480; x += 89) rect(x, top, 8, bottom - top - 5, C.slate);
}

function smallPlayer(ctx, x, y, side, pose = 0, scale = 1) {
  const { rect, oval, line } = pen(ctx);
  const shirt = side ? C.white : C.green;
  oval(x - 4 * scale, y + 7 * scale, 10 * scale, 3 * scale, C.grassShade);
  rect(x - 3 * scale, y, 7 * scale, 5 * scale, side ? C.concrete : C.greenDark);
  rect(x - 3 * scale, y, 6 * scale, 3 * scale, shirt);
  rect(x - 2 * scale, y - 4 * scale, 4 * scale, 4 * scale, side ? C.pale : C.gold);
  rect(x - scale, y - 4 * scale, 3 * scale, scale, side ? C.white : C.goldLight);
  line(x - 2 * scale, y + 4 * scale, x - (2 + pose) * scale, y + 8 * scale, C.pale, 2 * scale);
  line(x + 2 * scale, y + 4 * scale, x + (2 + pose) * scale, y + 8 * scale, C.white, 2 * scale);
  rect(x - (3 + pose) * scale, y + 8 * scale, 3 * scale, scale, C.ink);
  rect(x + (1 + pose) * scale, y + 8 * scale, 3 * scale, scale, C.ink);
}

function stadium(ctx, time) {
  const { rect, poly, line, oval } = pen(ctx);
  rect(0, 0, 480, 240, C.sky);
  rect(0, 0, 480, 15, '#417588');
  rect(0, 15, 480, 18, '#638f9a');
  rect(0, 33, 480, 26, C.skyLight);
  for (let i = 0; i < 26; i++) {
    const x = i * 21 - 7, height = 3 + hash(i, 3) % 16;
    rect(x, 51 - height, 15, height, '#667f7d');
    rect(x + 2, 53 - height, 2, 2, '#879992');
  }
  poly([[0, 117], [42, 66], [424, 53], [480, 118], [480, 240], [0, 240]], '#344d3a');
  poly([[14, 94], [69, 36], [374, 25], [451, 63], [480, 204], [431, 240], [33, 240], [0, 184]], C.ink);
  poly([[20, 92], [73, 40], [371, 30], [447, 67], [471, 184], [427, 231], [38, 231], [8, 175]], C.steel);
  poly([[44, 93], [83, 48], [365, 40], [428, 72], [452, 175], [413, 213], [55, 214], [28, 168]], C.deep);
  const point = (u, v) => [82 + u * 303 - v * 29 + u * v * 31, 91 - u * 8 + v * 113];
  for (let row = 0; row < 8; row++) {
    const y = 46 + row * 5;
    line(76 - row * 3, y, 370 + row * 5, y - 9, row % 3 ? C.slate : C.steel);
    for (let x = 80 - row * 3; x < 369 + row * 5; x += 4) {
      const sy = y - (x - 76) * .028;
      const n = hash(x, row);
      rect(x, sy - 2, 2, 2, SHIRTS[n % 7]);
      if (n % 5 === 0) rect(x + 1, sy - 3, 1, 1, C.pale);
    }
  }
  for (let row = 0; row < 8; row++) {
    line(21 + row * 5, 97, 21 + row * 5, 171 + row * 3, C.slate);
    line(428 + row * 4, 75, 441 + row * 3, 174 + row * 2, C.slate);
    for (let y = 94; y < 173 + row * 2; y += 4) {
      rect(22 + row * 4, y, 2, 2, SHIRTS[hash(row, y) % 7]);
      rect(430 + row * 4 + (y - 90) * .12, y, 2, 2, SHIRTS[hash(row + 1, y) % 7]);
    }
  }
  for (let row = 0; row < 4; row++) {
    const y = 216 + row * 5;
    line(41, y, 420, y - 2, C.slate);
    for (let x = 45; x < 419; x += 4) rect(x, y - 2, 2, 2, SHIRTS[hash(x, row) % 7]);
  }
  for (const x of [96, 175, 255, 332]) poly([[x, 42], [x + 5, 42], [x + 6, 77], [x + 1, 78]], C.steel);
  poly([[60, 87], [382, 77], [432, 209], [44, 215]], C.concrete);
  poly([[70, 91], [380, 82], [420, 201], [53, 207]], C.grassDark);
  for (let stripe = 0; stripe < 12; stripe++) poly([point(0, stripe / 12), point(1, stripe / 12), point(1, (stripe + 1) / 12), point(0, (stripe + 1) / 12)], stripe % 2 ? '#518f19' : '#3f7a15');
  for (let i = 0; i < 2800; i++) {
    const u = (hash(i, 3) % 1000) / 1000, v = (hash(i, 12) % 1000) / 1000;
    const p = point(u, v);
    rect(p[0], p[1], 1, 1, i % 2 ? '#66942b' : '#366d17');
  }
  poly([point(0, 0), point(1, 0), point(1, .09), point(0, .09)], C.greenDark);
  poly([point(0, .91), point(1, .91), point(1, 1), point(0, 1)], C.greenDark);
  for (let i = 0; i <= 10; i++) {
    const v = .09 + i * .082, a = point(0, v), b = point(1, v);
    line(...a, ...b, C.pale);
    if (i < 10) for (let h = 1; h < 5; h++) for (const u of [.03, .43, .57, .97]) {
      const a = point(u, v + h * .0164), b = point(u + .012, v + h * .0164);
      line(...a, ...b, '#b1c786');
    }
  }
  for (const u of [0, 1]) line(...point(u, 0), ...point(u, 1), C.white, 2);
  for (const v of [.02, .97]) {
    const p = point(.5, v);
    line(p[0], p[1] + 3, p[0], p[1] - 14, C.gold);
    line(p[0] - 11, p[1] - 14, p[0] + 11, p[1] - 14, C.goldLight);
    line(p[0] - 11, p[1] - 14, p[0] - 11, p[1] - 24, C.goldLight);
    line(p[0] + 11, p[1] - 14, p[0] + 11, p[1] - 24, C.goldLight);
  }
  for (let i = 0; i < 11; i++) {
    const u = .26 + i % 5 * .12, v = .35 + Math.floor(i / 5) * .055;
    const step = time > 1900 ? Math.floor(ramp(time, 1900, 3600) * (i % 3 + 1) * 5) : 0;
    const p = point(u, v);
    smallPlayer(ctx, p[0] + (i % 2 ? step : -step), p[1] + step, false, step ? i % 2 : 0);
    const other = point(u + .03, v + .14);
    smallPlayer(ctx, other[0] - step, other[1] - step / 2, true, step ? 1 : 0);
  }
  for (let i = 0; i < 18; i++) {
    const p = point(i / 18, .72);
    rect(65 + i * 19, 207 + i * .05, 3, 5, i % 3 ? C.gold : C.white);
    if (i % 4 === 0) oval(p[0], p[1], 2, 1, C.grassShade);
  }
  for (const [x, y] of [[49, 46], [420, 34], [16, 166], [456, 186]]) {
    line(x, y + 2, x, y + 30, C.ink, 2);
    rect(x - 12, y - 3, 26, 8, C.slate);
    for (let n = 0; n < 6; n++) rect(x - 10 + n * 4, y - 2, 3, 4, C.white);
  }
  poly([[71, 34], [365, 22], [394, 35], [62, 48]], C.pale);
  line(71, 34, 365, 22, C.white, 2);
  for (let i = 0; i < 13; i++) line(83 + i * 23, 35 - i, 75 + i * 25, 43 - i, C.steel);
}

function fan(ctx, x, y, size, seed, time, foreground = false) {
  const { rect, poly, oval, line, limb } = pen(ctx);
  const skin = SKINS[seed % SKINS.length], shirt = SHIRTS[seed % SHIRTS.length];
  const phase = Math.floor(time / (180 + seed % 4 * 40) + seed * 1.7) % 6;
  const raised = seed % 3 !== 0, lift = raised ? [0, 2, 5, 6, 4, 1][phase] : [0, 0, 1, 2, 1, 0][phase];
  const s = size / 40, p = (a, b) => [x + a * s, y + b * s];
  const shape = (points, color) => poly(points.map(([a, b]) => p(a, b)), color);
  oval(x - 14 * s, y + 31 * s, 30 * s, 7 * s, C.ink);
  shape([[-11, 12], [-4, 8], [7, 8], [14, 14], [12, 38], [-13, 38]], C.ink);
  shape([[-9, 13], [-3, 10], [6, 10], [12, 15], [10, 35], [-10, 35]], shirt);
  shape([[-9, 15], [-5, 13], [-4, 33], [-10, 35]], C.slate);
  line(...p(-2, 17), ...p(5, 17), seed % 2 ? C.pale : C.goldShade, Math.max(1, s));
  line(...p(4, 24), ...p(9, 27), C.deep, Math.max(1, s));
  rect(...p(-3, 5), 8 * s, 7 * s, skin[2]);
  shape([[-7, -3], [-3, -7], [5, -7], [9, -3], [9, 3], [5, 9], [-1, 9], [-6, 4]], skin[0]);
  shape([[-4, -4], [4, -5], [6, -1], [6, 4], [3, 6], [-3, 4]], skin[1]);
  rect(...p(6, 0), 4 * s, 3 * s, skin[0]);
  rect(...p(-2, -1), 2 * s, Math.max(1, s), C.ink);
  rect(...p(4, -1), 2 * s, Math.max(1, s), C.ink);
  rect(...p(1, 5), 4 * s, 2 * s, phase > 2 ? C.ink : skin[2]);
  shape([[-7, -1], [-7, -6], [-3, -10], [6, -9], [10, -4], [9, -2], [-1, -5]], seed % 2 ? C.brown : C.deep);
  if (seed % 3 === 1) {
    rect(...p(-8, -7), 17 * s, 5 * s, C.gold);
    rect(...p(4, -3), 10 * s, 2 * s, C.goldLight);
  }
  const leftElbow = raised ? p(-17, 10 - lift) : p(-13, 24), leftHand = raised ? p(-21, -6 - lift) : p(-3 + lift, 21);
  const rightElbow = seed % 4 ? p(19, 10 - lift) : p(16, 25), rightHand = seed % 4 ? p(24, -4 - lift) : p(5 - lift, 21);
  for (const [shoulder, elbow, hand] of [[p(-10, 14), leftElbow, leftHand], [p(11, 14), rightElbow, rightHand]]) {
    limb(shoulder, elbow, 7 * s, shirt, shirt, C.deep);
    limb(elbow, hand, 5 * s, skin[0], skin[1], skin[2]);
    oval(hand[0] - 3 * s, hand[1] - 4 * s, 6 * s, 7 * s, skin[0]);
    rect(hand[0] - 2 * s, hand[1] - 3 * s, 2 * s, 3 * s, skin[1]);
  }
  if (foreground && seed % 5 === 0) {
    const hand = rightHand;
    poly([[hand[0] - 4, hand[1] + 3], [hand[0] - 6, hand[1] - 13], [hand[0] - 3, hand[1] - 18], [hand[0], hand[1] - 18], [hand[0] + 1, hand[1] - 9], [hand[0] + 7, hand[1] - 5], [hand[0] + 6, hand[1] + 4]], C.orange);
    line(hand[0] - 2, hand[1] - 14, hand[0] - 1, hand[1] - 4, C.orangeLight, 2);
  }
}

function crowd(ctx, time) {
  const { rect, poly, line } = pen(ctx);
  rect(0, 0, 480, 240, C.deep);
  const drift = Math.floor(ramp(time, 0, 4100) * 5);
  for (let row = 0; row < 5; row++) {
    const y = 12 + row * 36, size = 20 + row * 6, spacing = 24 + row * 12;
    rect(0, y + 19, 480, 7, row % 2 ? C.steel : C.slate);
    rect(0, y + 19, 480, 2, C.concrete);
    for (let i = -1; i < 480 / spacing + 1; i++) fan(ctx, i * spacing + row % 2 * 20 - drift, y, size, i + 33 + row * 11, time, row === 4);
  }
  poly([[398, 0], [413, 0], [476, 180], [433, 182]], C.concrete);
  for (let y = 9; y < 174; y += 12) line(396 + y * .2, y, 413 + y * .35, y, C.steel, 3);
  line(407, 0, 460, 176, C.pale, 3);
  for (let y = 22; y < 174; y += 36) line(405 + y * .29, y, 405 + y * .29, y + 17, C.ink, 2);
  for (let i = 0; i < 7; i++) fan(ctx, i * 78 - 8 - drift, 195, 67, i + 61, time, true);
  rect(0, 226, 480, 14, C.slate);
  rect(0, 225, 480, 3, C.pale);
  rect(0, 230, 480, 2, C.steel);
  for (const x of [38, 159, 285, 409]) rect(x, 225, 5, 15, C.ink);
}

function helmet(ctx, x, y, skin, facing = 1) {
  const { rect, poly, line } = pen(ctx);
  const p = (a, b) => [x + a * facing, y + b];
  const shape = (points, color) => poly(points.map(([a, b]) => p(a, b)), color);
  shape([[-14, 5], [-10, 0], [3, -2], [12, 2], [17, 9], [17, 20], [10, 27], [-5, 27], [-14, 18]], C.ink);
  shape([[-12, 5], [-7, 1], [4, 0], [12, 5], [15, 12], [13, 18], [6, 21], [-7, 20], [-12, 16]], C.goldShade);
  shape([[-11, 5], [-6, 1], [3, 1], [10, 4], [12, 9], [4, 12], [-11, 12]], C.gold);
  shape([[-7, 3], [2, 2], [8, 5], [4, 7], [-8, 7]], C.goldLight);
  shape([[-2, 1], [1, 1], [6, 8], [7, 13], [4, 13], [2, 7]], C.greenDark);
  shape([[5, 13], [14, 12], [15, 17], [11, 23], [4, 22], [1, 18]], skin[2]);
  shape([[8, 14], [13, 14], [13, 18], [10, 20], [5, 19]], skin[0]);
  rect(...p(8, 14), facing * 4, 2, C.ink);
  shape([[-7, 12], [-1, 12], [2, 16], [1, 23], [-4, 24], [-8, 20]], C.gold);
  rect(...p(-5, 16), facing * 3, 4, C.ink);
  line(...p(0, 15), ...p(18, 17), C.pale, 2);
  line(...p(17, 17), ...p(14, 26), C.steel, 2);
  line(...p(0, 22), ...p(15, 24), C.pale, 2);
  line(...p(7, 17), ...p(7, 24), C.steel);
  line(...p(-3, 23), ...p(3, 27), C.white);
}

function benchPlayer(ctx, x, y, seed, time, gesture) {
  const { rect, poly, line, oval, limb } = pen(ctx);
  const skin = SKINS[seed % 3], p = (a, b) => [x + a, y + b];
  const shape = (points, color) => poly(points.map(([a, b]) => p(a, b)), color);
  const beat = Math.floor(time / 230 + seed) % 6;
  const lean = gesture === 'rest' ? [1, 1, 2, 3, 3, 2][beat] : 0;
  oval(x - 31, y + 114, 67, 10, '#4f5a42');
  shape([[-15, 64], [14, 64], [23, 77], [28, 92], [12, 98], [2, 83], [-3, 83], [-15, 99], [-29, 91], [-25, 78]], C.steel);
  shape([[-14, 64], [13, 64], [18, 77], [24, 88], [13, 92], [2, 77], [-6, 79], [-17, 94], [-26, 88], [-23, 78]], C.white);
  shape([[-12, 68], [-5, 69], [-8, 79], [-21, 92], [-24, 88]], C.pale);
  shape([[7, 70], [13, 70], [16, 79], [21, 86], [14, 86]], '#adb99c');
  line(x - 21, y + 80, x - 18, y + 89, C.goldShade, 3);
  line(x + 16, y + 79, x + 20, y + 88, C.goldShade, 3);
  limb(p(-22, 92), p(-21, 112), 11, C.pale, C.white, C.steel);
  limb(p(21, 92), p(22, 112), 11, C.pale, C.white, C.steel);
  rect(x - 27, y + 108, 12, 7, C.greenDark);
  rect(x + 17, y + 108, 11, 7, C.greenDark);
  shape([[-26, 112], [-17, 112], [-12, 117], [-12, 121], [-32, 121], [-32, 118]], C.ink);
  shape([[17, 112], [27, 112], [33, 117], [33, 121], [16, 121]], C.ink);
  line(x - 29, y + 117, x - 15, y + 117, C.steel);
  line(x + 19, y + 117, x + 29, y + 117, C.steel);
  shape([[-23, 31], [-15, 25], [12, 24], [23, 29], [29, 40], [23, 51], [16, 66], [-16, 68], [-23, 51], [-29, 42]], C.ink);
  shape([[-23, 33], [-13, 27], [12, 26], [21, 31], [25, 40], [20, 49], [14, 64], [-13, 65], [-21, 49], [-25, 40]], C.green);
  shape([[-21, 32], [-11, 29], [-3, 31], [-4, 41], [-23, 42]], C.greenLight);
  shape([[4, 29], [13, 29], [22, 34], [24, 40], [10, 38]], '#5b8150');
  shape([[-20, 43], [-11, 44], [-8, 60], [10, 63], [-13, 65]], C.greenDark);
  shape([[13, 41], [21, 41], [15, 64], [7, 63]], C.greenDark);
  line(x - 20, y + 42, x - 13, y + 42, C.gold, 3);
  line(x + 15, y + 40, x + 23, y + 41, C.gold, 3);
  line(x - 7, y + 49, x + 6, y + 48, C.greenLight, 2);
  line(x - 5, y + 58, x + 9, y + 57, C.greenDark, 2);
  shape([[-7, 24], [-4, 20], [5, 20], [10, 26], [4, 33], [-3, 32]], skin[2]);
  helmet(ctx, x + (gesture === 'rest' ? 5 : 0), y + lean, skin, seed % 2 ? -1 : 1);
  let leftElbow = p(-28, 60), rightElbow = p(27, 59), leftHand = p(-17, 80), rightHand = p(17, 80);
  if (gesture === 'drink') { rightElbow = p(34, 44); rightHand = p(25, 13 + (beat > 3 ? 2 : 0)); }
  if (gesture === 'rest') { leftElbow = p(-23, 71); leftHand = p(-7, 80); rightElbow = p(24, 69); rightHand = p(7, 80); }
  if (gesture === 'towel') { rightElbow = p(29, 42); rightHand = p(9 + [0, 3, 5, 3, 0, 0][beat], 18); leftHand = p(-10, 64); }
  if (gesture === 'clap') { leftElbow = p(-25, 65); rightElbow = p(26, 64); leftHand = p(-3 - (beat % 3) * 3, 53); rightHand = p(3 + (beat % 3) * 3, 53); }
  if (gesture === 'adjust') { leftElbow = p(-31, 38); leftHand = p(-12, 17 + (beat > 3 ? 1 : 0)); }
  for (const [shoulder, elbow, hand] of [[p(-22, 43), leftElbow, leftHand], [p(22, 43), rightElbow, rightHand]]) {
    limb(shoulder, elbow, 12, skin[0], skin[1], skin[2]);
    limb(elbow, hand, 10, skin[0], skin[1], skin[2]);
    oval(hand[0] - 5, hand[1] - 4, 10, 10, skin[0]);
    line(hand[0] - 2, hand[1] - 1, hand[0] + 3, hand[1] - 1, skin[1], 2);
    line(hand[0] - 1, hand[1] + 3, hand[0] + 3, hand[1] + 3, skin[2]);
    rect(elbow[0] - 5, elbow[1] - 3, 10, 3, C.pale);
  }
  if (gesture === 'drink') {
    poly([[rightHand[0] - 2, rightHand[1] - 12], [rightHand[0] + 4, rightHand[1] - 14], [rightHand[0] + 8, rightHand[1] + 1], [rightHand[0], rightHand[1] + 3]], '#426b61');
    line(rightHand[0] + 1, rightHand[1] - 11, rightHand[0] + 4, rightHand[1] - 2, '#7cac8a', 2);
    rect(rightHand[0] - 3, rightHand[1] - 14, 6, 3, C.orange);
  }
  if (gesture === 'towel') {
    shape([[-8, 7], [9, 6], [13, 13], [7, 26], [10, 41], [2, 42], [-2, 23], [-11, 20]], C.pale);
    shape([[-5, 8], [6, 8], [6, 17], [2, 20], [5, 38], [3, 38], [-2, 20], [-8, 18]], C.white);
    line(x + 1, y + 23, x + 5, y + 34, C.concrete);
  }
}

function bench(ctx, time) {
  const { rect, poly, line, oval } = pen(ctx);
  distantStands(ctx, 0, 47, 5);
  turf(ctx, 47);
  poly([[0, 98], [480, 87], [480, 106], [0, 117]], C.white);
  poly([[0, 110], [480, 99], [480, 219], [0, 236]], '#949781');
  for (let y = 113; y < 230; y += 3) for (let x = (y % 4) * 2; x < 480; x += 7) if (hash(x, y) % 5 === 0) rect(x, y, 2, 1, '#b0af90');
  for (const x of [62, 257, 442]) {
    rect(x, 108, 7, 77, C.ink);
    rect(x + 2, 108, 3, 77, C.steel);
  }
  rect(10, 112, 460, 14, C.goldShade);
  rect(10, 112, 460, 3, '#d1c496');
  rect(10, 118, 460, 2, '#ac9967');
  rect(5, 142, 470, 10, '#c5b786');
  rect(5, 145, 470, 2, C.white);
  rect(5, 152, 470, 5, '#605b43');
  const gestures = ['drink', 'rest', 'towel', 'clap', 'adjust'];
  for (let i = 0; i < 5; i++) benchPlayer(ctx, 42 + i * 98, 61 + (i % 2 ? 3 : 0), i + 1, time, gestures[i]);
  poly([[0, 220], [480, 205], [480, 223], [0, 239]], C.white);
  line(0, 237, 480, 221, C.pale, 2);
  oval(174, 196, 50, 9, '#65745b');
  poly([[178, 173], [214, 173], [218, 201], [178, 201]], C.orange);
  rect(177, 170, 40, 6, C.white);
  rect(183, 179, 5, 17, C.orangeLight);
  rect(190, 179, 18, 4, '#993b28');
  rect(192, 181, 13, 2, C.white);
  line(179, 177, 174, 182, C.ink, 2);
  line(174, 182, 178, 193, C.ink, 2);
  rect(318, 189, 7, 18, '#2e6756');
  rect(319, 187, 5, 3, C.orange);
  rect(319, 192, 2, 10, '#84a891');
}

function referee(ctx, time) {
  const { rect, poly, line, oval, limb } = pen(ctx);
  rect(0, 0, 480, 240, C.skyLight);
  distantStands(ctx, 19, 91, 16);
  rect(0, 0, 480, 15, C.slate);
  rect(0, 16, 480, 3, C.white);
  turf(ctx, 91);
  poly([[0, 198], [180, 110], [190, 110], [20, 240], [0, 240]], C.white);
  poly([[0, 133], [480, 149], [480, 151], [0, 136]], C.pale);
  line(75, 91, 75, 48, C.gold, 3);
  line(50, 48, 101, 48, C.goldLight, 3);
  line(50, 48, 50, 18, C.goldLight, 3);
  line(101, 48, 101, 18, C.goldLight, 3);
  for (let i = 0; i < 6; i++) smallPlayer(ctx, 377 + (i % 3) * 28, 105 + Math.floor(i / 3) * 14, i % 2, 0, 1);
  const rise = ramp(time, 800, 1700), lower = ramp(time, 3500, 4100), lift = Math.round((rise - lower * .35) * 67);
  oval(203, 227, 142, 19, C.grassShade);
  poly([[240, 76], [283, 76], [310, 94], [321, 136], [300, 166], [303, 210], [216, 212], [218, 160], [198, 126], [208, 95]], C.ink);
  poly([[238, 83], [283, 82], [305, 98], [314, 131], [293, 162], [299, 204], [221, 206], [223, 151], [204, 125], [213, 99]], C.pale);
  poly([[241, 84], [250, 88], [248, 206], [238, 206]], C.ink);
  poly([[264, 88], [273, 84], [279, 205], [267, 205]], C.ink);
  poly([[286, 89], [294, 96], [299, 135], [290, 154], [286, 205], [280, 205]], C.slate);
  poly([[222, 93], [230, 87], [228, 146], [235, 205], [224, 205], [218, 134]], C.slate);
  poly([[250, 103], [265, 102], [268, 181], [262, 195], [252, 197]], C.white);
  line(235, 179, 248, 184, C.steel, 2);
  line(268, 176, 284, 174, C.steel, 2);
  poly([[218, 204], [300, 204], [314, 240], [204, 240]], C.ink);
  rect(220, 207, 78, 6, '#494b3d');
  rect(253, 207, 13, 7, C.pale);
  rect(256, 209, 7, 3, C.ink);
  limb([302, 128], [315, 163], 24, C.skin, C.skinLight, C.skinShade);
  limb([315, 163], [302, 202], 20, C.skin, C.skinLight, C.skinShade);
  oval(292, 194, 21, 28, C.skinShade);
  oval(293, 194, 16, 23, C.skin);
  line(298, 204, 298, 216, C.skinLight, 2);
  line(303, 205, 302, 217, C.skinShade);
  const elbow = [201, 156 - Math.round(lift * .35)], hand = [228 + Math.round(lift * .24), 144 - lift];
  limb([211, 126], elbow, 24, C.skin, C.skinLight, C.skinShade);
  limb(elbow, hand, 18, C.skin, C.skinLight, C.skinShade);
  oval(hand[0] - 8, hand[1] - 9, 19, 20, C.skinShade);
  oval(hand[0] - 8, hand[1] - 9, 15, 16, C.skin);
  line(hand[0] - 5, hand[1] - 5, hand[0] + 4, hand[1] - 5, C.skinLight, 3);
  line(hand[0] - 3, hand[1] + 1, hand[0] + 6, hand[1] + 1, C.skinShade);
  poly([[214, 112], [228, 123], [220, 137], [201, 126], [200, 120]], C.pale);
  line(207, 114, 222, 126, C.ink, 4);
  line(203, 121, 217, 132, C.ink, 4);
  poly([[291, 113], [308, 109], [317, 132], [304, 140], [294, 130]], C.pale);
  line(295, 115, 302, 135, C.ink, 4);
  line(304, 113, 311, 133, C.ink, 4);
  poly([[244, 79], [243, 65], [269, 61], [280, 82], [268, 99], [252, 98]], C.skinShade);
  poly([[246, 75], [246, 60], [266, 61], [274, 81], [265, 94], [251, 91]], C.skin);
  poly([[238, 42], [246, 33], [269, 34], [281, 45], [281, 63], [275, 77], [261, 82], [245, 73], [244, 61], [234, 57]], C.skinShade);
  poly([[242, 43], [248, 37], [267, 38], [275, 47], [274, 61], [267, 75], [253, 73], [247, 62], [239, 56]], C.skin);
  poly([[242, 46], [250, 41], [262, 41], [263, 49], [248, 56], [239, 54]], C.skinLight);
  rect(242, 49, 8, 3, C.ink);
  rect(242, 52, 5, 2, C.white);
  poly([[240, 53], [234, 61], [240, 64], [247, 61]], C.skinLight);
  line(241, 69, 250, 68, C.brown, 2);
  oval(268, 51, 10, 15, C.skinLight);
  oval(269, 54, 5, 9, C.skinShade);
  poly([[235, 40], [238, 29], [248, 24], [269, 25], [280, 33], [281, 43], [262, 48], [242, 46]], C.ink);
  poly([[239, 35], [245, 27], [267, 27], [275, 34], [275, 39], [243, 41]], C.white);
  poly([[238, 38], [262, 40], [263, 46], [232, 48], [221, 46], [222, 42]], C.ink);
  line(239, 35, 247, 29, C.pale, 2);
  line(250, 93, 257, 133, C.ink);
  line(267, 93, 257, 133, C.ink);
  line(257, 133, hand[0] + 1, hand[1] - 6, C.ink);
  rect(hand[0] - 7, hand[1] - 9, 11, 6, C.steel);
  rect(hand[0] - 7, hand[1] - 9, 8, 2, C.white);
  rect(hand[0] - 10, hand[1] - 8, 5, 3, C.pale);
  if (time > 1750 && time < 3310 && Math.floor(time / 260) % 3 !== 0) {
    line(225, 62, 216, 58, C.white, 2);
    line(223, 70, 211, 70, C.white, 2);
    line(225, 78, 217, 82, C.white, 2);
  }
}

function lineman(ctx, x, y, scale, surge = 0, stance = 'center') {
  const { rect, poly, line, oval, limb } = pen(ctx);
  const lean = stance === 'brace' ? -8 : stance === 'wide' ? 7 : 0;
  const p = (a, b) => [x + (a + lean * Math.max(0, 1 - b / 120) + (stance === 'wide' && a > 20 && b > 75 ? 7 : 0)) * scale, y + b * scale];
  const shape = (points, color) => poly(points.map(([a, b]) => p(a, b)), color);
  oval(x - 50 * scale, y + 112 * scale, 104 * scale, 13 * scale, C.grassShade);
  shape([[-38, 79], [-24, 80], [-23, 102], [-28, 118], [-43, 118], [-43, 109]], C.steel);
  shape([[26, 79], [41, 79], [47, 109], [43, 119], [28, 119], [25, 102]], C.steel);
  shape([[-37, 81], [-28, 82], [-28, 102], [-33, 116], [-40, 116]], C.white);
  shape([[29, 82], [38, 82], [43, 109], [40, 116], [31, 115]], C.white);
  shape([[-44, 113], [-28, 113], [-26, 122], [-49, 124], [-51, 120]], C.ink);
  shape([[29, 113], [44, 113], [53, 120], [49, 124], [28, 122]], C.ink);
  line(...p(-46, 119), ...p(-30, 119), C.steel, Math.max(1, scale));
  line(...p(31, 119), ...p(47, 119), C.steel, Math.max(1, scale));
  shape([[-33, 48], [32, 48], [42, 62], [46, 85], [30, 94], [12, 75], [-9, 73], [-27, 94], [-47, 85], [-43, 63]], C.ink);
  shape([[-30, 48], [29, 48], [39, 62], [41, 82], [30, 88], [11, 69], [-8, 68], [-29, 89], [-41, 82], [-39, 64]], C.pale);
  shape([[-30, 51], [-6, 52], [-9, 66], [-29, 85], [-37, 80], [-35, 63]], C.white);
  shape([[2, 53], [28, 51], [35, 65], [37, 78], [31, 82], [12, 65]], '#e2dfb9');
  shape([[-8, 57], [5, 55], [21, 67], [13, 70], [-6, 67]], '#8f9c7f');
  line(...p(-36, 63), ...p(-32, 80), C.goldShade, Math.max(2, scale * 3));
  line(...p(32, 63), ...p(37, 79), C.goldShade, Math.max(2, scale * 3));
  shape([[-38, 28 - surge], [-26, 19 - surge], [-13, 17 - surge], [18, 17 - surge], [30, 22 - surge], [39, 32 - surge], [35, 53], [25, 63], [-23, 63], [-37, 51]], C.ink);
  shape([[-34, 29 - surge], [-24, 23 - surge], [-10, 20 - surge], [16, 20 - surge], [28, 25 - surge], [34, 32 - surge], [30, 51], [23, 59], [-22, 59], [-32, 50]], C.green);
  shape([[-30, 29 - surge], [-22, 25 - surge], [-9, 24 - surge], [-10, 37], [-31, 41]], C.greenLight);
  shape([[4, 24 - surge], [20, 24 - surge], [29, 29 - surge], [31, 38], [9, 36]], C.greenLight);
  shape([[-30, 43], [-18, 43], [-12, 54], [22, 56], [23, 59], [-22, 59]], C.greenDark);
  line(...p(-25, 36), ...p(-11, 35), C.gold, Math.max(2, scale * 3));
  line(...p(12, 35), ...p(29, 36), C.gold, Math.max(2, scale * 3));
  line(...p(-5, 32), ...p(-4, 49), C.greenDark, Math.max(1, scale));
  line(...p(6, 42), ...p(17, 45), '#658450', Math.max(1, scale));
  shape([[-15, 3 - surge], [-9, -3 - surge], [8, -4 - surge], [16, 2 - surge], [20, 14 - surge], [15, 26 - surge], [-12, 27 - surge], [-20, 16 - surge]], C.ink);
  shape([[-14, 4 - surge], [-8, -1 - surge], [8, -2 - surge], [14, 4 - surge], [16, 15 - surge], [12, 23 - surge], [-10, 24 - surge], [-17, 15 - surge]], C.goldShade);
  shape([[-12, 4 - surge], [-6, 1 - surge], [7, 0 - surge], [12, 5 - surge], [14, 13 - surge], [9, 17 - surge], [-12, 16 - surge]], C.gold);
  shape([[-9, 4 - surge], [-4, 2 - surge], [5, 2 - surge], [10, 6 - surge], [9, 9 - surge], [-10, 10 - surge]], C.goldLight);
  shape([[-2, 0 - surge], [2, 0 - surge], [4, 24 - surge], [0, 24 - surge]], C.greenDark);
  rect(...p(-9, 20 - surge), 6 * scale, 3 * scale, C.pale);
  rect(...p(7, 20 - surge), 5 * scale, 3 * scale, C.pale);
  if (stance === 'center') {
    shape([[-29, 46], [-20, 47], [-16, 69], [-4, 83], [-10, 91], [-25, 76]], C.skinShade);
    shape([[-27, 48], [-22, 48], [-20, 68], [-7, 83], [-11, 86], [-23, 73]], C.skin);
    shape([[21, 45], [29, 46], [24, 72], [11, 91], [3, 86], [16, 69]], C.skinShade);
    shape([[22, 48], [27, 48], [22, 70], [9, 85], [6, 85], [19, 68]], C.skinLight);
    if (surge < 6) {
      oval(x - 11 * scale, y + 83 * scale, 11 * scale, 9 * scale, C.skin);
      oval(x + 2 * scale, y + 83 * scale, 11 * scale, 9 * scale, C.skin);
    }
  } else {
    const arms = stance === 'brace'
      ? [[[-29, 45], [-40, 59], [-31, 80]], [[26, 46], [39, 58], [44, 92]]]
      : [[[-28, 45], [-20, 65], [-9, 78]], [[27, 44], [42, 49], [45, 76]]];
    for (const [shoulder, elbow, hand] of arms) {
      limb(p(...shoulder), p(...elbow), 11 * scale, C.skin, C.skinLight, C.skinShade);
      limb(p(...elbow), p(...hand), 9 * scale, C.skin, C.skinLight, C.skinShade);
      const [hx, hy] = p(...hand);
      oval(hx - 5 * scale, hy - 3 * scale, 10 * scale, 9 * scale, C.skin);
      line(hx - 2 * scale, hy, hx + 3 * scale, hy, C.skinLight, Math.max(1, scale * 2));
    }
  }
}

function football(ctx, x, y, width, height, turn) {
  const { poly, line } = pen(ctx);
  const angle = turn * Math.PI / 2;
  const p = (a, b) => [x + Math.cos(angle) * a * width + Math.sin(angle) * b * height, y - Math.sin(angle) * a * width + Math.cos(angle) * b * height];
  const shape = (points, color) => poly(points.map(([a, b]) => p(a, b)), color);
  shape([[-.54, 0], [-.38, -.31], [-.17, -.49], [.16, -.48], [.4, -.27], [.55, 0], [.35, .33], [.13, .48], [-.2, .45], [-.4, .24]], C.ink);
  shape([[-.49, 0], [-.34, -.28], [-.15, -.43], [.15, -.42], [.36, -.25], [.49, 0], [.33, .27], [.12, .41], [-.18, .39], [-.36, .21]], C.ball);
  shape([[-.43, -.04], [-.3, -.28], [-.1, -.37], [.13, -.34], [.34, -.17], [.22, -.08], [-.24, .02]], '#b77748');
  shape([[-.35, .17], [-.11, .22], [.15, .19], [.37, .04], [.29, .26], [.1, .36], [-.16, .34]], C.brown);
  line(...p(-.32, -.25), ...p(-.33, .23), C.pale, Math.max(1, Math.floor(width / 24)));
  line(...p(.31, -.25), ...p(.32, .24), C.pale, Math.max(1, Math.floor(width / 24)));
  line(...p(-.18, -.14), ...p(.18, -.14), C.ink, Math.max(2, Math.floor(width / 20)));
  line(...p(-.17, -.17), ...p(.17, -.17), C.white, Math.max(1, Math.floor(width / 35)));
  for (let i = 0; i < 5; i++) line(...p(-.14 + i * .07, -.23), ...p(-.14 + i * .07, -.07), C.white, Math.max(1, Math.floor(width / 42)));
}

function quarterbackHand(ctx, side, close) {
  const { poly, line } = pen(ctx);
  const shift = Math.round(close * 42), p = (x, y) => [side < 0 ? x + shift : 480 - x - shift, y + Math.round(close * 12)];
  const shape = (points, color) => poly(points.map(([x, y]) => p(x, y)), color);
  shape([[39, 240], [63, 212], [109, 190], [133, 173], [145, 174], [159, 188], [166, 209], [148, 231], [136, 240]], C.skinShade);
  shape([[48, 240], [71, 216], [114, 196], [135, 177], [142, 178], [155, 191], [160, 207], [144, 228], [129, 240]], C.skin);
  shape([[65, 238], [82, 219], [123, 199], [139, 180], [145, 185], [140, 211], [119, 234]], C.skinLight);
  shape([[69, 217], [83, 211], [104, 239], [85, 240]], C.pale);
  shape([[74, 215], [81, 212], [99, 240], [91, 240]], C.white);
  if (close > .7) {
    shape([[125, 190], [145, 180], [162, 180], [177, 187], [181, 194], [175, 200], [163, 191], [147, 196], [142, 212]], C.skinShade);
    shape([[129, 190], [148, 183], [162, 183], [175, 189], [177, 193], [174, 195], [162, 188], [144, 196]], C.skinLight);
    shape([[147, 196], [164, 189], [179, 195], [184, 202], [179, 208], [168, 201], [155, 211]], C.skin);
    line(...p(162, 195), ...p(175, 200), C.skinLight, 3);
    line(...p(130, 209), ...p(145, 219), C.skinShade, 2);
    return;
  }
  shape([[125, 189], [132, 173], [146, 151], [155, 151], [159, 156], [157, 163], [145, 185], [144, 205]], C.skinShade);
  shape([[129, 188], [138, 169], [149, 153], [154, 153], [155, 159], [145, 181], [140, 200]], C.skinLight);
  shape([[145, 181], [160, 167], [172, 158], [179, 159], [181, 164], [177, 170], [160, 188], [154, 202]], C.skinShade);
  shape([[147, 184], [164, 167], [173, 161], [177, 161], [177, 165], [158, 186], [154, 197]], C.skin);
  shape([[155, 192], [174, 179], [185, 175], [191, 178], [190, 184], [178, 193], [165, 209]], C.skinShade);
  shape([[159, 193], [176, 182], [186, 178], [188, 180], [178, 189], [166, 204]], C.skin);
  shape([[146, 214], [166, 202], [184, 197], [192, 200], [191, 207], [177, 212], [159, 226]], C.skinShade);
  shape([[150, 213], [171, 203], [184, 200], [189, 201], [188, 205], [173, 209], [157, 220]], C.skinLight);
  line(...p(123, 207), ...p(137, 207), C.skinShade, 2);
  line(...p(132, 211), ...p(144, 221), C.skinShade, 2);
  line(...p(148, 157), ...p(153, 158), '#edc397', 2);
  line(...p(170, 164), ...p(175, 165), '#dfb38a', 2);
}

function snap(ctx, time) {
  const { rect, poly, line } = pen(ctx);
  const launch = ramp(time, 3000, 3770), close = ramp(time, 3540, 4060);
  const surge = Math.floor(ramp(time, 3030, 3820) * 14);
  rect(0, 0, 480, 240, C.skyLight);
  rect(0, 0, 480, 23, C.sky);
  distantStands(ctx, 24, 81, 29);
  turf(ctx, 81);
  poly([[224, 81], [227, 81], [77, 240], [65, 240]], C.pale);
  poly([[253, 81], [256, 81], [410, 240], [398, 240]], C.pale);
  for (let i = 0; i < 6; i++) {
    const y = 95 + i * i * 4;
    line(0, y, 480, y, i % 2 ? C.white : C.pale, y > 150 ? 2 : 1);
  }
  for (let y = 108; y < 235; y += 16) for (const x of [172 - (y - 90) * .18, 308 + (y - 90) * .18]) rect(x, y, 6, 2, C.pale);
  line(240, 75, 240, 49, C.gold, 2);
  line(223, 49, 258, 49, C.goldLight, 2);
  line(223, 49, 223, 29, C.goldLight, 2);
  line(258, 49, 258, 29, C.goldLight, 2);
  for (const [x, y] of [[70, 104], [145, 108], [335, 108], [411, 104]]) smallPlayer(ctx, x, y, true, 1, 2);
  lineman(ctx, 101 - surge, 84, .78, surge * .7, 'brace');
  lineman(ctx, 377 + surge, 83, .8, surge * .7, 'wide');
  lineman(ctx, 240, 65 - Math.floor(surge * .25), 1.09, surge);
  if (launch < .9) football(ctx, 240, 161 + launch * 45, 13 + launch * 58, 21 + launch * 20, 1 - Math.floor(launch * 4) / 4);
  quarterbackHand(ctx, -1, close);
  quarterbackHand(ctx, 1, close);
  if (launch >= .9) {
    football(ctx, 240, 222, 76, 43, 0);
    poly([[192, 228], [203, 210], [212, 207], [214, 212], [208, 226], [217, 235], [207, 240], [198, 237]], C.skin);
    poly([[288, 228], [277, 210], [268, 207], [266, 212], [272, 226], [263, 235], [273, 240], [282, 237]], C.skin);
    line(201, 226, 208, 213, C.skinLight, 3);
    line(279, 226, 272, 213, C.skinLight, 3);
  }
}

function wipe(ctx, time) {
  const { rect } = pen(ctx);
  const opening = time >= 700;
  if (opening) stadium(ctx, 0); else snap(ctx, 5399);
  const progress = opening ? (time - 700) / 700 : time / 700;
  for (let row = 0; row < 10; row++) for (let col = 0; col < 20; col++) {
    const delay = (col + row) / 29 * .62, amount = clamp((progress - delay) / .34);
    if ((opening ? 1 - amount : amount) <= 0) continue;
    const size = Math.ceil((opening ? 1 - amount : amount) * 24);
    const x = col * 24, y = row * 24;
    rect(x, y, size, size, C.ink);
    if (size < 24 && size > 3) {
      rect(x + size - 3, y, 3, size, C.goldShade);
      rect(x + size - 1, y, 1, size, C.gold);
    }
  }
}

export function drawIntroFrame(ctx, scene, elapsed) {
  ctx.imageSmoothingEnabled = false;
  ({ stadium, crowd, bench, referee, snap, wipe })[scene](ctx, elapsed);
  const { rect } = pen(ctx);
  for (let y = 1; y < 240; y += 3) rect(0, y, 480, 1, '#09181812');
  rect(0, 0, 480, 1, '#16231a70');
  rect(0, 239, 480, 1, '#16231a70');
}
