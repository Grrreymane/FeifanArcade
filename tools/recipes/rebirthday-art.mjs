// Rebirthday art close-ups -> assets/rebirthday/art/
// Calls the game's own procedural painters (person(), SCN scenes, pets, fox) and lays them out
// on a canvas at an integer scale (nearest-neighbour), then screenshots it at dpr 1.
import { URL_, seed, HELP } from './_rebirthday-hook.mjs';
const O = 'D:/Minigame/FeifanGamehub/assets/rebirthday/art/';
const LIB = `X(\`
RB.sheet = (cells, cols, cw, ch, k, bg, labH) => {
  const rowsN = Math.ceil(cells.length / cols), pad = 6 * k, W_ = cols * cw * k + pad * 2, H_ = rowsN * (ch * k + labH) + pad * 2;
  const c = document.createElement('canvas'); c.width = W_; c.height = H_; const x = c.getContext('2d');
  x.imageSmoothingEnabled = false; x.fillStyle = bg; x.fillRect(0, 0, W_, H_);
  cells.forEach((it, i) => {
    const cx = pad + (i % cols) * cw * k, cy = pad + Math.floor(i / cols) * (ch * k + labH);
    const w = it.img.width * k, h = it.img.height * k, ix = Math.round(cx + (cw * k - w) / 2 / k) , iy = cy + ch * k - h - (it.lift || 0) * k;
    const dx = cx + Math.floor((cw - it.img.width) / 2) * k;
    x.drawImage(it.img, dx, iy, w, h);
    if (it.halo) x.drawImage(I.halo, dx + 6 * k, iy + 1 * k, I.halo.width * k, I.halo.height * k);
    if (it.label && labH) { x.font = Math.round(labH * .6) + 'px ' + FONT; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = it.lc || '#f6e3b4'; x.fillText(it.label, cx + cw * k / 2, cy + ch * k + labH / 2); }
  });
  return c;
};
RB.show = c => { document.body.innerHTML = ''; document.body.style.cssText = 'margin:0;background:#2a1f4a;overflow:hidden'; c.style.display = 'block'; document.body.appendChild(c); return c.width + 'x' + c.height; };
RB.p = o => person(Object.assign({ mood: 'n', blink: 0, fr: 0 }, o)).img;
'lib'\`)`;

// 1) one life, baby to angel, for a man and a woman
const AGING = `X(\`(() => {
  const M = { g: 'm', hair: 'black', top: '#4a90d9', bot: '#3d5fa8' }, F_ = { g: 'f', hair: 'brown', top: '#e86fa8', bot: '#7a4a5a', skirt: 1 };
  const row = (b, st) => [
    { img: RB.p(Object.assign({}, b, { st: 'baby', fit: 'casual', top: '#f4f4f4', mood: 'h' })), label: '0岁' },
    { img: RB.p(Object.assign({}, b, { st: 'tod', fit: 'overall', style: st[0] })), label: '4岁' },
    { img: RB.p(Object.assign({}, b, { st: 'kid', fit: 'school_p', style: st[1], mood: 'h' })), label: '9岁' },
    { img: RB.p(Object.assign({}, b, { st: 'teen', fit: 'school_t', style: st[2], gl: 1 })), label: '16岁' },
    { img: RB.p(Object.assign({}, b, { st: 'adult', fit: b.g === 'm' ? 'groom' : 'bride', style: st[3], mood: 'h' })), label: '28岁' },
    { img: RB.p(Object.assign({}, b, { st: 'mid', fit: 'suit', style: st[3], bald: b.g === 'm' ? 1 : 0, gl: 1 })), label: '50岁' },
    { img: RB.p(Object.assign({}, b, { st: 'old', fit: 'elder', top: '#8a7a6a', hair: 'white', style: st[4], cane: 1, beard: b.g === 'm' ? 1 : 0, mood: 'h' })), label: '85岁' },
    { img: RB.p(Object.assign({}, b, { st: 'old', fit: 'ghost', hair: 'white', style: st[4], mood: 'z' })), label: '重开！', halo: 1, lift: 3, lc: '#ffe14a' },
  ];
  return RB.show(RB.sheet(row(M, ['short', 'short', 'side', 'side', 'short']).concat(row(F_, ['pony', 'twin', 'pony', 'long', 'bun'])), 8, 26, 38, 6, '#2a1f4a', 60));
})()\`)`;

// 2) wardrobe: jobs, weddings and hidden-route costumes
const FITS_ = [['school_t', 'm', '校服'], ['suit', 'm', '公务员'], ['doctor', 'f', '医生'], ['chef', 'm', '厨师'], ['worker', 'm', '工人'], ['rider', 'm', '外卖骑手'], ['star', 'f', '明星'], ['athlete', 'm', '运动员'], ['esports', 'm', '电竞选手'], ['lab', 'f', '科学家'],
  ['farmer', 'm', '果农'], ['teacher', 'f', '老师'], ['rich', 'm', '首富'], ['space', 'f', '航天员'], ['groom', 'm', '新郎'], ['bride', 'f', '新娘'], ['gugroom', 'm', '古代新郎'], ['gubride', 'f', '凤冠红袍'], ['guan', 'm', '宰相'], ['huang', 'm', '皇帝'],
  ['robe', 'f', '青云宗'], ['demon', 'm', '魔修'], ['yao', 'f', '妖修'], ['armor', 'm', '勇者'], ['king', 'm', '异世界国王'], ['princess', 'f', '公主'], ['cyber', 'f', '义体人'], ['survivor', 'm', '幸存者'], ['pirate', 'm', '海盗'], ['mer', 'f', '人鱼']];
