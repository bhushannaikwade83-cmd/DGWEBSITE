#!/usr/bin/env python3
"""Builds clips/ch6-finale.mp4 from the REAL logo: exact text, animated light sweep + glow + particles."""
import subprocess, numpy as np, os
from PIL import Image, ImageFilter
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H, FPS, SECS = 1920, 1080, 24, 8
BG = np.array([9, 9, 11], np.float32)

logo = Image.open(f"{root}/assets/logo-official.jpg").convert("RGB").resize((H, H), Image.LANCZOS)
canvas = Image.new("RGB", (W, H), tuple(int(v) for v in BG)); canvas.paste(logo, ((W - H) // 2, 0))
base = np.asarray(canvas, np.float32)
lum = base.mean(axis=2)
mask = np.clip((lum - 60) / 100, 0, 1)[..., None]            # gold areas only
glow = np.asarray(canvas.filter(ImageFilter.GaussianBlur(45)), np.float32) - BG
glow = np.clip(glow, 0, None)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = (xx * 0.8 + yy * 0.6)
dmin, dmax = d.min(), d.max()

rng = np.random.default_rng(7)
N = 90
px, py0 = rng.uniform(300, W - 300, N), rng.uniform(0, H, N)
speed, size, ph = rng.uniform(20, 70, N), rng.uniform(1.5, 3.5, N), rng.uniform(0, 6.28, N)
gold = np.array([255, 214, 90], np.float32)

ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
    "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p",
    f"{root}/clips/ch6-finale.mp4"], stdin=subprocess.PIPE)
n = FPS * SECS
for f in range(n):
    t = f / (n - 1)
    ease = t * t * (3 - 2 * t)
    frame = base.copy()
    frame += glow * (0.25 + 0.55 * ease)                      # glow blooms warmer
    pos = dmin + (dmax - dmin) * (-0.1 + 1.2 * t)             # sweep crosses once
    band = np.exp(-((d - pos) / 140.0) ** 2)[..., None]
    frame += band * mask * np.array([120, 100, 50], np.float32)
    ys = (py0 - speed * (f / FPS) * 3) % H                    # particles float up
    for i in range(N):
        a = 0.35 + 0.35 * np.sin(ph[i] + f * 0.1)
        x0, y0, r = int(px[i]), int(ys[i]), int(size[i] * 4)
        ya, yb, xa, xb = max(y0 - r, 0), min(y0 + r, H), max(x0 - r, 0), min(x0 + r, W)
        if ya >= yb or xa >= xb: continue
        g = np.exp(-(((yy[ya:yb, xa:xb] - y0) ** 2 + (xx[ya:yb, xa:xb] - x0) ** 2) / (2 * size[i] ** 2)))[..., None]
        frame[ya:yb, xa:xb] += g * gold * a * (0.3 + 0.7 * ease)
    ff.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
ff.stdin.close(); ff.wait()
print("wrote clips/ch6-finale.mp4")
