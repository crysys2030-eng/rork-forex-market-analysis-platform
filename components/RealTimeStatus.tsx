import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react-native';
import { useRealTimeData } from '@/contexts/RealTimeDataContext';

interface RealTimeStatusProps {
  showDetails?: boolean;
  onRefresh?: () => void;
}

export function RealTimeStatus({ showDetails = false, onRefresh }: RealTimeStatusProps) {
  const { 
    connectionStatus, 
    dataQuality, 
    isRealTimeActive, 
    totalPairs, 
    livePairs, 
    realDataPairs,
    dataSources,
    lastUpdate,
    refreshData,
    loading
  } = useRealTimeData();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'CONNECTED': return '#00D4AA';
      case 'CONNECTING': return '#F59E0B';
      case 'DISCONNECTED': return '#6B7280';
      case 'ERROR': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getQualityColor = () => {
    switch (dataQuality) {
      case 'EXCELLENT': return '#00D4AA';
      case 'GOOD': return '#10B981';
      case 'FAIR': return '#F59E0B';
      case 'POOR': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = () => {
    if (loading) return <RefreshCw size={16} color={getStatusColor()} />;
    if (connectionStatus === 'CONNECTED' && isRealTimeActive) {
      return <Activity size={16} color={getStatusColor()} />;
    }
    if (connectionStatus === 'ERROR') {
      return <AlertCircle size={16} color={getStatusColor()} />;
    }
    if (connectionStatus === 'CONNECTED') {
      return <CheckCircle size={16} color={getStatusColor()} />;
    }
    return <WifiOff size={16} color={getStatusColor()} />;
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const now = Date.now();
    const diff = now - lastUpdate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return new Date(lastUpdate).toLocaleTimeString();
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      refreshData();
    }
  };

  if (!showDetails) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.statusRow}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {connectionStatus}
          </Text>
          <View style={[styles.qualityDot, { backgroundColor: getQualityColor() }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusRow}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {connectionStatus}
          </Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <RefreshCw size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.lastUpdate}>Updated {formatLastUpdate()}</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{totalPairs}</Text>
          <Text style={styles.metricLabel}>Total Pairs</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: '#00D4AA' }]}>{livePairs}</Text>
          <Text style={styles.metricLabel}>Live Data</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{realDataPairs}</Text>
          <Text style={styles.metricLabel}>Real Data</Text>
        </View>
      </View>

      <View style={styles.qualityRow}>
        <Text style={styles.qualityLabel}>Data Quality:</Text>
        <View style={[styles.qualityBadge, { backgroundColor: getQualityColor() + '20', borderColor: getQualityColor() }]}>
          <Text style={[styles.qualityText, { color: getQualityColor() }]}>{dataQuality}</Text>
        </View>
      </View>

      <View style={styles.sourcesContainer}>
        <Text style={styles.sourcesTitle}>Data Sources</Text>
        <View style={styles.sourcesList}>
          <View style={styles.sourceItem}>
            <View style={[styles.sourceStatusDot, { 
              backgroundColor: dataSources.forex.status === 'ACTIVE' ? '#00D4AA' : 
                              dataSources.forex.status === 'DEGRADED' ? '#F59E0B' : '#EF4444' 
            }]} />
            <Text style={styles.sourceName}>Forex: {dataSources.forex.primary}</Text>
            <Text style={styles.sourceStatusText}>{dataSources.forex.status}</Text>
          </View>
          <View style={styles.sourceItem}>
            <View style={[styles.sourceStatusDot, { 
              backgroundColor: dataSources.crypto.status === 'ACTIVE' ? '#00D4AA' : 
                              dataSources.crypto.status === 'DEGRADED' ? '#F59E0B' : '#EF4444' 
            }]} />
            <Text style={styles.sourceName}>Crypto: {dataSources.crypto.primary}</Text>
            <Text style={styles.sourceStatusText}>{dataSources.crypto.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  refreshButton: {
    padding: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  qualityLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  qualityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sourcesContainer: {
    marginTop: 8,
  },
  sourcesTitle: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
    marginBottom: 8,
  },
  sourcesList: {
    gap: 8,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sourceStatusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sourceName: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
  },
});