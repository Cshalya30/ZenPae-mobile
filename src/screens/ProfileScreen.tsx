import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Modal, Pressable, Animated } from 'react-native';
import Text from '../components/Text';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../theme/useTheme';

const PROFILE_IMAGE = require('../../assets/icon.png');

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { user, wallet, analytics, setThemeMode } = useFinanceStore();
  const [showCustomInfo, setShowCustomInfo] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const profileCards = [
    { title: 'Spending Personality', subtitle: 'Understand how you spend and save' },
    { title: 'Financial Health Score', subtitle: 'A simple score based on habits' },
    { title: 'Risk Profile', subtitle: 'How conservative or aggressive you are' },
    { title: 'Goal Preferences', subtitle: 'How you prioritise savings goals' },
    { title: 'Device & Fraud Protection', subtitle: 'Extra safeguards for your account' },
  ];

  const settings = ['Privacy & security', 'Payment methods', 'Notifications', 'App preferences'];

  return (
    <Screen>
      <Animated.View style={{ opacity: fade }}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Profile</Text>

        <BlurView intensity={20} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.faceCard, { borderColor: theme.colors.border }]}>
          <LinearGradient
            colors={['rgba(153,255,50,0.1)', 'rgba(153,255,50,0.0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.faceGradient}
          />
          <View style={styles.faceRow}>
            <View style={styles.avatarWrap}>
              <Image source={PROFILE_IMAGE} style={styles.avatar} />
              <View style={styles.avatarGrid} />
            </View>
            <View style={styles.faceInfo}>
              <Text style={[styles.faceName, { color: theme.colors.textPrimary }]}>{user.name}</Text>
              <Text style={[styles.faceMeta, { color: theme.colors.textSecondary }]}>
                ZenPae ID - UPI Ready
              </Text>
            </View>
            <LinearGradient
              colors={['rgba(153,255,50,0.12)', 'rgba(153,255,50,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statusBadge}
            >
              <Text style={[styles.statusText, { color: theme.colors.accent }]}>Premium</Text>
            </LinearGradient>
          </View>

          <View style={styles.faceDetails}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Phone</Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{user.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>UPI ID</Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{user.upi}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Linked bank</Text>
              <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>ZenPae ****45</Text>
            </View>
          </View>
        </BlurView>

        <View style={styles.snapshotRow}>
          {[
            { label: 'Wallet', value: formatCurrency(wallet), highlight: true },
            { label: 'Saved this month', value: formatCurrency(user.monthlySavings), highlight: false },
            { label: 'Total spent', value: formatCurrency(analytics.totalSpent), highlight: false },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.snapshotCard,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  opacity: pressed ? 0.96 : 1,
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(153,255,50,0.08)', 'rgba(153,255,50,0.0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.snapshotGlow}
              />
              <Text style={[styles.snapshotLabel, { color: theme.colors.textSecondary }]}>{item.label}</Text>
              <Text
                style={[
                  styles.snapshotValue,
                  { color: item.highlight ? theme.colors.accent : theme.colors.textPrimary },
                ]}
              >
                {item.value}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Theme mode</Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themePill, { borderColor: theme.colors.border }]}
              onPress={() => setThemeMode('dark')}
            >
              <Text style={[styles.themeText, { color: theme.colors.textPrimary }]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themePill, { borderColor: theme.colors.border }]}
              onPress={() => setThemeMode('light')}
            >
              <Text style={[styles.themeText, { color: theme.colors.textPrimary }]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themePill, { borderColor: theme.colors.border }]}
              onPress={() => {
                setThemeMode('custom');
                setShowCustomInfo(true);
              }}
            >
              <Text style={[styles.themeText, { color: theme.colors.textPrimary }]}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Your ZenPae Profile</Text>
        <View style={styles.featureGrid}>
          {profileCards.map((card) => (
            <Pressable
              key={card.title}
              style={({ pressed }) => [
                styles.featureCard,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  opacity: pressed ? 0.96 : 1,
                },
              ]}
            >
              <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>{card.title}</Text>
              <Text style={[styles.featureSubtitle, { color: theme.colors.textSecondary }]}>{card.subtitle}</Text>
              <View style={styles.comingSoonRow}>
                <View style={styles.comingDot} />
                <Text style={[styles.featureTag, { color: theme.colors.muted }]}>Coming Soon</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Settings & controls</Text>
        <View style={styles.settingsList}>
          {settings.map((item) => (
            <Pressable
              key={item}
              style={({ pressed }) => [
                styles.settingRow,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  opacity: pressed ? 0.96 : 1,
                },
              ]}
            >
              <Text style={[styles.settingText, { color: theme.colors.textPrimary }]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={[styles.logoutText, { color: theme.colors.muted }]}>Logout</Text>
        </TouchableOpacity>

        <Modal visible={showCustomInfo} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowCustomInfo(false)}>
            <View />
          </Pressable>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surfaceStrong, borderColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Custom theme</Text>
            <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
              In this mode the user can customise the theme and design the app to their comfort.
            </Text>
            <Text style={[styles.modalSoon, { color: theme.colors.accent }]}>Coming Soon</Text>
            <TouchableOpacity style={[styles.modalClose, { backgroundColor: theme.colors.accent }]} onPress={() => setShowCustomInfo(false)}>
              <Text style={[styles.modalCloseText, { color: theme.colors.black }]}>Got it</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 14,
  },
  faceCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 0.5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  faceGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  faceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  avatarGrid: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  faceInfo: {
    flex: 1,
  },
  faceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  faceMeta: {
    marginTop: 4,
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  faceDetails: {
    marginTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  snapshotRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  snapshotCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  snapshotGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  snapshotLabel: {
    fontSize: 11,
  },
  snapshotValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themePill: {
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureGrid: {
    gap: 10,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  featureSubtitle: {
    marginTop: 4,
    fontSize: 12,
  },
  featureTag: {
    marginTop: 8,
    fontSize: 10,
  },
  comingSoonRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  comingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(153,255,50,0.6)',
  },
  settingsList: {
    gap: 8,
    marginBottom: 16,
  },
  settingRow: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 0.5,
  },
  settingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '35%',
    borderRadius: 18,
    padding: 18,
    borderWidth: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  modalSoon: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;
