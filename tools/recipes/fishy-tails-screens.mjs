// Title, boss fight, catch card, dex, café in service, recipe book.
// Run: node --experimental-websocket tools/shoot.mjs tools/recipes/fishy-tails-screens.mjs
import { url, ev, SEED, fight, OUT } from './_fishy-tails-lib.mjs';
const S = OUT + 'shots/';
const boss = (zi, file) => [
  ev(fight(zi, ZONES_FISH[zi]) + '; F = null; run.zoneCaught = 4; startBoss(); state'), { wait: 1700 },
  ev('hold = true'), { wait: 900 }, ev('B.state = "calm"; B.timer = 4; B.stun = 0; flash = 0; shake = 0; tension = 50'), { wait: 400 }, { shot: S + file },
  ev('hold = false; B = null; go("title")'), { wait: 200 }];
const ZONES_FISH = ['clown', 'eel', 'cod', 'octo', 'ruby', 'angler', 'grouper', 'moonfish', 'koi'];
export default { url, width: 360, height: 640, dpr: 2, loadWait: 2500, steps: [
  { shot: S + '01-title.png' },
  ev(SEED),
  ...boss(8, '06-boss-dragon.png'),
  // catch card: a shiny koi with a gold crown
  ev(fight(8, 'arowana') + '; catchFish(); state'), { wait: 1500 },
  ev('if (show) { if (!show.crown) show.val *= 2; show.crown = "gold"; show.record = true; } state'), { wait: 300 }, { shot: S + '07-catch.png' },
  ev('show = null; go("title")'),
  ev('openDex("title"); dexPage = 4; state'), { wait: 600 }, { shot: S + '08-dex.png' },
  ev('go("title"); openCafe("title"); cafe.sheet = null; cafe.svc = true; cafe.spawnT = 0; cafe.earned = 0; state'), { wait: 3000 }, { shot: S + '09-cafe.png' },
  ev('cafe.sheet = 1; cafe.page = 3'), { wait: 600 }, { shot: S + '10-recipes.png' },
]};
