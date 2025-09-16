import { useState, useEffect } from 'react';
import {
  TechnicalIndicator,
  MarketSentiment,
  EconomicEvent,
  NewsItem,
  CurrencyStrength,
  CorrelationData,
  MarketSession,
} from '@/types/forex';

export function useMarketAnalysis() {
  const [technicalIndicators, setTechnicalIndicators] = useState<Record<string, TechnicalIndicator[]>>({});
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment[]>([]);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currencyStrength, setCurrencyStrength] = useState<CurrencyStrength[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [marketSessions, setMarketSessions] = useState<MarketSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate RSI
  const calculateRSI = (prices: number[], period: number = 14): number => {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // Calculate MACD
  const calculateMACD = (prices: number[]): { macd: number; signal: number; histogram: number } => {
    const ema12 = prices.slice(-12).reduce((a, b) => a + b, 0) / 12;
    const ema26 = prices.slice(-26).reduce((a, b) => a + b, 0) / 26;
    const macd = ema12 - ema26;
    const signal = macd * 0.8; // Simplified signal line
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  };

  // Calculate Bollinger Bands
  const calculateBollingerBands = (prices: number[], period: number = 20): { upper: number; middle: number; lower: number } => {
    const sma = prices.slice(-period).reduce((a, b) => a + b, 0) / period;
    const variance = prices.slice(-period).reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2)
    };
  };

  useEffect(() => {
    const generateMarketData = () => {
      // Generate realistic price history for calculations
      const generatePriceHistory = (basePrice: number, volatility: number = 0.01): number[] => {
        const prices = [basePrice];
        for (let i = 1; i < 50; i++) {
          const change = (Math.random() - 0.5) * volatility * basePrice;
          prices.push(prices[i - 1] + change);
        }
        return prices;
      };

      // Technical Indicators for major pairs
      const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'];
      const basePrices = { EURUSD: 1.0847, GBPUSD: 1.2634, USDJPY: 149.85, USDCHF: 0.8756, AUDUSD: 0.6543, USDCAD: 1.3456 };
      
      const indicators: Record<string, TechnicalIndicator[]> = {};
      
      pairs.forEach(pair => {
        const prices = generatePriceHistory(basePrices[pair as keyof typeof basePrices]);
        const currentPrice = prices[prices.length - 1];
        const rsi = calculateRSI(prices);
        const macd = calculateMACD(prices);
        const bb = calculateBollingerBands(prices);
        
        indicators[pair] = [
          {
            name: 'RSI (14)',
            value: rsi,
            signal: rsi > 70 ? 'bearish' : rsi < 30 ? 'bullish' : 'neutral',
            strength: Math.abs(rsi - 50) * 2,
            description: rsi > 70 ? 'Overbought condition' : rsi < 30 ? 'Oversold condition' : 'Neutral momentum'
          },
          {
            name: 'MACD',
            value: macd.macd,
            signal: macd.histogram > 0 ? 'bullish' : 'bearish',
            strength: Math.abs(macd.histogram) * 100,
            description: macd.histogram > 0 ? 'Bullish momentum' : 'Bearish momentum'
          },
          {
            name: 'Bollinger Bands',
            value: ((currentPrice - bb.lower) / (bb.upper - bb.lower)) * 100,
            signal: currentPrice > bb.upper ? 'bearish' : currentPrice < bb.lower ? 'bullish' : 'neutral',
            strength: currentPrice > bb.upper || currentPrice < bb.lower ? 80 : 30,
            description: currentPrice > bb.upper ? 'Price above upper band' : currentPrice < bb.lower ? 'Price below lower band' : 'Price within bands'
          }
        ];
      });

      // Market Sentiment
      const sentiment: MarketSentiment[] = pairs.map(pair => {
        const bullish = 30 + Math.random() * 40;
        const bearish = 30 + Math.random() * 40;
        const neutral = 100 - bullish - bearish;
        
        return {
          symbol: pair,
          bullish,
          bearish,
          neutral,
          overall: bullish > bearish ? 'bullish' : bearish > bullish ? 'bearish' : 'neutral',
          confidence: Math.max(bullish, bearish, neutral)
        };
      });

      // Economic Events
      const events: EconomicEvent[] = [
        {
          id: '1',
          title: 'Non-Farm Payrolls',
          country: 'United States',
          currency: 'USD',
          impact: 'high',
          actual: 187000,
          forecast: 200000,
          previous: 209000,
          time: new Date(Date.now() + 2 * 60 * 60 * 1000),
          description: 'Monthly change in the number of employed people'
        },
        {
          id: '2',
          title: 'ECB Interest Rate Decision',
          country: 'European Union',
          currency: 'EUR',
          impact: 'high',
          forecast: 4.50,
          previous: 4.50,
          time: new Date(Date.now() + 4 * 60 * 60 * 1000),
          description: 'European Central Bank monetary policy decision'
        },
        {
          id: '3',
          title: 'GDP Growth Rate',
          country: 'United Kingdom',
          currency: 'GBP',
          impact: 'medium',
          actual: 0.2,
          forecast: 0.3,
          previous: 0.1,
          time: new Date(Date.now() + 6 * 60 * 60 * 1000),
          description: 'Quarterly GDP growth rate'
        }
      ];

      // News Items
      const newsItems: NewsItem[] = [
        {
          id: '1',
          title: 'Fed Officials Signal Potential Rate Cuts',
          summary: 'Federal Reserve officials hint at possible interest rate reductions in upcoming meetings due to cooling inflation.',
          impact: 'high',
          affectedPairs: ['EURUSD', 'GBPUSD', 'USDJPY'],
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          source: 'Reuters'
        },
        {
          id: '2',
          title: 'ECB Maintains Hawkish Stance',
          summary: 'European Central Bank maintains aggressive monetary policy to combat persistent inflation.',
          impact: 'medium',
          affectedPairs: ['EURUSD', 'EURGBP'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          source: 'Bloomberg'
        },
        {
          id: '3',
          title: 'Bank of Japan Intervention Concerns',
          summary: 'Market participants watch for potential BoJ intervention as USD/JPY approaches key resistance levels.',
          impact: 'high',
          affectedPairs: ['USDJPY', 'EURJPY'],
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          source: 'Financial Times'
        }
      ];

      // Currency Strength
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'];
      const strength: CurrencyStrength[] = currencies.map(currency => {
        const strengthValue = (Math.random() - 0.5) * 200; // -100 to 100
        const change24h = (Math.random() - 0.5) * 10;
        
        return {
          currency,
          strength: strengthValue,
          change24h,
          trend: change24h > 1 ? 'up' : change24h < -1 ? 'down' : 'sideways'
        };
      });

      // Correlation Data
      const correlationPairs = [
        { pair1: 'EURUSD', pair2: 'GBPUSD' },
        { pair1: 'EURUSD', pair2: 'USDJPY' },
        { pair1: 'GBPUSD', pair2: 'USDJPY' },
        { pair1: 'AUDUSD', pair2: 'NZDUSD' },
        { pair1: 'USDCHF', pair2: 'EURUSD' }
      ];
      
      const correlationData: CorrelationData[] = correlationPairs.map(({ pair1, pair2 }) => {
        const correlation = (Math.random() - 0.5) * 2; // -1 to 1
        const absCorr = Math.abs(correlation);
        
        return {
          pair1,
          pair2,
          correlation,
          strength: absCorr > 0.7 ? 'strong' : absCorr > 0.3 ? 'moderate' : 'weak'
        };
      });

      // Market Sessions
      const now = new Date();
      const currentHour = now.getUTCHours();
      
      const sessions: MarketSession[] = [
        {
          name: 'Sydney',
          isActive: currentHour >= 21 || currentHour < 6,
          openTime: '21:00',
          closeTime: '06:00',
          timezone: 'UTC',
          volume: 85000000 + Math.random() * 20000000
        },
        {
          name: 'Tokyo',
          isActive: currentHour >= 0 && currentHour < 9,
          openTime: '00:00',
          closeTime: '09:00',
          timezone: 'UTC',
          volume: 142000000 + Math.random() * 30000000
        },
        {
          name: 'London',
          isActive: currentHour >= 8 && currentHour < 17,
          openTime: '08:00',
          closeTime: '17:00',
          timezone: 'UTC',
          volume: 234000000 + Math.random() * 50000000
        },
        {
          name: 'New York',
          isActive: currentHour >= 13 && currentHour < 22,
          openTime: '13:00',
          closeTime: '22:00',
          timezone: 'UTC',
          volume: 198000000 + Math.random() * 40000000
        }
      ];

      setTechnicalIndicators(indicators);
      setMarketSentiment(sentiment);
      setEconomicEvents(events);
      setNews(newsItems);
      setCurrencyStrength(strength);
      setCorrelations(correlationData);
      setMarketSessions(sessions);
      setIsLoading(false);
    };

    generateMarketData();
    const interval = setInterval(generateMarketData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    technicalIndicators,
    marketSentiment,
    economicEvents,
    news,
    currencyStrength,
    correlations,
    marketSessions,
    isLoading,
  };
}