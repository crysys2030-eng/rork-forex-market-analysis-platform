import React from 'react';
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
  X, 
  Clock,
  DollarSign,
  Target,
  Shield
} from 'lucide-react-native';
import { useMT5Connection, MT5Position } from '@/hooks/useMT5Connection';

export const MT5PositionsPanel: React.FC = () => {
  const { positions, isConnected, executeTrade } = useMT5Connection();

  const handleClosePosition = async (position: MT5Position) => {
    try {
      await executeTrade({
        action: 'CLOSE',
        symbol: position.symbol,
        volume: position.volume,
        ticket: position.ticket
      });
    } catch (error) {
      console.error('Failed to close position:', error);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isConnected) {
    return (
      <View style={styles.notConnectedContainer}>
        <Text style={styles.notConnectedText}>
          Connect to MT5 to view positions
        </Text>
      </View>
    );
  }

  if (positions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No open positions</Text>
        <Text style={styles.emptySubtext}>
          Execute trades from AI signals to see positions here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Open Positions</Text>
        <Text style={styles.positionCount}>{positions.length} position{positions.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView style={styles.positionsContainer} showsVerticalScrollIndicator={false}>
        {positions.map((position) => {
          const isProfit = position.profit >= 0;
          const TypeIcon = position.type === 'BUY' ? TrendingUp : TrendingDown;
          
          return (
            <View key={position.ticket} style={styles.positionCard}>
              <LinearGradient
                colors={position.type === 'BUY' ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                style={styles.positionHeader}
              >
                <View style={styles.positionHeaderLeft}>
                  <TypeIcon size={20} color="#FFFFFF" />
                  <Text style={styles.symbolText}>{position.symbol}</Text>
                  <Text style={styles.typeText}>{position.type}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => handleClosePosition(position)}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.positionBody}>
                <View style={styles.priceRow}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Volume</Text>
                    <Text style={styles.priceValue}>{position.volume}</Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Open Price</Text>
                    <Text style={styles.priceValue}>{position.openPrice.toFixed(5)}</Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Current</Text>
                    <Text style={styles.priceValue}>{position.currentPrice.toFixed(5)}</Text>
                  </View>
                </View>

                <View style={styles.profitRow}>
                  <View style={styles.profitItem}>
                    <DollarSign size={16} color={isProfit ? '#10B981' : '#EF4444'} />
                    <Text style={[
                      styles.profitText,
                      { color: isProfit ? '#10B981' : '#EF4444' }
                    ]}>
                      {isProfit ? '+' : ''}${position.profit.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.timeInfo}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.timeText}>
                      {formatDate(position.openTime)} {formatTime(position.openTime)}
                    </Text>
                  </View>
                </View>

                {(position.sl > 0 || position.tp > 0) && (
                  <View style={styles.levelsRow}>
                    {position.sl > 0 && (
                      <View style={styles.levelItem}>
                        <Shield size={12} color="#EF4444" />
                        <Text style={styles.levelLabel}>SL:</Text>
                        <Text style={styles.levelValue}>{position.sl.toFixed(5)}</Text>
                      </View>
                    )}
                    {position.tp > 0 && (
                      <View style={styles.levelItem}>
                        <Target size={12} color="#10B981" />
                        <Text style={styles.levelLabel}>TP:</Text>
                        <Text style={styles.levelValue}>{position.tp.toFixed(5)}</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>
                    Ticket: #{position.ticket}
                  </Text>
                  <Text style={styles.detailText}>
                    Swap: ${position.swap.toFixed(2)}
                  </Text>
                  <Text style={styles.detailText}>
                    Commission: ${position.commission.toFixed(2)}
                  </Text>
                </View>
              </View>
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
  notConnectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notConnectedText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  positionCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  positionsContainer: {
    flex: 1,
  },
  positionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  positionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  typeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  positionBody: {
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  levelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    marginRight: 4,
  },
  levelValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailText: {
    fontSize: 10,
    color: '#6B7280',
  },
});