import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TrendingUp, TrendingDown, Clock, Target, Shield, DollarSign, ChevronDown, ChevronUp, Brain, BarChart3, Zap } from 'lucide-react-native';
import { MLSignal } from '@/hooks/useMLTrading';

interface MLSignalCardProps {
  signal: MLSignal;
  priority?: 'normal' | 'high';
}

export function MLSignalCard({ signal, priority = 'normal' }: MLSignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isHighPriority = priority === 'high';
  const isBuy = signal.action === 'BUY';
  
  const formatPrice = (price: number) => {
    return price.toFixed(5);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return '#10B981';
    if (accuracy >= 80) return '#F59E0B';
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

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const formatTime = (date: Date | string | undefined) => {
    if (!date) return '--:--';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '--:--';
      
      return dateObj.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '--:--';
    }
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setExpanded(!expanded);
    console.log('Selected ML signal:', signal.symbol, signal.action);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isHighPriority && styles.highPriorityContainer
      ]}
      activeOpacity={0.8}
      onPress={handlePress}
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
        
        <View style={styles.accuracyContainer}>
          <Text style={[styles.accuracy, { color: getAccuracyColor(signal.accuracy) }]}>
            {signal.accuracy}%
          </Text>
          <Text style={styles.accuracyLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Model Info */}
      <View style={styles.modelSection}>
        <View style={styles.modelHeader}>
          <Brain color="#8B5CF6" size={14} />
          <Text style={styles.modelName}>{signal.modelUsed}</Text>
          <Text style={styles.confidence}>Confidence: {signal.confidence}%</Text>
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

      {/* Prediction Info */}
      <View style={styles.predictionSection}>
        <View style={styles.predictionRow}>
          <Text style={styles.predictionLabel}>Price Target:</Text>
          <Text style={styles.predictionValue}>{formatPrice(signal.prediction.priceTarget)}</Text>
        </View>
        
        <View style={styles.predictionRow}>
          <Text style={styles.predictionLabel}>Probability:</Text>
          <Text style={styles.predictionValue}>{(signal.prediction.probability * 100).toFixed(1)}%</Text>
        </View>
        
        <View style={styles.predictionRow}>
          <Text style={styles.predictionLabel}>Time Horizon:</Text>
          <Text style={styles.predictionValue}>{signal.prediction.timeHorizon.toFixed(1)}h</Text>
        </View>
      </View>

      {/* Expandable ML Details */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.featuresSection}>
            <View style={styles.sectionHeader}>
              <BarChart3 color="#8B5CF6" size={16} />
              <Text style={styles.sectionTitle}>ML Feature Scores</Text>
            </View>
            
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Technical</Text>
                <Text style={[styles.featureValue, { 
                  color: getScoreColor(signal.features.technicalScore) 
                }]}>
                  {signal.features.technicalScore}
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Sentiment</Text>
                <Text style={[styles.featureValue, { 
                  color: getScoreColor(signal.features.sentimentScore) 
                }]}>
                  {signal.features.sentimentScore}
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Volume</Text>
                <Text style={[styles.featureValue, { 
                  color: getScoreColor(signal.features.volumeScore) 
                }]}>
                  {signal.features.volumeScore}
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Momentum</Text>
                <Text style={[styles.featureValue, { 
                  color: getScoreColor(signal.features.momentumScore) 
                }]}>
                  {signal.features.momentumScore}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.riskSection}>
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Risk Level:</Text>
              <Text style={[styles.riskValue, { color: getRiskColor(signal.riskLevel) }]}>
                {signal.riskLevel}
              </Text>
            </View>
            
            <View style={styles.riskRow}>
              <Text style={styles.riskLabel}>Timeframe:</Text>
              <Text style={styles.riskValue}>{signal.timeframe}</Text>
            </View>
          </View>
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
              <Zap color="#FFFFFF" size={10} />
              <Text style={styles.priorityText}>HIGH ACCURACY</Text>
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
    borderColor: '#8B5CF6',
    borderWidth: 2,
    shadowColor: '#8B5CF6',
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
  accuracyContainer: {
    alignItems: 'flex-end',
  },
  accuracy: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accuracyLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  modelSection: {
    marginBottom: 12,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
  },
  modelName: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  confidence: {
    fontSize: 11,
    color: '#9CA3AF',
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
  predictionSection: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  predictionLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  predictionValue: {
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
  featuresSection: {
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
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  featureLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  featureValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  riskSection: {
    marginBottom: 8,
  },
  riskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  riskLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  riskValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
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
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  expandButton: {
    marginLeft: 8,
    padding: 4,
  },
});