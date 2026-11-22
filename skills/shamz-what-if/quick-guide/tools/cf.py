"""Cloudflare Workers AI FLUX.2 [dev] with reference images. Usage: python3 cf.py <name> "<prompt>" [ref.png ...]"""
import json, os, sys, subprocess, base64, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
acc = os.environ.get('CLOUDFLARE_ACCOUNT_ID') or json.load(open('config/cloudflare.json'))['account_id']  # token: proxy-injected or replace 'Bearer dummy'
import os
MODEL=os.environ.get('M','flux-2-dev')
name, prompt, refs = sys.argv[1], sys.argv[2], sys.argv[3:]
cmd = ['curl', '-s', '--max-time', '300', f'https://api.cloudflare.com/client/v4/accounts/{acc}/ai/run/@cf/black-forest-labs/{MODEL}',
       '-H', 'Authorization: Bearer dummy', '--form-string', f'prompt={prompt}', '-F', 'width=768', '-F', 'height=1344', '-F', 'steps=28']
for i, r in enumerate(refs): cmd += ['-F', f'input_image_{i}=@{r}']
d = json.loads(subprocess.run(cmd, capture_output=True, text=True).stdout)
img = (d.get('result') or {}).get('image')
if img: (root/'plates'/f'{name}.png').write_bytes(base64.b64decode(img)); print('wrote', name)
else: print('FAIL', json.dumps(d)[:600])
