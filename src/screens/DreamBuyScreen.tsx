import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, card, progress, button } from '../theme/theme';
import Screen from '../components/Screen';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency } from '../utils/format';

export const DreamBuyScreen: React.FC = () => {
  const pulseAnim = new Animated.Value(1);
  const user = useFinanceStore((state) => state.user);
  const dreams = useFinanceStore((state) => state.dreams);
  const activeDreamId = useFinanceStore((state) => state.activeDreamId);
  const addDream = useFinanceStore((state) => state.addDream);
  const setActiveDream = useFinanceStore((state) => state.setActiveDream);
  const savings = useFinanceStore((state) => state.savings);

  const templates = [
    { id: 'travel', label: 'Travel', icon: 'T', target: 25000 },
    { id: 'tech', label: 'Tech', icon: 'C', target: 18000 },
    { id: 'gadgets', label: 'Gadgets', icon: 'G', target: 12000 },
    { id: 'fitness', label: 'Fitness', icon: 'F', target: 15000 },
  ];

  const createDreamFromTemplate = (templateId?: string) => {
    const selected = templates.find((t) => t.id === templateId) ?? templates[0];
    const now = Date.now();
    const newDream = {
      id: `${selected.id}-${now}`,
      name: `${selected.label} Dream`,
      description: `A focused ${selected.label.toLowerCase()} goal tailored for you.`,
      targetAmount: selected.target,
      saved: 0,
      milestones: [
        { label: 'Kickoff', hit: false },
        { label: 'Halfway', hit: false },
        { label: 'Finish', hit: false },
      ],
      templateId: selected.id,
    };

    addDream(newDream);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <Screen>
      <Text style={styles.screenTitle}>Your Dreams</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Hey {user?.name ?? 'there'} *</Text>
        <Text style={styles.heroSubtitle}>
          Build a dream board. Track goals. Let Zenpae nudge your progress.
        </Text>
        <View style={styles.heroMetaRow}>
          <Text style={styles.heroMeta}>
            Linked to savings: {formatCurrency(savings)}
          </Text>
        </View>
      </View>

      <View style={styles.templateSection}>
        <Text style={styles.templateTitle}>Dream Templates</Text>
        <View style={styles.templateRow}>
          {templates.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.templateCard}
              activeOpacity={0.85}
              onPress={() => createDreamFromTemplate(t.id)}
            >
              <View style={styles.templateIconWrap}>
                <Text style={styles.templateIcon}>{t.icon}</Text>
              </View>
              <Text style={styles.templateLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Momentum Timeline</Text>
        <View style={styles.timelineRow}>
          <View style={styles.timelineStep}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>1</Text>
            </View>
            <Text style={styles.timelineLabel}>Set Goal</Text>
          </View>
          <View style={styles.timelineStep}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>2</Text>
            </View>
            <Text style={styles.timelineLabel}>Auto-Save</Text>
          </View>
          <View style={styles.timelineStep}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>3</Text>
            </View>
            <Text style={styles.timelineLabel}>Redeem</Text>
          </View>
        </View>
        <Text style={styles.timelineSub}>
          Small wins stack up fast when you keep your streak alive.
        </Text>
      </View>

      {dreams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No dreams yet</Text>
          <Text style={styles.emptyText}>
            Add your first goal and turn round-ups into something memorable.
          </Text>
          <TouchableOpacity
            style={styles.emptyPill}
            activeOpacity={0.9}
            onPress={() => createDreamFromTemplate()}
          >
            <LinearGradient
              colors={button.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emptyPillGradient}
            >
              <Text style={styles.emptyPillText}>Create a Dream</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        dreams.map((dream) => (
          <TouchableOpacity
            key={dream.id}
            style={[
              styles.dreamCard,
              dream.id === activeDreamId && styles.dreamCardActive,
            ]}
            activeOpacity={0.9}
            onPress={() => setActiveDream(dream.id)}
          >
            <View style={styles.dreamHeader}>
              <Text style={styles.dreamTitle}>{dream.name}</Text>
              <Text style={styles.dreamAmount}>
                {formatCurrency(dream.targetAmount)}
              </Text>
            </View>

            <Text style={styles.dreamDescription}>{dream.description}</Text>
            <Text style={styles.dreamProgressText}>
              Saved {formatCurrency(dream.saved)} ?{' '}
              {Math.round(
                (dream.saved / Math.max(dream.targetAmount, 1)) * 100
              )}%
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(dream.saved / dream.targetAmount) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.milestonesContainer}>
              {dream.milestones?.map((milestone: any, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.milestone,
                    milestone.hit && styles.milestoneHit,
                  ]}
                >
                  <View
                    style={[
                      styles.milestoneIndicator,
                      milestone.hit && styles.milestoneIndicatorHit,
                    ]}
                  />
                  <Text style={styles.milestoneText}>{milestone.label}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  } as any,
  heroCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
    marginBottom: spacing.lg,
  } as any,
  heroTitle: {
    ...typography.sectionTitle,
  } as any,
  heroSubtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  } as any,
  heroMetaRow: {
    marginTop: spacing.sm,
  } as any,
  heroMeta: {
    ...typography.small,
    color: colors.accent,
  } as any,
  templateSection: {
    marginBottom: spacing.lg,
  } as any,
  templateTitle: {
    ...typography.label,
    marginBottom: spacing.sm,
  } as any,
  templateRow: {
    flexDirection: 'row',
    gap: 12,
  } as any,
  templateCard: {
    flex: 1,
    backgroundColor: card.backgroundColor,
    borderRadius: 16,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: card.shadowColor,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    boxShadow: card.boxShadow,
  } as any,
  templateIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  } as any,
  templateIcon: {
    fontSize: 18,
  } as any,
  templateLabel: {
    ...typography.bodySecondary,
  } as any,
  timelineCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: spacing.md,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
    marginBottom: spacing.lg,
  } as any,
  timelineTitle: {
    ...typography.sectionTitle,
  } as any,
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  } as any,
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  } as any,
  timelineIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  } as any,
  timelineIconText: {
    ...typography.small,
    color: colors.accent,
    fontWeight: '700',
  } as any,
  timelineLabel: {
    ...typography.small,
  } as any,
  timelineSub: {
    ...typography.bodySecondary,
    marginTop: spacing.md,
  } as any,
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
  } as any,
  emptyTitle: {
    ...typography.sectionTitle,
  } as any,
  emptyText: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  } as any,
  emptyPill: {
    marginTop: spacing.md,
    borderRadius: button.borderRadius,
    overflow: 'hidden',
  } as any,
  emptyPillGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: button.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  emptyPillText: {
    ...typography.button,
    color: colors.black,
  } as any,
  dreamCard: {
    backgroundColor: card.backgroundColor,
    borderRadius: card.borderRadius,
    padding: card.padding,
    marginBottom: spacing.lg,
    borderWidth: card.borderWidth,
    borderColor: card.borderColor,
    shadowColor: card.shadowColor,
    shadowOpacity: card.shadowOpacity,
    shadowRadius: card.shadowRadius,
    shadowOffset: card.shadowOffset,
    elevation: card.elevation,
    boxShadow: card.boxShadow,
  } as any,
  dreamCardActive: {
    borderColor: 'rgba(153,255,50,0.4)',
  } as any,
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  } as any,
  dreamTitle: {
    ...typography.sectionTitle,
    flex: 1,
  } as any,
  dreamAmount: {
    ...typography.balance,
  } as any,
  dreamDescription: {
    ...typography.bodySecondary,
    marginBottom: spacing.sm,
  } as any,
  dreamProgressText: {
    ...typography.small,
    color: colors.textSecondary,
  } as any,
  progressContainer: {
    marginVertical: spacing.md,
  } as any,
  progressTrack: {
    height: progress.height,
    backgroundColor: progress.track,
    borderRadius: progress.radius,
    overflow: 'hidden',
  } as any,
  progressFill: {
    height: progress.height,
    backgroundColor: colors.accent,
    borderRadius: progress.radius,
  } as any,
  milestonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  } as any,
  milestone: {
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as any,
  milestoneHit: {
    backgroundColor: colors.accent,
  } as any,
  milestoneIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textPrimary,
    marginRight: spacing.sm,
  } as any,
  milestoneIndicatorHit: {
    backgroundColor: colors.black,
  } as any,
  milestoneText: {
    ...typography.small,
    color: colors.textPrimary,
  } as any,
});

export default DreamBuyScreen;
