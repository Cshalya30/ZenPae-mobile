import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { DreamBuy as DreamBuyType } from '../constants/mockData';

interface DreamBuyProps {
  dreamBuy: DreamBuyType;
  onUpdateProgress: (amount: number) => void;
}

const EmeraldGridPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 10 }).map((_, i) => (
      <Line
        key={`v${i}`}
        x1={i * 30}
        y1="0"
        x2={i * 30}
        y2="100%"
        stroke="white"
        strokeWidth="1"
        opacity="0.07"
      />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <Line
        key={`h${i}`}
        x1="0"
        y1={i * 40}
        x2="100%"
        y2={i * 40}
        stroke="white"
        strokeWidth="1"
        opacity="0.07"
      />
    ))}
  </Svg>
);

const BlueIsometricPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 15 }).map((_, i) => (
      <Line
        key={i}
        x1={i * 25}
        y1="0"
        x2={i * 25 + 100}
        y2="100%"
        stroke="white"
        strokeWidth="1"
        opacity="0.06"
      />
    ))}
  </Svg>
);

const TopographicPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    <Circle cx="65%" cy="45%" r="80" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="65" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="50" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="35" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="20" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
  </Svg>
);

const TabContent = ({ tab, dreamBuy }: { tab: number; dreamBuy: DreamBuyType }) => {
  const patterns = [
    <EmeraldGridPattern key="emerald" />,
    <BlueIsometricPattern key="blue" />,
    <TopographicPattern key="topo" />,
  ];

  const gradients: [string, string][] = [
    ['#0F3D2E', '#99FF32'],
    ['#0B1C2D', '#1FA2A6'],
    ['#FF8A00', '#6EE7B7'],
  ];

  const titles = ['Round-Up Savings', 'Auto-Invest', 'Goal Timeline'];
  const descriptions = [
    'Every purchase rounds up to save for your dream',
    'Smart allocation based on spending patterns',
    'Projected completion in 8 months',
  ];

  return (
    <LinearGradient
      colors={gradients[tab]}
      style={styles.tabContentCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {patterns[tab]}
      <View style={styles.tabContentInner}>
        <Text style={styles.tabTitle}>{titles[tab]}</Text>
        <Text style={styles.tabDescription}>{descriptions[tab]}</Text>
        <View style={styles.tabStats}>
          <View>
            <Text style={styles.tabStatLabel}>Saved</Text>
            <Text style={styles.tabStatValue}>₹{dreamBuy.currentAmount.toLocaleString('en-IN')}</Text>
          </View>
          <View>
            <Text style={styles.tabStatLabel}>Target</Text>
            <Text style={styles.tabStatValue}>₹{dreamBuy.targetAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default function DreamBuy({ dreamBuy, onUpdateProgress }: DreamBuyProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  const progress = (dreamBuy.currentAmount / dreamBuy.targetAmount) * 100;
  const remaining = dreamBuy.targetAmount - dreamBuy.currentAmount;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dream Buy</Text>
      
      {/* Main Card */}
      <View style={styles.dreamCard}>
        <Text style={styles.dreamName}>{dreamBuy.name}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>{progress.toFixed(1)}% complete</Text>
            <Text style={styles.progressText}>₹{remaining.toLocaleString('en-IN')} to go</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {[0, 1, 2].map((index) => (
            <Pressable
              key={index}
              onPress={() => setActiveTab(index)}
              style={[styles.tab, activeTab === index && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
                {['Round-Up', 'Auto-Invest', 'Timeline'][index]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <TabContent tab={activeTab} dreamBuy={dreamBuy} />
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
  dreamCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    ...SHADOWS.card,
  },
  dreamName: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(153,255,50,0.6)',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  tabActive: {
    backgroundColor: 'rgba(153,255,50,0.15)',
    borderColor: 'rgba(153,255,50,0.3)',
  },
  tabText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tabTextActive: {
    color: COLORS.zenGreen,
  },
  tabContentCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 150,
    overflow: 'hidden',
  },
  tabContentInner: {
    gap: SPACING.md,
  },
  tabTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  tabDescription: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  tabStats: {
    flexDirection: 'row',
    gap: SPACING.xxl,
    marginTop: SPACING.sm,
  },
  tabStatLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  tabStatValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
});
