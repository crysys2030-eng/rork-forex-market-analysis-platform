import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Activity, Globe, Wifi } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DashboardHeaderProps {
  totalPairs: number;
  activeMarkets: number;
  lastUpdate: string;
}

export function DashboardHeader({ totalPairs, activeMarkets, lastUpdate }: DashboardHeaderProps) {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  useEffect(() => {
    // Pulse animation for live indicator
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => {
      pulse.stop();
      clearInterval(timeInterval);
    };
  }, [pulseAnim]);

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
    >
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Market Dashboard</Text>
          <View style={styles.liveIndicator}>
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Real-time data from Forex APIs & Binance • Updated every second</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Globe color="#00D4AA" size={16} />
          <Text style={styles.statValue}>{totalPairs}</Text>
          <Text style={styles.statLabel}>Pairs</Text>
        </View>
        
        <View style={styles.statItem}>
          <Activity color="#F59E0B" size={16} />
          <Text style={styles.statValue}>{activeMarkets}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        
        <View style={styles.statItem}>
          <Wifi color="#10B981" size={16} />
          <Text style={styles.statValue}>{currentTime}</Text>
          <Text style={styles.statLabel}>Live Data</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});