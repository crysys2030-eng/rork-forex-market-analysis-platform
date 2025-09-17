import { useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useUnifiedMarketData, UnifiedMarketPair, MarketDataSources } from '@/hooks/useUnifiedMarketData';

interface RealTimeDataContextType {
  // All market data
  allMarketData: UnifiedMarketPair[];
  forexPairs: UnifiedMarketPair[];
  cryptoPairs: UnifiedMarketPair[];
  majorPairs: UnifiedMarketPair[];
  
  // Data sources status
  dataSources: MarketDataSources;
  
  // State
  loading: boolean;
  error: string | null;
  lastUpdate: number;
  
  // Methods
  refreshData: () => Promise<void>;
  getPairBySymbol: (symbol: string) => UnifiedMarketPair | undefined;
  getAIAnalysis: (symbol: string) => Promise<any>;
  
  // Statistics
  totalPairs: number;
  livePairs: number;
  realDataPairs: number;
  
  // Real-time status
  isRealTimeActive: boolean;
  dataQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  connectionStatus: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'ERROR';
}

export const [RealTimeDataProvider, useRealTimeData] = createContextHook(() => {
  const marketData = useUnifiedMarketData();
  
  // Calculate data quality based on real vs simulated data
  const dataQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = useMemo(() => {
    if (marketData.totalPairs === 0) return 'POOR';
    
    const realDataPercentage = (marketData.realDataPairs / marketData.totalPairs) * 100;
    const liveDataPercentage = (marketData.livePairs / marketData.totalPairs) * 100;
    
    if (realDataPercentage >= 80 && liveDataPercentage >= 80) return 'EXCELLENT';
    if (realDataPercentage >= 60 && liveDataPercentage >= 60) return 'GOOD';
    if (realDataPercentage >= 40 || liveDataPercentage >= 40) return 'FAIR';
    return 'POOR';
  }, [marketData.totalPairs, marketData.realDataPairs, marketData.livePairs]);
  
  // Determine connection status
  const connectionStatus: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'ERROR' = useMemo(() => {
    if (marketData.error) return 'ERROR';
    if (marketData.loading) return 'CONNECTING';
    if (marketData.totalPairs > 0) return 'CONNECTED';
    return 'DISCONNECTED';
  }, [marketData.error, marketData.loading, marketData.totalPairs]);
  
  const isRealTimeActive = useMemo(() => {
    return marketData.livePairs > 0 && !marketData.loading && !marketData.error;
  }, [marketData.livePairs, marketData.loading, marketData.error]);

  const contextValue: RealTimeDataContextType = {
    ...marketData,
    isRealTimeActive,
    dataQuality,
    connectionStatus
  };

  return contextValue;
});

// Convenience hooks for specific data types
export function useForexData() {
  const { forexPairs, loading, error, refreshData } = useRealTimeData();
  return { forexData: forexPairs, loading, error, refetch: refreshData };
}

export function useCryptoData() {
  const { cryptoPairs, loading, error, refreshData } = useRealTimeData();
  return { cryptoData: cryptoPairs, loading, error, refetch: refreshData };
}

export function usePairData(symbol: string) {
  const { getPairBySymbol, getAIAnalysis, refreshData } = useRealTimeData();
  
  // Validate symbol input
  if (!symbol || typeof symbol !== 'string' || !symbol.trim() || symbol.length > 20) {
    return {
      pair: undefined,
      getAIAnalysis: () => Promise.resolve(null),
      refreshPair: refreshData,
      isAvailable: false
    };
  }
  
  const sanitizedSymbol = symbol.trim().toUpperCase();
  const pair = getPairBySymbol(sanitizedSymbol);
  
  return {
    pair,
    getAIAnalysis: () => getAIAnalysis(sanitizedSymbol),
    refreshPair: refreshData,
    isAvailable: !!pair
  };
}