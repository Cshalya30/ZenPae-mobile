import { View, StyleSheet, Animated } from 'react-native';
import Text from '../Text';
import { useEffect, useRef } from 'react';
import { colors, spacing, typography } from '../../theme/theme';
import { formatCurrency } from '../../utils/format';

export default function CategoryBars({ data }: { data: Record<string, number> }) {
  const max = Math.max(...Object.values(data), 1);

  return (
    <View>
      {Object.entries(data).map(([cat, amt]) => (
        <BarRow key={cat} cat={cat} amt={amt} max={max} />
      ))}
    </View>
  );
}

function BarRow({ cat, amt, max }: { cat: string; amt: number; max: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: (amt / max) * 100,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [amt, max, anim]);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{cat}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: anim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.amount}>{formatCurrency(amt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: spacing.md },
  label: { ...typography.label, marginBottom: 6 },
  track: {
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: 6 },
  amount: { ...typography.small, marginTop: 4 },
});
