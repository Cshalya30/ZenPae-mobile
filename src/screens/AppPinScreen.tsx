import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppGradient from '../components/AppGradient';
import { colors, spacing, typography, button, card, input } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onUnlock: () => void;
};

export default function AppPinScreen({ onUnlock }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const verifyPin = () => {
    if (pin === '1234') {
      setPin('');
      setError('');
      onUnlock();
      return;
    }
    setError('Incorrect PIN. Try 1234.');
  };

  return (
    <AppGradient>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter App PIN</Text>
          <Text style={styles.subtitle}>Secure your UPI-style wallet</Text>

          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            style={styles.input}
            placeholder="••••"
            placeholderTextColor={colors.textSecondary}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={verifyPin} activeOpacity={0.92}>
            <LinearGradient
              colors={button.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Unlock</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </AppGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.lg,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
  },
  title: {
    ...typography.sectionTitle,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: input.background,
    borderRadius: input.borderRadius,
    paddingVertical: input.paddingVertical,
    paddingHorizontal: input.paddingHorizontal,
    borderWidth: 1,
    borderColor: input.borderColor,
    color: colors.textPrimary,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 6,
  },
  error: {
    ...typography.small,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  btn: {
    paddingVertical: spacing.md,
    borderRadius: button.borderRadius,
    marginTop: spacing.md,
    height: 48,
    justifyContent: 'center',
    shadowColor: button.shadowColor,
    shadowOpacity: button.shadowOpacity,
    shadowRadius: button.shadowRadius,
    shadowOffset: button.shadowOffset,
    elevation: button.elevation,
    boxShadow: button.boxShadow,
  },
  btnGradient: {
    height: '100%',
    borderRadius: button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...typography.button,
    color: button.color,
    textAlign: 'center',
  },
});
