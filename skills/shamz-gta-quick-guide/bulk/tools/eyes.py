"""Paint Shamz's eye pattern onto every face in an image: crimson iris, black outer ring, a thin inner ring, a black
pupil and three black tomoe (owner's reference, 22 Nov 2026). Irises are found with MediaPipe Face Landmarker (iris
landmarks), clipped to the eyelids, and blended with the eye's own shading and highlights so it stays photoreal.
    python3 gta/tools/eyes.py <in.png> [out.png]      (out defaults to overwriting in)
Model: models/face_landmarker.task (git-ignored; download from storage.googleapis.com/mediapipe-models)."""
import math, sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import mediapipe as mp

MODEL = pathlib.Path(__file__).resolve().parent / 'models' / 'face_landmarker.task'
LIDS = {'r': [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
        'l': [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]}
IRIS = {'r': (468, [469, 470, 471, 472]), 'l': (473, [474, 475, 476, 477])}


def iris_pattern(r, ss=4):
    """RGBA iris of radius r px matching the owner's reference (assets/characters/eyes/shamz_eyes_reference.png):
    bright red iris, bold black outer ring, thin dark inner ring, black pupil, three tomoe with tails, white glint
    upper-left."""
    R = r * ss; S = int(2 * R + 4); c = S / 2
    yy, xx = np.mgrid[0:S, 0:S]; d = np.hypot(xx - c, yy - c) / R
    col = np.zeros((S, S, 4), np.float32)
    t = np.clip(d, 0, 1)[..., None]
    inner, outer = np.array([255, 40, 40]), np.array([200, 0, 10])
    col[..., :3] = inner * (1 - t) + outer * t
    col[..., 3] = 255 * (d <= 1)
    col[(d > 0.9) & (d <= 1), :3] = (10, 4, 6)                        # black outer ring
    col[(np.abs(d - 0.56) < 0.022), :3] = (120, 0, 10)                # thin dark inner ring
    col[d <= 0.17, :3] = (8, 4, 6)                                    # pupil
    im = Image.fromarray(col.astype(np.uint8), 'RGBA'); dr = ImageDraw.Draw(im)
    for k in range(3):                                                # three tomoe on the inner ring
        a = math.radians(-90 + 120 * k); hx, hy = c + 0.56 * R * math.cos(a), c + 0.56 * R * math.sin(a); hr = 0.11 * R
        dr.ellipse((hx - hr, hy - hr, hx + hr, hy + hr), fill=(8, 4, 6, 255))
        pts = []
        for j in range(14):                                           # tail curling along the ring
            b = a + math.radians(5 + 6 * j); w = hr * (1 - j / 14)
            rr = 0.56 * R + 0.2 * R * (j / 14); pts.append((c + (rr + w) * math.cos(b), c + (rr + w) * math.sin(b)))
        for j in reversed(range(14)):
            b = a + math.radians(5 + 6 * j); w = hr * (1 - j / 14)
            rr = 0.56 * R + 0.2 * R * (j / 14); pts.append((c + (rr + w * 0.15) * math.cos(b), c + (rr + w * 0.15) * math.sin(b)))
        dr.polygon(pts, fill=(8, 4, 6, 255))
    gx, gy, gr = c - 0.4 * R, c - 0.52 * R, 0.12 * R                  # white glint, upper-left
    dr.ellipse((gx - gr, gy - gr, gx + gr, gy + gr), fill=(255, 255, 255, 255))
    return im.resize((int(2 * r + 1), int(2 * r + 1)), Image.LANCZOS)


def paint(src, dst=None):
    img = Image.open(src).convert('RGB'); W, H = img.size; arr = np.asarray(img).astype(np.float32)
    opts = mp.tasks.vision.FaceLandmarkerOptions(base_options=mp.tasks.BaseOptions(model_asset_path=str(MODEL)), num_faces=4)
    with mp.tasks.vision.FaceLandmarker.create_from_options(opts) as fl:
        res = fl.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(arr.astype(np.uint8))))
    out = arr.copy(); n = 0
    for face in res.face_landmarks:
        P = [(p.x * W, p.y * H) for p in face]
        for side in 'rl':
            ci, ring = IRIS[side]; cx, cy = P[ci]; r = float(np.mean([math.dist(P[ci], P[j]) for j in ring]))
            if r < 2: continue
            # lock onto the drawn iris: the red pixels inside this eye's lids (painted Shamz already has red irises)
            lidm = Image.new('L', (W, H), 0); ImageDraw.Draw(lidm).polygon([P[j] for j in LIDS[side]], fill=255)
            m = np.asarray(lidm) > 0
            R_, G_, B_ = arr[..., 0], arr[..., 1], arr[..., 2]
            red = m & (R_ > 90) & (R_ > 1.6 * G_) & (R_ > 1.4 * B_)
            if red.sum() > 12:
                ys, xs = np.nonzero(red); cx, cy = float(xs.mean()), float(ys.mean())
                r = max(r, math.sqrt(red.sum() / math.pi))
            r *= 1.22                                                  # bigger irises, like the owner's reference
            lid = Image.new('L', (W, H), 0); ImageDraw.Draw(lid).polygon([P[j] for j in LIDS[side]], fill=255)
            lid = np.asarray(lid.filter(ImageFilter.GaussianBlur(max(0.6, r * 0.06)))).astype(np.float32) / 255
            pat = iris_pattern(r); pw = pat.size[0]; x0, y0 = int(round(cx - pw / 2)), int(round(cy - pw / 2))
            layer = np.zeros((H, W, 4), np.float32)
            xs, ys = max(0, x0), max(0, y0); xe, ye = min(W, x0 + pw), min(H, y0 + pw)
            if xe <= xs or ye <= ys: continue
            layer[ys:ye, xs:xe] = np.asarray(pat).astype(np.float32)[ys - y0:ye - y0, xs - x0:xe - x0]
            a = layer[..., 3:4] / 255 * lid[..., None]
            lum = out.mean(axis=2, keepdims=True) / 255
            shade = 0.85 + 0.2 * np.clip(lum / max(lum[a[..., 0] > 0.5].mean() if (a > 0.5).any() else 0.5, 1e-3), 0, 1.6)
            painted = np.clip(layer[..., :3] * shade, 0, 255)
            out = out * (1 - a) + painted * a; n += 1
    Image.fromarray(out.astype(np.uint8)).save(dst or src)
    return n


if __name__ == '__main__':
    print(sys.argv[1], 'eyes painted:', paint(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
