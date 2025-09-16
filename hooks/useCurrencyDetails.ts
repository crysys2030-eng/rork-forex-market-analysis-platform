import { useState, useEffect } from 'react';
import { CurrencyDetail, SeasonalPattern, LiquidityData } from '@/types/forex';

export function useCurrencyDetails(symbol?: string) {
  const [currencyDetails, setCurrencyDetails] = useState<CurrencyDetail[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDetail | null>(null);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [liquidityData, setLiquidityData] = useState<LiquidityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateCurrencyDetails = () => {
    const currencies = [
      { symbol: 'EUR', name: 'Euro', country: 'European Union', flag: '🇪🇺' },
      { symbol: 'USD', name: 'US Dollar', country: 'United States', flag: '🇺🇸' },
      { symbol: 'GBP', name: 'British Pound', country: 'United Kingdom', flag: '🇬🇧' },
      { symbol: 'JPY', name: 'Japanese Yen', country: 'Japan', flag: '🇯🇵' },
      { symbol: 'CHF', name: 'Swiss Franc', country: 'Switzerland', flag: '🇨🇭' },
      { symbol: 'AUD', name: 'Australian Dollar', country: 'Australia', flag: '🇦🇺' },
      { symbol: 'CAD', name: 'Canadian Dollar', country: 'Canada', flag: '🇨🇦' },
      { symbol: 'NZD', name: 'New Zealand Dollar', country: 'New Zealand', flag: '🇳🇿' },
    ];

    const details: CurrencyDetail[] = currencies.map(currency => {
      const basePrice = currency.symbol === 'JPY' ? 149.5 : 1.2;
      const change = (Math.random() - 0.5) * 0.02;
      
      return {
        symbol: currency.symbol,
        name: currency.name,
        country: currency.country,
        flag: currency.flag,
        currentPrice: basePrice + change,
        change24h: change,
        changePercent24h: (change / basePrice) * 100,
        volume24h: Math.floor(Math.random() * 1000000) + 500000,
        marketCap: Math.floor(Math.random() * 50000000) + 10000000,
        trend: {
          short: ['up', 'down', 'sideways'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'sideways',
          medium: ['up', 'down', 'sideways'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'sideways',
          long: ['up', 'down', 'sideways'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'sideways',
        },
        technicals: {
          rsi: Math.floor(Math.random() * 60) + 20,
          macd: (Math.random() - 0.5) * 0.002,
          sma20: basePrice * (1 + (Math.random() - 0.5) * 0.01),
          sma50: basePrice * (1 + (Math.random() - 0.5) * 0.02),
          sma200: basePrice * (1 + (Math.random() - 0.5) * 0.05),
          bollinger: {
            upper: basePrice * 1.01,
            middle: basePrice,
            lower: basePrice * 0.99,
          },
        },
        fundamentals: {
          interestRate: Math.random() * 5,
          inflation: Math.random() * 4 + 1,
          gdpGrowth: Math.random() * 4 - 1,
          unemployment: Math.random() * 8 + 2,
        },
        sentiment: {
          retail: Math.floor(Math.random() * 100),
          institutional: Math.floor(Math.random() * 100),
          overall: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as 'bullish' | 'bearish' | 'neutral',
        },
      };
    });

    // Generate seasonal patterns
    const patterns: SeasonalPattern[] = currencies.slice(0, 4).map(currency => ({
      symbol: currency.symbol,
      month: new Date().getMonth() + 1,
      averageReturn: (Math.random() - 0.5) * 4,
      winRate: Math.floor(Math.random() * 30) + 60,
      volatility: Math.random() * 2 + 0.5,
      bestDays: ['Monday', 'Tuesday', 'Wednesday'].slice(0, Math.floor(Math.random() * 3) + 1),
      worstDays: ['Thursday', 'Friday'].slice(0, Math.floor(Math.random() * 2) + 1),
    }));

    // Generate liquidity data
    const liquidity: LiquidityData[] = currencies.slice(0, 6).map(currency => ({
      symbol: currency.symbol,
      bidAskSpread: Math.random() * 0.0005 + 0.0001,
      marketDepth: Math.floor(Math.random() * 1000000) + 100000,
      orderBookImbalance: (Math.random() - 0.5) * 0.2,
      liquidityScore: Math.floor(Math.random() * 30) + 70,
      optimalTradingTimes: ['08:00-12:00 GMT', '13:00-17:00 GMT', '20:00-24:00 GMT'].slice(0, Math.floor(Math.random() * 3) + 1),
    }));

    setCurrencyDetails(details);
    setSeasonalPatterns(patterns);
    setLiquidityData(liquidity);

    if (symbol) {
      const selected = details.find(d => d.symbol === symbol);
      setSelectedCurrency(selected || null);
    }
  };

  const selectCurrency = (currencySymbol: string) => {
    const selected = currencyDetails.find(d => d.symbol === currencySymbol);
    setSelectedCurrency(selected || null);
  };

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      generateCurrencyDetails();
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateCurrencyDetails();
  }, [symbol]);

  return {
    currencyDetails,
    selectedCurrency,
    seasonalPatterns,
    liquidityData,
    isLoading,
    selectCurrency,
    refetch,
  };
}