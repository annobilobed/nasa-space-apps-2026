"""Render the AIRXON homepage 'journey' as ONE continuous frame sequence from real NASA data.

Phases (one unbroken camera move, scrubbed by scroll on the homepage):
  A  hero      : Mars large in the lower right (the hero composition), stars behind,
                 drifting to the centre of the frame while turning towards Meridiani
  B  descent   : zoom from orbit to Endeavour Crater
  C  landing   : the orbital view dissolves into Opportunity's final ground panorama
  D  panorama  : a gentle pan across the panorama (PIA22909)

Every pixel is a projection of NASA imagery:
  colour  : Viking MDIM 2.1 global colour mosaic (Mars Trek, zoom 4)
  detail  : MRO CTX Meridiani Planum mosaic (Mars Trek, zoom 9 and 11), used as a
            high-pass luminance detail layer on top of the Viking colour
            (classic pan-sharpening, so strip-to-strip brightness differences vanish).
The camera starts in orbit, turns towards Meridiani Planum and descends to
Endeavour Crater, on whose western rim Opportunity rests.

Usage: python3 scripts/render-journey.py <out_dir> <width> <height>
"""
import sys, os, math
import numpy as np
from PIL import Image, ImageFilter
Image.MAX_IMAGE_PIXELS = None
SRC = 'assets-src/descent-src'
out, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
ONLY = set(int(v) for v in sys.argv[4].split(',')) if len(sys.argv) > 4 else None   # optional frame subset for previews
os.makedirs(out, exist_ok=True)

R_MARS = 3389.5e3                      # m
TARGET = (-2.28, -5.16)                # Endeavour Crater centre in this mosaic (lat, lon)
BG = np.array([8, 13, 28], np.float32) # site navy

_g = Image.open(f'{SRC}/global.png').convert('RGB')
# mip pyramid of the global colour map: prefiltered levels prevent shimmer on the small globe
PYR = [np.asarray(_g.resize((8192 >> k, 4096 >> k), Image.LANCZOS) if k else _g).astype(np.float32) for k in range(5)]

