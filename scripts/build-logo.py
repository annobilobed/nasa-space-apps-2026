"""Key the supplied AIRXON logo (glow on black) to transparency and export sizes.
Alpha comes from brightness so glows and the planet edge fade smoothly into any dark background."""
import numpy as np
from PIL import Image
src = np.asarray(Image.open('assets-src/brand/airxon-logo-original.jpg').convert('RGB')).astype(np.float32) / 255
a = np.clip((src.max(axis=2) - 0.03) / 0.55, 0, 1)            # near-black -> transparent
a = a ** 0.85
rgb = np.where(a[..., None] > 0.001, np.clip(src / np.maximum(a[..., None], 1e-3), 0, 1), 0)  # un-premultiply
img = Image.fromarray(np.dstack([rgb, a]).__mul__(255).astype(np.uint8), 'RGBA')
bbox = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
cx, cy = (bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2
half = max(bbox[2] - bbox[0], bbox[3] - bbox[1]) / 2 + 6
img = img.crop((int(cx - half), int(cy - half), int(cx + half), int(cy + half)))
for s in (96, 192, 384, 768):
    img.resize((s, s), Image.LANCZOS).save(f'public/brand/airxon-logo-{s}.webp', quality=90, method=6)
img.resize((512, 512), Image.LANCZOS).save('public/brand/airxon-logo-512.png', optimize=True)
# favicon / touch icon on the site's navy so they read on light browser chrome too
for s, name in ((32, 'favicon-32.png'), (180, 'apple-touch-icon.png')):
    bg = Image.new('RGBA', (s, s), (8, 13, 28, 255)); bg.alpha_composite(img.resize((s, s), Image.LANCZOS)); bg.convert('RGB').save(f'public/{name}')
print('crop', img.size)
