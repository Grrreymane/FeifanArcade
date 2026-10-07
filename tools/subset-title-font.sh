#!/bin/sh
# Re-subset Fusion Pixel 12px to the glyphs used in game titles. Run after adding or renaming a game.
# Needs: pip install fonttools brotli
cd "$(dirname "$0")/.." || exit 1
CHARS=$(node -e "
const fs=require('fs');let s='非凡街机厅FEIFAN ARCADE';
for(const d of fs.readdirSync('assets')){try{const j=JSON.parse(fs.readFileSync('assets/'+d+'/data.json'));s+=j.title.zh+j.title.en+j.title.en.toUpperCase()}catch{}}
for(let c=32;c<127;c++)s+=String.fromCharCode(c);console.log([...new Set(s+'·')].join(''))")
python -m fontTools.subset ../../_workflow/fonts/fusion-pixel/fusion-pixel-12px-proportional-zh_hans.ttf \
  --text="$CHARS" --flavor=woff2 --output-file=fonts/fusion-pixel-title.woff2 && ls -la fonts/fusion-pixel-title.woff2
