"""Make a hand-drawn banner strip for each deck from its title-slide illustration.
Used by build_library.py. Needs numpy, Pillow and pdftoppm."""
import sys, os, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw

W, H = 720, 240
BG = {"LE": (255, 241, 201), "JM": (220, 235, 255), "YI": (227, 246, 234), "TL": (253, 226, 228), "F": (239, 227, 251)}
ACC = {"LE": (232, 163, 23), "JM": (31, 111, 209), "YI": (42, 157, 92), "TL": (230, 57, 70), "F": (123, 63, 196)}

def bg_colours(sub):
    q = (sub // 8).reshape(-1, 3)
    keys = q[:, 0] * 1024 + q[:, 1] * 32 + q[:, 2]
    vals, cnt = np.unique(keys, return_counts=True)
    order = np.argsort(-cnt); out = []
    for i in order[:4]:
        v = vals[i]; rgb = np.array([v // 1024, (v // 32) % 32, v % 32]) * 8
        if cnt[i] > 0.06 * len(keys) and rgb.min() > 165: out.append(v)
    return out, keys.reshape(sub.shape[:2])

def keys_of(sub):
    q = sub // 8
    return q[..., 0] * 1024 + q[..., 1] * 32 + q[..., 2]

def bgmask_of(sub, cols=None):
    if cols is None: cols, keys = bg_colours(sub)
    else: keys = keys_of(sub)
    m = np.zeros(sub.shape[:2], bool)
    for c in cols: m |= np.abs(keys - c) == 0
    mx, mn = sub.max(2), sub.min(2)
    m |= (mn > 225) & ((mx - mn) < 40)
    return m

def art_box(im):
    a = np.asarray(im.convert("RGB")).astype(int)
    h, w, _ = a.shape
    x0, y0, x1, y1 = int(w*0.575), int(h*0.04), int(w*0.985), int(h*0.88)
    sub = a[y0:y1, x0:x1]
    mx, mn = sub.max(2), sub.min(2)
    sat = (mx - mn)
    global COLS
    COLS = bg_colours(sub)[0]
    ink = ((mx < 120) | ((sat > 90) & (mx < 250)) | (sat > 140)) & ~bgmask_of(sub, COLS)
    # drop tiny deco: require row/col density
    rows = np.where(ink.sum(1) > max(3, w*0.004))[0]; cols = np.where(ink.sum(0) > max(3, h*0.006))[0]
    if len(rows) < 5 or len(cols) < 5: return (x0, y0, x1, y1)
    # drop small isolated clusters at the edges (leaked title letters, sticky-note corners)
    gap = int(w * 0.015)
    groups = np.split(cols, np.where(np.diff(cols) > gap)[0] + 1)
    def vext(g):
        r = np.where(ink[:, g[0]:g[-1] + 1].any(1))[0]
        return (r[-1] - r[0]) if len(r) else 0
    while len(groups) > 1 and (groups[0][-1] - groups[0][0]) < w * 0.11 and vext(groups[0]) < h * 0.08: groups = groups[1:]
    while len(groups) > 1 and (groups[-1][-1] - groups[-1][0]) < w * 0.03: groups = groups[:-1]
    cols = np.concatenate(groups)
    rg = np.split(rows, np.where(np.diff(rows) > int(h * 0.05))[0] + 1)
    while len(rg) > 1 and (rg[-1][-1] - rg[-1][0]) < h * 0.04: rg = rg[:-1]
    while len(rg) > 1 and (rg[0][-1] - rg[0][0]) < h * 0.03: rg = rg[1:]
    rows = np.concatenate(rg)
    bx0, bx1, by0, by1 = cols[0] + x0, cols[-1] + x0, rows[0] + y0, rows[-1] + y0
    pad = int(w*0.012)
    return (max(0, bx0 - pad), max(0, by0 - pad), min(w, bx1 + pad), min(h, by1 + pad))

def make(pdf, out, code=None):
    code = code or os.path.basename(pdf).split("_")[0]
    grp = code.split("-")[0]
    with tempfile.TemporaryDirectory() as t:
        subprocess.run(["pdftoppm", "-r", "110", "-png", "-f", "1", "-l", "1", pdf, t + "/p"], check=True)
        f = [x for x in os.listdir(t) if x.endswith(".png")][0]
        im = Image.open(os.path.join(t, f)).convert("RGB")
    box = art_box(im)
    art = im.crop(box)
    # knock out the cream / pastel-blob background so art sits on our strip colour
    a = np.asarray(art).astype(int)
    bgmask = bgmask_of(a, COLS)
    alpha = np.where(bgmask, 0, 255).astype(np.uint8)
    art = art.convert("RGBA"); art.putalpha(Image.fromarray(alpha))
    bg = BG.get(grp, (240, 240, 240)); acc = ACC.get(grp, (90, 90, 90))
    ban = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(ban)
    # soft blobs + doodles in the slide style
    d.ellipse([-120, -160, 260, 200], fill=tuple(min(255, c + 14) for c in bg) + (255,))
    d.ellipse([W - 260, 90, W + 120, 420], fill=tuple(max(0, c - 10) for c in bg) + (255,))
    for (x, y, r) in [(60, 190, 5), (120, 40, 4), (W - 60, 34, 5), (W - 120, 200, 4), (300, 210, 3)]:
        d.line([x - r, y, x + r, y], fill=acc + (110,), width=2); d.line([x, y - r, x, y + r], fill=acc + (110,), width=2)
    d.line([0, H - 3, W, H - 3], fill=acc + (255,), width=6)
    # fit art
    s = min((W - 60) / art.width, (H - 30) / art.height)
    art = art.resize((max(1, int(art.width * s)), max(1, int(art.height * s))), Image.LANCZOS)
    ban.alpha_composite(art, ((W - art.width) // 2, (H - 6 - art.height) // 2))
    ban.convert("RGB").save(os.path.join(out, code + ".jpg"), quality=84, optimize=True, progressive=True)
    return code

if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for p in sys.argv[2:]:
        try: print(make(p, out))
        except Exception as e: print("FAIL", p, e)
