import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react-native';
import { TechnicalIndicator } from '@/types/forex';

interface TechnicalIndicatorsProps {
  indicators: Record<string, TechnicalIndicator[]>;
}

export function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  const [selectedPair, setSelectedPair] = useState<string>(Object.keys(indicators)[0] || 'EURUSD');

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return <TrendingUp color="#00D4AA" size={16} />;
      case 'bearish':
        return <TrendingDown color="#EF4444" size={16} />;
      default:
        return <Minus color="#F59E0B" size={16} />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return '#00D4AA';
      case 'bearish':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const getStrengthWidth = (strength: number) => {
    return Math.min(Math.max(strength, 0), 100);
  };

  const pairs = Object.keys(indicators);
  const currentIndicators = indicators[selectedPair] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BarChart3 color="#00D4AA" size={24} />
        <Text style={styles.title}>Technical Indicators</Text>
      </View>

      {/* Pair Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pairSelector}>
        <View style={styles.pairButtons}>
          {pairs.map((pair) => (
            <TouchableOpacity
              key={pair}
              style={[
                styles.pairButton,
                selectedPair === pair && styles.pairButtonActive,
              ]}
              onPress={() => setSelectedPair(pair)}
            >
              <Text
                style={[
                  styles.pairButtonText,
                  selectedPair === pair && styles.pairButtonTextActive,
                ]}
              >
                {pair}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Indicators */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentIndicators.map((indicator, index) => (
          <View key={`${indicator.name}-${index}`} style={styles.indicatorCard}>
            <View style={styles.indicatorHeader}>
              <View style={styles.indicatorTitleRow}>
                {getSignalIcon(indicator.signal)}
                <Text style={styles.indicatorName}>{indicator.name}</Text>
              </View>
              <View style={styles.signalBadge}>
                <Text style={[styles.signalText, { color: getSignalColor(indicator.signal) }]}>
                  {indicator.signal.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.indicatorContent}>
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Value:</Text>
                <Text style={styles.valueText}>{indicator.value.toFixed(4)}</Text>
              </View>

              <View style={styles.strengthContainer}>
                <View style={styles.strengthHeader}>
                  <Text style={styles.strengthLabel}>Signal Strength</Text>
                  <Text style={styles.strengthValue}>{indicator.strength.toFixed(0)}%</Text>
                </View>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${getStrengthWidth(indicator.strength)}%`,
                        backgroundColor: getSignalColor(indicator.signal),
                      },
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.description}>{indicator.description}</Text>
            </View>
          </View>
        ))}

        {currentIndicators.length === 0 && (
          <View style={styles.emptyState}>
            <BarChart3 color="#6B7280" size={48} />
            <Text style={styles.emptyText}>No indicators available</Text>
          </View>
        )}
      </ScrollView>

      {/* Overall Signal Summary */}
      {currentIndicators.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Overall Signal for {selectedPair}</Text>
          <View style={styles.summaryContent}>
            {(() => {
              const bullishCount = currentIndicators.filter(i => i.signal === 'bullish').length;
              const bearishCount = currentIndicators.filter(i => i.signal === 'bearish').length;
              const neutralCount = currentIndicators.filter(i => i.signal === 'neutral').length;
              
              const total = currentIndicators.length;
              const bullishPercent = (bullishCount / total) * 100;
              const bearishPercent = (bearishCount / total) * 100;
              const neutralPercent = (neutralCount / total) * 100;

              const overallSignal = bullishCount > bearishCount ? 'bullish' : 
                                   bearishCount > bullishCount ? 'bearish' : 'neutral';

              return (
                <>
                  <View style={styles.signalDistribution}>
                    <View style={styles.distributionItem}>
                      <View style={[styles.distributionDot, { backgroundColor: '#00D4AA' }]} />
                      <Text style={styles.distributionText}>Bullish: {bullishPercent.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.distributionItem}>
                      <View style={[styles.distributionDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={styles.distributionText}>Bearish: {bearishPercent.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.distributionItem}>
                      <View style={[styles.distributionDot, { backgroundColor: '#F59E0B' }]} />
                      <Text style={styles.distributionText}>Neutral: {neutralPercent.toFixed(0)}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.overallSignal}>
                    {getSignalIcon(overallSignal)}
                    <Text style={[styles.overallSignalText, { color: getSignalColor(overallSignal) }]}>
                      Overall: {overallSignal.toUpperCase()}
                    </Text>
                  </View>
                </>
              );
            })()}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pairSelector: {
    marginBottom: 16,
  },
  pairButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pairButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pairButtonActive: {
    backgroundColor: '#00D4AA',
  },
  pairButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  pairButtonTextActive: {
    color: '#FFFFFF',
  },
  indicatorCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  indicatorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  signalBadge: {
    backgroundColor: '#374151',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  signalText: {
    fontSize: 10,
    fontWeight: '600',
  },
  indicatorContent: {
    gap: 8,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  strengthContainer: {
    gap: 4,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#4B5563',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  description: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryContent: {
    gap: 12,
  },
  signalDistribution: {
    gap: 6,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distributionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  distributionText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  overallSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 6,
    padding: 8,
  },
  overallSignalText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});