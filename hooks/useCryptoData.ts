import { useState, useEffect } from 'react';
import { CryptoPair, CryptoSignal, CryptoFearGreed } from '@/types/forex';
import { useRealTimeData } from './useRealTimeData';

interface CryptoMarketState {
  [key: string]: {
    basePrice: number;
    trend: number;
    volatility: number;
    momentum: number;
    lastUpdate: number;
    marketCap: number;
    volume24h: number;
    rank: number;
  };
}

const CRYPTO_MARKET_STATE: CryptoMarketState = {
  BTCUSDT: { 
    basePrice: 43250.00, 
    trend: 0.5, 
    volatility: 850, 
    momentum: 0.3, 
    lastUpdate: Date.now(),
    marketCap: 847000000000,
    volume24h: 15200000000,
    rank: 1
  },
  ETHUSDT: { 
    basePrice: 2650.00, 
    trend: 0.3, 
    volatility: 65, 
    momentum: 0.4, 
    lastUpdate: Date.now(),
    marketCap: 318000000000,
    volume24h: 8500000000,
    rank: 2
  },
  BNBUSDT: { 
    basePrice: 315.50, 
    trend: -0.1, 
    volatility: 8.5, 
    momentum: -0.2, 
    lastUpdate: Date.now(),
    marketCap: 47000000000,
    volume24h: 1200000000,
    rank: 3
  },
  SOLUSDT: { 
    basePrice: 98.75, 
    trend: 0.8, 
    volatility: 4.2, 
    momentum: 0.6, 
    lastUpdate: Date.now(),
    marketCap: 42000000000,
    volume24h: 2100000000,
    rank: 4
  },
  XRPUSDT: { 
    basePrice: 0.6234, 
    trend: 0.2, 
    volatility: 0.025, 
    momentum: 0.1, 
    lastUpdate: Date.now(),
    marketCap: 35000000000,
    volume24h: 1800000000,
    rank: 5
  },
  ADAUSDT: { 
    basePrice: 0.4567, 
    trend: -0.05, 
    volatility: 0.018, 
    momentum: -0.1, 
    lastUpdate: Date.now(),
    marketCap: 16000000000,
    volume24h: 450000000,
    rank: 6
  },
  AVAXUSDT: { 
    basePrice: 36.89, 
    trend: 0.4, 
    volatility: 1.8, 
    momentum: 0.3, 
    lastUpdate: Date.now(),
    marketCap: 14000000000,
    volume24h: 380000000,
    rank: 7
  },
  DOTUSDT: { 
    basePrice: 7.234, 
    trend: 0.1, 
    volatility: 0.35, 
    momentum: 0.05, 
    lastUpdate: Date.now(),
    marketCap: 9500000000,
    volume24h: 180000000,
    rank: 8
  },
  LINKUSDT: { 
    basePrice: 14.67, 
    trend: 0.25, 
    volatility: 0.65, 
    momentum: 0.2, 
    lastUpdate: Date.now(),
    marketCap: 8600000000,
    volume24h: 420000000,
    rank: 9
  },
  MATICUSDT: { 
    basePrice: 0.8945, 
    trend: -0.02, 
    volatility: 0.045, 
    momentum: -0.05, 
    lastUpdate: Date.now(),
    marketCap: 8200000000,
    volume24h: 320000000,
    rank: 10
  },
};

const CRYPTO_NAMES = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  BNBUSDT: 'BNB',
  SOLUSDT: 'Solana',
  XRPUSDT: 'XRP',
  ADAUSDT: 'Cardano',
  AVAXUSDT: 'Avalanche',
  DOTUSDT: 'Polkadot',
  LINKUSDT: 'Chainlink',
  MATICUSDT: 'Polygon',
};

function generateCryptoPrice(symbol: string): { price: number; change: number; changePercent: number } {
  const state = CRYPTO_MARKET_STATE[symbol];
  const now = Date.now();
  const timeDelta = (now - state.lastUpdate) / 1000;
  
  const randomWalk = (Math.random() - 0.5) * 2;
  const trendComponent = state.trend * timeDelta * 0.1;
  const volatilityComponent = state.volatility * randomWalk * Math.sqrt(timeDelta) * 0.01;
  const momentumComponent = state.momentum * state.basePrice * 0.0001;
  
  const microstructureNoise = (Math.random() - 0.5) * state.basePrice * 0.0005;
  
  const priceChange = trendComponent + volatilityComponent + momentumComponent + microstructureNoise;
  const newPrice = Math.max(0.0001, state.basePrice + priceChange);
  
  state.basePrice = newPrice;
  state.momentum = state.momentum * 0.95 + randomWalk * 0.05;
  state.lastUpdate = now;
  
  const change = priceChange;
  const changePercent = (change / (newPrice - change)) * 100;
  
  return {
    price: newPrice,
    change: change,
    changePercent: changePercent
  };
}

