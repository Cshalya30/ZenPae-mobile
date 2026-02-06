import { View, Text, StyleSheet } from 'react-native';
import { spacing, colors, typography } from '../../theme/theme';
import { Transaction } from '../../store/financeStore';
import { formatCurrency } from '../../utils/format';

type Props = {
  transactions: Transaction[];
};

export default function SnapshotSection({ transactions }: Props) {
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalSaved = transactions.reduce((s, t) => s + t.roundedUpAmount, 0);

  const days =
    new Set(transactions.map(t => new Date(t.timestamp).toDateString())).size ||
    1;

  const avgSpend = Math.round(totalSpent / days);

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.label}>Spent</Text>
        <Text style={styles.value}>{formatCurrency(totalSpent)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Saved</Text>
        <Text style={styles.value}>{formatCurrency(totalSaved)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Avg / day</Text>
        <Text style={styles.value}>{formatCurrency(avgSpend)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 14,
    width: '31%',
  },
  label: {
    ...typography.small,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  value: {
    ...typography.sectionTitle,
  },
});
