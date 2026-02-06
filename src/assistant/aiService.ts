import Constants from 'expo-constants';

const OPENAI_API_KEY =
  Constants.expoConfig?.extra?.OPENAI_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function askAI({
  context,
  question,
}: {
  context: string;
  question: string;
}): Promise<string> {
  if (!OPENAI_API_KEY) {
    return fallbackAnswer(question, context);
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
You are a calm personal finance assistant.

Rules:
- Give GENERAL financial guidance only
- No investments, no guarantees
- Explain habits and patterns
- Max 3 short sentences
- Use \u20B9 symbol
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
      return fallbackAnswer(question, context);
    }

    const json = await res.json();
    return (
      json.choices?.[0]?.message?.content?.trim() ??
      fallbackAnswer(question, context)
    );
  } catch {
    return fallbackAnswer(question, context);
  }
}

function fallbackAnswer(question: string, context?: string): string {
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

  if (q.includes('save')) {
    if (totalSaved !== null) {
      return `You have saved about \u20B9${totalSaved.toFixed(0)} so far. Build on this by trimming a small recurring spend this week.`;
    }
    return 'Small, frequent savings usually work better than big one-time efforts.';
  }

  if (q.includes('spend')) {
    if (totalSpent !== null && topCategory) {
      return `You have spent \u20B9${totalSpent.toFixed(0)} so far. Your biggest category is ${topCategory.trim()} - a small cap there will show impact fast.`;
    }
    return 'Tracking weekly spending helps catch leaks before they grow.';
  }

  if (topCategory) {
    return `Your biggest spend is in ${topCategory.trim()}. If you want, I can set a simple weekly limit for that category.`;
  }

  return 'Ask about saving habits, spending patterns, or category limits and I will tailor it.';
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
