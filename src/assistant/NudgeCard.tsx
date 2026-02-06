import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography, card } from '../theme/theme';

type Props = {
  type: 'positive' | 'warning' | 'info';
  title: string;
  message: string;
};

const ICON = {
  positive: '✅',
  warning: '⚠️',
  info: 'ℹ️',
};

export default function NudgeCard({ type, title, message }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        styles[type],
        {
          opacity: fade,
          transform: [{ translateY: translate }],
        },
      ]}
    >
      <Text style={styles.title}>
        {ICON[type]} {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: card.padding,
    borderRadius: card.borderRadius,
    marginBottom: 12,
    borderLeftWidth: 4,
    backgroundColor: card.backgroundColor,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    boxShadow: card.boxShadow,
  },
  positive: {
    borderLeftColor: colors.accent,
  },
  warning: {
    borderLeftColor: colors.warning,
    backgroundColor: colors.surface,
  },
  info: {
    borderLeftColor: colors.info,
    backgroundColor: colors.surface,
  },
  title: {
    ...typography.body,
    marginBottom: 6,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  message: {
    ...typography.bodySecondary,
    lineHeight: 18,
  },
});
