import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Realm scene: huashen
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 46, quality: 4, monster: '九尾天狐', beast: 'phoenix', beastLevel: 46 }) }, { wait: 3000 },
  { shot: OUT + 'shots/06-realm-huashen.png', clip: { x: 10, y: 58, width: 840, height: 572 } },
]};
