# Quick Commands for Rebranding

## Step 1: Generate App Icons (Choose one method)

### Method A: Online Generator (EASIEST - 5 minutes)

1. Go to: https://www.appicon.co/
2. Upload: `src/assets/logo1.jpeg`
3. Click "Generate"
4. Download the ZIP
5. Extract and copy files to the folders shown in `ICON_GENERATION_GUIDE.md`

### Method B: Use Script (If you have ImageMagick)

```bash
./generate-icons.sh
```

### Method C: Manual (Use any image editor)

See `ICON_GENERATION_GUIDE.md` for size requirements

---

## Step 2: Clean Build Folders

```bash
# Android
cd android
./gradlew clean
cd ..

# iOS
cd ios
rm -rf Pods Podfile.lock build
pod install
cd ..
```

---

## Step 3: Rebuild the App

### For Android:

```bash
# Start Metro (in one terminal)
npm start

# In another terminal:
npm run android
```

### For iOS:

```bash
# Start Metro (in one terminal)
npm start

# In another terminal:
npm run ios
```

---

## If Icons Don't Update

Sometimes icons are cached. Uninstall and reinstall:

### Android:

```bash
adb uninstall com.healthyshop
npm run android
```

### iOS:

```bash
# Delete the app from your simulator/device manually
npm run ios
```

---

## Complete One-Liner (After generating icons)

```bash
cd android && ./gradlew clean && cd .. && cd ios && rm -rf Pods Podfile.lock build && pod install && cd .. && npm run android
```

---

## What's Been Changed

✅ **App Name**: "HealthyShop" (both Android & iOS)
✅ **Package ID**: `com.healthyshop` (Android)
✅ **Bundle ID**: `com.healthyshop` (iOS)
✅ **Camera Screen**: Now shows your logo instead of emoji

🔄 **App Icons**: Generate using one of the methods above, then rebuild
