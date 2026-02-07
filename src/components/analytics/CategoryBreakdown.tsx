import { View, StyleSheet } from 'react-native';
import Text from '../Text';
import { spacing, colors, typography, card } from '../../theme/theme';
import { Transaction } from '../../store/financeStore';
import { formatCurrency } from '../../utils/format';

type Props = {
  transactions: Transaction[];
};

const CATEGORIES: Transaction['category'][] = [
  'Food',
  'Groceries',
  'Transport',
  'Shopping',
  'Bills',
  'Subscriptions',
  'Investments',
  'Medicines',
  'Emergency',
  'Other',
];

export default function CategoryBreakdown({ transactions }: Props) {
  const totals = CATEGORIES.map((cat) => ({
    cat,
    amount: transactions
      .filter((t) => t.category === cat)
      .reduce((s, t) => s + t.amount, 0),
  }));

  const totalSpent = totals.reduce((s, c) => s + c.amount, 0);

  return (
    <View style={styles.cardBox}>
      <Text style={styles.title}>Where your money goes</Text>

      {totals.map(({ cat, amount }) => {
        if (amount === 0) return null;
        const pct = Math.round((amount / totalSpent) * 100);

        return (
          <View key={cat} style={styles.row}>
            <Text style={styles.cat}>{cat}</Text>
            <Text style={styles.amount}>
              {formatCurrency(amount)} ? {pct}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    backgroundColor: colors.surface,
    padding: card.padding ?? 16,
    borderRadius: card.borderRadius,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.small,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cat: {
    color: colors.textPrimary,
  },
  amount: {
    color: colors.textSecondary,
  },
});
