import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';

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
  const theme = useTheme();
  if (!applyGradient) {
    return (
      <View
        style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradient.colors as unknown as readonly [string, string, ...string[]]} // Ensure colors is a valid array of strings
      locations={theme.gradient.locations as unknown as readonly [number, number, ...number[]]} // Ensure locations is a valid array of numbers
      start={theme.gradient.start}
      end={theme.gradient.end}
      style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default AppGradient;
