import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import Text from '../components/Text';
import { useTheme } from '../theme/useTheme';

type Props = {
  accentColor: string;
  title: string;
  message: string;
};

export default function NudgeCard({ accentColor, title, message }: Props) {
  const theme = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(8)).current;
  const tint = useMemo(() => accentColor, [accentColor]);

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
  }, [fade, translate]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderLeftColor: tint,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          shadowColor: tint,
          opacity: fade,
          transform: [{ translateY: translate }],
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 0.5,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  title: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  message: {
    lineHeight: 18,
    fontSize: 12,
  },
});
