import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appStorage } from './storage';

/* -----------------------------
   TYPES
----------------------------- */

export type Category =
  | 'Food'
  | 'Groceries'
  | 'Transport'
  | 'Shopping'
  | 'Subscriptions'
  | 'Investments'
  | 'Bills'
  | 'Medicines'
  | 'Emergency'
  | 'Other'
  | 'Custom';

export type Transaction = {
  id: string;
  amount: number;
  roundedUpAmount: number;
  vendor: string;
  category: Category;
  note?: string;
  isRecurring: boolean;
  frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
  timestamp: number;
};

export type Analytics = {
  totalSpent: number;
  totalSaved: number;
  transactionsCount: number;
  averageSpend: number;
};

export type Milestone = {
  label: string;
  hit: boolean;
};

export type DreamGoal = {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  saved: number;
  milestones: Milestone[];
  templateId?: string;
  emoji?: string;
  allocationPct?: number;
};

export type UserProfile = {
  name: string;
  initials?: string;
  phone?: string;
  upi?: string;
  balance: number;
  totalSpent: number;
  monthlySavings: number;
};

export type FinanceState = {
  /* User */
  user: UserProfile;

  /* Aliases used across the app (added for compatibility) */
  wallet: number;
  savings: number;

  /* Balances (kept in sync with aliases above) */
  walletBalance: number;
  savingsBalance: number;

  /* Core data */
  transactions: Transaction[];
  analytics: Analytics;
  dreams: DreamGoal[];
  activeDreamId?: string;

  /* Assistant hooks */
  lastRoundUp: number;
  lastCategory?: Category;
  lastVendor?: string;
  aiInsight: string;

  /* Theme */
  themeMode: 'dark' | 'light' | 'custom';
  setThemeMode: (mode: 'dark' | 'light' | 'custom') => void;

  /* Actions */
  makePayment: (
    amount: number,
    category: Category,
    vendor: string,
    isRecurring: boolean,
    note?: string,
    frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Custom'
  ) => boolean;

  addDream: (dream: DreamGoal) => void;
  saveDream: (dream: DreamGoal) => void;
  setActiveDream: (dreamId: string) => void;
  resetDemo: () => void;
};

/* -----------------------------
   ROUND-UP LOGIC (LOCKED)
----------------------------- */
const calculateRoundUp = (amount: number) => {
  return Math.min(Math.ceil(amount * 0.01), 10);
};

/* -----------------------------
   ASSISTANT BRAIN (RULE BASED)
----------------------------- */
const generateInsight = (
  amount: number,
  roundUp: number,
  category: Category,
  isRecurring: boolean
): string => {
  if (isRecurring && category === 'Subscriptions') {
    return 'Subscription detected. Auto-savings keep recurring costs under control.';
  }

  if (category === 'Investments') {
    return 'Investing while saving - strong long-term behavior.';
  }

  if (amount > 1000) {
    return `High spend detected. Still saved \u20B9${roundUp}. Discipline matters.`;
  }

  if (roundUp <= 2) return 'Small saves compound quietly.';
  if (roundUp <= 5) return 'Nice save. Momentum building.';
  return 'Strong save. Your future self approves.';
};

