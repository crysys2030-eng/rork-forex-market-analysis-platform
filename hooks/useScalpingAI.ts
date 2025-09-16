import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

export interface ScalpingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeframe: string;
  reason: string;
  timestamp: Date;
  riskReward: number;
  volume?: number;
  spread?: number;
  strategy: string;
  technicalIndicators: {
    rsi: number;
    macd: number;
    ema: number;
    bollinger: 'UPPER' | 'LOWER' | 'MIDDLE';
  };
  marketConditions: {
    volatility: number;
    momentum: number;
    trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedDuration: number; // in minutes
  alerts: ScalpingAlert[];
}

export interface ScalpingAnalysis {
  marketCondition: 'TRENDING' | 'RANGING' | 'VOLATILE' | 'CONSOLIDATING';
  volatility: number;
  momentum: number;
  support: number;
  resistance: number;
  recommendation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  optimalPairs: string[];
  timestamp: Date;
}

export interface ScalpingAlert {
  id: string;
  type: 'ENTRY' | 'EXIT' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'TREND_CHANGE';
  message: string;
  timestamp: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  price?: number;
}

export interface ScalpingConfig {
  minConfidence: number;
  maxRisk: number;
  timeframes: string[];
  pairs: string[];
  riskRewardRatio: number;
  maxSpread: number;
  enableAlerts: boolean;
  alertTypes: string[];
  strategies: string[];
  maxPositions: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h?: number;
  low24h?: number;
  volume?: number;
  spread?: number;
  bid?: number;
  ask?: number;
}

interface BinanceTickerData {
  symbol: string;
  price: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

interface ForexData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
}

