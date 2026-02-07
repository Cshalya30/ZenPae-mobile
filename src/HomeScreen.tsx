import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import AccountCard from '../components/AccountCard';
import WealthStack from '../components/WealthStack';
import DreamBuy from '../components/DreamBuy';
import {
  USER_PROFILE,
  MOCK_WEALTH_STACK,
  MOCK_DREAM_BUY,
} from '../constants/mockData';

export default function HomeScreen() {
  const [dreamBuy, setDreamBuy] = useState(MOCK_DREAM_BUY);

  const handleUpdateDreamBuy = (amount: number) => {
    setDreamBuy(prev => ({
      ...prev,
      currentAmount: Math.min(prev.currentAmount + amount, prev.targetAmount),
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Card */}
        <AccountCard
          balance={USER_PROFILE.balance}
          accountNumber={USER_PROFILE.accountNumber}
          userName={USER_PROFILE.name}
        />

        {/* Wealth Stack */}
        <WealthStack items={MOCK_WEALTH_STACK} />

        {/* Dream Buy */}
        <DreamBuy
          dreamBuy={dreamBuy}
          onUpdateProgress={handleUpdateDreamBuy}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: 100,
  },
});
