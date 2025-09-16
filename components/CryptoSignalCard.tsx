import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CryptoSignal } from '@/types/forex';
import { TrendingUp, TrendingDown, Clock, Shield, Brain } from 'lucide-react-native';

interface CryptoSignalCardProps {
  signal: CryptoSignal;
  onPress?: () => void;
}

export function CryptoSignalCard({ signal, onPress }: CryptoSignalCardProps) {
  const isPositive = signal.type === 'buy';
  const signalColor = isPositive ? '#00D4AA' : '#FF6B6B';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#00D4AA';
      case 'medium': return '#F59E0B';
      case 'high': return '#FF6B6B';
      default: return '#9CA3AF';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.signalInfo}>
          <View style={[styles.signalBadge, { backgroundColor: signalColor + '20' }]}>
            <TrendIcon size={16} color={signalColor} />
            <Text style={[styles.signalType, { color: signalColor }]}>
              {signal.type.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.symbol}>{signal.symbol.replace('USDT', '')}</Text>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence</Text>
          <Text style={[styles.confidence, { color: signalColor }]}>
            {signal.confidence}%
          </Text>
        </View>
      </View>

      <View style={styles.priceSection}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Entry</Text>
          <Text style={styles.priceValue}>{formatPrice(signal.entryPrice)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Target</Text>
          <Text style={[styles.priceValue, { color: '#00D4AA' }]}>
            {formatPrice(signal.targetPrice)}
          </Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Stop Loss</Text>
          <Text style={[styles.priceValue, { color: '#FF6B6B' }]}>
            {formatPrice(signal.stopLoss)}
          </Text>
        </View>
      </View>

      <View style={styles.metaSection}>
        <View style={styles.metaItem}>
          <Clock size={14} color="#9CA3AF" />
          <Text style={styles.metaText}>{signal.timeframe}</Text>
        </View>
        <View style={styles.metaItem}>
          <Shield size={14} color={getRiskColor(signal.riskLevel)} />
          <Text style={[styles.metaText, { color: getRiskColor(signal.riskLevel) }]}>
            {signal.riskLevel.toUpperCase()} RISK
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Brain size={14} color="#00D4AA" />
          <Text style={styles.metaText}>AI Enhanced</Text>
        </View>
      </View>

      <View style={styles.indicatorsSection}>
        <Text style={styles.indicatorsTitle}>Technical Indicators</Text>
        <View style={styles.indicatorsList}>
          {signal.indicators.slice(0, 3).map((indicator) => (
            <View key={indicator} style={styles.indicatorBadge}>
              <Text style={styles.indicatorText}>{indicator}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <Brain size={16} color="#00D4AA" />
          <Text style={styles.aiTitle}>AI Analysis</Text>
        </View>
        <Text style={styles.aiAnalysis} numberOfLines={2}>
          {signal.aiAnalysis}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  signalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  signalType: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    marginLeft: 4,
  },
  symbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 2,
  },
  confidence: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  indicatorsSection: {
    marginBottom: 16,
  },
  indicatorsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  indicatorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  indicatorBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  indicatorText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '500' as const,
  },
  aiSection: {
    backgroundColor: '#00D4AA10',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#00D4AA30',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    color: '#00D4AA',
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  aiAnalysis: {
    color: '#D1D5DB',
    fontSize: 13,
    lineHeight: 18,
  },
});