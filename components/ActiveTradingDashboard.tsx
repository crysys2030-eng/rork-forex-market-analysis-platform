import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,

  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap,
  Bell,
  Settings,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Brain,
  Globe,
  Sparkles,
  Layers
} from 'lucide-react-native';
import { useEnhancedMarketData } from '@/hooks/useEnhancedMarketData';
import { useAITradingSignals } from '@/hooks/useAITradingSignals';
import { useEnhancedMLTrading } from '@/hooks/useEnhancedMLTrading';
import { useAlertHistory } from '@/hooks/useAlertHistory';
import { useSoundAlerts } from '@/hooks/useSoundAlerts';
import { AlertHistoryModal } from './AlertHistoryModal';
import { SoundAlertControls } from './SoundAlertControls';
import { CurrencySearchModal } from './CurrencySearchModal';
import { AIAnalysisDashboard } from './AIAnalysisDashboard';

export function ActiveTradingDashboard() {
  const { 
    forexData, 
    cryptoData, 
    allData, 
    marketSummary, 
    loading: marketLoading, 
    error: marketError,
    refetch: refetchMarketData 
  } = useEnhancedMarketData();
  const { signals: aiSignals, analysis, loading: aiLoading } = useAITradingSignals();
  const { signals: mlSignals, performance, loading: mlLoading } = useEnhancedMLTrading(allData);
  const { alertHistory, getActiveAlerts, clearOldAlerts } = useAlertHistory();
  const { isEnabled, isVibrationEnabled, toggleAlerts, toggleVibration, testAlert } = useSoundAlerts();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'forex' | 'crypto' | 'ai' | 'ml' | 'alerts'>('overview');
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [showCurrencySearch, setShowCurrencySearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isLoading = marketLoading || aiLoading || mlLoading;
  const hasError = marketError;
  const activeAlerts = getActiveAlerts();
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchMarketData();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (allData.length > 0) {
      // Generate AI signals when market data is available
      console.log('🔄 Market data updated, triggering AI analysis...');
    }
  }, [allData]);

  const renderOverviewStats = () => {
    if (!marketSummary) return null;
    
    const { totalPairs, bullishPairs, bearishPairs, marketSentiment, topGainers, topLosers } = marketSummary;
    const topGainer = topGainers[0];
    const topLoser = topLosers[0];

    return (
      <View style={styles.overviewContainer}>
        <View style={styles.statsGrid}>
          <LinearGradient colors={['#1F2937', '#111827']} style={styles.statCard}>
            <View style={styles.statHeader}>
              <Globe size={20} color="#3B82F6" />
              <Text style={styles.statTitle}>Total Pairs</Text>
            </View>
            <Text style={styles.statValue}>{totalPairs}</Text>
            <Text style={styles.statSubtext}>Real-time data</Text>
          </LinearGradient>

          <LinearGradient colors={['#1F2937', '#111827']} style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statTitle}>Bullish</Text>
            </View>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{bullishPairs}</Text>
            <Text style={styles.statSubtext}>{((bullishPairs / totalPairs) * 100).toFixed(1)}%</Text>
          </LinearGradient>

          <LinearGradient colors={['#1F2937', '#111827']} style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingDown size={20} color="#EF4444" />
              <Text style={styles.statTitle}>Bearish</Text>
            </View>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{bearishPairs}</Text>
            <Text style={styles.statSubtext}>{((bearishPairs / totalPairs) * 100).toFixed(1)}%</Text>
          </LinearGradient>

          <LinearGradient colors={['#1F2937', '#111827']} style={styles.statCard}>
            <View style={styles.statHeader}>
              <Sparkles size={20} color="#8B5CF6" />
              <Text style={styles.statTitle}>Sentiment</Text>
            </View>
            <Text style={[
              styles.statValue, 
              { color: marketSentiment === 'BULLISH' ? '#10B981' : marketSentiment === 'BEARISH' ? '#EF4444' : '#6B7280' }
            ]}>
              {marketSentiment}
            </Text>
            <Text style={styles.statSubtext}>AI Analysis</Text>
          </LinearGradient>
        </View>

        <View style={styles.topMoversSection}>
          <Text style={styles.sectionTitle}>Market Leaders</Text>
          <View style={styles.topMoversGrid}>
            <LinearGradient colors={['#065F46', '#064E3B']} style={styles.topMoverCard}>
              <View style={styles.topMoverHeader}>
                <TrendingUp size={16} color="#10B981" />
                <Text style={styles.topMoverTitle}>Top Gainer</Text>
              </View>
              <Text style={styles.topMoverSymbol}>{topGainer?.symbol || 'N/A'}</Text>
              <Text style={[styles.topMoverChange, { color: '#10B981' }]}>+{topGainer?.changePercent?.toFixed(2) || '0.00'}%</Text>
              <Text style={styles.topMoverSource}>{topGainer?.source || 'Real-time'}</Text>
            </LinearGradient>

            <LinearGradient colors={['#7F1D1D', '#991B1B']} style={styles.topMoverCard}>
              <View style={styles.topMoverHeader}>
                <TrendingDown size={16} color="#EF4444" />
                <Text style={styles.topMoverTitle}>Top Loser</Text>
              </View>
              <Text style={styles.topMoverSymbol}>{topLoser?.symbol || 'N/A'}</Text>
              <Text style={[styles.topMoverChange, { color: '#EF4444' }]}>{topLoser?.changePercent?.toFixed(2) || '0.00'}%</Text>
              <Text style={styles.topMoverSource}>{topLoser?.source || 'Real-time'}</Text>
            </LinearGradient>
          </View>
        </View>
        
        {analysis && (
          <View style={styles.aiInsightsSection}>
            <Text style={styles.sectionTitle}>AI Market Insights</Text>
            <LinearGradient colors={['#1E1B4B', '#312E81']} style={styles.aiInsightCard}>
              <View style={styles.aiInsightHeader}>
                <Brain size={20} color="#8B5CF6" />
                <Text style={styles.aiInsightTitle}>Market Analysis</Text>
              </View>
              <Text style={styles.aiInsightText}>{analysis.marketOverview.recommendation}</Text>
              <View style={styles.aiMetrics}>
                <View style={styles.aiMetric}>
                  <Text style={styles.aiMetricLabel}>Risk Level</Text>
                  <Text style={styles.aiMetricValue}>{analysis.marketOverview.riskLevel}/10</Text>
                </View>
                <View style={styles.aiMetric}>
                  <Text style={styles.aiMetricLabel}>Volatility</Text>
                  <Text style={styles.aiMetricValue}>{analysis.marketOverview.volatility}</Text>
                </View>
                <View style={styles.aiMetric}>
                  <Text style={styles.aiMetricLabel}>AI Signals</Text>
                  <Text style={styles.aiMetricValue}>{aiSignals.length}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  const renderMarketData = (data: any[], title: string) => (
    <View style={styles.marketDataContainer}>
      <Text style={styles.sectionTitle}>{title} Markets</Text>
      <Text style={styles.sectionSubtext}>Real-time data from multiple sources</Text>
      
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.emptyText}>Loading {title.toLowerCase()} data...</Text>
        </View>
      ) : (
        <View style={styles.marketList}>
          {data.slice(0, 10).map((pair, index) => (
            <LinearGradient
              key={`${pair.symbol}-${index}`}
              colors={['#1F2937', '#111827']}
              style={styles.marketCard}
            >
              <View style={styles.marketHeader}>
                <View>
                  <Text style={styles.marketSymbol}>{pair.symbol}</Text>
                  <Text style={styles.marketName}>{pair.name}</Text>
                  <Text style={styles.marketSource}>{pair.source}</Text>
                </View>
                <View style={styles.marketPricing}>
                  <Text style={styles.marketPrice}>
                    {pair.price.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}
                  </Text>
                  <Text style={[
                    styles.marketChange,
                    { color: pair.changePercent >= 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    {pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.marketMetrics}>
                <View style={styles.marketMetric}>
                  <Text style={styles.metricLabel}>High</Text>
                  <Text style={styles.metricValue}>{pair.high.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}</Text>
                </View>
                <View style={styles.marketMetric}>
                  <Text style={styles.metricLabel}>Low</Text>
                  <Text style={styles.metricValue}>{pair.low.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}</Text>
                </View>
                <View style={styles.marketMetric}>
                  <Text style={styles.metricLabel}>Volume</Text>
                  <Text style={styles.metricValue}>{(pair.volume / 1000000).toFixed(1)}M</Text>
                </View>
                <View style={styles.marketMetric}>
                  <Text style={styles.metricLabel}>Spread</Text>
                  <Text style={styles.metricValue}>{pair.spread.toFixed(pair.symbol.includes('JPY') ? 2 : 5)}</Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>
      )}
    </View>
  );

  const renderMLSignals = () => (
    <View style={styles.mlContainer}>
      <Text style={styles.sectionTitle}>ML Trading Signals</Text>
      <Text style={styles.sectionSubtext}>Machine Learning powered predictions</Text>
      
      {performance && (
        <LinearGradient colors={['#1F2937', '#111827']} style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>Model Performance</Text>
          <View style={styles.performanceMetrics}>
            <View style={styles.performanceMetric}>
              <Text style={styles.performanceLabel}>Accuracy</Text>
              <Text style={styles.performanceValue}>{performance.overallAccuracy.toFixed(1)}%</Text>
            </View>
            <View style={styles.performanceMetric}>
              <Text style={styles.performanceLabel}>Signals</Text>
              <Text style={styles.performanceValue}>{performance.totalSignals}</Text>
            </View>
            <View style={styles.performanceMetric}>
              <Text style={styles.performanceLabel}>Success</Text>
              <Text style={styles.performanceValue}>{performance.successfulSignals}</Text>
            </View>
          </View>
        </LinearGradient>
      )}
      
      {mlSignals.length === 0 ? (
        <View style={styles.emptyState}>
          <Zap size={48} color="#6B7280" />
          <Text style={styles.emptyText}>No ML signals available</Text>
          <Text style={styles.emptySubtext}>Models are analyzing market conditions</Text>
        </View>
      ) : (
        <View style={styles.signalsList}>
          {mlSignals.slice(0, 5).map((signal, index) => (
            <LinearGradient
              key={`ml-${signal.symbol}-${index}`}
              colors={['#1F2937', '#111827']}
              style={styles.signalCard}
            >
              <View style={styles.signalHeader}>
                <Text style={styles.signalSymbol}>{signal.symbol}</Text>
                <View style={[
                  styles.signalBadge,
                  { backgroundColor: signal.action === 'BUY' ? '#10B981' : signal.action === 'SELL' ? '#EF4444' : '#6B7280' }
                ]}>
                  <Text style={styles.signalAction}>{signal.action}</Text>
                </View>
              </View>
              <Text style={styles.signalConfidence}>Confidence: {signal.confidence}%</Text>
              <Text style={styles.signalReason}>ML model prediction based on technical analysis</Text>
            </LinearGradient>
          ))}
        </View>
      )}
    </View>
  );

  const renderAlerts = () => (
    <View style={styles.alertsContainer}>
      <View style={styles.alertsHeader}>
        <Text style={styles.sectionTitle}>Active Alerts</Text>
        <TouchableOpacity onPress={clearOldAlerts} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Old</Text>
        </TouchableOpacity>
      </View>
      
      <SoundAlertControls 
        isEnabled={isEnabled}
        isVibrationEnabled={isVibrationEnabled}
        onToggle={toggleAlerts}
        onToggleVibration={toggleVibration}
        onTest={testAlert}
      />
      
      {activeAlerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={48} color="#6B7280" />
          <Text style={styles.emptyText}>No active alerts</Text>
          <Text style={styles.emptySubtext}>Alerts will appear here when triggered</Text>
        </View>
      ) : (
        <View style={styles.alertsList}>
          {activeAlerts.slice(0, 10).map((alert, index) => (
            <View key={`alert-${index}`} style={styles.alertItem}>
              <Text style={styles.alertSymbol}>{alert.symbol}</Text>
              <Text style={styles.alertAction}>{alert.action}</Text>
              <Text style={styles.alertTime}>
                {alert.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverviewStats();
      case 'forex':
        return renderMarketData(forexData, 'Forex');
      case 'crypto':
        return renderMarketData(cryptoData, 'Crypto');
      case 'ai':
        return <AIAnalysisDashboard />;
      case 'ml':
        return renderMLSignals();
      case 'alerts':
        return renderAlerts();
      default:
        return renderOverviewStats();
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'forex', label: 'Forex', icon: DollarSign },
    { id: 'crypto', label: 'Crypto', icon: Target },
    { id: 'ai', label: 'AI Signals', icon: Brain },
    { id: 'ml', label: 'ML', icon: Zap },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ] as const;

  if (isLoading && allData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading professional trading data...</Text>
        <View style={styles.loadingSteps}>
          <View style={styles.loadingStep}>
            <Globe size={16} color="#3B82F6" />
            <Text style={styles.loadingStepText}>Connecting to Binance & Forex APIs</Text>
          </View>
          <View style={styles.loadingStep}>
            <Brain size={16} color="#8B5CF6" />
            <Text style={styles.loadingStepText}>Initializing AI analysis</Text>
          </View>
          <View style={styles.loadingStep}>
            <Zap size={16} color="#F59E0B" />
            <Text style={styles.loadingStepText}>Preparing ML models</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}

    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Professional Trading</Text>
          <Text style={styles.subtitle}>
            Real-time data • AI Analysis • ML Signals
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowCurrencySearch(true)}
          >
            <Globe size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowAlertHistory(true)}
          >
            <Bell size={20} color="#3B82F6" />
            {activeAlerts.length > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{activeAlerts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Layers size={20} color={refreshing ? '#6B7280' : '#3B82F6'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Settings size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {hasError && (
        <View style={styles.errorBanner}>
          <AlertTriangle size={16} color="#F59E0B" />
          <Text style={styles.errorText}>Using simulated data - API connection issues</Text>
        </View>
      )}

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = selectedTab === tab.id;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <IconComponent 
                  size={16} 
                  color={isActive ? '#3B82F6' : '#6B7280'} 
                />
                <Text style={[
                  styles.tabText,
                  isActive && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
                {tab.id === 'ai' && aiSignals.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{aiSignals.length}</Text>
                  </View>
                )}
                {tab.id === 'ml' && mlSignals.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{mlSignals.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {renderTabContent()}
      </View>

      <CurrencySearchModal
        visible={showCurrencySearch}
        onClose={() => setShowCurrencySearch(false)}
      />

      <AlertHistoryModal
        visible={showAlertHistory}
        onClose={() => setShowAlertHistory(false)}
        alerts={alertHistory}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#F8FAFC',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingSteps: {
    gap: 16,
  },
  loadingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingStepText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  alertBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A03',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#F59E0B',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tabsScroll: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#1E293B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  topMoversSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  sectionSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  topMoversGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  topMoverCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  topMoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  topMoverTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  topMoverSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  topMoverChange: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  topMoverSource: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  aiInsightsSection: {
    marginBottom: 24,
  },
  aiInsightCard: {
    padding: 16,
    borderRadius: 12,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiInsightText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    marginBottom: 16,
  },
  aiMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiMetric: {
    alignItems: 'center',
  },
  aiMetricLabel: {
    fontSize: 12,
    color: '#C4B5FD',
    marginBottom: 4,
  },
  aiMetricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  marketDataContainer: {
    padding: 20,
  },
  marketList: {
    gap: 12,
  },
  marketCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  marketSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  marketName: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  marketSource: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  marketPricing: {
    alignItems: 'flex-end',
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  marketChange: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  marketMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marketMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  mlContainer: {
    padding: 20,
  },
  performanceCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceMetric: {
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  signalsList: {
    gap: 12,
  },
  signalCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  signalSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  signalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  signalAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signalConfidence: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  signalReason: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
  },
  alertsContainer: {
    padding: 20,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  alertsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  alertSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  alertAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  alertTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});