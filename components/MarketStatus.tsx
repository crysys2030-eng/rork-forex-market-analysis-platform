import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Activity, Wifi, WifiOff } from 'lucide-react-native';

interface MarketStatusProps {
  lastUpdate?: Date;
  isConnected?: boolean;
}

export function MarketStatus({ lastUpdate, isConnected = true }: MarketStatusProps) {
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
      
      // Pulse animation for live indicator
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    } else {
      setConnectionStatus('disconnected');
    }
  }, [isConnected, pulseAnimation]);

  const formatLastUpdate = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000) return 'Just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return date.toLocaleTimeString();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#00D4AA';
      case 'connecting': return '#FFD700';
      case 'disconnected': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi color={getStatusColor()} size={14} />;
      case 'connecting': return <Activity color={getStatusColor()} size={14} />;
      case 'disconnected': return <WifiOff color={getStatusColor()} size={14} />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Animated.View style={[styles.statusIndicator, { transform: [{ scale: pulseAnimation }] }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </Animated.View>
        
        <View style={styles.statusInfo}>
          <View style={styles.statusHeader}>
            {getStatusIcon()}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {connectionStatus.toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.updateText}>
            Last update: {formatLastUpdate(lastUpdate)}
          </Text>
        </View>
      </View>
      
      <View style={styles.marketInfo}>
        <Text style={styles.marketText}>Real-time Market Data</Text>
        <Text style={styles.providerText}>AI-Powered Analysis</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusInfo: {
    flex: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  updateText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  marketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  marketText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  providerText: {
    fontSize: 10,
    color: '#00D4AA',
    fontWeight: '500',
  },
});