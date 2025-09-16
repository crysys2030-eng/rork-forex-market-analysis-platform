import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Target, TrendingUp, TrendingDown, BarChart3, Clock, Award } from 'lucide-react-native';
import { AITradingSignal } from '@/types/forex';

interface TradingStrategy {
  name: string;
  type: 'SCALPING' | 'DAY_TRADE' | 'SWING';
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  signals: AITradingSignal[];
}

interface AdvancedTradingStrategiesProps {
  strategies: TradingStrategy[];
  onStrategyPress?: (strategy: TradingStrategy) => void;
}

export function AdvancedTradingStrategies({ strategies, onStrategyPress }: AdvancedTradingStrategiesProps) {
  const getStrategyColor = (type: string) => {
    switch (type) {
      case 'SCALPING': return '#FF6B6B';
      case 'DAY_TRADE': return '#F59E0B';
      case 'SWING': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'SCALPING': return '⚡';
      case 'DAY_TRADE': return '📈';
      case 'SWING': return '🎯';
      default: return '📊';
    }
  };

  const getPerformanceColor = (value: number, type: 'winRate' | 'profitFactor' | 'drawdown') => {
    switch (type) {
      case 'winRate':
        return value >= 70 ? '#00D4AA' : value >= 60 ? '#F59E0B' : '#EF4444';
      case 'profitFactor':
        return value >= 1.5 ? '#00D4AA' : value >= 1.2 ? '#F59E0B' : '#EF4444';
      case 'drawdown':
        return value <= 10 ? '#00D4AA' : value <= 20 ? '#F59E0B' : '#EF4444';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Target size={20} color="#00D4AA" />
        <Text style={styles.title}>Advanced Trading Strategies</Text>
        <View style={styles.strategiesCount}>
          <Text style={styles.countText}>{strategies.length}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.strategiesContainer}>
        {strategies.map((strategy, index) => (
          <TouchableOpacity
            key={strategy.name}
            style={[styles.strategyCard, { borderLeftColor: getStrategyColor(strategy.type) }]}
            onPress={() => onStrategyPress?.(strategy)}
          >
            <View style={styles.strategyHeader}>
              <Text style={styles.strategyIcon}>{getStrategyIcon(strategy.type)}</Text>
              <View style={styles.strategyInfo}>
                <Text style={styles.strategyName}>{strategy.name}</Text>
                <Text style={[styles.strategyType, { color: getStrategyColor(strategy.type) }]}>
                  {strategy.type.replace('_', ' ')}
                </Text>
              </View>
            </View>

            <View style={styles.performanceGrid}>
              <View style={styles.performanceItem}>
                <Award size={14} color={getPerformanceColor(strategy.winRate, 'winRate')} />
                <Text style={styles.performanceLabel}>Win Rate</Text>
                <Text style={[styles.performanceValue, { color: getPerformanceColor(strategy.winRate, 'winRate') }]}>
                  {strategy.winRate.toFixed(1)}%
                </Text>
              </View>

              <View style={styles.performanceItem}>
                <TrendingUp size={14} color={getPerformanceColor(strategy.profitFactor, 'profitFactor')} />
                <Text style={styles.performanceLabel}>Profit Factor</Text>
                <Text style={[styles.performanceValue, { color: getPerformanceColor(strategy.profitFactor, 'profitFactor') }]}>
                  {strategy.profitFactor.toFixed(2)}
                </Text>
              </View>

              <View style={styles.performanceItem}>
                <TrendingDown size={14} color={getPerformanceColor(strategy.maxDrawdown, 'drawdown')} />
                <Text style={styles.performanceLabel}>Max DD</Text>
                <Text style={[styles.performanceValue, { color: getPerformanceColor(strategy.maxDrawdown, 'drawdown') }]}>
                  {strategy.maxDrawdown.toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.signalsSection}>
              <Text style={styles.signalsTitle}>Recent Signals</Text>
              <View style={styles.signalsList}>
                {strategy.signals.slice(0, 3).map((signal, idx) => (
                  <View key={signal.id} style={styles.signalItem}>
                    <Text style={styles.signalSymbol}>{signal.symbol}</Text>
                    <View style={[styles.signalBadge, { 
                      backgroundColor: signal.type === 'BUY' ? '#00D4AA20' : '#FF6B6B20' 
                    }]}>
                      <Text style={[styles.signalType, { 
                        color: signal.type === 'BUY' ? '#00D4AA' : '#FF6B6B' 
                      }]}>
                        {signal.type}
                      </Text>
                    </View>
                    <Text style={styles.signalConfidence}>{signal.confidence}%</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.strategyFooter}>
              <View style={styles.activeSignals}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.activeSignalsText}>
                  {strategy.signals.filter(s => s.status === 'active').length} active
                </Text>
              </View>
              
              <View style={styles.totalSignals}>
                <BarChart3 size={12} color="#8B5CF6" />
                <Text style={styles.totalSignalsText}>
                  {strategy.signals.length} total
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {strategies.length === 0 && (
        <View style={styles.emptyState}>
          <Target size={48} color="#6B7280" />
          <Text style={styles.emptyText}>No trading strategies available</Text>
          <Text style={styles.emptySubtext}>Strategies will appear here once AI analysis generates signals</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  strategiesCount: {
    backgroundColor: '#00D4AA20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#00D4AA',
    fontWeight: 'bold',
  },
  strategiesContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  strategyCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 280,
    borderWidth: 1,
    borderColor: '#374151',
    borderLeftWidth: 4,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  strategyIcon: {
    fontSize: 24,
  },
  strategyInfo: {
    flex: 1,
  },
  strategyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  strategyType: {
    fontSize: 12,
    fontWeight: '600',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  performanceItem: {
    alignItems: 'center',
    gap: 4,
  },
  performanceLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  signalsSection: {
    marginBottom: 16,
  },
  signalsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  signalsList: {
    gap: 6,
  },
  signalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    padding: 8,
    borderRadius: 6,
  },
  signalSymbol: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  signalBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  signalType: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  signalConfidence: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  strategyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeSignals: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeSignalsText: {
    fontSize: 10,
    color: '#6B7280',
  },
  totalSignals: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalSignalsText: {
    fontSize: 10,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});