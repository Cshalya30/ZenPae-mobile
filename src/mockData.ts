// Mock Data for ZenPae App

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  roundUp: number;
  icon: string;
}

export interface WealthItem {
  id: string;
  name: string;
  amount: number;
  color: string;
  icon: string;
}

export interface DreamBuy {
  name: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  date: string;
  icon: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    merchant: 'Starbucks',
    amount: 247.50,
    category: 'Food & Dining',
    date: '2026-02-07',
    roundUp: 2.50,
    icon: '☕',
  },
  {
    id: '2',
    merchant: 'Amazon',
    amount: 1299.00,
    category: 'Shopping',
    date: '2026-02-06',
    roundUp: 1.00,
    icon: '📦',
  },
  {
    id: '3',
    merchant: 'Uber',
    amount: 185.75,
    category: 'Transport',
    date: '2026-02-06',
    roundUp: 4.25,
    icon: '🚗',
  },
  {
    id: '4',
    merchant: 'Netflix',
    amount: 649.00,
    category: 'Entertainment',
    date: '2026-02-05',
    roundUp: 1.00,
    icon: '🎬',
  },
  {
    id: '5',
    merchant: 'Swiggy',
    amount: 456.30,
    category: 'Food & Dining',
    date: '2026-02-05',
    roundUp: 3.70,
    icon: '🍔',
  },
];

export const MOCK_WEALTH_STACK: WealthItem[] = [
  {
    id: '1',
    name: 'Digital Gold',
    amount: 12450,
    color: '#FFD700',
    icon: '🪙',
  },
  {
    id: '2',
    name: 'Liquid Funds',
    amount: 8900,
    color: '#1FA2A6',
    icon: '💧',
  },
  {
    id: '3',
    name: 'Fixed Deposits',
    amount: 25000,
    color: '#99FF32',
    icon: '🏦',
  },
  {
    id: '4',
    name: 'Insurance',
    amount: 3500,
    color: '#FFA726',
    icon: '🛡️',
  },
  {
    id: '5',
    name: 'Intelligence',
    amount: 1850,
    color: '#A78BFA',
    icon: '🧠',
  },
];

export const MOCK_DREAM_BUY: DreamBuy = {
  name: 'MacBook Pro M4',
  targetAmount: 189900,
  currentAmount: 0,
};

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix Premium',
    amount: 649,
    date: '15th',
    icon: '🎬',
  },
  {
    id: '2',
    name: 'Spotify',
    amount: 119,
    date: '10th',
    icon: '🎵',
  },
  {
    id: '3',
    name: 'Amazon Prime',
    amount: 299,
    date: '22nd',
    icon: '📦',
  },
  {
    id: '4',
    name: 'ChatGPT Plus',
    amount: 1650,
    date: '5th',
    icon: '🤖',
  },
];

export const USER_PROFILE = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@gmail.com',
  phone: '+91 98765 43210',
  accountNumber: '•••• •••• •••• 4567',
  balance: 45678.50,
  savingsThisMonth: 2340,
  roundUpsTotal: 12.45,
};

export const SPENDING_CATEGORIES = [
  { name: 'Food & Dining', amount: 12450, color: '#FF6B6B', percentage: 28 },
  { name: 'Shopping', amount: 8900, color: '#4ECDC4', percentage: 20 },
  { name: 'Transport', amount: 7800, color: '#FFD93D', percentage: 18 },
  { name: 'Entertainment', amount: 5600, color: '#A78BFA', percentage: 13 },
  { name: 'Bills & Utilities', amount: 4200, color: '#95E1D3', percentage: 9 },
  { name: 'Others', amount: 5450, color: '#F8B500', percentage: 12 },
];
