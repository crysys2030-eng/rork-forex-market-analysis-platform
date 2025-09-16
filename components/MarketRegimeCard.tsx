import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Zap,
  Clock
} from 'lucide-react-native';
import { MarketRegime } from '@/types/forex';

interface MarketRegimeCardProps {
  regime: MarketRegime;
}

export function MarketRegimeCard({ regime }: MarketRegimeCardProps) {
  const getRegimeIcon = (type: string) => {
    switch (type) {
      case 'trending': return <TrendingUp size={20} color="#10B981" />;
      case 'ranging': return <BarChart3 size={20} color="#F59E0B" />;
      case 'volatile': return <Zap size={20} color="#EF4444" />;
      case 'calm': return <Activity size={20} color="#6B7280" />;
      default: return <Activity size={20} color="#6B7280" />;
    }
  };

  const getRegimeColor = (type: string) => {
    switch (type) {
      case 'trending': return '#10B981';
      case 'ranging': return '#F59E0B';
      case 'volatile': return '#EF4444';
      case 'calm': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return '#10B981';
    if (strength >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <LinearGradient
      colors={['#1F2937', '#374151']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.regimeInfo}>
          {getRegimeIcon(regime.type)}
          <View style={styles.regimeText}>
            <Text style={styles.title}>Market Regime</Text>
            <Text style={[styles.type, { color: getRegimeColor(regime.type) }]}>
              {regime.type.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.strengthContainer}>
          <Text style={styles.strengthLabel}>Strength</Text>
          <Text style={[
            styles.strength,
            { color: getStrengthColor(regime.strength) }
          ]}>
            {regime.strength}%
          </Text>
        </View>
      </View>

      {/* Strength Bar */}
      <View style={styles.strengthBarContainer}>
        <View style={styles.strengthBar}>
          <View 
            style={[
              styles.strengthFill,
              { 
                width: `${regime.strength}%`,
                backgroundColor: getStrengthColor(regime.strength)
              }
            ]} 
          />
        </View>
      </View>

      {/* Duration */}
      <View style={styles.durationContainer}>
        <Clock size={16} color="#9CA3AF" />
        <Text style={styles.durationText}>
          Active for {regime.duration} days
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>{regime.description}</Text>

      {/* Trading Strategies */}
      <View style={styles.strategiesContainer}>
        <Text style={styles.strategiesTitle}>Recommended Strategies:</Text>
        {regime.tradingStrategy.map((strategy, index) => (
          <Text key={index} style={styles.strategy}>
            • {strategy}
          </Text>
        ))}
      </View>
    </LinearGradient>
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
    marginBottom: 12,
  },
  regimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regimeText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
  },
  strengthContainer: {
    alignItems: 'flex-end',
  },
  strengthLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  strength: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  strengthBarContainer: {
    marginBottom: 12,
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  durationText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 12,
  },
  strategiesContainer: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
  },
  strategiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  strategy: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
    marginBottom: 2,
  },
});