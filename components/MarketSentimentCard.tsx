import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { MarketSentiment } from '@/types/forex';

interface MarketSentimentCardProps {
  sentiments: MarketSentiment[];
}

export function MarketSentimentCard({ sentiments }: MarketSentimentCardProps) {
  const getSentimentIcon = (overall: string) => {
    switch (overall) {
      case 'bullish':
        return <TrendingUp color="#00D4AA" size={20} />;
      case 'bearish':
        return <TrendingDown color="#EF4444" size={20} />;
      default:
        return <Minus color="#F59E0B" size={20} />;
    }
  };

  const getSentimentColor = (overall: string) => {
    switch (overall) {
      case 'bullish':
        return '#00D4AA';
      case 'bearish':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Sentiment</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.sentimentContainer}>
          {sentiments.map((sentiment) => (
            <View key={sentiment.symbol} style={styles.sentimentCard}>
              <View style={styles.header}>
                <Text style={styles.symbol}>{sentiment.symbol}</Text>
                {getSentimentIcon(sentiment.overall)}
              </View>
              
              <View style={styles.sentimentBars}>
                <View style={styles.barContainer}>
                  <View style={styles.barLabel}>
                    <View style={[styles.colorDot, { backgroundColor: '#00D4AA' }]} />
                    <Text style={styles.barText}>Bullish</Text>
                  </View>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          width: `${sentiment.bullish}%`, 
                          backgroundColor: '#00D4AA' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.percentage}>{sentiment.bullish.toFixed(0)}%</Text>
                </View>

                <View style={styles.barContainer}>
                  <View style={styles.barLabel}>
                    <View style={[styles.colorDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.barText}>Bearish</Text>
                  </View>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          width: `${sentiment.bearish}%`, 
                          backgroundColor: '#EF4444' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.percentage}>{sentiment.bearish.toFixed(0)}%</Text>
                </View>

                <View style={styles.barContainer}>
                  <View style={styles.barLabel}>
                    <View style={[styles.colorDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.barText}>Neutral</Text>
                  </View>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          width: `${sentiment.neutral}%`, 
                          backgroundColor: '#F59E0B' 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.percentage}>{sentiment.neutral.toFixed(0)}%</Text>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.overallLabel}>Overall:</Text>
                <Text style={[styles.overallValue, { color: getSentimentColor(sentiment.overall) }]}>
                  {sentiment.overall.toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Confidence:</Text>
                <Text style={styles.confidenceValue}>{sentiment.confidence.toFixed(0)}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sentimentContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sentimentCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    width: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sentimentBars: {
    marginBottom: 12,
  },
  barContainer: {
    marginBottom: 8,
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  barText: {
    fontSize: 12,
    color: '#D1D5DB',
    flex: 1,
  },
  percentage: {
    fontSize: 12,
    color: '#D1D5DB',
    width: 30,
    textAlign: 'right',
  },
  barBackground: {
    height: 6,
    backgroundColor: '#4B5563',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  overallLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  overallValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});