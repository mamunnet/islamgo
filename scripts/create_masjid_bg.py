from PIL import Image, ImageDraw, ImageFilter
import os
import random

def create_masjid_silhouette():
    # Create a new image with gradient background
    width = 1200
    height = 600
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)

    # Create a deep blue gradient background
    for y in range(height):
        r = int(30 + (20 * (1 - y/height)))  # Deep blue
        g = int(40 + (30 * (1 - y/height)))
        b = int(80 + (60 * (1 - y/height)))
        for x in range(width):
            draw.point((x, y), fill=(r, g, b))

    # Draw mosque silhouette
    # Main dome
    draw.ellipse([width//2-100, height//2-150, width//2+100, height//2+50], fill=(10, 10, 20))
    
    # Minarets
    draw.rectangle([width//2-200, height//2-250, width//2-180, height//2+100], fill=(10, 10, 20))
    draw.rectangle([width//2+180, height//2-250, width//2+200, height//2+100], fill=(10, 10, 20))
    
    # Small domes
    draw.ellipse([width//2-200, height//2-280, width//2-180, height//2-250], fill=(10, 10, 20))
    draw.ellipse([width//2+180, height//2-280, width//2+200, height//2-250], fill=(10, 10, 20))

    # Add stars
    for _ in range(200):
        x = random.randint(0, width)
        y = random.randint(0, height//2)
        size = random.randint(1, 3)
        brightness = random.randint(180, 255)
        draw.ellipse([x, y, x+size, y+size], fill=(brightness, brightness, brightness))

    # Add moon
    moon_x = width//4
    moon_y = height//4
    moon_size = 40
    draw.ellipse([moon_x-moon_size, moon_y-moon_size, moon_x+moon_size, moon_y+moon_size], 
                 fill=(255, 255, 220))

    # Apply slight blur for a softer look
    image = image.filter(ImageFilter.GaussianBlur(radius=1.5))

    # Save the image
    output_dir = os.path.join('public', 'images')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'masjid-bg.jpg')
    image.save(output_path, quality=95)
    print(f"Masjid background created at: {output_path}")

if __name__ == "__main__":
    create_masjid_silhouette()