// Shared by rebirthday-*.mjs recipes: writes a copy of the game with a debug hook
// (window.X = code => eval(code) inside the game's closure) and exports its file URL.
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const src = readFileSync('D:/Minigame/人生重开模拟器/index.html', 'utf8');
const i = src.lastIndexOf('})();');
const out = src.slice(0, i) + 'window.X = code => eval(code);\n' + src.slice(i);
const file = resolve(tmpdir(), 'rebirthday-hooked.html');
writeFileSync(file, out);
export const URL_ = pathToFileURL(file).href;
// Seeded Math.random so the same recipe gives the same lives.
export const seed = n => `(()=>{let s=${n}>>>0;Math.random=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};})();`;
// In-page helpers: start a life with given talents/stats, advance years until a predicate holds
// (choices are made at random, except when the predicate wants to stop on one), and clear effects.
export const HELP = `X(\`
window.RB = {};
RB.life = (tids, a) => { pickTal = tids.slice(); alloc = Object.assign({}, a); startLife(); };
RB.adv = (pred, max) => { max = max || 400; for (let i = 0; i < max; i++) { if (pred()) return true; if (!L || L.end) return false; if (L.pend) choose(Math.random() < .5 ? 0 : 1); else nextYear(); } return pred(); };
RB.find = (tids, a, pred, tries) => { for (let k = 0; k < (tries || 80); k++) { RB.life(tids, a); if (RB.adv(pred)) return k; } return -1; };
RB.calm = () => { banner = null; P = []; POPS = []; emote = null; };
RB.info = () => ({ age: L.age, sc: curScene, path: L.path, job: L.job, pend: L.pend, log: (L.log[L.log.length-1]||{}) });
'ok'\`)`;
