import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Bell, TrendingUp, Activity } from 'lucide-react-native';

interface ActiveIndicatorAlertProps {
  symbol: string;
  indicatorType: 'SCALPING' | 'ML_TRADING';
  signalCount: number;
  confidence?: number;
  onPress?: () => void;
}

export function ActiveIndicatorAlert({ 
  symbol, 
  indicatorType, 
  signalCount, 
  confidence,
  onPress 
}: ActiveIndicatorAlertProps) {
  const getIndicatorColor = () => {
    switch (indicatorType) {
      case 'SCALPING':
        return '#F59E0B';
      case 'ML_TRADING':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getIndicatorIcon = () => {
    switch (indicatorType) {
      case 'SCALPING':
        return <Activity color={getIndicatorColor()} size={14} />;
      case 'ML_TRADING':
        return <TrendingUp color={getIndicatorColor()} size={14} />;
      default:
        return <Bell color={getIndicatorColor()} size={14} />;
    }
  };

  const getIndicatorLabel = () => {
    switch (indicatorType) {
      case 'SCALPING':
        return 'Scalping Active';
      case 'ML_TRADING':
        return 'ML Trading Active';
      default:
        return 'Active';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { borderLeftColor: getIndicatorColor() }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIndicatorIcon()}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={[styles.indicatorLabel, { color: getIndicatorColor() }]}>
            {getIndicatorLabel()}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={[styles.signalBadge, { backgroundColor: getIndicatorColor() }]}>
            <Text style={styles.signalCount}>{signalCount}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>
          {signalCount} active signal{signalCount !== 1 ? 's' : ''} detected
        </Text>
        {confidence && (
          <Text style={styles.confidenceText}>
            Avg. Confidence: {confidence}%
          </Text>
        )}
      </View>
      
      <View style={styles.pulseIndicator}>
        <View style={[styles.pulse, { backgroundColor: getIndicatorColor() }]} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  indicatorLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  signalBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  signalCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  details: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#D1D5DB',
    marginBottom: 2,
  },
  confidenceText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pulseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
});