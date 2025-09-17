import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Brain, Globe } from 'lucide-react-native';
import { CurrencySearchResult } from '@/hooks/useCurrencySearch';

interface CurrencySearchResultCardProps {
  result: CurrencySearchResult;
  onPress: () => void;
  expanded?: boolean;
}

export function CurrencySearchResultCard({ result, onPress, expanded = false }: CurrencySearchResultCardProps) {
  const isPositive = result.changePercent >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;

  const formatPrice = (price: number) => {
    if (result.type === 'forex') {
      return price.toFixed(4);
    } else if (price < 1) {
      return price.toFixed(6);
    } else if (price < 100) {
      return price.toFixed(2);
    } else {
      return price.toFixed(0);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'forex': return '#3B82F6';
      case 'crypto': return '#F59E0B';
      case 'stock': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'forex': return 'FOREX';
      case 'crypto': return 'CRYPTO';
      case 'stock': return 'AÇÃO';
      default: return type.toUpperCase();
    }
  };

  const ChangeIcon = changeIcon;

  return (
    <TouchableOpacity
      style={[styles.container, expanded && styles.expandedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{result.symbol}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(result.type) }]}>
              <Text style={styles.typeText}>{getTypeLabel(result.type)}</Text>
            </View>
          </View>
          <Text style={styles.name}>{result.name}</Text>
          {result.country && (
            <View style={styles.countryContainer}>
              <Globe size={12} color="#9CA3AF" />
              <Text style={styles.countryText}>{result.country}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${formatPrice(result.price)}</Text>
          <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
            <ChangeIcon size={12} color={changeColor} />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {result.changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={expanded ? undefined : 2}>
        {result.description}
      </Text>

      {/* Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <BarChart3 size={14} color="#9CA3AF" />
          <Text style={styles.metricLabel}>Volume</Text>
          <Text style={styles.metricValue}>{formatVolume(result.volume)}</Text>
        </View>
        
        {result.marketCap && (
          <View style={styles.metric}>
            <DollarSign size={14} color="#9CA3AF" />
            <Text style={styles.metricLabel}>Market Cap</Text>
            <Text style={styles.metricValue}>{formatVolume(result.marketCap)}</Text>
          </View>
        )}
        
        {result.sector && (
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Setor</Text>
            <Text style={styles.metricValue}>{result.sector}</Text>
          </View>
        )}
      </View>

      {/* Technical Indicators (Expanded View) */}
      {expanded && result.technicalIndicators && (
        <View style={styles.technicalContainer}>
          <Text style={styles.sectionTitle}>Indicadores Técnicos</Text>
          <View style={styles.indicatorsGrid}>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>RSI</Text>
              <Text style={styles.indicatorValue}>
                {result.technicalIndicators.rsi.toFixed(1)}
              </Text>
            </View>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>MACD</Text>
              <Text style={[
                styles.indicatorValue,
                { color: result.technicalIndicators.macd === 'Bullish' ? '#10B981' : '#EF4444' }
              ]}>
                {result.technicalIndicators.macd}
              </Text>
            </View>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>Suporte</Text>
              <Text style={styles.indicatorValue}>
                ${formatPrice(result.technicalIndicators.support)}
              </Text>
            </View>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>Resistência</Text>
              <Text style={styles.indicatorValue}>
                ${formatPrice(result.technicalIndicators.resistance)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Fundamental Data (Expanded View) */}
      {expanded && result.fundamentalData && (
        <View style={styles.fundamentalContainer}>
          <Text style={styles.sectionTitle}>Dados Fundamentais</Text>
          <View style={styles.fundamentalGrid}>
            {result.fundamentalData.peRatio && (
              <View style={styles.fundamental}>
                <Text style={styles.fundamentalLabel}>P/E Ratio</Text>
                <Text style={styles.fundamentalValue}>
                  {result.fundamentalData.peRatio.toFixed(1)}
                </Text>
              </View>
            )}
            {result.fundamentalData.dividendYield && (
              <View style={styles.fundamental}>
                <Text style={styles.fundamentalLabel}>Dividend Yield</Text>
                <Text style={styles.fundamentalValue}>
                  {result.fundamentalData.dividendYield.toFixed(2)}%
                </Text>
              </View>
            )}
            {result.fundamentalData.marketCapRank && (
              <View style={styles.fundamental}>
                <Text style={styles.fundamentalLabel}>Rank</Text>
                <Text style={styles.fundamentalValue}>
                  #{result.fundamentalData.marketCapRank}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* AI Analysis (Expanded View) */}
      {expanded && result.aiAnalysis && (
        <View style={styles.aiContainer}>
          <View style={styles.aiHeader}>
            <Brain size={16} color="#10B981" />
            <Text style={styles.sectionTitle}>Análise IA</Text>
          </View>
          <Text style={styles.aiAnalysis}>{result.aiAnalysis}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  expandedContainer: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countryText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  technicalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  indicator: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  fundamentalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  fundamentalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fundamental: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    minWidth: '30%',
    alignItems: 'center',
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
  aiContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aiAnalysis: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
});