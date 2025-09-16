import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Clock, Globe, Activity } from 'lucide-react-native';
import { MarketSession } from '@/types/forex';

interface MarketSessionsProps {
  sessions: MarketSession[];
}

export function MarketSessions({ sessions }: MarketSessionsProps) {
  const formatVolume = (volume: number): string => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    }
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(0)}M`;
    }
    return `${(volume / 1000).toFixed(0)}K`;
  };

  const getSessionColor = (isActive: boolean): string => {
    return isActive ? '#00D4AA' : '#6B7280';
  };

  const getSessionBackground = (isActive: boolean): string => {
    return isActive ? 'rgba(0, 212, 170, 0.1)' : '#1F2937';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Globe color="#00D4AA" size={24} />
        <Text style={styles.title}>Market Sessions</Text>
      </View>

      <View style={styles.sessionsGrid}>
        {sessions.map((session) => (
          <View 
            key={session.name} 
            style={[
              styles.sessionCard,
              { backgroundColor: getSessionBackground(session.isActive) }
            ]}
          >
            <View style={styles.sessionHeader}>
              <View style={styles.sessionTitleRow}>
                <View 
                  style={[
                    styles.statusDot,
                    { backgroundColor: getSessionColor(session.isActive) }
                  ]} 
                />
                <Text style={styles.sessionName}>{session.name}</Text>
              </View>
              <Text style={[
                styles.statusText,
                { color: getSessionColor(session.isActive) }
              ]}>
                {session.isActive ? 'ACTIVE' : 'CLOSED'}
              </Text>
            </View>

            <View style={styles.sessionContent}>
              <View style={styles.timeRow}>
                <Clock color="#9CA3AF" size={16} />
                <Text style={styles.timeText}>
                  {session.openTime} - {session.closeTime} {session.timezone}
                </Text>
              </View>

              <View style={styles.volumeRow}>
                <Activity color="#9CA3AF" size={16} />
                <Text style={styles.volumeLabel}>Volume:</Text>
                <Text style={styles.volumeValue}>{formatVolume(session.volume)}</Text>
              </View>
            </View>

            {session.isActive && (
              <View style={styles.activeIndicator}>
                <View style={styles.pulsingDot} />
                <Text style={styles.activeText}>Live Trading</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Session Overlap Benefits</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoText}>
            • <Text style={styles.highlight}>London-New York</Text>: Highest liquidity and volatility
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.highlight}>Sydney-Tokyo</Text>: Asian market momentum
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.highlight}>Active Sessions</Text>: Better spreads and execution
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sessionsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  sessionCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  sessionContent: {
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#D1D5DB',
    marginLeft: 6,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  volumeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 170, 0.2)',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D4AA',
    marginRight: 6,
  },
  activeText: {
    fontSize: 11,
    color: '#00D4AA',
    fontWeight: '600',
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoContent: {
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  highlight: {
    color: '#00D4AA',
    fontWeight: '600',
  },
});