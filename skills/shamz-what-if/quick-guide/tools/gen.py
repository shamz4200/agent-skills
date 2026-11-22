"""Gemini image plates for the Short. Usage: python3 gen.py <name> [--ref] "<prompt>" (writes plates/<name>.png, cached)."""
import base64, json, sys, urllib.request, pathlib  # GEMINI key: injected by the proxy, or set it in the x-goog-api-key header
MODEL = 'gemini-3-pro-image'
name, args = sys.argv[1], sys.argv[2:]
ref = '--ref' in args; prompt = [a for a in args if a != '--ref'][0]
out = pathlib.Path(__file__).resolve().parent.parent / 'plates' / f'{name}.png'
parts = [{'text': prompt}]
if ref:
    b = open(pathlib.Path(__file__).resolve().parents[1] / 'cast' / 'shamz-gta-sheet.png', 'rb').read()
    parts.append({'inline_data': {'mime_type': 'image/png', 'data': base64.b64encode(b).decode()}})
body = {'contents': [{'parts': parts}], 'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '9:16'}}}
req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
    data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': 'dummy'})
d = json.load(urllib.request.urlopen(req, timeout=300))
for p in d['candidates'][0]['content']['parts']:
    if 'inlineData' in p:
        out.write_bytes(base64.b64decode(p['inlineData']['data'])); print('wrote', out); break
else: print('NO IMAGE', json.dumps(d)[:500])
