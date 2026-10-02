import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Realm scene: lianqi
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 6, quality: 4, monster: '毒蟾蜍', beast: 'fire_cat', beastLevel: 6, extra: '{questIndex:8}' }) }, { wait: 3000 },
  { shot: OUT + 'shots/02-realm-lianqi.png', clip: { x: 10, y: 58, width: 840, height: 572 } },
]};
