import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Realm scene: zhuji
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 16, quality: 4, monster: '暴猿妖', beast: 'ice_wolf', beastLevel: 16 }) }, { wait: 3000 },
  { shot: OUT + 'shots/03-realm-zhuji.png', clip: { x: 10, y: 58, width: 840, height: 572 } },
]};
