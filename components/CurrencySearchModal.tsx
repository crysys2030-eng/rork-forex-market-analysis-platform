import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react-native';
import { useCurrencySearch, CurrencySearchResult } from '@/hooks/useCurrencySearch';
import { CurrencySearchResultCard } from './CurrencySearchResultCard';

interface CurrencySearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CurrencySearchModal({ visible, onClose }: CurrencySearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<CurrencySearchResult | null>(null);
  const {
    searchCurrency,
    searchResults,
    loading,
    error,
    searchHistory,
    getPopularSearches,
    clearSearchHistory
  } = useCurrencySearch();

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      await searchCurrency(query.trim());
    }
  }, [searchCurrency]);

  const handleQuickSearch = useCallback((query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

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
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pesquisar Moedas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Digite o nome ou símbolo da moeda..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch(searchQuery)}
              style={styles.searchButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>Pesquisar</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resultados da Pesquisa</Text>
              {searchResults.map((result, index) => (
                <CurrencySearchResultCard
                  key={`${result.symbol}-${index}`}
                  result={result}
                  onPress={() => setSelectedResult(result)}
                />
              ))}
            </View>
          )}

          {/* Popular Searches */}
          {searchResults.length === 0 && !loading && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={18} color="#10B981" />
                <Text style={styles.sectionTitle}>Pesquisas Populares</Text>
              </View>
              <View style={styles.tagsContainer}>
                {getPopularSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleQuickSearch(search)}
                  >
                    <Text style={styles.tagText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && searchResults.length === 0 && !loading && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={18} color="#6B7280" />
                <Text style={styles.sectionTitle}>Histórico de Pesquisa</Text>
                <TouchableOpacity onPress={clearSearchHistory} style={styles.clearHistoryButton}>
                  <Text style={styles.clearHistoryText}>Limpar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.historyContainer}>
                {searchHistory.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleQuickSearch(search)}
                  >
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.historyText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Pesquisando...</Text>
            </View>
          )}

          {/* Empty State */}
          {searchQuery.length > 0 && searchResults.length === 0 && !loading && !error && (
            <View style={styles.emptyContainer}>
              <Search size={48} color="#6B7280" />
              <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
              <Text style={styles.emptyText}>
                Tente pesquisar por outro termo ou símbolo
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Detailed Result Modal */}
        {selectedResult && (
          <Modal
            visible={!!selectedResult}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setSelectedResult(null)}
          >
            <View style={styles.detailContainer}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>
                  {selectedResult.name} ({selectedResult.symbol})
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedResult(null)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.detailContent}>
                <CurrencySearchResultCard
                  result={selectedResult}
                  expanded={true}
                  onPress={() => {}}
                />
              </ScrollView>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  clearHistoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearHistoryText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tagText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  historyContainer: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    gap: 12,
  },
  historyText: {
    color: '#D1D5DB',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    flex: 1,
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});