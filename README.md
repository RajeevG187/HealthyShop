# HealthyShop - Smart Ingredient Analysis App

[![React Native](https://img.shields.io/badge/React%20Native-0.83.1-61DAFB)](https://reactnative.dev)
[![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-green)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A privacy-first mobile application that helps users make healthier food choices by analyzing ingredient labels using **on-device AI** and **optical character recognition (OCR)**. Simply scan a product label, and HealthyShop instantly identifies harmful ingredients, calculates health scores, and provides nutritional insights—all without sending data to external servers.

![HealthyShop Demo](https://via.placeholder.com/800x400?text=HealthyShop+App+Demo)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running on iOS](#running-on-ios)
  - [Running on Android](#running-on-android)
- [How It Works](#-how-it-works)
- [App Architecture](#-app-architecture)
- [File Structure](#-file-structure)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Privacy & Security](#-privacy--security)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality

- **📸 Smart Image Capture**
  - Take photos using device camera
  - Select images from gallery
  - 360° image rotation for proper alignment
  - Real-time image preview

- **🔍 Optical Character Recognition (OCR)**
  - On-device text extraction using Google ML Kit
  - Works offline after initial setup
  - Confidence scoring for accuracy assessment
  - Supports multiple label formats

- **🤖 Dual Analysis System**
  - **AI-Powered Analysis** (Primary)
    - Uses SmolLM2 360M model for contextual understanding
    - LLM-based ingredient extraction from OCR text
    - Automatic OCR error correction
    - Advanced nutrient estimation
  - **Rule-Based Analysis** (Fallback)
    - Comprehensive ingredient database (100+ harmful ingredients)
    - Severity-weighted health scoring
    - Pattern-based nutrient estimation
    - Always available, works offline

- **💊 Health Insights**
  - Health rating (0-10 scale)
  - Category classification (Healthy/Moderate/Unhealthy)
  - Detailed nutrient breakdown (protein, fats, carbs, sugar, sodium, calories)
  - Harmful ingredient flags with severity levels
  - Personalized recommendations

- **📊 Comprehensive Database**
  - 100+ harmful ingredients tracked
  - E-codes and aliases recognized
  - Severity classifications (High/Medium/Low)
  - Health descriptions for each ingredient
  - Beneficial ingredients database

---

## 🛠 Technology Stack

### Mobile Framework

- **React Native 0.83.1** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation** - Screen navigation and routing
- **Zustand** - Lightweight state management

### AI & Machine Learning

- **RunAnywhere SDK (@runanywhere/core)** - On-device AI infrastructure
  - `@runanywhere/llamacpp` - LLM backend for SmolLM2 model
  - Version: ^0.18.1
- **SmolLM2 360M Q8_0** - Compact language model (~500MB)
  - On-device text generation and analysis
  - Intelligent ingredient extraction
  - Context-aware health assessments

### Computer Vision

- **Google ML Kit Text Recognition** - OCR engine
  - Package: `@react-native-ml-kit/text-recognition` (v2.0.0)
  - On-device text extraction
  - Multi-language support
  - High accuracy with confidence scoring

### Image Handling

- **React Native Image Picker** (v8.2.1)
  - Camera integration
  - Gallery access
  - Android 13+ permission handling
  - Cross-platform compatibility

### UI Components & Styling

- **React Native Gesture Handler** (v2.30.0) - Touch interactions
- **React Native Linear Gradient** (v2.8.3) - Visual effects
- **React Native Safe Area Context** (v5.6.2) - Screen safe areas

### Utilities

- **React Native FS** (v2.20.0) - File system operations
- **React Native Nitro Modules** (v0.31.10) - Native module bridge

---

## 📁 Project Structure

```
HealthyShop/
├── android/                          # Android native code
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml   # App permissions & config
│   │   │   ├── res/
│   │   │   │   └── xml/
│   │   │   │       └── network_security_config.xml
│   │   │   └── java/                 # Java/Kotlin native code
│   │   └── build.gradle              # Android build configuration
│   └── build.gradle                   # Root build configuration
│
├── ios/                               # iOS native code
│   ├── Podfile                       # CocoaPods dependencies
│   ├── HealthyShop.xcodeproj/        # Xcode project
│   └── HealthyShop/
│       ├── Info.plist                # iOS permissions & config
│       └── AppDelegate.mm            # iOS app lifecycle
│
├── src/                              # Source code
│   ├── App.tsx                       # Root application component
│   │
│   ├── navigation/                   # Navigation configuration
│   │   └── AppNavigator.tsx          # Stack navigator setup
│   │
│   ├── screens/                      # Screen components
│   │   ├── CameraScreen.tsx          # Image capture & preview
│   │   ├── AnalysisScreen.tsx        # OCR results & extraction
│   │   └── ResultScreen.tsx          # Final health analysis display
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── HealthScoreCard.tsx       # Health rating display
│   │   ├── NutrientsList.tsx         # Nutrient breakdown
│   │   └── LoadingOverlay.tsx        # Loading indicators
│   │
│   ├── services/                     # Business logic & APIs
│   │   ├── ocrService.ts             # OCR & image processing
│   │   ├── llmService.ts             # AI analysis service
│   │   └── modelService.ts           # AI model management
│   │
│   ├── utils/                        # Utility functions
│   │   ├── ingredientDatabase.ts     # Harmful ingredients DB
│   │   ├── ingredientExtraction.ts   # LLM extraction logic
│   │   ├── textCleaner.ts            # Text processing utilities
│   │   └── ruleBasedScoring.ts       # Fallback analysis
│   │
│   ├── store/                        # State management
│   │   └── appStore.ts               # Zustand global state
│   │
│   ├── constants/                    # App constants
│   │   └── theme.ts                  # Colors, typography, spacing
│   │
│   └── types/                        # TypeScript definitions
│       └── index.ts                  # Shared type definitions
│
├── node_modules/                     # NPM dependencies
├── package.json                      # Project metadata & scripts
├── tsconfig.json                     # TypeScript configuration
├── babel.config.js                   # Babel transpiler config
├── metro.config.js                   # Metro bundler config
├── react-native.config.js            # React Native config
│
├── README.md                         # This file
├── FIXES_APPLIED.md                  # Recent bug fixes documentation
├── MODEL_LOADING_GUIDE.md            # Model troubleshooting guide
└── .gitignore                        # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

#### For All Platforms:

- **Node.js** 18 or higher ([Download](https://nodejs.org))
- **npm** or **yarn** (comes with Node.js)
- **React Native CLI** development environment
  - Follow the [React Native Environment Setup Guide](https://reactnative.dev/docs/environment-setup)
  - Choose "React Native CLI Quickstart" (NOT Expo)

#### For iOS Development (macOS only):

- **macOS** Ventura or later
- **Xcode** 14+ ([Mac App Store](https://apps.apple.com/us/app/xcode/id497799835))
- **CocoaPods** ([Installation Guide](https://cocoapods.org))
  ```bash
  sudo gem install cocoapods
  ```
- **iOS Simulator** or physical iOS device

#### For Android Development:

- **Android Studio** ([Download](https://developer.android.com/studio))
- **JDK 17+** (bundled with Android Studio)
- **Android SDK 36** (compileSdk)
- **Build Tools 36.0.0**
- **NDK 27.1.12297006**
  - Install via: Android Studio → Settings → SDK Manager → SDK Tools tab
  - Check "Show Package Details" → expand "NDK (Side by side)"
  - Select version **27.1.12297006** → Apply
- **Android Emulator** or physical Android device

#### Device Recommendations:

- **Physical devices strongly recommended** for AI model performance
- Emulators/simulators may run very slowly
- Minimum 2GB RAM for device
- Minimum 1GB free storage for AI models

---

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/RajeevG187/HealthyShop.git
cd HealthyShop
```

#### 2. Install Dependencies

```bash
npm install
```

This will automatically:

- Install all npm packages
- Run `patch-package` to apply necessary patches
- Set up project dependencies

---

### Running on iOS

#### Step 1: Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

> **Important:** Always run `pod install` after installing new packages or updating dependencies.

#### Step 2: Start Metro Bundler

Open a terminal window and run:

```bash
npm start
```

Wait for the message: `✅ Dev server ready`

#### Step 3: Build and Run

Open a **second terminal window** and run:

```bash
npm run ios
```

**Alternative: Run in Xcode**

1. Open `ios/HealthyShop.xcworkspace` in Xcode (NOT .xcodeproj)
2. Select your target device or simulator
3. Click the ▶️ Run button (or press Cmd+R)

#### iOS Permissions

The app requires camera and photo library access. Permissions are configured in `ios/HealthyShop/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>HealthyShop needs camera access to scan product ingredient labels</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>HealthyShop needs photo library access to select product images</string>
```

---

### Running on Android

#### Step 1: Verify Android Environment

```bash
# Check ANDROID_HOME environment variable
echo $ANDROID_HOME
# Should output: /Users/<username>/Library/Android/sdk (macOS)
# Or: C:\Users\<username>\AppData\Local\Android\Sdk (Windows)

# Verify ADB is available
adb --version

# Check NDK installation
ls $ANDROID_HOME/ndk/
# Should list: 27.1.12297006
```

#### Step 2: Start Metro Bundler

Open a terminal window and run:

```bash
npm start
```

Wait for the message: `✅ Dev server ready`

#### Step 3: Build and Run

Open a **second terminal window** and run:

```bash
npm run android
```

> **Note:** First build takes 5-10 minutes as it compiles native C++ code. Subsequent builds are much faster (~1-2 minutes).

**Alternative: Run in Android Studio**

1. Open the `android/` folder in Android Studio
2. Wait for Gradle sync to complete
3. Select your device/emulator
4. Click the ▶️ Run button

#### Running on Physical Android Device

1. **Enable Developer Options** on your device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options → Enable "USB Debugging"

2. **Connect via USB** and verify:

   ```bash
   adb devices
   # Should show your device
   ```

3. **Set up port forwarding** (required for Metro):

   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

4. **Run the app:**
   ```bash
   npm start
   # In another terminal:
   npm run android
   ```

> **Tip:** If you see "Could not connect to development server", run the `adb reverse` command again.

#### Android Permissions

Required permissions are configured in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<uses-feature android:name="android.hardware.camera" android:required="false" />
```

---

## 🔄 How It Works

### Complete User Flow

```
1. 📸 CAPTURE
   User takes photo or selects from gallery
   ↓

2. 🔄 ROTATE (Optional)
   User rotates image for proper orientation
   ↓

3. 🔍 OCR EXTRACTION
   Google ML Kit extracts text from image
   ↓

4. 🤖 INGREDIENT EXTRACTION
   ├─ Try: LLM-based extraction (if model loaded)
   │  • Intelligently identifies ingredient section
   │  • Removes nutrition facts, allergens, etc.
   │  • Fixes OCR errors (O→0, l→I, etc.)
   │  • Returns clean JSON array
   │  └─ Success? → Continue
   │
   └─ Fallback: Rule-based extraction
      • Multiple regex patterns
      • Aggressive delimiter splitting
      • Filters non-ingredients
      → Continue
   ↓

5. 💊 HEALTH ANALYSIS
   ├─ Try: AI-powered analysis (if model loaded)
   │  • Context-aware assessment
   │  • Advanced nutrient estimation
   │  • Detailed health insights
   │  └─ Success? → Display Results
   │
   └─ Fallback: Rule-based analysis
      • Ingredient database matching (100+ harmful ingredients)
      • Severity-weighted scoring
      • Heuristic nutrient estimation
      → Display Results
   ↓

6. 📊 RESULTS
   • Health score (0-10)
   • Category (Healthy/Moderate/Unhealthy)
   • Nutrient breakdown
   • Harmful ingredient flags
   • Recommendations
```

### Dual Analysis Architecture

HealthyShop uses a **dual-mode system** for maximum reliability:

#### Primary Mode: AI-Powered (Optional)

- **When Available:** After SmolLM2 model downloads (~500MB, first time only)
- **Benefits:**
  - Intelligent ingredient extraction
  - Automatic OCR error correction
  - Context-aware health assessment
  - Nuanced ingredient interactions

#### Fallback Mode: Rule-Based (Always Available)

- **When Used:** If AI model unavailable or fails
- **Benefits:**
  - No download required
  - Works completely offline
  - Fast and reliable
  - Comprehensive ingredient database
  - Proven accuracy

**Users get a great experience regardless of which mode is active.**

---

## 🏗 App Architecture

### Technology Layers

```
┌─────────────────────────────────────────┐
│           UI Layer (React Native)        │
│  • Screens (Camera, Analysis, Results)  │
│  • Components (Cards, Lists, Overlays)  │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         State Management (Zustand)       │
│  • Global app state                      │
│  • OCR results                           │
│  • Analysis results                      │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│           Services Layer                 │
│  ┌─────────────────────────────────┐   │
│  │  OCR Service                     │   │
│  │  • Image picker                  │   │
│  │  • Camera integration            │   │
│  │  • ML Kit text recognition       │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  LLM Service                     │   │
│  │  • AI model interaction          │   │
│  │  • Ingredient analysis           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Model Service                   │   │
│  │  • RunAnywhere SDK               │   │
│  │  • Model download/loading        │   │
│  └─────────────────────────────────┘   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│           Utilities Layer                │
│  • Ingredient extraction                 │
│  • Text cleaning & parsing               │
│  • Rule-based scoring                    │
│  • Ingredient database                   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Native Layer                     │
│  • Android Java/Kotlin                   │
│  • iOS Objective-C/Swift                 │
│  • ML Kit native modules                 │
│  • RunAnywhere native modules            │
└──────────────────────────────────────────┘
```

---

## 📂 File Structure

### Core Application Files

#### `/src/App.tsx`

- Root application component
- Wraps navigation with gesture handlers
- Sets up status bar styling

#### `/src/navigation/AppNavigator.tsx`

- React Navigation stack configuration
- Defines app routes: Camera → Analysis → Result
- Handles screen transitions

### Screen Components

#### `/src/screens/CameraScreen.tsx`

**Purpose:** Image capture and preview

**Features:**

- Camera integration via `react-native-image-picker`
- Gallery image selection
- 360° image rotation
- Image preview
- Model initialization (silent, non-blocking)

**Key Functions:**

- `handleTakePhoto()` - Opens camera
- `handlePickImage()` - Opens gallery
- `handleRotateImage()` - Rotates image 90°
- `handleAnalyze()` - Starts OCR processing

#### `/src/screens/AnalysisScreen.tsx`

**Purpose:** OCR results and ingredient extraction

**Features:**

- Displays raw OCR text
- Shows OCR confidence score
- Extracts ingredients using LLM or fallback
- Lists extracted ingredients
- Initiates health analysis

**Key Functions:**

- `analyzeIngredients()` - Orchestrates extraction and analysis

#### `/src/screens/ResultScreen.tsx`

**Purpose:** Final health analysis display

**Features:**

- Health score visualization
- Nutrient breakdown cards
- Harmful ingredient flags
- Detailed ingredient list
- Recommendations based on category
- "Scan another product" action

### Services

#### `/src/services/ocrService.ts`

**Purpose:** OCR and image handling

**Key Features:**

- Camera permission handling (Android 13+ compatible)
- Gallery permission handling
- ML Kit text recognition integration
- Text validation and confidence scoring

**Key Methods:**

- `takePhoto()` - Launches camera
- `pickImage()` - Launches gallery
- `processImage(uri)` - Extracts text from image
- `extractIngredients(text)` - Parses ingredients from text

**Dependencies:**

- `@react-native-ml-kit/text-recognition`
- `react-native-image-picker`

#### `/src/services/llmService.ts`

**Purpose:** AI-powered ingredient analysis

**Key Features:**

- RunAnywhere SDK integration
- SmolLM2 model inference
- Structured JSON output parsing
- Confidence scoring

**Key Methods:**

- `analyzeIngredients(ingredients)` - Returns AnalysisResult
- Fallback to rule-based analysis on error

**Model Configuration:**

- Model: SmolLM2 360M Q8_0
- Temperature: 0.3 (deterministic)
- Max tokens: 500

#### `/src/services/modelService.ts`

**Purpose:** AI model lifecycle management

**Key Features:**

- RunAnywhere SDK initialization
- Model registration and download
- Silent, non-blocking operation
- Progress tracking

**Key Methods:**

- `initialize(onProgress)` - Sets up SDK and downloads model
- `isModelReady()` - Checks model status
- `unloadModel()` - Frees memory

### Utilities

#### `/src/utils/ingredientExtraction.ts`

**Purpose:** LLM-powered ingredient extraction

**Key Features:**

- Uses LLM to extract clean ingredient lists from OCR text
- Removes nutrition facts, allergens, brand names
- Fixes OCR errors automatically
- Falls back to rule-based extraction

**Key Functions:**

- `extractIngredientsWithLLM(ocrText)` - Primary extraction method
- `cleanIngredientList(ingredients)` - Validation and cleaning

#### `/src/utils/textCleaner.ts`

**Purpose:** Text processing and cleaning

**Key Features:**

- Multiple extraction strategies
- Pattern matching for ingredient sections
- Delimiter-based parsing
- OCR error correction (basic)

**Key Functions:**

- `extractIngredients(text)` - Fallback extraction
- `cleanOCRText(text)` - Normalizes text
- `looksLikeIngredients(text)` - Validation

#### `/src/utils/ingredientDatabase.ts`

**Purpose:** Comprehensive harmful ingredient database

**Contains:**

- 100+ harmful ingredients
- Severity levels (high/medium/low)
- E-codes and aliases
- Health descriptions
- Healthy ingredients list

**Key Data:**

- `HARMFUL_INGREDIENTS` - Array of harmful ingredients
- `HEALTHY_INGREDIENTS` - Array of beneficial ingredients
- `PROCESSING_INDICATORS` - Keywords indicating processing

**Key Functions:**

- `checkIngredient(name)` - Finds matching harmful ingredient
- `findHarmfulIngredients(list)` - Scans entire list
- `isHealthyIngredient(name)` - Checks if beneficial
- `isHighlyProcessed(name)` - Checks processing level

#### `/src/utils/ruleBasedScoring.ts`

**Purpose:** Fallback health analysis system

**Key Features:**

- Severity-weighted scoring (0-10)
- Nutrient estimation heuristics
- Health category classification
- Human-readable summaries

**Key Functions:**

- `ruleBasedAnalysis(ingredients)` - Returns AnalysisResult
- `estimateNutrients(ingredients)` - Nutrient breakdown
- `quickScore(ingredients)` - Fast scoring

### State Management

#### `/src/store/appStore.ts`

**Purpose:** Zustand global state

**State Properties:**

- `capturedImage` - Image URI
- `ocrResult` - OCR output with confidence
- `analysisResult` - Health analysis data
- `isProcessingOCR` - OCR loading state
- `isAnalyzing` - Analysis loading state
- `isModelLoaded` - AI model status
- `modelLoadingProgress` - 0-1 progress
- `error` - Error messages

### Components

#### `/src/components/HealthScoreCard.tsx`

Visual display of health rating with color-coded progress bar

#### `/src/components/NutrientsList.tsx`

Displays 6 nutrient categories with color-coded values

#### `/src/components/LoadingOverlay.tsx`

Full-screen loading indicator with optional progress bar

### Constants & Types

#### `/src/constants/theme.ts`

- Color palette
- Typography styles
- Spacing scale
- Border radius values
- Shadow styles

#### `/src/types/index.ts`

TypeScript type definitions for:

- `AnalysisResult` - Health analysis structure
- `OCRResult` - OCR output structure
- `HarmfulIngredient` - Ingredient data structure
- Navigation types

---

## ⚙️ Configuration

### Environment Variables

No environment variables required. All processing happens on-device.

### Model Configuration

Edit `/src/services/modelService.ts` to change AI model:

```typescript
const MODEL_ID = 'smollm2-360m-q8_0';

// Change to different model:
await LlamaCPP.addModel({
  id: 'your-model-id',
  name: 'Your Model Name',
  url: 'https://huggingface.co/path/to/model.gguf',
  memoryRequirement: 500_000_000, // bytes
});
```

### Ingredient Database

Edit `/src/utils/ingredientDatabase.ts` to add/modify ingredients:

```typescript
export const HARMFUL_INGREDIENTS: HarmfulIngredient[] = [
  {
    name: 'Your Ingredient',
    aliases: ['alias1', 'alias2', 'E123'],
    severity: 'high', // 'high' | 'medium' | 'low'
    description: 'Health concerns...',
  },
  // ... more ingredients
];
```

### Theme Customization

Edit `/src/constants/theme.ts`:

```typescript
export const Colors = {
  primary: '#10B981', // Main brand color
  background: '#FFFFFF', // App background
  text: '#1F2937', // Primary text
  // ... more colors
};
```

---

## 🐛 Troubleshooting

### Common Issues

#### "Could not connect to development server" (Android)

**Cause:** Physical Android devices can't reach `localhost:8081`

**Solution:**

```bash
adb reverse tcp:8081 tcp:8081
```

#### "No ingredients extracted" Error

**Causes:**

- Blurry or low-quality image
- Poor lighting
- Text not horizontal (use rotate button)
- No ingredient list visible

**Solutions:**

1. Use the rotate button (🔄) to align text
2. Take clearer photo with better lighting
3. Ensure ingredient list is visible in frame
4. Try with a different product

#### App Crashes on Startup

**Solutions:**

```bash
# Clear caches
cd android && ./gradlew clean && cd ..
rm -rf node_modules
npm install

# For iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

#### Model Download Fails

**Causes:**

- Poor network connection
- Insufficient storage

**Solutions:**

1. Check WiFi connection
2. Verify 1GB+ free storage
3. Restart app to retry
4. App works without model (uses rule-based analysis)

#### Android Build Errors

```bash
# Check NDK installation
ls $ANDROID_HOME/ndk/
# Should show: 27.1.12297006

# Reinstall if missing
sdkmanager "ndk;27.1.12297006"
```

#### iOS Build Errors

```bash
# Re-install pods
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..

# Clean Xcode build
# Open project in Xcode
# Product → Clean Build Folder (Shift+Cmd+K)
```

#### Permissions Not Working

**Android:**

- Go to Settings → Apps → HealthyShop → Permissions
- Enable Camera and Storage

**iOS:**

- Go to Settings → HealthyShop
- Enable Camera and Photos

### Debug Mode

Enable detailed logging in development:

1. Check Metro bundler terminal for logs
2. Use React Native Debugger
3. Check device logs:

   ```bash
   # Android
   adb logcat | grep "HealthyShop"

   # iOS
   # Use Xcode console
   ```

---

## 🔒 Privacy & Security

### On-Device Processing

**All AI processing happens locally on your device:**

✅ **No data sent to servers**

- OCR text stays on device
- Ingredient analysis runs locally
- No cloud API calls

✅ **No account required**

- No sign-up or login
- No personal data collected

✅ **Offline capable**

- Works without internet after model download
- All features available offline

### Data Storage

- Images: Temporary storage only, deleted after analysis
- Model files: Cached locally (~500MB)
- No persistent data storage

### Permissions

**Android:**

- `CAMERA` - To capture product labels
- `READ_MEDIA_IMAGES` - To select images from gallery
- `INTERNET` - Only for initial model download

**iOS:**

- Camera - To capture product labels
- Photo Library - To select images from gallery

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add TypeScript types for new code
- Test on both iOS and Android
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/yourusername/HealthyShop/issues)
- **Documentation:** See `FIXES_APPLIED.md` and `MODEL_LOADING_GUIDE.md`
- **Questions:** Open a GitHub Discussion

---

## 🎯 Roadmap

### Planned Features

- [ ] Barcode scanning for product lookup
- [ ] Product history and favorites
- [ ] Personalized dietary preferences
- [ ] Multi-language support
- [ ] Alternative product suggestions
- [ ] Export analysis reports

---

## 🏆 Acknowledgments

### Technologies

- [React Native](https://reactnative.dev) - Mobile framework
- [RunAnywhere SDK](https://runanywhere.ai) - On-device AI
- [Google ML Kit](https://developers.google.com/ml-kit) - OCR
- [React Navigation](https://reactnavigation.org) - Navigation
- [Zustand](https://github.com/pmndrs/zustand) - State management

### Models

- [SmolLM2 360M](https://huggingface.co/prithivMLmods/SmolLM2-360M-GGUF) - Language model
- Google ML Kit Text Recognition - OCR engine

### Community

Special thanks to all contributors and the open-source community!

---

**Made with ❤️ for healthier food choices**

_Version 1.0.0_
