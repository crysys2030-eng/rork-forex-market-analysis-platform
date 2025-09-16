import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Zap, 
  Target, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react-native';
import { AdvancedPattern } from '@/types/forex';

interface AdvancedPatternCardProps {
  pattern: AdvancedPattern;
  onPress?: () => void;
}

export function AdvancedPatternCard({ pattern, onPress }: AdvancedPatternCardProps) {
  const getTypeColor = (type: string) => {
    return type === 'continuation' ? '#10B981' : '#F59E0B';
  };

  const getTypeIcon = (type: string) => {
    return type === 'continuation' ? 
      <TrendingUp size={16} color="#10B981" /> : 
      <TrendingDown size={16} color="#F59E0B" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return '#10B981';
    if (confidence >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.patternInfo}>
            <Text style={styles.symbol}>{pattern.symbol}</Text>
            <Text style={styles.pattern}>{pattern.pattern}</Text>
          </View>
          <View style={styles.aiIndicator}>
            {pattern.aiConfirmed ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <AlertTriangle size={20} color="#F59E0B" />
            )}
            <Text style={styles.aiText}>
              {pattern.aiConfirmed ? 'AI Confirmed' : 'Pending AI'}
            </Text>
          </View>
        </View>

        {/* Pattern Type */}
        <View style={styles.typeContainer}>
          {getTypeIcon(pattern.type)}
          <Text style={[styles.type, { color: getTypeColor(pattern.type) }]}>
            {pattern.type.toUpperCase()}
          </Text>
          <Text style={styles.timeframe}>{pattern.timeframe}</Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Zap size={14} color="#9CA3AF" />
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={[
              styles.metricValue,
              { color: getConfidenceColor(pattern.confidence) }
            ]}>
              {pattern.confidence}%
            </Text>
          </View>
          <View style={styles.metric}>
            <Target size={14} color="#9CA3AF" />
            <Text style={styles.metricLabel}>Probability</Text>
            <Text style={styles.metricValue}>{pattern.probability}%</Text>
          </View>
        </View>

        {/* Price Levels */}
        <View style={styles.pricesContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Entry:</Text>
            <Text style={styles.priceValue}>{pattern.entryPrice.toFixed(5)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Target:</Text>
            <Text style={[styles.priceValue, { color: '#10B981' }]}>
              {pattern.targetPrice.toFixed(5)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Stop Loss:</Text>
            <Text style={[styles.priceValue, { color: '#EF4444' }]}>
              {pattern.stopLoss.toFixed(5)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{pattern.description}</Text>

        {/* Risk Reward Ratio */}
        <View style={styles.rrContainer}>
          <Shield size={14} color="#9CA3AF" />
          <Text style={styles.rrLabel}>Risk/Reward:</Text>
          <Text style={styles.rrValue}>
            1:{((Math.abs(pattern.targetPrice - pattern.entryPrice) / Math.abs(pattern.entryPrice - pattern.stopLoss))).toFixed(2)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patternInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pattern: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '600',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  timeframe: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    backgroundColor: '#374151',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    marginRight: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pricesContainer: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
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
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
    marginBottom: 8,
  },
  rrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rrLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    marginRight: 4,
  },
  rrValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
});