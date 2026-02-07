import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Text from '../components/Text';
import { BlurView } from 'expo-blur';
import Screen from '../components/Screen';
import { useFinanceStore } from '../store/financeStore';
import { askAI } from './aiService';
import { answerFromData, buildNudgePayload, classifyIntent, generateInsights, summarizeFinanceData, type AssistantInsight } from './assistantLogic';
import { useTheme } from '../theme/useTheme';
import NudgeCard from './NudgeCard';

const ACTION_CHIPS = [
  'Show me where I overspend',
  'How can I save more this month?',
  'Explain my grocery spend',
  'Optimize my subscriptions',
];

export const AssistantScreen: React.FC = () => {
  const theme = useTheme();
  const { transactions, analytics, user } = useFinanceStore();
  const [inputText, setInputText] = useState('');
  const [activeInsight, setActiveInsight] = useState<AssistantInsight | null>(null);
  const [isSending, setIsSending] = useState(false);

  const insights = useMemo(() => {
    if (transactions.length === 0) {
      return [
        {
          id: 'start',
          condition: 'Neutral',
          confidence: 0.6,
          accentColor: '#B6E35C',
          messageTitle: 'Start with a payment',
          messageBody: 'Make your first payment to unlock personalized insights.',
          cta: ['Show me where I overspend', 'Help me save smarter'],
        },
      ];
    }
    const base = generateInsights(transactions, analytics, user);
    return base.slice(0, 3);
  }, [transactions, analytics, user]);

  const handleAction = async (prompt: string) => {
    if (isSending) return;
    setIsSending(true);

    const intent = classifyIntent(prompt);
    const dataAnswer = answerFromData(intent, transactions);
    if (dataAnswer) {
      const localNudge = buildNudgePayload({
        transactions,
        analytics,
        user,
        messageOverride: dataAnswer,
      });
      setActiveInsight({ ...localNudge, id: 'deep-dive' });
      setIsSending(false);
      return;
    }

    const context = [
      `User: ${user?.name ?? 'Unknown'}`,
      `Wallet balance: ${user?.balance ?? 0}`,
      `Total spent: ${analytics.totalSpent}`,
      `Total saved: ${analytics.totalSaved}`,
      `Monthly savings: ${user?.monthlySavings ?? 0}`,
      summarizeFinanceData(transactions),
    ].join('\n');
    const reply = await askAI({ context, question: prompt });
    setActiveInsight({ ...reply, id: 'deep-dive' });
    setIsSending(false);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Hey {user?.name ?? 'Chirantan'}
        </Text>
        <Text style={[styles.headerSub, { color: theme.colors.textSecondary }]}>
          Here's what I noticed about your money
        </Text>
        <Text style={[styles.headerMeta, { color: theme.colors.muted }]}>
          Smart insights - Private - Secure
        </Text>
      </View>

      <View style={styles.insightGrid}>
        {insights.map((insight) => (
          <TouchableOpacity
            key={insight.id}
            activeOpacity={0.8}
            onPress={() => setActiveInsight(insight)}
          >
            <NudgeCard
              accentColor={insight.accentColor}
              title={insight.messageTitle}
              message={insight.messageBody}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>Quick actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {ACTION_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, { borderColor: theme.colors.border }]}
            onPress={() => handleAction(chip)}
          >
            <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeInsight ? (
        <BlurView
          intensity={20}
          tint={theme.mode === 'dark' ? 'dark' : 'light'}
          style={[
            styles.deepDive,
            {
              borderColor: theme.colors.border,
              shadowColor: activeInsight.accentColor,
            },
          ]}
        >
          <Text style={[styles.deepTitle, { color: theme.colors.textPrimary }]}>
            {activeInsight.messageTitle}
          </Text>
          <Text style={[styles.deepBody, { color: theme.colors.textSecondary }]}>
            {activeInsight.messageBody}
          </Text>
          <View style={styles.ctaRow}>
            {activeInsight.cta.slice(0, 2).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.ctaChip,
                  {
                    borderColor: activeInsight.accentColor,
                  },
                ]}
              >
                <Text style={[styles.ctaText, { color: activeInsight.accentColor }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      ) : null}

      <View style={[styles.commandBar, { borderColor: theme.colors.border, backgroundColor: theme.input.background }]}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about your spending, savings, or goals..."
          placeholderTextColor={theme.colors.muted}
          style={[styles.commandInput, { color: theme.colors.textPrimary }]}
          onSubmitEditing={() => {
            if (inputText.trim()) {
              handleAction(inputText.trim());
              setInputText('');
            }
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (inputText.trim()) {
              handleAction(inputText.trim());
              setInputText('');
            }
          }}
          disabled={isSending}
        >
          <Text style={[styles.sendText, { color: theme.colors.accent }]}>{isSending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerSub: {
    marginTop: 4,
    fontSize: 13,
  },
  headerMeta: {
    marginTop: 6,
    fontSize: 11,
  },
  insightGrid: {
    gap: 10,
    marginBottom: 16,
  },
  insightCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 0.5,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightBody: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
  },
  sectionLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  chipRow: {
    marginBottom: 16,
  },
  chip: {
    borderRadius: 18,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deepDive: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 0.5,
    marginBottom: 16,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  deepTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  deepBody: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  ctaChip: {
    borderRadius: 16,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  commandBar: {
    borderRadius: 14,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  commandInput: {
    flex: 1,
    fontSize: 13,
  },
  sendText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default AssistantScreen;
