import { OUT, URL, before, setup } from './mouse-cultivation-lib.mjs';
// Cosmetics shop (天机阁): 40 skins (20 weapons + 20 outfits), mouse wearing 龙鳞战甲 + 龙牙剑 in battle.
const owned = "['ws_bamboo','ws_flame','ws_frost','ws_thunder','ws_starfall','ws_dragon','ws_phoenix','ws_moonlight','ws_golden_lotus','ws_chaos','ws_cosmic','as_farmer','as_scholar','as_bamboo','as_fire_robe','as_night','as_dragon_scale','as_flower','as_star_robe','as_jade_emperor','as_thunder_armor','as_phoenix_robe','as_celestial','as_primordial_robe']";
export default { url: URL, width: 1280, height: 800, dpr: 2, before: before(), steps: [
  { wait: 1200 }, { eval: setup({ level: 33, quality: 4, beast: 'jade_dragon', beastLevel: 33, monster: '鬼影修士', tab: 'gacha', extra: `{ownedSkins:${owned}, equippedArmorSkin:'as_dragon_scale', equippedWeaponSkin:'ws_dragon', totalGachaPulls:60, questIndex:21}` }) },
  { wait: 2500 }, { eval: "(document.querySelector('.side')?.scrollTo?.(0,0), document.getElementById('tabBody').scrollTop = 222, document.getElementById('tabBody').scrollTop)" }, { wait: 400 }, { shot: OUT + 'shots/10-cosmetics-shop.png' },
]};
