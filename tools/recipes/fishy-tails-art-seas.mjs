// The nine seas' backdrops side by side (bigger sheet so they stay at 2x). Run like the others.
import { url, ev, SEED } from './_fishy-tails-lib.mjs';
import { help, SEAS, shot } from './fishy-tails-art.mjs';
const SW = 1860, SH = 1240;
export default { url, width: SW, height: SH, dpr: 1, loadWait: 2500, steps: [
  ev(SEED), ev('newRun(); go("title"); state'), ev(help(SW, SH)),
  ...shot(SEAS, 'nine-seas.png', SW, SH),
]};
