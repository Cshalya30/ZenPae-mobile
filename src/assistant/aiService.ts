import Constants from 'expo-constants';
import { type AssistantInsight, mapConditionToAccent, type NudgeCondition } from './assistantLogic';

const OPENAI_API_KEY =
  Constants.expoConfig?.extra?.OPENAI_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function askAI({
  context,
  question,
}: {
  context: string;
  question: string;
}): Promise<AssistantInsight> {
  if (!OPENAI_API_KEY) {
    return fallbackInsight(question, context);
  }

  try {
    const res = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.25,
          messages: [
            {
              role: 'system',
              content: `
You are a premium fintech assistant. Assess financial condition and output JSON only.

Return exactly this JSON shape:
{
  "condition": "Mild Concern",
  "confidence": 0.72,
  "accentColor": "#E6B85C",
  "messageTitle": "Let's tighten things a bit",
  "messageBody": "Spending has crept up faster than your income this month. A few small adjustments now can prevent stress later.",
  "cta": [
    "Show me where I overspend",
    "Help me save smarter"
  ]
}

Condition must be one of: Very Chill, Chill, Neutral, Mild Concern, Concerning, Critical.
Accent color must match the condition exactly.
No extra keys. No markdown. No prose outside JSON.
              `,
            },
            {
              role: 'user',
              content: `
USER DATA:
${context}

QUESTION:
${question}
              `,
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      return fallbackInsight(question, context);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content?.trim();
    const parsed = parseInsightJson(content);
    return parsed ?? fallbackInsight(question, context);
  } catch {
    return fallbackInsight(question, context);
  }
}

function fallbackInsight(question: string, context?: string): AssistantInsight {
  const q = question.toLowerCase();
  const totalSpent = matchCurrency(
    context,
    new RegExp(`Total spent: \u20B9([0-9.]+)`)
  );
  const totalSaved = matchCurrency(
    context,
    new RegExp(`Total saved via round-ups: \u20B9([0-9.]+)`)
  );
  const topCategory = matchText(context, /Top spending category: ([^(]+)/);

  let condition: NudgeCondition = 'Neutral';
  if (totalSaved !== null && totalSpent !== null) {
    const ratio = totalSaved / Math.max(totalSpent, 1);
    if (ratio >= 0.08) condition = 'Very Chill';
    else if (ratio >= 0.05) condition = 'Chill';
    else if (ratio <= 0.015) condition = 'Mild Concern';
  }

  const accentColor = mapConditionToAccent(condition);
  const baseTitle: Record<NudgeCondition, string> = {
    'Very Chill': 'Calm and on track',
    Chill: 'Steady, healthy pace',
    Neutral: 'Balanced snapshot',
    'Mild Concern': "Let's tighten a little",
    Concerning: 'Time to course-correct',
    Critical: 'Act now, stay steady',
  };

  let messageBody = 'Ask about saving habits, spending patterns, or category limits and I will tailor it.';

  if (q.includes('save')) {
    if (totalSaved !== null) {
      messageBody = `You have saved about ₹${totalSaved.toFixed(0)} so far. Build on this by trimming a small recurring spend this week.`;
    } else {
      messageBody = 'Small, frequent savings usually work better than big one-time efforts.';
    }
  }

  if (q.includes('spend')) {
    if (totalSpent !== null && topCategory) {
      messageBody = `You have spent ₹${totalSpent.toFixed(0)} so far. Your biggest category is ${topCategory.trim()} - a small cap there will show impact fast.`;
    } else {
      messageBody = 'Tracking weekly spending helps catch leaks before they grow.';
    }
  }

  if (topCategory) {
    messageBody = `Your biggest spend is in ${topCategory.trim()}. If you want, I can set a simple weekly limit for that category.`;
  }

  return {
    id: 'ai-fallback',
    condition,
    confidence: 0.6,
    accentColor,
    messageTitle: baseTitle[condition],
    messageBody,
    cta: ['Show me where I overspend', 'Help me save smarter'],
  };
}

function matchCurrency(context: string | undefined, pattern: RegExp): number | null {
  if (!context) return null;
  const match = context.match(pattern);
  if (!match) return null;
  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) ? value : null;
}

function matchText(context: string | undefined, pattern: RegExp): string | null {
  if (!context) return null;
  const match = context.match(pattern);
  return match ? match[1] : null;
}

function parseInsightJson(content?: string | null): AssistantInsight | null {
  if (!content) return null;
  const trimmed = content.trim();
  try {
    const parsed = JSON.parse(trimmed);
    return normalizeInsight(parsed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        const parsed = JSON.parse(trimmed.slice(start, end + 1));
        return normalizeInsight(parsed);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeInsight(raw: any): AssistantInsight | null {
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.condition || !raw.accentColor || !raw.messageTitle || !raw.messageBody) return null;
  const condition = raw.condition as NudgeCondition;
  return {
    id: 'ai-nudge',
    condition,
    confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.6,
    accentColor: raw.accentColor,
    messageTitle: raw.messageTitle,
    messageBody: raw.messageBody,
    cta: Array.isArray(raw.cta) ? raw.cta.slice(0, 2) : ['Show me where I overspend', 'Help me save smarter'],
  };
}
