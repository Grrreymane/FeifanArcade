import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Boss (守关妖王) at the 化神 bottleneck + 渡劫 call-to-action + casting 万剑归宗 from the skill bar + beasts tab. Full desktop UI.
// After the cast the rAF loop is frozen and stepped manually so the boss isn't caught mid hit-flash.
const stepTo = n => ({ eval: `(()=>{ while(window.__f < ${n}) { Renderer.step(); window.__f++; } return window.__f; })()` });
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 49, quality: 5, beast: 'phoenix', beastLevel: 49, allBeasts: true, monsterHp: 0, tab: 'beasts', extra: '{needTribulation:true, bossDefeated:{}, questIndex:21, baseMaxHp:4e6}' }) },
  { wait: 4000 },
  { eval: "window.requestAnimationFrame = () => 0; window.__f = 0; document.getElementById('sk-myriad_swords').click(); GameEngine.getState().currentMonster.name" },
  stepTo(6), { shot: OUT + 'shots/08-boss-and-skills.png' },
]};
