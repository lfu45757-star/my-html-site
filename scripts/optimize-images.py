"""Optional: regenerate lightweight card previews; original PNGs remain untouched.
Requires Pillow (tested with 13.0.0). Run from any working directory.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent / "assets" / "images"
for name in ("wechatbot_1", "MyLike_1", "YouDub_1"):
    original = root / f"{name}.png"
    output = root / f"{name}-960.webp"
    with Image.open(original) as image:
        image.thumbnail((960, 960), Image.Resampling.LANCZOS)
        image.convert("RGB").save(output, "WEBP", quality=86, method=6)
    print(f"{original.name}: {original.stat().st_size:,} -> {output.stat().st_size:,} bytes")
