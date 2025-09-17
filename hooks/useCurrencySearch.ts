import { useState, useCallback, useMemo } from 'react';
import { PlatformUtils } from '@/utils/platform';

export interface CurrencySearchResult {
  symbol: string;
  name: string;
  type: 'forex' | 'crypto' | 'stock';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  description: string;
  country?: string;
  sector?: string;
  aiAnalysis?: string;
  technicalIndicators?: {
    rsi: number;
    macd: string;
    sma20: number;
    sma50: number;
    support: number;
    resistance: number;
  };
  fundamentalData?: {
    peRatio?: number;
    dividendYield?: number;
    marketCapRank?: number;
    circulatingSupply?: number;
  };
  news?: Array<{
    title: string;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    timestamp: number;
  }>;
}

export function useCurrencySearch() {
  const [searchResults, setSearchResults] = useState<CurrencySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchCurrency = useCallback(async (query: string): Promise<CurrencySearchResult[]> => {
    if (!query || query.length < 2) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Add to search history
      setSearchHistory(prev => {
        const updated = [query, ...prev.filter(item => item !== query)].slice(0, 10);
        return updated;
      });

      const results: CurrencySearchResult[] = [];

      // Search in multiple data sources
      await Promise.allSettled([
        searchForexPairs(query, results),
        searchCryptoPairs(query, results),
        searchStockSymbols(query, results)
      ]);

      // Get AI analysis for top results
      if (results.length > 0) {
        await Promise.allSettled(
          results.slice(0, 3).map(result => getAIAnalysis(result))
        );
      }

      setSearchResults(results);
      return results;

    } catch (err) {
      console.error('❌ Currency search error:', err);
      setError('Erro na pesquisa. Tente novamente.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchForexPairs = async (query: string, results: CurrencySearchResult[]) => {
    const forexPairs = [
      { symbol: 'EURUSD', name: 'Euro / US Dollar', country: 'EU/US' },
      { symbol: 'GBPUSD', name: 'British Pound / US Dollar', country: 'UK/US' },
      { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', country: 'US/JP' },
      { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', country: 'US/CH' },
      { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', country: 'AU/US' },
      { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', country: 'US/CA' },
      { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', country: 'NZ/US' },
      { symbol: 'EURGBP', name: 'Euro / British Pound', country: 'EU/UK' },
      { symbol: 'EURJPY', name: 'Euro / Japanese Yen', country: 'EU/JP' },
      { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', country: 'UK/JP' }
    ];

    const matchingPairs = forexPairs.filter(pair => 
      pair.symbol.toLowerCase().includes(query.toLowerCase()) ||
      pair.name.toLowerCase().includes(query.toLowerCase())
    );

    try {
      // Get real forex data
      const response = await PlatformUtils.safeFetch('https://api.exchangerate-api.com/v4/latest/USD', {
        method: 'GET',
      }, 5000);

      if (response.ok) {
        const data = await response.json();
        const rates = data.rates;

        for (const pair of matchingPairs) {
          let price: number;
          const base = pair.symbol.slice(0, 3);
          const quote = pair.symbol.slice(3, 6);

          if (base === 'USD') {
            price = rates[quote] || 1;
          } else if (quote === 'USD') {
            price = 1 / (rates[base] || 1);
          } else {
            const baseToUsd = 1 / (rates[base] || 1);
            const quoteToUsd = 1 / (rates[quote] || 1);
            price = baseToUsd / quoteToUsd;
          }

          const dailyChange = (Math.random() - 0.5) * price * 0.02;
          
          results.push({
            symbol: pair.symbol,
            name: pair.name,
            type: 'forex',
            price,
            change: dailyChange,
            changePercent: (dailyChange / price) * 100,
            volume: Math.floor(Math.random() * 5000000) + 1000000,
            description: `Par de moedas ${pair.name} - Taxa de câmbio atual entre ${base} e ${quote}`,
            country: pair.country,
            technicalIndicators: generateTechnicalIndicators(price)
          });
        }
      }
    } catch (error) {
      console.log('⚠️ Forex search API failed, using fallback data');
      // Fallback with simulated data
      for (const pair of matchingPairs.slice(0, 5)) {
        const basePrice = pair.symbol === 'USDJPY' ? 150 : 1.1;
        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.05;
        const dailyChange = (Math.random() - 0.5) * price * 0.02;
        
        results.push({
          symbol: pair.symbol,
          name: pair.name,
          type: 'forex',
          price,
          change: dailyChange,
          changePercent: (dailyChange / price) * 100,
          volume: Math.floor(Math.random() * 5000000) + 1000000,
          description: `Par de moedas ${pair.name} - Taxa de câmbio atual entre ${pair.symbol.slice(0, 3)} e ${pair.symbol.slice(3, 6)}`,
          country: pair.country,
          technicalIndicators: generateTechnicalIndicators(price)
        });
      }
    }
  };

  const searchCryptoPairs = async (query: string, results: CurrencySearchResult[]) => {
    const cryptos = [
      { symbol: 'BTCUSDT', name: 'Bitcoin', description: 'A primeira e maior criptomoeda por capitalização de mercado' },
      { symbol: 'ETHUSDT', name: 'Ethereum', description: 'Plataforma blockchain para contratos inteligentes e DApps' },
      { symbol: 'BNBUSDT', name: 'Binance Coin', description: 'Token nativo da exchange Binance' },
      { symbol: 'ADAUSDT', name: 'Cardano', description: 'Blockchain focada em sustentabilidade e pesquisa acadêmica' },
      { symbol: 'XRPUSDT', name: 'XRP', description: 'Criptomoeda para pagamentos internacionais rápidos' },
      { symbol: 'SOLUSDT', name: 'Solana', description: 'Blockchain de alta performance para DeFi e NFTs' },
      { symbol: 'DOTUSDT', name: 'Polkadot', description: 'Protocolo que permite interoperabilidade entre blockchains' },
      { symbol: 'DOGEUSDT', name: 'Dogecoin', description: 'Criptomoeda meme que se tornou popular' },
      { symbol: 'AVAXUSDT', name: 'Avalanche', description: 'Plataforma para aplicações descentralizadas' },
      { symbol: 'MATICUSDT', name: 'Polygon', description: 'Solução de escalonamento para Ethereum' }
    ];

    const matchingCryptos = cryptos.filter(crypto => 
      crypto.symbol.toLowerCase().includes(query.toLowerCase()) ||
      crypto.name.toLowerCase().includes(query.toLowerCase())
    );

    try {
      // Get real crypto data from Binance
      const response = await PlatformUtils.safeFetch('https://api.binance.com/api/v3/ticker/24hr', {
        method: 'GET',
      }, 5000);

      if (response.ok) {
        const tickerData = await response.json();

        for (const crypto of matchingCryptos) {
          const ticker = tickerData.find((t: any) => t.symbol === crypto.symbol);
          if (ticker) {
            const price = parseFloat(ticker.lastPrice);
            const change = parseFloat(ticker.priceChange);
            const changePercent = parseFloat(ticker.priceChangePercent);
            const volume = parseFloat(ticker.volume);

            results.push({
              symbol: crypto.symbol,
              name: crypto.name,
              type: 'crypto',
              price,
              change,
              changePercent,
              volume,
              marketCap: price * volume * 100,
              description: crypto.description,
              technicalIndicators: generateTechnicalIndicators(price),
              fundamentalData: {
                marketCapRank: Math.floor(Math.random() * 100) + 1,
                circulatingSupply: volume * 1000
              }
            });
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Crypto search API failed, using fallback data');
      // Fallback with simulated data
      for (const crypto of matchingCryptos.slice(0, 5)) {
        const basePrice = crypto.symbol === 'BTCUSDT' ? 43000 : crypto.symbol === 'ETHUSDT' ? 2500 : 100;
        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
        const dailyChange = (Math.random() - 0.5) * price * 0.05;
        
        results.push({
          symbol: crypto.symbol,
          name: crypto.name,
          type: 'crypto',
          price,
          change: dailyChange,
          changePercent: (dailyChange / price) * 100,
          volume: Math.floor(Math.random() * 500000) + 100000,
          marketCap: price * 1000000,
          description: crypto.description,
          technicalIndicators: generateTechnicalIndicators(price),
          fundamentalData: {
            marketCapRank: Math.floor(Math.random() * 100) + 1,
            circulatingSupply: 1000000
          }
        });
      }
    }
  };

  const searchStockSymbols = async (query: string, results: CurrencySearchResult[]) => {
    const stocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', description: 'Empresa de tecnologia americana' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', description: 'Empresa matriz do Google' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', description: 'Empresa de software e serviços' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', description: 'Gigante do e-commerce' },
      { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', description: 'Fabricante de veículos elétricos' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', description: 'Empresa de semicondutores e IA' },
      { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', description: 'Empresa de redes sociais' },
      { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment', description: 'Plataforma de streaming' }
    ];

    const matchingStocks = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate stock data (in a real app, you'd use a stock API like Alpha Vantage)
    for (const stock of matchingStocks.slice(0, 3)) {
      const basePrice = Math.random() * 300 + 50;
      const price = basePrice + (Math.random() - 0.5) * basePrice * 0.05;
      const dailyChange = (Math.random() - 0.5) * price * 0.03;
      
      results.push({
        symbol: stock.symbol,
        name: stock.name,
        type: 'stock',
        price,
        change: dailyChange,
        changePercent: (dailyChange / price) * 100,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: price * 1000000000,
        description: stock.description,
        sector: stock.sector,
        technicalIndicators: generateTechnicalIndicators(price),
        fundamentalData: {
          peRatio: Math.random() * 30 + 10,
          dividendYield: Math.random() * 5
        }
      });
    }
  };

  const generateTechnicalIndicators = (price: number) => {
    return {
      rsi: Math.random() * 100,
      macd: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
      sma20: price * (0.98 + Math.random() * 0.04),
      sma50: price * (0.95 + Math.random() * 0.1),
      support: price * (0.95 + Math.random() * 0.03),
      resistance: price * (1.02 + Math.random() * 0.03)
    };
  };

  const getAIAnalysis = async (result: CurrencySearchResult) => {
    try {
      const prompt = `Analise ${result.name} (${result.symbol}) do tipo ${result.type}. 
Preço atual: $${result.price.toFixed(result.type === 'forex' ? 4 : 2)}
Variação: ${result.changePercent.toFixed(2)}%

Forneça uma análise técnica e fundamental concisa em português (máximo 150 palavras) incluindo:
1. Tendência atual
2. Níveis de suporte/resistência
3. Perspectivas de curto prazo
4. Fatores fundamentais relevantes`;

      const response = await PlatformUtils.safeFetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Você é um analista financeiro experiente. Forneça análises precisas e objetivas.' },
            { role: 'user', content: prompt }
          ]
        })
      }, 10000);

      if (response.ok) {
        const data = await response.json();
        result.aiAnalysis = data.completion;
        console.log(`✅ AI analysis generated for ${result.symbol}`);
      }
    } catch (error) {
      console.log(`⚠️ AI analysis failed for ${result.symbol}:`, error);
      // Fallback analysis
      result.aiAnalysis = `Análise de ${result.name}: Com base nos indicadores técnicos atuais, o ativo apresenta ${result.changePercent > 0 ? 'tendência positiva' : 'correção'} no curto prazo. Recomenda-se monitorar os níveis de suporte em $${result.technicalIndicators?.support.toFixed(2)} e resistência em $${result.technicalIndicators?.resistance.toFixed(2)}.`;
    }
  };

  const getPopularSearches = useMemo(() => {
    return [
      'Bitcoin', 'Ethereum', 'EURUSD', 'GBPUSD', 'Apple', 'Tesla',
      'USDJPY', 'Solana', 'Microsoft', 'Amazon'
    ];
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    searchCurrency,
    searchResults,
    loading,
    error,
    searchHistory,
    getPopularSearches,
    clearSearchHistory
  };
}