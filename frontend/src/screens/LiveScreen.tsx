import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, ScrollView, Image } from 'react-native';
import logo from '../../assets/images/logo.png';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';

import { translateImage } from '../services/translationService';
import { saveHistoryItem } from '../storage/historyStorage';
import { config } from '../config';
import { Video } from 'lucide-react-native';
import { useAuth } from "@/src/context/AuthContext";

export default function LiveScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const [lastArabicResult, setLastArabicResult] = useState<string>('');
  const [lastImageUrl, setLastImageUrl] = useState<string>('');
  const [lastConfidence, setLastConfidence] = useState<number>(0);
  const [status, setStatus] = useState<string>('متوقف');
  const cameraRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const captureAndTranslate = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      if (photo && photo.uri) {
        const result = await translateImage(photo.uri);

        // 🔄 حفظ النتائج باللغة العربية والصورة المرجعية
        setLastResult(result.label);
        setLastArabicResult(result.label_arabic || result.label);
        setLastImageUrl(result.image_url ? ${config.BASE_URL}${result.image_url} : '');
        setLastConfidence(result.confidence);

        await saveHistoryItem(
            result.label_arabic || result.label,
            result.confidence,
            user?.uid
        );
      }
    } catch (error: any) {
      console.error('Capture error:', error);
      if (isTranslating) {
        Alert.alert('خطأ', error.message || 'فشلت عملية الترجمة');
        stopTranslation();
      }
    }
  };

  const startTranslation = async () => {
    if (!user){
      Alert.alert(
          "خطأ",
          "قم بتسجيل الدخول للترجمة"
      );
      return;
    }
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('تنبيه', 'يجب منح صلاحية الكاميرا لاستخدام الترجمة المباشرة');
        return;
      }
    }

    setIsTranslating(true);
    setStatus('جارٍ الترجمة...');
    setLastResult('');
    setLastArabicResult('');
    setLastImageUrl('');
    setLastConfidence(0);

    intervalRef.current = setInterval(() => {
      captureAndTranslate();
    }, config.CAPTURE_INTERVAL);
  };

  const stopTranslation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTranslating(false);
    setStatus('متوقف');
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جارٍ التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.topRightLogo} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Video size={32} color={colors.primary} />
          <Text style={styles.title}>الترجمة المباشرة</Text>
        </View>

        <AppCard style={styles.cameraCard}>
          {permission.granted ? (
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back"
              />
            </View>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                نحتاج إلى إذن الكاميرا لبدء الترجمة
              </Text>
              <PrimaryButton
                title="منح الصلاحية"
                onPress={requestPermission}
                style={styles.permissionButton}
              />
            </View>
          )}
        </AppCard>

        <AppCard>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isTranslating ? colors.success : colors.error },
              ]}
            />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </AppCard>

        {lastArabicResult ? (
          <AppCard style={styles.resultCard}>
            <Text style={styles.resultLabel}>النتيجة:</Text>
            
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{lastArabicResult}</Text>
              {lastImageUrl ? (
                <Image 
                  source={{ uri: lastImageUrl }} 
                  style={styles.refImage} 
                  resizeMode="contain" 
                />
              ) : null}
            </View>

            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>الدقة:</Text>
              <Text style={styles.confidenceValue}>
                {Math.round(lastConfidence * 100)}%
              </Text>
            </View>
          </AppCard>
        ) : null}

        <PrimaryButton
          title={isTranslating ? 'إيقاف الترجمة' : 'ابدأ الترجمة'}
          onPress={isTranslating ? stopTranslation : startTranslation}
          variant={isTranslating ? 'danger' : 'primary'}
          style={styles.mainButton}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            سيتم التقاط الصور كل {config.CAPTURE_INTERVAL}ms
          </Text>
          <Text style={styles.infoText}>
            تأكد من توجيه الكاميرا نحو الإشارة
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginLeft: spacing.sm,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  cameraCard: {
    padding: 0,
    overflow: 'hidden',
  },
  cameraContainer: {
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  permissionText: {
    ...typography.bodyLarge,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
    writingDirection: 'rtl',
  },
  permissionButton: {
    width: '80%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  statusText: {
    ...typography.bodyLarge,
    color: colors.text,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: spacing.xs,
  },
  resultLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  resultContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  resultText: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  refImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: spacing.sm,
    borderRadius: 8,
  },
  confidenceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  confidenceValue: {
    ...typography.bodyLarge,
    color: colors.primary,
    fontWeight: '700',
  },
  mainButton: {
    marginTop: spacing.md,
  },
  infoCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.xs,
    writingDirection: 'rtl',
  },
  topRightLogo: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 75,
    height: 75,
    resizeMode: 'contain',
    zIndex: 50,
  },
});
