import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import logo from '../../assets/images/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { User, Mail } from 'lucide-react-native';
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
        'تسجيل الخروج',
        'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'تسجيل الخروج',
            style: 'destructive',
            onPress: async () => {
              await signOut(auth);
              router.replace('/sign-in');
            },
          },
        ]
    );
  };
  if (loading) {
    return (
        <SafeAreaView style={styles.container}>
          <Text>Loading...</Text>
        </SafeAreaView>
    );
  }

  if (!user) {
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.guestContainer}>
            <User size={48} color={colors.primary} />
            <Text style={styles.guestTitle}>أنت غير مسجّل</Text>
            <Text style={styles.guestSubtitle}>
              قم بتسجيل الدخول للوصول إلى حسابك
            </Text>

            <PrimaryButton
                title="تسجيل الدخول"
                onPress={() => router.push('/sign-in')}
                style={styles.loginButton}
            />
          </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <User size={32} color={colors.primary} />
          <Text style={styles.title}>الحساب</Text>
        </View>

        <AppCard style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
           <Image source={logo} style={styles.logoImage} />
          </View>
        </AppCard>


        <AppCard>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>البريد الإلكتروني</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <Mail size={24} color={colors.primary} />
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>الاسم</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <User size={24} color={colors.primary} />
          </View>
        </AppCard>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>الإجراءات</Text>

          <PrimaryButton
            title="تسجيل الخروج"
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          />
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
  avatarCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  infoValue: {
    ...typography.bodyLarge,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  actionSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
  noteCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },

  guestTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    writingDirection: 'rtl',
  },

  loginButton: {
    minWidth: 200,
    paddingHorizontal: spacing.lg,
  },
avatarImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
  borderRadius: 60,
},

});
