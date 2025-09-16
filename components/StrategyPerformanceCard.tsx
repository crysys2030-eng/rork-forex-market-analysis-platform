import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Target, BarChart3, DollarSign, AlertTriangle } from 'lucide-react-native';
import { StrategyPerformance } from '@/hooks/useTradingStrategies';

interface StrategyPerformanceCardProps {
  performance: StrategyPerformance;
  strategyType: 'scalping' | 'swing' | 'daytrading';
}

export function StrategyPerformanceCard({ performance, strategyType }: StrategyPerformanceCardProps) {
  const getStrategyColor = () => {
    switch (strategyType) {
      case 'scalping': return '#FF6B6B';
      case 'swing': return '#4ECDC4';
      case 'daytrading': return '#45B7D1';
      default: return '#6B7280';
    }
  };

  const getPerformanceColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value >= 0 ? '#00D4AA' : '#EF4444';
    }
    return value <= 15 ? '#00D4AA' : value <= 25 ? '#F59E0B' : '#EF4444';
  };

  const strategyColor = getStrategyColor();

  return (
    <LinearGradient
      colors={['#374151', '#4B5563']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BarChart3 size={20} color={strategyColor} />
          <Text style={styles.title}>Performance Overview</Text>
        </View>
        <View style={[styles.strategyBadge, { backgroundColor: strategyColor + '20' }]}>
          <Text style={[styles.strategyText, { color: strategyColor }]}>
            {strategyType.charAt(0).toUpperCase() + strategyType.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Target size={16} color={'#9CA3AF'} />
              <Text style={styles.metricLabel}>Win Rate</Text>
            </View>
            <Text style={[styles.metricValue, { color: getPerformanceColor(performance.winRate, false) }]}>
              {performance.winRate}%
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <BarChart3 size={16} color={'#9CA3AF'} />
              <Text style={styles.metricLabel}>Total Trades</Text>
            </View>
            <Text style={styles.metricValue}>{performance.totalTrades}</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <TrendingUp size={16} color={'#9CA3AF'} />
              <Text style={styles.metricLabel}>Avg Return</Text>
            </View>
            <Text style={[styles.metricValue, { color: getPerformanceColor(performance.avgReturn) }]}>
              {performance.avgReturn >= 0 ? '+' : ''}{performance.avgReturn}%
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <AlertTriangle size={16} color={'#9CA3AF'} />
              <Text style={styles.metricLabel}>Max Drawdown</Text>
            </View>
            <Text style={[styles.metricValue, { color: getPerformanceColor(performance.maxDrawdown, false) }]}>
              -{performance.maxDrawdown}%
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <BarChart3 size={16} color={'#9CA3AF'} />
              <Text style={styles.metricLabel}>Profit Factor</Text>
            </View>
            <Text style={[styles.metricValue, { color: getPerformanceColor(performance.profitFactor - 1) }]}>
              {performance.profitFactor}
            </Text>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <TrendingUp size={16} color={'#9CA3AF'} />
              <Text style={styles.metricLabel}>Sharpe Ratio</Text>
            </View>
            <Text style={[styles.metricValue, { color: getPerformanceColor(performance.sharpeRatio - 1) }]}>
              {performance.sharpeRatio}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.pnlSection}>
        <Text style={styles.pnlTitle}>P&L Performance</Text>
        <View style={styles.pnlGrid}>
          <View style={styles.pnlItem}>
            <Text style={styles.pnlLabel}>Daily</Text>
            <Text style={[styles.pnlValue, { color: getPerformanceColor(performance.dailyPnL) }]}>
              {performance.dailyPnL >= 0 ? '+' : ''}${performance.dailyPnL}
            </Text>
          </View>
          <View style={styles.pnlItem}>
            <Text style={styles.pnlLabel}>Weekly</Text>
            <Text style={[styles.pnlValue, { color: getPerformanceColor(performance.weeklyPnL) }]}>
              {performance.weeklyPnL >= 0 ? '+' : ''}${performance.weeklyPnL}
            </Text>
          </View>
          <View style={styles.pnlItem}>
            <Text style={styles.pnlLabel}>Monthly</Text>
            <Text style={[styles.pnlValue, { color: getPerformanceColor(performance.monthlyPnL) }]}>
              {performance.monthlyPnL >= 0 ? '+' : ''}${performance.monthlyPnL}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.aiInsight}>
        <View style={styles.insightHeader}>
          <DollarSign size={16} color={strategyColor} />
          <Text style={styles.insightTitle}>AI Performance Insight</Text>
        </View>
        <Text style={styles.insightText}>
          {performance.winRate >= 70 
            ? `Excellent performance with ${performance.winRate}% win rate. Strategy shows consistent profitability.`
            : performance.winRate >= 60
            ? `Good performance metrics. Consider optimizing entry/exit criteria for better results.`
            : `Performance needs improvement. AI suggests reviewing risk management and signal filtering.`
          }
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  strategyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  strategyText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  metricsGrid: {
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  pnlSection: {
    marginBottom: 20,
  },
  pnlTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  pnlGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pnlItem: {
    alignItems: 'center',
  },
  pnlLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  pnlValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  aiInsight: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  insightText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
});