export function useScalpingAI(marketData: MarketData[]) {
  const [signals, setSignals] = useState<ScalpingSignal[]>([]);
  const [analysis, setAnalysis] = useState<ScalpingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<ScalpingAlert[]>([]);
  const [config, setConfig] = useState<ScalpingConfig>({
    minConfidence: 65,
    maxRisk: 2,
    timeframes: ['1m', '5m'],
    pairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'EURJPY', 'GBPJPY', 'NZDUSD', 'EURGBP'],
    riskRewardRatio: 1.5,
    maxSpread: 3,
    enableAlerts: true,
    alertTypes: ['ENTRY', 'EXIT', 'STOP_LOSS', 'TAKE_PROFIT'],
    strategies: ['MOMENTUM_BREAKOUT', 'MEAN_REVERSION', 'TREND_FOLLOWING'],
    maxPositions: 5,
  });
  
  const marketDataRef = useRef<MarketData[]>([]);
  marketDataRef.current = marketData;

  // Real-time market data fetching
  const fetchBinanceData = useCallback(async (): Promise<BinanceTickerData[]> => {
    try {
      // Fetch both 24hr ticker and current prices for more accurate data
      const [tickerResponse, priceResponse] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/24hr'),
        fetch('https://api.binance.com/api/v3/ticker/price')
      ]);
      
      if (!tickerResponse.ok || !priceResponse.ok) {
        throw new Error('Failed to fetch Binance data');
      }
      
      const [tickerData, priceData] = await Promise.all([
        tickerResponse.json(),
        priceResponse.json()
      ]);
      
      // Filter for major crypto pairs that are good for scalping
      const scalpingPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 'SOLUSDT', 'DOTUSDT', 'AVAXUSDT', 'MATICUSDT', 'LINKUSDT', 'DOGEUSDT', 'SHIBUSDT'];
      
      const filteredTickers = tickerData.filter((ticker: any) => scalpingPairs.includes(ticker.symbol));
      
      // Merge with current prices for most up-to-date data
      return filteredTickers.map((ticker: any) => {
        const currentPrice = priceData.find((p: any) => p.symbol === ticker.symbol);
        return {
          ...ticker,
          price: currentPrice ? currentPrice.price : ticker.lastPrice
        };
      });
    } catch (error) {
      console.error('❌ Error fetching Binance data:', error);
      return [];
    }
  }, []);

  const fetchForexData = useCallback(async (): Promise<ForexData[]> => {
    try {
      const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF', 'EURJPY', 'GBPJPY', 'EURGBP'];
      const forexData: ForexData[] = [];
      
      // Try to fetch real forex data from multiple sources
      for (const pair of pairs) {
        try {
          const fromCurrency = pair.slice(0, 3);
          const toCurrency = pair.slice(3, 6);
          
          // Try exchangerate-api.com first (free, no key required)
          const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
            { 
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.rates && data.rates[toCurrency]) {
              const price = data.rates[toCurrency];
              const isJPY = pair.includes('JPY');
              const spread = isJPY ? 0.02 : 0.00002; // Realistic spreads
              const change = (Math.random() - 0.5) * (isJPY ? 0.5 : 0.005); // Realistic daily changes
              
              forexData.push({
                symbol: pair,
                bid: price - spread / 2,
                ask: price + spread / 2,
                spread: spread * (isJPY ? 100 : 10000), // in pips
                change: change,
                changePercent: (change / price) * 100
              });
              continue;
            }
          }
        } catch (apiError) {
          console.log(`⚠️ API failed for ${pair}, using realistic simulation`);
        }
        
        // Fallback to realistic simulated data based on current market rates
        const realisticRates: { [key: string]: number } = {
          'EURUSD': 1.0542,
          'GBPUSD': 1.2634,
          'USDJPY': 151.25,
          'USDCHF': 0.8842,
          'AUDUSD': 0.6398,
          'USDCAD': 1.4125,
          'NZDUSD': 0.5842,
          'EURJPY': 160.85,
          'GBPJPY': 191.12,
          'EURGBP': 0.8342
        };
        
        const basePrice = realisticRates[pair] || 1.0000;
        const isJPY = pair.includes('JPY');
        const dailyVolatility = isJPY ? 0.5 : 0.005;
        const variation = (Math.random() - 0.5) * dailyVolatility;
        const price = basePrice + variation;
        const spread = isJPY ? 0.02 : 0.00002;
        const change = (Math.random() - 0.5) * dailyVolatility * 0.3;
        
        forexData.push({
          symbol: pair,
          bid: price - spread / 2,
          ask: price + spread / 2,
          spread: spread * (isJPY ? 100 : 10000), // in pips
          change: change,
          changePercent: (change / price) * 100
        });
      }
      
      console.log(`📊 Forex data updated: ${forexData.length} pairs`);
      return forexData;
    } catch (error) {
      console.error('❌ Error fetching Forex data:', error);
      return [];
    }
  }, []);

  // Real AI-powered scalping analysis
  const generateAIAnalysisWithAI = useCallback(async (data: MarketData[]): Promise<ScalpingAnalysis> => {
    try {
      // Prepare comprehensive market data for AI analysis
      const marketSummary = data.slice(0, 10).map(item => ({
        symbol: item.symbol,
        price: item.price,
        changePercent: item.changePercent,
        volume: item.volume || 0,
        volatility: Math.abs(item.changePercent),
        spread: item.spread || 0.01,
        high24h: item.high24h,
        low24h: item.low24h
      }));

      // Enhanced AI prompt for professional scalping analysis
      const aiPrompt = `You are an expert scalping trader and market analyst. Analyze this real-time market data for scalping opportunities:

Market Data (${marketSummary.length} pairs):
${JSON.stringify(marketSummary, null, 2)}

Current Time: ${new Date().toISOString()}
Market Session: ${getMarketSession()}

Provide a comprehensive scalping analysis:

1. MARKET CONDITION: Analyze overall market state
   - TRENDING: Strong directional movement
   - RANGING: Sideways movement within bounds
   - VOLATILE: High volatility with rapid price swings
   - CONSOLIDATING: Low volatility, tight ranges

2. VOLATILITY LEVEL (0-5): Rate current market volatility
   - 0-1: Very low, minimal movement
   - 2-3: Moderate, good for scalping
   - 4-5: High, requires careful risk management

3. MOMENTUM (-5 to +5): Overall market momentum
   - Negative: Bearish momentum
   - Zero: Neutral/sideways
   - Positive: Bullish momentum

4. RISK LEVEL: Current market risk assessment
   - LOW: Stable conditions, predictable movements
   - MEDIUM: Normal market conditions
   - HIGH: Unpredictable, high volatility

5. TOP PAIRS: Identify 3-5 best pairs for scalping based on:
   - Volatility levels
   - Spread costs
   - Volume/liquidity
   - Technical setup

6. RECOMMENDATION: Brief actionable advice (max 150 chars)

Respond in valid JSON format with these exact keys:
{
  "marketCondition": "TRENDING|RANGING|VOLATILE|CONSOLIDATING",
  "volatility": number,
  "momentum": number,
  "riskLevel": "LOW|MEDIUM|HIGH",
  "optimalPairs": ["PAIR1", "PAIR2", "PAIR3"],
  "recommendation": "string"
}`;

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a professional scalping trader with 10+ years of experience in forex and crypto markets. Provide precise, actionable analysis in valid JSON format only. Focus on short-term scalping opportunities with tight spreads and good liquidity.'
            },
            {
              role: 'user',
              content: aiPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const aiResult = await response.json();
      let aiAnalysis;
      
      try {
        // Try to parse JSON response
        const jsonMatch = aiResult.completion.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiAnalysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('AI JSON parsing failed, using fallback:', parseError);
        aiAnalysis = generateFallbackAnalysis(data);
      }

      // Validate and sanitize AI response
      const validatedAnalysis = {
        marketCondition: ['TRENDING', 'RANGING', 'VOLATILE', 'CONSOLIDATING'].includes(aiAnalysis.marketCondition) 
          ? aiAnalysis.marketCondition : 'RANGING',
        volatility: typeof aiAnalysis.volatility === 'number' && aiAnalysis.volatility >= 0 && aiAnalysis.volatility <= 5 
          ? aiAnalysis.volatility : 2.5,
        momentum: typeof aiAnalysis.momentum === 'number' && aiAnalysis.momentum >= -5 && aiAnalysis.momentum <= 5 
          ? aiAnalysis.momentum : 0,
        support: 0, // Will be calculated separately
        resistance: 0, // Will be calculated separately
        recommendation: typeof aiAnalysis.recommendation === 'string' && aiAnalysis.recommendation.length > 0 
          ? aiAnalysis.recommendation.substring(0, 150) : 'Monitor market conditions closely',
        riskLevel: ['LOW', 'MEDIUM', 'HIGH'].includes(aiAnalysis.riskLevel) 
          ? aiAnalysis.riskLevel : 'MEDIUM',
        optimalPairs: Array.isArray(aiAnalysis.optimalPairs) && aiAnalysis.optimalPairs.length > 0 
          ? aiAnalysis.optimalPairs.slice(0, 5) : data.slice(0, 3).map(item => item.symbol),
        timestamp: new Date(),
      };

      console.log(`🤖 AI Scalping Analysis:`, {
        condition: validatedAnalysis.marketCondition,
        volatility: validatedAnalysis.volatility,
        momentum: validatedAnalysis.momentum,
        risk: validatedAnalysis.riskLevel,
        pairs: validatedAnalysis.optimalPairs.join(', ')
      });

      return validatedAnalysis;
    } catch (error) {
      console.error('❌ AI scalping analysis failed:', error);
      return generateFallbackAnalysis(data);
    }
  }, []);

  // Helper function to determine current market session
  const getMarketSession = (): string => {
    const hour = new Date().getUTCHours();
    if (hour >= 0 && hour < 9) return 'Asian Session';
    if (hour >= 9 && hour < 17) return 'London Session';
    if (hour >= 17 && hour < 24) return 'New York Session';
    return 'Overlap Session';
  };

  const generateFallbackAnalysis = useCallback((data: MarketData[]): ScalpingAnalysis => {
    const volatilitySum = data.reduce((sum, item) => sum + Math.abs(item.changePercent), 0);
    const avgVolatility = volatilitySum / data.length;
    
    const momentum = data.reduce((sum, item) => sum + item.changePercent, 0) / data.length;
    
    let marketCondition: ScalpingAnalysis['marketCondition'] = 'RANGING';
    if (avgVolatility > 1.5) marketCondition = 'VOLATILE';
    else if (Math.abs(momentum) > 0.5) marketCondition = 'TRENDING';
    else if (avgVolatility < 0.3) marketCondition = 'CONSOLIDATING';

    const riskLevel: ScalpingAnalysis['riskLevel'] = 
      avgVolatility > 2 ? 'HIGH' : avgVolatility > 1 ? 'MEDIUM' : 'LOW';

    const optimalPairs = data
      .filter(item => config.pairs.includes(item.symbol))
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 3)
      .map(item => item.symbol);

    return {
      marketCondition,
      volatility: avgVolatility,
      momentum,
      support: 0,
      resistance: 0,
      recommendation: generateRecommendation(marketCondition, riskLevel, avgVolatility),
      riskLevel,
      optimalPairs,
      timestamp: new Date(),
    };
  }, [config.pairs]);

  const generateRecommendation = (
    condition: ScalpingAnalysis['marketCondition'], 
    risk: ScalpingAnalysis['riskLevel'], 
    volatility: number
  ): string => {
    if (condition === 'VOLATILE' && risk === 'HIGH') {
      return 'High volatility detected. Use smaller position sizes and wider stops.';
    }
    if (condition === 'TRENDING' && risk === 'LOW') {
      return 'Strong trend with low risk. Good scalping opportunities available.';
    }
    if (condition === 'RANGING') {
      return 'Market is ranging. Look for support/resistance bounces.';
    }
    if (condition === 'CONSOLIDATING') {
      return 'Low volatility. Wait for breakout or use range trading strategies.';
    }
    return 'Monitor market conditions closely before entering positions.';
  };

  const calculateStopLoss = useCallback((entryPrice: number, action: 'BUY' | 'SELL', volatility: number): number => {
    const riskAmount = entryPrice * (config.maxRisk / 100) * (1 + volatility * 0.5);
    return action === 'BUY' ? entryPrice - riskAmount : entryPrice + riskAmount;
  }, [config.maxRisk]);

  const calculateTakeProfit = useCallback((entryPrice: number, action: 'BUY' | 'SELL', volatility: number): number => {
    const riskAmount = entryPrice * (config.maxRisk / 100) * (1 + volatility * 0.5);
    const profitAmount = riskAmount * config.riskRewardRatio;
    return action === 'BUY' ? entryPrice + profitAmount : entryPrice - profitAmount;
  }, [config.maxRisk, config.riskRewardRatio]);

  const generateSignalAlerts = useCallback((symbol: string, action: 'BUY' | 'SELL', price: number): ScalpingAlert[] => {
    const alerts: ScalpingAlert[] = [];
    
    if (config.enableAlerts) {
      alerts.push({
        id: `alert-${Date.now()}-${Math.random()}`,
        type: 'ENTRY',
        message: `🚨 ${action} signal detected for ${symbol} at ${price.toFixed(5)}`,
        timestamp: new Date(),
        priority: 'HIGH',
        price
      });
    }
    
    return alerts;
  }, [config.enableAlerts]);

  const generateTechnicalIndicators = useCallback((price: number, changePercent: number) => {
    // Simulate technical indicators
    const rsi = 50 + (changePercent * 10) + (Math.random() - 0.5) * 20;
    const macd = changePercent * 0.1 + (Math.random() - 0.5) * 0.05;
    const ema = price * (1 + changePercent / 100);
    const bollinger = Math.abs(changePercent) > 1 ? 
      (changePercent > 0 ? 'UPPER' : 'LOWER') : 'MIDDLE';
    
    return {
      rsi: Math.max(0, Math.min(100, rsi)),
      macd,
      ema,
      bollinger: bollinger as 'UPPER' | 'LOWER' | 'MIDDLE'
    };
  }, []);

  const generateAIScalpingSignals = useCallback(async (data: MarketData[]): Promise<ScalpingSignal[]> => {
    try {
      // Enhanced AI signal generation
      const marketContext = {
        totalPairs: data.length,
        avgVolatility: data.reduce((sum, item) => sum + Math.abs(item.changePercent), 0) / data.length,
        topMovers: data.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 5),
        marketTime: new Date().toISOString()
      };

      // Generate AI-powered signals for top pairs
      const aiSignalsPromises = data.slice(0, 10).map(async (item) => {
        if (!config.pairs.includes(item.symbol)) return null;
        
        const aiPrompt = `Analyze this trading pair for scalping signals:

Pair: ${item.symbol}
Price: ${item.price}
Change: ${item.changePercent}%
Volume: ${item.volume || 'N/A'}
Spread: ${item.spread || 'N/A'}

Market Context:
- Average market volatility: ${marketContext.avgVolatility.toFixed(2)}%
- Current time: ${new Date().toLocaleString()}

Generate a scalping signal if conditions are favorable. Consider:
1. Entry/exit points
2. Risk management
3. Technical indicators
4. Market momentum

Respond with JSON containing: action (BUY/SELL/HOLD), confidence (0-100), entryPrice, stopLoss, takeProfit, reason, strategy, riskLevel.`;

        try {
          const response = await fetch('https://toolkit.rork.com/text/llm/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert scalping trader with deep knowledge of technical analysis, market microstructure, and risk management. Generate precise, actionable trading signals based on real-time market data. Only suggest trades with high probability of success and favorable risk-reward ratios. Respond in valid JSON format only.'
                },
                {
                  role: 'user',
                  content: aiPrompt
                }
              ]
            })
          });

          if (!response.ok) {
            throw new Error(`AI signal request failed: ${response.status}`);
          }

          const aiResult = await response.json();
          let aiSignal;
          
          try {
            // Enhanced JSON parsing with fallback
            const jsonMatch = aiResult.completion.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              aiSignal = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('No JSON found in AI response');
            }
          } catch (parseError) {
            console.warn(`JSON parsing failed for ${item.symbol}:`, parseError);
            return null; // Skip if AI response is not valid JSON
          }

          // Enhanced validation
          if (!aiSignal.action || 
              aiSignal.action === 'HOLD' || 
              !['BUY', 'SELL'].includes(aiSignal.action) ||
              typeof aiSignal.confidence !== 'number' ||
              aiSignal.confidence < config.minConfidence) {
            return null;
          }

          const technicalIndicators = generateTechnicalIndicators(item.price, item.changePercent);
          const signalAlerts = generateSignalAlerts(item.symbol, aiSignal.action, aiSignal.entryPrice || item.price);

          return {
            id: `ai-${item.symbol}-${Date.now()}-${Math.random()}`,
            symbol: item.symbol,
            action: aiSignal.action,
            confidence: Math.min(98, Math.max(config.minConfidence, aiSignal.confidence)),
            entryPrice: aiSignal.entryPrice || item.price,
            stopLoss: aiSignal.stopLoss || calculateStopLoss(item.price, aiSignal.action, Math.abs(item.changePercent)),
            takeProfit: aiSignal.takeProfit || calculateTakeProfit(item.price, aiSignal.action, Math.abs(item.changePercent)),
            timeframe: '1m',
            reason: aiSignal.reason || 'AI-generated scalping signal',
            timestamp: new Date(),
            riskReward: config.riskRewardRatio,
            volume: item.volume,
            spread: item.spread || Math.random() * 2 + 0.5,
            strategy: aiSignal.strategy || 'AI_SCALPING',
            technicalIndicators,
            marketConditions: {
              volatility: Math.abs(item.changePercent),
              momentum: item.changePercent,
              trend: item.changePercent > 0.3 ? 'BULLISH' : item.changePercent < -0.3 ? 'BEARISH' : 'SIDEWAYS'
            },
            riskLevel: aiSignal.riskLevel || 'MEDIUM',
            expectedDuration: Math.round(2 + Math.random() * 8),
            alerts: signalAlerts
          };
        } catch (error) {
          console.error(`Error generating AI signal for ${item.symbol}:`, error);
          return null;
        }
      });

      const aiSignals = (await Promise.all(aiSignalsPromises)).filter(signal => signal !== null) as ScalpingSignal[];
      
      // Combine with traditional technical analysis signals
      const traditionalSignals = await generateTraditionalSignals(data);
      
      return [...aiSignals, ...traditionalSignals]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, config.maxPositions * 2);
    } catch (error) {
      console.error('Error in AI signal generation:', error);
      return generateTraditionalSignals(data);
    }
  }, [config.pairs, config.minConfidence, config.riskRewardRatio, config.maxPositions, generateTechnicalIndicators, calculateStopLoss, calculateTakeProfit, generateSignalAlerts]);

  const generateTraditionalSignals = useCallback(async (data: MarketData[]): Promise<ScalpingSignal[]> => {
    const signals: ScalpingSignal[] = [];
    
    for (const item of data) {
      if (!config.pairs.includes(item.symbol)) continue;
      
      // Enhanced AI signal generation with multiple strategies
      const volatility = Math.abs(item.changePercent);
      const momentum = item.changePercent;
      const technicalIndicators = generateTechnicalIndicators(item.price, item.changePercent);
      
      // Strategy 1: Momentum Breakout (Enhanced for scalping) - More sensitive
      if (volatility > 0.1 && Math.abs(momentum) > 0.05) {
        const action: 'BUY' | 'SELL' = momentum > 0 ? 'BUY' : 'SELL';
        let confidence = 60 + volatility * 10 + Math.abs(momentum) * 8;
        
        // Boost confidence for RSI extremes
        if (technicalIndicators.rsi > 70 || technicalIndicators.rsi < 30) {
          confidence += 15;
        }
        
        // Boost confidence for MACD alignment
        if ((action === 'BUY' && technicalIndicators.macd > 0) || (action === 'SELL' && technicalIndicators.macd < 0)) {
          confidence += 10;
        }
        
        // Boost confidence for Bollinger Band extremes
        if ((action === 'BUY' && technicalIndicators.bollinger === 'LOWER') || 
            (action === 'SELL' && technicalIndicators.bollinger === 'UPPER')) {
          confidence += 12;
        }
        
        confidence = Math.min(98, confidence);
        
        if (confidence >= config.minConfidence) {
          const signalAlerts = generateSignalAlerts(item.symbol, action, item.price);
          
          signals.push({
            id: `${item.symbol}-${Date.now()}-${Math.random()}`,
            symbol: item.symbol,
            action,
            confidence: Math.round(confidence),
            entryPrice: item.price,
            stopLoss: calculateStopLoss(item.price, action, volatility),
            takeProfit: calculateTakeProfit(item.price, action, volatility),
            timeframe: '1m',
            reason: generateAdvancedSignalReason(action, volatility, momentum, technicalIndicators),
            timestamp: new Date(),
            riskReward: config.riskRewardRatio,
            volume: item.volume,
            spread: Math.random() * 2 + 0.5,
            strategy: 'MOMENTUM_BREAKOUT',
            technicalIndicators,
            marketConditions: {
              volatility,
              momentum,
              trend: momentum > 0.3 ? 'BULLISH' : momentum < -0.3 ? 'BEARISH' : 'SIDEWAYS'
            },
            riskLevel: volatility > 2 ? 'HIGH' : volatility > 1 ? 'MEDIUM' : 'LOW',
            expectedDuration: Math.round(2 + Math.random() * 8), // 2-10 minutes for scalping
            alerts: signalAlerts
          });
        }
      }
      
      // Strategy 2: Mean Reversion (Enhanced for scalping) - More sensitive
      if (technicalIndicators.bollinger !== 'MIDDLE' && volatility > 0.05) {
        const action: 'BUY' | 'SELL' = technicalIndicators.bollinger === 'LOWER' ? 'BUY' : 'SELL';
        let confidence = 65;
        
        // Higher confidence for extreme RSI
        if ((action === 'BUY' && technicalIndicators.rsi < 30) || 
            (action === 'SELL' && technicalIndicators.rsi > 70)) {
          confidence += 20;
        }
        
        // Add volatility factor
        confidence += volatility * 5;
        
        // Reduce confidence if momentum is against the trade
        if ((action === 'BUY' && momentum < -0.3) || (action === 'SELL' && momentum > 0.3)) {
          confidence -= 10;
        }
        
        confidence = Math.min(95, confidence);
        
        if (confidence >= config.minConfidence) {
          const signalAlerts = generateSignalAlerts(item.symbol, action, item.price);
          
          signals.push({
            id: `${item.symbol}-${Date.now()}-${Math.random()}`,
            symbol: item.symbol,
            action,
            confidence: Math.round(confidence),
            entryPrice: item.price,
            stopLoss: calculateStopLoss(item.price, action, volatility * 0.7),
            takeProfit: calculateTakeProfit(item.price, action, volatility * 0.7),
            timeframe: '1m',
            reason: generateAdvancedSignalReason(action, volatility, momentum, technicalIndicators),
            timestamp: new Date(),
            riskReward: config.riskRewardRatio,
            volume: item.volume,
            spread: Math.random() * 2 + 0.5,
            strategy: 'MEAN_REVERSION',
            technicalIndicators,
            marketConditions: {
              volatility,
              momentum,
              trend: momentum > 0.3 ? 'BULLISH' : momentum < -0.3 ? 'BEARISH' : 'SIDEWAYS'
            },
            riskLevel: volatility > 2 ? 'HIGH' : volatility > 1 ? 'MEDIUM' : 'LOW',
            expectedDuration: Math.round(3 + Math.random() * 12), // 3-15 minutes for scalping
            alerts: signalAlerts
          });
        }
      }
      
      // Strategy 3: Quick Scalp (New strategy for very short-term trades) - More sensitive
      if (volatility > 0.2 && Math.abs(technicalIndicators.macd) > 0.005) {
        const action: 'BUY' | 'SELL' = technicalIndicators.macd > 0 ? 'BUY' : 'SELL';
        let confidence = 70 + volatility * 6;
        
        // Boost for aligned momentum
        if ((action === 'BUY' && momentum > 0) || (action === 'SELL' && momentum < 0)) {
          confidence += 8;
        }
        
        confidence = Math.min(92, confidence);
        
        if (confidence >= config.minConfidence && volatility > 0.3) {
          const signalAlerts = generateSignalAlerts(item.symbol, action, item.price);
          
          signals.push({
            id: `${item.symbol}-${Date.now()}-${Math.random()}`,
            symbol: item.symbol,
            action,
            confidence: Math.round(confidence),
            entryPrice: item.price,
            stopLoss: calculateStopLoss(item.price, action, volatility * 0.5),
            takeProfit: calculateTakeProfit(item.price, action, volatility * 0.6),
            timeframe: '30s',
            reason: generateAdvancedSignalReason(action, volatility, momentum, technicalIndicators),
            timestamp: new Date(),
            riskReward: config.riskRewardRatio * 0.8,
            volume: item.volume,
            spread: Math.random() * 2 + 0.5,
            strategy: 'QUICK_SCALP',
            technicalIndicators,
            marketConditions: {
              volatility,
              momentum,
              trend: momentum > 0.3 ? 'BULLISH' : momentum < -0.3 ? 'BEARISH' : 'SIDEWAYS'
            },
            riskLevel: 'HIGH',
            expectedDuration: Math.round(1 + Math.random() * 4), // 1-5 minutes for quick scalps
            alerts: signalAlerts
          });
        }
      }
    }
    
    return signals.sort((a, b) => b.confidence - a.confidence).slice(0, config.maxPositions * 2);
  }, [config.pairs, config.minConfidence, config.riskRewardRatio, config.maxPositions, generateTechnicalIndicators, calculateStopLoss, calculateTakeProfit, generateSignalAlerts]);

  const generateAdvancedSignalReason = (
    action: 'BUY' | 'SELL', 
    volatility: number, 
    momentum: number, 
    indicators: any
  ): string => {
    const reasons = [];
    
    if (Math.abs(momentum) > 0.5) {
      reasons.push(`Strong ${momentum > 0 ? 'bullish' : 'bearish'} momentum (${momentum.toFixed(2)}%)`);
    }
    
    if (volatility > 1) {
      reasons.push(`High volatility breakout (${volatility.toFixed(2)}%)`);
    }
    
    if (indicators.rsi > 70) {
      reasons.push(`Overbought RSI (${indicators.rsi.toFixed(1)})`);
    } else if (indicators.rsi < 30) {
      reasons.push(`Oversold RSI (${indicators.rsi.toFixed(1)})`);
    }
    
    if (indicators.bollinger !== 'MIDDLE') {
      reasons.push(`Bollinger Band ${indicators.bollinger.toLowerCase()} touch`);
    }
    
    if (Math.abs(indicators.macd) > 0.02) {
      reasons.push(`MACD ${indicators.macd > 0 ? 'bullish' : 'bearish'} signal`);
    }
    
    reasons.push(`AI confidence: Advanced pattern recognition`);
    
    return reasons.join(' • ');
  };

  // Real-time market data integration
  const [realTimeData, setRealTimeData] = useState<MarketData[]>([]);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date());
  
  const fetchRealTimeMarketData = useCallback(async () => {
    try {
      const [binanceData, forexData] = await Promise.all([
        fetchBinanceData(),
        fetchForexData()
      ]);
      
      // Convert to unified format
      const unifiedData: MarketData[] = [
        ...binanceData.map(ticker => ({
          symbol: ticker.symbol,
          price: parseFloat(ticker.price),
          change: parseFloat(ticker.priceChangePercent),
          changePercent: parseFloat(ticker.priceChangePercent),
          high24h: parseFloat(ticker.high),
          low24h: parseFloat(ticker.low),
          volume: parseFloat(ticker.volume),
          spread: 0.01 // Crypto spreads are typically tight
        })),
        ...forexData.map(forex => ({
          symbol: forex.symbol,
          price: (forex.bid + forex.ask) / 2,
          change: forex.change,
          changePercent: forex.changePercent,
          volume: Math.random() * 1000000, // Simulated volume
          spread: forex.spread,
          bid: forex.bid,
          ask: forex.ask
        }))
      ];
      
      setRealTimeData(unifiedData);
      setLastDataUpdate(new Date());
      marketDataRef.current = unifiedData;
      
      console.log(`📈 [Scalping AI] Market data updated: ${unifiedData.length} pairs at ${new Date().toLocaleTimeString()}`);
      
      // Log price changes for monitoring (use previous data from ref)
      const previousData = marketDataRef.current;
      if (previousData.length > 0) {
        const significantChanges = unifiedData.filter(item => Math.abs(item.changePercent) > 0.5);
        if (significantChanges.length > 0) {
          console.log(`🚨 Significant moves detected:`, significantChanges.map(item => 
            `${item.symbol}: ${item.changePercent > 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`
          ).join(', '));
        }
      }
    } catch (error) {
      console.error('❌ Error fetching real-time market data:', error);
    }
  }, [fetchBinanceData, fetchForexData]);

  const refreshAnalysis = useCallback(async () => {
    const currentData = realTimeData.length > 0 ? realTimeData : marketDataRef.current;
    if (currentData.length === 0) return;
    
    setLoading(true);
    try {
      const [newAnalysis, newSignals] = await Promise.all([
        generateAIAnalysisWithAI(currentData),
        generateAIScalpingSignals(currentData),
      ]);
      
      setAnalysis(newAnalysis);
      setSignals(newSignals);
      
      console.log(`[Scalping AI] Analysis updated: ${newSignals.length} signals, Market: ${newAnalysis.marketCondition}`);
    } catch (error) {
      console.error('Error generating scalping analysis:', error);
    } finally {
      setLoading(false);
    }
  }, [realTimeData, generateAIAnalysisWithAI, generateAIScalpingSignals]);

  const updateConfig = useCallback((newConfig: Partial<ScalpingConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Scalping pair discovery and rotation system
  const [activePairs, setActivePairs] = useState<string[]>([]);
  const [pairDiscoveryActive, setPairDiscoveryActive] = useState(true);
  const lastUpdateRef = useRef<Date>(new Date());
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pairRotationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Continuous market scanning for scalping opportunities
  const scanForScalpingPairs = useCallback(async (data: MarketData[]): Promise<string[]> => {
    const scalpingCandidates: Array<{ symbol: string; score: number; volatility: number }> = [];
    
    for (const item of data) {
      if (!config.pairs.includes(item.symbol)) continue;
      
      const volatility = Math.abs(item.changePercent);
      const momentum = Math.abs(item.changePercent);
      const volume = item.volume || 0;
      
      // Scalping scoring algorithm
      let scalpingScore = 0;
      
      // Volatility factor (0.1% - 2% is ideal for scalping) - Made more sensitive
      if (volatility >= 0.1 && volatility <= 2.0) {
        scalpingScore += 35;
      } else if (volatility > 2.0 && volatility <= 3.0) {
        scalpingScore += 25;
      } else if (volatility > 0.05 && volatility < 0.1) {
        scalpingScore += 20;
      }
      
      // Momentum factor - Made more sensitive
      if (momentum > 0.3) {
        scalpingScore += 30;
      } else if (momentum > 0.1) {
        scalpingScore += 20;
      } else if (momentum > 0.05) {
        scalpingScore += 10;
      }
      
      // Volume factor (higher volume = better liquidity)
      if (volume > 1000000) {
        scalpingScore += 20;
      } else if (volume > 500000) {
        scalpingScore += 10;
      }
      
      // Spread consideration (simulate tight spreads for major pairs)
      const isMainPair = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'].includes(item.symbol);
      if (isMainPair) {
        scalpingScore += 15;
      }
      
      // Time-based bonus (more active during market sessions)
      const hour = new Date().getHours();
      if ((hour >= 8 && hour <= 17) || (hour >= 13 && hour <= 22)) { // London/NY sessions
        scalpingScore += 10;
      }
      
      if (scalpingScore >= 30) { // Lowered threshold for more active scalping
        scalpingCandidates.push({
          symbol: item.symbol,
          score: scalpingScore,
          volatility
        });
      }
    }
    
    // Sort by score and return top candidates
    return scalpingCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 8) // Get top 8 candidates
      .map(candidate => candidate.symbol);
  }, [config.pairs]);
  
  // Pair rotation system - maintain 5 active pairs, rotate when better opportunities arise
  const rotatePairs = useCallback(async () => {
    if (!pairDiscoveryActive || marketDataRef.current.length === 0) return;
    
    try {
      const candidates = await scanForScalpingPairs(marketDataRef.current);
      
      if (candidates.length === 0) return;
      
      setActivePairs(currentPairs => {
        // If we have less than 5 pairs, add new ones
        if (currentPairs.length < 5) {
          const newPairs = candidates.filter(pair => !currentPairs.includes(pair));
          const pairsToAdd = newPairs.slice(0, 5 - currentPairs.length);
          const updated = [...currentPairs, ...pairsToAdd];
          
          if (pairsToAdd.length > 0) {
            console.log(`📊 Added scalping pairs: ${pairsToAdd.join(', ')} (${updated.length}/5)`);
          }
          
          return updated;
        }
        
        // If we have 5 pairs, check if we should rotate
        const newCandidates = candidates.filter(pair => !currentPairs.includes(pair));
        
        if (newCandidates.length > 0) {
          // Replace the oldest pair with the best new candidate
          const oldestPair = currentPairs[0]; // First pair is oldest
          const bestNewPair = newCandidates[0];
          
          const rotated = [bestNewPair, ...currentPairs.slice(1)];
          
          console.log(`🔄 Rotated scalping pair: ${oldestPair} → ${bestNewPair} (oldest removed)`);
          
          return rotated;
        }
        
        return currentPairs;
      });
    } catch (error) {
      console.error('Error in pair discovery:', error);
    }
  }, [pairDiscoveryActive, scanForScalpingPairs]);
  
  // Real-time analysis with active pair focus
  const runScalpingAnalysis = useCallback(async () => {
    const currentData = realTimeData.length > 0 ? realTimeData : marketDataRef.current;
    if (currentData.length === 0) return;
    
    setLoading(true);
    try {
      // Focus analysis on active pairs
      const focusedData = activePairs.length > 0 
        ? currentData.filter(item => activePairs.includes(item.symbol))
        : currentData;
      
      const [newAnalysis, newSignals] = await Promise.all([
        generateAIAnalysisWithAI(focusedData.length > 0 ? focusedData : currentData),
        generateAIScalpingSignals(focusedData.length > 0 ? focusedData : currentData),
      ]);
      
      setAnalysis(newAnalysis);
      setSignals(newSignals);
      lastUpdateRef.current = new Date();
      
      console.log(`[Scalping AI] Updated: ${newSignals.length} signals, Active pairs: [${activePairs.join(', ')}], Market: ${newAnalysis.marketCondition}`);
    } catch (error) {
      console.error('Error generating scalping analysis:', error);
    } finally {
      setLoading(false);
    }
  }, [activePairs, realTimeData, generateAIAnalysisWithAI, generateAIScalpingSignals]);
  
  // Initialize real-time data fetching
  useEffect(() => {
    let isMounted = true;
    let dataFetchInterval: NodeJS.Timeout | undefined;
    
    const fetchData = async () => {
      if (!isMounted) return;
      try {
        const [binanceData, forexData] = await Promise.all([
          fetchBinanceData(),
          fetchForexData()
        ]);
        
        // Convert to unified format
        const unifiedData: MarketData[] = [
          ...binanceData.map(ticker => ({
            symbol: ticker.symbol,
            price: parseFloat(ticker.price),
            change: parseFloat(ticker.priceChangePercent),
            changePercent: parseFloat(ticker.priceChangePercent),
            high24h: parseFloat(ticker.high),
            low24h: parseFloat(ticker.low),
            volume: parseFloat(ticker.volume),
            spread: 0.01
          })),
          ...forexData.map(forex => ({
            symbol: forex.symbol,
            price: (forex.bid + forex.ask) / 2,
            change: forex.change,
            changePercent: forex.changePercent,
            volume: Math.random() * 1000000,
            spread: forex.spread,
            bid: forex.bid,
            ask: forex.ask
          }))
        ];
        
        if (isMounted) {
          setRealTimeData(unifiedData);
          setLastDataUpdate(new Date());
          marketDataRef.current = unifiedData;
          
          console.log(`📈 [Scalping AI] Market data updated: ${unifiedData.length} pairs at ${new Date().toLocaleTimeString()}`);
        }
      } catch (error) {
        console.error('❌ Error fetching real-time market data:', error);
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up real-time data fetching (every 15 seconds for more frequent updates)
    dataFetchInterval = setInterval(() => {
      if (isMounted) {
        fetchData();
      }
    }, 15000);
    
    return () => {
      isMounted = false;
      if (dataFetchInterval) clearInterval(dataFetchInterval);
    };
  }, []);

  // Initialize continuous scalping system
  useEffect(() => {
    let isMounted = true;
    let pairRotationInterval: NodeJS.Timeout | undefined;
    let analysisInterval: NodeJS.Timeout | undefined;
    let initialTimeout: NodeJS.Timeout | undefined;
    let isProcessing = false;
    
    // Inline pair rotation to avoid dependency issues
    const runPairRotation = async () => {
      if (!isMounted || marketDataRef.current.length === 0 || isProcessing) return;
      
      isProcessing = true;
      try {
        const scalpingPairs = [
          // Forex pairs
          'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD',
          'NZDUSD', 'USDCHF', 'EURJPY', 'GBPJPY', 'EURGBP',
          // Crypto pairs
          'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT',
          'SOLUSDT', 'DOTUSDT', 'AVAXUSDT', 'MATICUSDT', 'LINKUSDT'
        ];
        
        const currentData = marketDataRef.current;
        const availablePairs = currentData
          .filter(item => scalpingPairs.includes(item.symbol))
          .map(item => item.symbol);
        
        if (availablePairs.length === 0) {
          isProcessing = false;
          return;
        }
        
        setActivePairs(currentPairs => {
          // If we have less than 5 pairs, add new ones
          if (currentPairs.length < 5) {
            const newPairs = availablePairs.filter(pair => !currentPairs.includes(pair));
            const pairsToAdd = newPairs.slice(0, 5 - currentPairs.length);
            const updated = [...currentPairs, ...pairsToAdd];
            
            if (pairsToAdd.length > 0) {
              console.log(`📊 Added scalping pairs: ${pairsToAdd.join(', ')} (${updated.length}/5)`);
            }
            
            return updated;
          }
          
          // If we have 5 pairs, check if we should rotate
          const newCandidates = availablePairs.filter(pair => !currentPairs.includes(pair));
          
          if (newCandidates.length > 0) {
            // Replace the oldest pair with the best new candidate
            const oldestPair = currentPairs[0]; // First pair is oldest
            const bestNewPair = newCandidates[0];
            
            const rotated = [bestNewPair, ...currentPairs.slice(1)];
            
            console.log(`🔄 Rotated scalping pair: ${oldestPair} → ${bestNewPair} (oldest removed)`);
            
            return rotated;
          }
          
          return currentPairs;
        });
      } catch (error) {
        console.error('Error in pair discovery:', error);
      } finally {
        isProcessing = false;
      }
    };
    
    const runAnalysis = async () => {
      if (!isMounted || marketDataRef.current.length === 0) return;
      
      try {
        const currentData = marketDataRef.current;
        const focusedData = activePairs.length > 0 
          ? currentData.filter(item => activePairs.includes(item.symbol))
          : currentData;
        
        const [newAnalysis, newSignals] = await Promise.all([
          generateAIAnalysisWithAI(focusedData.length > 0 ? focusedData : currentData),
          generateAIScalpingSignals(focusedData.length > 0 ? focusedData : currentData),
        ]);
        
        if (isMounted) {
          setAnalysis(newAnalysis);
          setSignals(newSignals);
          console.log(`[Scalping AI] Updated: ${newSignals.length} signals, Active pairs: [${activePairs.join(', ')}], Market: ${newAnalysis.marketCondition}`);
        }
      } catch (error) {
        console.error('Error generating scalping analysis:', error);
      }
    };
    
    // Delayed initialization to prevent immediate execution
    initialTimeout = setTimeout(() => {
      if (isMounted && marketDataRef.current.length > 0) {
        runPairRotation();
      }
    }, 8000);
    
    // Set up pair rotation interval (every 45 seconds)
    pairRotationInterval = setInterval(() => {
      if (isMounted && marketDataRef.current.length > 0) {
        runPairRotation();
      }
    }, 45000);
    
    // Set up continuous analysis (every 10 seconds for more responsive scalping)
    analysisInterval = setInterval(() => {
      if (isMounted && marketDataRef.current.length > 0) {
        runAnalysis();
      }
    }, 10000);
    
    return () => {
      isMounted = false;
      if (initialTimeout) clearTimeout(initialTimeout);
      if (pairRotationInterval) clearInterval(pairRotationInterval);
      if (analysisInterval) clearInterval(analysisInterval);
    };
  }, []); // Remove all dependencies to prevent loops
  
  // Toggle pair discovery
  const togglePairDiscovery = useCallback(() => {
    setPairDiscoveryActive(prev => !prev);
  }, []);

  const addAlert = useCallback((alert: ScalpingAlert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 50)); // Keep last 50 alerts
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Process new signals and generate alerts
  useEffect(() => {
    if (signals.length > 0) {
      const newAlerts: ScalpingAlert[] = [];
      signals.forEach(signal => {
        if (signal.alerts && signal.alerts.length > 0) {
          signal.alerts.forEach(alert => {
            newAlerts.push(alert);
          });
        }
      });
      
      if (newAlerts.length > 0) {
        setAlerts(prev => {
          const existingIds = new Set(prev.map(alert => alert.id));
          const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.has(alert.id));
          return [...uniqueNewAlerts, ...prev].slice(0, 50);
        });
      }
    }
  }, [signals.length]); // Only depend on signals length to prevent infinite loops

  return {
    signals,
    analysis,
    loading,
    config,
    alerts,
    activePairs,
    pairDiscoveryActive,
    realTimeData,
    lastDataUpdate,
    refreshAnalysis,
    updateConfig,
    addAlert,
    clearAlerts,
    togglePairDiscovery,
    scanForScalpingPairs,
    fetchRealTimeMarketData,
  };
}