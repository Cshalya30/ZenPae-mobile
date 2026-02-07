import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Animated,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Text from '../components/Text';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line } from 'react-native-svg';
import Screen from '../components/Screen';
import { useFinanceStore, type DreamGoal } from '../store/financeStore';
import { formatCurrency, parseAmount } from '../utils/format';
import { useTheme } from '../theme/useTheme';

const EMOJIS = [
  '✨', '🚀', '💻', '🏝️', '🏖️', '🎧', '🎯', '🧳', '🏍️', '📸', '🪙', '🧠',
  '🏡', '🎓', '🛫', '🚗', '⌚', '🎁', '🏋️', '🍀', '🌙', '🪄', '🎮', '🧿',
];

export const DreamBuyScreen: React.FC = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { dreams, activeDreamId, saveDream, setActiveDream, savings } = useFinanceStore();

  const activeDream = useMemo(
    () => dreams.find((d) => d.id === activeDreamId) ?? dreams[0],
    [dreams, activeDreamId]
  );

  const [emoji, setEmoji] = useState(activeDream?.emoji ?? '✨');
  const [name, setName] = useState(activeDream?.name ?? '');
  const [description, setDescription] = useState(activeDream?.description ?? '');
  const [targetAmount, setTargetAmount] = useState(
    activeDream?.targetAmount ? String(activeDream.targetAmount) : ''
  );
  const [allocation, setAllocation] = useState(activeDream?.allocationPct ?? 7);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const goalValue = parseAmount(targetAmount || '0');
  const savedValue = Math.round((activeDream?.saved ?? 0) * 100) / 100;
  const progress = goalValue > 0 ? Math.min(savedValue / goalValue, 1) : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    if (!activeDream) return;
    setEmoji(activeDream.emoji ?? '✨');
    setName(activeDream.name ?? '');
    setDescription(activeDream.description ?? '');
    setTargetAmount(activeDream.targetAmount ? String(activeDream.targetAmount) : '');
    setAllocation(activeDream.allocationPct ?? 7);
  }, [activeDream?.id]);

  const handleSave = () => {
    const id = activeDream?.id ?? Date.now().toString();
    const goal: DreamGoal = {
      id,
      name: name.trim() || 'My Dream',
      description: description.trim(),
      targetAmount: goalValue || 10000,
      saved: activeDream?.saved ?? 0,
      milestones: [
        { label: '25% reached', hit: false },
        { label: '60% reached', hit: false },
        { label: 'Goal achieved', hit: false },
      ],
      emoji,
      allocationPct: allocation,
    };
    saveDream(goal);
    setActiveDream(id);
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Dream Buy</Text>
      <Text style={[styles.subTitle, { color: theme.colors.textSecondary }]}>
        Turn everyday savings into something meaningful
      </Text>

      <View style={styles.tabRow}>
        {[
          {
            label: 'Emerald',
            colors: ['#0F3D2E', '#99FF32'],
            pattern: 'grid' as const,
          },
          {
            label: 'Blue',
            colors: ['#0B1C2D', '#1FA2A6'],
            pattern: 'lines' as const,
          },
          {
            label: 'Amber',
            colors: ['#FF8A00', '#FF4D4D', '#6EE7B7'],
            pattern: 'contour' as const,
          },
        ].map((tab, index) => {
          const active = activeTab === index;
          return (
            <Pressable key={tab.label} style={styles.tabWrap} onPress={() => setActiveTab(index)}>
              <LinearGradient
                colors={tab.colors as unknown as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.tab, { opacity: active ? 1 : 0.75 }]}
              >
                {tab.pattern === 'grid' ? (
                  <Svg style={styles.tabOverlay} width="100%" height="100%">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Line
                        key={`g-${i}`}
                        x1={-20 + i * 24}
                        y1={0}
                        x2={40 + i * 24}
                        y2={80}
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth={1}
                      />
                    ))}
                  </Svg>
                ) : null}
                {tab.pattern === 'lines' ? (
                  <Svg style={styles.tabOverlay} width="100%" height="100%">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Line
                        key={`l-${i}`}
                        x1={-10}
                        y1={i * 16}
                        x2={140}
                        y2={i * 16 + 24}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={1}
                      />
                    ))}
                  </Svg>
                ) : null}
                {tab.pattern === 'contour' ? (
                  <Svg style={styles.tabOverlay} width="100%" height="100%">
                    <Circle cx="30%" cy="35%" r="20%" stroke="rgba(255,255,255,0.05)" strokeWidth={1} fill="none" />
                    <Circle cx="30%" cy="35%" r="32%" stroke="rgba(255,255,255,0.05)" strokeWidth={1} fill="none" />
                    <Circle cx="30%" cy="35%" r="44%" stroke="rgba(255,255,255,0.05)" strokeWidth={1} fill="none" />
                  </Svg>
                ) : null}
                <Text style={styles.tabLabel}>{tab.label}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.cardWrap, { width: width - theme.spacing.lg * 2 }]}>
        <BlurView intensity={22} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={[styles.mainCard, { borderColor: theme.colors.border }]}>
          <View style={styles.nameRow}>
            <TouchableOpacity
              style={[styles.emojiButton, { backgroundColor: theme.colors.accentSoft }]}
              onPress={() => setShowEmojiPicker(true)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name your dream..."
              placeholderTextColor={theme.colors.muted}
              style={[styles.nameInput, { color: theme.colors.textPrimary }]}
            />
          </View>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Why is this important to you?"
            placeholderTextColor={theme.colors.muted}
            style={[styles.descriptionInput, { color: theme.colors.textSecondary }]}
            multiline
          />

          <View style={styles.amountRow}>
            <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Target amount</Text>
            <View style={[styles.amountInputWrap, { borderColor: theme.colors.border }]}>
              <Text style={[styles.amountPrefix, { color: theme.colors.textSecondary }]}>₹</Text>
              <TextInput
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.muted}
                style={[styles.amountInput, { color: theme.colors.textPrimary }]}
              />
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                Saved {formatCurrency(savedValue)} of {formatCurrency(goalValue || 0)}
              </Text>
              <Text style={[styles.progressPct, { color: theme.colors.accent }]}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: 'rgba(153,255,50,0.10)' }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: 'rgba(153,255,50,0.45)',
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressHint, { color: theme.colors.textSecondary }]}>
              You're {Math.round(progress * 100)}% closer to your dream
            </Text>
          </View>

          <View style={styles.sliderSection}>
            <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>
              Redirect savings to this dream
            </Text>
            <View style={styles.sliderRow}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={15}
                step={1}
                value={allocation}
                minimumTrackTintColor={theme.colors.accent}
                maximumTrackTintColor={theme.progress.track}
                thumbTintColor={theme.colors.accent}
                onValueChange={setAllocation}
              />
              <Text style={[styles.sliderValue, { color: theme.colors.textPrimary }]}>{allocation}%</Text>
            </View>
            <Text style={[styles.sliderHint, { color: theme.colors.textSecondary }]}>
              {allocation}% of every saving will go toward this goal
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.cta, { backgroundColor: theme.colors.accent }]}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <Text style={[styles.ctaText, { color: theme.colors.black }]}>Save Dream</Text>
          </TouchableOpacity>
        </BlurView>
      </View>

      <View style={styles.linkedRow}>
        <Text style={[styles.linkedText, { color: theme.colors.textSecondary }]}>
          Linked to savings: {formatCurrency(savings)}
        </Text>
      </View>

      <Modal visible={showEmojiPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surfaceStrong }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Pick an emoji</Text>
            <FlatList
              data={EMOJIS}
              numColumns={6}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.emojiGrid}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.emojiCell, { backgroundColor: theme.colors.surfaceSecondary }]}
                  onPress={() => {
                    setEmoji(item);
                    setShowEmojiPicker(false);
                  }}
                >
                  <Text style={styles.emojiCellText}>{item}</Text>
                </Pressable>
              )}
            />
            <TouchableOpacity style={[styles.modalClose, { backgroundColor: theme.colors.accent }]} onPress={() => setShowEmojiPicker(false)}>
              <Text style={[styles.modalCloseText, { color: theme.colors.black }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  subTitle: {
    marginTop: 4,
    fontSize: 13,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  tabWrap: {
    flex: 1,
  },
  tab: {
    height: 64,
    borderRadius: 18,
    justifyContent: 'flex-end',
    padding: 10,
    overflow: 'hidden',
  },
  tabOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  tabLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardWrap: {
    alignSelf: 'center',
  },
  mainCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 22,
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  descriptionInput: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
  },
  amountRow: {
    marginTop: 14,
  },
  amountLabel: {
    fontSize: 12,
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  amountPrefix: {
    fontSize: 18,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
  },
  progressSection: {
    marginTop: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
  },
  progressHint: {
    marginTop: 6,
    fontSize: 12,
  },
  sliderSection: {
    marginTop: 16,
  },
  sliderLabel: {
    fontSize: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 40,
    textAlign: 'right',
    fontWeight: '600',
  },
  sliderHint: {
    fontSize: 12,
  },
  cta: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
  },
  linkedRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  linkedText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    padding: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  emojiGrid: {
    paddingBottom: 8,
  },
  emojiCell: {
    width: '16.6%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 6,
  },
  emojiCellText: {
    fontSize: 20,
  },
  modalClose: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DreamBuyScreen;