const OUTFITS = `X(\`(() => {
  const F2 = ${JSON.stringify(FITS_)};
  const cells = F2.map(([fit, g_, n], i) => ({ img: RB.p({ st: fit === 'school_t' ? 'teen' : 'adult', g: g_, hair: i % 3 === 2 ? 'brown' : 'black', style: g_ === 'm' ? (fit === 'robe' || fit === 'demon' ? 'topknot' : ['short', 'side', 'curly'][i % 3]) : ['long', 'bob', 'wavy', 'pony'][i % 4], fit, top: '#4a90d9', bot: '#3d5fa8', skirt: g_ === 'f' ? 1 : 0, ears: fit === 'yao' ? 1 : 0, mood: i % 4 === 1 ? 'h' : 'n' }), label: n }));
  return RB.show(RB.sheet(cells, 10, 26, 36, 5, '#2a1f4a', 46));
})()\`)`;

// 3) twenty of the stage scenes (background + foreground layers, no actors)
const SC = ['hosp', 'home0v', 'home2', 'home3', 'kg', 'class', 'office', 'park', 'xian', 'mo', 'yao', 'gustreet', 'istown', 'darkcastle', 'neon', 'ruins', 'ship', 'port', 'space', 'stage'];
const SCENES = `X(\`(() => {
  const ids = ${JSON.stringify(SC)};
  const cells = ids.map(id => { const c = document.createElement('canvas'); c.width = 180; c.height = SH; const x = c.getContext('2d'); x.drawImage(SCN[id].bg, 0, 0); x.drawImage(SCN[id].fg, 0, 0); return { img: c, label: SCENE_NAME[id] }; });
  return RB.show(RB.sheet(cells, 4, 186, SH, 2, '#2a1f4a', 40));
})()\`)`;

// 4) the family and the animals that share a life
const FAMILY = `X(\`(() => {
  const cells = [
    { img: RB.p({ st: 'adult', g: 'm', hair: 'black', style: 'side', fit: 'jacket', top: '#3fb8b0', bot: '#4a4a5c' }), label: '爸爸' },
    { img: RB.p({ st: 'adult', g: 'f', hair: 'black', style: 'wavy', fit: 'dressc', top: '#e8534a', bot: '#e8534a', skirt: 1, mood: 'h' }), label: '妈妈' },
    { img: RB.p({ st: 'kid', g: 'f', hair: 'black', style: 'twin', fit: 'stripe', top: '#f2a93b', bot: '#3d5fa8', skirt: 1, mood: 'h' }), label: '女儿' },
    { img: RB.p({ st: 'tod', g: 'm', hair: 'brown', style: 'short', fit: 'hoodie', top: '#5fb85a', bot: '#3d5fa8' }), label: '儿子' },
    { img: RB.p({ st: 'old', g: 'f', hair: 'grey', style: 'bun', fit: 'elder', top: '#8a7a6a', skirt: 1, mood: 'h' }), label: '奶奶' },
    { img: RB.p({ st: 'adult', g: 'm', hair: 'silver', style: 'long', fit: 'robe', ears: 2, mood: 'h' }), label: '精灵伴侣' },
    { img: petImg('cat', 0, 0), label: '橘猫' }, { img: petImg('cat', 1, 1), label: '黑猫' },
    { img: petImg('dog', 0, 0), label: '小狗' }, { img: petImg('dog', 1, 1), label: '白狗' },
    { img: foxSpr().img, label: '狐狸原形' },
  ];
  return RB.show(RB.sheet(cells, 6, 36, 36, 6, '#2a1f4a', 60));
})()\`)`;

const fresh = [{ eval: 'location.reload()' }, { wait: 3000 }, { eval: HELP }, { eval: LIB }];
export default { url: URL_, width: 1700, height: 1450, dpr: 1, before: seed(3), loadWait: 3000, steps: [
  { eval: HELP }, { eval: LIB },
  { eval: AGING }, { wait: 300 }, { shot: O + 'aging.png', clip: { x: 0, y: 0, width: 1320, height: 648 } },
  ...fresh, { eval: OUTFITS }, { wait: 300 }, { shot: O + 'outfits.png', clip: { x: 0, y: 0, width: 1360, height: 738 } },
  ...fresh, { eval: SCENES }, { wait: 300 }, { shot: O + 'scenes.png', clip: { x: 0, y: 0, width: 1512, height: 1424 } },
  ...fresh, { eval: FAMILY }, { wait: 300 }, { shot: O + 'family-pets.png', clip: { x: 0, y: 0, width: 1368, height: 624 } },
] };
