import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, card, button } from '../theme/theme';
import Screen from '../components/Screen';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/format';

export const HomeScreen: React.FC = () => {
  const wallet = useFinanceStore((state) => state.wallet);
  const savings = useFinanceStore((state) => state.savings);
  const user = useFinanceStore((state) => state.user);
  const navigation = useNavigation();

  const handlePayPress = () => {
    navigation.navigate('Pay' as never);
  };

  const handleRequestPress = () => {
    Alert.alert('Request Money', 'Coming soon - we will add UPI request flows.');
  };

  const handleScanPress = () => {
    Alert.alert('Scan & Pay', 'Camera scan will be available shortly.');
  };

  return (
    <Screen>
      <Text style={styles.title}>Wallet</Text>
      <View style={[styles.cardShell, styles.walletCard]}>
        <Text style={styles.walletLabel}>Available Balance</Text>
        <Text style={[styles.balance]}>{formatCurrency(wallet)}</Text>
        <Text style={styles.lastUpdated}>Updated just now</Text>
      </View>

      <View style={[styles.cardShell, styles.savingsCard]}>
        <Text style={styles.savingsLabel}>Savings Pot</Text>
        <Text style={[styles.balance]}>{formatCurrency(savings)}</Text>
        <Text style={styles.savingsSubtext}>Keep growing your savings</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>
            {formatCurrency(user?.totalSpent ?? 0)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Saved This Month</Text>
          <Text style={styles.statValue}>
            {formatCurrency(user?.monthlySavings ?? 0)}
          </Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={handlePayPress}
          >
            <View style={styles.actionIconWrap}>
              <Text style={styles.actionIcon}>₹</Text>
            </View>
            <Text style={styles.actionLabel}>Pay</Text>
            <Text style={styles.actionSub}>UPI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={handleRequestPress}
          >
            <View style={styles.actionIconWrap}>
              <Text style={styles.actionIcon}>⤴</Text>
            </View>
            <Text style={styles.actionLabel}>Request</Text>
            <Text style={styles.actionSub}>Collect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.85}
            onPress={handleScanPress}
          >
            <View style={styles.actionIconWrap}>
              <Text style={styles.actionIcon}>◧</Text>
            </View>
            <Text style={styles.actionLabel}>Scan</Text>
            <Text style={styles.actionSub}>QR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={button.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButtonGradient}
        >
          <Text style={styles.payButtonText}>Pay</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = {
  title: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  } as any,
  cardShell: {
    backgroundColor: card.backgroundColor,
    padding: card.padding,
    borderRadius: card.borderRadius,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
  } as any,
  walletCard: {
    marginBottom: spacing.md,
  } as any,
  walletLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  } as any,
  balance: {
    ...typography.balance,
  } as any,
  lastUpdated: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  } as any,
  savingsCard: {
    marginBottom: spacing.md,
  } as any,
  savingsLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  } as any,
  savingsSubtext: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  } as any,
  payButton: {
    height: button.height,
    borderRadius: button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    shadowColor: button.shadowColor,
    shadowOpacity: button.shadowOpacity,
    shadowRadius: button.shadowRadius,
    shadowOffset: button.shadowOffset,
    elevation: button.elevation,
    boxShadow: button.boxShadow,
  } as any,
  payButtonGradient: {
    height: '100%',
    width: '100%',
    borderRadius: button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  payButtonText: {
    ...typography.button,
    color: button.color,
  } as any,
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  } as any,
  statCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    padding: spacing.md,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
    flex: 0.48,
  } as any,
  statLabel: {
    ...typography.label,
  } as any,
  statValue: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  } as any,
  quickActions: {
    marginBottom: spacing.lg,
  } as any,
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  } as any,
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  } as any,
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: card.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
  } as any,
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  } as any,
  actionIcon: {
    fontSize: 16,
    color: colors.accent,
  } as any,
  actionLabel: {
    ...typography.body,
  } as any,
  actionSub: {
    ...typography.small,
    marginTop: 2,
  } as any,
};

export default HomeScreen;
