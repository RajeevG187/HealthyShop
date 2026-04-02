/**
 * OCR Service using Google ML Kit for Text Recognition
 * Replaces Expo dependencies with React Native native modules
 */

import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { OCRResult } from '../types';
import { cleanOCRText, extractIngredients, looksLikeIngredients } from '../utils/textCleaner';

/**
 * OCR Service using Google ML Kit
 * Provides on-device text recognition capabilities
 */
class OCRService {
  private isInitialized = false;

  /**
   * Initialize OCR service
   */
  async initialize(): Promise<void> {
    console.log('OCR Service initialized with ML Kit');
    this.isInitialized = true;
  }

  /**
   * Process image and extract text using ML Kit
   * @param imageUri - URI of the image to process
   */
  async processImage(imageUri: string): Promise<OCRResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('Processing image with ML Kit:', imageUri);

      // Use ML Kit for text recognition
      const result = await TextRecognition.recognize(imageUri);
      const text = result.text;

      if (!text || text.trim().length === 0) {
        return {
          text: '',
          confidence: 0,
          error: 'No text found in image. Please try again with a clearer image.',
        };
      }

      // Calculate average confidence from blocks
      let totalConfidence = 0;
      let blockCount = 0;

      if (result.blocks && result.blocks.length > 0) {
        result.blocks.forEach((block: any) => {
          if (block.confidence !== undefined) {
            totalConfidence += block.confidence;
            blockCount++;
          }
        });
      }

      const averageConfidence = blockCount > 0 ? totalConfidence / blockCount : 0.7;

      // Clean the extracted text
      const cleanedText = cleanOCRText(text);

      // Validate that it looks like ingredients
      if (!looksLikeIngredients(cleanedText)) {
        return {
          text: cleanedText,
          confidence: averageConfidence * 0.5,
          error: 'Text does not appear to be an ingredient list. Please try again.',
        };
      }

      console.log('OCR Success:', {
        textLength: cleanedText.length,
        confidence: averageConfidence,
      });

      return {
        text: cleanedText,
        confidence: averageConfidence,
      };
    } catch (error) {
      console.error('OCR Error:', error);
      return {
        text: '',
        confidence: 0,
        error: error instanceof Error ? error.message : 'OCR processing failed',
      };
    }
  }

  /**
   * Extract ingredients from OCR text
   */
  extractIngredients(ocrText: string): string[] {
    return extractIngredients(ocrText);
  }

  /**
   * Show settings alert when permission is permanently denied
   */
  private showPermissionSettingsAlert(permissionType: string): void {
    Alert.alert(
      `${permissionType} Permission Required`,
      `This app needs ${permissionType.toLowerCase()} access to function properly. Please enable it in Settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  }

  /**
   * Request camera permissions (Android 13+ compatible)
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'HealthyShop needs camera access to scan product ingredients.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          this.showPermissionSettingsAlert('Camera');
          return false;
        }
        return false;
      }
      // iOS permissions are handled via Info.plist
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  /**
   * Request media library permissions (Android 13+ compatible)
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ uses READ_MEDIA_IMAGES
        if (Platform.Version >= 33) {
          // Try to request READ_MEDIA_IMAGES for Android 13+
          try {
            const granted = await PermissionsAndroid.request(
              'android.permission.READ_MEDIA_IMAGES' as any,
              {
                title: 'Photo Gallery Permission',
                message: 'HealthyShop needs access to your photos to select product images.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              return true;
            } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              this.showPermissionSettingsAlert('Photo Gallery');
              return false;
            }
            return false;
          } catch (e) {
            console.warn('READ_MEDIA_IMAGES not available, falling back to READ_EXTERNAL_STORAGE');
            // Fallback for compatibility
          }
        }

        // Android 12 and below OR fallback - use READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Photo Gallery Permission',
            message: 'HealthyShop needs access to your photos to select product images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          this.showPermissionSettingsAlert('Photo Gallery');
          return false;
        }
        return false;
      }
      // iOS permissions are handled via Info.plist
      return true;
    } catch (error) {
      console.error('Media library permission error:', error);
      return false;
    }
  }

  /**
   * Handle image picker response
   */
  private handleImagePickerResponse(response: ImagePickerResponse): string | null {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return null;
    }

    if (response.errorCode) {
      console.error('Image picker error:', response.errorCode, response.errorMessage);

      // Handle specific error cases
      if (response.errorCode === 'camera_unavailable') {
        Alert.alert('Camera Unavailable', 'Your device does not have a camera.');
      } else if (response.errorCode === 'permission') {
        Alert.alert(
          'Permission Denied',
          'Camera or gallery permission was denied. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert('Error', response.errorMessage || 'Failed to access camera/gallery');
      }
      return null;
    }

    if (!response.assets || response.assets.length === 0) {
      Alert.alert('Error', 'No image was selected');
      return null;
    }

    const imageUri = response.assets[0].uri;
    if (!imageUri) {
      Alert.alert('Error', 'Invalid image');
      return null;
    }

    return imageUri;
  }

  /**
   * Take photo with camera
   */
  async takePhoto(): Promise<string | null> {
    try {
      // Request permission first
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        console.log('Camera permission denied');
        return null;
      }

      console.log('Launching camera...');
      const response = await launchCamera({
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
        saveToPhotos: false,
        cameraType: 'back',
      });

      return this.handleImagePickerResponse(response);
    } catch (error) {
      console.error('Take photo error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
      return null;
    }
  }

  /**
   * Pick image from gallery
   */
  async pickImage(): Promise<string | null> {
    try {
      // Request permission first
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        console.log('Gallery permission denied');
        return null;
      }

      console.log('Launching image library...');
      const response = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
        selectionLimit: 1,
      });

      return this.handleImagePickerResponse(response);
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
      return null;
    }
  }
}

// Export singleton instance
export const ocrService = new OCRService();

/**
 * NOTES:
 *
 * This implementation uses:
 * - react-native-image-picker for camera/gallery access
 * - @react-native-ml-kit/text-recognition for on-device OCR
 *
 * Both libraries provide:
 * - Cross-platform support (iOS & Android)
 * - On-device processing (no cloud API needed)
 * - Good accuracy for printed text
 * - Privacy-friendly (no data leaves device)
 *
 * Android 13+ Support:
 * - Uses READ_MEDIA_IMAGES for gallery access
 * - Falls back to READ_EXTERNAL_STORAGE for older versions
 * - Proper permission denied handling with Settings redirect
 *
 * iOS Setup:
 * Add to Info.plist:
 * - NSCameraUsageDescription
 * - NSPhotoLibraryUsageDescription
 *
 * Android Setup:
 * Add to AndroidManifest.xml:
 * - <uses-permission android:name="android.permission.CAMERA"/>
 * - <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
 * - <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/> (Android 13+)
 */
