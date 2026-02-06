import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, button, card, input } from '../theme/theme';
import Screen from '../components/Screen';
import PinModal from '../components/PinModal';
import { useFinanceStore, type Category } from '../store/financeStore';
import { formatCurrency, parseAmount } from '../utils/format';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PayStackParamList } from '../navigation/PayStackNavigator';

type PayScreenProps = NativeStackScreenProps<PayStackParamList, 'PayMain'>;

export const PayScreen: React.FC<PayScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'Weekly' | 'Monthly' | 'Yearly'>(
    'Monthly'
  );
  const [error, setError] = useState<string | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{
    amount: number;
    vendor: string;
    category: Category;
    isRecurring: boolean;
    frequency: 'Weekly' | 'Monthly' | 'Yearly';
  } | null>(null);

  const makePayment = useFinanceStore((state) => state.makePayment);

  const categories: Category[] = useMemo(
    () => [
      'Food',
      'Groceries',
      'Transport',
      'Shopping',
      'Bills',
      'Subscriptions',
      'Investments',
      'Medicines',
      'Emergency',
      'Other',
    ],
    []
  );

  const handlePayPress = () => {
    const parsedAmount = parseAmount(amount);
    const trimmedVendor = vendor.trim();

    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter a valid amount.');
      return;
    }

    if (!trimmedVendor) {
      setError('Enter a vendor name.');
      return;
    }

    if (!selectedCategory) {
      setError('Choose a category.');
      return;
    }

    setError(null);
    setPendingPayment({
      amount: parsedAmount,
      vendor: trimmedVendor,
      category: selectedCategory,
      isRecurring,
      frequency,
    });
    setShowPinModal(true);
  };

  const handlePinConfirm = () => {
    if (!pendingPayment) return;

    const success = makePayment(
      pendingPayment.amount,
      pendingPayment.category,
      pendingPayment.vendor,
      pendingPayment.isRecurring,
      undefined,
      pendingPayment.frequency
    );

    if (!success) {
      setError('Insufficient balance for this payment.');
      setShowPinModal(false);
      return;
    }

    setShowPinModal(false);
    setAmount('');
    setVendor('');
    setSelectedCategory(null);
    setIsRecurring(false);
    setFrequency('Monthly');
    setPendingPayment(null);
    navigation.navigate('PostPayment', {
      amount: pendingPayment.amount,
      vendor: pendingPayment.vendor,
      category: pendingPayment.category,
      isRecurring: pendingPayment.isRecurring,
      frequency: pendingPayment.frequency,
    });
  };

  return (
    <Screen>
      <Text style={styles.screenTitle}>Make Payment</Text>

      <View style={styles.previewCard}>
        <View style={styles.previewLeft}>
          <Text style={styles.previewLabel}>Pay to</Text>
          <Text style={styles.previewVendor}>
            {vendor.trim() ? vendor : 'Select merchant'}
          </Text>
          <Text style={styles.previewMeta}>
            {selectedCategory ?? 'Choose category'}
          </Text>
        </View>
        <View style={styles.previewRight}>
          <Text style={styles.previewAmount}>
            {formatCurrency(parseAmount(amount))}
          </Text>
          <Text style={styles.previewSub}>UPI · Instant</Text>
        </View>
      </View>

      <View style={[styles.section, styles.sectionCard]}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={[styles.input, styles.amountInput]}
          placeholder="\u20B90.00"
          placeholderTextColor={colors.textSecondary}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={[styles.section, styles.sectionCard]}>
        <Text style={styles.label}>Vendor</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vendor name"
          placeholderTextColor={colors.textSecondary}
          value={vendor}
          onChangeText={setVendor}
        />
      </View>

      <View style={[styles.section, styles.sectionCard]}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          <FlatList
            data={categories}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  selectedCategory === item && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    selectedCategory === item && styles.categoryPillActiveText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <View style={[styles.section, styles.sectionCard]}>
        <Text style={styles.label}>Recurring payment?</Text>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsRecurring((prev) => !prev)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
            {isRecurring ? <Text style={styles.checkboxTick}>\u2713</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>Yes, this repeats</Text>
        </TouchableOpacity>

        {isRecurring ? (
          <View style={styles.frequencyRow}>
            {(['Weekly', 'Monthly', 'Yearly'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.frequencyPill,
                  frequency === item && styles.frequencyPillActive,
                ]}
                onPress={() => setFrequency(item)}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    frequency === item && styles.frequencyTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePayPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={button.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButtonGradient}
        >
          <Text style={styles.payButtonText}>Confirm Payment</Text>
        </LinearGradient>
      </TouchableOpacity>

      {showPinModal && (
        <PinModal
          visible={showPinModal}
          onSuccess={handlePinConfirm}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  } as any,
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
  } as any,
  previewCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as any,
  previewLeft: {
    flex: 1,
    marginRight: spacing.md,
  } as any,
  previewLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
  } as any,
  previewVendor: {
    ...typography.sectionTitle,
  } as any,
  previewMeta: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  } as any,
  previewRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  } as any,
  previewAmount: {
    ...typography.balance,
  } as any,
  previewSub: {
    ...typography.small,
    marginTop: spacing.xs,
  } as any,
  sectionCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
  } as any,
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  } as any,
  input: {
    backgroundColor: input.background,
    borderRadius: input.borderRadius,
    paddingVertical: input.paddingVertical,
    paddingHorizontal: input.paddingHorizontal,
    borderWidth: 1,
    borderColor: input.borderColor,
    color: colors.textPrimary,
  } as any,
  amountInput: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as any,
  categoryRow: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  } as any,
  categoryPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  } as any,
  categoryPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as any,
  categoryPillText: {
    ...typography.bodySecondary,
    color: colors.textPrimary,
  } as any,
  categoryPillActiveText: {
    color: colors.black,
  } as any,
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  } as any,
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
  } as any,
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as any,
  checkboxTick: {
    color: colors.black,
    fontWeight: '700',
  } as any,
  checkboxLabel: {
    ...typography.bodySecondary,
    color: colors.textPrimary,
  } as any,
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
  } as any,
  frequencyPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  } as any,
  frequencyPillActive: {
    backgroundColor: colors.accent,
  } as any,
  frequencyText: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
  } as any,
  frequencyTextActive: {
    color: colors.black,
    fontWeight: '700',
  } as any,
  divider: {
    borderColor: colors.border,
    borderTopWidth: 1,
    marginVertical: spacing.lg,
  } as any,
  payButton: {
    height: button.height,
    borderRadius: button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    shadowColor: button.shadowColor,
    shadowOpacity: button.shadowOpacity,
    shadowRadius: button.shadowRadius,
    shadowOffset: button.shadowOffset,
    elevation: button.elevation,
    boxShadow: button.boxShadow,
  } as any,
  payButtonGradient: {
    height: '100%',
    width: '100%',
    borderRadius: button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  payButtonText: {
    ...typography.button,
    color: button.color,
  } as any,
  errorText: {
    ...typography.bodySecondary,
    color: colors.warning,
    marginTop: spacing.sm,
  } as any,
});

export default PayScreen;
