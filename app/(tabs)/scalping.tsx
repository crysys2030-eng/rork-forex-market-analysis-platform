import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, TrendingUp, AlertTriangle, Bell, X, Activity, BarChart3, Wifi } from 'lucide-react-native';
import { ScalpingSignalCard } from '@/components/ScalpingSignalCard';
import { ScalpingAnalysisCard } from '@/components/ScalpingAnalysisCard';
import { ScalpingConfigCard } from '@/components/ScalpingConfigCard';
import { ActiveIndicatorAlert } from '@/components/ActiveIndicatorAlert';
import { AlertHistoryModal } from '@/components/AlertHistoryModal';
import { useScalpingAI } from '@/hooks/useScalpingAI';
import { useAlertHistory } from '@/hooks/useAlertHistory';
import { useSoundAlerts } from '@/hooks/useSoundAlerts';
import { SoundAlertControls } from '@/components/SoundAlertControls';

export default function ScalpingScreen() {
  const insets = useSafeAreaInsets();
  const { 
    signals, 
    analysis, 
    loading: aiLoading, 
    config,
    alerts,
    activePairs,
    pairDiscoveryActive,
    realTimeData,
    lastDataUpdate,
    updateConfig,
    clearAlerts,
    togglePairDiscovery,
    fetchRealTimeMarketData
  } = useScalpingAI([]);
  
  const {
    alertHistory,
    addAlert,
    getAlertsForSymbol,
    getAlertsByType,
    generateMockAlert
  } = useAlertHistory();
  
  const {
    playAlert,
    toggleAlerts,
    toggleVibration,
    testAlert,
    isEnabled: soundAlertsEnabled,
    isVibrationEnabled
  } = useSoundAlerts();
  
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedSymbolHistory, setSelectedSymbolHistory] = useState<string | undefined>();
  
  const activeSignals = signals.filter(signal => signal.confidence > 70);
  const highConfidenceSignals = signals.filter(signal => signal.confidence > 85);
  const criticalSignals = signals.filter(signal => signal.confidence > 90);
  
  // Get active indicators for each currency
  const activeIndicators = realTimeData
    .filter(item => {
      const pairSignals = signals.filter(s => s.symbol === item.symbol && s.confidence > 70);
      return pairSignals.length > 0;
    })
    .map(item => {
      const pairSignals = signals.filter(s => s.symbol === item.symbol && s.confidence > 70);
      const avgConfidence = pairSignals.reduce((sum, s) => sum + s.confidence, 0) / pairSignals.length;
      return {
        symbol: item.symbol,
        signalCount: pairSignals.length,
        confidence: Math.round(avgConfidence)
      };
    })
    .sort((a, b) => b.signalCount - a.signalCount)
    .slice(0, 5);
  
  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Add alerts to history when new high-confidence signals are detected
  useEffect(() => {
    highConfidenceSignals.forEach(signal => {
      // Check if we already have this alert in history (avoid duplicates)
      const existingAlerts = getAlertsForSymbol(signal.symbol);
      const recentAlert = existingAlerts.find(alert => 
        alert.status === 'ACTIVE' && 
        Math.abs(alert.timestamp.getTime() - signal.timestamp.getTime()) < 60000 // Within 1 minute
      );
      
      if (!recentAlert) {
        addAlert({
          symbol: signal.symbol,
          type: 'SCALPING',
          action: signal.action,
          confidence: signal.confidence,
          timestamp: signal.timestamp,
          details: {
            entryPrice: signal.entryPrice,
            stopLoss: signal.stopLoss,
            takeProfit: signal.takeProfit,
            reason: signal.reason,
            strategy: signal.strategy,
          },
          status: 'ACTIVE',
        });
        
        // Play sound alert for new high-confidence signals
        const alertType = signal.confidence > 90 ? 'CRITICAL' : 'HIGH_CONFIDENCE';
        playAlert({
          type: alertType,
          symbol: signal.symbol,
          confidence: signal.confidence,
          timestamp: signal.timestamp,
        });
      }
    });
  }, [highConfidenceSignals.length, addAlert, getAlertsForSymbol, playAlert]);
  
  const formatPrice = (price: number, symbol: string) => {
    const decimals = symbol.includes('JPY') ? 3 : 5;
    return price.toFixed(decimals);
  };
  
  const getPriceChangeColor = (change: number) => {
    return change > 0 ? '#10B981' : change < 0 ? '#EF4444' : '#6B7280';
  };
  
  const renderForexPair = ({ item }: { item: any }) => {
    const pairSignals = signals.filter(s => s.symbol === item.symbol);
    const bestSignal = pairSignals.sort((a, b) => b.confidence - a.confidence)[0];
    const isActive = pairSignals.length > 0;
    
    return (
      <TouchableOpacity style={[
        styles.pairCard,
        isActive && styles.activePairCard,
        bestSignal?.confidence > 90 && styles.criticalPairCard
      ]}>
        <View style={styles.pairHeader}>
          <View style={styles.pairInfo}>
            <Text style={styles.pairSymbol}>{item.symbol}</Text>
            <Text style={styles.pairName}>{item.name}</Text>
          </View>
          
          <View style={styles.pairPrice}>
            <Text style={styles.priceValue}>{formatPrice(item.price, item.symbol)}</Text>
            <View style={styles.priceChange}>
              <Text style={[styles.changeValue, { color: getPriceChangeColor(item.changePercent) }]}>
                {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
              </Text>
            </View>
            <Text style={styles.priceTimestamp}>
              {new Date(item.timestamp || Date.now()).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Text>
          </View>
        </View>
        
        <View style={styles.pairDetails}>
          <View style={styles.pairStat}>
            <Text style={styles.statLabel}>Spread</Text>
            <Text style={styles.statValue}>{(item.spread * 10000).toFixed(1)} pips</Text>
          </View>
          
          <View style={styles.pairStat}>
            <Text style={styles.statLabel}>Volume</Text>
            <Text style={styles.statValue}>{(item.volume / 1000000).toFixed(1)}M</Text>
          </View>
          
          <View style={styles.pairStat}>
            <Text style={styles.statLabel}>Signals</Text>
            <Text style={[styles.statValue, { color: isActive ? '#10B981' : '#6B7280' }]}>
              {pairSignals.length}
            </Text>
          </View>
        </View>
        
        {bestSignal && (
          <View style={styles.signalPreview}>
            <View style={[styles.signalBadge, { 
              backgroundColor: bestSignal.action === 'BUY' ? '#10B981' : '#EF4444' 
            }]}>
              <Text style={styles.signalAction}>{bestSignal.action}</Text>
              <Text style={styles.signalConfidence}>{bestSignal.confidence}%</Text>
            </View>
            <Text style={styles.signalReason} numberOfLines={1}>
              {bestSignal.reason.split(' • ')[0]}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Zap color="#F59E0B" size={24} />
              <Text style={styles.title}>Scalping AI</Text>
            </View>
            <Text style={styles.subtitle}>Real-time Binance & Forex AI scalping signals</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeSignals.length}</Text>
              <Text style={styles.statLabel}>Active Signals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: criticalSignals.length > 0 ? '#F59E0B' : '#10B981' }]}>
                {criticalSignals.length}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: analysis?.marketCondition === 'TRENDING' ? '#10B981' : '#F59E0B' }]}>
                {analysis?.marketCondition || 'LOADING'}
              </Text>
              <Text style={styles.statLabel}>Market</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.liveIndicator}>
                <Wifi color="#10B981" size={12} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
          
          {/* Real-time update indicator */}
          <View style={styles.updateIndicator}>
            <Activity color="#00D4AA" size={14} />
            <Text style={styles.updateText}>
              Live data: {lastDataUpdate.toLocaleTimeString('en-US', { hour12: false })}
            </Text>
            <View style={styles.dataSourceBadge}>
              <Text style={styles.dataSourceText}>Binance + Forex APIs</Text>
            </View>
            <TouchableOpacity 
              onPress={fetchRealTimeMarketData}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Sound Alert Controls */}
          <SoundAlertControls
            isEnabled={soundAlertsEnabled}
            isVibrationEnabled={isVibrationEnabled}
            onToggle={toggleAlerts}
            onToggleVibration={toggleVibration}
            onTest={() => testAlert('SCALPING')}
          />
          {/* Active Indicator Alerts */}
          {activeIndicators.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Bell color="#F59E0B" size={20} />
                <Text style={styles.sectionTitle}>Active Indicators</Text>
                <TouchableOpacity 
                  onPress={() => setShowHistoryModal(true)}
                  style={styles.historyButton}
                >
                  <Text style={styles.historyButtonText}>History</Text>
                </TouchableOpacity>
              </View>
              {activeIndicators.map((indicator) => (
                <ActiveIndicatorAlert
                  key={indicator.symbol}
                  symbol={indicator.symbol}
                  indicatorType="SCALPING"
                  signalCount={indicator.signalCount}
                  confidence={indicator.confidence}
                  onPress={() => {
                    setSelectedSymbolHistory(indicator.symbol);
                    setShowHistoryModal(true);
                  }}
                />
              ))}
            </View>
          )}
          {/* Active Scalping Pairs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 color="#00D4AA" size={20} />
              <Text style={styles.sectionTitle}>Active Scalping Pairs</Text>
              <TouchableOpacity 
                onPress={togglePairDiscovery}
                style={[styles.discoveryToggle, { 
                  backgroundColor: pairDiscoveryActive ? '#10B981' : '#6B7280' 
                }]}
              >
                <Text style={styles.discoveryToggleText}>
                  {pairDiscoveryActive ? 'SCANNING' : 'PAUSED'}
                </Text>
              </TouchableOpacity>
              <View style={styles.pairCount}>
                <Text style={styles.pairCountText}>{activePairs.length}/5</Text>
              </View>
            </View>
            
            {activePairs.length > 0 ? (
              <FlatList
                data={realTimeData.filter(item => activePairs.includes(item.symbol))}
                renderItem={renderForexPair}
                keyExtractor={(item) => item.symbol}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pairsList}
              />
            ) : (
              <View style={styles.noPairsContainer}>
                <Text style={styles.noPairsText}>🔍 Scanning for scalping opportunities...</Text>
                <Text style={styles.noPairsSubtext}>AI is analyzing {realTimeData.length} pairs from Binance & Forex markets</Text>
                <Text style={styles.noPairsSubtext}>Real-time data updates every 15 seconds</Text>
              </View>
            )}
          </View>
          
          {/* All Currency Pairs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 color="#6B7280" size={20} />
              <Text style={styles.sectionTitle}>All Currency Pairs</Text>
              <View style={styles.pairCount}>
                <Text style={styles.pairCountText}>{realTimeData.length}</Text>
              </View>
            </View>
            
            {realTimeData.length > 0 ? (
              <FlatList
                data={realTimeData}
                renderItem={renderForexPair}
                keyExtractor={(item) => item.symbol}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pairsList}
              />
            ) : (
              <View style={styles.noPairsContainer}>
                <Text style={styles.noPairsText}>📡 Loading real-time market data...</Text>
                <Text style={styles.noPairsSubtext}>Connecting to Binance and Forex APIs</Text>
              </View>
            )}
          </View>
          
          {/* Configuration */}
          {/* Alerts Section */}
          {alerts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Bell color="#F59E0B" size={20} />
                <Text style={styles.sectionTitle}>Recent Alerts ({alerts.length})</Text>
                <TouchableOpacity onPress={clearAlerts} style={styles.clearButton}>
                  <X color="#6B7280" size={16} />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertsScroll}>
                {alerts.slice(0, 10).map((alert) => (
                  <View key={alert.id} style={[
                    styles.alertCard,
                    { borderLeftColor: alert.priority === 'HIGH' ? '#F59E0B' : '#6B7280' }
                  ]}>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertTime}>
                      {alert.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <ScalpingConfigCard 
            config={config}
            onConfigUpdate={updateConfig}
          />

          {/* Market Analysis */}
          <ScalpingAnalysisCard 
            analysis={analysis}
            loading={aiLoading}
          />

          {/* High Confidence Signals */}
          {highConfidenceSignals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertTriangle color="#F59E0B" size={20} />
                <Text style={styles.sectionTitle}>High Confidence Signals</Text>
              </View>
              {highConfidenceSignals.map((signal, index) => (
                <ScalpingSignalCard 
                  key={`high-${signal.symbol}-${index}`}
                  signal={signal}
                  priority="high"
                />
              ))}
            </View>
          )}

          {/* All Active Signals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp color="#00D4AA" size={20} />
              <Text style={styles.sectionTitle}>Active Scalping Signals</Text>
            </View>
            {activeSignals.length > 0 ? (
              activeSignals.map((signal, index) => (
                <ScalpingSignalCard 
                  key={`${signal.symbol}-${index}`}
                  signal={signal}
                />
              ))
            ) : (
              <View style={styles.noSignalsContainer}>
                <Text style={styles.noSignalsText}>No active signals at the moment</Text>
                <Text style={styles.noSignalsSubtext}>AI is analyzing market conditions...</Text>
              </View>
            )}
          </View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* Alert History Modal */}
        <AlertHistoryModal
          visible={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedSymbolHistory(undefined);
          }}
          alerts={getAlertsByType('SCALPING')}
          symbol={selectedSymbolHistory}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
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
    color: '#00D4AA',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  noSignalsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noSignalsText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  noSignalsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
  clearButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  alertsScroll: {
    marginBottom: 8,
  },
  alertCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 200,
    maxWidth: 250,
    borderLeftWidth: 3,
  },
  alertMessage: {
    fontSize: 12,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  // Live pair styles
  pairCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    minWidth: 200,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activePairCard: {
    borderColor: '#00D4AA',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  criticalPairCard: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  pairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pairInfo: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  pairName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pairPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  priceChange: {
    alignItems: 'flex-end',
  },
  changeValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  pairDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  pairStat: {
    alignItems: 'center',
    flex: 1,
  },
  signalPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  signalAction: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 4,
  },
  signalConfidence: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  signalReason: {
    flex: 1,
    fontSize: 10,
    color: '#D1D5DB',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  updateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  updateText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 6,
    flex: 1,
  },
  refreshButton: {
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  refreshButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00D4AA',
  },
  pairCount: {
    backgroundColor: '#00D4AA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  pairCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  pairsList: {
    paddingHorizontal: 20,
  },
  discoveryToggle: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  discoveryToggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noPairsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noPairsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  noPairsSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  historyButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  historyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  dataSourceBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  dataSourceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  priceTimestamp: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
});