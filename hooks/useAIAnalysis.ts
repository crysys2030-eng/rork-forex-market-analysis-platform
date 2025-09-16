import { useState, useEffect, useCallback } from 'react';
import { AIAnalysis, AdvancedPattern, MarketRegime, VolatilityAnalysis, LiquidityData, SeasonalPattern } from '@/types/forex';

export function useAIAnalysis() {
  const [aiAnalyses, setAiAnalyses] = useState<AIAnalysis[]>([]);
  const [patterns, setPatterns] = useState<AdvancedPattern[]>([]);
  const [marketRegime, setMarketRegime] = useState<MarketRegime | null>(null);
  const [volatilityData, setVolatilityData] = useState<VolatilityAnalysis[]>([]);
  const [liquidityData, setLiquidityData] = useState<LiquidityData[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);

  const generateRealTimeAIAnalysis = useCallback(async (abortSignal?: AbortSignal) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000); // Reduced to 10 second timeout
      
      // Use external abort signal if provided, otherwise use internal controller
      const signal = abortSignal || controller.signal;
      
      // Check if already aborted before making request
      if (signal.aborted) {
        clearTimeout(timeoutId);
        return;
      }
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert forex AI analyst. Analyze current market conditions and provide trading insights with high accuracy predictions. Focus on technical analysis, sentiment, and market structure.'
            },
            {
              role: 'user',
              content: 'Analyze the current forex market conditions for major pairs (EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD, EURJPY). Provide specific trading signals with confidence levels, price targets, and risk assessments. Include market regime analysis and volatility forecasts.'
            }
          ]
        }),
        signal
      });
      
      clearTimeout(timeoutId);
      
      // Check if aborted after request completes
      if (signal.aborted) {
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const aiResponse = await response.json();
      
      // Final check before updating state
      if (signal.aborted) {
        return;
      }
      
      console.log('AI Market Analysis:', aiResponse.completion);
      
      setAiPredictions(prev => {
        const newPrediction = {
          timestamp: new Date(),
          analysis: aiResponse.completion || 'Market analysis in progress...',
          confidence: Math.floor(Math.random() * 20) + 80
        };
        // Keep only last 10 predictions to prevent memory issues
        return [...prev.slice(-9), newPrediction];
      });
    } catch (error) {
      // Silently handle aborted requests - this is expected behavior
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      // Only log and handle non-abort errors
      if (error instanceof Error) {
        console.log('AI Analysis service unavailable, using fallback data');
        
        // Add fallback analysis only for real errors
        setAiPredictions(prev => {
          const fallbackPrediction = {
            timestamp: new Date(),
            analysis: 'AI service temporarily unavailable. Using technical analysis: Market showing mixed signals with moderate volatility. Key levels to watch for major pairs.',
            confidence: 65
          };
          return [...prev.slice(-9), fallbackPrediction];
        });
      }
    }
  }, []);

  const generateAIAnalysis = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate AI analysis generation
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURJPY'];
    const predictions: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    const timeframes = ['H1', 'H4', 'D1', 'W1'];
    const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

    const analyses: AIAnalysis[] = symbols.map(symbol => {
      const prediction = predictions[Math.floor(Math.random() * predictions.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      const basePrice = symbol === 'USDJPY' ? 149.5 : 1.2;
      
      return {
        symbol,
        prediction,
        confidence,
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        priceTarget: basePrice * (prediction === 'bullish' ? 1.02 : 0.98),
        reasoning: [
          'Neural network pattern recognition detected strong momentum',
          'LSTM model confirms trend continuation probability',
          'Sentiment analysis shows institutional alignment',
          'Volume profile supports directional bias',
          'Multi-timeframe confluence identified'
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        accuracy: Math.floor(Math.random() * 15) + 85, // 85-100%
        lastUpdated: new Date(),
      };
    });

    // Generate advanced patterns
    const patternTypes = [
      'Head and Shoulders', 'Double Top', 'Double Bottom', 'Triangle',
      'Flag', 'Pennant', 'Cup and Handle', 'Inverse Head and Shoulders'
    ];
    
    const advancedPatterns: AdvancedPattern[] = Array.from({ length: 8 }, (_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const pattern = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      const type: 'continuation' | 'reversal' = Math.random() > 0.5 ? 'continuation' : 'reversal';
      const basePrice = symbol === 'USDJPY' ? 149.5 : 1.2;
      
      return {
        id: `pattern-${i}`,
        symbol,
        pattern,
        type,
        confidence: Math.floor(Math.random() * 25) + 75,
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        entryPrice: basePrice + (Math.random() - 0.5) * 0.05,
        targetPrice: basePrice * (type === 'continuation' ? 1.015 : 0.985),
        stopLoss: basePrice * (type === 'continuation' ? 0.995 : 1.005),
        probability: Math.floor(Math.random() * 20) + 80,
        aiConfirmed: Math.random() > 0.3,
        description: `AI-detected ${pattern} pattern with ${type} bias`
      };
    });

    // Generate market regime
    const regimeTypes: ('trending' | 'ranging' | 'volatile' | 'calm')[] = ['trending', 'ranging', 'volatile', 'calm'];
    const currentRegime = regimeTypes[Math.floor(Math.random() * regimeTypes.length)];
    
    const regime: MarketRegime = {
      type: currentRegime,
      strength: Math.floor(Math.random() * 40) + 60,
      duration: Math.floor(Math.random() * 10) + 5,
      description: `Market is currently in a ${currentRegime} regime with ${Math.floor(Math.random() * 40) + 60}% strength`,
      tradingStrategy: currentRegime === 'trending' 
        ? ['Follow momentum', 'Use trend-following indicators', 'Avoid counter-trend trades']
        : ['Look for range boundaries', 'Use oscillators', 'Take profits quickly']
    };

    // Generate volatility analysis
    const volatilityAnalyses: VolatilityAnalysis[] = symbols.slice(0, 6).map(symbol => ({
      symbol,
      current: Math.random() * 2 + 0.5,
      average: Math.random() * 1.5 + 0.8,
      percentile: Math.floor(Math.random() * 100),
      trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable',
      forecast: Array.from({ length: 7 }, () => Math.random() * 2 + 0.5)
    }));

    // Generate liquidity data
    const liquidityAnalyses: LiquidityData[] = symbols.slice(0, 6).map(symbol => ({
      symbol,
      bidAskSpread: Math.random() * 2 + 0.5,
      marketDepth: Math.random() * 100 + 50,
      orderBookImbalance: (Math.random() - 0.5) * 20,
      liquidityScore: Math.floor(Math.random() * 40) + 60,
      optimalTradingTimes: ['08:00-12:00 GMT', '13:00-17:00 GMT', '20:00-24:00 GMT']
    }));

    // Generate seasonal patterns
    const seasonalAnalyses: SeasonalPattern[] = symbols.slice(0, 4).map(symbol => ({
      symbol,
      month: new Date().getMonth() + 1,
      averageReturn: (Math.random() - 0.5) * 4,
      winRate: Math.floor(Math.random() * 30) + 60,
      volatility: Math.random() * 2 + 0.8,
      bestDays: ['Monday', 'Tuesday', 'Wednesday'],
      worstDays: ['Friday']
    }));

    setTimeout(() => {
      setAiAnalyses(analyses);
      setPatterns(advancedPatterns);
      setMarketRegime(regime);
      setVolatilityData(volatilityAnalyses);
      setLiquidityData(liquidityAnalyses);
      setSeasonalPatterns(seasonalAnalyses);
      setIsLoading(false);
    }, 1500);
  }, []);

  const refetch = () => {
    generateAIAnalysis();
  };

  useEffect(() => {
    let isMounted = true;
    let aiAnalysisTimeout: NodeJS.Timeout;
    let aiAnalysisInterval: NodeJS.Timeout;
    const abortController = new AbortController();
    
    const initializeAnalysis = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      
      // Simulate AI analysis generation
      const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURJPY'];
      const predictions: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
      const timeframes = ['H1', 'H4', 'D1', 'W1'];
      const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

      const analyses: AIAnalysis[] = symbols.map(symbol => {
        const prediction = predictions[Math.floor(Math.random() * predictions.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
        const basePrice = symbol === 'USDJPY' ? 149.5 : 1.2;
        
        return {
          symbol,
          prediction,
          confidence,
          timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
          priceTarget: basePrice * (prediction === 'bullish' ? 1.02 : 0.98),
          reasoning: [
            'Neural network pattern recognition detected strong momentum',
            'LSTM model confirms trend continuation probability',
            'Sentiment analysis shows institutional alignment',
            'Volume profile supports directional bias',
            'Multi-timeframe confluence identified'
          ].slice(0, Math.floor(Math.random() * 3) + 2),
          riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
          accuracy: Math.floor(Math.random() * 15) + 85, // 85-100%
          lastUpdated: new Date(),
        };
      });

      // Generate advanced patterns
      const patternTypes = [
        'Head and Shoulders', 'Double Top', 'Double Bottom', 'Triangle',
        'Flag', 'Pennant', 'Cup and Handle', 'Inverse Head and Shoulders'
      ];
      
      const advancedPatterns: AdvancedPattern[] = Array.from({ length: 8 }, (_, i) => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const pattern = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const type: 'continuation' | 'reversal' = Math.random() > 0.5 ? 'continuation' : 'reversal';
        const basePrice = symbol === 'USDJPY' ? 149.5 : 1.2;
        
        return {
          id: `pattern-${i}`,
          symbol,
          pattern,
          type,
          confidence: Math.floor(Math.random() * 25) + 75,
          timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
          entryPrice: basePrice + (Math.random() - 0.5) * 0.05,
          targetPrice: basePrice * (type === 'continuation' ? 1.015 : 0.985),
          stopLoss: basePrice * (type === 'continuation' ? 0.995 : 1.005),
          probability: Math.floor(Math.random() * 20) + 80,
          aiConfirmed: Math.random() > 0.3,
          description: `AI-detected ${pattern} pattern with ${type} bias`
        };
      });

      // Generate market regime
      const regimeTypes: ('trending' | 'ranging' | 'volatile' | 'calm')[] = ['trending', 'ranging', 'volatile', 'calm'];
      const currentRegime = regimeTypes[Math.floor(Math.random() * regimeTypes.length)];
      
      const regime: MarketRegime = {
        type: currentRegime,
        strength: Math.floor(Math.random() * 40) + 60,
        duration: Math.floor(Math.random() * 10) + 5,
        description: `Market is currently in a ${currentRegime} regime with ${Math.floor(Math.random() * 40) + 60}% strength`,
        tradingStrategy: currentRegime === 'trending' 
          ? ['Follow momentum', 'Use trend-following indicators', 'Avoid counter-trend trades']
          : ['Look for range boundaries', 'Use oscillators', 'Take profits quickly']
      };

      // Generate volatility analysis
      const volatilityAnalyses: VolatilityAnalysis[] = symbols.slice(0, 6).map(symbol => ({
        symbol,
        current: Math.random() * 2 + 0.5,
        average: Math.random() * 1.5 + 0.8,
        percentile: Math.floor(Math.random() * 100),
        trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable',
        forecast: Array.from({ length: 7 }, () => Math.random() * 2 + 0.5)
      }));

      // Generate liquidity data
      const liquidityAnalyses: LiquidityData[] = symbols.slice(0, 6).map(symbol => ({
        symbol,
        bidAskSpread: Math.random() * 2 + 0.5,
        marketDepth: Math.random() * 100 + 50,
        orderBookImbalance: (Math.random() - 0.5) * 20,
        liquidityScore: Math.floor(Math.random() * 40) + 60,
        optimalTradingTimes: ['08:00-12:00 GMT', '13:00-17:00 GMT', '20:00-24:00 GMT']
      }));

      // Generate seasonal patterns
      const seasonalAnalyses: SeasonalPattern[] = symbols.slice(0, 4).map(symbol => ({
        symbol,
        month: new Date().getMonth() + 1,
        averageReturn: (Math.random() - 0.5) * 4,
        winRate: Math.floor(Math.random() * 30) + 60,
        volatility: Math.random() * 2 + 0.8,
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        worstDays: ['Friday']
      }));

      setTimeout(() => {
        if (!isMounted || abortController.signal.aborted) return;
        
        setAiAnalyses(analyses);
        setPatterns(advancedPatterns);
        setMarketRegime(regime);
        setVolatilityData(volatilityAnalyses);
        setLiquidityData(liquidityAnalyses);
        setSeasonalPatterns(seasonalAnalyses);
        setIsLoading(false);
        
        // Generate real-time AI analysis with delay to avoid concurrent requests
        aiAnalysisTimeout = setTimeout(() => {
          if (isMounted && !abortController.signal.aborted) {
            generateRealTimeAIAnalysis(abortController.signal).catch((error) => {
              // Silently handle all errors in background updates
              if (error instanceof Error && error.name !== 'AbortError') {
                // Background update failed, but don't log to avoid spam
              }
            });
          }
        }, 3000);
        
        // Set up periodic AI analysis updates (every 2 minutes)
        aiAnalysisInterval = setInterval(() => {
          if (isMounted && !abortController.signal.aborted) {
            generateRealTimeAIAnalysis(abortController.signal).catch((error) => {
              // Silently handle all errors in background updates
              if (error instanceof Error && error.name !== 'AbortError') {
                // Background update failed, but don't log to avoid spam
              }
            });
          }
        }, 120000); // 2 minutes
      }, 1500);
    };
    
    initializeAnalysis();
    
    return () => {
      isMounted = false;
      abortController.abort();
      if (aiAnalysisTimeout) {
        clearTimeout(aiAnalysisTimeout);
      }
      if (aiAnalysisInterval) {
        clearInterval(aiAnalysisInterval);
      }
    };
  }, [generateRealTimeAIAnalysis]);

  return {
    aiAnalyses,
    patterns,
    marketRegime,
    volatilityData,
    liquidityData,
    seasonalPatterns,
    aiPredictions,
    isLoading,
    refetch,
    generateRealTimeAIAnalysis,
  };
}