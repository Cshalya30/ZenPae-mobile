import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { analyzeFinancialHealth, generateInsight, AIAssessment } from '../utils/aiAssistant';
import { MOCK_TRANSACTIONS, SPENDING_CATEGORIES, MOCK_SUBSCRIPTIONS } from '../constants/mockData';

export default function AIAssistantScreen() {
  const [assessment, setAssessment] = useState<AIAssessment | null>(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    // Calculate financial metrics
    const totalSpending = SPENDING_CATEGORIES.reduce((sum, cat) => sum + cat.amount, 0);
    const savingsRate = 2340; // From USER_PROFILE
    
    const analysis = analyzeFinancialHealth(totalSpending, savingsRate);
    setAssessment(analysis);
    
    setInsight(generateInsight(MOCK_TRANSACTIONS));
  }, []);

  if (!assessment) return null;

  const getConditionGradient = (condition: string): [string, string] => {
    const gradients: Record<string, [string, string]> = {
      'Very Chill': ['#1F3D2E', '#0E1E17'],
      'Chill': ['#2D3D17', '#0E1E0F'],
      'Neutral': ['#3D3717', '#1E1E0F'],
      'Mild Concern': ['#3D2D17', '#1E1E0F'],
      'Concerning': ['#3D1F17', '#1E0E0F'],
      'Critical': ['#3D1717', '#1E0E0E'],
    };
    return gradients[condition] || ['#1E1E1E', '#0E0E0E'];
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Financial Co-Pilot</Text>

        {/* Condition Card */}
        <LinearGradient
          colors={getConditionGradient(assessment.condition)}
          style={styles.conditionCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.conditionHeader}>
            <View>
              <Text style={styles.conditionLabel}>Current State</Text>
              <Text style={styles.conditionTitle}>{assessment.condition}</Text>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {Math.round(assessment.confidence * 100)}%
              </Text>
            </View>
          </View>

          <View style={[styles.conditionIndicator, { backgroundColor: assessment.accentColor }]} />

          <Text style={styles.messageTitle}>{assessment.messageTitle}</Text>
          <Text style={styles.messageBody}>{assessment.messageBody}</Text>

          {/* CTAs */}
          <View style={styles.ctaContainer}>
            {assessment.cta.map((cta, index) => (
              <Pressable
                key={index}
                style={[
                  styles.ctaButton,
                  { borderColor: assessment.accentColor + '40' },
                ]}
              >
                <Text style={[styles.ctaText, { color: assessment.accentColor }]}>
                  {cta}
                </Text>
              </Pressable>
            ))}
          </View>
        </LinearGradient>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Insights</Text>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>💡</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Pattern Detected</Text>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>📊</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Savings Opportunity</Text>
              <Text style={styles.insightText}>
                You could save ₹{Math.round(MOCK_SUBSCRIPTIONS.reduce((sum, s) => sum + s.amount, 0) * 0.3)} by reviewing unused subscriptions
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightIcon}>🎯</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Dream Buy Progress</Text>
              <Text style={styles.insightText}>
                At current pace, you'll reach your goal in 8 months
              </Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Actions</Text>
          
          <Pressable style={styles.actionCard}>
            <LinearGradient
              colors={['rgba(153,255,50,0.1)', 'rgba(153,255,50,0.05)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionTitle}>Optimize Round-Ups</Text>
              <Text style={styles.actionDescription}>
                Increase round-up percentage to 5% for faster Dream Buy completion
              </Text>
              <Text style={styles.actionCta}>Configure →</Text>
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <LinearGradient
              colors={['rgba(31,162,166,0.1)', 'rgba(31,162,166,0.05)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionTitle}>Smart Budget Alert</Text>
              <Text style={styles.actionDescription}>
                Set spending limits for Food & Dining category
              </Text>
              <Text style={styles.actionCta}>Set Alert →</Text>
            </LinearGradient>
          </Pressable>
        </View>
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
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  conditionCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xxxl,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    ...SHADOWS.elevated,
  },
  conditionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  conditionLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  conditionTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  confidenceText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  conditionIndicator: {
    height: 4,
    borderRadius: 2,
    marginBottom: SPACING.lg,
  },
  messageTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  messageBody: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  ctaContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  ctaButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  ctaText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
    gap: SPACING.md,
  },
  insightIcon: {
    fontSize: 24,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  insightText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.borderDark,
  },
  actionGradient: {
    padding: SPACING.lg,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  actionDescription: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  actionCta: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: COLORS.zenGreen,
  },
});
