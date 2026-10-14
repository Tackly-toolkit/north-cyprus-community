#!/bin/sh
# Builds dist/index.html from the parts. Anon key is public by design (row-level security protects data).
cd "$(dirname "$0")"
mkdir -p dist
KEY="${SB_ANON_KEY:-$(cat .private/anon.txt 2>/dev/null)}"
[ -z "$KEY" ] && echo "missing SB_ANON_KEY or .private/anon.txt" && exit 1
{ cat part1.html; echo '<script>'; cat vendor/supabase.js; echo '</script><script>'; cat scenes.js part2.js part3.js; sed "s|__ANON_KEY__|$KEY|" part4.js; [ -f part5.js ] && cat part5.js; echo '</script>'; } > dist/build.html
python3 - <<'PY'
b=open('dist/build.html',encoding='utf8').read()
head='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#46704f"><meta name="color-scheme" content="light dark"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
'''
open('dist/index.html','w',encoding='utf8').write(head+b+'\n</body></html>\n')
PY
rm -f dist/build.html
echo built $(wc -c < dist/index.html) bytes
