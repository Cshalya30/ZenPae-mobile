import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Text from '../components/Text';
import AppGradient from '../components/AppGradient';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';

type Props = {
  onUnlock: () => void;
};

export default function AppPinScreen({ onUnlock }: Props) {
  const theme = useTheme();
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
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card.backgroundColor,
              borderColor: theme.card.borderColor,
              shadowColor: theme.card.shadowColor,
              shadowOpacity: theme.card.shadowOpacity,
              shadowRadius: theme.card.shadowRadius,
              shadowOffset: theme.card.shadowOffset,
              elevation: theme.card.elevation,
            },
          ]}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Enter App PIN
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Secure your UPI-style wallet
          </Text>

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
            placeholder="****"
            placeholderTextColor={theme.colors.textSecondary}
          />

          {error ? (
            <Text style={[styles.error, { color: theme.colors.warning }]}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.btn} onPress={verifyPin} activeOpacity={0.92}>
            <LinearGradient
              colors={theme.button.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnGradient}
            >
              <Text style={[styles.btnText, { color: theme.colors.black }]}>Unlock</Text>
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
    padding: 18,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 0.5,
  },
  logo: {
    width: 54,
    height: 54,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 6,
  },
  error: {
    textAlign: 'center',
    marginTop: 10,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 14,
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
