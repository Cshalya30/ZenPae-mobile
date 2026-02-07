import { Transaction, type Analytics, type UserProfile } from '../store/financeStore';

/* ---------- Types ---------- */

export type NudgeCondition =
  | 'Very Chill'
  | 'Chill'
  | 'Neutral'
  | 'Mild Concern'
  | 'Concerning'
  | 'Critical';

export type AssistantInsight = {
  id: string;
  condition: NudgeCondition;
  confidence: number;
  accentColor: string;
  messageTitle: string;
  messageBody: string;
  cta: string[];
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
      return `You've saved ₹${totalSaved} so far. Cutting frequent small spends in ${topCategory?.[0] ?? 'a top category'} can grow this faster.`;

    case 'UNDERSTAND_SPENDING':
      return `Your total spending is ₹${totalSpent}. ${topCategory ? `Most spend is in ${topCategory[0]}. ` : ''}Review category-wise spend weekly to spot leaks early.`;

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
Total spent: ₹${totalSpent}
Total saved via round-ups: ₹${totalSaved}
Top spending category: ${topCategory?.[0]} (₹${topCategory?.[1]})
Transactions count: ${transactions.length}
`;
}

/* ---------- Nudge System ---------- */

export function mapConditionToAccent(condition: NudgeCondition): string {
  switch (condition) {
    case 'Very Chill':
      return '#6EE7B7';
    case 'Chill':
      return '#99FF32';
    case 'Neutral':
      return '#B6E35C';
    case 'Mild Concern':
      return '#E6B85C';
    case 'Concerning':
      return '#E07A5F';
    case 'Critical':
      return '#C84C4C';
  }
}

type ConditionAnalysis = {
  condition: NudgeCondition;
  confidence: number;
  signals: {
    spendTrend: number;
    saveTrend: number;
    avgDailySaved: number;
    avgDailySpend: number;
    anomaly: boolean;
    subscriptionCreep: boolean;
  };
};

function analyzeCondition(
  transactions: Transaction[],
  analytics: Analytics,
  user?: UserProfile
): ConditionAnalysis {
  const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  const now = Date.now();
  const oldest = sorted[sorted.length - 1]?.timestamp ?? now;
  const days = Math.max(1, Math.ceil((now - oldest) / (1000 * 60 * 60 * 24)));

  const totalSpent = analytics.totalSpent;
  const totalSaved = analytics.totalSaved;
  const avgDailySpend = totalSpent / days;
  const avgDailySaved = totalSaved / days;

  const last7 = sorted.filter((t) => now - t.timestamp <= 7 * 24 * 60 * 60 * 1000);
  const prev7 = sorted.filter(
    (t) => now - t.timestamp > 7 * 24 * 60 * 60 * 1000 && now - t.timestamp <= 14 * 24 * 60 * 60 * 1000
  );

  const spendLast7 = last7.reduce((s, t) => s + t.amount, 0);
  const spendPrev7 = prev7.reduce((s, t) => s + t.amount, 0);
  const savedLast7 = last7.reduce((s, t) => s + t.roundedUpAmount, 0);
  const savedPrev7 = prev7.reduce((s, t) => s + t.roundedUpAmount, 0);

  const spendTrend = spendPrev7 > 0 ? (spendLast7 - spendPrev7) / spendPrev7 : 0;
  const saveTrend = savedPrev7 > 0 ? (savedLast7 - savedPrev7) / savedPrev7 : 0;

  const avgTxn = analytics.transactionsCount > 0 ? totalSpent / analytics.transactionsCount : 0;
  const maxTxn = sorted.reduce((m, t) => Math.max(m, t.amount), 0);
  const anomaly = maxTxn > Math.max(2.5 * avgTxn, 1200);

  const recurringLast7 = last7.filter((t) => t.isRecurring).length;
  const recurringPrev7 = prev7.filter((t) => t.isRecurring).length;
  const subscriptionCreep = recurringLast7 > recurringPrev7 + 1;

  let condition: NudgeCondition = 'Neutral';

  if (avgDailySaved >= 8 && spendTrend <= 0.1 && saveTrend >= 0) {
    condition = 'Very Chill';
  } else if (avgDailySaved >= 5 && spendTrend <= 0.2) {
    condition = 'Chill';
  } else if ((spendTrend > 0.35 && saveTrend < -0.15) || (anomaly && spendTrend > 0.2)) {
    condition = 'Concerning';
  } else if (spendTrend > 0.2 || saveTrend < -0.1 || subscriptionCreep) {
    condition = 'Mild Concern';
  }

  if (condition === 'Concerning' && user && user.balance < 0.2 * (user.totalSpent + user.balance)) {
    condition = 'Critical';
  }

  const baseConfidence = 0.55 + Math.min(0.35, analytics.transactionsCount / 25);
  const confidence = Math.max(0.55, Math.min(0.9, baseConfidence));

  return {
    condition,
    confidence,
    signals: {
      spendTrend,
      saveTrend,
      avgDailySaved,
      avgDailySpend,
      anomaly,
      subscriptionCreep,
    },
  };
}

export function buildNudgePayload({
  transactions,
  analytics,
  user,
  messageOverride,
}: {
  transactions: Transaction[];
  analytics: Analytics;
  user?: UserProfile;
  messageOverride?: string;
}): AssistantInsight {
  const analysis = analyzeCondition(transactions, analytics, user);
  const accentColor = mapConditionToAccent(analysis.condition);

  const messageTitleByCondition: Record<NudgeCondition, string> = {
    'Very Chill': 'Calm and on track',
    Chill: 'Steady, healthy pace',
    Neutral: 'Balanced snapshot',
    'Mild Concern': "Let's tighten a little",
    Concerning: 'Time to course-correct',
    Critical: 'Act now, stay steady',
  };

  const messageBodyByCondition: Record<NudgeCondition, string> = {
    'Very Chill':
      'Your savings pace looks strong and spending is steady. Keep the rhythm and let it compound.',
    Chill:
      'Good momentum overall. A small weekly review will keep this trajectory smooth.',
    Neutral:
      'Your recent activity is stable. A light check-in can reveal easy optimizations.',
    'Mild Concern':
      'Spending is rising faster than savings. A few small adjustments now will help rebalance.',
    Concerning:
      "Recent trends show higher outflow and softer savings. Let's tighten the top categories.",
    Critical:
      'Your balance is under pressure. Prioritize essentials and pause non-critical spends for now.',
  };

  const ctaByCondition: Record<NudgeCondition, string[]> = {
    'Very Chill': ['Show me where I overspend', 'Help me save smarter'],
    Chill: ['Show me where I overspend', 'Help me save smarter'],
    Neutral: ['Show me where I overspend', 'Help me save smarter'],
    'Mild Concern': ['Show me where I overspend', 'Help me save smarter'],
    Concerning: ['Show me where I overspend', 'Help me save smarter'],
    Critical: ['Show me where I overspend', 'Help me save smarter'],
  };

  return {
    id: 'pace-nudge',
    condition: analysis.condition,
    confidence: analysis.confidence,
    accentColor,
    messageTitle: messageTitleByCondition[analysis.condition],
    messageBody: messageOverride ?? messageBodyByCondition[analysis.condition],
    cta: ctaByCondition[analysis.condition],
  };
}

/* ---------- Pace-based Nudges ---------- */

export function generateInsights(
  transactions: Transaction[],
  analytics: Analytics,
  user?: UserProfile
): AssistantInsight[] {
  if (transactions.length === 0) return [];
  return [buildNudgePayload({ transactions, analytics, user })];
}
