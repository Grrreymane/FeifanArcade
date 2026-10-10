#!/bin/sh
# Re-subset Fusion Pixel 12px to the glyphs used in game titles. Run after adding or renaming a game.
# Needs: pip install fonttools brotli
# The glyph list goes through a UTF-8 file: passing Chinese on the command line breaks under Windows shells.
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp)
node -e "
const fs=require('fs');let s='非凡街机厅FEIFAN ARCADE';
for(const d of fs.readdirSync('assets')){try{const j=JSON.parse(fs.readFileSync('assets/'+d+'/data.json'));s+=j.title.zh+j.title.en+j.title.en.toUpperCase()}catch{}}
for(let c=32;c<127;c++)s+=String.fromCharCode(c);fs.writeFileSync(process.argv[1],[...new Set(s+'·')].join(''))" "$TMP"
python -m fontTools.subset ../../_workflow/fonts/fusion-pixel/fusion-pixel-12px-proportional-zh_hans.ttf \
  --text-file="$TMP" --flavor=woff2 --output-file=fonts/fusion-pixel-title.woff2 && ls -la fonts/fusion-pixel-title.woff2
rm -f "$TMP"
