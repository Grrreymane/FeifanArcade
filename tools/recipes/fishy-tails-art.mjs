// Art close-ups: the game's own sprite functions drawn onto sheets at integer scale.
// Run: node --experimental-websocket tools/shoot.mjs tools/recipes/fishy-tails-art.mjs
import { url, ev, SEED, OUT } from './_fishy-tails-lib.mjs';
const A = OUT + 'art/';
const SW = 1200, SH = 900; // sheet (and viewport) size
// Sheet helper, defined inside the game closure: lays canvases out in a grid at native size, then shows
// the result as a fixed-position canvas scaled by the largest integer that fits SW x SH.
export const help = (SW, SH) => `
window.__trim = c => { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++) for (let i = 0; i < c.width; i++) if (d[(y * c.width + i) * 4 + 3]) { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const o = mk(x1 - x0 + 1, y1 - y0 + 1); o.getContext('2d').drawImage(c, -x0, -y0); return o; };
window.__sheet = (rowsOfCanvases, bg, gap, align) => {
  gap = gap || 4; const rowH = rowsOfCanvases.map(r => Math.max(...r.map(c => c.height)));
  const rowW = rowsOfCanvases.map(r => r.reduce((s, c) => s + c.width, 0) + gap * (r.length - 1));
  const w = Math.max(...rowW) + gap * 2, h = rowH.reduce((s, v) => s + v, 0) + gap * (rowsOfCanvases.length + 1);
  const sc = Math.floor(Math.min(${SW} / w, ${SH} / h));
  const out = document.getElementById('__sheet') || document.body.appendChild(Object.assign(document.createElement('canvas'), { id: '__sheet' }));
  out.width = ${SW}; out.height = ${SH}; Object.assign(out.style, { position: 'fixed', left: 0, top: 0, width: '${SW}px', height: '${SH}px', zIndex: 9, imageRendering: 'pixelated' });
  const x = out.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = bg; x.fillRect(0, 0, ${SW}, ${SH});
  const ox = Math.floor((${SW} - w * sc) / 2), oy = Math.floor((${SH} - h * sc) / 2);
  let y = gap;
  rowsOfCanvases.forEach((r, ri) => { let cx = gap + (align === 'left' ? 0 : Math.floor((w - gap * 2 - rowW[ri]) / 2));
    r.forEach(c => { x.drawImage(c, ox + cx * sc, oy + (y + Math.floor((rowH[ri] - c.height) / (align === 'bottom' ? 1 : 2))) * sc, c.width * sc, c.height * sc); cx += c.width + gap; });
    y += rowH[ri] + gap; });
  return sc; };
'ok'`;
const FISH = `__sheet(ZONES.map(z => z.fish.map(k => SPR[k].r)), '#f4ecd8', 6)`;
// each boss drawn by the game's own drawBoss (body + code-drawn tentacles/segments), trimmed
const BOSSES_ = `(() => {
  T = 1.3; const main = g, list = [];
  BOSS_ORDER.forEach(key => {
    B = { key, d: BOSSES[key], x: 90, y: key === 'kraken' ? 60 : key === 'squid' ? 70 : 140, state: 'calm', stun: 0, infl: 0, alpha: 1, side: 1, arm: .5, stone: 0, tide: 0, erupt: false, p: 0, timer: 9 };
    const c = mk(W, H); g = c.getContext('2d'); drawBoss(); g = main; list.push(__trim(c));
  });
  B = null;
  return __sheet([list.slice(0, 3), list.slice(3, 6), list.slice(6, 9)], '#1f2a44', 8);
})()`;
const CATS = `(() => {
  const main = g, outfits = [
    { hat: 'bucket', rod: 'bamboo', boat: 'wood', fur: 'orange' }, { hat: 'straw', rod: 'coral', boat: 'melon', fur: 'tabby' },
    { hat: 'beanie', rod: 'carbon', boat: 'duck', fur: 'cow' }, { hat: 'pirate', rod: 'thunder', boat: 'iron', fur: 'calico' },
    { hat: 'crown', rod: 'goldrod', boat: 'ghost', fur: 'black' }];
  T = 0.5; blinkT = 1;
  const anglers = outfits.map(eq => { const c = mk(60, 44); g = c.getContext('2d'); drawAngler(4, 38, 'happy', eq); g = main; return __trim(c); });
  const chefs = ['orange', 'cow', 'black'].map(f => chefImg('happy', f, 0));
  const guests = [
    { size: 's', kind: 'orange', cloth: '#3a78ff', acc: 'bow' }, { size: 's', kind: 'white', cloth: '#ff9fce', acc: null },
    { size: 'm', kind: 'calico', cloth: '#3ed6b0', acc: 'scarf' }, { size: 'm', kind: 'grey', cloth: '#ffc83a', acc: null }, { size: 'm', kind: 'black', cloth: '#b57aff', acc: 'bow' },
    ...Object.keys(BIG).map((k, i) => ({ size: 'l', kind: k, cloth: ['#2a2f45', '#4a3a5a', '#e8453c'][i % 3], acc: i === 2 ? 'flower' : 'suit' })),
  ].map(l => guestImg(l));
  const animals = Object.keys(ANIMALS).map(k => animalSpr(k, 0));
  return __sheet([anglers, [...chefs, ...guests.slice(0, 5)], [...guests.slice(5), ...animals]], '#f4ecd8', 6, 'bottom');
})()`;
const DISHES = `(() => { const k = DISH_KEYS.map(d => dishImg(d)); const r = []; for (let i = 0; i < k.length; i += 7) r.push(k.slice(i, i + 7)); return __sheet(r, '#f4ecd8', 5); })()`;
export const SEAS = `(() => {
  const main = g, list = [];
  for (let zi = 0; zi < ZONES.length; zi++) {
    run.zone = zi; buildScenery(zi); const z = ZONES[zi], c = mk(W, H); g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    g.drawImage(getBg(zi), 0, 0); drawSky(z); drawShafts(z); drawWeeds(z); drawSurface(z); drawFog(z); g = main;
    const cr = mk(W, 300); cr.getContext('2d').drawImage(c, 0, -10); list.push(cr);
  }
  return __sheet([list.slice(0, 5), list.slice(5)], '#0b1020', 4);
})()`;
export const shot = (code, file, SW = 1200, SH = 900) => [ev(code), { wait: 300 }, { shot: A + file, clip: { x: 0, y: 0, width: SW, height: SH } }];
export default { url, width: SW, height: SH, dpr: 1, loadWait: 2500, steps: [
  ev(SEED), ev('newRun(); go("title"); state'), ev(help(SW, SH)),
  ...shot(FISH, 'fish-sheet.png'),
  ...shot(BOSSES_, 'sea-monsters.png'),
  ...shot(CATS, 'cats.png'),
  ...shot(DISHES, 'dishes.png'),
]};
