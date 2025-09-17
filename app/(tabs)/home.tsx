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
import { useAIEnhancedMarketData } from '@/hooks/useAIEnhancedMarketData';
import { AIEnhancedPairCard } from '@/components/AIEnhancedPairCard';
import { AIMarketInsightsDashboard } from '@/components/AIMarketInsightsDashboard';
import { ActiveTradingDashboard } from '@/components/ActiveTradingDashboard';
import { AICurrencySearchModal } from '@/components/AICurrencySearchModal';
import { AICurrencyInfo } from '@/hooks/useAICurrencySearch';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'forex' | 'crypto' | 'insights'>('dashboard');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  
  const {
    enhancedForexData,
    enhancedCryptoData,
    marketInsights,
    aiLoading,
    refreshAIAnalysis
  } = useAIEnhancedMarketData();

  const handleCurrencySelect = (currency: AICurrencyInfo) => {
    console.log('Selected currency:', currency.symbol);
    // You can add logic here to show detailed analysis or add to watchlist
  };

  const renderTabButton = (tab: typeof activeTab, title: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <View style={styles.tabIcon}>{icon}</View>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ActiveTradingDashboard />;
      
      case 'forex':
        return (
          <ScrollView style={styles.scrollView}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>AI-Enhanced Forex Pairs</Text>
              {aiLoading && <Text style={styles.loadingText}>Analyzing...</Text>}
            </View>
            {enhancedForexData.map((pair) => (
              <AIEnhancedPairCard key={pair.symbol} pair={pair} />
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        );
      
      case 'crypto':
        return (
          <ScrollView style={styles.scrollView}>
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>AI-Enhanced Crypto Pairs</Text>
              {aiLoading && <Text style={styles.loadingText}>Analyzing...</Text>}
            </View>
            {enhancedCryptoData.map((pair) => (
              <AIEnhancedPairCard key={pair.symbol} pair={pair} />
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        );
      
      case 'insights':
        return (
          <AIMarketInsightsDashboard 
            insights={marketInsights}
            loading={aiLoading}
            onRefresh={refreshAIAnalysis}
          />
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
});