// Shared helpers for mouse-cultivation recipes (鼠鼠修仙 v3).
export const OUT = 'D:/Minigame/FeifanGamehub/assets/mouse-cultivation/';
export const URL = 'file:///D:/Minigame/mouse-cultivation-2/public/index.html';
// Seed a non-fresh save (killCount>0 skips the first-run help modal; lastTickTime=now avoids offline popup).
export const before = (questCollapsed = '1') => `try{
  if(!localStorage.getItem('mouse_cultivation_save_v4')){
    localStorage.setItem('mouse_cultivation_save_v4', JSON.stringify({saveVersion:3, level:1, killCount:120, lastTickTime:Date.now(), createdAt:Date.now()-864e5, nextFortuneAt:Date.now()+9e9, questIndex:3}));
  }
  localStorage.setItem('mc2_questCollapsed','${questCollapsed}');
}catch(e){}`;
// Put the game into a given state: level, gear, beasts, etc. `monster` forces the current monster's sprite name.
export function setup({ level = 1, quality = 3, beast = null, beastLevel = 20, extra = '{}', monster = null, tab = 'status', monsterHp = 1e15, allBeasts = false } = {}) {
  return `(()=>{
    const E=GameEngine, D=E._debug;
    const eq={}; for(const s of ['weapon','armor','accessory','boots']) eq[s]=D.generateEquipment(${level}, ${quality}, s);
    const patch=Object.assign({level:${level}, exp:0, gold: D.goldPerKill(${level})*400, tianjiTokens:260,
      materials:{herb:84,ore:52,essence:17}, equipment:eq, killCount:${level * 90 + 120}, battleSpeed:1,
      nextFortuneAt:Date.now()+9e9, questIndex:${Math.min(22, Math.floor(level / 3) + 3)}},
      ${beast ? `{beasts:[{id:'b1',templateId:'${beast}',level:${beastLevel}}${allBeasts ? `,...['fire_cat','ice_wolf','thunder_eagle','shadow_serpent','jade_dragon','phoenix'].filter(t=>t!=='${beast}').map((t,i)=>({id:'o'+i,templateId:t,level:${Math.max(1, beastLevel - 12)}}))` : ''}], activeBeastId:'b1'}` : '{}'}, ${extra});
    D.cheat(patch);
    const m=E.getState().currentMonster;
    ${monster ? `m.name=${JSON.stringify(monster)};` : ''}
    ${monsterHp ? `m.hp=m.maxHp=${monsterHp}; m.totalHp=m.totalMaxHp=${monsterHp}*(m.hpBars||1); m.atk=1;` : ""}
    UI.update(true); document.querySelector('[data-tab="${tab}"]')?.click();
    return E.getState().realm+' Lv'+E.getState().level+' vs '+m.name;
  })()`;
}
