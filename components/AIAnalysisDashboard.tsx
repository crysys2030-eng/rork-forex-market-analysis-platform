import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react-native';
import { useAITradingSignals, AITradingSignal } from '@/hooks/useAITradingSignals';
import { useEnhancedMarketData } from '@/hooks/useEnhancedMarketData';

const { width } = Dimensions.get('window');

interface AIAnalysisDashboardProps {
  onSignalSelect?: (signal: AITradingSignal) => void;
}

export function AIAnalysisDashboard({ onSignalSelect }: AIAnalysisDashboardProps) {
  const { allData, loading: marketLoading } = useEnhancedMarketData();
  const { signals, analysis, loading: aiLoading, generateSignals } = useAITradingSignals();
  const [selectedModel, setSelectedModel] = useState<'DeepSeek' | 'ChatGPT' | 'Hybrid'>('Hybrid');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (allData.length > 0 && !aiLoading) {
      generateSignals(allData, selectedModel);
    }
  }, [allData, selectedModel, generateSignals, aiLoading]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (allData.length > 0 && !aiLoading) {
        generateSignals(allData, selectedModel);
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [autoRefresh, allData, selectedModel, generateSignals, aiLoading]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return '#10B981';
      case 'SELL': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#10B981';
    if (confidence >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const renderModelSelector = () => (
    <View style={styles.modelSelector}>
      <Text style={styles.sectionTitle}>AI Model</Text>
      <View style={styles.modelButtons}>
        {(['DeepSeek', 'ChatGPT', 'Hybrid'] as const).map((model) => (
          <TouchableOpacity
            key={model}
            style={[
              styles.modelButton,
              selectedModel === model && styles.modelButtonActive
            ]}
            onPress={() => setSelectedModel(model)}
          >
            <Text style={[
              styles.modelButtonText,
              selectedModel === model && styles.modelButtonTextActive
            ]}>
              {model}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMarketOverview = () => {
    if (!analysis) return null;

    const { marketOverview, economicFactors } = analysis;

    return (
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.overviewCard}
      >
        <View style={styles.cardHeader}>
          <BarChart3 size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>Market Overview</Text>
          <View style={[
            styles.trendBadge,
            { backgroundColor: marketOverview.trend === 'BULLISH' ? '#10B981' : marketOverview.trend === 'BEARISH' ? '#EF4444' : '#6B7280' }
          ]}>
            <Text style={styles.trendText}>{marketOverview.trend}</Text>
          </View>
        </View>

        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Volatility</Text>
            <Text style={[styles.overviewValue, { color: getRiskColor(marketOverview.volatility) }]}>
              {marketOverview.volatility}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Risk Level</Text>
            <Text style={[styles.overviewValue, { color: getConfidenceColor(100 - marketOverview.riskLevel * 10) }]}>
              {marketOverview.riskLevel}/10
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Inflation</Text>
            <Text style={styles.overviewValue}>{economicFactors.inflation.toFixed(1)}%</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Interest Rate</Text>
            <Text style={styles.overviewValue}>{economicFactors.interestRates.toFixed(2)}%</Text>
          </View>
        </View>

        <Text style={styles.recommendation}>{marketOverview.recommendation}</Text>
      </LinearGradient>
    );
  };

  const renderSignalCard = (signal: AITradingSignal) => (
    <TouchableOpacity
      key={signal.id}
      style={styles.signalCard}
      onPress={() => onSignalSelect?.(signal)}
    >
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.signalGradient}
      >
        <View style={styles.signalHeader}>
          <View style={styles.signalSymbol}>
            <Text style={styles.symbolText}>{signal.symbol}</Text>
            <Text style={styles.symbolName}>{signal.symbol.replace('USDT', '/USDT')}</Text>
          </View>
          <View style={styles.signalAction}>
            <View style={[styles.actionBadge, { backgroundColor: getActionColor(signal.action) }]}>
              {signal.action === 'BUY' ? (
                <TrendingUp size={14} color="white" />
              ) : signal.action === 'SELL' ? (
                <TrendingDown size={14} color="white" />
              ) : (
                <Target size={14} color="white" />
              )}
              <Text style={styles.actionText}>{signal.action}</Text>
            </View>
          </View>
        </View>

        <View style={styles.signalMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={[styles.metricValue, { color: getConfidenceColor(signal.confidence) }]}>
              {signal.confidence}%
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Risk</Text>
            <Text style={[styles.metricValue, { color: getRiskColor(signal.riskLevel) }]}>
              {signal.riskLevel}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Timeframe</Text>
            <Text style={styles.metricValue}>{signal.timeframe}</Text>
          </View>
        </View>

        <View style={styles.priceTargets}>
          <View style={styles.priceTarget}>
            <Text style={styles.priceLabel}>Entry</Text>
            <Text style={styles.priceValue}>{signal.entryPrice.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}</Text>
          </View>
          <View style={styles.priceTarget}>
            <Text style={styles.priceLabel}>Stop Loss</Text>
            <Text style={[styles.priceValue, { color: '#EF4444' }]}>
              {signal.stopLoss.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}
            </Text>
          </View>
          <View style={styles.priceTarget}>
            <Text style={styles.priceLabel}>Take Profit</Text>
            <Text style={[styles.priceValue, { color: '#10B981' }]}>
              {signal.takeProfit.toFixed(signal.symbol.includes('JPY') ? 2 : 4)}
            </Text>
          </View>
        </View>

        <Text style={styles.reasoning}>{signal.reasoning}</Text>

        <View style={styles.signalFooter}>
          <View style={styles.aiModelBadge}>
            <Brain size={12} color="#8B5CF6" />
            <Text style={styles.aiModelText}>{signal.aiModel}</Text>
          </View>
          <View style={styles.timestamp}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.timestampText}>
              {new Date(signal.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTechnicalIndicators = (signal: AITradingSignal) => (
    <View style={styles.technicalCard}>
      <Text style={styles.technicalTitle}>Technical Analysis</Text>
      <View style={styles.technicalGrid}>
        <View style={styles.technicalItem}>
          <Text style={styles.technicalLabel}>RSI</Text>
          <Text style={[
            styles.technicalValue,
            { color: signal.technicalIndicators.rsi < 30 ? '#10B981' : signal.technicalIndicators.rsi > 70 ? '#EF4444' : '#F59E0B' }
          ]}>
            {signal.technicalIndicators.rsi}
          </Text>
        </View>
        <View style={styles.technicalItem}>
          <Text style={styles.technicalLabel}>MACD</Text>
          <Text style={[
            styles.technicalValue,
            { color: signal.technicalIndicators.macd > 0 ? '#10B981' : '#EF4444' }
          ]}>
            {signal.technicalIndicators.macd.toFixed(4)}
          </Text>
        </View>
        <View style={styles.technicalItem}>
          <Text style={styles.technicalLabel}>Bollinger</Text>
          <Text style={styles.technicalValue}>{signal.technicalIndicators.bollinger}</Text>
        </View>
        <View style={styles.technicalItem}>
          <Text style={styles.technicalLabel}>Sentiment</Text>
          <Text style={[
            styles.technicalValue,
            { color: signal.marketSentiment === 'BULLISH' ? '#10B981' : signal.marketSentiment === 'BEARISH' ? '#EF4444' : '#6B7280' }
          ]}>
            {signal.marketSentiment}
          </Text>
        </View>
      </View>
    </View>
  );

  if (marketLoading || aiLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Analyzing market data with AI...</Text>
        <View style={styles.loadingSteps}>
          <View style={styles.loadingStep}>
            <Sparkles size={16} color="#3B82F6" />
            <Text style={styles.loadingStepText}>Fetching real-time data</Text>
          </View>
          <View style={styles.loadingStep}>
            <Brain size={16} color="#8B5CF6" />
            <Text style={styles.loadingStepText}>AI analysis in progress</Text>
          </View>
          <View style={styles.loadingStep}>
            <Target size={16} color="#10B981" />
            <Text style={styles.loadingStepText}>Generating signals</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Brain size={24} color="#3B82F6" />
          <Text style={styles.title}>AI Trading Analysis</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => generateSignals(allData, selectedModel)}
        >
          <Zap size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {renderModelSelector()}
      {renderMarketOverview()}

      <View style={styles.signalsSection}>
        <View style={styles.signalsHeader}>
          <Text style={styles.sectionTitle}>AI Trading Signals</Text>
          <View style={styles.signalsCount}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.signalsCountText}>{signals.length} Active</Text>
          </View>
        </View>

        {signals.length === 0 ? (
          <View style={styles.noSignals}>
            <AlertTriangle size={48} color="#6B7280" />
            <Text style={styles.noSignalsText}>No signals available</Text>
            <Text style={styles.noSignalsSubtext}>AI is analyzing market conditions</Text>
          </View>
        ) : (
          signals.map(renderSignalCard)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
  },
  modelSelector: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  modelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#374151',
  },
  modelButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  modelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  modelButtonTextActive: {
    color: '#FFFFFF',
  },
  overviewCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  overviewItem: {
    flex: 1,
    minWidth: (width - 80) / 2,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  recommendation: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  signalsSection: {
    paddingHorizontal: 20,
  },
  signalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  signalsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalsCountText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  signalCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  signalGradient: {
    padding: 16,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  signalSymbol: {
    flex: 1,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  symbolName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  signalAction: {
    alignItems: 'flex-end',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  priceTargets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  priceTarget: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  reasoning: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 12,
  },
  signalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiModelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiModelText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#6B7280',
  },
  technicalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  technicalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  technicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  technicalItem: {
    flex: 1,
    minWidth: (width - 120) / 2,
  },
  technicalLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  technicalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#F8FAFC',
    marginTop: 16,
    marginBottom: 24,
  },
  loadingSteps: {
    gap: 12,
  },
  loadingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingStepText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  noSignals: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noSignalsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  noSignalsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});