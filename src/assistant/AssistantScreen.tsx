import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, card, input } from '../theme/theme';
import Screen from '../components/Screen';
import NudgeCard from './NudgeCard';
import { useFinanceStore } from '../store/financeStore';
import { askAI } from './aiService';
import {
  answerFromData,
  classifyIntent,
  generateInsights,
  summarizeFinanceData,
} from './assistantLogic';
import type { AssistantInsight } from './assistantLogic';
import type { ComponentProps } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { transactions, analytics, user } = useFinanceStore();

  type NudgeType = ComponentProps<typeof NudgeCard>['type'];
  const nudges = useMemo<AssistantInsight[]>(() => {
    if (transactions.length === 0) {
      return [
        {
          id: 'first-nudge',
          type: 'info' as NudgeType,
          title: 'Start small',
          message: 'Make your first payment to unlock tailored insights.',
        },
      ];
    }

    const base = generateInsights(transactions);
    const topCategory = Object.entries(
      transactions.reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      base.push({
        id: 'top-category',
        type: 'info' as NudgeType,
        title: 'Top category',
        message: `Most spend is on ${topCategory[0]} this period.`,
      });
    }

    if (analytics.totalSaved > 0) {
      base.push({
        id: 'roundup',
        type: 'positive' as NudgeType,
        title: 'Round-ups working',
        message: `You have saved \u20B9${analytics.totalSaved.toFixed(
          0
        )} via round-ups.`,
      });
    }

    return base.slice(0, 3);
  }, [transactions, analytics.totalSaved]);

  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsSending(true);

    const intent = classifyIntent(trimmed);
    const dataAnswer = answerFromData(intent, transactions);

    let reply = dataAnswer;
    if (!reply) {
      const context = [
        `User: ${user?.name ?? 'Unknown'}`,
        `Wallet balance: \u20B9${user?.balance ?? 0}`,
        `Total spent: \u20B9${analytics.totalSpent}`,
        `Total saved: \u20B9${analytics.totalSaved}`,
        `Monthly savings: \u20B9${user?.monthlySavings ?? 0}`,
        summarizeFinanceData(transactions),
      ].join('\n');

      reply = await askAI({ context, question: trimmed });
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: reply ?? 'Tell me more about your goal and I will tailor a plan.',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsSending(false);
  };

  return (
    <Screen>
      <Text style={styles.screenTitle}>Finance Assistant</Text>

      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerTitle}>Hey {user?.name ?? 'there'}</Text>
          <Text style={styles.headerSubtitle}>
            Ask for category tips, savings nudges, or spending summaries.
          </Text>
        </View>
        <View style={styles.headerChip}>
          <Text style={styles.headerChipText}>AI Mode</Text>
        </View>
      </View>

      <View style={styles.nudgesSection}>
        <Text style={styles.sectionLabel}>Insights for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nudges.map((nudge) => (
            <NudgeCard
              key={nudge.id}
              type={nudge.type}
              title={nudge.title}
              message={nudge.message}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.chatContainer}>
        <Text style={styles.sectionLabel}>Chat</Text>
        {messages.length === 0 ? (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>
              Start a conversation about your finances!
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.isUser ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.isUser ? styles.userText : styles.assistantText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>
            {isSending ? '...' : '\u2192'}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  } as any,
  nudgesSection: {
    marginBottom: spacing.lg,
  } as any,
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.md,
  } as any,
  headerCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    boxShadow: card.boxShadow,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  } as any,
  headerTitle: {
    ...typography.sectionTitle,
  } as any,
  headerSubtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  } as any,
  headerChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(153,255,50,0.12)',
  } as any,
  headerChipText: {
    ...typography.small,
    color: colors.accent,
    fontWeight: '600',
  } as any,
  chatContainer: {
    flex: 1,
    marginBottom: spacing.lg,
  } as any,
  emptyChat: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  } as any,
  emptyChatText: {
    ...typography.bodySecondary,
  } as any,
  messageBubble: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  } as any,
  userBubble: {
    backgroundColor: colors.accent,
    alignSelf: 'flex-end',
    borderRadius: 12,
    padding: spacing.md,
    maxWidth: '80%',
  } as any,
  assistantBubble: {
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
    borderRadius: 12,
    padding: spacing.md,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  } as any,
  messageText: {
    ...typography.body,
  } as any,
  userText: {
    color: colors.black,
  } as any,
  assistantText: {
    color: colors.textPrimary,
  } as any,
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: input.background,
    borderRadius: input.borderRadius,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: input.borderColor,
  } as any,
  input: {
    flex: 1,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  } as any,
  sendButton: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  } as any,
  sendButtonDisabled: {
    opacity: 0.6,
  } as any,
  sendButtonText: {
    color: colors.accent,
    fontSize: 18,
  } as any,
});

export default AssistantScreen;
