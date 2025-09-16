import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StatusBarProps {
  title: string;
  value: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdate?: string;
}

export function StatusBar({ title, value, status, lastUpdate }: StatusBarProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#00D4AA';
      case 'warning': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Online';
      case 'warning': return 'Warning';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <LinearGradient
      colors={['#374151', '#4B5563']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
          {lastUpdate && (
            <Text style={styles.lastUpdate}>
              Last update: {lastUpdate}
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastUpdate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});