import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#FF6B6B' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#4ECDC4' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#FFD93D' },
  { id: 'bills', name: 'Bills', icon: '📄', color: '#95E1D3' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#A78BFA' },
  { id: 'other', name: 'Other', icon: '💳', color: '#F8B500' },
];

const SuccessCheckmark = ({ visible }: { visible: boolean }) => {
  const [strokeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(strokeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.checkmarkContainer}>
      <Svg width="80" height="80" viewBox="0 0 80 80">
        <Path
          d="M 20 40 L 35 55 L 60 25"
          stroke={COLORS.zenGreen}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="100"
          strokeDashoffset={strokeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          })}
        />
      </Svg>
    </View>
  );
};

export default function PayScreen() {
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePay = () => {
    if (!merchant || !amount) {
      alert('Please enter merchant and amount');
      return;
    }
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    if (pin === '1234') {
      setShowPinModal(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setMerchant('');
        setAmount('');
        setPin('');
      }, 2000);
    } else {
      alert('Incorrect PIN');
      setPin('');
    }
  };

  const roundUpAmount = amount ? (Math.ceil(parseFloat(amount)) - parseFloat(amount)).toFixed(2) : '0.00';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Make Payment</Text>

        {/* Category Selection */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
              >
                <LinearGradient
                  colors={
                    selectedCategory === category.id
                      ? ['rgba(153,255,50,0.15)', 'rgba(153,255,50,0.05)']
                      : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                  }
                  style={styles.categoryChipGradient}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryName,
                      selectedCategory === category.id && styles.categoryNameActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Merchant Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Merchant Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter merchant name"
            placeholderTextColor={COLORS.textTertiary}
            value={merchant}
            onChangeText={setMerchant}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={COLORS.textTertiary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Round-up Info */}
        <View style={styles.roundUpCard}>
          <Text style={styles.roundUpLabel}>Round-up to Dream Buy</Text>
          <Text style={styles.roundUpAmount}>₹{roundUpAmount}</Text>
        </View>

        {/* Pay Button */}
        <Pressable style={styles.payButton} onPress={handlePay}>
          <LinearGradient
            colors={['#99FF32', '#7DD628']}
            style={styles.payButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.payButtonText}>Confirm & Pay</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* PIN Modal */}
      <Modal visible={showPinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pinModal}>
            <Text style={styles.pinTitle}>Enter PIN</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="••••"
              placeholderTextColor={COLORS.textTertiary}
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
            <View style={styles.pinButtons}>
              <Pressable
                style={styles.pinButtonCancel}
                onPress={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
              >
                <Text style={styles.pinButtonCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.pinButtonConfirm} onPress={handlePinSubmit}>
                <Text style={styles.pinButtonConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <SuccessCheckmark visible={showSuccess} />
            <Text style={styles.successTitle}>Payment Successful</Text>
            <Text style={styles.successAmount}>₹{amount}</Text>
            <Text style={styles.successRoundup}>+₹{roundUpAmount} to Dream Buy</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: 100,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  categoriesContainer: {
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  categoriesScroll: {
    gap: SPACING.md,
  },
  categoryChip: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  categoryChipActive: {
    borderColor: 'rgba(153,255,50,0.3)',
  },
  categoryChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
  },
  categoryNameActive: {
    color: COLORS.zenGreen,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textPrimary,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  roundUpCard: {
    backgroundColor: 'rgba(153,255,50,0.1)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 0.5,
    borderColor: 'rgba(153,255,50,0.2)',
  },
  roundUpLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textPrimary,
  },
  roundUpAmount: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.zenGreen,
  },
  payButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  payButtonGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinModal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    width: '80%',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  pinTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  pinInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    letterSpacing: 10,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  pinButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  pinButtonCancel: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  pinButtonCancelText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pinButtonConfirm: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.zenGreen,
  },
  pinButtonConfirmText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.background,
    textAlign: 'center',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxxl,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  checkmarkContainer: {
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  successAmount: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.zenGreen,
    marginBottom: SPACING.sm,
  },
  successRoundup: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
});
