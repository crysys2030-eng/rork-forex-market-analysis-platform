import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Search, TrendingUp } from 'lucide-react-native';
import { CurrencySearchModal } from './CurrencySearchModal';

export function CurrencySearchButton() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setShowSearchModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.searchContent}>
          <View style={styles.searchIconContainer}>
            <Search size={20} color="#10B981" />
          </View>
          <View style={styles.searchTextContainer}>
            <Text style={styles.searchTitle}>Pesquisar Moedas</Text>
            <Text style={styles.searchSubtitle}>
              Encontre informações detalhadas sobre qualquer ativo
            </Text>
          </View>
          <View style={styles.trendingIcon}>
            <TrendingUp size={16} color="#10B981" />
          </View>
        </View>
      </TouchableOpacity>

      <CurrencySearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchTextContainer: {
    flex: 1,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  searchSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  trendingIcon: {
    opacity: 0.7,
  },
});