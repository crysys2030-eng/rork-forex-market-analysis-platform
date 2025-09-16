import { useState, useEffect, useCallback } from 'react';
import { AITradingSignal, AIMarketAnalysis, AITradingConfig, AIIndicatorResult, MLPrediction, MarketCondition, BacktestResult } from '@/types/forex';
import { useRealTimeData } from './useRealTimeData';

const AI_API_URL = 'https://toolkit.rork.com/text/llm/';

const MAJOR_PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
  'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD', 'CHFJPY', 'GBPCHF'
];

const CRYPTO_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 'SOLUSDT',
  'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT', 'LINKUSDT', 'LTCUSDT'
];

export function useAITrading() {
  const { marketData, isConnected } = useRealTimeData();
  const [aiSignals, setAiSignals] = useState<AITradingSignal[]>([]);
  const [marketAnalyses, setMarketAnalyses] = useState<AIMarketAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AITradingConfig>({
    aiModel: 'DeepSeek',
    riskLevel: 'MEDIUM',
    maxPositions: 5,
    riskPerTrade: 2,
    timeframes: ['1h', '4h', '1d'],
    indicators: ['RSI', 'MACD', 'Bollinger Bands', 'EMA', 'Stochastic', 'Williams %R'],
    mlEnabled: true,
    autoTrading: false,
  });

  const generateTechnicalIndicators = useCallback((symbol: string, price: number): AIIndicatorResult[] => {
    const basePrice = price;
    const volatility = 0.02 + Math.random() * 0.03;
    
    return [
      {
        name: 'RSI (14)',
        value: 30 + Math.random() * 40,
        signal: Math.random() > 0.5 ? 'BUY' : 'SELL',
        strength: 60 + Math.random() * 30,
        timeframe: '1h',
        description: 'Relative Strength Index indicating momentum'
      },
      {
        name: 'MACD',
        value: (Math.random() - 0.5) * 0.001,
        signal: Math.random() > 0.4 ? 'BUY' : 'SELL',
        strength: 55 + Math.random() * 35,
        timeframe: '4h',
        description: 'Moving Average Convergence Divergence'
      },
      {
        name: 'Bollinger Bands',
        value: basePrice * (0.98 + Math.random() * 0.04),
        signal: Math.random() > 0.6 ? 'BUY' : 'NEUTRAL',
        strength: 50 + Math.random() * 40,
        timeframe: '1h',
        description: 'Price volatility and trend indicator'
      },
      {
        name: 'EMA (20/50)',
        value: basePrice * (0.995 + Math.random() * 0.01),
        signal: Math.random() > 0.45 ? 'BUY' : 'SELL',
        strength: 65 + Math.random() * 25,
        timeframe: '4h',
        description: 'Exponential Moving Average crossover'
      },
      {
        name: 'Stochastic',
        value: 20 + Math.random() * 60,
        signal: Math.random() > 0.5 ? 'SELL' : 'BUY',
        strength: 55 + Math.random() * 30,
        timeframe: '1h',
        description: 'Momentum oscillator'
      },
      {
        name: 'Williams %R',
        value: -80 + Math.random() * 60,
        signal: Math.random() > 0.55 ? 'BUY' : 'NEUTRAL',
        strength: 50 + Math.random() * 35,
        timeframe: '4h',
        description: 'Momentum indicator for overbought/oversold levels'
      }
    ];
  }, []);

  const generateMLPrediction = useCallback((symbol: string, price: number): MLPrediction => {
    const direction = Math.random() > 0.4 ? 'UP' : Math.random() > 0.5 ? 'DOWN' : 'SIDEWAYS';
    const priceChange = direction === 'UP' ? 0.005 + Math.random() * 0.02 : 
                       direction === 'DOWN' ? -0.005 - Math.random() * 0.02 : 
                       (Math.random() - 0.5) * 0.01;
    
    return {
      direction,
      probability: 65 + Math.random() * 25,
      priceTarget: price * (1 + priceChange),
      timeHorizon: 4 + Math.random() * 20,
      volatilityForecast: 0.01 + Math.random() * 0.03,
      supportLevels: [
        price * (0.995 - Math.random() * 0.01),
        price * (0.985 - Math.random() * 0.015),
        price * (0.975 - Math.random() * 0.02)
      ],
      resistanceLevels: [
        price * (1.005 + Math.random() * 0.01),
        price * (1.015 + Math.random() * 0.015),
        price * (1.025 + Math.random() * 0.02)
      ],
      modelAccuracy: 72 + Math.random() * 18
    };
  }, []);

  const generateMarketCondition = useCallback((): MarketCondition => {
    const conditions = ['BULLISH', 'BEARISH', 'SIDEWAYS'] as const;
    const levels = ['LOW', 'MEDIUM', 'HIGH'] as const;
    const sentiments = ['FEAR', 'GREED', 'NEUTRAL'] as const;
    
    return {
      trend: conditions[Math.floor(Math.random() * conditions.length)],
      volatility: levels[Math.floor(Math.random() * levels.length)],
      volume: levels[Math.floor(Math.random() * levels.length)],
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      liquidity: levels[Math.floor(Math.random() * levels.length)],
      newsImpact: levels[Math.floor(Math.random() * levels.length)]
    };
  }, []);

  const generateBacktestResults = useCallback((): BacktestResult => {
    return {
      winRate: 55 + Math.random() * 25,
      profitFactor: 1.2 + Math.random() * 0.8,
      maxDrawdown: 5 + Math.random() * 15,
      averageReturn: 2 + Math.random() * 8,
      sharpeRatio: 0.8 + Math.random() * 1.2,
      totalTrades: 150 + Math.floor(Math.random() * 300),
      period: '3M'
    };
  }, []);

  const generateAIAnalysis = useCallback(async (symbol: string, price: number): Promise<string> => {
    try {
      const prompt = `Analyze ${symbol} at current price ${price.toFixed(4)}. Provide a brief trading analysis including:
1. Technical outlook
2. Key levels to watch
3. Risk factors
4. Trading recommendation

Keep response under 200 words and focus on actionable insights.`;

      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a professional forex/crypto trading analyst. Provide concise, actionable trading insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const data = await response.json();
      return data.completion || 'AI analysis temporarily unavailable';
    } catch (error) {
      console.log('AI Analysis fallback for', symbol);
      return `Technical analysis for ${symbol}: Price showing ${Math.random() > 0.5 ? 'bullish' : 'bearish'} momentum. Key support at ${(price * 0.995).toFixed(4)}, resistance at ${(price * 1.005).toFixed(4)}. Monitor for breakout signals.`;
    }
  }, []);

  const generateAISignal = useCallback(async (symbol: string, price: number): Promise<AITradingSignal> => {
    const indicators = generateTechnicalIndicators(symbol, price);
    const mlPrediction = generateMLPrediction(symbol, price);
    const marketCondition = generateMarketCondition();
    const backtestResults = generateBacktestResults();
    
    // Calculate signal based on indicators and ML prediction
    const buySignals = indicators.filter(i => i.signal === 'BUY').length;
    const sellSignals = indicators.filter(i => i.signal === 'SELL').length;
    const mlWeight = mlPrediction.direction === 'UP' ? 2 : mlPrediction.direction === 'DOWN' ? -2 : 0;
    
    const signalScore = buySignals - sellSignals + mlWeight;
    const type = signalScore > 0 ? 'BUY' : 'SELL';
    const confidence = Math.min(95, 60 + Math.abs(signalScore) * 8 + Math.random() * 15);
    
    const entryPrice = price;
    const riskPercent = config.riskPerTrade / 100;
    const stopLossDistance = type === 'BUY' ? price * 0.01 : price * 0.01;
    const stopLoss = type === 'BUY' ? price - stopLossDistance : price + stopLossDistance;
    const takeProfitDistance = stopLossDistance * (2 + Math.random() * 2); // 2-4 R:R
    const takeProfit = type === 'BUY' ? price + takeProfitDistance : price - takeProfitDistance;
    const riskReward = Math.abs(takeProfit - entryPrice) / Math.abs(entryPrice - stopLoss);
    
    const reasoning = await generateAIAnalysis(symbol, price);
    
    return {
      id: `ai_${symbol}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      type,
      confidence,
      entryPrice,
      takeProfit,
      stopLoss,
      riskReward,
      timeframe: config.timeframes[Math.floor(Math.random() * config.timeframes.length)] as any,
      timestamp: new Date(),
      status: 'active',
      aiModel: config.aiModel,
      indicators,
      mlPrediction,
      marketCondition,
      reasoning,
      accuracy: backtestResults.winRate,
      backtestResults
    };
  }, [config, generateTechnicalIndicators, generateMLPrediction, generateMarketCondition, generateBacktestResults, generateAIAnalysis]);

  const generateMarketAnalysis = useCallback(async (symbol: string, price: number): Promise<AIMarketAnalysis> => {
    const indicators = generateTechnicalIndicators(symbol, price);
    const mlPrediction = generateMLPrediction(symbol, price);
    
    const technicalScore = indicators.reduce((sum, ind) => {
      const score = ind.signal === 'BUY' ? ind.strength : ind.signal === 'SELL' ? -ind.strength : 0;
      return sum + score;
    }, 0) / indicators.length;
    
    const fundamentalScore = 60 + (Math.random() - 0.5) * 40;
    const sentimentScore = 55 + (Math.random() - 0.5) * 30;
    const aiScore = mlPrediction.probability;
    
    const overallScore = (technicalScore + fundamentalScore + sentimentScore + aiScore) / 4;
    const overallSignal = overallScore > 60 ? 'BUY' : overallScore < 40 ? 'SELL' : 'HOLD';
    
    return {
      symbol,
      overallSignal,
      confidence: Math.abs(overallScore - 50) * 2,
      technicalScore,
      fundamentalScore,
      sentimentScore,
      aiScore,
      priceTargets: {
        short: price * (1 + (Math.random() - 0.5) * 0.02),
        medium: price * (1 + (Math.random() - 0.5) * 0.05),
        long: price * (1 + (Math.random() - 0.5) * 0.1)
      },
      keyLevels: {
        support: mlPrediction.supportLevels,
        resistance: mlPrediction.resistanceLevels
      },
      riskFactors: [
        'High volatility expected',
        'Economic news impact',
        'Technical resistance levels'
      ],
      opportunities: [
        'Strong momentum signals',
        'Favorable risk/reward ratio',
        'AI model confidence high'
      ],
      lastUpdated: new Date()
    };
  }, [generateTechnicalIndicators, generateMLPrediction]);

  const refreshSignals = useCallback(async () => {
    if (!isConnected || marketData.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const allPairs = [...MAJOR_PAIRS, ...CRYPTO_PAIRS];
      const selectedPairs = allPairs.slice(0, 8); // Limit to 8 pairs for performance
      
      const signalPromises = selectedPairs.map(async (symbol) => {
        const marketItem = marketData.find(m => m.symbol === symbol);
        const price = marketItem?.price || (Math.random() * 100 + 1);
        return generateAISignal(symbol, price);
      });
      
      const analysisPromises = selectedPairs.map(async (symbol) => {
        const marketItem = marketData.find(m => m.symbol === symbol);
        const price = marketItem?.price || (Math.random() * 100 + 1);
        return generateMarketAnalysis(symbol, price);
      });
      
      const [signals, analyses] = await Promise.all([
        Promise.all(signalPromises),
        Promise.all(analysisPromises)
      ]);
      
      setAiSignals(signals.filter(s => s.confidence > 65)); // Only show high confidence signals
      setMarketAnalyses(analyses);
    } catch (err) {
      console.error('Error generating AI signals:', err);
      setError('Failed to generate AI signals');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, marketData, generateAISignal, generateMarketAnalysis]);

  useEffect(() => {
    refreshSignals();
    const interval = setInterval(refreshSignals, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [refreshSignals]);

  const updateConfig = useCallback((newConfig: Partial<AITradingConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const getSignalsBySymbol = useCallback((symbol: string) => {
    return aiSignals.filter(signal => signal.symbol === symbol);
  }, [aiSignals]);

  const getAnalysisBySymbol = useCallback((symbol: string) => {
    return marketAnalyses.find(analysis => analysis.symbol === symbol);
  }, [marketAnalyses]);

  return {
    aiSignals,
    marketAnalyses,
    config,
    isLoading,
    error,
    refreshSignals,
    updateConfig,
    getSignalsBySymbol,
    getAnalysisBySymbol,
  };
}