import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X, Search, Brain, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react-native';
import { useAICurrencySearch, AICurrencyInfo } from '@/hooks/useAICurrencySearch';

interface AICurrencySearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCurrency?: (currency: AICurrencyInfo) => void;
}

export function AICurrencySearchModal({ visible, onClose, onSelectCurrency }: AICurrencySearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, loading, error, searchCurrency } = useAICurrencySearch();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      await searchCurrency(query);
    }
  };

  const handleSelectCurrency = (currency: AICurrencyInfo) => {
    onSelectCurrency?.(currency);
    onClose();
  };

  const formatPrice = (price: number) => {
    if (price > 100) return price.toFixed(2);
    if (price > 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return '#10B981';
      case 'BEARISH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderCurrencyCard = (currency: AICurrencyInfo) => (
    <TouchableOpacity
      key={currency.symbol}
      style={styles.currencyCard}
      onPress={() => handleSelectCurrency(currency)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{currency.symbol}</Text>
          <Text style={styles.name}>{currency.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(currency.currentPrice)}</Text>
          <View style={[styles.changeContainer, { 
            backgroundColor: currency.priceChange24h > 0 ? '#10B981' : currency.priceChange24h < 0 ? '#EF4444' : '#6B7280' 
          }]}>
            {currency.priceChange24h > 0 ? (
              <TrendingUp size={12} color="#FFFFFF" />
            ) : currency.priceChange24h < 0 ? (
              <TrendingDown size={12} color="#FFFFFF" />
            ) : null}
            <Text style={styles.changeText}>
              {currency.priceChange24h > 0 ? '+' : ''}{currency.priceChange24h.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {currency.description}
      </Text>

      {/* AI Analysis */}
      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <Brain size={14} color="#8B5CF6" />
          <Text style={styles.aiTitle}>AI Analysis</Text>
          <View style={[styles.confidenceBadge, { backgroundColor: `rgba(139, 92, 246, ${currency.aiAnalysis.confidence / 100})` }]}>
            <Text style={styles.confidenceText}>{currency.aiAnalysis.confidence}%</Text>
          </View>
        </View>
        
        <View style={styles.analysisRow}>
          <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(currency.aiAnalysis.sentiment) }]}>
            <Text style={styles.sentimentText}>{currency.aiAnalysis.sentiment}</Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: getRiskColor(currency.aiAnalysis.riskLevel) }]}>
            <AlertTriangle size={10} color="#FFFFFF" />
            <Text style={styles.riskText}>{currency.aiAnalysis.riskLevel}</Text>
          </View>
        </View>

        <Text style={styles.recommendation} numberOfLines={2}>
          {currency.aiAnalysis.recommendation}
        </Text>
      </View>

      {/* Price Targets */}
      <View style={styles.targetsSection}>
        <View style={styles.targetItem}>
          <Target size={10} color="#10B981" />
          <Text style={styles.targetLabel}>Short</Text>
          <Text style={styles.targetValue}>{formatPrice(currency.aiAnalysis.priceTarget.short)}</Text>
        </View>
        <View style={styles.targetItem}>
          <Target size={10} color="#F59E0B" />
          <Text style={styles.targetLabel}>Medium</Text>
          <Text style={styles.targetValue}>{formatPrice(currency.aiAnalysis.priceTarget.medium)}</Text>
        </View>
        <View style={styles.targetItem}>
          <Target size={10} color="#EF4444" />
          <Text style={styles.targetLabel}>Long</Text>
          <Text style={styles.targetValue}>{formatPrice(currency.aiAnalysis.priceTarget.long)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Brain size={24} color="#8B5CF6" />
            <Text style={styles.title}>AI Currency Search</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search currencies (e.g., EUR, Bitcoin, USDJPY)..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {loading && <ActivityIndicator size="small" color="#8B5CF6" />}
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {searchQuery.length === 0 && (
            <View style={styles.emptyState}>
              <Brain size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>AI-Powered Currency Search</Text>
              <Text style={styles.emptyDescription}>
                Search for any currency pair or cryptocurrency to get comprehensive AI analysis including:
              </Text>
              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• Real-time market sentiment analysis</Text>
                <Text style={styles.featureItem}>• Technical and fundamental insights</Text>
                <Text style={styles.featureItem}>• Price targets and risk assessment</Text>
                <Text style={styles.featureItem}>• News impact and market events</Text>
              </View>
            </View>
          )}

          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>Type at least 2 characters to search...</Text>
            </View>
          )}

          {searchResults.length === 0 && searchQuery.length >= 2 && !loading && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found for &quot;{searchQuery}&quot;</Text>
              <Text style={styles.noResultsHint}>Try searching for popular pairs like EUR, BTC, or USDJPY</Text>
            </View>
          )}

          {searchResults.map(renderCurrencyCard)}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  featureList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  hintContainer: {
    padding: 16,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  noResultsHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  currencyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  aiSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  sentimentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recommendation: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 16,
  },
  targetsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  targetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  targetLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  targetValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  bottomPadding: {
    height: 20,
  },
});