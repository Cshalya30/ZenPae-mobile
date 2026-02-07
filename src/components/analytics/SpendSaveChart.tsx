import { View, StyleSheet } from 'react-native';
import Text from '../Text';
import { spacing, colors, typography } from '../../theme/theme';
import { Transaction } from '../../store/financeStore';
import { formatCurrency } from '../../utils/format';

type Props = {
  transactions: Transaction[];
};

export default function SpendSaveChart({ transactions }: Props) {
  if (transactions.length < 2) return null;

  const daily: Record<string, { spend: number; save: number }> = {};

  transactions.forEach(t => {
    const day = new Date(t.timestamp).toDateString();
    if (!daily[day]) daily[day] = { spend: 0, save: 0 };
    daily[day].spend += t.amount;
    daily[day].save += t.roundedUpAmount;
  });

  const days = Object.keys(daily).slice(0, 5).reverse();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Spend vs Save</Text>

      {days.map(d => (
        <View key={d} style={styles.row}>
          <Text style={styles.day}>{d.split(' ')[0]}</Text>
          <Text style={styles.spend}>{formatCurrency(daily[d].spend)}</Text>
          <Text style={styles.save}>
            +{formatCurrency(daily[d].save)}
          </Text>
        </View>
      ))}

      <Text style={styles.insight}>
        You are saving consistently even on high-spend days.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
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
  day: {
    ...typography.small,
  },
  spend: {
    ...typography.body,
  },
  save: {
    ...typography.body,
    color: colors.accent,
  },
  insight: {
    ...typography.small,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
