import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Activity, Zap, Brain, Target } from 'lucide-react-native';
import { useScalpingAI } from '@/hooks/useScalpingAI';
import { useMLTrading } from '@/hooks/useMLTrading';
import { useRealTimeData } from '@/hooks/useRealTimeData';

interface ActivePairData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  source: 'SCALPING' | 'ML';
  confidence?: number;
  accuracy?: number;
  signals: number;
  lastUpdate: Date;
}

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend = 'neutral' 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} color="#10B981" />;
    if (trend === 'down') return <TrendingDown size={16} color="#EF4444" />;
    return <Activity size={16} color="#6B7280" />;
  };

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text>{icon}</Text>
        </View>
        {getTrendIcon()}
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </LinearGradient>
  );
};

interface ActivePairCardProps {
  pair: ActivePairData;
  onPress?: () => void;
}

const ActivePairCard: React.FC<ActivePairCardProps> = ({ pair, onPress }) => {
  const isPositive = pair.changePercent >= 0;
  const sourceColor = pair.source === 'SCALPING' ? '#F59E0B' : '#8B5CF6';
  const sourceIcon = pair.source === 'SCALPING' ? 
    <Zap size={14} color={sourceColor} /> : 
    <Brain size={14} color={sourceColor} />;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.pairCard}
      >
        <View style={styles.pairHeader}>
          <View style={styles.pairInfo}>
            <Text style={styles.pairSymbol}>{pair.symbol}</Text>
            <View style={styles.sourceTag}>
              <Text>{sourceIcon}</Text>
              <Text style={[styles.sourceText, { color: sourceColor }]}>
                {pair.source}
              </Text>
            </View>
          </View>
          <View style={styles.pairMetrics}>
            <Text style={styles.pairPrice}>
              {pair.price.toFixed(pair.symbol.includes('JPY') ? 3 : 5)}
            </Text>
            <View style={styles.changeContainer}>
              <Text style={[styles.pairChange, { color: isPositive ? '#10B981' : '#EF4444' }]}>
                {isPositive ? '+' : ''}{pair.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.pairStats}>
          <View style={styles.statItem}>
            <Target size={12} color="#6B7280" />
            <Text style={styles.statText}>
              {pair.source === 'SCALPING' ? `${pair.confidence}% Conf` : `${pair.accuracy}% Acc`}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Activity size={12} color="#6B7280" />
            <Text style={styles.statText}>{pair.signals} Signals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.updateTime}>
              {pair.lastUpdate.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const ActiveTradingDashboard: React.FC = () => {
  const { marketData } = useRealTimeData();
  const scalpingAI = useScalpingAI(marketData);
  const mlTrading = useMLTrading(marketData);
  
  const [activePairs, setActivePairs] = useState<ActivePairData[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Combine active pairs from both systems
  useEffect(() => {
    const scalpingPairs = scalpingAI.activePairs || [];
    const mlPairs = mlTrading.activePairs?.map(p => p.symbol) || [];
    
    const combinedPairs: ActivePairData[] = [];
    
    // Process scalping pairs
    scalpingPairs.forEach(symbol => {
      const marketInfo = marketData.find(m => m.symbol === symbol);
      const signals = scalpingAI.signals?.filter(s => s.symbol === symbol) || [];
      const avgConfidence = signals.length > 0 
        ? signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length 
        : 0;
      
      if (marketInfo) {
        combinedPairs.push({
          symbol,
          price: marketInfo.price,
          change: marketInfo.change,
          changePercent: marketInfo.changePercent,
          source: 'SCALPING',
          confidence: Math.round(avgConfidence),
          signals: signals.length,
          lastUpdate: new Date(),
        });
      }
    });
    
    // Process ML pairs (avoid duplicates)
    mlPairs.forEach(symbol => {
      if (combinedPairs.find(p => p.symbol === symbol)) return;
      
      const marketInfo = marketData.find(m => m.symbol === symbol);
      const signals = mlTrading.signals?.filter(s => s.symbol === symbol) || [];
      const avgAccuracy = signals.length > 0 
        ? signals.reduce((sum, s) => sum + s.accuracy, 0) / signals.length 
        : 0;
      
      if (marketInfo) {
        combinedPairs.push({
          symbol,
          price: marketInfo.price,
          change: marketInfo.change,
          changePercent: marketInfo.changePercent,
          source: 'ML',
          accuracy: Math.round(avgAccuracy),
          signals: signals.length,
          lastUpdate: new Date(),
        });
      }
    });
    
    // Sort by signal count and change percentage
    combinedPairs.sort((a, b) => {
      if (a.signals !== b.signals) return b.signals - a.signals;
      return Math.abs(b.changePercent) - Math.abs(a.changePercent);
    });
    
    setActivePairs(combinedPairs);
    setLastUpdate(new Date());
  }, [scalpingAI.activePairs, mlTrading.activePairs, scalpingAI.signals, mlTrading.signals, marketData]);

  // Calculate dashboard metrics
  const totalSignals = (scalpingAI.signals?.length || 0) + (mlTrading.signals?.length || 0);
  const scalpingSignals = scalpingAI.signals?.length || 0;
  const mlSignals = mlTrading.signals?.length || 0;
  const avgConfidence = scalpingAI.signals?.length > 0 
    ? scalpingAI.signals.reduce((sum, s) => sum + s.confidence, 0) / scalpingAI.signals.length 
    : 0;
  const avgAccuracy = mlTrading.signals?.length > 0 
    ? mlTrading.signals.reduce((sum, s) => sum + s.accuracy, 0) / mlTrading.signals.length 
    : 0;

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Active Trading Dashboard</Text>
        <Text style={styles.subtitle}>
          Last updated: {lastUpdate.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </Text>
      </View>

      {/* Metrics Cards */}
      <View style={styles.metricsGrid}>
        <DashboardCard
          title="Total Signals"
          value={totalSignals.toString()}
          subtitle="Active opportunities"
          icon={<Activity size={20} color="#00D4AA" />}
          color="#00D4AA"
          trend={totalSignals > 0 ? 'up' : 'neutral'}
        />
        
        <DashboardCard
          title="Scalping AI"
          value={scalpingSignals.toString()}
          subtitle={`${Math.round(avgConfidence)}% avg confidence`}
          icon={<Zap size={20} color="#F59E0B" />}
          color="#F59E0B"
          trend={scalpingSignals > 0 ? 'up' : 'neutral'}
        />
        
        <DashboardCard
          title="ML Trading"
          value={mlSignals.toString()}
          subtitle={`${Math.round(avgAccuracy)}% avg accuracy`}
          icon={<Brain size={20} color="#8B5CF6" />}
          color="#8B5CF6"
          trend={mlSignals > 0 ? 'up' : 'neutral'}
        />
        
        <DashboardCard
          title="Active Pairs"
          value={activePairs.length.toString()}
          subtitle="Monitored currencies"
          icon={<Target size={20} color="#06B6D4" />}
          color="#06B6D4"
          trend={activePairs.length > 0 ? 'up' : 'neutral'}
        />
      </View>

      {/* Active Pairs List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Currency Pairs</Text>
        <Text style={styles.sectionSubtitle}>
          Real-time data from Scalping AI and ML Trading systems
        </Text>
        
        {activePairs.length === 0 ? (
          <View style={styles.emptyState}>
            <Activity size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No Active Pairs</Text>
            <Text style={styles.emptySubtitle}>
              {scalpingAI.loading || mlTrading.loading 
                ? 'Loading market data...' 
                : 'Pull to refresh and discover trading opportunities'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.pairsList}>
            {activePairs.map((pair, index) => (
              <ActivePairCard
                key={`${pair.symbol}-${pair.source}-${index}`}
                pair={pair}
                onPress={() => {
                  console.log(`Selected ${pair.symbol} from ${pair.source}`);
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* System Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { 
              backgroundColor: scalpingAI.pairDiscoveryActive ? '#10B981' : '#6B7280' 
            }]} />
            <Text style={styles.statusText}>Scalping AI</Text>
            <Text style={styles.statusValue}>
              {scalpingAI.pairDiscoveryActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { 
              backgroundColor: mlTrading.models?.some(m => m.status === 'ACTIVE') ? '#10B981' : '#6B7280' 
            }]} />
            <Text style={styles.statusText}>ML Trading</Text>
            <Text style={styles.statusValue}>
              {mlTrading.models?.some(m => m.status === 'ACTIVE') ? 'Active' : 'Inactive'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusIndicator, { 
              backgroundColor: marketData.length > 0 ? '#10B981' : '#EF4444' 
            }]} />
            <Text style={styles.statusText}>Market Data</Text>
            <Text style={styles.statusValue}>
              {marketData.length} pairs
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  pairsList: {
    gap: 12,
  },
  pairCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  pairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pairInfo: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pairMetrics: {
    alignItems: 'flex-end',
  },
  pairPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1F2937',
  },
  pairChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  pairStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  updateTime: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D1D5DB',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});