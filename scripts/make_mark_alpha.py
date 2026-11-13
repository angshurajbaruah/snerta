"""Derive web-ready alpha versions of the approved raster mark crop (implementation fidelity only).

The approved crop sits on a light-grey background. To place it on any light UI surface without a
visible rectangle, each pixel is re-expressed relative to that background: darker pixels become black
with alpha, lighter pixels (highlights) become white with alpha. Over the page colour (~#f7f6f6)
this reproduces the original shading. The source crop in brand-assets/ is never modified.
Usage (from repo root): python3 scripts/make_mark_alpha.py
"""
from PIL import Image
import numpy as np

SRC = 'brand-assets/kab-fingerprint-crop.png'
PAGE = 247.0  # approx --paper luminance

im = np.asarray(Image.open(SRC).convert('RGB')).astype(float)
border = np.concatenate([im[:6].reshape(-1, 3), im[-6:].reshape(-1, 3), im[:, :6].reshape(-1, 3), im[:, -6:].reshape(-1, 3)])
bg = np.median(border, axis=0)
L = (im / bg).mean(axis=2)

dark = L < 1
alpha = np.where(dark, np.clip(1 - L, 0, 1), np.clip((L - 1) * PAGE / (255 - PAGE), 0, 1))
alpha[alpha < 0.012] = 0
rgba = np.zeros(im.shape[:2] + (4,), dtype=float)
rgba[..., :3] = np.where(dark[..., None], 0, 255)
rgba[..., 3] = alpha * 255
img = Image.fromarray(rgba.round().astype('uint8'), 'RGBA')
img.save('public/brand/kab-mark.png')

ys, xs = np.where(alpha > 0.04)
pad = 4
img.crop((xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad)).save('public/brand/kab-mark-tight.png')
print('ok', img.size)
