import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, spacing, typography, card } from '../theme/theme';
import Screen from '../components/Screen';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/format';

export const ProfileScreen: React.FC = () => {
  const user = useFinanceStore((state) => state.user);
  const resetDemo = useFinanceStore((state) => state.resetDemo);

  if (!user) {
    return (
      <Screen>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.screenTitle}>Profile</Text>

      <View style={styles.profileHero}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarCircle}>
              <Text style={styles.initials}>{user.initials || 'C'}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name || 'Chirantan'}</Text>
            <Text style={styles.userTag}>Zenpae ID · UPI Ready</Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>Premium</Text>
          </View>
        </View>

        <View style={styles.profileMeta}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Phone</Text>
            <Text style={styles.metaValue}>{user.phone || 'N/A'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>UPI ID</Text>
            <Text style={styles.metaValue}>{user.upi || 'not.linked@upi'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.walletStrip}>
        <Text style={styles.walletLabel}>Wallet Balance</Text>
        <Text style={styles.walletAmount}>
          {formatCurrency(user.balance || 0)}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>
            {formatCurrency(user.totalSpent || 0)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Saved This Month</Text>
          <Text style={styles.statValue}>
            {formatCurrency(user.monthlySavings || 0)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.settingsItem}>
        <Text style={styles.settingLabel}>Privacy Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingsItem}>
        <Text style={styles.settingLabel}>Payment Methods</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() =>
          Alert.alert(
            'Reset All Data',
            'This will clear all saved data on this device.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', style: 'destructive', onPress: resetDemo },
            ]
          )
        }
      >
        <Text style={styles.resetText}>Reset Everything</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  } as any,
  profileHero: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
    marginBottom: spacing.lg,
  } as any,
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  } as any,
  avatarRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  } as any,
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  } as any,
  initials: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  } as any,
  profileInfo: {
    flex: 1,
  } as any,
  userName: {
    ...typography.sectionTitle,
  } as any,
  userTag: {
    ...typography.small,
    marginTop: spacing.xs,
  } as any,
  statusChip: {
    backgroundColor: 'rgba(153,255,50,0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: spacing.sm,
  } as any,
  statusText: {
    ...typography.small,
    color: colors.accent,
    fontWeight: '600',
  } as any,
  profileMeta: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  } as any,
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as any,
  metaLabel: {
    ...typography.label,
  } as any,
  metaValue: {
    ...typography.bodySecondary,
    color: colors.textPrimary,
  } as any,
  walletStrip: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
    marginBottom: spacing.md,
  } as any,
  walletLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  } as any,
  walletAmount: {
    ...typography.balance,
  } as any,
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  } as any,
  statCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
    marginBottom: spacing.md,
    flex: 0.48,
  } as any,
  statLabel: {
    ...typography.label,
  } as any,
  statValue: {
    ...typography.body,
    marginTop: spacing.sm,
  } as any,
  settingsItem: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    boxShadow: card.boxShadow,
  } as any,
  settingLabel: {
    ...typography.body,
  } as any,
  logoutButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  } as any,
  logoutText: {
    ...typography.bodySecondary,
    color: colors.accent,
    marginBottom: spacing.sm,
  } as any,
  resetButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  } as any,
  resetText: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
    textAlign: 'center',
  } as any,
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  } as any,
});

export default ProfileScreen;
