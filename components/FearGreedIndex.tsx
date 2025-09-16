import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CryptoFearGreed } from '@/types/forex';

interface FearGreedIndexProps {
  fearGreed: CryptoFearGreed;
}

export function FearGreedIndex({ fearGreed }: FearGreedIndexProps) {
  const getIndexColor = (value: number) => {
    if (value <= 20) return '#FF6B6B';
    if (value <= 40) return '#F59E0B';
    if (value <= 60) return '#9CA3AF';
    if (value <= 80) return '#10B981';
    return '#00D4AA';
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fear & Greed Index</Text>
      
      <View style={styles.indexContainer}>
        <View style={styles.gaugeContainer}>
          <View style={styles.gauge}>
            <View style={[styles.gaugeFill, { 
              width: `${fearGreed.value}%`,
              backgroundColor: getIndexColor(fearGreed.value)
            }]} />
          </View>
          <View style={[styles.pointer, { 
            left: `${fearGreed.value}%`,
            backgroundColor: getIndexColor(fearGreed.value)
          }]} />
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: getIndexColor(fearGreed.value) }]}>
            {fearGreed.value}
          </Text>
          <Text style={[styles.classification, { color: getIndexColor(fearGreed.value) }]}>
            {fearGreed.classification}
          </Text>
        </View>
      </View>

      <View style={styles.factorsContainer}>
        <Text style={styles.factorsTitle}>Contributing Factors</Text>
        <View style={styles.factorsList}>
          {Object.entries(fearGreed.factors).map(([key, value]) => (
            <View key={key} style={styles.factorItem}>
              <Text style={styles.factorName}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <View style={styles.factorBar}>
                <View style={[styles.factorFill, { 
                  width: `${value}%`,
                  backgroundColor: getIndexColor(value)
                }]} />
              </View>
              <Text style={styles.factorValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Extreme Fear</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Fear</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9CA3AF' }]} />
          <Text style={styles.legendText}>Neutral</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Greed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00D4AA' }]} />
          <Text style={styles.legendText}>Extreme Greed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 20,
    textAlign: 'center',
  },
  indexContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gaugeContainer: {
    width: '100%',
    height: 20,
    position: 'relative',
    marginBottom: 16,
  },
  gauge: {
    width: '100%',
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  pointer: {
    position: 'absolute',
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  valueContainer: {
    alignItems: 'center',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    marginBottom: 4,
  },
  classification: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  factorsContainer: {
    marginBottom: 20,
  },
  factorsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  factorsList: {
    gap: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  factorName: {
    color: '#D1D5DB',
    fontSize: 14,
    flex: 1,
  },
  factorBar: {
    width: 80,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  factorFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorValue: {
    color: '#9CA3AF',
    fontSize: 12,
    width: 24,
    textAlign: 'right',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
});