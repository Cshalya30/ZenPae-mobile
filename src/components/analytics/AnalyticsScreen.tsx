import { ScrollView, View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import Screen from '../Screen';
import { useFinanceStore, type Category } from '../../store/financeStore';
import { colors, spacing, typography, progress, card } from '../../theme/theme';
import { formatCurrency } from '../../utils/format';

export default function AnalyticsScreen() {
  const { transactions, analytics } = useFinanceStore();

  const categoryTotals = useMemo<Record<Category, number>>(() => {
    const base: Record<Category, number> = {
      Food: 0,
      Groceries: 0,
      Transport: 0,
      Shopping: 0,
      Subscriptions: 0,
      Investments: 0,
      Bills: 0,
      Medicines: 0,
      Emergency: 0,
      Other: 0,
      Custom: 0,
    };

    transactions.forEach((t) => {
      base[t.category] = (base[t.category] || 0) + t.amount;
    });

    return base;
  }, [transactions]);

  const maxValue = Math.max(...Object.values(categoryTotals), 1);

  const recurringTxns = transactions.filter((t) => t.isRecurring);
  const subscriptionTxns = recurringTxns.filter(
    (t) => t.category === 'Subscriptions'
  );
  const investmentTxns = recurringTxns.filter(
    (t) => t.category === 'Investments'
  );

  const subscriptionTotal = subscriptionTxns.reduce((s, t) => s + t.amount, 0);
  const investmentTotal = investmentTxns.reduce((s, t) => s + t.amount, 0);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.snapshot}>
          <Metric label="Spent" value={formatCurrency(analytics.totalSpent)} />
          <Metric label="Saved" value={formatCurrency(analytics.totalSaved)} />
          <Metric label="Avg / txn" value={formatCurrency(analytics.averageSpend)} />
        </View>

        <Text style={styles.sectionTitle}>Where your money goes</Text>

        {Object.entries(categoryTotals)
          .filter(([, value]) => value > 0)
          .map(([category, value]) => (
            <AnimatedBar
              key={category}
              label={category}
              value={value}
              max={maxValue}
            />
          ))}

        <Text style={styles.sectionTitle}>Subscriptions & Investments</Text>

        <View style={styles.podRow}>
          <View style={[styles.podCard, styles.subCard]}>
            <Text style={styles.podLabel}>Subscriptions</Text>
            <Text style={styles.podValue}>{formatCurrency(subscriptionTotal)}</Text>
            <Text style={styles.podMeta}>
              {subscriptionTxns.length} active
            </Text>
          </View>
          <View style={[styles.podCard, styles.investCard]}>
            <Text style={styles.podLabel}>Investments</Text>
            <Text style={styles.podValue}>{formatCurrency(investmentTotal)}</Text>
            <Text style={styles.podMeta}>{investmentTxns.length} active</Text>
          </View>
        </View>

        {recurringTxns.length > 0 ? (
          <View style={styles.recurringList}>
            {recurringTxns.map((t) => (
              <View key={t.id} style={styles.recurringRow}>
                <View style={styles.recurringIcon}>
                  <Text style={styles.recurringIconText}>
                    {getRecurringIcon(t.vendor, t.category)}
                  </Text>
                </View>
                <View style={styles.recurringInfo}>
                  <Text style={styles.recurringVendor}>{t.vendor}</Text>
                  <Text style={styles.recurringMeta}>
                    {t.category} · {t.frequency ?? 'Monthly'}
                  </Text>
                </View>
                <Text style={styles.recurringAmount}>
                  {formatCurrency(t.amount)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {transactions.map((t) => (
          <View key={t.id} style={styles.txn}>
            <View>
              <Text style={styles.vendor}>{t.vendor}</Text>
              <Text style={styles.category}>{t.category}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>{formatCurrency(t.amount)}</Text>
              <Text style={styles.saved}>
                +{formatCurrency(t.roundedUpAmount)} saved
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function AnimatedBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: (value / max) * 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [value, max]);

  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: width.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.barValue}>{formatCurrency(value)}</Text>
    </View>
  );
}

function getRecurringIcon(vendor: string, category: string) {
  const v = vendor.toLowerCase();
  if (v.includes('netflix') || v.includes('prime') || v.includes('hotstar')) return '🎬';
  if (v.includes('spotify') || v.includes('music') || v.includes('gaana')) return '🎵';
  if (v.includes('gym') || v.includes('fit')) return '🏋️';
  if (v.includes('sip') || v.includes('mutual') || v.includes('fund')) return '📈';
  if (v.includes('stock') || v.includes('trading')) return '💹';
  if (v.includes('crypto') || v.includes('coin')) return '🪙';
  if (category === 'Investments') return '📊';
  return '🔁';
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },

  snapshot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  metric: {
    backgroundColor: card.backgroundColor,
    padding: spacing.md,
    borderRadius: card.borderRadius,
    width: '32%',
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
  },

  metricLabel: {
    ...typography.small,
  },

  metricValue: {
    ...typography.sectionTitle,
    marginTop: 6,
  },

  sectionTitle: {
    ...typography.sectionTitle,
    marginVertical: 16,
  },

  barRow: {
    marginBottom: 14,
  },

  barLabel: {
    ...typography.label,
    marginBottom: 6,
  },

  barBg: {
    height: progress.height,
    backgroundColor: progress.track,
    borderRadius: progress.radius,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: progress.radius,
  },

  barValue: {
    ...typography.small,
    marginTop: 6,
  },

  podRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  podCard: {
    flex: 1,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    backgroundColor: card.backgroundColor,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
  },
  subCard: {
    backgroundColor: card.backgroundColor,
  },
  investCard: {
    backgroundColor: card.backgroundColor,
  },
  podLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  podValue: {
    ...typography.sectionTitle,
    color: colors.accent,
    marginTop: 6,
  },
  podMeta: {
    ...typography.small,
    marginTop: 4,
  },

  recurringList: {
    marginBottom: 20,
    gap: 10,
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: card.backgroundColor,
    borderRadius: 14,
    padding: 12,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    boxShadow: card.boxShadow,
  },
  recurringIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recurringIconText: {
    fontSize: 16,
  },
  recurringInfo: {
    flex: 1,
  },
  recurringVendor: {
    ...typography.body,
    fontWeight: '600',
  },
  recurringMeta: {
    ...typography.small,
    marginTop: 2,
  },
  recurringAmount: {
    ...typography.body,
    color: colors.accent,
  },

  txn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: card.backgroundColor,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    boxShadow: card.boxShadow,
  },

  vendor: {
    ...typography.body,
  },

  category: {
    ...typography.small,
  },

  amount: {
    ...typography.body,
    color: colors.textPrimary,
  },

  saved: {
    ...typography.small,
    color: colors.accent,
    marginTop: 2,
  },
});
