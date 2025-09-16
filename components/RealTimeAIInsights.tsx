import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, Target, Activity } from 'lucide-react-native';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface AIInsightCardProps {
  insight: {
    id: string;
    type: 'TREND_CHANGE' | 'VOLATILITY_SPIKE' | 'SUPPORT_BREAK' | 'RESISTANCE_BREAK' | 'PATTERN_DETECTED';
    symbol: string;
    message: string;
    confidence: number;
    timestamp: Date;
    actionable: boolean;
  };
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'TREND_CHANGE':
        return <TrendingUp size={20} color="#10B981" />;
      case 'VOLATILITY_SPIKE':
        return <Activity size={20} color="#F59E0B" />;
      case 'SUPPORT_BREAK':
        return <TrendingDown size={20} color="#EF4444" />;
      case 'RESISTANCE_BREAK':
        return <TrendingUp size={20} color="#10B981" />;
      case 'PATTERN_DETECTED':
        return <Target size={20} color="#8B5CF6" />;
      default:
        return <Brain size={20} color="#6B7280" />;
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'TREND_CHANGE':
      case 'RESISTANCE_BREAK':
        return '#10B981';
      case 'VOLATILITY_SPIKE':
        return '#F59E0B';
      case 'SUPPORT_BREAK':
        return '#EF4444';
      case 'PATTERN_DETECTED':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={[styles.insightCard, { borderLeftColor: getInsightColor() }]}>
      <View style={styles.insightHeader}>
        <View style={styles.insightIconContainer}>
          {getInsightIcon()}
        </View>
        <View style={styles.insightInfo}>
          <Text style={styles.insightSymbol}>{insight.symbol}</Text>
          <Text style={styles.insightType}>{insight.type.replace('_', ' ')}</Text>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceText}>{Math.round(insight.confidence)}%</Text>
        </View>
      </View>
      <Text style={styles.insightMessage}>{insight.message}</Text>
      <View style={styles.insightFooter}>
        <Text style={styles.insightTime}>
          {insight.timestamp.toLocaleTimeString()}
        </Text>
        {insight.actionable && (
          <View style={styles.actionableBadge}>
            <Zap size={12} color="#F59E0B" />
            <Text style={styles.actionableText}>Actionable</Text>
          </View>
        )}
      </View>
    </View>
  );
};

interface RealTimeAIInsightsProps {
  predictions?: any[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function RealTimeAIInsights({ predictions = [], onRefresh, isLoading = false }: RealTimeAIInsightsProps) {
  const { aiInsights, aiAnalyses, isConnected, lastUpdate } = useRealTimeData();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH_CONFIDENCE' | 'ACTIONABLE'>('ALL');

  const filteredInsights = aiInsights.filter(insight => {
    switch (selectedFilter) {
      case 'HIGH_CONFIDENCE':
        return insight.confidence >= 80;
      case 'ACTIONABLE':
        return insight.actionable;
      default:
        return true;
    }
  }).slice(0, 20); // Show latest 20 insights

  const getConnectionStatus = () => {
    if (!isConnected) {
      return { color: '#EF4444', text: 'Disconnected' };
    }
    const timeSinceUpdate = Date.now() - lastUpdate.getTime();
    if (timeSinceUpdate < 5000) {
      return { color: '#10B981', text: 'Live' };
    } else if (timeSinceUpdate < 30000) {
      return { color: '#F59E0B', text: 'Delayed' };
    } else {
      return { color: '#EF4444', text: 'Stale' };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Brain size={24} color="#8B5CF6" />
          <Text style={styles.title}>AI Market Insights</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: connectionStatus.color }]} />
          <Text style={[styles.statusText, { color: connectionStatus.color }]}>
            {connectionStatus.text}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{aiInsights.length + predictions.length}</Text>
          <Text style={styles.statLabel}>Total Insights</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{aiAnalyses.length}</Text>
          <Text style={styles.statLabel}>Active Signals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {Math.round(aiAnalyses.reduce((sum, a) => sum + a.confidence, 0) / aiAnalyses.length || 0)}%
          </Text>
          <Text style={styles.statLabel}>Avg Confidence</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {(['ALL', 'HIGH_CONFIDENCE', 'ACTIONABLE'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => {
              const sanitizedFilter = filter?.trim();
              if (sanitizedFilter && sanitizedFilter.length <= 20) {
                setSelectedFilter(filter);
              }
            }}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Insights List */}
      <ScrollView
        style={styles.insightsList}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Predictions */}
        {predictions.map((prediction, index) => (
          <View key={`prediction-${index}`} style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
              <Brain size={20} color="#8B5CF6" />
              <Text style={styles.predictionTitle}>AI Market Analysis</Text>
              <Text style={styles.predictionConfidence}>{prediction.confidence}%</Text>
            </View>
            <Text style={styles.predictionText}>{prediction.analysis}</Text>
            <Text style={styles.predictionTime}>
              {prediction.timestamp.toLocaleTimeString()}
            </Text>
          </View>
        ))}
        
        {/* Real-time Insights */}
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))
        ) : predictions.length === 0 ? (
          <View style={styles.emptyState}>
            <AlertTriangle size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No Insights Available</Text>
            <Text style={styles.emptyMessage}>
              AI is analyzing market conditions. New insights will appear here.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Last Update */}
      <View style={styles.footer}>
        <Text style={styles.lastUpdate}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  insightsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  insightCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  insightType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  confidenceContainer: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  insightMessage: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  actionableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    alignItems: 'center',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#6B7280',
  },
  predictionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  predictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 8,
  },
  predictionConfidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  predictionText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 8,
  },
  predictionTime: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
});