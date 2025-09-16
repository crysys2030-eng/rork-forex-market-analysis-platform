import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Calendar, Target, BarChart3, Globe } from 'lucide-react-native';
import { SwingSignal } from '@/hooks/useTradingStrategies';
import { CurrencyDetailModal } from '@/components/CurrencyDetailModal';

interface SwingTradingCardProps {
  data: SwingSignal[];
}

export function SwingTradingCard({ data }: SwingTradingCardProps) {
  const [selectedPair, setSelectedPair] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const activeSignals = data.filter(signal => signal.status === 'ACTIVE');
  const recentSignals = data.slice(0, 5);
  
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
          <TrendingUp size={24} color={'#4ECDC4'} />
          <Text style={styles.title}>Swing Trading</Text>
        </View>
        <View style={styles.activeCount}>
          <Text style={styles.activeCountText}>{activeSignals.length} Active</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Hold Time</Text>
          <Text style={styles.statValue}>4.2 days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Success Rate</Text>
          <Text style={styles.statValue}>71.8%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Return</Text>
          <Text style={styles.statValue}>+8.7%</Text>
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
                <Text style={styles.priceLabel}>Stop Loss</Text>
                <Text style={styles.priceValue}>{signal.stopLoss}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Take Profit</Text>
                <Text style={styles.priceValue}>{signal.takeProfit}</Text>
              </View>
            </View>

            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Calendar size={14} color={'#9CA3AF'} />
                <Text style={styles.metaText}>{signal.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <BarChart3 size={14} color={'#9CA3AF'} />
                <Text style={styles.metaText}>{signal.timeframe}</Text>
              </View>
              <View style={styles.metaItem}>
                <Target size={14} color={'#9CA3AF'} />
                <Text style={styles.metaText}>{signal.confidence}%</Text>
              </View>
            </View>

            {signal.pnl !== undefined && (
              <View style={styles.pnlContainer}>
                <Text style={[styles.pnlText, { color: getPnLColor(signal.pnl) }]}>
                  P&L: {signal.pnl >= 0 ? '+' : ''}{signal.pnl}$
                </Text>
              </View>
            )}

            <View style={styles.setupContainer}>
              <Text style={styles.setupLabel}>Technical Setup:</Text>
              <Text style={styles.setupText}>{signal.technicalSetup}</Text>
            </View>

            <View style={styles.factorsContainer}>
              <Text style={styles.factorsLabel}>Fundamental Factors:</Text>
              <View style={styles.factorsList}>
                {signal.fundamentalFactors.map((factor, index) => (
                  <View key={index} style={styles.factorBadge}>
                    <Globe size={12} color={'#4ECDC4'} />
                    <Text style={styles.factorText}>{factor}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.analysisText}>{signal.aiAnalysis}</Text>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleViewDetails(signal.pair)}
            >
              <Text style={styles.actionButtonText}>View Analysis</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>
      
      <CurrencyDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pair={selectedPair}
        strategyType="swing"
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
    backgroundColor: '#4ECDC420',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeCountText: {
    color: '#4ECDC4',
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
    marginBottom: 12,
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
  pnlContainer: {
    marginBottom: 12,
  },
  pnlText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  setupContainer: {
    marginBottom: 12,
  },
  setupLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  setupText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4ECDC4',
  },
  factorsContainer: {
    marginBottom: 12,
  },
  factorsLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  factorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  factorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC420',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  factorText: {
    fontSize: 11,
    color: '#4ECDC4',
    marginLeft: 4,
  },
  analysisText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#4ECDC420',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600' as const,
  },
});