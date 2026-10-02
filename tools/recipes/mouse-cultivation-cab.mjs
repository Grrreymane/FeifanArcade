import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Portrait crops of the mobile layout for the arcade cabinet screen (9:16).
const clip = { x: 0, y: 0, width: 390, height: 693 };
const realms = [
  ['lianqi', { level: 6, quality: 4, monster: '毒蟾蜍', beast: 'fire_cat', beastLevel: 6, extra: '{questIndex:8}' }],
  ['jindan', { level: 26, quality: 4, monster: '豹形雷兽', beast: 'thunder_eagle', beastLevel: 26 }],
  ['yuanying', { level: 36, quality: 4, monster: '化龙妖蛟', beast: 'jade_dragon', beastLevel: 36 }],
  ['dacheng', { level: 70, quality: 4, monster: '劫雷真龙', beast: 'shadow_serpent', beastLevel: 70 }],
];
export default { url: URL, width: 390, height: 844, dpr: 2, before: before(), steps: [
  { wait: 1200 },
  ...realms.flatMap(([name, opts]) => [{ eval: setup(opts) }, { wait: 3000 }, { shot: OUT + `cab/${name}.png`, clip }]),
]};
