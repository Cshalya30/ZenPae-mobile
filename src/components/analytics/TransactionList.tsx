import { View, StyleSheet } from 'react-native';
import Text from '../Text';
import { colors, spacing, typography } from '../../theme/theme';
import { formatCurrency } from '../../utils/format';

type Transaction = {
  id: string;
  amount: number;
  roundedUpAmount: number;
  timestamp: number;
  merchant?: string;
  vendor?: string;
  category?: string;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent Transactions</Text>

      {transactions.slice(0, 6).map(t => (
        <View key={t.id} style={styles.row}>
          <View>
            <Text style={styles.merchant}>
              {t.vendor ?? t.merchant ?? 'Coffee Shop'}
            </Text>
            <Text style={styles.caption}>{t.category ?? 'Other'}</Text>
          </View>

          <View style={styles.right}>
            <Text style={styles.amount}>{formatCurrency(t.amount)}</Text>
            {t.roundedUpAmount > 0 && (
              <Text style={styles.saved}>
                +{formatCurrency(t.roundedUpAmount)} saved
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 18,
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
    paddingVertical: spacing.sm,
  },
  merchant: {
    ...typography.body,
    fontWeight: '600',
  },
  caption: {
    ...typography.small,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.body,
  },
  saved: {
    ...typography.small,
    color: colors.accent,
  },
});
