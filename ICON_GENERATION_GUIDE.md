# App Icon Generation Guide

## Your logo location:

`src/assets/logo1.jpeg`

## Required Icon Sizes

### For Android (Mipmap):

You need to create the following icon sizes and place them in the respective folders:

#### mdpi (48x48)

- Path: `android/app/src/main/res/mipmap-mdpi/`
- Files needed: `ic_launcher.png`, `ic_launcher_round.png`

#### hdpi (72x72)

- Path: `android/app/src/main/res/mipmap-hdpi/`
- Files needed: `ic_launcher.png`, `ic_launcher_round.png`

#### xhdpi (96x96)

- Path: `android/app/src/main/res/mipmap-xhdpi/`
- Files needed: `ic_launcher.png`, `ic_launcher_round.png`

#### xxhdpi (144x144)

- Path: `android/app/src/main/res/mipmap-xxhdpi/`
- Files needed: `ic_launcher.png`, `ic_launcher_round.png`

#### xxxhdpi (192x192)

- Path: `android/app/src/main/res/mipmap-xxxhdpi/`
- Files needed: `ic_launcher.png`, `ic_launcher_round.png`

### For iOS (AppIcon):

iOS requires multiple sizes in the `ios/RunAnywhereStarter/Images.xcassets/AppIcon.appiconset/` folder:

- 20x20 (@1x, @2x, @3x) - Notification icon
- 29x29 (@1x, @2x, @3x) - Settings icon
- 40x40 (@1x, @2x, @3x) - Spotlight icon
- 60x60 (@2x, @3x) - App icon (iPhone)
- 76x76 (@1x, @2x) - App icon (iPad)
- 83.5x83.5 (@2x) - App icon (iPad Pro)
- 1024x1024 - App Store icon

## Quick Generation Methods

### Option 1: Use Online Icon Generator (Recommended)

1. **Android Icons:**
   - Visit: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - Upload: `src/assets/logo1.jpeg`
   - Select "Image" as source
   - Download the generated ZIP
   - Extract and copy the `mipmap-*` folders to `android/app/src/main/res/`

2. **iOS Icons:**
   - Visit: https://www.appicon.co/ or https://makeappicon.com/
   - Upload: `src/assets/logo1.jpeg`
   - Download iOS icons
   - Replace contents of `ios/RunAnywhereStarter/Images.xcassets/AppIcon.appiconset/`

### Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
cd src/assets

# For Android
convert logo1.jpeg -resize 48x48 ../../android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert logo1.jpeg -resize 72x72 ../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert logo1.jpeg -resize 96x96 ../../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert logo1.jpeg -resize 144x144 ../../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert logo1.jpeg -resize 192x192 ../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# For round icons (create circular versions)
convert logo1.jpeg -resize 48x48 -alpha set -background none \\
  -gravity center -extent 48x48 \\
  ../../android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
# ... repeat for other sizes with -hdpi, -xhdpi, -xxhdpi, -xxxhdpi
```

### Option 3: Manual Resize (Using any image editor)

Open `logo1.jpeg` in:

- Photoshop
- GIMP (free)
- Preview (Mac)
- Paint.NET (Windows)
- Online tools (Pixlr, Photopea)

Then manually resize and export for each size listed above.

## After Generating Icons

### Android:

1. Replace all files in these folders:

   ```
   android/app/src/main/res/mipmap-mdpi/
   android/app/src/main/res/mipmap-hdpi/
   android/app/src/main/res/mipmap-xhdpi/
   android/app/src/main/res/mipmap-xxhdpi/
   android/app/src/main/res/mipmap-xxxhdpi/
   ```

2. Clean and rebuild:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

### iOS:

1. Replace all files in:

   ```
   ios/RunAnywhereStarter/Images.xcassets/AppIcon.appiconset/
   ```

2. Update the Contents.json file in that folder to reference your new icons

3. Clean and rebuild:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   npm run ios
   ```

## Quick Test Commands

After generating icons:

```bash
# For Android
npm run android

# For iOS
npm run ios
```

## Alternative: Quick Online Services

- **App Icon Generator**: https://www.appicon.co/
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
- **MakeAppIcon**: https://makeappicon.com/
- **Icon Kitchen**: https://icon.kitchen/

Just upload `src/assets/logo1.jpeg` to any of these services and download all sizes at once!
