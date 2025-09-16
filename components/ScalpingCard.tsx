import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, TrendingUp, TrendingDown, Clock, Target } from 'lucide-react-native';
import { ScalpingSignal } from '@/hooks/useTradingStrategies';
import { CurrencyDetailModal } from '@/components/CurrencyDetailModal';

interface ScalpingCardProps {
  data: ScalpingSignal[];
}

export function ScalpingCard({ data }: ScalpingCardProps) {
  const [selectedPair, setSelectedPair] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const activeSignals = data.filter(signal => signal.status === 'ACTIVE');
  const recentSignals = data.slice(0, 6);
  
  const handleViewDetails = (pair: string) => {
    setSelectedPair(pair);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#00D4AA';
      case 'CLOSED': return '#6B7280';
      case 'PENDING': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getPnLColor = (pnl?: number) => {
    if (!pnl) return '#6B7280';
    return pnl >= 0 ? '#00D4AA' : '#EF4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Zap size={24} color={'#FF6B6B'} />
          <Text style={styles.title}>Scalping Signals</Text>
        </View>
        <View style={styles.activeCount}>
          <Text style={styles.activeCountText}>{activeSignals.length} Active</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Hold Time</Text>
          <Text style={styles.statValue}>3.2 min</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Success Rate</Text>
          <Text style={styles.statValue}>78.5%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Pips</Text>
          <Text style={styles.statValue}>+12.3</Text>
        </View>
      </View>

      <ScrollView style={styles.signalsContainer} showsVerticalScrollIndicator={false}>
        {recentSignals.map((signal) => (
          <LinearGradient
            key={signal.id}
            colors={['#374151', '#4B5563']}
            style={styles.signalCard}
          >
            <View style={styles.signalHeader}>
              <View style={styles.pairContainer}>
                <Text style={styles.pairText}>{signal.pair}</Text>
                <View style={[styles.directionBadge, { 
                  backgroundColor: signal.direction === 'BUY' ? '#00D4AA20' : '#EF444420' 
                }]}>
                  {signal.direction === 'BUY' ? 
                    <TrendingUp size={16} color={'#00D4AA'} /> : 
                    <TrendingDown size={16} color={'#EF4444'} />
                  }
                  <Text style={[styles.directionText, { 
                    color: signal.direction === 'BUY' ? '#00D4AA' : '#EF4444' 
                  }]}>
                    {signal.direction}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(signal.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(signal.status) }]}>
                  {signal.status}
                </Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Entry</Text>
                <Text style={styles.priceValue}>{signal.entry}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>SL</Text>
                <Text style={styles.priceValue}>{signal.stopLoss}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>TP</Text>
                <Text style={styles.priceValue}>{signal.takeProfit}</Text>
              </View>
            </View>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Clock size={14} color={'#9CA3AF'} />
                <Text style={styles.metaText}>{signal.timeframe}</Text>
              </View>
              <View style={styles.metaItem}>
                <Target size={14} color={'#9CA3AF'} />
                <Text style={styles.metaText}>{signal.confidence}%</Text>
              </View>
              {signal.pnl !== undefined && (
                <View style={styles.metaItem}>
                  <Text style={[styles.pnlText, { color: getPnLColor(signal.pnl) }]}>
                    {signal.pnl >= 0 ? '+' : ''}{signal.pnl}$
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.strategyText}>{signal.strategy}</Text>
            <Text style={styles.reasoningText}>{signal.aiReasoning}</Text>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleViewDetails(signal.pair)}
            >
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>
      
      <CurrencyDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pair={selectedPair}
        strategyType="scalping"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  activeCount: {
    backgroundColor: '#FF6B6B20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeCountText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  signalsContainer: {
    flex: 1,
  },
  signalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pairText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
    marginRight: 12,
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  directionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  pnlText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  strategyText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#00D4AA',
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#FF6B6B20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600' as const,
  },
});