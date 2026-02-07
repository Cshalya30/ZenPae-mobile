// ZenPae AI Assistant - Financial Co-Pilot

export type FinancialCondition = 
  | 'Very Chill' 
  | 'Chill' 
  | 'Neutral' 
  | 'Mild Concern' 
  | 'Concerning' 
  | 'Critical';

export interface AIAssessment {
  condition: FinancialCondition;
  confidence: number;
  accentColor: string;
  messageTitle: string;
  messageBody: string;
  cta: string[];
}

const CONDITION_COLORS: Record<FinancialCondition, string> = {
  'Very Chill': '#6EE7B7',
  'Chill': '#99FF32',
  'Neutral': '#B6E35C',
  'Mild Concern': '#E6B85C',
  'Concerning': '#E07A5F',
  'Critical': '#C84C4C',
};

export function analyzeFinancialHealth(
  totalSpending: number,
  savingsRate: number,
  subscriptionTotal: number,
  income: number = 60000
): AIAssessment {
  const spendingRatio = totalSpending / income;
  const savingsRatio = savingsRate / income;
  
  // Very Chill: Low spending, high savings
  if (spendingRatio < 0.5 && savingsRatio > 0.25) {
    return {
      condition: 'Very Chill',
      confidence: 0.92,
      accentColor: CONDITION_COLORS['Very Chill'],
      messageTitle: 'Financial Zen Achieved',
      messageBody: 'Your spending is well-controlled and savings are strong. You\'re building wealth consistently.',
      cta: ['View Wealth', 'Set New Goal'],
    };
  }
  
  // Chill: Balanced approach
  if (spendingRatio < 0.65 && savingsRatio > 0.15) {
    return {
      condition: 'Chill',
      confidence: 0.87,
      accentColor: CONDITION_COLORS['Chill'],
      messageTitle: 'Balanced & Steady',
      messageBody: 'Good balance between spending and saving. Your round-ups are adding up nicely.',
      cta: ['Boost Savings', 'Dream Buy'],
    };
  }
  
  // Neutral: Average state
  if (spendingRatio < 0.75 && savingsRatio > 0.10) {
    return {
      condition: 'Neutral',
      confidence: 0.81,
      accentColor: CONDITION_COLORS['Neutral'],
      messageTitle: 'Room for Optimization',
      messageBody: 'Your finances are stable, but there\'s opportunity to save more through small adjustments.',
      cta: ['Review Subscriptions', 'Optimize'],
    };
  }
  
  // Mild Concern: Starting to slip
  if (spendingRatio < 0.85 || savingsRatio < 0.08) {
    return {
      condition: 'Mild Concern',
      confidence: 0.76,
      accentColor: CONDITION_COLORS['Mild Concern'],
      messageTitle: 'Time for a Review',
      messageBody: 'Spending has increased this month. Consider reviewing your subscriptions and discretionary expenses.',
      cta: ['Cut Subscriptions', 'Budget Plan'],
    };
  }
  
  // Concerning: Action needed
  if (spendingRatio < 0.95 || savingsRatio < 0.05) {
    return {
      condition: 'Concerning',
      confidence: 0.84,
      accentColor: CONDITION_COLORS['Concerning'],
      messageTitle: 'Action Recommended',
      messageBody: 'Your spending is outpacing savings. Let\'s identify areas to reduce and rebuild your buffer.',
      cta: ['Emergency Review', 'Contact Advisor'],
    };
  }
  
  // Critical: Immediate attention
  return {
    condition: 'Critical',
    confidence: 0.91,
    accentColor: CONDITION_COLORS['Critical'],
    messageTitle: 'Immediate Attention Needed',
    messageBody: 'Spending exceeds safe limits. Priority: stabilize expenses and protect your financial foundation.',
    cta: ['Emergency Plan', 'Get Help'],
  };
}

export function generateInsight(transactions: any[]): string {
  if (transactions.length === 0) return 'No recent activity';
  
  const categories = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)[0];
  
  const insights = [
    `Most spending in ${topCategory[0]} this week`,
    'Round-ups are building your Dream Buy fund',
    'On track for monthly savings goal',
    'Consider reviewing subscription costs',
    'Strong saving momentum this month',
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}
