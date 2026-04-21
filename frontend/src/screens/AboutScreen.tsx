import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image } from 'react-native';
import logo from '../../assets/images/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { AppCard } from '../components/AppCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { config } from '../config';
import { Info, Mail, Globe, Heart } from 'lucide-react-native';

export default function AboutScreen() {
  const handleContact = () => {
    Linking.openURL('mailto:support@example.com');
  };

  const handleWebsite = () => {
    Linking.openURL('https://example.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Info size={32} color={colors.primary} />
          <Text style={styles.title}>من نحن</Text>
        </View>

        <AppCard style={styles.logoCard}>
          <View style={styles.logoContainer}>
            <Image
  source={logo}
  style={styles.logo}
/>
            <Text style={styles.appName}>مترجم لغة الإشارات</Text>
          </View>
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>عن التطبيق</Text>
          <Text style={styles.descriptionText}>
         
         نحن طلبة الجامعة الامريكية قمنا بابتكار تطبيق لترجمة لغة الاشارة
             يستخدم تقنيات الذكاء الاصطناعي
            لترجمة لغة الإشارات إلى نص مكتوب في الوقت الفعلي، مما يساعد على
            تسهيل التواصل وكسر حواجز اللغة.
          </Text>
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>المميزات</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              ترجمة فورية للغة الإشارات باستخدام الكاميرا
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              حفظ السجل التاريخي للترجمات
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              واجهة سهلة الاستخدام باللغة العربية
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              دقة عالية في التعرف على الإشارات
            </Text>
          </View>
        </AppCard>

        <AppCard>
          <View style={styles.versionRow}>
            <Text style={styles.versionValue}>v{config.APP_VERSION}</Text>
            <Text style={styles.versionLabel}>الإصدار:</Text>
          </View>
        </AppCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            صُنع بـ <Heart size={14} color={colors.error} /> في العالم العربي
          </Text>
          <Text style={styles.copyrightText}>
            جميع الحقوق محفوظة © 2024
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
  logoCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  featureBullet: {
    ...typography.bodyLarge,
    color: colors.primary,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  featureText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  versionValue: {
    ...typography.bodyLarge,
    color: colors.primary,
    fontWeight: '600',
  },
  actionSection: {
    marginTop: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyrightText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  logo: {
  width: 80,
  height: 80,
  resizeMode: 'contain',
  marginBottom: spacing.sm,
},

});
