import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppGradient from './AppGradient';
import { useTheme } from '../theme/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  noPadding?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = true,
  noPadding = false,
}) => {
  const theme = useTheme();
  const contentPadding = noPadding ? 0 : theme.spacing.lg;
  const content = (
    <View style={{ paddingHorizontal: contentPadding, paddingTop: contentPadding, flex: 1 }}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <AppGradient>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        </SafeAreaView>
      </AppGradient>
    );
  }

  return (
    <AppGradient>
      <SafeAreaView style={{ flex: 1 }}>{content}</SafeAreaView>
    </AppGradient>
  );
};

export default Screen;
