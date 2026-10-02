// Rebirthday portfolio screenshots -> assets/rebirthday/shots/
// Native canvas is 180x320; a 360x640 viewport at dpr 2 renders it at an exact 4x.
import { URL_, seed, HELP } from './_rebirthday-hook.mjs';
const O = 'D:/Minigame/FeifanGamehub/assets/rebirthday/shots/';
const calm = { eval: "X('RB.calm(); TOASTS.length = 0; lastG = 1; 1')" };
const life = (file, tids, a, pred, extra = []) => [
  { eval: "X('JSON.stringify([RB.find(" + JSON.stringify(tids) + "," + JSON.stringify(a) + ", () => " + pred + "), RB.info()])')" },
  calm, ...extra, { wait: 700 }, { shot: O + file }];
export default { url: URL_, width: 360, height: 640, dpr: 2, before: seed(11), loadWait: 3000, steps: [
  { eval: HELP },
  { eval: "X('T = 22 * 5 + 22 * .36; 1')" }, { wait: 60 }, { shot: O + '01-title.png' },
  { eval: "X('startGacha(); gacha.fate = \"xianyuan\"; gacha.ph = \"wait\"; gacha.t = 0; state')" }, { wait: 400 }, { shot: O + '02-gacha.png' },
  { eval: "X('go(\"talent\"); gacha.sel = gacha.tal.slice(1, 3); pickTal = [gacha.fate].concat(gacha.sel); alloc = { CHR: 4, INT: 5, STR: 3, MNY: 8 }; go(\"alloc\"); state')" }, { wait: 500 }, { shot: O + '03-alloc.png' },
  ...life('04-village.png', ['gou', 'xueba', 'pingfan'], { CHR: 5, INT: 8, STR: 5, MNY: 2 }, 'L.bp==="village" && L.age===8 && curScene==="home0v"'),
  ...life('05-choice.png', ['xingtan', 'tiansheng', 'pingfan'], { CHR: 9, INT: 5, STR: 4, MNY: 2 }, '!!L.pend && curScene==="class"', [{ eval: "X('emote = \"q\"; 1')" }]),
  ...life('06-wedding.png', ['taohua', 'tiansheng', 'pingfan'], { CHR: 8, INT: 5, STR: 5, MNY: 6 }, 'curScene==="wedding" && L.mar && L.marAge===L.age'),
  ...life('07-cultivation.png', ['xianyuan', 'yaoxue', 'pingfan'], { CHR: 5, INT: 8, STR: 5, MNY: 2 }, 'L.path==="xian" && curScene==="yao" && L.xl>=2 && !!L.pt'),
  ...life('08-isekai.png', ['yishijie', 'tiyu', 'pingfan'], { CHR: 5, INT: 5, STR: 8, MNY: 2 }, 'L.path==="isekai" && curScene==="istown" && !!L.pt'),
  ...life('09-cyberpunk.png', ['yiti', 'tiyu', 'pingfan'], { CHR: 5, INT: 5, STR: 8, MNY: 2 }, 'L.path==="cy" && L.age - L.routeAge > 3'),
  { eval: "X('JSON.stringify([RB.find([\"tianxuan\",\"changshou\",\"jinli\"], { CHR: 5, INT: 5, STR: 5, MNY: 5 }, () => L.end && L.age >= 85 && /S/.test(L.grade||\"\")), L.grade, L.age])')" },
  calm, { eval: "X('go(\"end\"); st = 5; P = []; 1')" }, { wait: 500 }, { shot: O + '10-summary.png' },
  { eval: "X('makeShare(); 1')" }, { wait: 300 },
  { eval: "(() => { const el = document.body.lastElementChild, img = el.querySelector('img'); [...el.children].forEach(c => c !== img && c.remove()); el.style.padding = '0'; el.style.background = '#140c2a'; img.style.cssText = 'width:360px;height:640px;image-rendering:pixelated;display:block'; return img.naturalWidth + 'x' + img.naturalHeight; })()" },
  { wait: 300 }, { shot: O + '11-share-card.png' },
  { eval: "(() => { document.body.lastElementChild.remove(); return X('shareEl = null; META.rp = 23; META.up = { pts: 3, pool: 1, reroll: 1 }; go(\"shop\"); state'); })()" }, { wait: 400 }, { shot: O + '12-reincarnation-hall.png' },
] };
