import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, button, card, input } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

type PinModalProps = {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
};

export default function PinModal({
  visible,
  onSuccess,
  onClose,
}: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const verifyPin = () => {
    if (pin === '1234') {
      setPin('');
      setError('');
      onSuccess();
    } else {
      setError('Incorrect PIN');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter PIN</Text>

          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            style={styles.input}
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
              <Text style={styles.btnText}>Confirm</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
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
    marginBottom: spacing.md,
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
    marginTop: 10,
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
  cancel: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
