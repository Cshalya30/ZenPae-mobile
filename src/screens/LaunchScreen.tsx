import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Props = {
  onDone: () => void;
};

const LOGO_IMAGE = require('../../assets/icon.png');

export default function LaunchScreen({ onDone }: Props) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(0.98)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onDone();
    }, 820);

    return () => clearTimeout(timer);
  }, [glow, onDone, opacity, scale]);

  return (
    <View style={[styles.root, { backgroundColor: '#272B2F' }]}>
      <Animated.View style={[styles.container, { opacity }]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              {
                opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.08] }),
              },
            ]}
          />
          <Image source={LOGO_IMAGE} style={styles.logo} resizeMode="contain" />
        </Animated.View>
        <Animated.Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          ZenPae
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#8FEA4A',
  },
  logo: {
    width: 140,
    height: 140,
  },
  tagline: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
