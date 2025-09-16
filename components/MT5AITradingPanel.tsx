import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  Volume2,
  Clock,
  Brain,
  Zap
} from 'lucide-react-native';
import { useMT5AIAnalysis, MT5AIAnalysis } from '@/hooks/useMT5AIAnalysis';
import { useMT5Connection } from '@/hooks/useMT5Connection';

interface AITradingPanelProps {
  strategy: 'SCALPING' | 'DAY_TRADE' | 'SWING';
}

export const MT5AITradingPanel: React.FC<AITradingPanelProps> = ({ strategy }) => {
  const { analyses, isLoading, lastUpdate } = useMT5AIAnalysis();
  const { isConnected, executeTrade } = useMT5Connection();
  const [executingTrades, setExecutingTrades] = useState<Set<string>>(new Set());

  const filteredAnalyses = analyses.filter(analysis => analysis.strategy === strategy);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return '#10B981';
      case 'SELL': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return TrendingUp;
      case 'SELL': return TrendingDown;
      default: return Minus;
    }
  };

  const getStrategyColor = (strat: string): [string, string] => {
    switch (strat) {
      case 'SCALPING': return ['#8B5CF6', '#7C3AED'];
      case 'DAY_TRADE': return ['#3B82F6', '#2563EB'];
      case 'SWING': return ['#F59E0B', '#D97706'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const handleExecuteTrade = async (analysis: MT5AIAnalysis) => {
    if (!isConnected || analysis.signal === 'HOLD') return;

    setExecutingTrades(prev => new Set(prev).add(analysis.symbol));

    try {
      const result = await executeTrade({
        action: analysis.signal,
        symbol: analysis.symbol,
        volume: analysis.volume,
        sl: analysis.stopLoss,
        tp: analysis.takeProfit,
        comment: `AI ${strategy} - ${analysis.confidence.toFixed(1)}% confidence`
      });

      if (result.success) {
        console.log(`Trade executed: ${analysis.symbol} ${analysis.signal}`);
      } else {
        console.error('Trade failed:', result.error);
      }
    } catch (error) {
      console.error('Execute trade error:', error);
    } finally {
      setExecutingTrades(prev => {
        const newSet = new Set(prev);
        newSet.delete(analysis.symbol);
        return newSet;
      });
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && filteredAnalyses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Analyzing market with AI...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getStrategyColor(strategy)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Brain size={24} color="#FFFFFF" />
            <Text style={styles.headerTitle}>AI {strategy.replace('_', ' ')}</Text>
          </View>
          <View style={styles.headerRight}>
            <Zap size={16} color="#FFFFFF" />
            <Text style={styles.lastUpdate}>
              {lastUpdate ? formatTime(lastUpdate) : '--:--'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.analysisContainer} showsVerticalScrollIndicator={false}>
        {filteredAnalyses.map((analysis) => {
          const SignalIcon = getSignalIcon(analysis.signal);
          const isExecuting = executingTrades.has(analysis.symbol);
          
          return (
            <View key={analysis.symbol} style={styles.analysisCard}>
              <View style={styles.analysisHeader}>
                <View style={styles.symbolRow}>
                  <Text style={styles.symbolText}>{analysis.symbol}</Text>
                  <View style={[
                    styles.signalBadge,
                    { backgroundColor: getSignalColor(analysis.signal) }
                  ]}>
                    <SignalIcon size={12} color="#FFFFFF" />
                    <Text style={styles.signalText}>{analysis.signal}</Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>
                  {analysis.confidence.toFixed(1)}% confidence
                </Text>
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceItem}>
                  <Target size={14} color="#3B82F6" />
                  <Text style={styles.priceLabel}>Entry</Text>
                  <Text style={styles.priceValue}>{analysis.entryPrice.toFixed(5)}</Text>
                </View>
                <View style={styles.priceItem}>
                  <Shield size={14} color="#EF4444" />
                  <Text style={styles.priceLabel}>SL</Text>
                  <Text style={styles.priceValue}>{analysis.stopLoss.toFixed(5)}</Text>
                </View>
                <View style={styles.priceItem}>
                  <TrendingUp size={14} color="#10B981" />
                  <Text style={styles.priceLabel}>TP</Text>
                  <Text style={styles.priceValue}>{analysis.takeProfit.toFixed(5)}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Volume2 size={12} color="#6B7280" />
                  <Text style={styles.detailText}>Vol: {analysis.volume}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.detailText}>{analysis.timeframe}</Text>
                </View>
                <Text style={styles.riskRewardText}>
                  R:R {analysis.riskReward.toFixed(1)}
                </Text>
              </View>

              <Text style={styles.reasoningText} numberOfLines={2}>
                {analysis.reasoning}
              </Text>

              <View style={styles.indicatorsRow}>
                <Text style={styles.indicatorText}>
                  RSI: {analysis.technicalIndicators.rsi.toFixed(1)}
                </Text>
                <Text style={styles.indicatorText}>
                  MACD: {analysis.technicalIndicators.macd.toFixed(3)}
                </Text>
                <Text style={styles.indicatorText}>
                  BB: {analysis.technicalIndicators.bollinger}
                </Text>
              </View>

              {isConnected && analysis.signal !== 'HOLD' && (
                <TouchableOpacity
                  style={[
                    styles.executeButton,
                    { backgroundColor: getSignalColor(analysis.signal) },
                    isExecuting && styles.executeButtonDisabled
                  ]}
                  onPress={() => handleExecuteTrade(analysis)}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.executeButtonText}>
                      Execute {analysis.signal}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {!isConnected && (
                <View style={styles.notConnectedBanner}>
                  <Text style={styles.notConnectedText}>
                    Connect to MT5 to execute trades
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 4,
  },
  analysisContainer: {
    flex: 1,
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisHeader: {
    marginBottom: 12,
  },
  symbolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  signalText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  riskRewardText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  reasoningText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 16,
  },
  indicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  indicatorText: {
    fontSize: 10,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  executeButton: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  executeButtonDisabled: {
    opacity: 0.6,
  },
  executeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  notConnectedBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  notConnectedText: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'center',
  },
});