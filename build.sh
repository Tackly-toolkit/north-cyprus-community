#!/bin/sh
cd /home/claude/tfrc
{ cat part1.html; echo '<script>'; cat scenes.js part2.js part3.js; echo '</script>'; } > build.html
python3 - <<'PY'
b=open('/home/claude/tfrc/build.html',encoding='utf8').read()
head='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#46704f"><meta name="color-scheme" content="light dark"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
'''
open('/home/claude/tfrc/dist/index.html','w',encoding='utf8').write(head+b+'\n</body></html>\n')
PY
