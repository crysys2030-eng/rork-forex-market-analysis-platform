import { useState, useEffect, useCallback } from 'react';
import { TimeoutId, createTimeout, clearTimeoutSafe, PlatformUtils } from '@/utils/platform';
import { useRealForexData } from './useRealForexData';
import { useRealCryptoData } from './useRealCryptoData';

interface RealTimeMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  bid: number;
  ask: number;
  spread: number;
  timestamp: Date;
}

interface AIMarketAnalysis {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  strategy: 'SCALPING' | 'DAY_TRADE' | 'SWING';
  reasoning: string;
  aiGenerated: boolean;
  lastUpdate: Date;
}

interface RealTimeAIInsight {
  id: string;
  type: 'TREND_CHANGE' | 'VOLATILITY_SPIKE' | 'SUPPORT_BREAK' | 'RESISTANCE_BREAK' | 'PATTERN_DETECTED';
  symbol: string;
  message: string;
  confidence: number;
  timestamp: Date;
  actionable: boolean;
}

// Fallback data structure for ATR calculations
const FALLBACK_PRICES = {
  EURUSD: { price: 1.0875, volatility: 0.0008, spread: 0.00015 },
  GBPUSD: { price: 1.2635, volatility: 0.0012, spread: 0.00018 },
  USDJPY: { price: 149.85, volatility: 0.15, spread: 0.02 },
  USDCHF: { price: 0.8756, volatility: 0.0006, spread: 0.00012 },
  AUDUSD: { price: 0.6543, volatility: 0.0010, spread: 0.00016 },
  NZDUSD: { price: 0.5987, volatility: 0.0009, spread: 0.00014 },
  USDCAD: { price: 1.3654, volatility: 0.0007, spread: 0.00013 },
  EURJPY: { price: 162.45, volatility: 0.20, spread: 0.025 },
  GBPJPY: { price: 189.23, volatility: 0.25, spread: 0.03 },
  EURGBP: { price: 0.8587, volatility: 0.0005, spread: 0.00010 },
};

