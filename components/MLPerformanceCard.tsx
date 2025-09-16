import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BarChart3, TrendingUp, Target, Award, AlertCircle } from 'lucide-react-native';
import { MLPerformance } from '@/hooks/useMLTrading';

interface MLPerformanceCardProps {
  performance: MLPerformance | null;
  loading: boolean;
}

export function MLPerformanceCard({ performance, loading }: MLPerformanceCardProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Analyzing ML Performance...</Text>
        </View>
      </View>
    );
  }

  if (!performance) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <AlertCircle color="#6B7280" size={24} />
          <Text style={styles.noDataText}>No performance data available</Text>
        </View>
      </View>
    );
  }

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value >= threshold) return '#10B981';
    if (value >= threshold * 0.7) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BarChart3 color="#8B5CF6" size={20} />
        <Text style={styles.title}>ML Performance Overview</Text>
      </View>

      {/* Main Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Overall Accuracy</Text>
          <Text style={[styles.metricValue, { 
            color: getPerformanceColor(performance.overallAccuracy, 80) 
          }]}>
            {performance.overallAccuracy.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Signals</Text>
          <Text style={styles.metricValue}>{performance.totalSignals}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Success Rate</Text>
          <Text style={[styles.metricValue, { 
            color: getPerformanceColor((performance.successfulSignals / performance.totalSignals) * 100, 70) 
          }]}>
            {performance.totalSignals > 0 
              ? ((performance.successfulSignals / performance.totalSignals) * 100).toFixed(1) 
              : '0'}%
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Avg Return</Text>
          <Text style={[styles.metricValue, { 
            color: performance.avgReturn > 0 ? '#10B981' : '#EF4444' 
          }]}>
            {performance.avgReturn > 0 ? '+' : ''}{performance.avgReturn.toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* Model Comparison */}
      <View style={styles.modelsSection}>
        <View style={styles.modelRow}>
          <View style={styles.modelItem}>
            <Award color="#10B981" size={16} />
            <View style={styles.modelInfo}>
              <Text style={styles.modelLabel}>Best Model</Text>
              <Text style={styles.modelName}>{performance.bestModel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.modelRow}>
          <View style={styles.modelItem}>
            <Target color="#EF4444" size={16} />
            <View style={styles.modelInfo}>
              <Text style={styles.modelLabel}>Needs Improvement</Text>
              <Text style={styles.modelName}>{performance.worstModel}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Daily Performance Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>7-Day Performance</Text>
        <View style={styles.chartContainer}>
          {performance.dailyPerformance.map((day, index) => (
            <View key={day.date} style={styles.chartBar}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: Math.max(4, (day.accuracy / 100) * 40),
                    backgroundColor: getPerformanceColor(day.accuracy, 70)
                  }
                ]} 
              />
              <Text style={styles.barLabel}>
                {day.date ? (() => {
                  try {
                    const date = typeof day.date === 'string' ? new Date(day.date) : day.date;
                    return date instanceof Date && !isNaN(date.getTime()) ? date.getDate() : '-';
                  } catch {
                    return '-';
                  }
                })() : '-'}
              </Text>
              <Text style={styles.barValue}>
                {day.accuracy.toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.chartLegend}>
          <Text style={styles.legendText}>Daily Accuracy Trend</Text>
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Successful Signals:</Text>
          <Text style={styles.summaryValue}>
            {performance.successfulSignals} / {performance.totalSignals}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Weekly Signals:</Text>
          <Text style={styles.summaryValue}>
            {performance.dailyPerformance.reduce((sum, day) => sum + day.signals, 0)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Weekly Return:</Text>
          <Text style={[styles.summaryValue, { 
            color: performance.dailyPerformance.reduce((sum, day) => sum + day.return, 0) > 0 ? '#10B981' : '#EF4444' 
          }]}>
            {performance.dailyPerformance.reduce((sum, day) => sum + day.return, 0) > 0 ? '+' : ''}
            {performance.dailyPerformance.reduce((sum, day) => sum + day.return, 0).toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  modelsSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  modelRow: {
    marginBottom: 8,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 6,
  },
  modelInfo: {
    marginLeft: 8,
    flex: 1,
  },
  modelLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  modelName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  chartSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  chartTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
    marginBottom: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  chartLegend: {
    alignItems: 'center',
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
  },
  summarySection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});