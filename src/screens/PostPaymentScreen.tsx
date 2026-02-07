import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native';
import Text from '../components/Text';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import Screen from '../components/Screen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PayStackParamList } from '../navigation/PayStackNavigator';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../theme/useTheme';

const TICK_PATH_LENGTH = 52;
const SUCCESS_EASING = Easing.bezier(0.22, 1, 0.36, 1);

type PostPaymentScreenProps = NativeStackScreenProps<
  PayStackParamList,
  'PostPayment'
>;

export const PostPaymentScreen: React.FC<PostPaymentScreenProps> = ({
  route,
  navigation,
}) => {
  const theme = useTheme();
  const { amount, vendor, isRecurring, frequency } = route.params;
  const draw = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(draw, {
        toValue: 1,
        duration: 600,
        easing: SUCCESS_EASING,
        useNativeDriver: false,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0.28,
        duration: 280,
        delay: 320,
        easing: SUCCESS_EASING,
        useNativeDriver: false,
      }),
    ]).start();
  }, [draw, ringOpacity]);

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  return (
    <Screen scrollable={false}>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.rippleRing,
              {
                borderColor: theme.colors.accent,
                opacity: ringOpacity,
              },
            ]}
          />
          <View style={[styles.tickContainer, { backgroundColor: theme.colors.accent }]}>
            <Svg width={64} height={64} viewBox="0 0 64 64">
              <Circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
              <AnimatedPath
                d="M18 34 L28 44 L46 22"
                stroke={theme.colors.black}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={TICK_PATH_LENGTH}
                strokeDashoffset={draw.interpolate({ inputRange: [0, 1], outputRange: [TICK_PATH_LENGTH, 0] })}
              />
            </Svg>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.successTitle, { color: theme.colors.textPrimary }]}>Payment Successful</Text>
          <Text style={[styles.successMessage, { color: theme.colors.textSecondary }]}>
            Payment sent to {vendor}
          </Text>
          {isRecurring ? (
            <Text style={[styles.successSubtext, { color: theme.colors.textSecondary }]}>
              Recurs {frequency ?? 'Monthly'}
            </Text>
          ) : null}
          <Text style={[styles.successAmount, { color: theme.colors.accent }]}>{formatCurrency(amount)}</Text>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={theme.button.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <Text style={[styles.continueText, { color: theme.colors.black }]}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  rippleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  tickContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  successMessage: {
    fontSize: 13,
    marginTop: 8,
  },
  successSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  successAmount: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostPaymentScreen;