def load_detail(name, sigma):
    im = Image.open(f'{SRC}/{name}.png').convert('LA')
    g, a = im.split()
    a = a.point(lambda v: 255 if v > 200 else 0)
    ga = Image.fromarray((np.asarray(g, np.float32) * (np.asarray(a, np.float32) / 255)).astype(np.uint8))
    num = np.asarray(ga.filter(ImageFilter.GaussianBlur(sigma)), np.float32)
    den = np.asarray(a.filter(ImageFilter.GaussianBlur(sigma)), np.float32) / 255
    mean = num / np.maximum(den, 1e-3)
    G = np.asarray(g, np.float32)
    detail = np.clip(G / np.maximum(mean, 4), 0.35, 2.2)
    # CTX strips run roughly north-south but slightly tilted: find the tilt that best
    # aligns the banding, remove per-column banding in that frame, rotate back.
    valid = np.asarray(a, np.float32) > 0
    def colband(det, ang):
        r = np.asarray(Image.fromarray(np.where(valid, det, np.nan).astype(np.float32), 'F').rotate(ang, Image.BILINEAR, expand=True, fillcolor=float('nan')))
        med = np.nanmedian(r, axis=0)
        return r, np.where(np.isfinite(med), med, 1.0)
    small = np.asarray(Image.fromarray(detail.astype(np.float32), 'F').resize((detail.shape[1] // 4, detail.shape[0] // 4)))
    vs = np.asarray(Image.fromarray(valid.astype(np.uint8) * 255).resize((small.shape[1], small.shape[0]))) > 128
    best, bang = -1, 0
    for ang in np.arange(-12, 12.5, 1.0):
        r = np.asarray(Image.fromarray(np.where(vs, small, np.nan).astype(np.float32), 'F').rotate(ang, Image.BILINEAR, expand=True, fillcolor=float('nan')))
        sc = np.nanstd(np.nanmedian(r, axis=0))
        if sc > best: best, bang = sc, ang
    r, med = colband(detail, bang)
    r = r / np.maximum(med[None, :], 0.2)
    back = np.asarray(Image.fromarray(r.astype(np.float32), 'F').rotate(-bang, Image.BILINEAR, expand=True, fillcolor=1.0))
    oy, ox = (back.shape[0] - detail.shape[0]) // 2, (back.shape[1] - detail.shape[1]) // 2
    detail = np.nan_to_num(back[oy:oy + detail.shape[0], ox:ox + detail.shape[1]], nan=1.0)
    detail = np.clip(detail, 0.35, 2.2)
    print(name, 'strip tilt', bang, flush=True)
    detail = 1 + (detail - 1) * 0.75                     # soften seams a little
    # feathered validity mask: shrink away from no-data edges and the outer border
    A = np.asarray(a.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(sigma * 0.8)), np.float32) / 255
    A = np.clip((A - 0.5) * 2.2, 0, 1)
    h, w = A.shape; f = int(min(h, w) * 0.16)
    ramp_x = np.clip(np.minimum(np.arange(w), np.arange(w)[::-1]) / f, 0, 1)
    ramp_y = np.clip(np.minimum(np.arange(h), np.arange(h)[::-1]) / f, 0, 1)
    A *= ramp_y[:, None] * ramp_x[None, :]
    lon0, lon1, lat0, lat1 = map(float, open(f'{SRC}/{name}.extent').read().split(','))
    return dict(detail=detail.astype(np.float32), mask=A.astype(np.float32), ext=(lon0, lon1, lat0, lat1))

_cache = f'{SRC}/r9_detail_150.npz'
if os.path.exists(_cache):
    _z = np.load(_cache); L9 = dict(detail=_z['detail'], mask=_z['mask'], ext=tuple(_z['ext']))
else:
    L9 = load_detail('r9', 150); np.savez(_cache, detail=L9['detail'], mask=L9['mask'], ext=np.array(L9['ext']))

def bilinear(img, u, v):
    h, w = img.shape[:2]
    u = np.clip(u, 0, w - 1.001); v = np.clip(v, 0, h - 1.001)
    u0 = np.floor(u).astype(np.int32); v0 = np.floor(v).astype(np.int32)
    fu = u - u0; fv = v - v0
    if img.ndim == 3: fu = fu[..., None]; fv = fv[..., None]
    a = img[v0, u0]; b = img[v0, u0 + 1]; c = img[v0 + 1, u0]; d = img[v0 + 1, u0 + 1]
    return a * (1 - fu) * (1 - fv) + b * fu * (1 - fv) + c * (1 - fu) * fv + d * fu * fv

def sample_layer(L, lat, lon):
    lon0, lon1, lat0, lat1 = L['ext']
    h, w = L['mask'].shape
    u = (lon - lon0) / (lon1 - lon0) * w - 0.5
    v = (lat1 - lat) / (lat1 - lat0) * h - 0.5
    inside = (u >= 0) & (u < w - 1) & (v >= 0) & (v < h - 1)
    d = np.ones_like(lat, np.float32); m = np.zeros_like(lat, np.float32)
    if inside.any():
        d[inside] = bilinear(L['detail'], u[inside], v[inside])
        m[inside] = bilinear(L['mask'], u[inside], v[inside])
    return d, m

def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)


SUN = np.array([-0.55, 0.38, 0.74]); SUN /= np.linalg.norm(SUN)
ys0, xs0 = np.mgrid[0:H, 0:W].astype(np.float32)
PORTRAIT = H > W
S = min(W, H)

# ── Frame budget ─────────────────────────────────────────────
NA, NB, NC, ND = 48, 120, 36, 72
N = NA + NB + NC + ND

# ── Planet keyframes (screen centre and radius in px) ───────
if PORTRAIT:
    A0 = (0.80 * W, 0.86 * H, 0.70 * W)       # hero: big planet low on the screen, under the copy
else:
    A0 = (0.75 * W, 0.98 * H, 0.69 * H)       # hero: big planet in the lower right
A1 = (0.5 * W, 0.5 * H, 0.40 * S)             # centred globe, start of the descent
R1 = R_MARS / 55.0 * (S / 720)                # ~55 m per px at the crater
START = (-8.0, -62.0)                         # hero face: Valles Marineris (matches the hero caption)

def ease(t): t = min(max(t, 0.0), 1.0); return t * t * (3 - 2 * t)
def lerp(a, b, t): return a + (b - a) * t

# ── Stars (fixed, so the hero background is part of the same film) ──
rng = np.random.default_rng(7)
stars = np.zeros((H, W), np.float32)
for _ in range(int(W * H / 1500)):
    sx, sy = rng.uniform(0, W), rng.uniform(0, H)
    b = rng.uniform(0.25, 1.0) ** 2.2 * 255
    r = 0.6 + rng.uniform(0, 1) ** 4 * 1.4
    x0, x1 = int(max(0, sx - 4)), int(min(W, sx + 5)); y0, y1 = int(max(0, sy - 4)), int(min(H, sy + 5))
    gx, gy = np.meshgrid(np.arange(x0, x1), np.arange(y0, y1))
    stars[y0:y1, x0:x1] += b * np.exp(-((gx - sx) ** 2 + (gy - sy) ** 2) / (2 * r * r))
STARS = np.clip(stars, 0, 255)[..., None] * np.array([0.93, 0.95, 1.0], np.float32)

# ── Ground panorama ─────────────────────────────────────────
PANO = Image.open('assets-src/nasa/PIA22909.jpg').convert('RGB')
pa = np.asarray(PANO, np.float32)
pmask = np.clip((pa.max(axis=2) - 6) / 14, 0, 1)                 # the mosaic's black gaps become navy
pmask = np.asarray(Image.fromarray((pmask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)), np.float32) / 255
PANO_RGBA = Image.fromarray(np.dstack([pa, pmask * 255]).astype(np.uint8), 'RGBA')
PH = (0.40 if PORTRAIT else 0.56) * H                             # displayed panorama height (gentle zoom)
PW = PH * PANO.width / PANO.height
PY = (0.47 if PORTRAIT else 0.46) * H                             # vertical centre

def pano_frame(pan, scale):
    """Panorama composited on navy. pan 0 = left end, 1 = right end; scale >= 1 zooms around the frame centre."""
    h = PH * scale; w = PW * scale
    x_left = lerp(0, W - PW, pan) - (w - PW) * 0.5
    y_top = PY - h / 2
    img = PANO_RGBA.resize((max(1, int(round(w))), max(1, int(round(h)))), Image.LANCZOS)
    canvas = Image.new('RGBA', (W, H), (8, 13, 28, 255))
    canvas.alpha_composite(img, (int(round(x_left)), int(round(y_top))))
    return np.asarray(canvas.convert('RGB'), np.float32)

def planet_frame(cx, cy, Rpx, lat_deg, lon_deg, star_amt):
    lat_c, lon_c = math.radians(lat_deg), math.radians(lon_deg)
    mpp = R_MARS / Rpx
    x = (xs0 - cx) / Rpx; y = (cy - ys0) / Rpx
    rho2 = x * x + y * y
    on = rho2 <= 1
    img = np.empty((H, W, 3), np.float32); img[:] = BG
    if star_amt > 0: img += STARS * star_amt
    if on.any():
        xo, yo = x[on], y[on]
        z = np.sqrt(np.clip(1 - (xo * xo + yo * yo), 0, 1))
        lat = np.degrees(np.arcsin(np.clip(z * math.sin(lat_c) + yo * math.cos(lat_c), -1, 1)))
        lon = np.degrees(lon_c + np.arctan2(xo, z * math.cos(lat_c) - yo * math.sin(lat_c)))
        lon = (lon + 180) % 360 - 180
        lvl = float(np.clip(math.log2(max(mpp, 1) / 2600.0), 0, 4))
        l0 = int(lvl); l1 = min(l0 + 1, 4); fl = lvl - l0
        def g(level):
            im = PYR[level]; gh, gw, _ = im.shape
            return bilinear(im, (lon + 180) / 360 * gw - 0.5, (90 - lat) / 180 * gh - 0.5)
        col = g(l0) if fl < 1e-3 or l1 == l0 else g(l0) * (1 - fl) + g(l1) * fl
        w9 = float(smooth(1700, 650, mpp))
        if w9 > 0:
            d, m = sample_layer(L9, lat, lon); a = m * w9
            col = col * (1 * (1 - a) + d * a)[..., None]
        gray = col.mean(axis=1, keepdims=True)
        col = (gray + (col - gray) * 1.18) * 1.16 * np.array([1.07, 1.0, 0.88], np.float32)
        shade = 0.10 + 0.95 * np.clip(xo * SUN[0] + yo * SUN[1] + z * SUN[2], 0, 1)
        col = col * shade[:, None]
        img[on] = col
    rho = np.sqrt(rho2)
    rim = np.clip(1 - (rho - 1) / 0.035, 0, 1) * (rho > 1) * np.clip((x * SUN[0] + y * SUN[1]) / np.maximum(rho, 1e-6) + 0.6, 0, 1)
    img += rim[..., None] ** 2 * np.array([150, 110, 95], np.float32) * 0.55
    edge = np.clip((1 - rho) * Rpx, 0, 1)[..., None]
    bgst = BG + (STARS * star_amt if star_amt > 0 else 0)
    img = np.where((rho > 1)[..., None], img, img * edge + bgst * (1 - edge))
    return img, mpp

def orientation(u):
    k = (1 - ease(u)) ** 1.3
    return TARGET[0] + (START[0] - TARGET[0]) * k, TARGET[1] + (START[1] - TARGET[1]) * k

log = []
for i in range(N):
    if ONLY is not None and i not in ONLY: continue
    if i < NA + NB:
        u = i / (NA + NB - 1)                         # orientation turns across A and B
        lat, lon = orientation(u)
        if i < NA:                                     # A: hero → centred globe
            t = ease(i / (NA - 1))
            cx, cy = lerp(A0[0], A1[0], t), lerp(A0[1], A1[1], t)
            Rpx = math.exp(lerp(math.log(A0[2]), math.log(A1[2]), t))
            star_amt = 1.0
        else:                                          # B: centred zoom to the crater
            t = ease((i - NA) / (NB - 1))
            cx, cy = A1[0], A1[1]
            Rpx = math.exp(lerp(math.log(A1[2]), math.log(R1), t))
            star_amt = 1.0 - t
        img, mpp = planet_frame(cx, cy, Rpx, lat, lon, star_amt)
    elif i < NA + NB + NC:                             # C: orbit dissolves into the ground
        t = (i - NA - NB) / (NC - 1)
        Rpx = R1 * (1 + 0.25 * (1 - (1 - t) ** 2))     # keep easing in a little
        orb, mpp = planet_frame(A1[0], A1[1], Rpx, TARGET[0], TARGET[1], 0)
        gnd = pano_frame(0.0, lerp(1.12, 1.0, ease(t)))
        a = ease(t)
        img = orb * (1 - a) + gnd * a
    else:                                              # D: pan across the panorama
        t = ease((i - NA - NB - NC) / (ND - 1))
        img = pano_frame(t, 1.0); mpp = 0
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(f'{out}/f{i:03d}.jpg', quality=92)
    if i % 24 == 0: print(f'frame {i}/{N}', flush=True)
print('done', out, N, 'frames')
