"""Contact sheet of an episode's plates: python3 gta/tools/sheet.py <ep> <out.png>"""
import sys, glob, os
from PIL import Image, ImageDraw
fs = sorted(glob.glob(f'{sys.argv[1]}/plates/*.png'))
ims = [Image.open(f).convert('RGB').resize((300, 525)) for f in fs]
c = Image.new('RGB', (300 * len(ims), 545), 'black'); d = ImageDraw.Draw(c)
for i, (im, f) in enumerate(zip(ims, fs)): c.paste(im, (i * 300, 20)); d.text((i * 300 + 6, 4), os.path.basename(f), fill='white')
c.save(sys.argv[2])
