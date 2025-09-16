import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { PerformanceData } from '@/types/forex';

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 80;
  const chartHeight = 120;

  if (!data.length) return null;

  const maxProfit = Math.max(...data.map(d => d.profit));
  const minProfit = Math.min(...data.map(d => d.profit));
  const range = maxProfit - minProfit || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profit/Loss Trend (30 Days)</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${maxProfit.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Max Profit</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: minProfit < 0 ? '#EF4444' : '#00D4AA' }]}>
            ${minProfit.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>Min Profit</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {data.filter(d => d.profit > 0).length}/{data.length}
          </Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
      </View>

      <View style={[styles.chartContainer, { width: chartWidth, height: chartHeight }]}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <View
            key={`grid-${ratio}`}
            style={[
              styles.gridLine,
              { top: chartHeight * ratio }
            ]}
          />
        ))}
        
        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.slice(-15).map((item, index) => {
            const barHeight = Math.abs(item.profit / range) * (chartHeight * 0.8);
            const isPositive = item.profit >= 0;
            const barWidth = (chartWidth - 30) / 15;
            
            return (
              <View
                key={`bar-${index}`}
                style={[
                  styles.bar,
                  {
                    width: barWidth - 2,
                    height: Math.max(barHeight, 2),
                    backgroundColor: isPositive ? '#00D4AA' : '#EF4444',
                    bottom: isPositive ? chartHeight / 2 : (chartHeight / 2) - barHeight,
                    left: index * barWidth + 1,
                  }
                ]}
              />
            );
          })}
        </View>
        
        {/* Center line */}
        <View style={[styles.centerLine, { top: chartHeight / 2 }]} />
      </View>
      
      <View style={styles.labels}>
        <Text style={styles.labelText}>Last 15 Days</Text>
        <Text style={styles.labelText}>
          Avg: ${(data.reduce((sum, d) => sum + d.profit, 0) / data.length).toFixed(0)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chartContainer: {
    position: 'relative',
    backgroundColor: '#2D3748',
    borderRadius: 8,
    marginBottom: 12,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#4A5568',
    opacity: 0.3,
  },
  barsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  bar: {
    position: 'absolute',
    borderRadius: 1,
  },
  centerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#6B7280',
    opacity: 0.5,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});