/* -----------------------------
   STORE
----------------------------- */
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
  /* Initial user */
  user: {
    name: 'Chirantan',
    initials: 'C',
    phone: '+1 555-0100',
    upi: 'chirantan@upi',
    balance: 20000,
    totalSpent: 0,
    monthlySavings: 0,
  },

  /* Aliases */
  wallet: 20000,
  savings: 0,

  /* Initial balances */
  walletBalance: 20000,
  savingsBalance: 0,

  transactions: [],

  analytics: {
    totalSpent: 0,
    totalSaved: 0,
    transactionsCount: 0,
    averageSpend: 0,
  },

  dreams: [],
  activeDreamId: undefined,

  lastRoundUp: 0,
  aiInsight: '',

  themeMode: 'dark',
  setThemeMode: (mode) =>
    set(() => ({
      themeMode: mode,
    })),

  /* -----------------------------
     MAKE PAYMENT (STABLE)
  ----------------------------- */
  makePayment: (
    amount: number,
    category: Category,
    vendor: string,
    isRecurring: boolean,
    note?: string,
    frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Custom'
  ) => {
    const state = get();
    const roundUp = calculateRoundUp(amount);
    const totalDebit = amount + roundUp;

    if (state.walletBalance < totalDebit) return false;

    const tx: Transaction = {
      id: Date.now().toString(),
      amount,
      roundedUpAmount: roundUp,
      vendor,
      category,
      isRecurring,
      note,
      frequency: isRecurring ? frequency ?? 'Monthly' : undefined,
      timestamp: Date.now(),
    };

    const updatedTransactions = [tx, ...state.transactions];

    const totalSpent = state.analytics.totalSpent + amount;
    const totalSaved = state.analytics.totalSaved + roundUp;
    const transactionsCount = state.analytics.transactionsCount + 1;

    const newWallet = state.walletBalance - totalDebit;
    const newSavings = state.savingsBalance + roundUp;

    const updatedDreams = applyDreamSavings(state, roundUp);

    set({
      walletBalance: newWallet,
      savingsBalance: newSavings,
      wallet: newWallet,
      savings: newSavings,

      transactions: updatedTransactions,

      analytics: {
        totalSpent,
        totalSaved,
        transactionsCount,
        averageSpend: Math.round(totalSpent / transactionsCount),
      },

      lastRoundUp: roundUp,
      lastCategory: category,
      lastVendor: vendor,
      aiInsight: generateInsight(amount, roundUp, category, isRecurring),

      user: {
        ...state.user,
        balance: newWallet,
        totalSpent: totalSpent,
        monthlySavings: (state.user?.monthlySavings || 0) + roundUp,
      },
      dreams: updatedDreams,
    });

    return true;
  },

  addDream: (dream: DreamGoal) =>
    set((state) => ({
      dreams: [dream, ...state.dreams],
      activeDreamId: dream.id,
    })),

  saveDream: (dream: DreamGoal) =>
    set((state) => {
      const index = state.dreams.findIndex((d) => d.id === dream.id);
      if (index >= 0) {
        const updated = [...state.dreams];
        updated[index] = dream;
        return { dreams: updated, activeDreamId: dream.id };
      }
      return { dreams: [dream, ...state.dreams], activeDreamId: dream.id };
    }),

  setActiveDream: (dreamId: string) =>
    set(() => ({
      activeDreamId: dreamId,
    })),

  /* -----------------------------
     RESET DEMO
  ----------------------------- */
  resetDemo: () =>
    set({
      wallet: 20000,
      savings: 0,
      walletBalance: 20000,
      savingsBalance: 0,
      transactions: [],
      analytics: {
        totalSpent: 0,
        totalSaved: 0,
        transactionsCount: 0,
        averageSpend: 0,
      },
      lastRoundUp: 0,
      aiInsight: '',
      lastCategory: undefined,
      lastVendor: undefined,
      dreams: [],
      activeDreamId: undefined,
      user: {
        name: 'Chirantan',
        initials: 'C',
        phone: '+1 555-0100',
        upi: 'chirantan@upi',
        balance: 20000,
        totalSpent: 0,
        monthlySavings: 0,
      },
      themeMode: 'dark',
    }),
    }),
    {
      name: 'finance-store',
      storage: appStorage,
    }
  )
);

const roundCurrency = (n: number) => Math.round(n * 100) / 100;

function applyDreamSavings(state: FinanceState, roundUp: number): DreamGoal[] {
  if (state.dreams.length === 0 || roundUp <= 0) return state.dreams;

  const targetId = state.activeDreamId ?? state.dreams[0].id;

  return state.dreams.map((dream) => {
    if (dream.id !== targetId) return dream;
    const pct = dream.allocationPct != null ? dream.allocationPct / 100 : 0.07;
    const allocation = roundCurrency(roundUp * pct);
    const newSaved = Math.min(
      roundCurrency(dream.saved + allocation),
      dream.targetAmount
    );
    const progress = newSaved / Math.max(dream.targetAmount, 1);
    const updatedMilestones = dream.milestones.map((m, idx) => {
      const threshold = idx === 0 ? 0.25 : idx === 1 ? 0.6 : 1;
      return { ...m, hit: progress >= threshold };
    });
    return {
      ...dream,
      saved: newSaved,
      milestones: updatedMilestones,
    };
  });
}
