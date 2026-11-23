"""Batch plates for Quick Guide Shorts with FLUX.2 on Cloudflare Workers AI (Shamz from the original painted sheet by default).
python3 gta/tools/plates.py <ep dir> [...]: reads <ep>/plates.json {"outfit": "...", "shamz": {name: prompt}, "scenes": {name: prompt}}
Shamz prompts get the identity paragraph + outfit and the sheet crops as references. Skips plates that exist."""
import json, sys, subprocess, base64, pathlib, concurrent.futures as cf
T = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(T))
acc = json.load(open('/home/user/story-video-engine/config/cloudflare.json'))['account_id']
LOOK_PAINTED = ("The young man from the reference images, matching his face exactly: handsome, calm, deep dark brown skin (the same deep "
        "skin tone as the reference, never light), strong brows, golden blonde box-braided locs with gold bead tips framing his "
        "face, eyes with WHITE sclera and crimson-red irises with small black tomoe dots, black neck tattoos (an Om symbol, an "
        "ankh, and the word $shamz in script across his throat), a detailed Medusa portrait and mandala tattoo sleeve on his "
        "right arm. NEW OUTFIT: {outfit}. Painted semi-realistic game-art illustration exactly like the reference sheet (not "
        "Pixar, not a photo), clean cinematic lighting. No text besides the tattoos, no logos, no brand marks.")
LOOK_REAL = ("Real photograph, cinematic like a realistic modern open-world game cutscene. The man has EXACTLY the face of the man in the "
        "first reference photo (the owner): same face shape, eyes, brows, nose, lips and smile, thin moustache and chin beard, light-brown "
        "skin, same age. His hair is golden blonde box-braided shoulder-length locs with gold bead tips, and he has black ink neck tattoos "
        "(an Om symbol on the left of his throat, an ankh on the right, the word $shamz in script across his throat on the neck, never on "
        "the chest) and a black-and-grey Medusa portrait and mandala tattoo sleeve on his right arm. Natural eyes. NEW OUTFIT: {outfit}. "
        "No text besides the tattoos, no logos, no brand marks.")
SCENE_REAL = " Photorealistic, like a realistic modern open-world game, cinematic lighting, rich detail, depth of field. No people, no readable text, no logos."
SCENE_PAINTED = " Painted semi-realistic game-art illustration, cinematic, rich detail, depth of field. No people, no readable text, no logos."
# Which Shamz: 'painted' = the original character sheet (owner, 22 Nov 2026: "carry on with the old character sheet for
# now"); 'real' = the realistic, owner-face version (on hold). Set SHAMZ_STYLE=real to switch.
import os
STYLE = os.environ.get('SHAMZ_STYLE', 'painted')
LOOK, SCENE = (LOOK_REAL, SCENE_REAL) if STYLE == 'real' else (LOOK_PAINTED, SCENE_PAINTED)
MODEL_SHAMZ = 'flux-2-dev' if STYLE == 'real' else 'flux-2-klein-9b'
def run(out, prompt, refs):
    if out.exists(): return f'skip {out.name}'
    cmd = ['curl', '-s', '--max-time', '300', f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/@cf/black-forest-labs/' + (MODEL_SHAMZ if refs else 'flux-2-klein-9b'),
           '-H', 'Authorization: Bearer dummy', '--form-string', f'prompt={prompt}', '-F', 'width=768', '-F', 'height=1344', '-F', 'steps=28']
    for i, r in enumerate(refs): cmd += ['-F', f'input_image_{i}=@{r}']
    try: d = json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout)
    except Exception as e: return f'FAIL {out.name} {e}'
    img = (d.get('result') or {}).get('image')
    if not img: return f'FAIL {out.name} {json.dumps(d)[:300]}'
    out.write_bytes(base64.b64decode(img))
    if refs and STYLE == 'real':               # realistic Shamz: paint his tomoe eyes (gta/tools/eyes.py)
        import eyes; n = eyes.paint(str(out)); return f'ok {out.name} (eyes painted: {n})'
    return f'ok {out.name}'
jobs = []
for ep in sys.argv[1:]:
    ep = pathlib.Path(ep); spec = json.load(open(ep / 'plates.json')); (ep / 'plates').mkdir(exist_ok=True)
    refs = ([T.parents[1] / 'assets/private/owner_face.png', T / 'refs_real/body_front.png', T / 'refs_real/tattoos.png'] if STYLE == 'real'
            else [T / 'refs' / f for f in ('face.png', 'body.png', 'tattoos.png')])   # painted: crops of assets/characters/shamz-gta-sheet.png
    for n, p in spec.get('shamz', {}).items():
        jobs.append((ep / 'plates' / f'{n}.png', f"Vertical cinematic medium shot, waist-up. {LOOK.format(outfit=spec['outfit'])} {p} Anatomically correct hands: each hand has exactly five fingers (one thumb and four fingers), no extra or missing fingers. Any phone or gadget is plain with no logo. His head in the upper-middle of the frame.", refs))
    for n, p in spec.get('scenes', {}).items():
        jobs.append((ep / 'plates' / f'{n}.png', 'Vertical cinematic shot. ' + p + SCENE, []))
with cf.ThreadPoolExecutor(3) as ex:
    for r in ex.map(lambda j: run(*j), jobs): print(r, flush=True)
