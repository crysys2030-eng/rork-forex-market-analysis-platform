import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfessionalCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  change?: number;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'gradient' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

export function ProfessionalCard({
  title,
  subtitle,
  value,
  change,
  icon,
  onPress,
  style,
  variant = 'default',
  size = 'medium',
}: ProfessionalCardProps) {
  const isPositive = change !== undefined ? change >= 0 : null;
  


  if (variant === 'gradient') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#374151', '#4B5563']}
          style={[styles.container, styles[size], style]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, styles[`title_${size}`]]}>{title}</Text>
              {subtitle && (
                <Text style={[styles.subtitle, styles[`subtitle_${size}`]]}>{subtitle}</Text>
              )}
            </View>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
          </View>
          
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
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[
          styles.container,
          styles[size],
          variant === 'outlined' && styles.outlined,
          style
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, styles[`title_${size}`]]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, styles[`subtitle_${size}`]]}>{subtitle}</Text>
            )}
          </View>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </View>
        
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
    <View style={[
      styles.container,
      styles[size],
      variant === 'outlined' && styles.outlined,
      style
    ]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, styles[`title_${size}`]]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, styles[`subtitle_${size}`]]}>{subtitle}</Text>
          )}
        </View>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      
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
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title_small: {
    fontSize: 14,
  },
  title_medium: {
    fontSize: 16,
  },
  title_large: {
    fontSize: 18,
  },
  subtitle: {
    color: '#9CA3AF',
    marginTop: 2,
  },
  subtitle_small: {
    fontSize: 11,
  },
  subtitle_medium: {
    fontSize: 12,
  },
  subtitle_large: {
    fontSize: 14,
  },
  iconContainer: {
    marginLeft: 12,
  },
  valueContainer: {
    marginTop: 4,
  },
  value: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  value_small: {
    fontSize: 18,
  },
  value_medium: {
    fontSize: 24,
  },
  value_large: {
    fontSize: 32,
  },
  change: {
    fontWeight: '600',
    marginTop: 2,
  },
  change_small: {
    fontSize: 11,
  },
  change_medium: {
    fontSize: 12,
  },
  change_large: {
    fontSize: 14,
  },
});