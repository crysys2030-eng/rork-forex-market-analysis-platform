import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AITradingSignal } from '@/types/forex';
import { TrendingUp, TrendingDown, Clock, Target, Shield, Brain, Zap } from 'lucide-react-native';

interface AdvancedAISignalCardProps {
  signal: AITradingSignal;
  onPress?: () => void;
}

export function AdvancedAISignalCard({ signal, onPress }: AdvancedAISignalCardProps) {
  const isLong = signal.type === 'BUY';
  const signalColor = isLong ? '#00D4AA' : '#FF6B6B';
  const bgColor = isLong ? '#001A15' : '#1A0A0A';
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return '#00D4AA';
    if (confidence >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'DeepSeek': return '🧠';
      case 'ChatGPT': return '🤖';
      case 'Claude': return '🎯';
      case 'Gemini': return '💎';
      default: return '🔮';
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: bgColor }]} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{signal.symbol}</Text>
          <View style={[styles.signalBadge, { backgroundColor: signalColor }]}>
            {isLong ? (
              <TrendingUp size={12} color="#FFFFFF" />
            ) : (
              <TrendingDown size={12} color="#FFFFFF" />
            )}
            <Text style={styles.signalText}>{signal.type}</Text>
          </View>
        </View>
        
        <View style={styles.aiModelContainer}>
          <Text style={styles.aiModelIcon}>{getModelIcon(signal.aiModel)}</Text>
          <Text style={styles.aiModel}>{signal.aiModel}</Text>
        </View>
      </View>

      {/* Confidence & Accuracy */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Brain size={14} color={getConfidenceColor(signal.confidence)} />
          <Text style={[styles.metricLabel, { color: getConfidenceColor(signal.confidence) }]}>
            Confidence
          </Text>
          <Text style={[styles.metricValue, { color: getConfidenceColor(signal.confidence) }]}>
            {signal.confidence}%
          </Text>
        </View>
        
        <View style={styles.metric}>
          <Zap size={14} color="#F59E0B" />
          <Text style={styles.metricLabel}>Accuracy</Text>
          <Text style={styles.metricValue}>{signal.accuracy.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.metric}>
          <Target size={14} color="#8B5CF6" />
          <Text style={styles.metricLabel}>R:R</Text>
          <Text style={styles.metricValue}>{signal.riskReward}</Text>
        </View>
      </View>

      {/* Price Levels */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Entry:</Text>
          <Text style={[styles.priceValue, { color: signalColor }]}>
            {signal.entryPrice.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>TP:</Text>
          <Text style={[styles.priceValue, { color: '#00D4AA' }]}>
            {signal.takeProfit.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>SL:</Text>
          <Text style={[styles.priceValue, { color: '#FF6B6B' }]}>
            {signal.stopLoss.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}
          </Text>
        </View>
      </View>

      {/* ML Prediction */}
      <View style={styles.mlSection}>
        <Text style={styles.mlTitle}>ML Prediction</Text>
        <View style={styles.mlRow}>
          <Text style={styles.mlLabel}>Direction:</Text>
          <Text style={[styles.mlValue, { 
            color: signal.mlPrediction.direction === 'UP' ? '#00D4AA' : 
                   signal.mlPrediction.direction === 'DOWN' ? '#FF6B6B' : '#6B7280' 
          }]}>
            {signal.mlPrediction.direction} ({signal.mlPrediction.probability}%)
          </Text>
        </View>
        
        <View style={styles.mlRow}>
          <Text style={styles.mlLabel}>Target:</Text>
          <Text style={styles.mlValue}>
            {signal.mlPrediction.priceTarget.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}
          </Text>
        </View>
      </View>

      {/* Market Condition */}
      <View style={styles.conditionSection}>
        <Text style={styles.conditionTitle}>Market Condition</Text>
        <View style={styles.conditionGrid}>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Trend</Text>
            <Text style={[styles.conditionValue, { 
              color: signal.marketCondition.trend === 'BULLISH' ? '#00D4AA' : 
                     signal.marketCondition.trend === 'BEARISH' ? '#FF6B6B' : '#6B7280' 
            }]}>
              {signal.marketCondition.trend}
            </Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Vol</Text>
            <Text style={[styles.conditionValue, { 
              color: signal.marketCondition.volatility === 'HIGH' ? '#FF6B6B' : 
                     signal.marketCondition.volatility === 'MEDIUM' ? '#F59E0B' : '#00D4AA' 
            }]}>
              {signal.marketCondition.volatility}
            </Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Sentiment</Text>
            <Text style={[styles.conditionValue, { 
              color: signal.marketCondition.sentiment === 'GREED' ? '#00D4AA' : 
                     signal.marketCondition.sentiment === 'FEAR' ? '#FF6B6B' : '#6B7280' 
            }]}>
              {signal.marketCondition.sentiment}
            </Text>
          </View>
        </View>
      </View>

      {/* Top Indicators */}
      <View style={styles.indicatorsSection}>
        <Text style={styles.indicatorsTitle}>Key Indicators</Text>
        <View style={styles.indicatorsList}>
          {signal.indicators.slice(0, 3).map((indicator, index) => (
            <View key={index} style={styles.indicatorItem}>
              <Text style={styles.indicatorName}>{indicator.name}</Text>
              <View style={[styles.indicatorSignal, { 
                backgroundColor: indicator.signal === 'BUY' ? '#00D4AA20' : 
                                indicator.signal === 'SELL' ? '#FF6B6B20' : '#6B728020' 
              }]}>
                <Text style={[styles.indicatorSignalText, { 
                  color: indicator.signal === 'BUY' ? '#00D4AA' : 
                         indicator.signal === 'SELL' ? '#FF6B6B' : '#6B7280' 
                }]}>
                  {indicator.signal}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Backtest Performance */}
      <View style={styles.backtestSection}>
        <Text style={styles.backtestTitle}>Backtest Results</Text>
        <View style={styles.backtestGrid}>
          <View style={styles.backtestItem}>
            <Text style={styles.backtestLabel}>Win Rate</Text>
            <Text style={[styles.backtestValue, { color: '#00D4AA' }]}>
              {signal.backtestResults.winRate.toFixed(1)}%
            </Text>
          </View>
          
          <View style={styles.backtestItem}>
            <Text style={styles.backtestLabel}>Profit Factor</Text>
            <Text style={styles.backtestValue}>
              {signal.backtestResults.profitFactor.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.backtestItem}>
            <Text style={styles.backtestLabel}>Sharpe</Text>
            <Text style={styles.backtestValue}>
              {signal.backtestResults.sharpeRatio.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Timestamp & Timeframe */}
      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Clock size={12} color="#6B7280" />
          <Text style={styles.timeText}>
            {signal.timestamp.toLocaleTimeString()} • {signal.timeframe}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { 
          backgroundColor: signal.status === 'active' ? '#F59E0B20' : '#00D4AA20' 
        }]}>
          <Text style={[styles.statusText, { 
            color: signal.status === 'active' ? '#F59E0B' : '#00D4AA' 
          }]}>
            {signal.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
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
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  signalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  aiModelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiModelIcon: {
    fontSize: 16,
  },
  aiModel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceSection: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mlSection: {
    marginBottom: 12,
  },
  mlTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 6,
  },
  mlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  mlLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  mlValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  conditionSection: {
    marginBottom: 12,
  },
  conditionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 6,
  },
  conditionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conditionItem: {
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  conditionValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  indicatorsSection: {
    marginBottom: 12,
  },
  indicatorsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D4AA',
    marginBottom: 6,
  },
  indicatorsList: {
    gap: 4,
  },
  indicatorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorName: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  indicatorSignal: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  indicatorSignalText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  backtestSection: {
    marginBottom: 12,
  },
  backtestTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#06B6D4',
    marginBottom: 6,
  },
  backtestGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backtestItem: {
    alignItems: 'center',
  },
  backtestLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  backtestValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});