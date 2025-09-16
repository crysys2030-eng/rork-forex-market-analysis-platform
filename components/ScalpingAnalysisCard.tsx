import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Brain, TrendingUp, AlertTriangle, BarChart3, Target, Zap, Activity } from 'lucide-react-native';
import { ScalpingAnalysis } from '@/hooks/useScalpingAI';

interface ScalpingAnalysisCardProps {
  analysis: ScalpingAnalysis | null;
  loading: boolean;
}

export function ScalpingAnalysisCard({ analysis, loading }: ScalpingAnalysisCardProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Brain color="#00D4AA" size={20} />
          <Text style={styles.title}>AI Market Analysis</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4AA" />
          <Text style={styles.loadingText}>Analyzing market conditions...</Text>
        </View>
      </View>
    );
  }

  if (!analysis) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Brain color="#00D4AA" size={20} />
          <Text style={styles.title}>AI Market Analysis</Text>
        </View>
        <Text style={styles.noDataText}>No analysis available</Text>
      </View>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'TRENDING': return '#10B981';
      case 'VOLATILE': return '#F59E0B';
      case 'RANGING': return '#6366F1';
      case 'CONSOLIDATING': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Brain color="#00D4AA" size={20} />
        <Text style={styles.title}>AI Market Analysis</Text>
        <View style={styles.aiIndicator}>
          <Zap color="#F59E0B" size={12} />
          <Text style={styles.aiText}>AI</Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(analysis.timestamp)}</Text>
      </View>

      {/* Market Condition */}
      <View style={styles.conditionSection}>
        <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(analysis.marketCondition) }]}>
          <Text style={styles.conditionText}>{analysis.marketCondition}</Text>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(analysis.riskLevel) }]}>
          <AlertTriangle color="#FFFFFF" size={14} />
          <Text style={styles.riskText}>{analysis.riskLevel} RISK</Text>
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.metricsSection}>
        <View style={styles.metricItem}>
          <BarChart3 color="#9CA3AF" size={16} />
          <Text style={styles.metricLabel}>Volatility</Text>
          <Text style={styles.metricValue}>{analysis.volatility.toFixed(2)}%</Text>
        </View>
        
        <View style={styles.metricItem}>
          <TrendingUp color="#9CA3AF" size={16} />
          <Text style={styles.metricLabel}>Momentum</Text>
          <Text style={[
            styles.metricValue, 
            { color: analysis.momentum > 0 ? '#10B981' : '#EF4444' }
          ]}>
            {analysis.momentum > 0 ? '+' : ''}{analysis.momentum.toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* Recommendation */}
      <View style={styles.recommendationSection}>
        <View style={styles.recommendationHeader}>
          <Activity color="#00D4AA" size={16} />
          <Text style={styles.recommendationTitle}>AI Recommendation</Text>
        </View>
        <Text style={styles.recommendationText}>{analysis.recommendation}</Text>
        <View style={styles.aiPoweredBadge}>
          <Text style={styles.aiPoweredText}>Powered by DeepSeek AI & Real-time Market Data</Text>
        </View>
      </View>

      {/* Optimal Pairs */}
      {analysis.optimalPairs.length > 0 && (
        <View style={styles.pairsSection}>
          <View style={styles.pairsHeader}>
            <Target color="#00D4AA" size={16} />
            <Text style={styles.pairsTitle}>Optimal Pairs</Text>
          </View>
          <View style={styles.pairsList}>
            {analysis.optimalPairs.map((pair, index) => (
              <View key={pair} style={styles.pairBadge}>
                <Text style={styles.pairText}>{pair}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
    flex: 1,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  aiText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  noDataText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  conditionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metricsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recommendationSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4AA',
    marginLeft: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 8,
  },
  aiPoweredBadge: {
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  aiPoweredText: {
    fontSize: 10,
    color: '#00D4AA',
    fontWeight: '500',
    textAlign: 'center',
  },
  pairsSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  pairsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pairsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  pairsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pairBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  pairText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});