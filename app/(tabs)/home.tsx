import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, TrendingUp, Activity, Search } from 'lucide-react-native';
import { useRealTimeData } from '@/contexts/RealTimeDataContext';

import { ActiveTradingDashboard } from '@/components/ActiveTradingDashboard';
import { AICurrencySearchModal } from '@/components/AICurrencySearchModal';
import { AICurrencyInfo } from '@/hooks/useAICurrencySearch';
import { RealTimeStatus } from '@/components/RealTimeStatus';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'forex' | 'crypto' | 'insights'>('dashboard');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  
  const {
    forexPairs,
    cryptoPairs,
    loading,
    error,
    refreshData,
    dataQuality,
    connectionStatus,
    isRealTimeActive
  } = useRealTimeData();

  const handleCurrencySelect = (currency: AICurrencyInfo) => {
    console.log('Selected currency:', currency.symbol);
    // You can add logic here to show detailed analysis or add to watchlist
  };

  const renderTabButton = (tab: typeof activeTab, title: string, icon: React.ReactNode) => {
    // Validate tab parameter
    if (!tab || typeof tab !== 'string' || tab.length > 20) {
      return null;
    }
    
    return (
      <TouchableOpacity
        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
        onPress={() => setActiveTab(tab)}
      >
        <View style={styles.tabIcon}>
          <Text style={{ opacity: 0 }}>.</Text>
          {icon}
        </View>
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ActiveTradingDashboard />;
      
      case 'forex':
        return (
          <ScrollView style={styles.scrollView}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Real-Time Forex Pairs</Text>
              {loading && <Text style={styles.loadingText}>Loading...</Text>}
              <RealTimeStatus showDetails={false} />
            </View>
            {forexPairs.map((pair) => (
              <View key={pair.symbol} style={styles.pairCard}>
                <View style={styles.pairHeader}>
                  <Text style={styles.pairSymbol}>{pair.symbol}</Text>
                  <Text style={styles.pairName}>{pair.name}</Text>
                  <View style={[styles.dataQualityBadge, {
                    backgroundColor: pair.realTimeData.dataQuality === 'REAL' ? '#00D4AA20' : '#F59E0B20',
                    borderColor: pair.realTimeData.dataQuality === 'REAL' ? '#00D4AA' : '#F59E0B'
                  }]}>
                    <Text style={[styles.dataQualityText, {
                      color: pair.realTimeData.dataQuality === 'REAL' ? '#00D4AA' : '#F59E0B'
                    }]}>{pair.realTimeData.dataQuality}</Text>
                  </View>
                </View>
                <View style={styles.pairData}>
                  <Text style={styles.pairPrice}>{pair.price.toFixed(pair.symbol.includes('JPY') ? 2 : 4)}</Text>
                  <Text style={[styles.pairChange, {
                    color: pair.changePercent >= 0 ? '#00D4AA' : '#EF4444'
                  }]}>
                    {pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                  </Text>
                </View>
                <View style={styles.pairTechnicals}>
                  <Text style={styles.technicalLabel}>RSI: {pair.technicals.rsi}</Text>
                  <Text style={styles.technicalLabel}>Trend: {pair.technicals.trend}</Text>
                  <Text style={[styles.sentimentBadge, {
                    color: pair.aiInsights.sentiment === 'BULLISH' ? '#00D4AA' : 
                           pair.aiInsights.sentiment === 'BEARISH' ? '#EF4444' : '#F59E0B'
                  }]}>{pair.aiInsights.sentiment}</Text>
                </View>
                <Text style={styles.pairSource}>Source: {pair.realTimeData.source}</Text>
              </View>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        );
      
      case 'crypto':
        return (
          <ScrollView style={styles.scrollView}>
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Real-Time Crypto Pairs</Text>
              {loading && <Text style={styles.loadingText}>Loading...</Text>}
              <RealTimeStatus showDetails={false} />
            </View>
            {cryptoPairs.map((pair) => (
              <View key={pair.symbol} style={styles.pairCard}>
                <View style={styles.pairHeader}>
                  <Text style={styles.pairSymbol}>{pair.symbol}</Text>
                  <Text style={styles.pairName}>{pair.name}</Text>
                  <View style={[styles.dataQualityBadge, {
                    backgroundColor: pair.realTimeData.dataQuality === 'REAL' ? '#00D4AA20' : '#F59E0B20',
                    borderColor: pair.realTimeData.dataQuality === 'REAL' ? '#00D4AA' : '#F59E0B'
                  }]}>
                    <Text style={[styles.dataQualityText, {
                      color: pair.realTimeData.dataQuality === 'REAL' ? '#00D4AA' : '#F59E0B'
                    }]}>{pair.realTimeData.dataQuality}</Text>
                  </View>
                </View>
                <View style={styles.pairData}>
                  <Text style={styles.pairPrice}>${pair.price.toFixed(pair.price > 1 ? 2 : 6)}</Text>
                  <Text style={[styles.pairChange, {
                    color: pair.changePercent >= 0 ? '#00D4AA' : '#EF4444'
                  }]}>
                    {pair.changePercent >= 0 ? '+' : ''}{pair.changePercent.toFixed(2)}%
                  </Text>
                </View>
                <View style={styles.pairTechnicals}>
                  <Text style={styles.technicalLabel}>RSI: {pair.technicals.rsi}</Text>
                  <Text style={styles.technicalLabel}>Trend: {pair.technicals.trend}</Text>
                  <Text style={[styles.sentimentBadge, {
                    color: pair.aiInsights.sentiment === 'BULLISH' ? '#00D4AA' : 
                           pair.aiInsights.sentiment === 'BEARISH' ? '#EF4444' : '#F59E0B'
                  }]}>{pair.aiInsights.sentiment}</Text>
                </View>
                <Text style={styles.pairSource}>Source: {pair.realTimeData.source}</Text>
              </View>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        );
      
      case 'insights':
        return (
          <ScrollView style={styles.scrollView}>
            <RealTimeStatus showDetails={true} onRefresh={refreshData} />
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Market Overview</Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewLabel}>Connection</Text>
                  <Text style={[styles.overviewValue, {
                    color: connectionStatus === 'CONNECTED' ? '#00D4AA' : '#EF4444'
                  }]}>{connectionStatus}</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewLabel}>Data Quality</Text>
                  <Text style={[styles.overviewValue, {
                    color: dataQuality === 'EXCELLENT' ? '#00D4AA' : 
                           dataQuality === 'GOOD' ? '#10B981' : 
                           dataQuality === 'FAIR' ? '#F59E0B' : '#EF4444'
                  }]}>{dataQuality}</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewLabel}>Real-Time</Text>
                  <Text style={[styles.overviewValue, {
                    color: isRealTimeActive ? '#00D4AA' : '#EF4444'
                  }]}>{isRealTimeActive ? 'ACTIVE' : 'INACTIVE'}</Text>
                </View>
              </View>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              )}
            </View>
            <View style={styles.bottomPadding} />
          </ScrollView>
        );
      
      default:
        return <ActiveTradingDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.tabContainer}>
            {renderTabButton('dashboard', 'Dashboard', <Activity size={16} color={activeTab === 'dashboard' ? '#FFFFFF' : '#9CA3AF'} />)}
            {renderTabButton('forex', 'Forex AI', <TrendingUp size={16} color={activeTab === 'forex' ? '#FFFFFF' : '#9CA3AF'} />)}
            {renderTabButton('crypto', 'Crypto AI', <Activity size={16} color={activeTab === 'crypto' ? '#FFFFFF' : '#9CA3AF'} />)}
            {renderTabButton('insights', 'AI Insights', <Brain size={16} color={activeTab === 'insights' ? '#FFFFFF' : '#9CA3AF'} />)}
          </View>
          
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
        
        <AICurrencySearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectCurrency={handleCurrencySelect}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  tabIcon: {
    // Container for icon to avoid raw text warning
  },
  activeTabButton: {
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
  contentContainer: {
    flex: 1,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  loadingText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
  pairCard: {
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  pairHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  pairSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pairName: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  dataQualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  dataQualityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pairData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pairPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pairChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  pairTechnicals: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  technicalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sentimentBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  pairSource: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  insightsContainer: {
    margin: 16,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#7F1D1D',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
  },
});