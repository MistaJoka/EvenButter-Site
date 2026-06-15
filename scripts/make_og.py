"""Compose a 1200x630 social share image from the cropped brand art."""
from PIL import Image

CREAM = (251, 244, 230, 255)
COCOA = (74, 52, 41, 255)
W, H = 1200, 630

og = Image.new("RGBA", (W, H), CREAM)
# rounded butter border frame
border = 14
frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))

logo = Image.open("public/images/logo.png").convert("RGBA")
marcel = Image.open("public/images/marcel.png").convert("RGBA")

def fit(img, target_w):
    ratio = target_w / img.width
    return img.resize((target_w, int(img.height * ratio)), Image.LANCZOS)

logo = fit(logo, 620)
marcel = fit(marcel, 300)

# layout: logo upper-center, marcel to the right/below
lx = (W - logo.width) // 2
ly = 120
og.alpha_composite(logo, (lx, ly))
mx = (W - marcel.width) // 2
my = ly + logo.height + 10
og.alpha_composite(marcel, (mx, my))

og.convert("RGB").save("public/images/og.png", quality=90)
print("wrote public/images/og.png", og.size)
