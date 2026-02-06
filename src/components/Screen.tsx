import React from 'react';
import { ScrollView, View } from 'react-native';
import { spacing } from '../theme/theme';
import AppGradient from './AppGradient';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({ children, scrollable = true }) => {
  const content = (
    <View style={{ padding: spacing.lg, flex: 1 }}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <AppGradient>
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </AppGradient>
    );
  }

  return <AppGradient>{content}</AppGradient>;
};

export default Screen;