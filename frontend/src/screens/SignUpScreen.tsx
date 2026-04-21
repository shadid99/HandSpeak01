import React, { useState } from 'react';

import {View, Text, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform,Image,} from 'react-native';
import logo from '../../assets/images/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Mail, Lock, UserPlus } from 'lucide-react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../services/firebase";
import { User } from 'lucide-react-native';
import { doc, setDoc } from "firebase/firestore";

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمات المرور غير متطابقة");
      return;
    }

    try {
      // 1️⃣ إنشاء المستخدم
      const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
      );
      const user = userCredential.user;

      // 2️⃣ حفظ الاسم في Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date(),
      });


      Alert.alert("نجح", "تم إنشاء الحساب بنجاح");
      router.push("/sign-in");

    } catch (error: any) {
      let message = "حدث خطأ غير متوقع";

      if (error.code === "auth/email-already-in-use") {
        message = "البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === "auth/invalid-email") {
        message = "البريد الإلكتروني غير صالح";
      } else if (error.code === "auth/weak-password") {
        message = "كلمة المرور ضعيفة";
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
              <UserPlus size={48} color={colors.primary} />
              <Text style={styles.title}>إنشاء حساب جديد</Text>
              <Text style={styles.subtitle}>
                انضم إلينا وابدأ بترجمة لغة الإشارات
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

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>الاسم</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                      style={styles.input}
                      placeholder="الاسم الكامل"
                      placeholderTextColor={colors.textMuted}
                      value={name}
                      onChangeText={setName}
                      textAlign="right"
                  />
                  <User size={20} color={colors.textSecondary} />
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

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>تأكيد كلمة المرور</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                      style={styles.input}
                      placeholder="تأكيد كلمة المرور"
                      placeholderTextColor={colors.textMuted}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      textAlign="right"
                  />
                  <Lock size={20} color={colors.textSecondary} />
                </View>
              </View>
            </AppCard>

            <PrimaryButton
                title="إنشاء الحساب"
                onPress={handleSignUp}
                style={styles.signUpButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>لديك حساب؟</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton
                title="تسجيل الدخول"
                onPress={() => router.back()}
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
  signUpButton: {
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
  backButton: {
    marginBottom: spacing.sm,
  },
  homeButton: {
    marginBottom: spacing.lg,
  },
  termsCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    writingDirection: 'rtl',
  },
   topRightLogo: {
  position: 'absolute',
  top: spacing.md,
  right: spacing.md,
  width: 105,
  height: 105,
  resizeMode: 'contain',
  zIndex: 50,
},
});
