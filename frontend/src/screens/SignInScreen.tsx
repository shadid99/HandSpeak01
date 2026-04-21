import React, { useState } from 'react';
import { Image } from 'react-native';
import logo from '../../assets/images/logo.png';
import {View, Text, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import {signInWithEmailAndPassword} from "@firebase/auth";
import { auth } from "../services/firebase";
import {Link, router} from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("تنبيه", "يرجى ملء جميع الحقول");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("خطأ", "يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    if (password.length < 6) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert(
          "نجح",
          "تم تسجيل الدخول بنجاح"
      );
      router.replace("/(tabs)");
    } catch (error: any) {
      let message = "فشل تسجيل الدخول";

      if (error.code === "auth/user-not-found") {
        message = "الحساب غير موجود";
      } else if (error.code === "auth/wrong-password") {
        message = "كلمة المرور غير صحيحة";
      } else if (error.code === "auth/invalid-credential") {
        message = "بيانات الدخول غير صحيحة";
      }

      Alert.alert("خطأ", message);
    }
  };

  return (
      <SafeAreaView style={styles.container}>
          <Image source={logo} style={styles.topRightLogo} />

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Lock size={48} color={colors.primary} />
              <Text style={styles.title}>تسجيل الدخول</Text>
              <Text style={styles.subtitle}>
                مرحباً بعودتك 👋
              </Text>
            </View>

            <AppCard>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>البريد الإلكتروني</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                      style={styles.input}
                      placeholder="البريد الإلكتروني"
                      placeholderTextColor={colors.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      textAlign="right"
                  />
                  <Mail size={20} color={colors.textSecondary} />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>كلمة المرور</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                      style={styles.input}
                      placeholder="كلمة المرور"
                      placeholderTextColor={colors.textMuted}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      textAlign="right"
                  />
                  <Lock size={20} color={colors.textSecondary} />
                </View>
              </View>
            </AppCard>

            <PrimaryButton
                title="تسجيل الدخول"
                onPress={handleSignIn}
                style={styles.signInButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ليس لديك حساب؟</Text>
              <View style={styles.dividerLine} />
            </View>
            <PrimaryButton
                title="إنشاء حساب جديد"
                onPress={() => router.push("/sign-up")}
                variant="secondary"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'right',
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    marginRight: spacing.sm,
  },
  signInButton: {
    marginTop: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.body,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  signUpButton: {
    marginBottom: spacing.sm,
  },
  homeButton: {
    marginBottom: spacing.lg,
  },
  infoCard: {
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
    marginBottom: spacing.sm,
    writingDirection: 'rtl',
  },
  infoValue: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: spacing.xs,
  },
  topRightLogo: {
  position: 'absolute',
  top: spacing.md,
  right: spacing.md,
  width: 105,
  height: 155,
  resizeMode: 'contain',
  zIndex: 50,
},

});
