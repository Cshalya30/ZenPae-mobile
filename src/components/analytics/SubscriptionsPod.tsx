import { View, StyleSheet, Animated } from 'react-native';
import Text from '../Text';
import { useEffect, useRef } from 'react';
import { colors, spacing, typography } from '../../theme/theme';
import { formatCurrency } from '../../utils/format';

type Txn = {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  isRecurring: boolean;
  frequency?: 'Weekly' | 'Monthly' | 'Yearly';
};

export default function SubscriptionsPod({ transactions }: { transactions: Txn[] }) {
  const recurring = transactions.filter((t) => t.isRecurring);
  if (recurring.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Subscriptions & Investments</Text>
      {recurring.map((t, i) => (
        <RecurringCard key={t.id} txn={t} index={i} />
      ))}
    </View>
  );
}

function RecurringCard({ txn, index }: { txn: Txn; index: number }) {
  const slide = useRef(new Animated.Value(20)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, slide, fade]);

  const isInvestment = txn.category.toLowerCase().includes('invest');
  const icon = getIcon(txn.vendor, txn.category);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderLeftColor: isInvestment ? colors.accent : colors.accent,
          transform: [{ translateY: slide }],
          opacity: fade,
        },
      ]}
    >
      <View>
        <Text style={styles.vendor}>{icon} {txn.vendor}</Text>
        <Text style={styles.meta}>
          {isInvestment ? 'Investment' : 'Subscription'} \u00B7 {txn.frequency ?? 'Monthly'}
        </Text>
      </View>

      <Text style={[styles.amount, { color: colors.accent }]}>
        {formatCurrency(txn.amount)}/mo
      </Text>
    </Animated.View>
  );
}

function getIcon(vendor: string, category: string) {
  const v = vendor.toLowerCase();
  if (v.includes('netflix') || v.includes('prime') || v.includes('hotstar')) return '🎬';
  if (v.includes('spotify') || v.includes('music') || v.includes('gaana')) return '🎵';
  if (v.includes('gym') || v.includes('fit')) return '🏋️';
  if (v.includes('sip') || v.includes('mutual') || v.includes('fund')) return '📈';
  if (v.includes('stock') || v.includes('trading')) return '💹';
  if (v.includes('crypto') || v.includes('coin')) return '🪙';
  if (category.toLowerCase().includes('invest')) return '📊';
  return '🔁';
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 28,
  },
  title: {
    ...typography.sectionTitle,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  vendor: {
    ...typography.body,
    fontWeight: '600',
  },
  meta: {
    ...typography.small,
    marginTop: 4,
  },
  amount: {
    ...typography.sectionTitle,
    fontWeight: '600',
  },
});
