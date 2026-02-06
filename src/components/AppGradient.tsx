import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradient, colors } from '../theme/theme';

interface AppGradientProps extends ViewProps {
  children: React.ReactNode;
  applyGradient?: boolean;
}

export const AppGradient: React.FC<AppGradientProps> = ({
  children,
  applyGradient = true,
  style,
  ...props
}) => {
  if (!applyGradient) {
    return (
      <View
        style={[{ flex: 1, backgroundColor: colors.background }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradient.colors as unknown as readonly [string, string, ...string[]]} // Ensure colors is a valid array of strings
      locations={gradient.locations as unknown as readonly [number, number, ...number[]]} // Ensure locations is a valid array of numbers
      start={gradient.start}
      end={gradient.end}
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default AppGradient;
