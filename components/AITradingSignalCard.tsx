import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bot, TrendingUp, TrendingDown, Target, Shield, Clock, Brain } from 'lucide-react-native';
import { AITradingSignal } from '@/types/forex';

interface AITradingSignalCardProps {
  signal: AITradingSignal;
  onPress?: () => void;
}

export function AITradingSignalCard({ signal, onPress }: AITradingSignalCardProps) {
  const isBuy = signal.type === 'BUY';
  const signalColor = isBuy ? '#00D4AA' : '#FF6B6B';
  const bgColor = isBuy ? '#00D4AA15' : '#FF6B6B15';
  
  const formatPrice = (price: number) => {
    return price < 10 ? price.toFixed(4) : price.toFixed(2);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#00D4AA';
    if (confidence >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'DeepSeek':
        return '🧠';
      case 'ChatGPT':
        return '🤖';
      case 'Claude':
        return '🎯';
      case 'Gemini':
        return '💎';
      default:
        return '🤖';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: bgColor, borderColor: signalColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{signal.symbol}</Text>
          <View style={[styles.typeContainer, { backgroundColor: signalColor }]}>
            {isBuy ? (
              <TrendingUp size={12} color={'white'} />
            ) : (
              <TrendingDown size={12} color={'white'} />
            )}
            <Text style={styles.typeText}>{signal.type}</Text>
          </View>
        </View>
        
        <View style={styles.aiModelContainer}>
          <Text style={styles.aiModelEmoji}>{getModelIcon(signal.aiModel)}</Text>
          <Text style={styles.aiModelText}>{signal.aiModel}</Text>
        </View>
      </View>

      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Entry</Text>
            <Text style={styles.priceValue}>{formatPrice(signal.entryPrice)}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>TP</Text>
            <Text style={[styles.priceValue, { color: '#00D4AA' }]}>
              {formatPrice(signal.takeProfit)}
            </Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>SL</Text>
            <Text style={[styles.priceValue, { color: '#FF6B6B' }]}>
              {formatPrice(signal.stopLoss)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsSection}>
        <View style={styles.metricItem}>
          <Target size={14} color={'#6B7280'} />
          <Text style={styles.metricLabel}>R:R</Text>
          <Text style={styles.metricValue}>{signal.riskReward.toFixed(1)}</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Brain size={14} color={getConfidenceColor(signal.confidence)} />
          <Text style={styles.metricLabel}>Confidence</Text>
          <Text style={[styles.metricValue, { color: getConfidenceColor(signal.confidence) }]}>
            {signal.confidence.toFixed(0)}%
          </Text>
        </View>
        
        <View style={styles.metricItem}>
          <Shield size={14} color={'#6B7280'} />
          <Text style={styles.metricLabel}>Accuracy</Text>
          <Text style={styles.metricValue}>{signal.accuracy.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Clock size={14} color={'#6B7280'} />
          <Text style={styles.metricLabel}>Time</Text>
          <Text style={styles.metricValue}>{formatTime(signal.timestamp)}</Text>
        </View>
      </View>

      <View style={styles.indicatorsSection}>
        <Text style={styles.indicatorsTitle}>Key Indicators</Text>
        <View style={styles.indicatorsList}>
          {signal.indicators.slice(0, 3).map((indicator, index) => (
            <View key={`${indicator.name}-${index}`} style={styles.indicatorChip}>
              <Text style={styles.indicatorName}>{indicator.name}</Text>
              <View style={[
                styles.indicatorSignal,
                { 
                  backgroundColor: indicator.signal === 'BUY' ? '#00D4AA' : 
                                   indicator.signal === 'SELL' ? '#FF6B6B' : '#6B7280'
                }
              ]}>
                <Text style={styles.indicatorSignalText}>{indicator.signal}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.mlSection}>
        <View style={styles.mlHeader}>
          <Bot size={14} color={'#8B5CF6'} />
          <Text style={styles.mlTitle}>ML Prediction</Text>
        </View>
        <View style={styles.mlContent}>
          <Text style={styles.mlDirection}>
            Direction: <Text style={{ color: signalColor }}>{signal.mlPrediction.direction}</Text>
          </Text>
          <Text style={styles.mlProbability}>
            Probability: {signal.mlPrediction.probability.toFixed(0)}%
          </Text>
        </View>
      </View>

      <View style={styles.reasoningSection}>
        <Text style={styles.reasoningTitle}>AI Analysis</Text>
        <Text style={styles.reasoningText} numberOfLines={3}>
          {signal.reasoning}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.statusBadge, { backgroundColor: signalColor + '20' }]}>
          <Text style={[styles.statusText, { color: signalColor }]}>
            {signal.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.timeframe}>{signal.timeframe}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  aiModelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiModelEmoji: {
    fontSize: 16,
  },
  aiModelText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  priceSection: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  metricsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  indicatorsSection: {
    marginBottom: 12,
  },
  indicatorsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  indicatorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  indicatorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  indicatorName: {
    fontSize: 10,
    color: '#D1D5DB',
  },
  indicatorSignal: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  indicatorSignalText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  mlSection: {
    marginBottom: 12,
    backgroundColor: '#8B5CF615',
    padding: 8,
    borderRadius: 8,
  },
  mlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  mlTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  mlContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mlDirection: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  mlProbability: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  reasoningSection: {
    marginBottom: 12,
  },
  reasoningTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeframe: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});