import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Clock,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle,
  Globe,
  Calendar,
} from 'lucide-react-native';

interface CurrencyDetail {
  pair: string;
  currentPrice: number;
  change24h: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  aiSignal: {
    direction: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
    timeframe: string;
    lastUpdate: Date;
  };
  technicalAnalysis: {
    rsi: number;
    macd: string;
    bollingerBands: string;
    support: number;
    resistance: number;
    fibonacci: {
      level: string;
      price: number;
    }[];
  };
  fundamentalFactors: {
    economicEvents: string[];
    centralBankPolicy: string;
    geopoliticalRisk: 'HIGH' | 'MEDIUM' | 'LOW';
    marketSentiment: string;
  };
  strategy: {
    type: 'scalping' | 'swing' | 'daytrading';
    entry: number;
    stopLoss: number;
    takeProfit: number;
    riskReward: string;
    timeHorizon: string;
    keyLevels: number[];
  };
}

interface CurrencyDetailModalProps {
  visible: boolean;
  onClose: () => void;
  pair: string;
  strategyType: 'scalping' | 'swing' | 'daytrading';
}

const { width } = Dimensions.get('window');

export function CurrencyDetailModal({ visible, onClose, pair, strategyType }: CurrencyDetailModalProps) {
  const [currencyDetail, setCurrencyDetail] = useState<CurrencyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateAICurrencyAnalysis = async (pair: string, strategy: 'scalping' | 'swing' | 'daytrading'): Promise<CurrencyDetail> => {
    const basePrice = 1.0500 + Math.random() * 0.2;
    const change = (Math.random() - 0.5) * 0.01;
    const changePercent = (change / basePrice) * 100;
    
    const aiConfidence = Math.floor(75 + Math.random() * 20);
    const aiDirection = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'BUY' : 'SELL') : 'HOLD';
    
    const rsi = Math.floor(30 + Math.random() * 40);
    const support = Number((basePrice - 0.005 - Math.random() * 0.01).toFixed(5));
    const resistance = Number((basePrice + 0.005 + Math.random() * 0.01).toFixed(5));
    
    const strategyConfig = {
      scalping: {
        timeHorizon: '1-5 minutes',
        stopLossDistance: 0.0005,
        takeProfitDistance: 0.0008,
      },
      swing: {
        timeHorizon: '2-7 days',
        stopLossDistance: 0.005,
        takeProfitDistance: 0.015,
      },
      daytrading: {
        timeHorizon: '2-8 hours',
        stopLossDistance: 0.002,
        takeProfitDistance: 0.004,
      },
    };
    
    const config = strategyConfig[strategy];
    const entry = Number((basePrice + (Math.random() - 0.5) * 0.002).toFixed(5));
    
    return {
      pair,
      currentPrice: Number(basePrice.toFixed(5)),
      change24h: Number(change.toFixed(5)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 5000000),
      marketCap: `$${(Math.random() * 100 + 50).toFixed(1)}B`,
      trend: change > 0.003 ? 'BULLISH' : change < -0.003 ? 'BEARISH' : 'NEUTRAL',
      volatility: Math.abs(changePercent) > 1.5 ? 'HIGH' : Math.abs(changePercent) > 0.8 ? 'MEDIUM' : 'LOW',
      aiSignal: {
        direction: aiDirection,
        confidence: aiConfidence,
        reasoning: `AI analysis indicates ${aiDirection === 'BUY' ? 'bullish' : aiDirection === 'SELL' ? 'bearish' : 'neutral'} momentum based on multi-timeframe analysis. Current market structure shows ${aiDirection === 'BUY' ? 'buying' : aiDirection === 'SELL' ? 'selling' : 'consolidation'} pressure with ${aiConfidence}% confidence.`,
        timeframe: strategy === 'scalping' ? 'M1-M5' : strategy === 'swing' ? 'H4-D1' : 'M15-H1',
        lastUpdate: new Date(),
      },
      technicalAnalysis: {
        rsi,
        macd: rsi > 60 ? 'Bullish Crossover' : rsi < 40 ? 'Bearish Crossover' : 'Neutral',
        bollingerBands: Math.random() > 0.5 ? 'Upper Band Squeeze' : 'Lower Band Support',
        support,
        resistance,
        fibonacci: [
          { level: '23.6%', price: Number((support + (resistance - support) * 0.236).toFixed(5)) },
          { level: '38.2%', price: Number((support + (resistance - support) * 0.382).toFixed(5)) },
          { level: '50.0%', price: Number((support + (resistance - support) * 0.5).toFixed(5)) },
          { level: '61.8%', price: Number((support + (resistance - support) * 0.618).toFixed(5)) },
        ],
      },
      fundamentalFactors: {
        economicEvents: [
          'Central Bank Meeting',
          'Employment Data',
          'Inflation Report',
          'GDP Release',
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        centralBankPolicy: ['Hawkish', 'Dovish', 'Neutral'][Math.floor(Math.random() * 3)],
        geopoliticalRisk: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)] as 'HIGH' | 'MEDIUM' | 'LOW',
        marketSentiment: ['Risk-On', 'Risk-Off', 'Mixed'][Math.floor(Math.random() * 3)],
      },
      strategy: {
        type: strategy,
        entry,
        stopLoss: aiDirection === 'BUY' 
          ? Number((entry - config.stopLossDistance).toFixed(5))
          : Number((entry + config.stopLossDistance).toFixed(5)),
        takeProfit: aiDirection === 'BUY'
          ? Number((entry + config.takeProfitDistance).toFixed(5))
          : Number((entry - config.takeProfitDistance).toFixed(5)),
        riskReward: `1:${(config.takeProfitDistance / config.stopLossDistance).toFixed(1)}`,
        timeHorizon: config.timeHorizon,
        keyLevels: [
          support,
          Number((support + (resistance - support) * 0.5).toFixed(5)),
          resistance,
        ],
      },
    };
  };

  const loadCurrencyData = async () => {
    setIsLoading(true);
    try {
      const data = await generateAICurrencyAnalysis(pair, strategyType);
      setCurrencyDetail(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading currency data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible && pair) {
      loadCurrencyData();
      
      // Update every minute
      const interval = setInterval(loadCurrencyData, 60000);
      return () => clearInterval(interval);
    }
  }, [visible, pair, strategyType]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'BULLISH': return '#00D4AA';
      case 'BEARISH': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getSignalColor = (direction: string) => {
    switch (direction) {
      case 'BUY': return '#00D4AA';
      case 'SELL': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return '#EF4444';
      case 'MEDIUM': return '#F59E0B';
      default: return '#00D4AA';
    }
  };

  if (!currencyDetail) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <LinearGradient colors={['#1F2937', '#111827']} style={styles.container}>
          <View style={styles.loadingContainer}>
            <Activity size={40} color={'#00D4AA'} />
            <Text style={styles.loadingText}>Loading Currency Analysis...</Text>
          </View>
        </LinearGradient>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <LinearGradient colors={['#1F2937', '#111827']} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.pairTitle}>{currencyDetail.pair}</Text>
            <Text style={styles.priceText}>{currencyDetail.currentPrice}</Text>
            <View style={styles.changeContainer}>
              <Text style={[styles.changeText, { 
                color: currencyDetail.change24h >= 0 ? '#00D4AA' : '#EF4444' 
              }]}>
                {currencyDetail.change24h >= 0 ? '+' : ''}{currencyDetail.change24h} ({currencyDetail.changePercent}%)
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={'#FFFFFF'} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* AI Signal Section */}
          <LinearGradient colors={['#374151', '#4B5563']} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={20} color={'#00D4AA'} />
              <Text style={styles.sectionTitle}>AI Signal Analysis</Text>
              <View style={styles.updateBadge}>
                <Clock size={12} color={'#9CA3AF'} />
                <Text style={styles.updateText}>Updated {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago</Text>
              </View>
            </View>
            
            <View style={styles.signalContainer}>
              <View style={[styles.signalBadge, { backgroundColor: getSignalColor(currencyDetail.aiSignal.direction) + '20' }]}>
                {currencyDetail.aiSignal.direction === 'BUY' ? (
                  <TrendingUp size={24} color={getSignalColor(currencyDetail.aiSignal.direction)} />
                ) : currencyDetail.aiSignal.direction === 'SELL' ? (
                  <TrendingDown size={24} color={getSignalColor(currencyDetail.aiSignal.direction)} />
                ) : (
                  <Activity size={24} color={getSignalColor(currencyDetail.aiSignal.direction)} />
                )}
                <Text style={[styles.signalText, { color: getSignalColor(currencyDetail.aiSignal.direction) }]}>
                  {currencyDetail.aiSignal.direction}
                </Text>
              </View>
              
              <View style={styles.confidenceContainer}>
                <Target size={16} color={'#9CA3AF'} />
                <Text style={styles.confidenceText}>{currencyDetail.aiSignal.confidence}% Confidence</Text>
              </View>
            </View>
            
            <Text style={styles.reasoningText}>{currencyDetail.aiSignal.reasoning}</Text>
          </LinearGradient>

          {/* Strategy Details */}
          <LinearGradient colors={['#374151', '#4B5563']} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={20} color={'#F59E0B'} />
              <Text style={styles.sectionTitle}>{strategyType.charAt(0).toUpperCase() + strategyType.slice(1)} Strategy</Text>
            </View>
            
            <View style={styles.strategyGrid}>
              <View style={styles.strategyItem}>
                <Text style={styles.strategyLabel}>Entry Price</Text>
                <Text style={styles.strategyValue}>{currencyDetail.strategy.entry}</Text>
              </View>
              <View style={styles.strategyItem}>
                <Text style={styles.strategyLabel}>Stop Loss</Text>
                <Text style={styles.strategyValue}>{currencyDetail.strategy.stopLoss}</Text>
              </View>
              <View style={styles.strategyItem}>
                <Text style={styles.strategyLabel}>Take Profit</Text>
                <Text style={styles.strategyValue}>{currencyDetail.strategy.takeProfit}</Text>
              </View>
              <View style={styles.strategyItem}>
                <Text style={styles.strategyLabel}>Risk:Reward</Text>
                <Text style={styles.strategyValue}>{currencyDetail.strategy.riskReward}</Text>
              </View>
              <View style={styles.strategyItem}>
                <Text style={styles.strategyLabel}>Time Horizon</Text>
                <Text style={styles.strategyValue}>{currencyDetail.strategy.timeHorizon}</Text>
              </View>
              <View style={styles.strategyItem}>
                <Text style={styles.strategyLabel}>Timeframe</Text>
                <Text style={styles.strategyValue}>{currencyDetail.aiSignal.timeframe}</Text>
              </View>
            </View>
            
            <View style={styles.levelsContainer}>
              <Text style={styles.levelsTitle}>Key Levels:</Text>
              <View style={styles.levelsList}>
                {currencyDetail.strategy.keyLevels.map((level, index) => (
                  <View key={index} style={styles.levelBadge}>
                    <Text style={styles.levelText}>{level}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>

          {/* Technical Analysis */}
          <LinearGradient colors={['#374151', '#4B5563']} style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color={'#8B5CF6'} />
              <Text style={styles.sectionTitle}>Technical Analysis</Text>
            </View>
            
            <View style={styles.technicalGrid}>
              <View style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>RSI (14)</Text>
                <Text style={[styles.technicalValue, { 
                  color: currencyDetail.technicalAnalysis.rsi > 70 ? '#EF4444' : 
                        currencyDetail.technicalAnalysis.rsi < 30 ? '#00D4AA' : '#F59E0B'
                }]}>
                  {currencyDetail.technicalAnalysis.rsi}
                </Text>
              </View>
              <View style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>MACD</Text>
                <Text style={styles.technicalValue}>{currencyDetail.technicalAnalysis.macd}</Text>
              </View>
              <View style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>Bollinger Bands</Text>
                <Text style={styles.technicalValue}>{currencyDetail.technicalAnalysis.bollingerBands}</Text>
              </View>
              <View style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>Support</Text>
                <Text style={styles.technicalValue}>{currencyDetail.technicalAnalysis.support}</Text>
              </View>
              <View style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>Resistance</Text>
                <Text style={styles.technicalValue}>{currencyDetail.technicalAnalysis.resistance}</Text>
              </View>
              <View style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>Trend</Text>
                <Text style={[styles.technicalValue, { color: getTrendColor(currencyDetail.trend) }]}>
                  {currencyDetail.trend}
                </Text>
              </View>
            </View>
            
            <View style={styles.fibonacciContainer}>
              <Text style={styles.fibonacciTitle}>Fibonacci Levels:</Text>
              {currencyDetail.technicalAnalysis.fibonacci.map((fib, index) => (
                <View key={index} style={styles.fibonacciItem}>
                  <Text style={styles.fibonacciLevel}>{fib.level}</Text>
                  <Text style={styles.fibonacciPrice}>{fib.price}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Fundamental Analysis */}
          <LinearGradient colors={['#374151', '#4B5563']} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color={'#06B6D4'} />
              <Text style={styles.sectionTitle}>Fundamental Factors</Text>
            </View>
            
            <View style={styles.fundamentalGrid}>
              <View style={styles.fundamentalItem}>
                <Text style={styles.fundamentalLabel}>Central Bank Policy</Text>
                <Text style={styles.fundamentalValue}>{currencyDetail.fundamentalFactors.centralBankPolicy}</Text>
              </View>
              <View style={styles.fundamentalItem}>
                <Text style={styles.fundamentalLabel}>Market Sentiment</Text>
                <Text style={styles.fundamentalValue}>{currencyDetail.fundamentalFactors.marketSentiment}</Text>
              </View>
              <View style={styles.fundamentalItem}>
                <Text style={styles.fundamentalLabel}>Geopolitical Risk</Text>
                <Text style={[styles.fundamentalValue, { 
                  color: getRiskColor(currencyDetail.fundamentalFactors.geopoliticalRisk)
                }]}>
                  {currencyDetail.fundamentalFactors.geopoliticalRisk}
                </Text>
              </View>
              <View style={styles.fundamentalItem}>
                <Text style={styles.fundamentalLabel}>Volume (24h)</Text>
                <Text style={styles.fundamentalValue}>{currencyDetail.volume.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.eventsContainer}>
              <Text style={styles.eventsTitle}>Upcoming Economic Events:</Text>
              {currencyDetail.fundamentalFactors.economicEvents.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Calendar size={14} color={'#06B6D4'} />
                  <Text style={styles.eventText}>{event}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* Market Status */}
          <LinearGradient colors={['#374151', '#4B5563']} style={[styles.section, { marginBottom: 40 }]}>
            <View style={styles.sectionHeader}>
              <Activity size={20} color={'#10B981'} />
              <Text style={styles.sectionTitle}>Market Status</Text>
            </View>
            
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <CheckCircle size={16} color={'#10B981'} />
                <Text style={styles.statusText}>Market Open</Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Volatility:</Text>
                <Text style={[styles.statusValue, { 
                  color: currencyDetail.volatility === 'HIGH' ? '#EF4444' : 
                        currencyDetail.volatility === 'MEDIUM' ? '#F59E0B' : '#00D4AA'
                }]}>
                  {currencyDetail.volatility}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Market Cap:</Text>
                <Text style={styles.statusValue}>{currencyDetail.marketCap}</Text>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flex: 1,
  },
  pairTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#00D4AA',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  updateText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  signalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  signalText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginLeft: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  reasoningText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  strategyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  strategyItem: {
    width: '50%',
    marginBottom: 12,
  },
  strategyLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  strategyValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  levelsContainer: {
    marginTop: 8,
  },
  levelsTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  levelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  levelBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500' as const,
  },
  technicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  technicalItem: {
    width: '50%',
    marginBottom: 12,
  },
  technicalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  technicalValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  fibonacciContainer: {
    marginTop: 8,
  },
  fibonacciTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  fibonacciItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fibonacciLevel: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500' as const,
  },
  fibonacciPrice: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500' as const,
  },
  fundamentalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  fundamentalItem: {
    width: '50%',
    marginBottom: 12,
  },
  fundamentalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  fundamentalValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  eventsContainer: {
    marginTop: 8,
  },
  eventsTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  eventText: {
    fontSize: 12,
    color: '#06B6D4',
    marginLeft: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  statusLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});