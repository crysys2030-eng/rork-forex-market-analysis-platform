import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, TrendingUp, TrendingDown, Target, Activity, MapPin } from 'lucide-react-native';
import { DayTradingSignal } from '@/hooks/useTradingStrategies';
import { CurrencyDetailModal } from '@/components/CurrencyDetailModal';

interface DayTradingCardProps {
  data: DayTradingSignal[];
}

export function DayTradingCard({ data }: DayTradingCardProps) {
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

  const getSessionColor = (session: string) => {
    if (session.includes('London')) return '#45B7D1';
    if (session.includes('NY')) return '#F59E0B';
    if (session.includes('Asian')) return '#8B5CF6';
    return '#6B7280';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={24} color={'#45B7D1'} />
          <Text style={styles.title}>Day Trading</Text>
        </View>
        <View style={styles.activeCount}>
          <Text style={styles.activeCountText}>{activeSignals.length} Active</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Hold Time</Text>
          <Text style={styles.statValue}>2.8 hrs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Success Rate</Text>
          <Text style={styles.statValue}>74.2%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Pips</Text>
          <Text style={styles.statValue}>+28.5</Text>
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

            <View style={styles.sessionContainer}>
              <View style={[styles.sessionBadge, { backgroundColor: getSessionColor(signal.sessionBias) + '20' }]}>
                <Activity size={14} color={getSessionColor(signal.sessionBias)} />
                <Text style={[styles.sessionText, { color: getSessionColor(signal.sessionBias) }]}>
                  {signal.sessionBias}
                </Text>
              </View>
              <View style={styles.confidenceContainer}>
                <Target size={14} color={'#9CA3AF'} />
                <Text style={styles.confidenceText}>{signal.confidence}%</Text>
              </View>
            </View>

            <View style={styles.structureContainer}>
              <Text style={styles.structureLabel}>Market Structure:</Text>
              <Text style={styles.structureText}>{signal.marketStructure}</Text>
            </View>

            {signal.pnl !== undefined && (
              <View style={styles.pnlContainer}>
                <Text style={[styles.pnlText, { color: getPnLColor(signal.pnl) }]}>
                  P&L: {signal.pnl >= 0 ? '+' : ''}{signal.pnl}$
                </Text>
              </View>
            )}

            <View style={styles.levelsContainer}>
              <Text style={styles.levelsLabel}>Key Levels:</Text>
              <View style={styles.levelsList}>
                {signal.keyLevels.map((level, index) => (
                  <View key={`${signal.id}-level-${index}`} style={styles.levelBadge}>
                    <MapPin size={12} color={'#45B7D1'} />
                    <Text style={styles.levelText}>{level}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.insightsText}>{signal.aiInsights}</Text>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleViewDetails(signal.pair)}
            >
              <Text style={styles.actionButtonText}>View Session Analysis</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>
      
      <CurrencyDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pair={selectedPair}
        strategyType="daytrading"
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
    backgroundColor: '#45B7D120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeCountText: {
    color: '#45B7D1',
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
  sessionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sessionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  structureContainer: {
    marginBottom: 12,
  },
  structureLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  structureText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#45B7D1',
  },
  pnlContainer: {
    marginBottom: 12,
  },
  pnlText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  levelsContainer: {
    marginBottom: 12,
  },
  levelsLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  levelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B7D120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 11,
    color: '#45B7D1',
    marginLeft: 4,
  },
  insightsText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#45B7D120',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#45B7D1',
    fontSize: 12,
    fontWeight: '600' as const,
  },
});