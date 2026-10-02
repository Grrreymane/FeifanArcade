import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Early game (炼气期, Lv.4): full desktop UI with the guided quest card, natural fights so the log fills in.
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before('0'), steps: [
  { wait: 1200 }, { eval: setup({ level: 4, quality: 1, monsterHp: 0, extra: '{questIndex:4, battleSpeed:2}' }) }, { wait: 9000 },
  { shot: OUT + 'shots/01-early-game.png' },
]};
