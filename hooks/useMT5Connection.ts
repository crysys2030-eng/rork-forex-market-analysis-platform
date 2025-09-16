import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface MT5Account {
  login: string;
  server: string;
  name: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  profit: number;
  currency: string;
  connected: boolean;
}

export interface MT5Position {
  ticket: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  swap: number;
  commission: number;
  openTime: string;
  sl: number;
  tp: number;
}

export interface MT5Symbol {
  name: string;
  bid: number;
  ask: number;
  spread: number;
  digits: number;
  point: number;
  tickValue: number;
  tickSize: number;
  contractSize: number;
  marginRequired: number;
  swapLong: number;
  swapShort: number;
  lastUpdate: string;
}

export interface MT5TradeRequest {
  action: 'BUY' | 'SELL' | 'CLOSE';
  symbol: string;
  volume: number;
  price?: number;
  sl?: number;
  tp?: number;
  deviation?: number;
  comment?: string;
  ticket?: number;
}

export interface MT5TradeResult {
  success: boolean;
  ticket?: number;
  error?: string;
  message?: string;
}

export const useMT5Connection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<MT5Account | null>(null);
  const [positions, setPositions] = useState<MT5Position[]>([]);
  const [symbols, setSymbols] = useState<MT5Symbol[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simulate MT5 connection for demo purposes
  const connect = useCallback(async (login: string, password: string, server: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful connection
      const mockAccount: MT5Account = {
        login,
        server,
        name: 'Demo Account',
        balance: 10000.00,
        equity: 10250.75,
        margin: 500.00,
        freeMargin: 9750.75,
        marginLevel: 2050.15,
        profit: 250.75,
        currency: 'USD',
        connected: true
      };

      setAccount(mockAccount);
      setIsConnected(true);
      
      // Load initial data
      await loadPositions();
      await loadSymbols();
      
    } catch (err) {
      setError('Failed to connect to MT5. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAccount(null);
    setPositions([]);
    setSymbols([]);
    setError(null);
  }, []);

  const loadPositions = useCallback(async () => {
    if (!isConnected) return;

    // Mock positions data
    const mockPositions: MT5Position[] = [
      {
        ticket: 123456789,
        symbol: 'EURUSD',
        type: 'BUY',
        volume: 0.1,
        openPrice: 1.0850,
        currentPrice: 1.0875,
        profit: 25.00,
        swap: -0.50,
        commission: -1.00,
        openTime: new Date(Date.now() - 3600000).toISOString(),
        sl: 1.0800,
        tp: 1.0950
      },
      {
        ticket: 123456790,
        symbol: 'GBPUSD',
        type: 'SELL',
        volume: 0.05,
        openPrice: 1.2650,
        currentPrice: 1.2635,
        profit: 7.50,
        swap: 0.25,
        commission: -0.50,
        openTime: new Date(Date.now() - 1800000).toISOString(),
        sl: 1.2700,
        tp: 1.2600
      }
    ];

    setPositions(mockPositions);
  }, [isConnected]);

  const loadSymbols = useCallback(async () => {
    if (!isConnected) return;

    // Mock symbols data with real-time prices
    const mockSymbols: MT5Symbol[] = [
      {
        name: 'EURUSD',
        bid: 1.0875,
        ask: 1.0877,
        spread: 2,
        digits: 5,
        point: 0.00001,
        tickValue: 1.0,
        tickSize: 0.00001,
        contractSize: 100000,
        marginRequired: 1087.5,
        swapLong: -2.5,
        swapShort: 0.5,
        lastUpdate: new Date().toISOString()
      },
      {
        name: 'GBPUSD',
        bid: 1.2635,
        ask: 1.2637,
        spread: 2,
        digits: 5,
        point: 0.00001,
        tickValue: 1.0,
        tickSize: 0.00001,
        contractSize: 100000,
        marginRequired: 1263.5,
        swapLong: -1.8,
        swapShort: 0.3,
        lastUpdate: new Date().toISOString()
      },
      {
        name: 'USDJPY',
        bid: 149.85,
        ask: 149.87,
        spread: 2,
        digits: 3,
        point: 0.001,
        tickValue: 0.67,
        tickSize: 0.001,
        contractSize: 100000,
        marginRequired: 667.0,
        swapLong: 15.5,
        swapShort: -18.2,
        lastUpdate: new Date().toISOString()
      }
    ];

    setSymbols(mockSymbols);
  }, [isConnected]);

  const executeTrade = useCallback(async (request: MT5TradeRequest): Promise<MT5TradeResult> => {
    if (!isConnected) {
      return { success: false, error: 'Not connected to MT5' };
    }

    try {
      // Simulate trade execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      const ticket = Math.floor(Math.random() * 1000000000);
      
      // Add new position if it's a buy/sell order
      if (request.action === 'BUY' || request.action === 'SELL') {
        const symbol = symbols.find(s => s.name === request.symbol);
        if (symbol) {
          const newPosition: MT5Position = {
            ticket,
            symbol: request.symbol,
            type: request.action,
            volume: request.volume,
            openPrice: request.price || (request.action === 'BUY' ? symbol.ask : symbol.bid),
            currentPrice: request.action === 'BUY' ? symbol.bid : symbol.ask,
            profit: 0,
            swap: 0,
            commission: -1.0,
            openTime: new Date().toISOString(),
            sl: request.sl || 0,
            tp: request.tp || 0
          };
          setPositions(prev => [...prev, newPosition]);
        }
      } else if (request.action === 'CLOSE' && request.ticket) {
        // Remove position if closing
        setPositions(prev => prev.filter(p => p.ticket !== request.ticket));
      }

      return {
        success: true,
        ticket,
        message: `Trade executed successfully`
      };
    } catch (err) {
      return {
        success: false,
        error: 'Failed to execute trade'
      };
    }
  }, [isConnected, symbols]);

  // Auto-refresh data every 5 seconds when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      loadSymbols();
      loadPositions();
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, loadSymbols, loadPositions]);

  return {
    isConnected,
    isConnecting,
    account,
    positions,
    symbols,
    error,
    connect,
    disconnect,
    executeTrade,
    loadPositions,
    loadSymbols
  };
};