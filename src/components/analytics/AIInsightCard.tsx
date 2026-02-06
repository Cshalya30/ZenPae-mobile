import { View, Text, StyleSheet } from 'react-native';
import { spacing, colors, typography, card } from '../../theme/theme';
import { Transaction } from '../../store/financeStore';

type Props = {
  transactions: Transaction[];
};

export default function AIInsightCard({ transactions }: Props) {
  const lateFood = transactions.filter(
    t => t.category === 'Food' && new Date(t.timestamp).getHours() >= 21
  ).length;

  if (lateFood < 3) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.insight}>
        You tend to spend more on food after 9 PM. Skipping 2 late orders a week could save ~\u20B91,200/month.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: card.backgroundColor,
    padding: card.padding,
    borderRadius: card.borderRadius,
    marginBottom: spacing.xl,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
  },
  insight: {
    ...typography.body,
    lineHeight: 22,
  },
});
