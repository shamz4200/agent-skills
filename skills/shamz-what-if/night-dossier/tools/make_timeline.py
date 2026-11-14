"""Write studio_src/timeline.ts for this episode: the shared header and cue resolver from the template, plus this
episode's shot list (below). Run after editing the list: python3 make_timeline.py"""
s = open('studio_src/timeline.ts').read()
head = s[:s.index("type E = ")]
tail = s[s.index("// ------------------------------------------------------------------ resolve cues to frames"):]
if "import * as Cx" not in head:
    head = head.replace("import * as Hx from './heist';", "import * as Hx from './heist';\nimport * as Cx from './crypto';")
    a = head.index("  world: Hx.World,")
    head = head[:a] + "  call: Cx.Call, wallet: Cx.Wallet, chain: Cx.Chain, garage: Cx.Garage, club: Cx.Club, share: Cx.ScreenShare, watch: Cx.Watch, toys: Cx.Toys, van: Cx.Van, rules: Cx.Rules,\n" + head[a:]
body = open('shots.ts.txt').read()
open('studio_src/timeline.ts', 'w').write(head + body + '\n' + tail)
print('timeline written')
