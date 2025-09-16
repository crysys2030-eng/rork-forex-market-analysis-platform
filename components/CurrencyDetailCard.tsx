import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3, 
  DollarSign,
  Globe,
  Activity,
  Users
} from 'lucide-react-native';
import { CurrencyDetail } from '@/types/forex';

interface CurrencyDetailCardProps {
  currency: CurrencyDetail;
  onPress?: () => void;
}

export function CurrencyDetailCard({ currency, onPress }: CurrencyDetailCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} color="#10B981" />;
      case 'down': return <TrendingDown size={14} color="#EF4444" />;
      default: return <Minus size={14} color="#6B7280" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '#10B981';
      case 'bearish': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.currencyInfo}>
            <Text style={styles.flag}>{currency.flag}</Text>
            <View>
              <Text style={styles.symbol}>{currency.symbol}</Text>
              <Text style={styles.name}>{currency.name}</Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.price}>{currency.currentPrice.toFixed(5)}</Text>
            <Text style={[
              styles.change,
              { color: currency.changePercent24h >= 0 ? '#10B981' : '#EF4444' }
            ]}>
              {currency.changePercent24h >= 0 ? '+' : ''}{currency.changePercent24h.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* Trends */}
        <View style={styles.trendsContainer}>
          <Text style={styles.sectionTitle}>Trend Analysis</Text>
          <View style={styles.trendsRow}>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Short</Text>
              <View style={styles.trendValue}>
                {getTrendIcon(currency.trend.short)}
                <Text style={[styles.trendText, { color: getTrendColor(currency.trend.short) }]}>
                  {currency.trend.short}
                </Text>
              </View>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Medium</Text>
              <View style={styles.trendValue}>
                {getTrendIcon(currency.trend.medium)}
                <Text style={[styles.trendText, { color: getTrendColor(currency.trend.medium) }]}>
                  {currency.trend.medium}
                </Text>
              </View>
            </View>
            <View style={styles.trendItem}>
              <Text style={styles.trendLabel}>Long</Text>
              <View style={styles.trendValue}>
                {getTrendIcon(currency.trend.long)}
                <Text style={[styles.trendText, { color: getTrendColor(currency.trend.long) }]}>
                  {currency.trend.long}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Technical Indicators */}
        <View style={styles.technicalContainer}>
          <Text style={styles.sectionTitle}>Technical Indicators</Text>
          <View style={styles.indicatorsGrid}>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>RSI</Text>
              <Text style={[
                styles.indicatorValue,
                { color: currency.technicals.rsi > 70 ? '#EF4444' : currency.technicals.rsi < 30 ? '#10B981' : '#F59E0B' }
              ]}>
                {currency.technicals.rsi.toFixed(1)}
              </Text>
            </View>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>MACD</Text>
              <Text style={[
                styles.indicatorValue,
                { color: currency.technicals.macd > 0 ? '#10B981' : '#EF4444' }
              ]}>
                {currency.technicals.macd.toFixed(4)}
              </Text>
            </View>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>SMA 20</Text>
              <Text style={styles.indicatorValue}>
                {currency.technicals.sma20.toFixed(5)}
              </Text>
            </View>
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>SMA 50</Text>
              <Text style={styles.indicatorValue}>
                {currency.technicals.sma50.toFixed(5)}
              </Text>
            </View>
          </View>
        </View>

        {/* Fundamentals */}
        <View style={styles.fundamentalsContainer}>
          <Text style={styles.sectionTitle}>Economic Fundamentals</Text>
          <View style={styles.fundamentalsGrid}>
            <View style={styles.fundamental}>
              <DollarSign size={14} color="#9CA3AF" />
              <Text style={styles.fundamentalLabel}>Interest Rate</Text>
              <Text style={styles.fundamentalValue}>{currency.fundamentals.interestRate.toFixed(2)}%</Text>
            </View>
            <View style={styles.fundamental}>
              <Activity size={14} color="#9CA3AF" />
              <Text style={styles.fundamentalLabel}>Inflation</Text>
              <Text style={styles.fundamentalValue}>{currency.fundamentals.inflation.toFixed(1)}%</Text>
            </View>
            <View style={styles.fundamental}>
              <BarChart3 size={14} color="#9CA3AF" />
              <Text style={styles.fundamentalLabel}>GDP Growth</Text>
              <Text style={[
                styles.fundamentalValue,
                { color: currency.fundamentals.gdpGrowth >= 0 ? '#10B981' : '#EF4444' }
              ]}>
                {currency.fundamentals.gdpGrowth.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.fundamental}>
              <Users size={14} color="#9CA3AF" />
              <Text style={styles.fundamentalLabel}>Unemployment</Text>
              <Text style={styles.fundamentalValue}>{currency.fundamentals.unemployment.toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        {/* Market Sentiment */}
        <View style={styles.sentimentContainer}>
          <Text style={styles.sectionTitle}>Market Sentiment</Text>
          <View style={styles.sentimentRow}>
            <View style={styles.sentimentItem}>
              <Text style={styles.sentimentLabel}>Retail: {currency.sentiment.retail}%</Text>
              <View style={styles.sentimentBar}>
                <View style={[styles.sentimentFill, { width: `${currency.sentiment.retail}%` }]} />
              </View>
            </View>
            <View style={styles.sentimentItem}>
              <Text style={styles.sentimentLabel}>Institutional: {currency.sentiment.institutional}%</Text>
              <View style={styles.sentimentBar}>
                <View style={[styles.sentimentFill, { width: `${currency.sentiment.institutional}%` }]} />
              </View>
            </View>
          </View>
          <Text style={[
            styles.overallSentiment,
            { color: getSentimentColor(currency.sentiment.overall) }
          ]}>
            Overall: {currency.sentiment.overall.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  trendsContainer: {
    marginBottom: 16,
  },
  trendsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendItem: {
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  trendValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  technicalContainer: {
    marginBottom: 16,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indicator: {
    width: '48%',
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  indicatorValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fundamentalsContainer: {
    marginBottom: 16,
  },
  fundamentalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fundamental: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  fundamentalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    flex: 1,
  },
  fundamentalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sentimentContainer: {
    marginBottom: 8,
  },
  sentimentRow: {
    marginBottom: 8,
  },
  sentimentItem: {
    marginBottom: 8,
  },
  sentimentLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  sentimentBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  sentimentFill: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 2,
  },
  overallSentiment: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});