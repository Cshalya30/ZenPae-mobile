import { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Text from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';

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
  const theme = useTheme();
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
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Enter PIN</Text>

          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            style={[
              styles.input,
              {
                backgroundColor: theme.input.background,
                borderColor: theme.input.borderColor,
                color: theme.colors.textPrimary,
              },
            ]}
            placeholderTextColor={theme.colors.textSecondary}
          />

          {error ? <Text style={[styles.error, { color: theme.colors.warning }]}>{error}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={verifyPin} activeOpacity={0.92}>
            <LinearGradient
              colors={theme.button.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnGradient}
            >
              <Text style={[styles.btnText, { color: theme.colors.black }]}>Confirm</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
            <Text style={[styles.cancel, { color: theme.colors.textSecondary }]}>Cancel</Text>
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
    borderRadius: 20,
    padding: 18,
    borderWidth: 0.5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 6,
  },
  error: {
    textAlign: 'center',
    marginTop: 10,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 12,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnGradient: {
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cancel: {
    textAlign: 'center',
    marginTop: 12,
  },
});
