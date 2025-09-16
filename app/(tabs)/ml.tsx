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
import { Brain, TrendingUp, Target, Activity, Bot, Zap, Cpu, Bell } from 'lucide-react-native';
import { useRealForexData } from '@/hooks/useRealForexData';
import { useRealCryptoData } from '@/hooks/useRealCryptoData';
import { useMLTrading } from '@/hooks/useMLTrading';
import { MLSignalCard } from '@/components/MLSignalCard';
import { MLModelCard } from '@/components/MLModelCard';
import { MLPerformanceCard } from '@/components/MLPerformanceCard';
import { MLConfigCard } from '@/components/MLConfigCard';
import { ActiveIndicatorAlert } from '@/components/ActiveIndicatorAlert';
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
    config,
    activePairs,
    updateConfig,
    retrainModels 
  } = useMLTrading(allMarketData);
  
  const {
    addAlert,
    getAlertsForSymbol,
    getAlertsByType,
  } = useAlertHistory();
  
  const {
    playAlert,
    toggleAlerts,
    testAlert,
    isEnabled: soundAlertsEnabled
  } = useSoundAlerts();
  
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [selectedSymbolHistory, setSelectedSymbolHistory] = React.useState<string | undefined>();
  
  const [aiProcessing, setAiProcessing] = React.useState(false);
  
  // Simulate AI processing indicator
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAiProcessing(prev => !prev);
    }, 8000); // Toggle every 8 seconds to show AI is working
    
    return () => clearInterval(interval);
  }, []);

  const highAccuracySignals = signals.filter((signal: any) => signal.accuracy > 90);
  const aiEnhancedSignals = signals.filter((signal: any) => signal.aiEnhanced);
  const activeModels = models.filter((model: any) => model.status === 'ACTIVE');
  const aiModels = models.filter((model: any) => model.aiEnhanced);
  
  // Get active ML indicators for each currency
  const activeMLIndicators = allMarketData
    .filter(item => {
      const pairSignals = signals.filter((s: any) => s.symbol === item.symbol && s.accuracy > 80);
      return pairSignals.length > 0;
    })
    .map(item => {
      const pairSignals = signals.filter((s: any) => s.symbol === item.symbol && s.accuracy > 80);
      const avgConfidence = pairSignals.reduce((sum: number, s: any) => sum + s.confidence, 0) / pairSignals.length;
      return {
        symbol: item.symbol,
        signalCount: pairSignals.length,
        confidence: Math.round(avgConfidence)
      };
    })
    .sort((a, b) => b.signalCount - a.signalCount)
    .slice(0, 5);

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
  }, [highAccuracySignals.length, addAlert, getAlertsForSymbol, playAlert]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Bot color="#00D4AA" size={24} />
              <Text style={styles.title}>Enhanced ML Trading</Text>
              {aiProcessing && (
                <ActivityIndicator size="small" color="#00D4AA" style={styles.aiProcessingIndicator} />
              )}
            </View>
            <Text style={styles.subtitle}>Real-Time AI Analysis • Binance & Forex Data • DeepSeek AI</Text>
            
            {/* Active Pairs Display - Enhanced */}
            {activePairs && activePairs.length > 0 && (
              <View style={styles.activePairsContainer}>
                <View style={styles.pairsHeaderRow}>
                  <Text style={styles.activePairsLabel}>Active Scalping Pairs</Text>
                  <View style={styles.pairCountBadge}>
                    <Text style={styles.pairCountText}>{activePairs.length}/5</Text>
                  </View>
                </View>
                <Text style={styles.pairsSubtitle}>Auto-rotating every 20s • Oldest pair replaced when new pair found</Text>
                <View style={styles.pairsRow}>
                  {activePairs.map((pair, index) => {
                    const isNewest = index === 0; // First item is newest due to sorting
                    const isOldest = index === activePairs.length - 1;
                    return (
                      <View key={pair.symbol} style={[
                        styles.pairChip,
                        isNewest && styles.newestPairChip,
                        isOldest && activePairs.length === 5 && styles.oldestPairChip
                      ]}>
                        <Text style={[
                          styles.pairSymbol,
                          isNewest && styles.newestPairText
                        ]}>{pair.symbol}</Text>
                        <Text style={[
                          styles.pairSignals,
                          isNewest && styles.newestPairSignals
                        ]}>{pair.signalCount}</Text>
                        {isNewest && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                          </View>
                        )}
                        {isOldest && activePairs.length === 5 && (
                          <View style={styles.oldBadge}>
                            <Text style={styles.oldBadgeText}>NEXT</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{signals.length}</Text>
              <Text style={styles.statLabel}>Live Signals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#00D4AA' }]}>{aiEnhancedSignals.length}</Text>
              <Text style={styles.statLabel}>AI Signals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: activePairs?.length === 5 ? '#10B981' : '#F59E0B' }]}>{activePairs?.length || 0}/5</Text>
              <Text style={styles.statLabel}>Scalping Pairs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: (performance?.overallAccuracy || 0) > 85 ? '#10B981' : '#F59E0B' }]}>
                {performance?.overallAccuracy ? performance.overallAccuracy.toFixed(1) : '0'}%
              </Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Sound Alert Controls */}
          <SoundAlertControls
            isEnabled={soundAlertsEnabled}
            onToggle={toggleAlerts}
            onTest={() => testAlert('ML_TRADING')}
          />
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
              {activeMLIndicators.map((indicator) => (
                <ActiveIndicatorAlert
                  key={indicator.symbol}
                  symbol={indicator.symbol}
                  indicatorType="ML_TRADING"
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
          {/* ML Configuration */}
          <MLConfigCard 
            config={config}
            onConfigUpdate={updateConfig}
            onRetrain={retrainModels}
          />

          {/* Performance Overview */}
          <MLPerformanceCard 
            performance={performance}
            loading={loading}
          />

          {/* AI Enhanced Models */}
          {aiModels.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Cpu color="#00D4AA" size={20} />
                <Text style={styles.sectionTitle}>AI Enhanced Models</Text>
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

          {/* AI Enhanced Signals */}
          {aiEnhancedSignals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Zap color="#00D4AA" size={20} />
                <Text style={styles.sectionTitle}>AI Enhanced Signals</Text>
                <View style={styles.aiIndicator}>
                  <Bot color="#00D4AA" size={14} />
                  <Text style={styles.aiIndicatorText}>{aiEnhancedSignals.length}</Text>
                </View>
              </View>
              {aiEnhancedSignals.map((signal: any, index: number) => (
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
              {highAccuracySignals.map((signal: any, index: number) => (
                <MLSignalCard 
                  key={`high-${signal.id}-${index}`}
                  signal={signal}
                />
              ))}
            </View>
          )}

          {/* All Enhanced ML Signals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp color="#8B5CF6" size={20} />
              <Text style={styles.sectionTitle}>All ML Trading Signals</Text>
              {performance && (
                <View style={styles.performanceIndicator}>
                  <Text style={styles.performanceText}>
                    {signals.length} Total • {activePairs?.length || 0} Pairs
                  </Text>
                </View>
              )}
            </View>
            {activePairs && activePairs.length > 0 && (
              <View style={styles.pairRotationInfo}>
                <Text style={styles.rotationInfoText}>
                  🔄 Signals from rotating pairs: {activePairs.map(p => p.symbol).join(' • ')}
                </Text>
              </View>
            )}
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
                <Text style={styles.noDataText}>AI Reading Market Data</Text>
                <Text style={styles.noDataSubtext}>DeepSeek AI analyzing Binance & Forex markets...</Text>
                <ActivityIndicator size="small" color="#00D4AA" style={styles.loadingIndicator} />
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
});