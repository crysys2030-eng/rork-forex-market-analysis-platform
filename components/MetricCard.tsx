import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface MetricCardProps {
  title: string;
  value?: string;
  change?: number;
  onPress?: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export function MetricCard({
  title,
  value,
  change,
  onPress,
  style,
  size = 'medium',
}: MetricCardProps) {
  const isPositive = change !== undefined ? change >= 0 : null;
  


  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, styles[size], style]}>
        <Text style={[styles.title, styles[`title_${size}`]]}>{title}</Text>
        
        {value && (
          <View style={styles.valueContainer}>
            <Text style={[styles.value, styles[`value_${size}`]]}>{value}</Text>
            {change !== undefined && (
              <Text style={[
                styles.change,
                styles[`change_${size}`],
                { color: isPositive ? '#00D4AA' : '#EF4444' }
              ]}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, styles[size], style]}>
      <Text style={[styles.title, styles[`title_${size}`]]}>{title}</Text>
      
      {value && (
        <View style={styles.valueContainer}>
          <Text style={[styles.value, styles[`value_${size}`]]}>{value}</Text>
          {change !== undefined && (
            <Text style={[
              styles.change,
              styles[`change_${size}`],
              { color: isPositive ? '#00D4AA' : '#EF4444' }
            ]}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </Text>
          )}
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
    alignItems: 'center',
  },
  small: {
    padding: 12,
    borderRadius: 8,
  },
  medium: {
    padding: 16,
    borderRadius: 12,
  },
  large: {
    padding: 20,
    borderRadius: 16,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  title_small: {
    fontSize: 12,
  },
  title_medium: {
    fontSize: 14,
  },
  title_large: {
    fontSize: 16,
  },
  valueContainer: {
    alignItems: 'center',
  },
  value: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  value_small: {
    fontSize: 16,
  },
  value_medium: {
    fontSize: 20,
  },
  value_large: {
    fontSize: 24,
  },
  change: {
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  change_small: {
    fontSize: 10,
  },
  change_medium: {
    fontSize: 11,
  },
  change_large: {
    fontSize: 12,
  },
});