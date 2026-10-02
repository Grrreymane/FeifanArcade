import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Realm scene: yuanying
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 36, quality: 4, monster: '化龙妖蛟', beast: 'jade_dragon', beastLevel: 36 }) }, { wait: 3000 },
  { shot: OUT + 'shots/05-realm-yuanying.png', clip: { x: 10, y: 58, width: 840, height: 572 } },
]};
