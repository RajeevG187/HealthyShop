#!/bin/bash

# App Icon Generation Script for HealthyShop
# This script generates all required icon sizes from logo1.jpeg

echo "======================================"
echo "HealthyShop App Icon Generator"
echo "======================================"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo ""
    echo "Please install ImageMagick:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php"
    echo ""
    echo "Or use online generators (see ICON_GENERATION_GUIDE.md)"
    exit 1
fi

echo "✅ ImageMagick found!"
echo ""

SOURCE_IMAGE="src/assets/logo1.jpeg"

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ Logo file not found: $SOURCE_IMAGE"
    exit 1
fi

echo "✅ Logo file found: $SOURCE_IMAGE"
echo ""
echo "Generating Android icons..."
echo ""

# Android Icons
ANDROID_RES="android/app/src/main/res"

# mdpi (48x48)
echo "  - mdpi (48x48)"
convert "$SOURCE_IMAGE" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 48x48 -alpha set \( +clone -distort DePolar 0 -virtual-pixel HorizontalTile -background None -distort Polar 0 \) -compose Dst_In -composite "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"

# hdpi (72x72)
echo "  - hdpi (72x72)"
convert "$SOURCE_IMAGE" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 72x72 -alpha set \( +clone -distort DePolar 0 -virtual-pixel HorizontalTile -background None -distort Polar 0 \) -compose Dst_In -composite "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"

# xhdpi (96x96)
echo "  - xhdpi (96x96)"
convert "$SOURCE_IMAGE" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 96x96 -alpha set \( +clone -distort DePolar 0 -virtual-pixel HorizontalTile -background None -distort Polar 0 \) -compose Dst_In -composite "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"

# xxhdpi (144x144)
echo "  - xxhdpi (144x144)"
convert "$SOURCE_IMAGE" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 144x144 -alpha set \( +clone -distort DePolar 0 -virtual-pixel HorizontalTile -background None -distort Polar 0 \) -compose Dst_In -composite "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"

# xxxhdpi (192x192)
echo "  - xxxhdpi (192x192)"
convert "$SOURCE_IMAGE" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"
convert "$SOURCE_IMAGE" -resize 192x192 -alpha set \( +clone -distort DePolar 0 -virtual-pixel HorizontalTile -background None -distort Polar 0 \) -compose Dst_In -composite "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

echo ""
echo "✅ Android icons generated!"
echo ""

echo "======================================"
echo "⚠️  iOS Icons"
echo "======================================"
echo ""
echo "For iOS icons, please use one of these methods:"
echo ""
echo "1. Online Generator (Recommended):"
echo "   - Visit: https://www.appicon.co/"
echo "   - Upload: $SOURCE_IMAGE"
echo "   - Download iOS icons"
echo "   - Replace in: ios/RunAnywhereStarter/Images.xcassets/AppIcon.appiconset/"
echo ""
echo "2. Or use this command to generate basic sizes:"
echo ""

IOS_ICON_PATH="ios/RunAnywhereStarter/Images.xcassets/AppIcon.appiconset"
mkdir -p "$IOS_ICON_PATH"

# Generate iOS icons
convert "$SOURCE_IMAGE" -resize 20x20 "$IOS_ICON_PATH/Icon-20.png"
convert "$SOURCE_IMAGE" -resize 40x40 "$IOS_ICON_PATH/Icon-20@2x.png"
convert "$SOURCE_IMAGE" -resize 60x60 "$IOS_ICON_PATH/Icon-20@3x.png"
convert "$SOURCE_IMAGE" -resize 29x29 "$IOS_ICON_PATH/Icon-29.png"
convert "$SOURCE_IMAGE" -resize 58x58 "$IOS_ICON_PATH/Icon-29@2x.png"
convert "$SOURCE_IMAGE" -resize 87x87 "$IOS_ICON_PATH/Icon-29@3x.png"
convert "$SOURCE_IMAGE" -resize 40x40 "$IOS_ICON_PATH/Icon-40.png"
convert "$SOURCE_IMAGE" -resize 80x80 "$IOS_ICON_PATH/Icon-40@2x.png"
convert "$SOURCE_IMAGE" -resize 120x120 "$IOS_ICON_PATH/Icon-40@3x.png"
convert "$SOURCE_IMAGE" -resize 120x120 "$IOS_ICON_PATH/Icon-60@2x.png"
convert "$SOURCE_IMAGE" -resize 180x180 "$IOS_ICON_PATH/Icon-60@3x.png"
convert "$SOURCE_IMAGE" -resize 76x76 "$IOS_ICON_PATH/Icon-76.png"
convert "$SOURCE_IMAGE" -resize 152x152 "$IOS_ICON_PATH/Icon-76@2x.png"
convert "$SOURCE_IMAGE" -resize 167x167 "$IOS_ICON_PATH/Icon-83.5@2x.png"
convert "$SOURCE_IMAGE" -resize 1024x1024 "$IOS_ICON_PATH/Icon-1024.png"

echo "✅ iOS icons generated!"
echo ""
echo "======================================"
echo "✅ All icons generated successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Clean build folders:"
echo "   cd android && ./gradlew clean && cd .."
echo "   cd ios && rm -rf Pods Podfile.lock && pod install && cd .."
echo ""
echo "2. Rebuild the app:"
echo "   npm run android"
echo "   npm run ios"
echo ""
