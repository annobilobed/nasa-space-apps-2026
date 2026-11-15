"""Render an orthographic globe from a NASA equirectangular global mosaic.
Usage: python3 scripts/render-globe.py <in.jpg> <out.png> <size> <lon0> <lat0>
The output is a projection of real NASA mosaic data (no synthetic texture);
a soft limb-darkening term is applied to suggest a sphere."""
import sys, numpy as np
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, out, size, lon0, lat0 = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
tex = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W, _ = tex.shape
r = np.linspace(-1, 1, size)
x, y = np.meshgrid(r, -r)
rho2 = x * x + y * y
mask = rho2 <= 1.0
z = np.sqrt(np.clip(1 - rho2, 0, 1))
la0, lo0 = np.radians(lat0), np.radians(lon0)
# inverse orthographic projection
lat = np.arcsin(np.clip(z * np.sin(la0) + y * np.cos(la0), -1, 1))
lon = lo0 + np.arctan2(x, z * np.cos(la0) - y * np.sin(la0))
u = ((np.degrees(lon) + 180) % 360) / 360 * (W - 1)
v = (90 - np.degrees(lat)) / 180 * (H - 1)
# bilinear sample
u0 = np.floor(u).astype(int); v0 = np.floor(v).astype(int)
u1 = (u0 + 1) % W; v1 = np.clip(v0 + 1, 0, H - 1)
fu = (u - u0)[..., None]; fv = (v - v0)[..., None]
c = (tex[v0, u0] * (1 - fu) * (1 - fv) + tex[v0, u1] * fu * (1 - fv) + tex[v1, u0] * (1 - fu) * fv + tex[v1, u1] * fu * fv)
shade = (0.55 + 0.45 * z)[..., None] ** 0.9
rgb = np.clip(c * shade, 0, 255)
alpha = np.clip((1 - np.sqrt(rho2)) * size * 0.5, 0, 1) * 255  # anti-aliased edge
img = np.dstack([rgb, alpha]).astype(np.uint8)
Image.fromarray(img, 'RGBA').save(out)
print('wrote', out)