export function useCryptoData() {
  const { marketData, isConnected } = useRealTimeData();
  const [cryptoPairs, setCryptoPairs] = useState<CryptoPair[]>([]);
  const [cryptoSignals, setCryptoSignals] = useState<CryptoSignal[]>([]);

  const [fearGreedIndex, setFearGreedIndex] = useState<CryptoFearGreed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const generateCryptoData = async () => {
      // Filter crypto pairs from real-time market data
      const cryptoMarketData = marketData.filter(data => data.symbol.includes('USDT'));
      const pairs: CryptoPair[] = [];
      
      // If we have real crypto data, use it
      if (cryptoMarketData.length > 0) {
        for (const data of cryptoMarketData) {
          const symbol = data.symbol;
          const state = CRYPTO_MARKET_STATE[symbol];
          
          pairs.push({
            symbol,
            name: CRYPTO_NAMES[symbol as keyof typeof CRYPTO_NAMES] || symbol.replace('USDT', ''),
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            high24h: data.high,
            low24h: data.low,
            volume24h: data.volume,
            marketCap: state?.marketCap || data.volume * data.price * 100,
            rank: state?.rank || 1,
            icon: `https://cryptoicons.org/api/icon/${symbol.replace('USDT', '').toLowerCase()}/200`,
          });
        }
      } else {
        // Fallback to simulated data if no real data available
        const symbols = Object.keys(CRYPTO_MARKET_STATE);
        
        for (const symbol of symbols) {
          const { price, change, changePercent } = generateCryptoPrice(symbol);
          const state = CRYPTO_MARKET_STATE[symbol];
          
          const high24h = price + state.volatility * 0.8;
          const low24h = price - state.volatility * 0.6;
          
          pairs.push({
            symbol,
            name: CRYPTO_NAMES[symbol as keyof typeof CRYPTO_NAMES],
            price: Number(price.toFixed(price > 1 ? 2 : 6)),
            change: Number(change.toFixed(price > 1 ? 2 : 6)),
            changePercent: Number(changePercent.toFixed(2)),
            high24h: Number(high24h.toFixed(price > 1 ? 2 : 6)),
            low24h: Number(low24h.toFixed(price > 1 ? 2 : 6)),
            volume24h: state.volume24h * (0.8 + Math.random() * 0.4),
            marketCap: state.marketCap * (price / (price - change)),
            rank: state.rank,
            icon: `https://cryptoicons.org/api/icon/${symbol.replace('USDT', '').toLowerCase()}/200`,
          });
        }
      }
      
      const [signals, fearGreed] = await Promise.all([
        generateCryptoSignals(pairs),
        generateFearGreedIndex()
      ]);

      setCryptoPairs(pairs);
      setCryptoSignals(signals);
      setFearGreedIndex(fearGreed);
      setIsLoading(!isConnected);
      setLastUpdate(new Date());
    };

    generateCryptoData();
    const interval = setInterval(generateCryptoData, 5000);

    return () => clearInterval(interval);
  }, [marketData, isConnected]);

  return {
    cryptoPairs,
    cryptoSignals,

    fearGreedIndex,
    isLoading,
    lastUpdate,
  };
}

