import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Tribulation (渡劫): press the button, then freeze the rAF loop and step the renderer frame by frame
// so the three lightning strikes (frames 50 / 85 / 120) can be captured deterministically.
const clip = { x: 10, y: 58, width: 840, height: 572 };
const stepTo = n => ({ eval: `(()=>{ while(window.__f < ${n}) { Renderer.step(); window.__f++; } return window.__f; })()` });
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 39, quality: 4, beast: 'jade_dragon', beastLevel: 39, monster: '鬼影修士', extra: '{needTribulation:true, bossDefeated:{3:true}, questIndex:20}' }) }, { wait: 2500 },
  { eval: "window.requestAnimationFrame = () => 0; window.__f = 0; document.getElementById('tribBtn').click(); 'go'" }, { wait: 100 },
  stepTo(60), { shot: OUT + 'shots/09-tribulation.png', clip }, // 10 frames after the first strike: bolt still visible, white flash mostly faded
]};
