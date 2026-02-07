import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface AccountCardProps {
  balance: number;
  accountNumber: string;
  userName: string;
}

export default function AccountCard({ balance, accountNumber, userName }: AccountCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const heightAnim = useState(new Animated.Value(0))[0];

  const handlePress = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: newExpanded ? 1.02 : 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(heightAnim, {
        toValue: newExpanded ? 1 : 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  const extraHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            height: Animated.add(200, extraHeight),
          },
        ]}
      >
        {/* Subtle geometric overlay */}
        <View style={styles.overlayPattern} />
        
        {/* Main card content */}
        <View style={styles.content}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Z</Text>
            </View>
            <Text style={styles.bankName}>ZenPae Bank</Text>
          </View>

          {/* Account Number */}
          <View style={styles.middleSection}>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
          </View>

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <Text style={styles.userName}>{userName}</Text>
            <View style={styles.networkBadge}>
              <Text style={styles.networkText}>MASTERCARD</Text>
            </View>
          </View>

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View style={[styles.expandedContent, { opacity: heightAnim }]}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: '#272B2F',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    ...SHADOWS.elevated,
  },
  overlayPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: 'transparent',
  },
  content: {
    padding: SPACING.xl,
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.zenGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.background,
  },
  bankName: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  accountNumber: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
  },
  networkBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BORDER_RADIUS.sm,
  },
  networkText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  expandedContent: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderDark,
  },
  balanceRow: {
    gap: SPACING.xs,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  balanceAmount: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.zenGreen,
  },
});
