import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Pressable, useWindowDimensions, Animated } from 'react-native';
import Text from '../components/Text';
import { BlurView } from 'expo-blur';
import Screen from '../components/Screen';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../theme/useTheme';
import AccountCard from '../components/AccountCard';
import Svg, { Circle } from 'react-native-svg';

const BANK_LOGO = require('../../assets/icon.png');

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const user = useFinanceStore((state) => state.user);
  const wallet = useFinanceStore((state) => state.wallet);
  const savings = useFinanceStore((state) => state.savings);
  const [showPodInfo, setShowPodInfo] = useState(false);

  const cardWidth = useMemo(() => Math.min(width - theme.spacing.lg * 2, 360), [width, theme.spacing.lg]);

  const wealthStack = [
    { title: 'Digital Gold', subtitle: 'Real gold, liquid anytime', tint: '#E6B85C' },
    { title: 'Liquid & Overnight Funds', subtitle: 'Safe, daily liquidity', tint: '#5CC6C8' },
    { title: 'FD Sweep', subtitle: 'Auto-park surplus cash', tint: '#8AD07A' },
    { title: 'Government Schemes', subtitle: 'Secure long-term savings', tint: '#CFA55B' },
    { title: 'Insurance Micro-Cover', subtitle: 'Smart fallback protection', tint: '#E6B85C' },
    { title: 'Auto SIP Graduation', subtitle: 'Grow from savings to SIPs', tint: '#8AB3FF' },
    { title: 'Intelligence Layer', subtitle: 'Optimizes automatically', tint: '#7F72E3' },
  ];

  const shimmer = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 0.8, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.4, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const tintBg = (hex: string, opacity: number) => {
    const sanitized = hex.replace('#', '');
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  return (
    <Screen>
      <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
        Welcome back, {user?.name ?? 'Chirantan'}
      </Text>

      <View style={[styles.cardWrap, { width: cardWidth }]}>
        <AccountCard
          width={cardWidth}
          name={user?.name ?? 'Chirantan'}
          network="RuPay"
          logo={BANK_LOGO}
        />
      </View>

      <View style={[styles.walletCardWrap, { width: cardWidth }]}>
        <BlurView intensity={18} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.walletCard, { borderColor: theme.colors.border }]}>
          <Text style={[styles.walletLabel, { color: theme.colors.textSecondary }]}>Digital Savings Wallet</Text>
          <Text style={[styles.walletBalance, { color: theme.colors.accent }]}>
            {formatCurrency(savings)}
          </Text>
          <Text style={[styles.walletSub, { color: theme.colors.muted }]}>
            Auto-saved from your everyday spending
          </Text>
        </BlurView>
      </View>

      <View style={[styles.podWrap, { width: cardWidth }]}>
        <Pressable onPress={() => setShowPodInfo(true)}>
          <BlurView intensity={20} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.podCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.podTitle, { color: theme.colors.textPrimary }]}>Investment Pod</Text>
            <Text style={[styles.podSub, { color: theme.colors.textSecondary }]}>
              Where your savings grow intelligently
            </Text>
            <View style={[styles.podStatus, { backgroundColor: theme.colors.accentSoft }]}>
              <Text style={[styles.podStatusText, { color: theme.colors.accent }]}>Coming Soon</Text>
            </View>
          </BlurView>
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Your Wealth Stack</Text>
      <View style={styles.stackGrid}>
        {wealthStack.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.stackCard,
              {
                borderColor: theme.colors.border,
                backgroundColor: tintBg(item.tint, 0.08),
              },
            ]}
          >
            <Svg style={styles.stackOverlay} width="100%" height="100%">
              <Circle cx="70%" cy="25%" r="26%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
              <Circle cx="70%" cy="25%" r="38%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
              <Circle cx="70%" cy="25%" r="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            </Svg>
            {index === 0 ? (
              <Animated.Text style={[styles.stackEmoji, { opacity: shimmer }]}>🪙</Animated.Text>
            ) : null}
            <Text style={[styles.stackTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.stackSub, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
            <Text style={[styles.stackTag, { color: theme.colors.muted }]}>Coming Soon</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.muted }]}>
          Built on UPI & PPI guidelines - SEBI & IRDAI partner integrations
        </Text>
      </View>

      <Modal visible={showPodInfo} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPodInfo(false)}>
          <View />
        </Pressable>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.surfaceStrong, borderColor: theme.colors.border }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Investment Pod</Text>
          <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
            A dedicated space to grow your savings via gold, funds, FDs, and SIPs - all
            intelligently orchestrated.
          </Text>
          <Text style={[styles.modalTag, { color: theme.colors.accent }]}>Coming Soon</Text>
          <TouchableOpacity style={[styles.modalClose, { backgroundColor: theme.colors.accent }]} onPress={() => setShowPodInfo(false)}>
            <Text style={[styles.modalCloseText, { color: theme.colors.black }]}>Got it</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  greeting: {
    fontSize: 15,
    marginBottom: 14,
  },
  cardWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  walletCardWrap: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  walletCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 0.5,
  },
  walletLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: '600',
  },
  walletSub: {
    fontSize: 12,
    marginTop: 4,
  },
  podWrap: {
    alignSelf: 'center',
    marginBottom: 18,
  },
  podCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 0.5,
  },
  podTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  podSub: {
    marginTop: 6,
    fontSize: 12,
  },
  podStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  podStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  stackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  stackCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 0.5,
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  },
  stackOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  stackEmoji: {
    position: 'absolute',
    right: 10,
    top: 8,
    fontSize: 14,
  },
  stackTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  stackSub: {
    fontSize: 11,
    marginTop: 4,
  },
  stackTag: {
    fontSize: 10,
    marginTop: 8,
  },
  footer: {
    marginTop: 16,
    paddingBottom: 14,
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
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
  modalTag: {
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

export default HomeScreen;
