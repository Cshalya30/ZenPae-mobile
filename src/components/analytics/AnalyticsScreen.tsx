import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView, Animated, Easing } from 'react-native';
import Text from '../Text';
import Svg, { Path, G, Circle, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import Screen from '../Screen';
import { useFinanceStore, type Category } from '../../store/financeStore';
import { formatCurrency } from '../../utils/format';
import { useTheme } from '../../theme/useTheme';

type Segment = 'Spending Split' | 'Monthly Flow' | 'Behavior Insight';

const SEGMENTS: Segment[] = ['Spending Split', 'Monthly Flow', 'Behavior Insight'];

const ZP = {
  BLACK: '#0B0F0C',
  CHARCOAL: '#141A16',
  CARD: '#1B221D',
  GREEN: '#99FF32',
  INNER: '#0E130F',
  OUTER_STROKE: 'rgba(153,255,50,0.28)',
  INNER_STROKE: 'rgba(255,255,255,0.06)',
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F97316',
  Groceries: '#22C55E',
  Transport: '#38BDF8',
  Shopping: '#A855F7',
  Bills: '#EAB308',
  Subscriptions: '#F43F5E',
  Investments: '#14B8A6',
  Medicines: '#FB7185',
  Emergency: '#EF4444',
  Other: '#94A3B8',
  Custom: '#CBD5F5',
};

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { transactions, analytics } = useFinanceStore();
  const [segment, setSegment] = useState<Segment>('Spending Split');
  const [showExport, setShowExport] = useState(false);
  const chartScale = useRef(new Animated.Value(1)).current;
  const chartGlow = useRef(new Animated.Value(0)).current;

  const categoryTotals = useMemo<Record<Category, number>>(() => {
    const base: Record<Category, number> = {
      Food: 0,
      Groceries: 0,
      Transport: 0,
      Shopping: 0,
      Subscriptions: 0,
      Investments: 0,
      Bills: 0,
      Medicines: 0,
      Emergency: 0,
      Other: 0,
      Custom: 0,
    };
    transactions.forEach((t) => {
      base[t.category] = (base[t.category] || 0) + t.amount;
    });
    return base;
  }, [transactions]);

  const totalSpent = Math.max(1, Object.values(categoryTotals).reduce((a, b) => a + b, 0));

  const recurringTxns = transactions.filter((t) => t.isRecurring);
  const subscriptionTxns = recurringTxns.filter((t) => t.category === 'Subscriptions');
  const investmentTxns = recurringTxns.filter((t) => t.category === 'Investments');

  const spendByDay = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => ({ label: `W${i + 1}`, value: 0 }));
    transactions.slice(0, 20).forEach((t, idx) => {
      days[idx % days.length].value += t.amount;
    });
    return days;
  }, [transactions]);

  const behaviorStats = useMemo(() => {
    const essentials = (categoryTotals.Groceries + categoryTotals.Bills + categoryTotals.Medicines) / totalSpent;
    const lifestyle = (categoryTotals.Food + categoryTotals.Shopping + categoryTotals.Transport) / totalSpent;
    const recurring = recurringTxns.length / Math.max(1, transactions.length);
    const oneTime = 1 - recurring;
    const planned = (categoryTotals.Subscriptions + categoryTotals.Investments + categoryTotals.Bills) / totalSpent;
    const impulse = 1 - planned;
    return [
      { label: 'Essentials', value: essentials },
      { label: 'Lifestyle', value: lifestyle },
      { label: 'Recurring', value: recurring },
      { label: 'One-time', value: oneTime },
      { label: 'Planned', value: planned },
      { label: 'Impulse', value: impulse },
    ];
  }, [categoryTotals, recurringTxns.length, transactions.length, totalSpent]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#FFFFFF' }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.6)' }]}>Understand where your money goes</Text>
        <Text style={[styles.range, { color: 'rgba(255,255,255,0.6)' }]}>This month</Text>
      </View>

      <View style={styles.segmented}>
        {SEGMENTS.map((item) => {
          const active = item === segment;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setSegment(item)}
              style={[
                styles.segmentButton,
                {
                  backgroundColor: active ? 'rgba(153,255,50,0.12)' : 'transparent',
                  borderColor: active ? ZP.OUTER_STROKE : 'rgba(255,255,255,0.06)',
                },
              ]}
            >
              <Text style={[styles.segmentText, { color: active ? '#FFFFFF' : 'rgba(255,255,255,0.7)' }]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Pressable
        onPressIn={() => {
          Animated.parallel([
            Animated.timing(chartScale, {
              toValue: 1.04,
              duration: 140,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              useNativeDriver: true,
            }),
            Animated.timing(chartGlow, {
              toValue: 0.06,
              duration: 140,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              useNativeDriver: false,
            }),
          ]).start();
        }}
        onPressOut={() => {
          Animated.parallel([
            Animated.timing(chartScale, {
              toValue: 1,
              duration: 160,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              useNativeDriver: true,
            }),
            Animated.timing(chartGlow, {
              toValue: 0,
              duration: 160,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              useNativeDriver: false,
            }),
          ]).start();
        }}
      >
        <Animated.View style={[styles.chartCard, { transform: [{ scale: chartScale }] }]}>
          <View style={styles.chartOverlay} />
          <Animated.View style={[styles.chartGlow, { opacity: chartGlow }]} />
          {segment === 'Spending Split' ? (
            <PieChart data={categoryTotals} />
          ) : null}
          {segment === 'Monthly Flow' ? (
            <AreaChart data={spendByDay} />
          ) : null}
          {segment === 'Behavior Insight' ? (
            <RadarChart data={behaviorStats} />
          ) : null}
        </Animated.View>
      </Pressable>

      <View style={styles.subscriptionsHeader}>
        <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Subscriptions & Investments</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.podRow}>
        {[...subscriptionTxns, ...investmentTxns].slice(0, 6).map((t) => (
          <Pressable
            key={t.id}
            onPress={() => {}}
            style={({ pressed }) => [
              styles.subCard,
              {
                backgroundColor: 'rgba(153,255,50,0.06)',
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text style={styles.subIcon}>{getRecurringIcon(t.vendor, t.category)}</Text>
            <Text style={[styles.subName, { color: '#FFFFFF' }]}>{t.vendor}</Text>
            <Text style={[styles.subAmount, { color: ZP.GREEN }]}>{formatCurrency(t.amount)}</Text>
            <Text style={[styles.subMeta, { color: 'rgba(255,255,255,0.7)' }]}>{t.frequency ?? 'Monthly'}</Text>
          </Pressable>
        ))}
        {subscriptionTxns.length + investmentTxns.length === 0 ? (
          <View style={[styles.subCard, { backgroundColor: ZP.CARD }]}>
            <Text style={styles.subIcon}>✨</Text>
            <Text style={[styles.subName, { color: '#FFFFFF' }]}>No recurring</Text>
            <Text style={[styles.subMeta, { color: 'rgba(255,255,255,0.7)' }]}>Add a subscription</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.txnHeaderRow}>
        <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => setShowExport(true)}>
          <Text style={[styles.exportText, { color: ZP.GREEN }]}>Export transactions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.txnList}>
        {transactions.map((t) => (
          <View key={t.id} style={[styles.txnRow, { backgroundColor: ZP.CARD }]}>
            <View>
              <Text style={[styles.txnVendor, { color: '#FFFFFF' }]}>{t.vendor}</Text>
              <Text style={[styles.txnCategory, { color: 'rgba(255,255,255,0.7)' }]}>{t.category}</Text>
            </View>
            <View style={styles.txnAmountWrap}>
              <Text style={[styles.txnAmount, { color: ZP.GREEN }]}>{formatCurrency(t.amount)}</Text>
              <Text style={[styles.txnSaved, { color: 'rgba(255,255,255,0.6)' }]}>
                +{formatCurrency(t.roundedUpAmount)} saved
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Modal visible={showExport} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowExport(false)}>
          <View />
        </Pressable>
        <View style={[styles.modalCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceStrong }]}>
          <Text style={[styles.modalTitle, { color: '#FFFFFF' }]}>Export transactions</Text>
          <Text style={[styles.modalText, { color: 'rgba(255,255,255,0.7)' }]}>
            Download your monthly or yearly transactions as PDF or CSV.
          </Text>
          <Text style={[styles.modalSoon, { color: ZP.GREEN }]}>Coming Soon</Text>
          <TouchableOpacity onPress={() => setShowExport(false)} style={[styles.modalButton, { backgroundColor: ZP.GREEN }]}>
            <Text style={[styles.modalButtonText, { color: theme.colors.black }]}>Got it</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Screen>
  );
}

const PieChart = ({ data }: { data: Record<string, number> }) => {
  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const arcs = shape.pie<any>().value((d) => d.value)(entries.map(([key, value]) => ({ key, value })));
  const radius = 90;
  const thickness = radius * 0.24;
  const arcGen = shape.arc<any>().outerRadius(radius).innerRadius(radius - thickness);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  const containerOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;
  const outerOpacity = useRef(new Animated.Value(0)).current;
  const strokeProgress = useRef(arcs.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      Animated.timing(outerOpacity, {
        toValue: 0.28,
        duration: 200,
        delay: 600,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: false,
      }),
    ]).start();

    Animated.parallel(
      strokeProgress.map((p) =>
        Animated.timing(p, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [containerOpacity, translateY, outerOpacity, strokeProgress]);

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <Animated.View style={[styles.chartWrap, { opacity: containerOpacity, transform: [{ translateY }] }]}>
      <Svg width={220} height={200}>
        <G x={110} y={100}>
          {arcs.map((arc, idx) => {
            const arcPath = arcGen(arc) as string;
            const arcLength = (arc.endAngle - arc.startAngle) * radius;
            return (
              <AnimatedPath
                key={`${arc.data.key}-${idx}`}
                d={arcPath}
                stroke={CATEGORY_COLORS[arc.data.key] ?? ZP.GREEN}
                strokeWidth={thickness}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${arcLength} ${radius * Math.PI * 2}`}
                strokeDashoffset={strokeProgress[idx].interpolate({
                  inputRange: [0, 1],
                  outputRange: [arcLength, 0],
                })}
              />
            );
          })}
          <Circle cx={0} cy={0} r={radius - thickness + 1} fill={ZP.INNER} />
          <AnimatedCircle
            cx={0}
            cy={0}
            r={radius + 1}
            stroke={ZP.OUTER_STROKE}
            strokeWidth={1.5}
            fill="none"
            opacity={outerOpacity}
          />
          <Circle
            cx={0}
            cy={0}
            r={radius - thickness}
            stroke={ZP.INNER_STROKE}
            strokeWidth={0.5}
            fill="none"
          />
        </G>
      </Svg>
      <View style={styles.legend}>
        {entries.slice(0, 5).map(([key, value]) => (
          <View key={key} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS[key] ?? ZP.GREEN }]} />
            <Text style={[styles.legendText, { color: 'rgba(255,255,255,0.7)' }]}>
              {key} - {Math.round((value / Math.max(1, total)) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const AreaChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const width = 260;
  const height = 140;
  const values = data.map((d) => d.value);
  const yScale = scale.scaleLinear().domain([0, Math.max(...values, 1)]).range([height, 0]);
  const xScale = scale.scaleLinear().domain([0, data.length - 1]).range([0, width]);

  const line = shape
    .line<{ value: number }>()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d.value))
    .curve(shape.curveMonotoneX);

  const area = shape
    .area<{ value: number }>()
    .x((_, i) => xScale(i))
    .y0(height)
    .y1((d) => yScale(d.value))
    .curve(shape.curveMonotoneX);

  return (
    <View style={styles.chartWrap}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={ZP.GREEN} stopOpacity="0.4" />
            <Stop offset="1" stopColor={ZP.GREEN} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={area(data) as string} fill="url(#flow)" />
        <Path d={line(data) as string} stroke={ZP.GREEN} strokeWidth={2} fill="none" />
      </Svg>
      <View style={styles.legendRow}>
        <Text style={[styles.legendText, { color: 'rgba(255,255,255,0.7)' }]}>Spending flow by week</Text>
      </View>
    </View>
  );
};

const RadarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const angle = (Math.PI * 2) / data.length;

  const points = data
    .map((d, i) => {
      const r = radius * d.value;
      const x = center + r * Math.cos(i * angle - Math.PI / 2);
      const y = center + r * Math.sin(i * angle - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.chartWrap}>
      <Svg width={size} height={size}>
        <Polygon points={points} fill={ZP.GREEN} opacity={0.18} />
        {data.map((d, i) => {
          const x = center + radius * Math.cos(i * angle - Math.PI / 2);
          const y = center + radius * Math.sin(i * angle - Math.PI / 2);
          return <Circle key={d.label} cx={x} cy={y} r={2.5} fill={ZP.GREEN} />;
        })}
      </Svg>
      <View style={styles.legend}>
        {data.map((d) => (
          <View key={d.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: ZP.GREEN }]} />
            <Text style={[styles.legendText, { color: 'rgba(255,255,255,0.7)' }]}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

function getRecurringIcon(vendor: string, category: string) {
  const v = vendor.toLowerCase();
  if (v.includes('netflix') || v.includes('prime') || v.includes('hotstar')) return '🎬';
  if (v.includes('spotify') || v.includes('music') || v.includes('gaana')) return '🎵';
  if (v.includes('gym') || v.includes('fit')) return '🏋️';
  if (v.includes('sip') || v.includes('mutual') || v.includes('fund')) return '📈';
  if (v.includes('stock') || v.includes('trading')) return '💹';
  if (v.includes('crypto') || v.includes('coin')) return '🪙';
  if (category === 'Investments') return '📊';
  return '🔁';
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  range: {
    fontSize: 12,
    marginTop: 6,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  segmentButton: {
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: ZP.CARD,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    overflow: 'hidden',
  },
  chartOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  chartGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(153,255,50,0.06)',
  },
  chartWrap: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 12,
    width: '100%',
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
  subscriptionsHeader: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  podRow: {
    marginTop: 10,
    marginBottom: 8,
  },
  subCard: {
    width: 140,
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  subIcon: {
    fontSize: 20,
  },
  subName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  subAmount: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 6,
  },
  subMeta: {
    fontSize: 11,
    marginTop: 4,
  },
  txnHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  exportText: {
    fontSize: 12,
    fontWeight: '600',
  },
  txnList: {
    gap: 8,
  },
  txnRow: {
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txnVendor: {
    fontSize: 13,
    fontWeight: '600',
  },
  txnCategory: {
    fontSize: 11,
    marginTop: 4,
  },
  txnAmountWrap: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: 13,
    fontWeight: '500',
  },
  txnSaved: {
    fontSize: 10,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '35%',
    borderRadius: 18,
    padding: 18,
    borderWidth: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  modalSoon: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  modalButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