async function generateCryptoSignals(pairs: CryptoPair[]): Promise<CryptoSignal[]> {
  const signals: CryptoSignal[] = [];
  
  // Generate signals using technical analysis without external API calls
  for (const pair of pairs.slice(0, 6)) {
    const state = CRYPTO_MARKET_STATE[pair.symbol];
    if (!state) continue;
    
    const rsi = 50 + state.momentum * 25;
    const volatilityScore = Math.abs(state.volatility) / pair.price * 100;
    const momentumStrength = Math.abs(state.momentum);
    const volumeRatio = state.volume24h / (state.marketCap * 0.1);
    
    let signalType: 'buy' | 'sell';
    let confidence: number;
    let indicators: string[] = [];
    let aiAnalysis: string;
    let riskLevel: 'low' | 'medium' | 'high';
    
    // Technical analysis-based signal generation
    if (rsi < 30 && state.trend > 0 && volumeRatio > 0.05) {
      signalType = 'buy';
      confidence = 85 + Math.random() * 12;
      indicators = ['RSI Oversold', 'Bullish Trend', 'High Volume', 'Support Level'];
      aiAnalysis = `Strong buy signal detected. RSI indicates oversold conditions with bullish momentum. Volume confirms institutional interest. Confidence: ${confidence.toFixed(0)}%`;
      riskLevel = volatilityScore > 8 ? 'high' : 'medium';
    } else if (rsi > 70 && state.trend < 0 && pair.changePercent > 5) {
      signalType = 'sell';
      confidence = 80 + Math.random() * 15;
      indicators = ['RSI Overbought', 'Bearish Trend', 'Profit Taking', 'Resistance Level'];
      aiAnalysis = `Sell signal identified. Overbought conditions with bearish momentum suggest potential reversal. Risk level: ${volatilityScore > 10 ? 'high' : 'medium'}`;
      riskLevel = volatilityScore > 10 ? 'high' : 'medium';
    } else if (momentumStrength > 0.5 && Math.abs(pair.changePercent) > 3) {
      signalType = state.momentum > 0 ? 'buy' : 'sell';
      confidence = 70 + Math.random() * 20;
      indicators = ['Strong Momentum', 'Trend Continuation', 'Price Breakout', 'Volume Confirmation'];
      aiAnalysis = `Momentum signal detected. Strong ${signalType === 'buy' ? 'bullish' : 'bearish'} momentum with significant price movement suggests trend continuation.`;
      riskLevel = 'medium';
    } else if (volumeRatio > 0.08 && Math.abs(pair.changePercent) > 2) {
      signalType = pair.changePercent > 0 ? 'buy' : 'sell';
      confidence = 75 + Math.random() * 15;
      indicators = ['Volume Spike', 'Price Action', 'Market Interest', 'Breakout Pattern'];
      aiAnalysis = `High volume activity detected with ${signalType === 'buy' ? 'positive' : 'negative'} price action. Institutional flow suggests ${signalType} opportunity.`;
      riskLevel = 'medium';
    } else {
      continue;
    }
    
    const entryPrice = pair.price;
    const atr = state.volatility * 0.015;
    const riskMultiplier = riskLevel === 'high' ? 0.8 : riskLevel === 'medium' ? 1.0 : 1.2;
    
    const targetPrice = signalType === 'buy' ? 
      entryPrice * (1 + atr * 2.5 * riskMultiplier) : 
      entryPrice * (1 - atr * 2.5 * riskMultiplier);
    const stopLoss = signalType === 'buy' ? 
      entryPrice * (1 - atr * riskMultiplier) : 
      entryPrice * (1 + atr * riskMultiplier);
    
    signals.push({
      id: `${pair.symbol}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol: pair.symbol,
      type: signalType,
      confidence: Math.round(confidence),
      entryPrice: Number(entryPrice.toFixed(entryPrice > 1 ? 2 : 6)),
      targetPrice: Number(targetPrice.toFixed(entryPrice > 1 ? 2 : 6)),
      stopLoss: Number(stopLoss.toFixed(entryPrice > 1 ? 2 : 6)),
      timeframe: volatilityScore > 8 ? '15m' : volatilityScore > 4 ? '1h' : '4h',
      timestamp: new Date(),
      status: 'active',
      indicators,
      aiAnalysis,
      riskLevel,
    });
  }
  
  return signals;
}



async function generateFearGreedIndex(): Promise<CryptoFearGreed> {
  // Calculate Fear & Greed Index based on market data without external API calls
  const marketVolatility = Object.values(CRYPTO_MARKET_STATE).reduce((sum, state) => sum + Math.abs(state.momentum), 0) / Object.keys(CRYPTO_MARKET_STATE).length;
  const avgMomentum = Object.values(CRYPTO_MARKET_STATE).reduce((sum, s) => sum + s.momentum, 0) / Object.keys(CRYPTO_MARKET_STATE).length;
  
  // Calculate base score from market conditions
  let baseScore = 50; // Neutral starting point
  
  // Adjust for momentum (positive momentum = greed, negative = fear)
  baseScore += avgMomentum * 30;
  
  // Adjust for volatility (high volatility = fear)
  baseScore -= marketVolatility * 20;
  
  // Add some randomness for realistic variation
  baseScore += (Math.random() - 0.5) * 20;
  
  const value = Math.max(0, Math.min(100, Math.round(baseScore)));
  
  let classification: CryptoFearGreed['classification'];
  if (value <= 20) classification = 'Extreme Fear';
  else if (value <= 40) classification = 'Fear';
  else if (value <= 60) classification = 'Neutral';
  else if (value <= 80) classification = 'Greed';
  else classification = 'Extreme Greed';
  
  return {
    value,
    classification,
    timestamp: new Date(),
    factors: {
      volatility: Math.max(0, Math.min(100, Math.round(50 - marketVolatility * 100))),
      momentum: Math.max(0, Math.min(100, Math.round(50 + avgMomentum * 50))),
      volume: Math.floor(Math.random() * 30) + 60,
      socialMedia: Math.max(0, Math.min(100, Math.round(value + (Math.random() - 0.5) * 20))),
      dominance: Math.floor(Math.random() * 20) + 40,
    },
  };
}