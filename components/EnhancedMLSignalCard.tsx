import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Target, Clock, Bot, Zap, Users } from 'lucide-react-native';
import { MLSignal } from '@/hooks/useEnhancedMLTrading';

interface EnhancedMLSignalCardProps {
  signal: MLSignal;
  onPress?: () => void;
}

export function EnhancedMLSignalCard({ signal, onPress }: EnhancedMLSignalCardProps) {
  const getActionColor = (action: string) => {
    return action === 'BUY' ? '#10B981' : '#EF4444';
  };

  const getActionIcon = (action: string) => {
    return action === 'BUY' 
      ? <TrendingUp color={getActionColor(action)} size={16} />
      : <TrendingDown color={getActionColor(action)} size={16} />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(price < 1 ? 6 : 4);
  };

  const formatTimeHorizon = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    } else if (hours < 24) {
      return `${hours.toFixed(1)}h`;
    } else {
      return `${(hours / 24).toFixed(1)}d`;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        signal.aiEnhanced && styles.aiEnhancedContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{signal.symbol}</Text>
          <View style={styles.badgeContainer}>
            {signal.aiEnhanced && (
              <View style={styles.aiBadge}>
                <Bot color="#FFFFFF" size={10} />
                <Text style={styles.aiText}>AI</Text>
              </View>
            )}
            {(signal.ensembleVotes || 0) > 1 && (
              <View style={styles.ensembleBadge}>
                <Users color="#FFFFFF" size={10} />
                <Text style={styles.ensembleText}>{signal.ensembleVotes}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actionContainer}>
          {getActionIcon(signal.action)}
          <Text style={[styles.action, { color: getActionColor(signal.action) }]}>
            {signal.action}
          </Text>
        </View>
      </View>

      {/* Main Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Confidence</Text>
          <Text style={[styles.metricValue, { 
            color: signal.confidence > 90 ? '#10B981' : signal.confidence > 80 ? '#F59E0B' : '#EF4444' 
          }]}>
            {signal.confidence}%
          </Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Accuracy</Text>
          <Text style={styles.metricValue}>{signal.accuracy}%</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Risk</Text>
          <Text style={[styles.metricValue, { color: getRiskColor(signal.riskLevel) }]}>
            {signal.riskLevel}
          </Text>
        </View>
      </View>

      {/* Price Levels */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Entry:</Text>
          <Text style={styles.priceValue}>${formatPrice(signal.entryPrice)}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Stop Loss:</Text>
          <Text style={[styles.priceValue, { color: '#EF4444' }]}>
            ${formatPrice(signal.stopLoss)}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Take Profit:</Text>
          <Text style={[styles.priceValue, { color: '#10B981' }]}>
            ${formatPrice(signal.takeProfit)}
          </Text>
        </View>
      </View>

      {/* Enhanced Features */}
      {signal.features.aiScore && (
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <Zap color="#00D4AA" size={14} />
            <Text style={styles.aiSectionTitle}>AI Analysis</Text>
          </View>
          <View style={styles.aiScoresContainer}>
            <View style={styles.aiScoreItem}>
              <Text style={styles.aiScoreLabel}>AI Score</Text>
              <Text style={styles.aiScoreValue}>{Math.round(signal.features.aiScore)}</Text>
            </View>
            <View style={styles.aiScoreItem}>
              <Text style={styles.aiScoreLabel}>Probability</Text>
              <Text style={styles.aiScoreValue}>{Math.round(signal.prediction.probability * 100)}%</Text>
            </View>
          </View>
        </View>
      )}

      {/* Technical Scores */}
      <View style={styles.scoresSection}>
        <Text style={styles.scoresTitle}>Technical Analysis</Text>
        <View style={styles.scoresGrid}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Technical</Text>
            <Text style={styles.scoreValue}>{signal.features.technicalScore}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Sentiment</Text>
            <Text style={styles.scoreValue}>{signal.features.sentimentScore}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Volume</Text>
            <Text style={styles.scoreValue}>{signal.features.volumeScore}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Momentum</Text>
            <Text style={styles.scoreValue}>{signal.features.momentumScore}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.modelInfo}>
          <Text style={styles.modelName}>{signal.modelUsed}</Text>
          <Text style={styles.timeframe}>{signal.timeframe}</Text>
        </View>
        
        <View style={styles.timeInfo}>
          <Clock color="#6B7280" size={12} />
          <Text style={styles.timeHorizon}>
            {formatTimeHorizon(signal.prediction.timeHorizon)}
          </Text>
        </View>
      </View>

      {/* Target Price */}
      <View style={styles.targetSection}>
        <Target color="#8B5CF6" size={14} />
        <Text style={styles.targetLabel}>Price Target:</Text>
        <Text style={styles.targetValue}>${formatPrice(signal.prediction.priceTarget)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  aiEnhancedContainer: {
    borderColor: '#00D4AA',
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  aiText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ensembleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ensembleText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  action: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  priceSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#00D4AA',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D4AA',
    marginLeft: 4,
  },
  aiScoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiScoreItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  aiScoreLabel: {
    fontSize: 9,
    color: '#00D4AA',
    marginBottom: 2,
  },
  aiScoreValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
  scoresSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  scoresTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoreItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeframe: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeHorizon: {
    fontSize: 10,
    color: '#6B7280',
  },
  targetSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 8,
    borderRadius: 6,
    gap: 6,
  },
  targetLabel: {
    fontSize: 11,
    color: '#8B5CF6',
    flex: 1,
  },
  targetValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
});