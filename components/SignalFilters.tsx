import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface SignalFiltersProps {
  filters: {
    confidence: number;
    signalType: string;
    timeframe: string;
  };
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

export function SignalFilters({ filters, onFiltersChange, onClose }: SignalFiltersProps) {
  const signalTypes = [
    { id: 'all', label: 'All' },
    { id: 'buy', label: 'Buy' },
    { id: 'sell', label: 'Sell' },
  ];

  const timeframes = [
    { id: 'all', label: 'All' },
    { id: 'M15', label: '15M' },
    { id: 'H1', label: '1H' },
    { id: 'H4', label: '4H' },
    { id: 'D1', label: '1D' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={onClose}>
          <X color="#9CA3AF" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minimum Confidence: {filters.confidence}%</Text>
        <View style={styles.confidenceButtons}>
          {[50, 60, 70, 80, 90].map((conf) => (
            <TouchableOpacity
              key={conf}
              style={[
                styles.confidenceButton,
                filters.confidence === conf && styles.confidenceButtonActive,
              ]}
              onPress={() => onFiltersChange({ ...filters, confidence: conf })}
            >
              <Text
                style={[
                  styles.confidenceButtonText,
                  filters.confidence === conf && styles.confidenceButtonTextActive,
                ]}
              >
                {conf}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Signal Type</Text>
        <View style={styles.buttonGroup}>
          {signalTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterButton,
                filters.signalType === type.id && styles.filterButtonActive,
              ]}
              onPress={() => onFiltersChange({ ...filters, signalType: type.id })}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filters.signalType === type.id && styles.filterButtonTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timeframe</Text>
        <View style={styles.buttonGroup}>
          {timeframes.map((tf) => (
            <TouchableOpacity
              key={tf.id}
              style={[
                styles.filterButton,
                filters.timeframe === tf.id && styles.filterButtonActive,
              ]}
              onPress={() => onFiltersChange({ ...filters, timeframe: tf.id })}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filters.timeframe === tf.id && styles.filterButtonTextActive,
                ]}
              >
                {tf.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    margin: 20,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  confidenceButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  confidenceButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  confidenceButtonActive: {
    backgroundColor: '#00D4AA',
  },
  confidenceButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  confidenceButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: '#00D4AA',
  },
  filterButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
});