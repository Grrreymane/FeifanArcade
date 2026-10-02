import { OUT } from './mouse-cultivation-lib.mjs';
// Art close-ups rendered from the game's own sprite code (see mouse-cultivation-art.html). dpr 1 = true pixel scale.
const sheets = { monsters: [1226, 1630], beasts: [1220, 1050], hero: [1760, 420], skins: [1720, 870], compare: [1520, 550] };
export default { url: 'file:///D:/Minigame/FeifanGamehub/tools/recipes/mouse-cultivation-art.html', width: 1800, height: 1800, dpr: 1, steps: [
  { wait: 500 },
  ...Object.entries(sheets).flatMap(([n, [w, h]]) => [
    { eval: `render('${n}')` }, { wait: 150 },
    { shot: OUT + `art/${n}.png`, clip: { x: 0, y: 0, width: w, height: h } },
  ]),
  { eval: 'palette()' },
]};
