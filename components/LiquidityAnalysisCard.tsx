import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplets, TrendingUp, Clock, BarChart3 } from 'lucide-react-native';
import { LiquidityData } from '@/types/forex';

interface LiquidityAnalysisCardProps {
  data: LiquidityData;
}

export function LiquidityAnalysisCard({ data }: LiquidityAnalysisCardProps) {
  const getLiquidityColor = (score: number) => {
    if (score >= 80) return '#00D4AA';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getSpreadStatus = (spread: number) => {
    if (spread < 1) return { text: 'Tight', color: '#00D4AA' };
    if (spread < 2) return { text: 'Normal', color: '#F59E0B' };
    return { text: 'Wide', color: '#EF4444' };
  };

  const spreadStatus = getSpreadStatus(data.bidAskSpread);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Droplets color="#3B82F6" size={20} />
          <Text style={styles.symbol}>{data.symbol}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: getLiquidityColor(data.liquidityScore) }]}>
          <Text style={styles.scoreText}>{data.liquidityScore}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Spread</Text>
          <Text style={[styles.metricValue, { color: spreadStatus.color }]}>
            {data.bidAskSpread.toFixed(1)} pips
          </Text>
          <Text style={[styles.metricStatus, { color: spreadStatus.color }]}>
            {spreadStatus.text}
          </Text>
        </View>

        <View style={styles.metric}>
          <BarChart3 color="#9CA3AF" size={16} />
          <Text style={styles.metricLabel}>Depth</Text>
          <Text style={styles.metricValue}>
            ${data.marketDepth.toFixed(0)}M
          </Text>
        </View>

        <View style={styles.metric}>
          <TrendingUp color="#9CA3AF" size={16} />
          <Text style={styles.metricLabel}>Imbalance</Text>
          <Text style={[
            styles.metricValue,
            { color: data.orderBookImbalance > 0 ? '#00D4AA' : '#EF4444' }
          ]}>
            {data.orderBookImbalance > 0 ? '+' : ''}{data.orderBookImbalance.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.timingSection}>
        <View style={styles.timingHeader}>
          <Clock color="#9CA3AF" size={16} />
          <Text style={styles.timingTitle}>Optimal Trading Times</Text>
        </View>
        <View style={styles.timeSlots}>
          {data.optimalTradingTimes.map((time, index) => (
            <View key={index} style={styles.timeSlot}>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  metricStatus: {
    fontSize: 10,
    fontWeight: '500',
  },
  timingSection: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 12,
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  timingTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeSlot: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: '500',
  },
});