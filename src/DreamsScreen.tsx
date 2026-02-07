import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface Dream {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  colorTheme: 'emerald' | 'blue' | 'amber';
  percentage: number;
}

const EmeraldGridPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 10 }).map((_, i) => (
      <Line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="white" strokeWidth="1" opacity="0.07" />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <Line key={`h${i}`} x1="0" y1={i * 40} x2="100%" y2={i * 40} stroke="white" strokeWidth="1" opacity="0.07" />
    ))}
  </Svg>
);

const BlueIsometricPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 15 }).map((_, i) => (
      <Line key={i} x1={i * 25} y1="0" x2={i * 25 + 100} y2="100%" stroke="white" strokeWidth="1" opacity="0.06" />
    ))}
  </Svg>
);

const TopographicPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    <Circle cx="65%" cy="45%" r="80" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="65" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="50" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="35" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
    <Circle cx="65%" cy="45%" r="20" stroke="white" strokeWidth="1" opacity="0.05" fill="none" />
  </Svg>
);

const DreamCard = ({ dream, onPress }: { dream: Dream; onPress: () => void }) => {
  const getGradientColors = (theme: string): [string, string] => {
    const gradients = {
      emerald: ['#0F3D2E', '#99FF32'],
      blue: ['#0B1C2D', '#1FA2A6'],
      amber: ['#3D2817', '#FFA726'],
    };
    return gradients[theme as keyof typeof gradients] || gradients.emerald;
  };

  const getPattern = (theme: string) => {
    const patterns = {
      emerald: <EmeraldGridPattern />,
      blue: <BlueIsometricPattern />,
      amber: <TopographicPattern />,
    };
    return patterns[theme as keyof typeof patterns] || patterns.emerald;
  };

  return (
    <Pressable onPress={onPress} style={styles.dreamCard}>
      <LinearGradient
        colors={getGradientColors(dream.colorTheme)}
        style={styles.dreamCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {getPattern(dream.colorTheme)}
        <View style={styles.dreamCardContent}>
          <Text style={styles.dreamCardName}>{dream.name}</Text>
          <Text style={styles.dreamCardTarget}>₹{dream.targetAmount.toLocaleString('en-IN')}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${dream.percentage}%` }]} />
            </View>
            <Text style={styles.progressText}>{dream.percentage}% complete</Text>
          </View>
          
          <View style={styles.dreamCardFooter}>
            <Text style={styles.dreamCardSaved}>Saved: ₹{dream.currentAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.dreamCardRemaining}>₹{(dream.targetAmount - dream.currentAmount).toLocaleString('en-IN')} to go</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default function DreamsScreen() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDreamName, setNewDreamName] = useState('');
  const [newDreamAmount, setNewDreamAmount] = useState('');
  const [newDreamPercentage, setNewDreamPercentage] = useState(6);

  const getNextColorTheme = (): 'emerald' | 'blue' | 'amber' => {
    const themes: ('emerald' | 'blue' | 'amber')[] = ['emerald', 'blue', 'amber'];
    return themes[dreams.length % 3];
  };

  const handleCreateDream = () => {
    if (!newDreamName || !newDreamAmount) {
      alert('Please enter dream name and target amount');
      return;
    }

    const targetAmount = parseFloat(newDreamAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newDream: Dream = {
      id: Date.now().toString(),
      name: newDreamName,
      targetAmount: targetAmount,
      currentAmount: 0,
      colorTheme: getNextColorTheme(),
      percentage: 0,
    };

    setDreams([...dreams, newDream]);
    setNewDreamName('');
    setNewDreamAmount('');
    setNewDreamPercentage(6);
    setShowCreateModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dream Buy</Text>
          <Text style={styles.subtitle}>Turn everyday savings into something meaningful</Text>
        </View>

        {dreams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyTitle}>No Dreams Yet</Text>
            <Text style={styles.emptyText}>Create your first dream to start saving!</Text>
          </View>
        ) : (
          <View style={styles.dreamsContainer}>
            {dreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onPress={() => {
                  // You can add navigation to dream details here
                }}
              />
            ))}
          </View>
        )}

        <Pressable style={styles.createButton} onPress={() => setShowCreateModal(true)}>
          <LinearGradient
            colors={['#99FF32', '#7DD628']}
            style={styles.createButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.createButtonText}>+ Create New Dream</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* Create Dream Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Dream</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dream Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Goa Trip"
                placeholderTextColor={COLORS.textTertiary}
                value={newDreamName}
                onChangeText={setNewDreamName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textTertiary}
                  value={newDreamAmount}
                  onChangeText={setNewDreamAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Redirect Savings: {newDreamPercentage}%</Text>
              <Text style={styles.inputHint}>
                {newDreamPercentage}% of every saving will go toward this goal
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewDreamName('');
                  setNewDreamAmount('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButtonSave} onPress={handleCreateDream}>
                <LinearGradient
                  colors={['#99FF32', '#7DD628']}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonSaveText}>Save Dream</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  dreamsContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  dreamCard: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    ...SHADOWS.card,
  },
  dreamCardGradient: {
    padding: SPACING.xl,
  },
  dreamCardContent: {
    gap: SPACING.md,
  },
  dreamCardName: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  dreamCardTarget: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  progressContainer: {
    marginTop: SPACING.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 4,
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  dreamCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  dreamCardSaved: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  dreamCardRemaining: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: 'rgba(255,255,255,0.6)',
  },
  createButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  createButtonGradient: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xxl,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  inputHint: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textPrimary,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  currencySymbol: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  modalButtonCancel: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  modalButtonCancelText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  modalButtonSave: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    padding: SPACING.lg,
  },
  modalButtonSaveText: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.background,
    textAlign: 'center',
  },
});
