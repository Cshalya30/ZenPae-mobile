import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { USER_PROFILE } from '../constants/mockData';

const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ActionButton = ({ title, subtitle, icon }: { title: string; subtitle?: string; icon: string }) => (
  <Pressable style={styles.actionButton}>
    <LinearGradient
      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
      style={styles.actionGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.actionLeft}>
        <Text style={styles.actionIcon}>{icon}</Text>
        <View>
          <Text style={styles.actionTitle}>{title}</Text>
          {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Text style={styles.actionChevron}>›</Text>
    </LinearGradient>
  </Pressable>
);

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#99FF32', '#7DD628']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {USER_PROFILE.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.userName}>{USER_PROFILE.name}</Text>
          <Text style={styles.userEmail}>{USER_PROFILE.email}</Text>
        </View>

        {/* Account Information */}
        <ProfileSection title="Account Details">
          <View style={styles.infoCard}>
            <InfoRow label="Account Number" value={USER_PROFILE.accountNumber} />
            <InfoRow label="Phone Number" value={USER_PROFILE.phone} />
            <InfoRow label="Email Address" value={USER_PROFILE.email} />
          </View>
        </ProfileSection>

        {/* Savings Summary */}
        <ProfileSection title="Savings Summary">
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={['rgba(153,255,50,0.1)', 'rgba(153,255,50,0.05)']}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>This Month</Text>
                  <Text style={styles.summaryValue}>
                    ₹{USER_PROFILE.savingsThisMonth.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Round-Ups</Text>
                  <Text style={styles.summaryValue}>
                    ₹{USER_PROFILE.roundUpsTotal.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ProfileSection>

        {/* Settings & Actions */}
        <ProfileSection title="Settings">
          <ActionButton icon="🔐" title="Security" subtitle="PIN, Biometrics, 2FA" />
          <ActionButton icon="🔔" title="Notifications" subtitle="Manage alerts" />
          <ActionButton icon="🎨" title="Appearance" subtitle="Dark mode enabled" />
          <ActionButton icon="🌐" title="Language & Region" subtitle="English (India)" />
        </ProfileSection>

        {/* Support */}
        <ProfileSection title="Support">
          <ActionButton icon="💬" title="Help Center" />
          <ActionButton icon="📧" title="Contact Support" />
          <ActionButton icon="📄" title="Terms & Privacy" />
        </ProfileSection>

        {/* Logout */}
        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>ZenPae v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  avatarContainer: {
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.background,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
  },
  summaryCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(153,255,50,0.2)',
  },
  summaryGradient: {
    padding: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.zenGreen,
  },
  actionButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  actionGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  actionChevron: {
    fontSize: 28,
    color: COLORS.textTertiary,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  logoutButton: {
    backgroundColor: 'rgba(200,76,76,0.15)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(200,76,76,0.3)',
  },
  logoutText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: '#C84C4C',
  },
  version: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});
