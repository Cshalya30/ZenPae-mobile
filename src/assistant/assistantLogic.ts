import { Transaction } from '../store/financeStore';

/* ---------- Types ---------- */

export type AssistantInsight = {
  id: string;
  type: 'positive' | 'warning' | 'info';
  title: string;
  message: string;
};

export type UserIntent =
  | 'IMPROVE_SAVINGS'
  | 'UNDERSTAND_SPENDING'
  | 'REDUCE_SPENDING'
  | 'GENERAL_ADVICE'
  | 'INVALID';

/* ---------- Intent Classification ---------- */

export function classifyIntent(question: string): UserIntent {
  const q = question.toLowerCase().trim();

  if (q.length < 3) return 'INVALID';

  if (q.includes('save')) return 'IMPROVE_SAVINGS';
  if (q.includes('spend')) return 'UNDERSTAND_SPENDING';
  if (q.includes('reduce')) return 'REDUCE_SPENDING';

  return 'GENERAL_ADVICE';
}

/* ---------- Deterministic Data Answers ---------- */

export function answerFromData(
  intent: UserIntent,
  transactions: Transaction[]
): string | null {
  if (transactions.length === 0) return null;

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalSaved = transactions.reduce((s, t) => s + t.roundedUpAmount, 0);
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  switch (intent) {
    case 'IMPROVE_SAVINGS':
      return `You've saved \u20B9${totalSaved} so far. Cutting frequent small spends in ${topCategory?.[0] ?? 'a top category'} can grow this faster.`;

    case 'UNDERSTAND_SPENDING':
      return `Your total spending is \u20B9${totalSpent}. ${topCategory ? `Most spend is in ${topCategory[0]}. ` : ''}Review category-wise spend weekly to spot leaks early.`;

    case 'REDUCE_SPENDING':
      return 'Reducing one high-frequency category can noticeably slow spending without affecting lifestyle.';

    default:
      return null;
  }
}

/* ---------- AI Context Builder ---------- */

export function summarizeFinanceData(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return 'No transactions yet.';
  }

  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const totalSaved = transactions.reduce((s, t) => s + t.roundedUpAmount, 0);

  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    categoryTotals[t.category] =
      (categoryTotals[t.category] || 0) + t.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return `
Total spent: \u20B9${totalSpent}
Total saved via round-ups: \u20B9${totalSaved}
Top spending category: ${topCategory?.[0]} (\u20B9${topCategory?.[1]})
Transactions count: ${transactions.length}
`;
}

/* ---------- Pace-based Nudges ---------- */

export function generateInsights(
  transactions: Transaction[]
): AssistantInsight[] {
  if (transactions.length === 0) return [];

  const totalSaved = transactions.reduce(
    (sum, t) => sum + t.roundedUpAmount,
    0
  );

  const days = Math.max(
    1,
    Math.ceil(
      (Date.now() - transactions[0].timestamp) /
        (1000 * 60 * 60 * 24)
    )
  );

  const expectedSaved = days * 5; // \u20B95/day baseline
  const delta = totalSaved - expectedSaved;

  if (delta > 20) {
    return [
      {
        id: 'pace-positive',
        type: 'positive',
        title: 'Great momentum',
        message: 'You are saving faster than usual. Keep this pace - it compounds quietly.',
      },
    ];
  }

  if (delta < -20) {
    return [
      {
        id: 'pace-warning',
        type: 'warning',
        title: 'Slight slowdown',
        message: 'Savings dipped below your usual pace. One low-spend day can rebalance this.',
      },
    ];
  }

  return [
    {
      id: 'pace-neutral',
      type: 'info',
      title: 'Steady progress',
      message: 'You are saving at a stable pace. Consistency matters more than spikes.',
    },
  ];
}
