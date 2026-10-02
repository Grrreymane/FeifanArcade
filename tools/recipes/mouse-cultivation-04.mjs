import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Realm scene: jindan
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 26, quality: 4, monster: '豹形雷兽', beast: 'thunder_eagle', beastLevel: 26 }) }, { wait: 3000 },
  { shot: OUT + 'shots/04-realm-jindan.png', clip: { x: 10, y: 58, width: 840, height: 572 } },
]};
