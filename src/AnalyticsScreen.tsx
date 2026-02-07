import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { SPENDING_CATEGORIES, MOCK_SUBSCRIPTIONS } from '../constants/mockData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DonutSegment {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const DonutChart = ({ data }: { data: DonutSegment[] }) => {
  const [animations] = useState(
    data.map(() => new Animated.Value(0))
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const size = 280;
  const strokeWidth = size * 0.24; // 24% of radius
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const centerX = size / 2;
  const centerY = size / 2;

  useEffect(() => {
    Animated.stagger(
      80,
      animations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  let currentAngle = -90;

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size}>
        {/* Outer stroke */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius + strokeWidth / 2}
          stroke="rgba(153,255,50,0.28)"
          strokeWidth={1.5}
          fill="none"
        />

        {/* Inner hole stroke */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius - strokeWidth / 2}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.5}
          fill="#0E130F"
        />

        <G rotation={0} origin={`${centerX}, ${centerY}`}>
          {data.map((segment, index) => {
            const angle = (segment.percentage / 100) * 360;
            const strokeDasharray = `${
              (segment.percentage / 100) * circumference
            } ${circumference}`;
            const rotation = currentAngle;
            currentAngle += angle;

            const animatedStrokeDashoffset = animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [circumference, 0],
            });

            return (
              <AnimatedCircle
                key={index}
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={animatedStrokeDashoffset}
                rotation={rotation}
                origin={`${centerX}, ${centerY}`}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>

      {/* Center total */}
      <View style={styles.chartCenter}>
        <Text style={styles.chartCenterLabel}>Total Spent</Text>
        <Text style={styles.chartCenterAmount}>
          ₹{data.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
};

const SubscriptionCard = ({ subscription }: { subscription: any }) => (
  <View style={styles.subscriptionCard}>
    <LinearGradient
      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
      style={styles.subscriptionGradient}
    >
      <View style={styles.subscriptionLeft}>
        <Text style={styles.subscriptionIcon}>{subscription.icon}</Text>
        <View>
          <Text style={styles.subscriptionName}>{subscription.name}</Text>
          <Text style={styles.subscriptionDate}>Next: {subscription.date}</Text>
        </View>
      </View>
      <Text style={styles.subscriptionAmount}>₹{subscription.amount}</Text>
    </LinearGradient>
  </View>
);

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Analytics</Text>

        {/* Spending Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Breakdown</Text>
          <DonutChart data={SPENDING_CATEGORIES} />
          
          {/* Legend */}
          <View style={styles.legend}>
            {SPENDING_CATEGORIES.map((category, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                <Text style={styles.legendName}>{category.name}</Text>
                <Text style={styles.legendAmount}>₹{category.amount.toLocaleString('en-IN')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscriptions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Subscriptions</Text>
          <View style={styles.subscriptionsContainer}>
            {MOCK_SUBSCRIPTIONS.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </View>
        </View>
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
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartCenterLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  chartCenterAmount: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  legend: {
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendName: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  legendAmount: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  subscriptionsContainer: {
    gap: SPACING.md,
  },
  subscriptionCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    ...SHADOWS.card,
  },
  subscriptionGradient: {
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  subscriptionIcon: {
    fontSize: 28,
  },
  subscriptionName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subscriptionDate: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  subscriptionAmount: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
});
