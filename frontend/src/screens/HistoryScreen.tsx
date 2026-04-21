import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, RefreshControl, Image } from 'react-native';
import logo from '../../assets/images/logo.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import {router, useFocusEffect} from 'expo-router';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { PrimaryButton } from '../components/PrimaryButton';
import { HistoryItem as HistoryItemComponent } from '../components/HistoryItem';
import { getHistory, clearHistory, searchHistory } from '../storage/historyStorage';
import { HistoryItem as HistoryItemType } from '../types';
import {History, Search, Trash2, User} from 'lucide-react-native';
import { useAuth } from "../context/AuthContext";

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.uid;

  const loadHistory = async () => {
    try {
      const data = await getHistory(userId);
      setHistory(data);
      setFilteredHistory(data);
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحميل السجل');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
        loadHistory();
      }, [userId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredHistory(history);
      return;
    }

    const results = await searchHistory(query, userId);
    setFilteredHistory(results);
  };

  const handleClearHistory = () => {
    Alert.alert(
        'تأكيد المسح',
        'هل أنت متأكد من حذف السجل بالكامل؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'حذف',
            style: 'destructive',
            onPress: async () => {
              try {
                await clearHistory(userId);
                setHistory([]);
                setFilteredHistory([]);
                setSearchQuery('');
                Alert.alert('نجح', 'تم مسح السجل بنجاح');
              } catch (error) {
                Alert.alert('خطأ', 'فشل مسح السجل');
              }
            },
          },
        ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <History size={64} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>لا يوجد سجل بعد</Text>
      <Text style={styles.emptyText}>
        ابدأ بترجمة الإشارات لرؤية السجل هنا
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جارٍ التحميل...</Text>
        </View>
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
              قم بتسجيل الدخول للوصول إلى المحادثات
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
       <Image source={logo} style={styles.topRightLogo} />
      <View style={styles.header}>
        <History size={32} color={colors.primary} />
        <Text style={styles.title}>السجل</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث في السجل..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          textAlign="right"
        />
      </View>

      {history.length > 0 && (
        <View style={styles.actionsContainer}>
          <PrimaryButton
              title="مسح السجل"
              onPress={handleClearHistory}
              variant="danger"
              style={styles.clearButton}
          />
          <Text style={styles.countText}>
            {filteredHistory.length} من {history.length} نتيجة
          </Text>
        </View>
      )}

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryItemComponent item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginLeft: spacing.sm,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginLeft: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
    writingDirection: 'rtl',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 32,
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
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
topRightLogo: {
  position: 'absolute',
  top: spacing.md,
  right: spacing.md,
  width: 70,
  height: 75,
  resizeMode: 'contain',
  zIndex: 20,
},

});
