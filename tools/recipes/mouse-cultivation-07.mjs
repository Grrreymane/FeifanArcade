import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Realm scene: dacheng
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 70, quality: 4, monster: '劫雷真龙', beast: 'shadow_serpent', beastLevel: 70 }) }, { wait: 3000 },
  { shot: OUT + 'shots/07-realm-dacheng.png', clip: { x: 10, y: 58, width: 840, height: 572 } },
]};
