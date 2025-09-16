import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react-native';
import { useRealForexData } from '@/hooks/useRealForexData';
import { useRealCryptoData } from '@/hooks/useRealCryptoData';

export default function MarketsScreen() {
  const insets = useSafeAreaInsets();
  const { forexData, loading: forexLoading } = useRealForexData();
  const { cryptoData, loading: cryptoLoading } = useRealCryptoData();

  const topGainers = [...forexData, ...cryptoData]
    .filter(item => item.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = [...forexData, ...cryptoData]
    .filter(item => item.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Market Analysis</Text>
          <Text style={styles.subtitle}>Top Performers & Market Trends</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp color="#10B981" size={20} />
              <Text style={styles.sectionTitle}>Top Gainers</Text>
            </View>
            
            {topGainers.map((item, index) => (
              <View key={item.symbol} style={styles.marketItem}>
                <View style={styles.marketLeft}>
                  <Text style={styles.marketSymbol}>{item.symbol}</Text>
                  <Text style={styles.marketName}>{item.name}</Text>
                </View>
                <View style={styles.marketRight}>
                  <Text style={styles.marketPrice}>
                    ${item.price.toFixed(item.price < 1 ? 6 : 2)}
                  </Text>
                  <Text style={[styles.marketChange, { color: '#10B981' }]}>
                    +{item.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 color="#EF4444" size={20} />
              <Text style={styles.sectionTitle}>Top Losers</Text>
            </View>
            
            {topLosers.map((item, index) => (
              <View key={item.symbol} style={styles.marketItem}>
                <View style={styles.marketLeft}>
                  <Text style={styles.marketSymbol}>{item.symbol}</Text>
                  <Text style={styles.marketName}>{item.name}</Text>
                </View>
                <View style={styles.marketRight}>
                  <Text style={styles.marketPrice}>
                    ${item.price.toFixed(item.price < 1 ? 6 : 2)}
                  </Text>
                  <Text style={[styles.marketChange, { color: '#EF4444' }]}>
                    {item.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign color="#F59E0B" size={20} />
              <Text style={styles.sectionTitle}>Market Summary</Text>
            </View>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Pairs</Text>
                <Text style={styles.summaryValue}>{forexData.length + cryptoData.length}</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Forex Pairs</Text>
                <Text style={styles.summaryValue}>{forexData.length}</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Crypto Pairs</Text>
                <Text style={styles.summaryValue}>{cryptoData.length}</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Status</Text>
                <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                  {forexLoading || cryptoLoading ? 'Loading' : 'Live'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
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
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  marketItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  marketLeft: {
    flex: 1,
  },
  marketSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  marketName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  marketRight: {
    alignItems: 'flex-end',
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  marketChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});