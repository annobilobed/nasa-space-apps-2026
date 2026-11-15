"""Download NASA Mars Trek tiles used by the descent sequence (cached in assets-src/descent-src).
  global : Viking MDIM 2.1 colour mosaic, zoom 4 (8192 x 4096)
  r9     : MRO CTX Meridiani Planum mosaic, zoom 9 (~81 m/px)
  r11    : MRO CTX Meridiani Planum mosaic, zoom 11 (~20 m/px) around Endeavour Crater
"""
import os, math, urllib.request, concurrent.futures as cf
from PIL import Image

OUT = 'assets-src/descent-src'
os.makedirs(OUT, exist_ok=True)
T = 'https://trek.nasa.gov/tiles/Mars/EQ/{layer}/1.0.0/default/default028mm/{z}/{r}/{c}.{ext}'
MDIM, CTX = 'Mars_Viking_MDIM21_ClrMosaic_global_232m', 'S_Meridiani_Sinus_Planium_CTX_BlockAdj_dd'

def col(lon, z): return (lon + 180) / 360 * 2 ** (z + 1)
def row(lat, z): return (90 - lat) / 180 * 2 ** z

def fetch(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return path
    for _ in range(4):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'airxon-build'}), timeout=60).read()
            open(path, 'wb').write(data); return path
        except Exception as e:
            err = e
    print('FAIL', url, err); return None

def mosaic(name, layer, ext, z, lon0, lon1, lat0, lat1):
    c0, c1 = int(math.floor(col(lon0, z))), int(math.floor(col(lon1, z)))
    r0, r1 = int(math.floor(row(lat1, z))), int(math.floor(row(lat0, z)))
    jobs = [(r, c, T.format(layer=layer, z=z, r=r, c=c, ext=ext), f'{OUT}/{name}_{z}_{r}_{c}.{ext}') for r in range(r0, r1 + 1) for c in range(c0, c1 + 1)]
    with cf.ThreadPoolExecutor(16) as ex: list(ex.map(lambda j: fetch(j[2], j[3]), jobs))
    W, H = (c1 - c0 + 1) * 256, (r1 - r0 + 1) * 256
    mode = 'RGB' if ext == 'jpg' else 'LA'
    im = Image.new(mode, (W, H))
    for r, c, _, p in jobs:
        if p and os.path.exists(p):
            t = Image.open(p).convert(mode); im.paste(t, ((c - c0) * 256, (r - r0) * 256))
    # geographic extent of the assembled image (degrees)
    ext_deg = ((c0 / 2 ** (z + 1)) * 360 - 180, ((c1 + 1) / 2 ** (z + 1)) * 360 - 180, 90 - ((r1 + 1) / 2 ** z) * 180, 90 - (r0 / 2 ** z) * 180)
    im.save(f'{OUT}/{name}.png')
    open(f'{OUT}/{name}.extent', 'w').write(','.join(f'{v:.8f}' for v in ext_deg))
    print(name, im.size, 'lon', ext_deg[0], ext_deg[1], 'lat', ext_deg[2], ext_deg[3], len(jobs), 'tiles')

mosaic('global', MDIM, 'jpg', 4, -180, 179.999, -89.999, 90)
mosaic('r9', CTX, 'png', 9, -8.05, -2.85, -4.85, -0.65)
mosaic('r11', CTX, 'png', 11, -5.85, -4.6, -2.95, -1.65)
