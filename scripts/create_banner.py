from PIL import Image, ImageDraw, ImageFont
import os

# Create a new image with a gradient background
width = 800
height = 300
image = Image.new('RGB', (width, height))
draw = ImageDraw.Draw(image)

# Create a gradient background
for y in range(height):
    r = int(255 * (1 - y/height))  # Red goes from 255 to 0
    g = int(200 * (y/height))      # Green goes from 0 to 200
    b = int(255 * (y/height))      # Blue goes from 0 to 255
    for x in range(width):
        draw.point((x, y), fill=(r, g, b))

# Load Bengali font
try:
    # Try to load Kalpurush font if available
    font_path = "C:/Windows/Fonts/Kalpurush.ttf"  # Adjust path if needed
    title_font = ImageFont.truetype(font_path, 40)
    text_font = ImageFont.truetype(font_path, 30)
except:
    # Fallback to default font if Bengali font not available
    title_font = ImageFont.load_default()
    text_font = ImageFont.load_default()

# Text content in Bengali
title_text = "এই অ্যাপটি তৈরি করেছেন মামুন শাইখ"
feature_text = "আরও অনেক নতুন ফিচার আসছে খুব শীঘ্রই..."

# Add text to the image
# Calculate text position for center alignment
title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
title_x = (width - title_width) // 2

feature_bbox = draw.textbbox((0, 0), feature_text, font=text_font)
feature_width = feature_bbox[2] - feature_bbox[0]
feature_x = (width - feature_width) // 2

# Draw text with shadow effect
shadow_offset = 2
shadow_color = (50, 50, 50)

# Draw shadow
draw.text((title_x + shadow_offset, 100 + shadow_offset), title_text, font=title_font, fill=shadow_color)
draw.text((feature_x + shadow_offset, 180 + shadow_offset), feature_text, font=text_font, fill=shadow_color)

# Draw main text
draw.text((title_x, 100), title_text, font=title_font, fill=(255, 255, 255))
draw.text((feature_x, 180), feature_text, font=text_font, fill=(255, 255, 255))

# Add a decorative border
border_width = 10
draw.rectangle([0, 0, width-1, height-1], outline=(255, 215, 0), width=border_width)

# Save the image
output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'images')
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'banner.png')
image.save(output_path)

print(f"Banner created successfully at: {output_path}")
