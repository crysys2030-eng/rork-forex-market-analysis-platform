import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { CurrencyStrength } from '@/types/forex';

interface CurrencyHeatMapProps {
  currencies: CurrencyStrength[];
}

export function CurrencyHeatMap({ currencies }: CurrencyHeatMapProps) {
  const getStrengthColor = (strength: number): string => {
    if (strength > 50) return '#00D4AA';
    if (strength > 20) return '#10B981';
    if (strength > -20) return '#F59E0B';
    if (strength > -50) return '#F97316';
    return '#EF4444';
  };

  const getStrengthOpacity = (strength: number): number => {
    const normalizedStrength = Math.abs(strength) / 100;
    return Math.max(0.3, normalizedStrength);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="#00D4AA" size={16} />;
      case 'down':
        return <TrendingDown color="#EF4444" size={16} />;
      default:
        return <Minus color="#F59E0B" size={16} />;
    }
  };

  const sortedCurrencies = [...currencies].sort((a, b) => b.strength - a.strength);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Strength Heat Map</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.heatMapContainer}>
          {sortedCurrencies.map((currency, index) => (
            <View 
              key={currency.currency} 
              style={[
                styles.currencyCard,
                {
                  backgroundColor: getStrengthColor(currency.strength),
                  opacity: getStrengthOpacity(currency.strength),
                }
              ]}
            >
              <View style={styles.currencyHeader}>
                <Text style={styles.currencyCode}>{currency.currency}</Text>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
              </View>
              
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthValue}>
                  {currency.strength > 0 ? '+' : ''}{currency.strength.toFixed(1)}
                </Text>
                <Text style={styles.strengthLabel}>Strength</Text>
              </View>
              
              <View style={styles.changeContainer}>
                <View style={styles.changeRow}>
                  {getTrendIcon(currency.trend)}
                  <Text style={styles.changeValue}>
                    {currency.change24h > 0 ? '+' : ''}{currency.change24h.toFixed(2)}%
                  </Text>
                </View>
                <Text style={styles.changeLabel}>24h Change</Text>
              </View>
              
              <View style={styles.strengthBar}>
                <View 
                  style={[
                    styles.strengthBarFill,
                    {
                      width: `${Math.abs(currency.strength)}%`,
                      backgroundColor: currency.strength > 0 ? '#FFFFFF' : '#000000',
                      opacity: 0.7,
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Strength Scale</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Very Weak</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F97316' }]} />
            <Text style={styles.legendText}>Weak</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Neutral</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Strong</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#00D4AA' }]} />
            <Text style={styles.legendText}>Very Strong</Text>
          </View>
        </View>
      </View>
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
  heatMapContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  currencyCard: {
    borderRadius: 8,
    padding: 12,
    width: 120,
    minHeight: 140,
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rankBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  strengthContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  strengthLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  changeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  changeLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  strengthBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 12,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});