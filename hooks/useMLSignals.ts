import { useState, useEffect, useCallback } from 'react';
import { MLSignal } from '@/types/forex';

interface SignalFilters {
  confidence: number;
  signalType: string;
  timeframe: string;
}

export function useMLSignals(filters: SignalFilters) {
  const [signals, setSignals] = useState<MLSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSignals = useCallback(() => {
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'];
    const timeframes = ['M15', 'H1', 'H4', 'D1'];
    const types: ('buy' | 'sell')[] = ['buy', 'sell'];
    const statuses: ('active' | 'completed')[] = ['active', 'completed'];
    const results: ('profit' | 'loss')[] = ['profit', 'loss'];

    const generatedSignals: MLSignal[] = Array.from({ length: 25 }, (_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      const basePrice = symbol === 'USDJPY' ? 149.5 : 1.2;
      const entryPrice = basePrice + (Math.random() - 0.5) * 0.1;
      
      return {
        id: `signal-${i}`,
        symbol,
        type,
        confidence,
        entryPrice,
        targetPrice: type === 'buy' ? entryPrice * 1.02 : entryPrice * 0.98,
        stopLoss: type === 'buy' ? entryPrice * 0.99 : entryPrice * 1.01,
        timeframe,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        status,
        result: status === 'completed' ? results[Math.floor(Math.random() * results.length)] : undefined,
        indicators: [
          'RSI Analysis',
          'MACD Signal',
          'Support/Resistance',
          'ML Pattern Recognition',
        ].slice(0, Math.floor(Math.random() * 3) + 2),
      };
    });

    // Apply filters
    let filteredSignals = generatedSignals.filter(signal => {
      if (signal.confidence < filters.confidence) return false;
      if (filters.signalType !== 'all' && signal.type !== filters.signalType) return false;
      if (filters.timeframe !== 'all' && signal.timeframe !== filters.timeframe) return false;
      return true;
    });

    // Sort by timestamp (newest first)
    filteredSignals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setSignals(filteredSignals);
  }, [filters.confidence, filters.signalType, filters.timeframe]);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      generateSignals();
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateSignals();
  }, [generateSignals]);

  return {
    signals,
    isLoading,
    refetch,
  };
}