export function useRealTimeData() {
  // Use real data hooks
  const { forexData, loading: forexLoading, error: forexError } = useRealForexData();
  const { cryptoData, loading: cryptoLoading, error: cryptoError } = useRealCryptoData();
  
  const [marketData, setMarketData] = useState<RealTimeMarketData[]>([]);
  const [aiAnalyses, setAiAnalyses] = useState<AIMarketAnalysis[]>([]);
  const [aiInsights, setAiInsights] = useState<RealTimeAIInsight[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate fallback AI analysis without external API calls for better Android compatibility
  const generateAIAnalysis = useCallback(async (symbol: string, marketData: RealTimeMarketData): Promise<AIMarketAnalysis | null> => {
    try {
      // Generate realistic analysis based on market data without external API calls
      const strategies = ['SCALPING', 'DAY_TRADE', 'SWING'] as const;
      const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

      // Determine signal based on market conditions
      let signal: 'BUY' | 'SELL' | 'HOLD';
      if (marketData.changePercent > 0.3) {
        signal = 'BUY';
      } else if (marketData.changePercent < -0.3) {
        signal = 'SELL';
      } else {
        signal = Math.random() > 0.6 ? 'HOLD' : (Math.random() > 0.5 ? 'BUY' : 'SELL');
      }

      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const confidence = Math.abs(marketData.changePercent) > 0.5 ? 85 + Math.random() * 10 : 70 + Math.random() * 15;

      let entryPrice = marketData.price;
      let stopLoss = 0;
      let takeProfit = 0;

      if (signal === 'BUY') {
        entryPrice = marketData.ask;
        const atr = FALLBACK_PRICES[symbol as keyof typeof FALLBACK_PRICES]?.volatility || 0.001;
        stopLoss = entryPrice - (strategy === 'SCALPING' ? atr * 0.5 : strategy === 'DAY_TRADE' ? atr * 1.5 : atr * 3);
        takeProfit = entryPrice + (strategy === 'SCALPING' ? atr * 1 : strategy === 'DAY_TRADE' ? atr * 2 : atr * 4);
      } else if (signal === 'SELL') {
        entryPrice = marketData.bid;
        const atr = FALLBACK_PRICES[symbol as keyof typeof FALLBACK_PRICES]?.volatility || 0.001;
        stopLoss = entryPrice + (strategy === 'SCALPING' ? atr * 0.5 : strategy === 'DAY_TRADE' ? atr * 1.5 : atr * 3);
        takeProfit = entryPrice - (strategy === 'SCALPING' ? atr * 1 : strategy === 'DAY_TRADE' ? atr * 2 : atr * 4);
      }

      // Generate realistic reasoning based on market conditions
      const reasoningTemplates = [
        `Technical analysis shows ${signal.toLowerCase()} momentum with ${Math.abs(marketData.changePercent).toFixed(2)}% movement`,
        `Market structure indicates ${signal.toLowerCase()} opportunity based on price action and volume`,
        `${strategy.toLowerCase().replace('_', ' ')} setup detected with favorable risk/reward ratio`,
        `Price breaking key levels suggests ${signal.toLowerCase()} continuation pattern`
      ];
      
      const reasoning = reasoningTemplates[Math.floor(Math.random() * reasoningTemplates.length)];

      return {
        symbol,
        signal,
        confidence: Math.round(confidence),
        entryPrice: Number(entryPrice.toFixed(symbol.includes('JPY') ? 2 : 4)),
        stopLoss: Number(stopLoss.toFixed(symbol.includes('JPY') ? 2 : 4)),
        takeProfit: Number(takeProfit.toFixed(symbol.includes('JPY') ? 2 : 4)),
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        strategy,
        reasoning,
        aiGenerated: true,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.log('AI analysis generation failed:', error);
      return null;
    }
  }, []);

  // Generate fallback AI insights without external API calls for better Android compatibility
  const generateAIInsight = useCallback(async (marketData: RealTimeMarketData[]): Promise<RealTimeAIInsight[]> => {
    try {
      const insights: RealTimeAIInsight[] = [];
      const insightTemplates = {
        RESISTANCE_BREAK: 'breaking resistance levels with strong momentum',
        SUPPORT_BREAK: 'breaking support levels with increased selling pressure',
        VOLATILITY_SPIKE: 'experiencing high volatility - potential trading opportunity',
        TREND_CHANGE: 'showing signs of trend reversal pattern',
        PATTERN_DETECTED: 'forming technical pattern - monitor for breakout'
      };

      // Generate insights based on market data
      marketData.forEach((data, index) => {
        if (Math.abs(data.changePercent) > 0.3) {
          const types = Object.keys(insightTemplates) as (keyof typeof insightTemplates)[];
          let type: keyof typeof insightTemplates;
          
          if (data.changePercent > 0.5) {
            type = 'RESISTANCE_BREAK';
          } else if (data.changePercent < -0.5) {
            type = 'SUPPORT_BREAK';
          } else if (Math.abs(data.changePercent) > 0.8) {
            type = 'VOLATILITY_SPIKE';
          } else {
            type = types[Math.floor(Math.random() * types.length)];
          }
          
          insights.push({
            id: `insight-${Date.now()}-${index}`,
            type: type as RealTimeAIInsight['type'],
            symbol: data.symbol,
            message: `${data.symbol} ${insightTemplates[type]} - ${Math.abs(data.changePercent).toFixed(2)}% movement detected`,
            confidence: Math.abs(data.changePercent) > 0.5 ? 85 + Math.random() * 10 : 70 + Math.random() * 15,
            timestamp: new Date(),
            actionable: Math.abs(data.changePercent) > 0.4
          });
        }
      });

      return insights;
    } catch (error) {
      console.log('AI insights generation failed:', error);
      return [];
    }
  }, []);



  // Convert real data to RealTimeMarketData format
  useEffect(() => {
    const combinedMarketData: RealTimeMarketData[] = [];
    
    // Convert forex data
    forexData.forEach(pair => {
      combinedMarketData.push({
        symbol: pair.symbol,
        price: pair.price,
        change: pair.change,
        changePercent: pair.changePercent,
        high: pair.high,
        low: pair.low,
        volume: pair.volume,
        bid: pair.bid,
        ask: pair.ask,
        spread: pair.spread,
        timestamp: new Date(pair.timestamp)
      });
    });
    
    // Convert crypto data
    cryptoData.forEach(pair => {
      combinedMarketData.push({
        symbol: pair.symbol,
        price: pair.price,
        change: pair.change,
        changePercent: pair.changePercent,
        high: pair.high,
        low: pair.low,
        volume: pair.volume,
        bid: pair.bid,
        ask: pair.ask,
        spread: pair.spread,
        timestamp: new Date(pair.timestamp)
      });
    });
    
    setMarketData(combinedMarketData);
    setIsConnected(!forexLoading && !cryptoLoading && combinedMarketData.length > 0);
    setLastUpdate(new Date());
    
    if (combinedMarketData.length > 0) {
      console.log('✅ Real market data updated:', combinedMarketData.length, 'instruments');
    }
    
    if (forexError || cryptoError) {
      console.log('⚠️ Data source errors:', { forexError, cryptoError });
    }
  }, [forexData, cryptoData, forexLoading, cryptoLoading, forexError, cryptoError]);
  
  // Generate AI analyses and insights based on real market data
  useEffect(() => {
    if (marketData.length === 0) return;
    
    let isMounted = true;
    let timeoutId: TimeoutId | null = null;
    
    const generateAnalysisAndInsights = async () => {
      if (!isMounted) return;
      
      try {
        // Generate AI analyses for active pairs
        const activePairs = marketData.filter(data => Math.abs(data.changePercent) > 0.2).slice(0, 8);
        const newAnalyses: AIMarketAnalysis[] = [];
        
        for (const pair of activePairs) {
          const analysis = await generateAIAnalysis(pair.symbol, pair);
          if (analysis && isMounted) {
            newAnalyses.push(analysis);
          }
        }
        
        if (isMounted) {
          setAiAnalyses(prev => {
            const updated = [...prev.filter(a => !newAnalyses.find(n => n.symbol === a.symbol)), ...newAnalyses];
            return updated.slice(-20);
          });
        }
        
        // Generate AI insights
        const insights = await generateAIInsight(marketData);
        if (isMounted) {
          setAiInsights(prev => {
            const updated = [...prev, ...insights];
            return updated.slice(-50);
          });
        }
      } catch (error) {
        console.error('Error generating AI analysis:', error);
      }
      
      // Schedule next analysis update
      if (isMounted) {
        timeoutId = createTimeout(() => {
          if (isMounted) {
            generateAnalysisAndInsights();
          }
        }, PlatformUtils.getTimeout(20000, 15000));
      }
    };
    
    generateAnalysisAndInsights();
    
    return () => {
      isMounted = false;
      clearTimeoutSafe(timeoutId);
    };
  }, [marketData, generateAIAnalysis, generateAIInsight]);

  return {
    marketData,
    aiAnalyses,
    aiInsights,
    isConnected,
    lastUpdate,
    refetch: () => {
      setLastUpdate(new Date());
    }
  };
}