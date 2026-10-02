import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Mobile layout (390x844): compact resource bar, battle view, 5x2 tab grid.
export default { url: URL, width: 390, height: 844, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 44, quality: 4, beast: 'phoenix', beastLevel: 44, monster: '天魔老祖', tab: 'status', extra: '{questIndex:21}' }) },
  { wait: 3000 }, { shot: OUT + 'shots/11-mobile.png' },
]};
