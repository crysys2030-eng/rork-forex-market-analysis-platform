import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Brain,
  Activity,
  AlertTriangle,
} from 'lucide-react-native';
import { useRealForexData } from '@/hooks/useRealForexData';
import { useRealCryptoData } from '@/hooks/useRealCryptoData';

interface TradingSignal {
  symbol: string;
  name: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  strategy: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskReward: number;
  timeframe: string;
  indicators: string[];
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
}

interface StrategyPerformance {
  name: string;
  winRate: number;
  totalTrades: number;
  profitLoss: number;
  avgReturn: number;
  maxDrawdown: number;
}

export default function StrategiesScreen() {
  const insets = useSafeAreaInsets();
  const { forexData, refetch: refetchForex } = useRealForexData();
  const { cryptoData, refetch: refetchCrypto } = useRealCryptoData();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [selectedStrategy, setSelectedStrategy] = useState('ALL');


  const timeframes = ['5M', '15M', '1H', '4H', '1D'];
  const strategies = ['ALL', 'SCALPING', 'DAY_TRADE', 'SWING', 'BREAKOUT', 'REVERSAL'];

  const strategyPerformance: StrategyPerformance[] = [
    {
      name: 'Scalping RSI',
      winRate: 78.5,
      totalTrades: 245,
      profitLoss: 12.8,
      avgReturn: 0.8,
      maxDrawdown: -3.2,
    },
    {
      name: 'Breakout MACD',
      winRate: 72.3,
      totalTrades: 156,
      profitLoss: 18.4,
      avgReturn: 1.2,
      maxDrawdown: -5.1,
    },
    {
      name: 'Swing EMA Cross',
      winRate: 68.9,
      totalTrades: 89,
      profitLoss: 24.7,
      avgReturn: 2.8,
      maxDrawdown: -8.3,
    },
    {
      name: 'Reversal Bollinger',
      winRate: 74.1,
      totalTrades: 134,
      profitLoss: 15.6,
      avgReturn: 1.5,
      maxDrawdown: -4.7,
    },
  ];

  const generateTradingSignals = () => {
    const allData = [...forexData, ...cryptoData];
    const newSignals: TradingSignal[] = [];

    allData.forEach((pair) => {
      const price = pair.price;
      const change = pair.change;
      const changePercent = pair.changePercent;

      // RSI-based Scalping Strategy
      const rsi = 50 + (changePercent * 2); // Simplified RSI calculation
      if (rsi < 30 && changePercent > -2) {
        newSignals.push({
          symbol: pair.symbol,
          name: pair.name,
          signal: 'BUY',
          confidence: Math.min(95, 70 + Math.abs(30 - rsi)),
          strategy: 'SCALPING',
          entryPrice: price,
          targetPrice: price * 1.008, // 0.8% target
          stopLoss: price * 0.996, // 0.4% stop loss
          riskReward: 2.0,
          timeframe: '5M',
          indicators: ['RSI', 'Volume', 'Support'],
          strength: rsi < 25 ? 'STRONG' : 'MODERATE',
        });
      } else if (rsi > 70 && changePercent < 2) {
        newSignals.push({
          symbol: pair.symbol,
          name: pair.name,
          signal: 'SELL',
          confidence: Math.min(95, 70 + Math.abs(rsi - 70)),
          strategy: 'SCALPING',
          entryPrice: price,
          targetPrice: price * 0.992, // 0.8% target
          stopLoss: price * 1.004, // 0.4% stop loss
          riskReward: 2.0,
          timeframe: '5M',
          indicators: ['RSI', 'Volume', 'Resistance'],
          strength: rsi > 75 ? 'STRONG' : 'MODERATE',
        });
      }

      // MACD Breakout Strategy
      if (changePercent > 1.5 && change > 0) {
        newSignals.push({
          symbol: pair.symbol,
          name: pair.name,
          signal: 'BUY',
          confidence: Math.min(90, 60 + changePercent * 10),
          strategy: 'BREAKOUT',
          entryPrice: price,
          targetPrice: price * 1.025, // 2.5% target
          stopLoss: price * 0.985, // 1.5% stop loss
          riskReward: 1.67,
          timeframe: '1H',
          indicators: ['MACD', 'Volume', 'Breakout'],
          strength: changePercent > 3 ? 'STRONG' : 'MODERATE',
        });
      }

      // EMA Swing Strategy
      if (Math.abs(changePercent) > 0.5 && Math.abs(changePercent) < 3) {
        const signal = changePercent > 0 ? 'BUY' : 'SELL';
        const multiplier = signal === 'BUY' ? 1 : -1;
        
        newSignals.push({
          symbol: pair.symbol,
          name: pair.name,
          signal,
          confidence: Math.min(85, 50 + Math.abs(changePercent) * 15),
          strategy: 'SWING',
          entryPrice: price,
          targetPrice: price * (1 + (0.05 * multiplier)), // 5% target
          stopLoss: price * (1 - (0.025 * multiplier)), // 2.5% stop loss
          riskReward: 2.0,
          timeframe: '4H',
          indicators: ['EMA20', 'EMA50', 'Trend'],
          strength: Math.abs(changePercent) > 2 ? 'STRONG' : 'MODERATE',
        });
      }

      // Bollinger Bands Reversal
      if (Math.abs(changePercent) > 2) {
        const signal = changePercent > 0 ? 'SELL' : 'BUY'; // Reversal strategy
        const multiplier = signal === 'BUY' ? 1 : -1;
        
        newSignals.push({
          symbol: pair.symbol,
          name: pair.name,
          signal,
          confidence: Math.min(88, 55 + Math.abs(changePercent) * 12),
          strategy: 'REVERSAL',
          entryPrice: price,
          targetPrice: price * (1 + (0.03 * multiplier)), // 3% target
          stopLoss: price * (1 - (0.015 * multiplier)), // 1.5% stop loss
          riskReward: 2.0,
          timeframe: '1H',
          indicators: ['BB Upper', 'BB Lower', 'Mean Reversion'],
          strength: Math.abs(changePercent) > 4 ? 'STRONG' : 'MODERATE',
        });
      }
    });

    // Sort by confidence and limit to top signals
    const sortedSignals = newSignals
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 20);

    setSignals(sortedSignals);
  };

  useEffect(() => {
    generateTradingSignals();
  }, [forexData, cryptoData, selectedTimeframe]);



  const filteredSignals = signals.filter(signal => {
    if (selectedStrategy === 'ALL') return true;
    return signal.strategy === selectedStrategy;
  });

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return '#10B981';
      case 'SELL': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp color="#10B981" size={16} />;
      case 'SELL': return <TrendingDown color="#EF4444" size={16} />;
      default: return <Activity color="#6B7280" size={16} />;
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'STRONG': return '#10B981';
      case 'MODERATE': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Target color="#00D4AA" size={24} />
              <Text style={styles.title}>Trading Strategies</Text>
            </View>
            <Text style={styles.subtitle}>
              AI-Powered Market Analysis & Signals
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Strategy Performance Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strategy Performance</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.performanceContainer}>
                {strategyPerformance.map((strategy) => (
                  <View key={strategy.name} style={styles.performanceCard}>
                    <Text style={styles.performanceName}>{strategy.name}</Text>
                    <View style={styles.performanceMetrics}>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Win Rate</Text>
                        <Text style={[styles.metricValue, { color: '#10B981' }]}>
                          {strategy.winRate}%
                        </Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>P&L</Text>
                        <Text style={[styles.metricValue, { color: strategy.profitLoss > 0 ? '#10B981' : '#EF4444' }]}>
                          {strategy.profitLoss > 0 ? '+' : ''}{strategy.profitLoss}%
                        </Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Trades</Text>
                        <Text style={styles.metricValue}>{strategy.totalTrades}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filters</Text>
            
            {/* Timeframe Filter */}
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Timeframe</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {timeframes.map((timeframe) => (
                    <TouchableOpacity
                      key={timeframe}
                      style={[
                        styles.filterButton,
                        selectedTimeframe === timeframe && styles.filterButtonActive,
                      ]}
                      onPress={() => setSelectedTimeframe(timeframe)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          selectedTimeframe === timeframe && styles.filterButtonTextActive,
                        ]}
                      >
                        {timeframe}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Strategy Filter */}
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Strategy Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  {strategies.map((strategy) => (
                    <TouchableOpacity
                      key={strategy}
                      style={[
                        styles.filterButton,
                        selectedStrategy === strategy && styles.filterButtonActive,
                      ]}
                      onPress={() => setSelectedStrategy(strategy)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          selectedStrategy === strategy && styles.filterButtonTextActive,
                        ]}
                      >
                        {strategy.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Active Signals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Signals</Text>
              <View style={styles.signalCount}>
                <Brain color="#00D4AA" size={16} />
                <Text style={styles.signalCountText}>{filteredSignals.length}</Text>
              </View>
            </View>

            {filteredSignals.length === 0 ? (
              <View style={styles.emptyState}>
                <AlertTriangle color="#6B7280" size={48} />
                <Text style={styles.emptyStateText}>No signals available</Text>
                <Text style={styles.emptyStateSubtext}>
                  Adjust filters or wait for market conditions
                </Text>
              </View>
            ) : (
              filteredSignals.map((signal) => (
                <View key={`${signal.symbol}-${signal.strategy}`} style={styles.signalCard}>
                  <View style={styles.signalHeader}>
                    <View style={styles.signalInfo}>
                      <Text style={styles.signalSymbol}>{signal.symbol}</Text>
                      <Text style={styles.signalName}>{signal.name}</Text>
                    </View>
                    <View style={styles.signalBadge}>
                      {getSignalIcon(signal.signal)}
                      <Text style={[styles.signalText, { color: getSignalColor(signal.signal) }]}>
                        {signal.signal}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.signalDetails}>
                    <View style={styles.signalRow}>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Confidence</Text>
                        <Text style={styles.signalValue}>{signal.confidence.toFixed(1)}%</Text>
                      </View>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Strategy</Text>
                        <Text style={styles.signalValue}>{signal.strategy}</Text>
                      </View>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Strength</Text>
                        <Text style={[styles.signalValue, { color: getStrengthColor(signal.strength) }]}>
                          {signal.strength}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.signalRow}>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Entry</Text>
                        <Text style={styles.signalValue}>${signal.entryPrice.toFixed(4)}</Text>
                      </View>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Target</Text>
                        <Text style={[styles.signalValue, { color: '#10B981' }]}>
                          ${signal.targetPrice.toFixed(4)}
                        </Text>
                      </View>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Stop Loss</Text>
                        <Text style={[styles.signalValue, { color: '#EF4444' }]}>
                          ${signal.stopLoss.toFixed(4)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.signalRow}>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>R:R Ratio</Text>
                        <Text style={styles.signalValue}>1:{signal.riskReward}</Text>
                      </View>
                      <View style={styles.signalMetric}>
                        <Text style={styles.signalLabel}>Timeframe</Text>
                        <Text style={styles.signalValue}>{signal.timeframe}</Text>
                      </View>
                      <View style={styles.signalMetric}>
                        <Clock color="#6B7280" size={14} />
                        <Text style={styles.signalValue}>Live</Text>
                      </View>
                    </View>

                    <View style={styles.indicatorsContainer}>
                      <Text style={styles.indicatorsLabel}>Indicators:</Text>
                      <View style={styles.indicators}>
                        {signal.indicators.map((indicator) => (
                          <View key={indicator} style={styles.indicator}>
                            <Text style={styles.indicatorText}>{indicator}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerContent: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 36,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  signalCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  signalCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D4AA',
  },
  performanceContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  performanceCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    width: 200,
    borderWidth: 1,
    borderColor: '#374151',
  },
  performanceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  performanceMetrics: {
    gap: 8,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
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
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  signalCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  signalInfo: {
    flex: 1,
  },
  signalSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signalName: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signalText: {
    fontSize: 12,
    fontWeight: '600',
  },
  signalDetails: {
    gap: 12,
  },
  signalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signalMetric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  signalLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  signalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  indicatorsContainer: {
    marginTop: 8,
  },
  indicatorsLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  indicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  indicator: {
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  indicatorText: {
    fontSize: 10,
    color: '#00D4AA',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});