import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, Clock, Target, Shield, DollarSign, ChevronDown, ChevronUp, Activity, BarChart3, AlertCircle } from 'lucide-react-native';
import { ScalpingSignal } from '@/hooks/useScalpingAI';

interface ScalpingSignalCardProps {
  signal: ScalpingSignal;
  priority?: 'normal' | 'high';
}

export function ScalpingSignalCard({ signal, priority = 'normal' }: ScalpingSignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isHighPriority = priority === 'high';
  const isBuy = signal.action === 'BUY';
  
  const formatPrice = (price: number) => {
    return price.toFixed(5);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10B981';
    if (confidence >= 80) return '#F59E0B';
    return '#6B7280';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'BULLISH': return '#10B981';
      case 'BEARISH': return '#EF4444';
      case 'SIDEWAYS': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isHighPriority && styles.highPriorityContainer
      ]}
      activeOpacity={0.8}
      onPress={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{signal.symbol}</Text>
          <View style={[styles.actionBadge, { backgroundColor: isBuy ? '#10B981' : '#EF4444' }]}>
            {isBuy ? (
              <TrendingUp color="#FFFFFF" size={12} />
            ) : (
              <TrendingDown color="#FFFFFF" size={12} />
            )}
            <Text style={styles.actionText}>{signal.action}</Text>
          </View>
        </View>
        
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidence, { color: getConfidenceColor(signal.confidence) }]}>
            {signal.confidence}%
          </Text>
          <Text style={styles.confidenceLabel}>Confidence</Text>
        </View>
      </View>

      {/* Price Information */}
      <View style={styles.priceSection}>
        <View style={styles.priceItem}>
          <DollarSign color="#9CA3AF" size={14} />
          <Text style={styles.priceLabel}>Entry</Text>
          <Text style={styles.priceValue}>{formatPrice(signal.entryPrice)}</Text>
        </View>
        
        <View style={styles.priceItem}>
          <Shield color="#EF4444" size={14} />
          <Text style={styles.priceLabel}>Stop Loss</Text>
          <Text style={[styles.priceValue, { color: '#EF4444' }]}>
            {formatPrice(signal.stopLoss)}
          </Text>
        </View>
        
        <View style={styles.priceItem}>
          <Target color="#10B981" size={14} />
          <Text style={styles.priceLabel}>Take Profit</Text>
          <Text style={[styles.priceValue, { color: '#10B981' }]}>
            {formatPrice(signal.takeProfit)}
          </Text>
        </View>
      </View>

      {/* Signal Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Risk/Reward:</Text>
          <Text style={styles.detailValue}>1:{signal.riskReward}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Timeframe:</Text>
          <Text style={styles.detailValue}>{signal.timeframe}</Text>
        </View>
        
        {signal.spread && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Spread:</Text>
            <Text style={styles.detailValue}>{signal.spread.toFixed(1)} pips</Text>
          </View>
        )}
      </View>

      {/* Reason */}
      <View style={styles.reasonSection}>
        <Text style={styles.reasonText}>{signal.reason}</Text>
      </View>

      {/* Strategy and Risk Info */}
      <View style={styles.strategySection}>
        <View style={styles.strategyRow}>
          <Text style={styles.strategyLabel}>Strategy:</Text>
          <Text style={styles.strategyValue}>{signal.strategy.replace('_', ' ')}</Text>
        </View>
        
        <View style={styles.strategyRow}>
          <Text style={styles.strategyLabel}>Risk Level:</Text>
          <Text style={[styles.strategyValue, { color: getRiskColor(signal.riskLevel) }]}>
            {signal.riskLevel}
          </Text>
        </View>
        
        <View style={styles.strategyRow}>
          <Text style={styles.strategyLabel}>Expected Duration:</Text>
          <Text style={styles.strategyValue}>{signal.expectedDuration}min</Text>
        </View>
      </View>

      {/* Expandable Technical Details */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.technicalSection}>
            <View style={styles.sectionHeader}>
              <Activity color="#00D4AA" size={16} />
              <Text style={styles.sectionTitle}>Technical Indicators</Text>
            </View>
            
            <View style={styles.indicatorGrid}>
              <View style={styles.indicatorItem}>
                <Text style={styles.indicatorLabel}>RSI</Text>
                <Text style={[styles.indicatorValue, { 
                  color: signal.technicalIndicators.rsi > 70 ? '#EF4444' : 
                         signal.technicalIndicators.rsi < 30 ? '#10B981' : '#F59E0B' 
                }]}>
                  {signal.technicalIndicators.rsi.toFixed(1)}
                </Text>
              </View>
              
              <View style={styles.indicatorItem}>
                <Text style={styles.indicatorLabel}>MACD</Text>
                <Text style={[styles.indicatorValue, { 
                  color: signal.technicalIndicators.macd > 0 ? '#10B981' : '#EF4444' 
                }]}>
                  {signal.technicalIndicators.macd.toFixed(4)}
                </Text>
              </View>
              
              <View style={styles.indicatorItem}>
                <Text style={styles.indicatorLabel}>Bollinger</Text>
                <Text style={styles.indicatorValue}>
                  {signal.technicalIndicators.bollinger}
                </Text>
              </View>
              
              <View style={styles.indicatorItem}>
                <Text style={styles.indicatorLabel}>EMA</Text>
                <Text style={styles.indicatorValue}>
                  {signal.technicalIndicators.ema.toFixed(5)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.marketSection}>
            <View style={styles.sectionHeader}>
              <BarChart3 color="#00D4AA" size={16} />
              <Text style={styles.sectionTitle}>Market Conditions</Text>
            </View>
            
            <View style={styles.marketGrid}>
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Trend</Text>
                <Text style={[styles.marketValue, { color: getTrendColor(signal.marketConditions.trend) }]}>
                  {signal.marketConditions.trend}
                </Text>
              </View>
              
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Volatility</Text>
                <Text style={styles.marketValue}>
                  {signal.marketConditions.volatility.toFixed(2)}%
                </Text>
              </View>
              
              <View style={styles.marketItem}>
                <Text style={styles.marketLabel}>Momentum</Text>
                <Text style={[styles.marketValue, { 
                  color: signal.marketConditions.momentum > 0 ? '#10B981' : '#EF4444' 
                }]}>
                  {signal.marketConditions.momentum.toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Alerts */}
          {signal.alerts.length > 0 && (
            <View style={styles.alertsSection}>
              <View style={styles.sectionHeader}>
                <AlertCircle color="#F59E0B" size={16} />
                <Text style={styles.sectionTitle}>Active Alerts</Text>
              </View>
              
              {signal.alerts.map((alert, index) => (
                <View key={alert.id} style={styles.alertItem}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>
                    {alert.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Clock color="#6B7280" size={12} />
          <Text style={styles.timeText}>{formatTime(signal.timestamp)}</Text>
        </View>
        
        <View style={styles.footerRight}>
          {isHighPriority && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>HIGH PRIORITY</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.expandButton}>
            {expanded ? (
              <ChevronUp color="#9CA3AF" size={16} />
            ) : (
              <ChevronDown color="#9CA3AF" size={16} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  highPriorityContainer: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidence: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidenceLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  reasonSection: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  reasonText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
  priorityBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  strategySection: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  strategyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  strategyLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  strategyValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  technicalSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  indicatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indicatorItem: {
    width: '48%',
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  marketSection: {
    marginBottom: 16,
  },
  marketGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marketItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  marketLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  marketValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  alertsSection: {
    marginBottom: 8,
  },
  alertItem: {
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  alertMessage: {
    fontSize: 11,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 9,
    color: '#6B7280',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButton: {
    marginLeft: 8,
    padding: 4,
  },
});