import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Minus, Brain, Target, AlertTriangle } from 'lucide-react-native';
import { AIEnhancedPair } from '@/hooks/useAIEnhancedMarketData';

interface AIEnhancedPairCardProps {
  pair: AIEnhancedPair;
  onPress?: () => void;
}

export function AIEnhancedPairCard({ pair, onPress }: AIEnhancedPairCardProps) {
  const isPositive = pair.changePercent > 0;
  const isNegative = pair.changePercent < 0;
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return '#10B981';
      case 'BEARISH': return '#EF4444';
      default: return '#6B7280';
    }
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatPrice = (price: number) => {
    if (price > 100) return price.toFixed(2);
    if (price > 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{pair.symbol}</Text>
          <Text style={styles.name}>{pair.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(pair.price)}</Text>
          <View style={[styles.changeContainer, { backgroundColor: isPositive ? '#10B981' : isNegative ? '#EF4444' : '#6B7280' }]}>
            {isPositive ? (
              <TrendingUp size={12} color="#FFFFFF" />
            ) : isNegative ? (
              <TrendingDown size={12} color="#FFFFFF" />
            ) : (
              <Minus size={12} color="#FFFFFF" />
            )}
            <Text style={styles.changeText}>
              {pair.changePercent > 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* AI Analysis Section */}
      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <Brain size={16} color="#8B5CF6" />
          <Text style={styles.aiTitle}>AI Analysis</Text>
          <View style={[styles.confidenceBadge, { backgroundColor: `rgba(139, 92, 246, ${pair.aiAnalysis.confidence / 100})` }]}>
            <Text style={styles.confidenceText}>{pair.aiAnalysis.confidence}%</Text>
          </View>
        </View>
        
        <View style={styles.sentimentRow}>
          <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(pair.aiAnalysis.sentiment) }]}>
            <Text style={styles.sentimentText}>{pair.aiAnalysis.sentiment}</Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: getRiskColor(pair.aiAnalysis.riskAssessment.level) }]}>
            <AlertTriangle size={12} color="#FFFFFF" />
            <Text style={styles.riskText}>{pair.aiAnalysis.riskAssessment.level} RISK</Text>
          </View>
        </View>

        <Text style={styles.prediction} numberOfLines={2}>
          {pair.aiAnalysis.prediction}
        </Text>
      </View>

      {/* Technical Indicators */}
      <View style={styles.technicalSection}>
        <View style={styles.indicatorRow}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>RSI</Text>
            <Text style={[styles.indicatorValue, { 
              color: pair.aiAnalysis.technicalIndicators.rsi > 70 ? '#EF4444' : 
                     pair.aiAnalysis.technicalIndicators.rsi < 30 ? '#10B981' : '#6B7280' 
            }]}>
              {pair.aiAnalysis.technicalIndicators.rsi}
            </Text>
          </View>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>MACD</Text>
            <Text style={[styles.indicatorValue, { 
              color: pair.aiAnalysis.technicalIndicators.macd > 0 ? '#10B981' : '#EF4444' 
            }]}>
              {pair.aiAnalysis.technicalIndicators.macd.toFixed(4)}
            </Text>
          </View>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>News Impact</Text>
            <Text style={styles.indicatorValue}>
              {pair.aiAnalysis.newsImpact.score}/10
            </Text>
          </View>
        </View>
      </View>

      {/* Key Levels */}
      <View style={styles.levelsSection}>
        <View style={styles.levelRow}>
          <View style={styles.levelItem}>
            <Target size={12} color="#EF4444" />
            <Text style={styles.levelLabel}>Resistance</Text>
            <Text style={styles.levelValue}>
              {formatPrice(pair.aiAnalysis.keyLevels.resistance[0])}
            </Text>
          </View>
          <View style={styles.levelItem}>
            <Target size={12} color="#10B981" />
            <Text style={styles.levelLabel}>Support</Text>
            <Text style={styles.levelValue}>
              {formatPrice(pair.aiAnalysis.keyLevels.support[0])}
            </Text>
          </View>
        </View>
      </View>

      {/* AI Recommendation */}
      <View style={styles.recommendationSection}>
        <Text style={styles.recommendationText} numberOfLines={2}>
          💡 {pair.aiAnalysis.riskAssessment.recommendation}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sentimentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  prediction: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    fontWeight: '500',
  },
  technicalSection: {
    marginBottom: 12,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicator: {
    alignItems: 'center',
    flex: 1,
  },
  indicatorLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  levelsSection: {
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  levelValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  recommendationSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  recommendationText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
    lineHeight: 16,
  },
});