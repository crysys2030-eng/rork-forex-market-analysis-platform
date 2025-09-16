import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Bitcoin } from 'lucide-react-native';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MarketSection } from '@/components/MarketSection';
import { useRealForexData } from '@/hooks/useRealForexData';
import { useRealCryptoData } from '@/hooks/useRealCryptoData';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { forexData, loading: forexLoading, refetch: refetchForex } = useRealForexData();
  const { cryptoData, loading: cryptoLoading, refetch: refetchCrypto } = useRealCryptoData();
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  
  const totalPairs = forexData.length + cryptoData.length;
  const activeMarkets = totalPairs;
  const lastUpdate = lastUpdateTime.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  useEffect(() => {
    // Update the last update time every second
    const interval = setInterval(() => {
      setLastUpdateTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#111827', '#0F172A']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        <DashboardHeader 
          totalPairs={totalPairs}
          activeMarkets={activeMarkets}
          lastUpdate={lastUpdate}
        />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <MarketSection
            title="Forex Markets"
            data={forexData}
            loading={forexLoading}
            onRefresh={refetchForex}
            icon={<DollarSign color="#00D4AA" size={20} />}
          />
          
          <MarketSection
            title="Crypto Markets"
            data={cryptoData}
            loading={cryptoLoading}
            onRefresh={refetchCrypto}
            icon={<Bitcoin color="#F59E0B" size={20} />}
          />
          
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
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 20,
  },
});