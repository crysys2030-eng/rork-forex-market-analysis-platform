import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react-native';
import { SeasonalPattern } from '@/types/forex';

interface SeasonalPatternCardProps {
  pattern: SeasonalPattern;
}

export function SeasonalPatternCard({ pattern }: SeasonalPatternCardProps) {
  const getReturnColor = (returnValue: number) => {
    if (returnValue > 0) return '#00D4AA';
    if (returnValue < 0) return '#EF4444';
    return '#9CA3AF';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return '#00D4AA';
    if (winRate >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Calendar color="#8B5CF6" size={20} />
          <Text style={styles.symbol}>{pattern.symbol}</Text>
          <Text style={styles.month}>{monthNames[pattern.month - 1]}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Avg Return</Text>
          <View style={styles.returnRow}>
            {pattern.averageReturn > 0 ? (
              <TrendingUp color={getReturnColor(pattern.averageReturn)} size={16} />
            ) : (
              <TrendingDown color={getReturnColor(pattern.averageReturn)} size={16} />
            )}
            <Text style={[styles.metricValue, { color: getReturnColor(pattern.averageReturn) }]}>
              {pattern.averageReturn > 0 ? '+' : ''}{pattern.averageReturn.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Win Rate</Text>
          <Text style={[styles.metricValue, { color: getWinRateColor(pattern.winRate) }]}>
            {pattern.winRate}%
          </Text>
        </View>

        <View style={styles.metric}>
          <BarChart3 color="#9CA3AF" size={16} />
          <Text style={styles.metricLabel}>Volatility</Text>
          <Text style={styles.metricValue}>
            {pattern.volatility.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.daysSection}>
        <View style={styles.daysRow}>
          <Text style={styles.daysLabel}>Best Days:</Text>
          <View style={styles.daysList}>
            {pattern.bestDays.map((day) => (
              <View key={`best-${day}`} style={[styles.dayBadge, styles.bestDay]}>
                <Text style={styles.bestDayText}>{day.slice(0, 3)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.daysRow}>
          <Text style={styles.daysLabel}>Worst Days:</Text>
          <View style={styles.daysList}>
            {pattern.worstDays.map((day) => (
              <View key={`worst-${day}`} style={[styles.dayBadge, styles.worstDay]}>
                <Text style={styles.worstDayText}>{day.slice(0, 3)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  month: {
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  daysSection: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 12,
    gap: 8,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  daysLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    minWidth: 70,
  },
  daysList: {
    flexDirection: 'row',
    gap: 4,
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestDay: {
    backgroundColor: '#00D4AA',
  },
  worstDay: {
    backgroundColor: '#EF4444',
  },
  bestDayText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  worstDayText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});