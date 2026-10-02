// Shared helper for the fishy-tails recipes: the game lives in one IIFE, so we write a patched copy
// that exposes a debug eval inside the closure (window.__ev) and load that instead. Original untouched.
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const src = readFileSync('D:/Minigame/Fishing/index.html', 'utf8');
const i = src.lastIndexOf('})();');
const out = resolve(tmpdir(), 'fishy-tails-debug.html');
writeFileSync(out, src.slice(0, i) + 'window.__ev = s => eval(s);\n' + src.slice(i));
export const url = pathToFileURL(out).href;
export const OUT = 'D:/Minigame/FeifanGamehub/assets/fishy-tails/';
// run code inside the game closure
export const ev = code => ({ eval: `window.__ev(${JSON.stringify(code)})` });

// A late-game save: whole dex, all dishes known, stocked cooler, furnished café, money in the wallet.
export const SEED = `
FISH_ORDER.forEach((k, i) => { DEX.fish[k] = { n: 3 + i % 6, max: R(SP[k].cm * 1.35), min: R(SP[k].cm * .65), shiny: i % 3 === 0, gold: i % 2 === 0, mini: i % 4 === 1 }; });
BOSS_ORDER.forEach(k => { DEX.boss[k] = { n: 2 }; }); DEX.zone = 8; save('sea-monster-dex', DEX);
DISH_KEYS.forEach(k => { CAFE.known[k] = true; CAFE.sold[k] = 3 + (k.length % 7); });
FISH_ORDER.filter(k => !SP[k].rescue).forEach(k => { CAFE.cooler[k] = { n: 6, p: 2 }; }); BOSS_ORDER.forEach(k => { CAFE.boss[k] = 3; });
CAFE.pop = 360; CAFE.opened = true;
DECO_SLOTS.forEach(s => { CAFE.deco.owned[s] = DECO[s].items.map(i => i.id); });
Object.assign(CAFE.deco.eq, { wall: 'wave', floor: 'check', lamp: 'lantern', plant: 'palm', tank: 'big', seat: 's5', stove: 'copper' });
CAFE.tank = ['s:clown', 'b:kraken', 'f:tang', 's:lion'];
checkTrophies(false); saveCafe();
WALLET.coins = 8888; SHOP_CATS.forEach(c => { WALLET.owned[c] = SHOP[c].items.map(i => i.id); }); saveWallet();
best = 12000; save('sea-monster-best', best); 'seeded'`;

// Put the run in sea zi with a few buffs and a fish k already hooked (fight state).
export const fight = (zi, k, opts = '') => `
newRun(); setupZone(${zi}); run.zoneCaught = 2; run.fishTotal = 9; run.fights = 9; run.coins = ${180 + zi * 260};
['reel', 'zap', 'crit', 'line', 'gold'].slice(0, ${2 + zi % 4}).forEach(b => applyBuff(b, 1)); run.newT = 0;
decor = Array.from({ length: 4 }, () => newDecor(true));
bob = { x: 124, dip: 0 }; hook = { x: 124, y: 196, ty: 196 };
biter = { key: '${k}', x: 124, y: 196, face: -1, ph: 'bite', t: 0, n: 1, c: 0, shiny: false }; ${opts}
startFight(); 'fight ' + state`;
