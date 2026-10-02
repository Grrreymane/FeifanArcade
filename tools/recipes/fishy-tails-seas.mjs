// Fishing in several seas (mid-fight, reeling in), each with a different cat outfit.
// Run: node --experimental-websocket tools/shoot.mjs tools/recipes/fishy-tails-seas.mjs
import { url, ev, SEED, fight, OUT } from './_fishy-tails-lib.mjs';
const S = OUT + 'shots/';
const sea = (zi, k, file, eq) => [
  ev(`Object.assign(WALLET.eq, ${JSON.stringify(eq)})`),
  ev(fight(zi, k)), ev('hold = true'), { wait: 700 },
  ev('F.state = "calm"; F.timer = 4; tension = 48; flash = 0; shake = 0'), { wait: 450 },
  { shot: S + file }, ev('hold = false; F = null; go("title")'), { wait: 200 }];
export default { url, width: 360, height: 640, dpr: 2, loadWait: 2500, steps: [
  ev(SEED),
  ...sea(1, 'lion', '02-coral-reef.png', { hat: 'straw', rod: 'coral', boat: 'melon', fur: 'tabby' }),
  ...sea(2, 'narwhal', '03-ice-bay.png', { hat: 'beanie', rod: 'carbon', boat: 'duck', fur: 'cow' }),
  ...sea(4, 'lavaeel', '04-lava-vents.png', { hat: 'pirate', rod: 'thunder', boat: 'iron', fur: 'calico' }),
  ...sea(7, 'ray', '05-starlight-sea.png', { hat: 'crown', rod: 'goldrod', boat: 'ghost', fur: 'black' }),
]};
