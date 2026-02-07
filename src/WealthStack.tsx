import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { WealthItem } from '../constants/mockData';

interface WealthStackProps {
  items: WealthItem[];
}

const TopographicOverlay = ({ color }: { color: string }) => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    <Circle cx="70%" cy="40%" r="60" stroke={color} strokeWidth="0.5" opacity="0.05" fill="none" />
    <Circle cx="70%" cy="40%" r="50" stroke={color} strokeWidth="0.5" opacity="0.05" fill="none" />
    <Circle cx="70%" cy="40%" r="40" stroke={color} strokeWidth="0.5" opacity="0.05" fill="none" />
    <Circle cx="70%" cy="40%" r="30" stroke={color} strokeWidth="0.5" opacity="0.05" fill="none" />
  </Svg>
);

const WealthStackCard = ({ item }: { item: WealthItem }) => {
  const getGradientColors = (baseColor: string): [string, string] => {
    const gradients: Record<string, [string, string]> = {
      '#FFD700': ['#3D2817', '#1E1E1E'], // Gold
      '#1FA2A6': ['#0B2D30', '#1E1E1E'], // Teal
      '#99FF32': ['#1F3D17', '#1E1E1E'], // Green
      '#FFA726': ['#3D2817', '#1E1E1E'], // Amber
      '#A78BFA': ['#2D1F3D', '#1E1E1E'], // Purple
    };
    return gradients[baseColor] || ['#1E1E1E', '#272B2F'];
  };

  const [startColor, endColor] = getGradientColors(item.color);

  return (
    <LinearGradient
      colors={[startColor, endColor]}
      style={styles.wealthCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TopographicOverlay color={item.color} />
      <View style={styles.wealthCardContent}>
        <View style={styles.wealthCardLeft}>
          <Text style={styles.wealthIcon}>{item.icon}</Text>
          <View>
            <Text style={styles.wealthName}>{item.name}</Text>
            <Text style={styles.wealthAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
          </View>
        </View>
        <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      </View>
    </LinearGradient>
  );
};

export default function WealthStack({ items }: WealthStackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Wealth Stack</Text>
      <View style={styles.stackContainer}>
        {items.map((item) => (
          <WealthStackCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  stackContainer: {
    gap: SPACING.md,
  },
  wealthCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    ...SHADOWS.card,
    overflow: 'hidden',
  },
  wealthCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wealthCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  wealthIcon: {
    fontSize: 28,
  },
  wealthName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  wealthAmount: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
});
