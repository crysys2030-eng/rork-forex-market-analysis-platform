import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, TrendingUp, Target, Activity, Bot, Cpu, Bell, Settings, BarChart3, Layers, Sparkles, RefreshCw } from 'lucide-react-native';
import { useRealForexData } from '@/hooks/useRealForexData';
import { useRealCryptoData } from '@/hooks/useRealCryptoData';
import { useEnhancedMLTrading } from '@/hooks/useEnhancedMLTrading';
import { MLSignalCard } from '@/components/MLSignalCard';
import { MLModelCard } from '@/components/MLModelCard';
import { MLPerformanceCard } from '@/components/MLPerformanceCard';
import { MLConfigCard } from '@/components/MLConfigCard';
import { AlertHistoryModal } from '@/components/AlertHistoryModal';
import { useAlertHistory } from '@/hooks/useAlertHistory';
import { useSoundAlerts } from '@/hooks/useSoundAlerts';
import { SoundAlertControls } from '@/components/SoundAlertControls';

export default function MLTradingScreen() {
  const insets = useSafeAreaInsets();
  const { forexData } = useRealForexData();
  const { cryptoData } = useRealCryptoData();
  
  const allMarketData = [...forexData, ...cryptoData];
  
  const { 
    signals, 
    models, 
    performance, 
    loading,
    aiProcessing,
    config,
    refreshAnalysis,
    updateConfig,
    retrainModels 
  } = useEnhancedMLTrading(allMarketData);
  
  const {
    addAlert,
    getAlertsForSymbol,
    getAlertsByType,
  } = useAlertHistory();
  
  const {
    playAlert,
    toggleAlerts,
    toggleVibration,
    testAlert,
    isEnabled: soundAlertsEnabled,
    isVibrationEnabled
  } = useSoundAlerts();
  
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [selectedSymbolHistory, setSelectedSymbolHistory] = React.useState<string | undefined>();
  
  const [selectedTab, setSelectedTab] = React.useState<'signals' | 'models' | 'performance' | 'config'>('signals');
  const [refreshing, setRefreshing] = React.useState(false);

  const highAccuracySignals = signals.filter((signal: any) => signal.accuracy > 90);
  const aiEnhancedSignals = signals.filter((signal: any) => signal.aiEnhanced);
  const activeModels = models.filter((model: any) => model.status === 'ACTIVE');
  const aiModels = models.filter((model: any) => model.aiEnhanced);
  const ensembleSignals = signals.filter((signal: any) => (signal.ensembleVotes || 0) > 1);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAnalysis();
    } finally {
      setRefreshing(false);
    }
  };
  
  // Get active ML indicators for each currency
  const activeMLIndicators = allMarketData
    .filter(item => {
      const pairSignals = signals.filter((s: any) => s.symbol === item.symbol && s.accuracy > 85);
      return pairSignals.length > 0;
    })
    .map(item => {
      const pairSignals = signals.filter((s: any) => s.symbol === item.symbol && s.accuracy > 85);
      const avgConfidence = pairSignals.reduce((sum: number, s: any) => sum + s.confidence, 0) / pairSignals.length;
      const aiSignals = pairSignals.filter((s: any) => s.aiEnhanced).length;
      return {
        symbol: item.symbol,
        signalCount: pairSignals.length,
        confidence: Math.round(avgConfidence),
        aiSignals
      };
    })
    .sort((a, b) => (b.confidence * b.signalCount) - (a.confidence * a.signalCount))
    .slice(0, 8);

  // Add ML trading alerts to history when new high-accuracy signals are detected
  React.useEffect(() => {
    highAccuracySignals.forEach((signal: any) => {
      // Check if we already have this alert in history (avoid duplicates)
      const existingAlerts = getAlertsForSymbol(signal.symbol);
      const recentAlert = existingAlerts.find(alert => 
        alert.status === 'ACTIVE' && 
        Math.abs(alert.timestamp.getTime() - signal.timestamp.getTime()) < 60000 // Within 1 minute
      );
      
      if (!recentAlert) {
        addAlert({
          symbol: signal.symbol,
          type: 'ML_TRADING',
          action: signal.action,
          confidence: signal.confidence,
          timestamp: signal.timestamp,
          details: {
            entryPrice: signal.entryPrice,
            stopLoss: signal.stopLoss,
            takeProfit: signal.takeProfit,
            reason: `ML Model: ${signal.modelUsed} • Accuracy: ${signal.accuracy}% • Technical Score: ${signal.features.technicalScore}`,
            modelUsed: signal.modelUsed,
          },
          status: 'ACTIVE',
        });
        
        // Play sound alert for new high-accuracy ML signals
        const alertType = signal.accuracy > 95 ? 'CRITICAL' : 'ML_TRADING';
        playAlert({
          type: alertType,
          symbol: signal.symbol,
          confidence: signal.confidence,
          timestamp: signal.timestamp,
        });
      }
    });
  }, [highAccuracySignals, addAlert, getAlertsForSymbol, playAlert]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Professional Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                <Sparkles color="#00D4AA" size={28} />
                <Text style={styles.title}>Professional ML Trading</Text>
                {(aiProcessing || loading) && (
                  <ActivityIndicator size="small" color="#00D4AA" style={styles.processingIndicator} />
                )}
              </View>
              <TouchableOpacity 
                onPress={handleRefresh}
                style={styles.refreshButton}
                disabled={refreshing}
              >
                <RefreshCw 
                  color={refreshing ? "#6B7280" : "#8B5CF6"} 
                  size={20} 
                  style={refreshing ? styles.spinning : undefined}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Advanced AI Models • Real-Time Analysis • Professional Trading Signals</Text>
            
            {/* Professional Stats Overview */}
            <View style={styles.statsOverview}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Brain color="#8B5CF6" size={20} />
                </View>
                <Text style={styles.statValue}>{signals.length}</Text>
                <Text style={styles.statLabel}>Active Signals</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Bot color="#00D4AA" size={20} />
                </View>
                <Text style={[styles.statValue, { color: '#00D4AA' }]}>{aiEnhancedSignals.length}</Text>
                <Text style={styles.statLabel}>AI Enhanced</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Layers color="#F59E0B" size={20} />
                </View>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>{ensembleSignals.length}</Text>
                <Text style={styles.statLabel}>Ensemble</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Target color="#10B981" size={20} />
                </View>
                <Text style={[styles.statValue, { color: '#10B981' }]}>{highAccuracySignals.length}</Text>
                <Text style={styles.statLabel}>High Accuracy</Text>
              </View>
            </View>
          </View>
          
          {/* Professional Tab Navigation */}
          <View style={styles.tabNavigation}>
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'signals' && styles.activeTab]}
              onPress={() => setSelectedTab('signals')}
            >
              <TrendingUp color={selectedTab === 'signals' ? '#FFFFFF' : '#9CA3AF'} size={16} />
              <Text style={[styles.tabText, selectedTab === 'signals' && styles.activeTabText]}>Signals</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'models' && styles.activeTab]}
              onPress={() => setSelectedTab('models')}
            >
              <Cpu color={selectedTab === 'models' ? '#FFFFFF' : '#9CA3AF'} size={16} />
              <Text style={[styles.tabText, selectedTab === 'models' && styles.activeTabText]}>Models</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'performance' && styles.activeTab]}
              onPress={() => setSelectedTab('performance')}
            >
              <BarChart3 color={selectedTab === 'performance' ? '#FFFFFF' : '#9CA3AF'} size={16} />
              <Text style={[styles.tabText, selectedTab === 'performance' && styles.activeTabText]}>Performance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'config' && styles.activeTab]}
              onPress={() => setSelectedTab('config')}
            >
              <Settings color={selectedTab === 'config' ? '#FFFFFF' : '#9CA3AF'} size={16} />
              <Text style={[styles.tabText, selectedTab === 'config' && styles.activeTabText]}>Config</Text>
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
            onTest={() => testAlert('ML_TRADING')}
          />
          
          {/* Tab Content */}
          {selectedTab === 'signals' && (
            <>
              {/* Active ML Indicator Alerts */}
              {activeMLIndicators.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Bell color="#8B5CF6" size={20} />
                    <Text style={styles.sectionTitle}>Active ML Indicators</Text>
                    <TouchableOpacity 
                      onPress={() => setShowHistoryModal(true)}
                      style={styles.historyButton}
                    >
                      <Text style={styles.historyButtonText}>History</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.indicatorGrid}>
                    {activeMLIndicators.map((indicator) => (
                      <View key={indicator.symbol} style={styles.indicatorCard}>
                        <Text style={styles.indicatorSymbol}>{indicator.symbol}</Text>
                        <View style={styles.indicatorStats}>
                          <Text style={styles.indicatorValue}>{indicator.signalCount}</Text>
                          <Text style={styles.indicatorLabel}>Signals</Text>
                        </View>
                        <View style={styles.indicatorStats}>
                          <Text style={[styles.indicatorValue, { color: '#00D4AA' }]}>{indicator.aiSignals}</Text>
                          <Text style={styles.indicatorLabel}>AI</Text>
                        </View>
                        <View style={styles.indicatorStats}>
                          <Text style={[styles.indicatorValue, { 
                            color: indicator.confidence > 85 ? '#10B981' : indicator.confidence > 75 ? '#F59E0B' : '#EF4444' 
                          }]}>{indicator.confidence}%</Text>
                          <Text style={styles.indicatorLabel}>Confidence</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {/* AI Enhanced Signals */}
              {aiEnhancedSignals.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Sparkles color="#00D4AA" size={20} />
                    <Text style={styles.sectionTitle}>AI Enhanced Signals</Text>
                    <View style={styles.aiIndicator}>
                      <Bot color="#00D4AA" size={14} />
                      <Text style={styles.aiIndicatorText}>{aiEnhancedSignals.length}</Text>
                    </View>
                  </View>
                  {aiEnhancedSignals.slice(0, 5).map((signal: any, index: number) => (
                    <MLSignalCard 
                      key={`ai-${signal.id}-${index}`}
                      signal={signal}
                    />
                  ))}
                </View>
              )}
              
              {/* High Accuracy Signals */}
              {highAccuracySignals.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Target color="#10B981" size={20} />
                    <Text style={styles.sectionTitle}>Premium Signals (90%+ Accuracy)</Text>
                  </View>
                  {highAccuracySignals.slice(0, 5).map((signal: any, index: number) => (
                    <MLSignalCard 
                      key={`high-${signal.id}-${index}`}
                      signal={signal}
                    />
                  ))}
                </View>
              )}
              
              {/* All ML Signals */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp color="#8B5CF6" size={20} />
                  <Text style={styles.sectionTitle}>All ML Trading Signals</Text>
                  {performance && (
                    <View style={styles.performanceIndicator}>
                      <Text style={styles.performanceText}>
                        {signals.length} Total • {performance.overallAccuracy.toFixed(1)}% Accuracy
                      </Text>
                    </View>
                  )}
                </View>
                {signals.length > 0 ? (
                  signals.map((signal: any, index: number) => (
                    <MLSignalCard 
                      key={`${signal.id}-${index}`}
                      signal={signal}
                    />
                  ))
                ) : (
                  <View style={styles.noDataContainer}>
                    <Brain color="#6B7280" size={32} />
                    <Text style={styles.noDataText}>AI Analyzing Market Data</Text>
                    <Text style={styles.noDataSubtext}>Advanced ML models processing market signals...</Text>
                    <ActivityIndicator size="small" color="#00D4AA" style={styles.loadingIndicator} />
                  </View>
                )}
              </View>
            </>
          )}
          
          {selectedTab === 'models' && (
            <>

              {/* AI Enhanced Models */}
              {aiModels.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Sparkles color="#00D4AA" size={20} />
                    <Text style={styles.sectionTitle}>AI Enhanced Models</Text>
                    <TouchableOpacity 
                      onPress={() => retrainModels()}
                      style={styles.retrainButton}
                      disabled={loading}
                    >
                      <RefreshCw color={loading ? "#6B7280" : "#8B5CF6"} size={16} />
                      <Text style={[styles.retrainButtonText, loading && { color: '#6B7280' }]}>Retrain</Text>
                    </TouchableOpacity>
                  </View>
                  {aiModels.map((model: any, index: number) => (
                    <MLModelCard 
                      key={`ai-${model.id}-${index}`}
                      model={model}
                    />
                  ))}
                </View>
              )}
              
              {/* All Active ML Models */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Activity color="#8B5CF6" size={20} />
                  <Text style={styles.sectionTitle}>All Active Models</Text>
                  <View style={styles.modelStats}>
                    <Text style={styles.modelStatsText}>{activeModels.length} Active</Text>
                  </View>
                </View>
                {activeModels.length > 0 ? (
                  activeModels.map((model: any, index: number) => (
                    <MLModelCard 
                      key={`${model.id}-${index}`}
                      model={model}
                    />
                  ))
                ) : (
                  <View style={styles.noDataContainer}>
                    <Cpu color="#6B7280" size={32} />
                    <Text style={styles.noDataText}>No Active Models</Text>
                    <Text style={styles.noDataSubtext}>Models are being initialized...</Text>
                    {loading && <ActivityIndicator size="small" color="#8B5CF6" style={styles.loadingIndicator} />}
                  </View>
                )}
              </View>
            </>
          )}
          
          {selectedTab === 'performance' && (
            <>
              {/* Performance Overview */}
              <MLPerformanceCard 
                performance={performance}
                loading={loading}
              />
            </>
          )}
          
          {selectedTab === 'config' && (
            <>
              {/* ML Configuration */}
              <MLConfigCard 
                config={{
                  ...config,
                  maxPairs: 5,
                  pairRotationInterval: 90000
                }}
                onConfigUpdate={updateConfig}
                onRetrain={retrainModels}
              />
            </>
          )}


          
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* Alert History Modal */}
        <AlertHistoryModal
          visible={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedSymbolHistory(undefined);
          }}
          alerts={getAlertsByType('ML_TRADING')}
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
    minWidth: 0,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
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
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  aiIndicatorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00D4AA',
  },
  performanceIndicator: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  performanceText: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
  aiProcessingIndicator: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  activePairsContainer: {
    marginTop: 12,
    padding: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  pairsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activePairsLabel: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '700',
  },
  pairCountBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pairCountText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pairsSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  pairsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pairChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    position: 'relative',
  },
  newestPairChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  oldestPairChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  pairSymbol: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  newestPairText: {
    color: '#10B981',
  },
  pairSignals: {
    fontSize: 10,
    color: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 16,
    textAlign: 'center',
  },
  newestPairSignals: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    color: '#10B981',
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  oldBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  oldBadgeText: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pairRotationInfo: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  rotationInfoText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
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
  // New Professional Styles
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  processingIndicator: {
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  statIcon: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  indicatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  indicatorCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    minWidth: '45%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#374151',
  },
  indicatorSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  indicatorStats: {
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  indicatorLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  retrainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  retrainButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  modelStats: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modelStatsText: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});