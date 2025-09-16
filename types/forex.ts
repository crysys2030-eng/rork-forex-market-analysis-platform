export interface ForexPair {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface MLSignal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  timestamp: Date;
  status: 'active' | 'completed';
  result?: 'profit' | 'loss';
  indicators: string[];
}

export interface PerformanceData {
  date: Date;
  profit: number;
  accuracy: number;
  trades: number;
}



export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  description: string;
}

export interface MarketSentiment {
  symbol: string;
  bullish: number;
  bearish: number;
  neutral: number;
  overall: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  impact: 'low' | 'medium' | 'high';
  actual?: number;
  forecast?: number;
  previous?: number;
  time: Date;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'low' | 'medium' | 'high';
  affectedPairs: string[];
  timestamp: Date;
  source: string;
}

export interface CurrencyStrength {
  currency: string;
  strength: number; // -100 to 100
  change24h: number;
  trend: 'up' | 'down' | 'sideways';
}

export interface CorrelationData {
  pair1: string;
  pair2: string;
  correlation: number; // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
}

export interface RiskCalculation {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  riskAmount: number;
  rewardRatio: number;
}

export interface MarketSession {
  name: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
  timezone: string;
  volume: number;
}

export interface AIAnalysis {
  symbol: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeframe: string;
  priceTarget: number;
  reasoning: string[];
  riskLevel: 'low' | 'medium' | 'high';
  accuracy: number;
  lastUpdated: Date;
}

export interface CurrencyDetail {
  symbol: string;
  name: string;
  country: string;
  flag: string;
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  trend: {
    short: 'up' | 'down' | 'sideways';
    medium: 'up' | 'down' | 'sideways';
    long: 'up' | 'down' | 'sideways';
  };
  technicals: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    sma200: number;
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  fundamentals: {
    interestRate: number;
    inflation: number;
    gdpGrowth: number;
    unemployment: number;
  };
  sentiment: {
    retail: number;
    institutional: number;
    overall: 'bullish' | 'bearish' | 'neutral';
  };
}

export interface AdvancedPattern {
  id: string;
  symbol: string;
  pattern: string;
  type: 'continuation' | 'reversal';
  confidence: number;
  timeframe: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  probability: number;
  aiConfirmed: boolean;
  description: string;
}

export interface MarketRegime {
  type: 'trending' | 'ranging' | 'volatile' | 'calm';
  strength: number;
  duration: number;
  description: string;
  tradingStrategy: string[];
}

export interface VolatilityAnalysis {
  symbol: string;
  current: number;
  average: number;
  percentile: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  forecast: number[];
}

export interface LiquidityData {
  symbol: string;
  bidAskSpread: number;
  marketDepth: number;
  orderBookImbalance: number;
  liquidityScore: number;
  optimalTradingTimes: string[];
}

export interface SeasonalPattern {
  symbol: string;
  month: number;
  averageReturn: number;
  winRate: number;
  volatility: number;
  bestDays: string[];
  worstDays: string[];
}

export interface SmartAlert {
  id: string;
  symbol: string;
  type: 'price' | 'technical' | 'news' | 'ai_signal';
  condition: string;
  value: number;
  isActive: boolean;
  triggered: boolean;
  aiEnhanced: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  triggeredAt?: Date;
}

// Cryptocurrency Types
export interface CryptoPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  icon: string;
}

export interface CryptoSignal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  timestamp: Date;
  status: 'active' | 'completed';
  result?: 'profit' | 'loss';
  indicators: string[];
  aiAnalysis: string;
  riskLevel: 'low' | 'medium' | 'high';
}



export interface CryptoNews {
  id: string;
  title: string;
  summary: string;
  impact: 'low' | 'medium' | 'high';
  affectedCoins: string[];
  timestamp: Date;
  source: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface CryptoTechnicals {
  symbol: string;
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  sma20: number;
  sma50: number;
  sma200: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  support: number[];
  resistance: number[];
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface CryptoFearGreed {
  value: number;
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: Date;
  factors: {
    volatility: number;
    momentum: number;
    volume: number;
    socialMedia: number;
    dominance: number;
  };
}

// AI Trading Signal Types
export interface AITradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  riskReward: number;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  timestamp: Date;
  status: 'active' | 'filled' | 'cancelled' | 'tp_hit' | 'sl_hit';
  aiModel: 'DeepSeek' | 'ChatGPT' | 'Claude' | 'Gemini';
  indicators: AIIndicatorResult[];
  mlPrediction: MLPrediction;
  marketCondition: MarketCondition;
  reasoning: string;
  accuracy: number;
  backtestResults: BacktestResult;
}

export interface AIIndicatorResult {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number; // 0-100
  timeframe: string;
  description: string;
}

export interface MLPrediction {
  direction: 'UP' | 'DOWN' | 'SIDEWAYS';
  probability: number;
  priceTarget: number;
  timeHorizon: number; // hours
  volatilityForecast: number;
  supportLevels: number[];
  resistanceLevels: number[];
  modelAccuracy: number;
}

export interface MarketCondition {
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  volume: 'LOW' | 'MEDIUM' | 'HIGH';
  sentiment: 'FEAR' | 'GREED' | 'NEUTRAL';
  liquidity: 'LOW' | 'MEDIUM' | 'HIGH';
  newsImpact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BacktestResult {
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  averageReturn: number;
  sharpeRatio: number;
  totalTrades: number;
  period: string;
}

export interface AITradingConfig {
  aiModel: 'DeepSeek' | 'ChatGPT' | 'Claude' | 'Gemini';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  maxPositions: number;
  riskPerTrade: number; // percentage
  timeframes: string[];
  indicators: string[];
  mlEnabled: boolean;
  autoTrading: boolean;
}

export interface AIMarketAnalysis {
  symbol: string;
  overallSignal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  technicalScore: number;
  fundamentalScore: number;
  sentimentScore: number;
  aiScore: number;
  priceTargets: {
    short: number;
    medium: number;
    long: number;
  };
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  riskFactors: string[];
  opportunities: string[];
  lastUpdated: Date;
}