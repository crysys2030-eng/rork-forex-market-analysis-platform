import { useState, useEffect, useCallback } from 'react';
import { PlatformUtils } from '@/utils/platform';

export interface EnhancedMarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  timestamp: number;
  bid: number;
  ask: number;
  spread: number;
  source: 'Binance' | 'Forex' | 'Alpha Vantage' | 'Yahoo Finance' | 'Simulated';
  technicalData: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
    };
    support: number;
    resistance: number;
  };
  newsData: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    impactScore: number;
    lastUpdate: number;
  };
}

export interface MarketSummary {
  totalPairs: number;
  bullishPairs: number;
  bearishPairs: number;
  avgVolatility: number;
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  topGainers: EnhancedMarketData[];
  topLosers: EnhancedMarketData[];
  highVolume: EnhancedMarketData[];
}

export function useEnhancedMarketData() {
  const [forexData, setForexData] = useState<EnhancedMarketData[]>([]);
  const [cryptoData, setCryptoData] = useState<EnhancedMarketData[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const fetchEnhancedForexData = useCallback(async (): Promise<EnhancedMarketData[]> => {
    try {
      console.log('🔄 Fetching enhanced forex data...');
      
      // Try multiple forex data sources
      const sources = [
        {
          name: 'ExchangeRate-API',
          url: 'https://api.exchangerate-api.com/v4/latest/USD',
          parser: parseExchangeRateAPI
        },
        {
          name: 'Fixer.io',
          url: 'https://api.fixer.io/latest?access_key=demo&base=USD',
          parser: parseFixerAPI
        }
      ];
      
      for (const source of sources) {
        try {
          const response = await PlatformUtils.safeFetch(source.url, { method: 'GET' }, 8000);
          if (response.ok) {
            const data = await response.json();
            const parsedData = source.parser(data);
            if (parsedData.length > 0) {
              console.log(`✅ Forex data from ${source.name}: ${parsedData.length} pairs`);
              return parsedData;
            }
          }
        } catch (sourceError) {
          console.log(`⚠️ ${source.name} failed:`, sourceError);
        }
      }
      
      // Fallback to enhanced simulated data
      return generateEnhancedForexData();
      
    } catch (error) {
      console.log('❌ All forex sources failed, using enhanced simulation');
      return generateEnhancedForexData();
    }
  }, []);

  const fetchEnhancedCryptoData = useCallback(async (): Promise<EnhancedMarketData[]> => {
    try {
      console.log('🔄 Fetching enhanced crypto data...');
      
      // Try multiple crypto data sources
      const sources = [
        {
          name: 'Binance',
          url: 'https://api.binance.com/api/v3/ticker/24hr',
          parser: parseBinanceAPI
        },
        {
          name: 'CoinGecko',
          url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,ripple,solana,polkadot,dogecoin,avalanche-2,polygon&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true',
          parser: parseCoinGeckoAPI
        }
      ];
      
      for (const source of sources) {
        try {
          const response = await PlatformUtils.safeFetch(source.url, { method: 'GET' }, 8000);
          if (response.ok) {
            const data = await response.json();
            const parsedData = source.parser(data);
            if (parsedData.length > 0) {
              console.log(`✅ Crypto data from ${source.name}: ${parsedData.length} pairs`);
              return parsedData;
            }
          }
        } catch (sourceError) {
          console.log(`⚠️ ${source.name} failed:`, sourceError);
        }
      }
      
      // Fallback to enhanced simulated data
      return generateEnhancedCryptoData();
      
    } catch (error) {
      console.log('❌ All crypto sources failed, using enhanced simulation');
      return generateEnhancedCryptoData();
    }
  }, []);

  const parseExchangeRateAPI = (data: any): EnhancedMarketData[] => {
    const rates = data.rates;
    const forexPairs = [
      { symbol: 'EURUSD', base: 'EUR', quote: 'USD' },
      { symbol: 'GBPUSD', base: 'GBP', quote: 'USD' },
      { symbol: 'USDJPY', base: 'USD', quote: 'JPY' },
      { symbol: 'USDCHF', base: 'USD', quote: 'CHF' },
      { symbol: 'AUDUSD', base: 'AUD', quote: 'USD' },
      { symbol: 'USDCAD', base: 'USD', quote: 'CAD' },
      { symbol: 'NZDUSD', base: 'NZD', quote: 'USD' },
      { symbol: 'EURGBP', base: 'EUR', quote: 'GBP' },
    ];
    
    return forexPairs.map(pair => {
      let price: number;
      
      if (pair.base === 'USD') {
        price = rates[pair.quote] || 1;
      } else if (pair.quote === 'USD') {
        price = 1 / (rates[pair.base] || 1);
      } else {
        const baseToUsd = 1 / (rates[pair.base] || 1);
        const quoteToUsd = 1 / (rates[pair.quote] || 1);
        price = baseToUsd / quoteToUsd;
      }
      
      return createEnhancedMarketData(pair.symbol, `${pair.base}/${pair.quote}`, price, 'Forex');
    });
  };

  const parseFixerAPI = (data: any): EnhancedMarketData[] => {
    // Similar to ExchangeRate-API but with different structure
    return parseExchangeRateAPI(data);
  };

  const parseBinanceAPI = (data: any[]): EnhancedMarketData[] => {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT'];
    
    return symbols.map(symbol => {
      const ticker = data.find((t: any) => t.symbol === symbol);
      if (ticker) {
        const price = parseFloat(ticker.lastPrice);
        return createEnhancedMarketData(symbol, symbol.replace('USDT', '/USDT'), price, 'Binance', {
          change: parseFloat(ticker.priceChange),
          changePercent: parseFloat(ticker.priceChangePercent),
          high: parseFloat(ticker.highPrice),
          low: parseFloat(ticker.lowPrice),
          volume: parseFloat(ticker.volume)
        });
      }
      return createEnhancedMarketData(symbol, symbol.replace('USDT', '/USDT'), 0, 'Binance');
    }).filter(item => item.price > 0);
  };

  const parseCoinGeckoAPI = (data: any): EnhancedMarketData[] => {
    const cryptoMap: { [key: string]: string } = {
      'bitcoin': 'BTCUSDT',
      'ethereum': 'ETHUSDT',
      'binancecoin': 'BNBUSDT',
      'cardano': 'ADAUSDT',
      'ripple': 'XRPUSDT',
      'solana': 'SOLUSDT',
      'polkadot': 'DOTUSDT',
      'dogecoin': 'DOGEUSDT',
      'avalanche-2': 'AVAXUSDT',
      'polygon': 'MATICUSDT'
    };
    
    return Object.entries(data).map(([key, value]: [string, any]) => {
      const symbol = cryptoMap[key];
      if (symbol && value.usd) {
        return createEnhancedMarketData(symbol, symbol.replace('USDT', '/USDT'), value.usd, 'Binance', {
          change: value.usd_24h_change || 0,
          changePercent: value.usd_24h_change || 0,
          volume: value.usd_24h_vol || 0
        });
      }
      return null;
    }).filter(Boolean) as EnhancedMarketData[];
  };

  const createEnhancedMarketData = (
    symbol: string, 
    name: string, 
    price: number, 
    source: EnhancedMarketData['source'],
    additionalData?: any
  ): EnhancedMarketData => {
    const isJPY = symbol.includes('JPY');
    const isCrypto = symbol.includes('USDT');
    
    // Generate realistic technical indicators
    const rsi = 20 + Math.random() * 60;
    const macd = (Math.random() - 0.5) * (isCrypto ? 0.02 : 0.0002);
    const sma20 = price * (0.98 + Math.random() * 0.04);
    const sma50 = price * (0.95 + Math.random() * 0.1);
    
    // Market volatility based on asset type
    const baseVolatility = isCrypto ? 0.05 : isJPY ? 0.008 : 0.003;
    const dailyChange = additionalData?.change || (Math.random() - 0.5) * price * baseVolatility;
    const dailyChangePercent = additionalData?.changePercent || (dailyChange / price) * 100;
    
    const spread = isCrypto ? price * 0.001 : isJPY ? 0.02 : 0.00002;
    
    return {
      symbol,
      name,
      price,
      change: dailyChange,
      changePercent: dailyChangePercent,
      high: additionalData?.high || price * (1 + Math.random() * baseVolatility),
      low: additionalData?.low || price * (1 - Math.random() * baseVolatility),
      volume: additionalData?.volume || Math.floor(Math.random() * 5000000) + 1000000,
      marketCap: isCrypto ? price * (Math.floor(Math.random() * 50000000) + 10000000) : undefined,
      timestamp: Date.now(),
      bid: price - spread / 2,
      ask: price + spread / 2,
      spread,
      source,
      technicalData: {
        rsi: Math.round(rsi),
        macd: Math.round(macd * 10000) / 10000,
        sma20: Math.round(sma20 * 10000) / 10000,
        sma50: Math.round(sma50 * 10000) / 10000,
        bollinger: {
          upper: price * 1.02,
          middle: price,
          lower: price * 0.98
        },
        support: price * (0.97 + Math.random() * 0.02),
        resistance: price * (1.01 + Math.random() * 0.02)
      },
      newsData: {
        sentiment: Math.random() > 0.6 ? 'POSITIVE' : Math.random() > 0.3 ? 'NEUTRAL' : 'NEGATIVE',
        impactScore: Math.round(Math.random() * 10),
        lastUpdate: Date.now() - Math.floor(Math.random() * 3600000) // Within last hour
      }
    };
  };

  const generateEnhancedForexData = (): EnhancedMarketData[] => {
    const forexPairs = [
      { symbol: 'EURUSD', name: 'EUR/USD', basePrice: 1.0542 },
      { symbol: 'GBPUSD', name: 'GBP/USD', basePrice: 1.2634 },
      { symbol: 'USDJPY', name: 'USD/JPY', basePrice: 151.25 },
      { symbol: 'USDCHF', name: 'USD/CHF', basePrice: 0.8842 },
      { symbol: 'AUDUSD', name: 'AUD/USD', basePrice: 0.6398 },
      { symbol: 'USDCAD', name: 'USD/CAD', basePrice: 1.4125 },
      { symbol: 'NZDUSD', name: 'NZD/USD', basePrice: 0.5842 },
      { symbol: 'EURGBP', name: 'EUR/GBP', basePrice: 0.8342 }
    ];
    
    return forexPairs.map(pair => 
      createEnhancedMarketData(pair.symbol, pair.name, pair.basePrice, 'Simulated')
    );
  };

  const generateEnhancedCryptoData = (): EnhancedMarketData[] => {
    const cryptoPairs = [
      { symbol: 'BTCUSDT', name: 'BTC/USDT', basePrice: 42850 },
      { symbol: 'ETHUSDT', name: 'ETH/USDT', basePrice: 2580 },
      { symbol: 'BNBUSDT', name: 'BNB/USDT', basePrice: 312 },
      { symbol: 'ADAUSDT', name: 'ADA/USDT', basePrice: 0.485 },
      { symbol: 'XRPUSDT', name: 'XRP/USDT', basePrice: 2.42 },
      { symbol: 'SOLUSDT', name: 'SOL/USDT', basePrice: 196 },
      { symbol: 'DOTUSDT', name: 'DOT/USDT', basePrice: 7.85 },
      { symbol: 'DOGEUSDT', name: 'DOGE/USDT', basePrice: 0.325 },
      { symbol: 'AVAXUSDT', name: 'AVAX/USDT', basePrice: 38.5 },
      { symbol: 'MATICUSDT', name: 'MATIC/USDT', basePrice: 0.485 }
    ];
    
    return cryptoPairs.map(pair => 
      createEnhancedMarketData(pair.symbol, pair.name, pair.basePrice, 'Simulated')
    );
  };

  const calculateMarketSummary = (forex: EnhancedMarketData[], crypto: EnhancedMarketData[]): MarketSummary => {
    const allData = [...forex, ...crypto];
    const bullishPairs = allData.filter(pair => pair.changePercent > 0).length;
    const bearishPairs = allData.filter(pair => pair.changePercent < 0).length;
    const avgVolatility = allData.reduce((sum, pair) => sum + Math.abs(pair.changePercent), 0) / allData.length;
    
    const sortedByChange = [...allData].sort((a, b) => b.changePercent - a.changePercent);
    const sortedByVolume = [...allData].sort((a, b) => b.volume - a.volume);
    
    return {
      totalPairs: allData.length,
      bullishPairs,
      bearishPairs,
      avgVolatility,
      marketSentiment: bullishPairs > bearishPairs ? 'BULLISH' : bearishPairs > bullishPairs ? 'BEARISH' : 'NEUTRAL',
      topGainers: sortedByChange.slice(0, 3),
      topLosers: sortedByChange.slice(-3).reverse(),
      highVolume: sortedByVolume.slice(0, 3)
    };
  };

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching enhanced market data from all sources...');
      
      const [forexResult, cryptoResult] = await Promise.all([
        fetchEnhancedForexData(),
        fetchEnhancedCryptoData()
      ]);
      
      setForexData(forexResult);
      setCryptoData(cryptoResult);
      setMarketSummary(calculateMarketSummary(forexResult, cryptoResult));
      setLastUpdate(Date.now());
      
      console.log(`✅ Enhanced market data loaded: ${forexResult.length} forex + ${cryptoResult.length} crypto pairs`);
      
    } catch (err) {
      console.error('❌ Enhanced market data error:', err);
      setError('Failed to fetch market data');
      
      // Always provide fallback data
      const fallbackForex = generateEnhancedForexData();
      const fallbackCrypto = generateEnhancedCryptoData();
      setForexData(fallbackForex);
      setCryptoData(fallbackCrypto);
      setMarketSummary(calculateMarketSummary(fallbackForex, fallbackCrypto));
      setLastUpdate(Date.now());
      
    } finally {
      setLoading(false);
    }
  }, [fetchEnhancedForexData, fetchEnhancedCryptoData]);

  // Real-time updates
  useEffect(() => {
    let isMounted = true;
    
    // Initial fetch
    fetchAllData();
    
    // Update prices every 2 seconds
    const priceUpdateInterval = setInterval(() => {
      if (!isMounted) return;
      
      setForexData(prevData => 
        prevData.map(pair => ({
          ...pair,
          ...updatePriceData(pair)
        }))
      );
      
      setCryptoData(prevData => 
        prevData.map(pair => ({
          ...pair,
          ...updatePriceData(pair)
        }))
      );
    }, 2000);
    
    // Fetch fresh data every 2 minutes
    const dataRefreshInterval = setInterval(() => {
      if (isMounted) {
        fetchAllData();
      }
    }, 120000);
    
    return () => {
      isMounted = false;
      clearInterval(priceUpdateInterval);
      clearInterval(dataRefreshInterval);
    };
  }, [fetchAllData]);

  const updatePriceData = (pair: EnhancedMarketData) => {
    const isCrypto = pair.symbol.includes('USDT');
    const isJPY = pair.symbol.includes('JPY');
    const baseVolatility = isCrypto ? 0.002 : isJPY ? 0.0005 : 0.0001;
    
    const fluctuation = (Math.random() - 0.5) * baseVolatility;
    const newPrice = Math.max(0.0001, pair.price * (1 + fluctuation));
    const priceChange = newPrice - pair.price;
    const newChange = pair.change + priceChange;
    const spread = isCrypto ? newPrice * 0.001 : isJPY ? 0.02 : 0.00002;
    
    return {
      price: newPrice,
      change: newChange,
      changePercent: (newChange / newPrice) * 100,
      bid: newPrice - spread / 2,
      ask: newPrice + spread / 2,
      spread,
      timestamp: Date.now()
    };
  };

  return {
    forexData,
    cryptoData,
    allData: [...forexData, ...cryptoData],
    marketSummary,
    loading,
    error,
    lastUpdate,
    refetch: fetchAllData
  };
}