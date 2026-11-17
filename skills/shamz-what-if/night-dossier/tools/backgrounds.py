"""Painted background plates for Night Dossier episodes (the default for every real location since Nov 2026).

Each plate is one location, generated once with FLUX.1 [schnell] on Cloudflare Workers AI, in the fixed ND style below,
with no people and no text. Characters, signs, tags, stamps, numbers and documents are still drawn in code on top
(engine/plates.tsx), so they stay sharp, readable and timed to the voice.

    python3 backgrounds.py              # every plate in plates.json that doesn't exist yet
    python3 backgrounds.py hotel paris  # just these
    python3 backgrounds.py --force ...  # regenerate (the model takes no seed: each run gives a new picture)

plates.json (in the episode folder): { "<name>": "<scenery only: place, period, time of day, light, props>", ... }
Writes public/bg/<name>.png (1920x1080) and public/bg/<name>.json (prompt, model, licence).

Auth: set CLOUDFLARE_ACCOUNT_ID (not secret). The API token is never in code: in a Claude cloud session it is a network
secret on the environment (Bearer, host api.cloudflare.com) that the proxy attaches; elsewhere set CLOUDFLARE_API_TOKEN.

Check every plate before building (the model makes mistakes: mountains behind Paris, wrong-era objects, stray text) and
regenerate the bad ones. Keep the style line unchanged across an episode so the plates match.
"""
import argparse
import base64
import io
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

from PIL import Image

MODEL = '@cf/black-forest-labs/flux-1-schnell'
ND_STYLE = ('flat 2D illustrated background for an animated documentary, clean dark outlines, soft paper grain texture, '
            'night palette of deep navy, charcoal and bottle green, lit by one warm practical light, gentle vignette, '
            'rich detail, layered depth, wide landscape composition, empty scene, no people, no characters, no text, no letters')


def generate(account, prompt, steps=8, retries=3):
    url = f'https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/{MODEL}'
    token = os.environ.get('CLOUDFLARE_API_TOKEN', 'injected-by-proxy')
    body = json.dumps({'prompt': prompt, 'steps': steps}).encode()
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
            r = json.load(urllib.request.urlopen(req, timeout=180))
            if r.get('success') and r.get('result', {}).get('image'):
                return Image.open(io.BytesIO(base64.b64decode(r['result']['image']))).convert('RGB')
            raise RuntimeError(json.dumps(r)[:300])
        except Exception as e:  # noqa: BLE001
            if attempt == retries - 1:
                raise
            print(f'  retry after error: {e}', flush=True)
            time.sleep(5 * (attempt + 1))


def to_16x9(img, band=0.5):
    w, h = img.size
    ch = int(w * 9 / 16)
    top = int((h - ch) * band)
    return img.crop((0, top, w, top + ch)).resize((1920, 1080), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('names', nargs='*')
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--plates', default='plates.json')
    a = ap.parse_args()
    account = os.environ.get('CLOUDFLARE_ACCOUNT_ID') or sys.exit('set CLOUDFLARE_ACCOUNT_ID')
    plates = json.load(open(a.plates))
    out = Path('public/bg')
    out.mkdir(parents=True, exist_ok=True)
    for name in a.names or list(plates):
        if name not in plates:
            sys.exit(f'no prompt for {name} in {a.plates}')
        png = out / f'{name}.png'
        if png.exists() and not a.force:
            continue
        prompt = f'{plates[name]}, {ND_STYLE}'
        to_16x9(generate(account, prompt)).save(png)
        json.dump({'name': name, 'prompt': prompt, 'model': MODEL, 'model_license': 'apache-2.0', 'provider': 'Cloudflare Workers AI'},
                  open(out / f'{name}.json', 'w'), indent=1)
        print('plate', name, flush=True)


if __name__ == '__main__':
    main()
