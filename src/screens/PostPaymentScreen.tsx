import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, button } from '../theme/theme';
import Screen from '../components/Screen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PayStackParamList } from '../navigation/PayStackNavigator';
import { formatCurrency } from '../utils/format';

type PostPaymentScreenProps = NativeStackScreenProps<
  PayStackParamList,
  'PostPayment'
>;

export const PostPaymentScreen: React.FC<PostPaymentScreenProps> = ({
  navigation,
  route,
}) => {
  const { amount, vendor, isRecurring, frequency } = route.params;
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.goBack();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim]);

  return (
    <Screen scrollable={false}>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.rippleRing,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.tickContainer,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.tick}>✓</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.successTitle}>Payment Successful</Text>
          <Text style={styles.successMessage}>
            Payment sent to {vendor}
          </Text>
          {isRecurring ? (
            <Text style={styles.successSubtext}>
              Recurs {frequency ?? 'Monthly'}
            </Text>
          ) : null}
          <Text style={styles.successAmount}>{formatCurrency(amount)}</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={button.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
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
  } as any,
  animationContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  } as any,
  rippleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.accent,
  } as any,
  tickContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,
  tick: {
    fontSize: 50,
    color: colors.black,
    fontWeight: 'bold',
  } as any,
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  } as any,
  successTitle: {
    ...typography.sectionTitle,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  } as any,
  successMessage: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  } as any,
  successSubtext: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  } as any,
  successAmount: {
    ...typography.balance,
    marginTop: spacing.sm,
  } as any,
  continueButton: {
    paddingVertical: spacing.md,
    borderRadius: button.borderRadius,
    marginTop: spacing.md,
    shadowColor: button.shadowColor,
    shadowOpacity: button.shadowOpacity,
    shadowRadius: button.shadowRadius,
    shadowOffset: button.shadowOffset,
    elevation: button.elevation,
    boxShadow: button.boxShadow,
  } as any,
  continueGradient: {
    paddingVertical: spacing.md,
    borderRadius: button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  continueText: {
    ...typography.button,
    color: colors.black,
  } as any,
});

export default PostPaymentScreen;
