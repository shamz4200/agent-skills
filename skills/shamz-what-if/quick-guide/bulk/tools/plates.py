"""Batch plates for Quick Guide Shorts with FLUX.2 [klein] 9B on Cloudflare Workers AI.
python3 gta/tools/plates.py <ep dir> [...]: reads <ep>/plates.json {"outfit": "...", "shamz": {name: prompt}, "scenes": {name: prompt}}
Shamz prompts get the identity paragraph + outfit and the sheet crops as references. Skips plates that exist."""
import json, sys, subprocess, base64, pathlib, concurrent.futures as cf
T = pathlib.Path(__file__).resolve().parent
acc = json.load(open('/home/user/story-video-engine/config/cloudflare.json'))['account_id']
LOOK = ("The young man from the reference images, matching his face exactly: handsome, calm, deep dark brown skin (the same deep "
        "skin tone as the reference, never light), strong brows, golden blonde box-braided locs with gold bead tips framing his "
        "face, eyes with WHITE sclera and crimson-red irises with small black tomoe dots, black neck tattoos (an Om symbol, an "
        "ankh, and the word $shamz in script across his throat), a detailed Medusa portrait and mandala tattoo sleeve on his "
        "right arm. NEW OUTFIT: {outfit}. Painted semi-realistic game-art illustration exactly like the reference sheet (not "
        "Pixar, not a photo), clean cinematic lighting. No text besides the tattoos, no logos, no brand marks.")
SCENE = " Painted semi-realistic game-art illustration, cinematic, rich detail, depth of field. No people, no readable text, no logos."
def run(out, prompt, refs):
    if out.exists(): return f'skip {out.name}'
    cmd = ['curl', '-s', '--max-time', '300', f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/@cf/black-forest-labs/flux-2-klein-9b',
           '-H', 'Authorization: Bearer dummy', '--form-string', f'prompt={prompt}', '-F', 'width=768', '-F', 'height=1344', '-F', 'steps=28']
    for i, r in enumerate(refs): cmd += ['-F', f'input_image_{i}=@{r}']
    try: d = json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout)
    except Exception as e: return f'FAIL {out.name} {e}'
    img = (d.get('result') or {}).get('image')
    if not img: return f'FAIL {out.name} {json.dumps(d)[:300]}'
    out.write_bytes(base64.b64decode(img)); return f'ok {out.name}'
jobs = []
for ep in sys.argv[1:]:
    ep = pathlib.Path(ep); spec = json.load(open(ep / 'plates.json')); (ep / 'plates').mkdir(exist_ok=True)
    refs = [T / 'refs' / f for f in ('face.png', 'body.png', 'tattoos.png')]
    for n, p in spec.get('shamz', {}).items():
        jobs.append((ep / 'plates' / f'{n}.png', f"Vertical cinematic medium shot, waist-up. {LOOK.format(outfit=spec['outfit'])} {p} His head in the upper-middle of the frame.", refs))
    for n, p in spec.get('scenes', {}).items():
        jobs.append((ep / 'plates' / f'{n}.png', 'Vertical cinematic shot. ' + p + SCENE, []))
with cf.ThreadPoolExecutor(3) as ex:
    for r in ex.map(lambda j: run(*j), jobs): print(r, flush=True)
