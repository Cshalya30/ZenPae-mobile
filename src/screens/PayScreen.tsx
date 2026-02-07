import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Text from '../components/Text';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import { useFinanceStore, type Category } from '../store/financeStore';
import { formatCurrency, parseAmount } from '../utils/format';
import { useTheme } from '../theme/useTheme';
import PinModal from '../components/PinModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORY_ITEMS: { label: Category; icon: string }[] = [
  { label: 'Food', icon: '🍽️' },
  { label: 'Groceries', icon: '🛒' },
  { label: 'Transport', icon: '🚕' },
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Bills', icon: '🧾' },
  { label: 'Subscriptions', icon: '🔁' },
  { label: 'Investments', icon: '📈' },
  { label: 'Medicines', icon: '💊' },
  { label: 'Emergency', icon: '🚨' },
  { label: 'Other', icon: '✨' },
];

export const PayScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { wallet, makePayment } = useFinanceStore();

  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Custom'>('Monthly');
  const [endMode, setEndMode] = useState<'Until cancelled' | 'End after' | 'End on date'>('Until cancelled');
  const [endCount, setEndCount] = useState('6');
  const [showPin, setShowPin] = useState(false);

  const amountValue = parseAmount(amount);
  const canSubmit = amountValue > 0 && vendor.trim().length > 0 && selectedCategory;

  const toggleRecurring = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsRecurring((prev) => !prev);
  };

  const handleConfirm = () => {
    if (!canSubmit) return;
    setShowPin(true);
  };

  const handlePayment = () => {
    const ok = makePayment(amountValue, selectedCategory!, vendor.trim(), isRecurring, note.trim(), frequency);
    if (ok) {
      navigation.navigate('PostPayment' as never, {
        amount: amountValue,
        vendor: vendor.trim(),
        category: selectedCategory,
        isRecurring,
        frequency,
      } as never);
    }
    setShowPin(false);
  };

  const recurrenceSummary = useMemo(() => {
    if (!isRecurring) return 'One-time payment';
    const start = 'starting today';
    if (endMode === 'Until cancelled') return `This payment will repeat ${frequency.toLowerCase()} ${start}`;
    if (endMode === 'End after') return `Repeats ${frequency.toLowerCase()} for ${endCount} payments`;
    return `Repeats ${frequency.toLowerCase()} until chosen end date`;
  }, [isRecurring, frequency, endMode, endCount]);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Make Payment</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        UPI - Instant - Secure
      </Text>

      <View style={styles.balanceRow}>
        <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Available</Text>
        <Text style={[styles.balanceValue, { color: theme.colors.accent }]}>{formatCurrency(wallet)}</Text>
      </View>

      <BlurView intensity={20} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.sectionCard, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Payee</Text>
        <View style={[styles.inputWrap, { borderColor: theme.colors.border }]}>
          <Text style={styles.inputIcon}>🏦</Text>
          <TextInput
            value={vendor}
            onChangeText={setVendor}
            placeholder="Select merchant"
            placeholderTextColor={theme.colors.muted}
            style={[styles.input, { color: theme.colors.textPrimary }]}
          />
        </View>
      </BlurView>

      <BlurView intensity={20} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.sectionCard, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
        <View style={[styles.amountBox, { borderColor: theme.colors.border }]}>
          <Text style={[styles.amountPrefix, { color: theme.colors.textSecondary }]}>₹</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.muted}
            style={[styles.amountInput, { color: theme.colors.textPrimary }]}
          />
        </View>
      </BlurView>

      <View style={styles.categorySection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORY_ITEMS.map((item) => {
            const active = selectedCategory === item.label;
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.categoryPill,
                  {
                    borderColor: active ? theme.colors.accent : theme.colors.border,
                    backgroundColor: theme.colors.surfaceSecondary,
                    shadowColor: active ? theme.colors.accent : 'transparent',
                    shadowOpacity: active ? 0.18 : 0,
                    shadowRadius: active ? 12 : 0,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: active ? 4 : 0,
                  },
                ]}
                onPress={() => setSelectedCategory(item.label)}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={[styles.categoryText, { color: active ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <BlurView intensity={18} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.sectionCard, { borderColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.recurringRow} onPress={toggleRecurring}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
            Make this a recurring payment
          </Text>
          <View style={[styles.toggle, { backgroundColor: isRecurring ? theme.colors.accent : theme.colors.border }]}>
            <View style={[styles.toggleDot, { transform: [{ translateX: isRecurring ? 16 : 2 }], backgroundColor: theme.colors.black }]} />
          </View>
        </TouchableOpacity>

        {isRecurring ? (
          <View style={styles.recurringPanel}>
            <Text style={[styles.recurringTitle, { color: theme.colors.textPrimary }]}>Frequency</Text>
            <View style={styles.frequencyRow}>
              {(['Daily', 'Weekly', 'Monthly', 'Custom'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setFrequency(option)}
                  style={[
                    styles.frequencyPill,
                    {
                      backgroundColor: frequency === option ? theme.colors.accentSoft : 'transparent',
                      borderColor: frequency === option ? theme.colors.accent : theme.colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.frequencyText, { color: theme.colors.textPrimary }]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.recurringGrid}>
              <View style={styles.recurringItem}>
                <Text style={[styles.recurringLabel, { color: theme.colors.textSecondary }]}>Start date</Text>
                <TouchableOpacity>
                  <Text style={[styles.recurringValue, { color: theme.colors.textPrimary }]}>Today</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recurringItem}>
                <Text style={[styles.recurringLabel, { color: theme.colors.textSecondary }]}>End</Text>
                <View style={styles.endOptions}>
                  {(['Until cancelled', 'End after', 'End on date'] as const).map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setEndMode(option)}
                      style={[
                        styles.endPill,
                        {
                          backgroundColor: endMode === option ? theme.colors.accentSoft : 'transparent',
                          borderColor: endMode === option ? theme.colors.accent : theme.colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.endText, { color: theme.colors.textPrimary }]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {endMode === 'End after' ? (
                <View style={styles.recurringItem}>
                  <Text style={[styles.recurringLabel, { color: theme.colors.textSecondary }]}>Payments</Text>
                  <TextInput
                    value={endCount}
                    onChangeText={setEndCount}
                    keyboardType="numeric"
                    style={[styles.endInput, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
                  />
                </View>
              ) : null}
            </View>

            <Text style={[styles.recurringSummary, { color: theme.colors.textSecondary }]}>
              {recurrenceSummary}
            </Text>
          </View>
        ) : (
          <Text style={[styles.recurringSummary, { color: theme.colors.textSecondary }]}>
            {recurrenceSummary}
          </Text>
        )}
      </BlurView>

      <BlurView intensity={16} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.sectionCard, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Optional details</Text>
        <View style={[styles.inputWrap, { borderColor: theme.colors.border }]}>
          <Text style={styles.inputIcon}>📝</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)"
            placeholderTextColor={theme.colors.muted}
            style={[styles.input, { color: theme.colors.textPrimary }]}
          />
        </View>
      </BlurView>

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: canSubmit ? theme.colors.accent : theme.colors.border }]}
        activeOpacity={0.9}
        onPress={handleConfirm}
      >
        <Text style={[styles.ctaText, { color: canSubmit ? theme.colors.black : theme.colors.textSecondary }]}>
          Confirm & Pay
        </Text>
      </TouchableOpacity>

      <PinModal
        visible={showPin}
        onClose={() => setShowPin(false)}
        onSuccess={handlePayment}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 0.5,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  amountPrefix: {
    fontSize: 20,
    fontWeight: '600',
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
  categorySection: {
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    width: '30.6%',
    borderRadius: 14,
    borderWidth: 0.5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 11,
  },
  recurringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 38,
    height: 20,
    borderRadius: 12,
    padding: 2,
  },
  toggleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  recurringPanel: {
    marginTop: 12,
  },
  recurringTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  frequencyPill: {
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recurringGrid: {
    gap: 10,
  },
  recurringItem: {
    gap: 6,
  },
  recurringLabel: {
    fontSize: 12,
  },
  recurringValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  endOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  endPill: {
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  endText: {
    fontSize: 11,
    fontWeight: '600',
  },
  endInput: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    width: 80,
  },
  recurringSummary: {
    marginTop: 8,
    fontSize: 11,
  },
  cta: {
    marginTop: 6,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PayScreen;
