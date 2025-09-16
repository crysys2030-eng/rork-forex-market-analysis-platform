import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { AlertHistoryItem } from '@/components/AlertHistoryModal';

// Simple in-memory storage for now to avoid import issues
const memoryStorage = new Map<string, string>();

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          return window.localStorage.getItem(key);
        }
      } catch (error) {
        console.warn('localStorage not available, using memory storage:', error);
      }
    }
    return memoryStorage.get(key) || null;
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch (error) {
        console.warn('localStorage not available, using memory storage:', error);
      }
    }
    memoryStorage.set(key, value);
  }
};

export function useAlertHistory() {
  const [alertHistory, setAlertHistory] = useState<AlertHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const storageKey = 'alert_history';

  // Load alert history from storage
  const loadAlertHistory = useCallback(async () => {
    try {
      const stored = await storage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const restoredAlerts = parsed.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
        }));
        setAlertHistory(restoredAlerts);
        console.log(`Loaded ${restoredAlerts.length} alerts from history`);
      }
    } catch (error) {
      console.error('Failed to load alert history:', error);
    }
  }, []);

  // Save alert history to storage
  const saveAlertHistory = useCallback(async (alerts: AlertHistoryItem[]) => {
    try {
      await storage.setItem(storageKey, JSON.stringify(alerts));
    } catch (error) {
      console.error('Failed to save alert history:', error);
    }
  }, []);

  // Add new alert to history
  const addAlert = useCallback((alert: Omit<AlertHistoryItem, 'id'>) => {
    const newAlert: AlertHistoryItem = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setAlertHistory(prev => {
      const updated = [newAlert, ...prev].slice(0, 500); // Keep last 500 alerts
      saveAlertHistory(updated);
      return updated;
    });

    console.log(`Added alert: ${newAlert.symbol} ${newAlert.action} (${newAlert.type})`);
    return newAlert.id;
  }, [saveAlertHistory]);

  // Update alert status or result
  const updateAlert = useCallback((alertId: string, updates: Partial<AlertHistoryItem>) => {
    setAlertHistory(prev => {
      const updated = prev.map(alert => 
        alert.id === alertId ? { ...alert, ...updates } : alert
      );
      saveAlertHistory(updated);
      return updated;
    });
  }, [saveAlertHistory]);

  // Get alerts for specific symbol
  const getAlertsForSymbol = useCallback((symbol: string) => {
    return alertHistory.filter(alert => alert.symbol === symbol);
  }, [alertHistory]);

  // Get alerts by type
  const getAlertsByType = useCallback((type: 'SCALPING' | 'ML_TRADING') => {
    return alertHistory.filter(alert => alert.type === type);
  }, [alertHistory]);

  // Get active alerts
  const getActiveAlerts = useCallback(() => {
    return alertHistory.filter(alert => alert.status === 'ACTIVE');
  }, [alertHistory]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const total = alertHistory.length;
    const active = alertHistory.filter(a => a.status === 'ACTIVE').length;
    const closed = alertHistory.filter(a => a.status === 'CLOSED').length;
    const wins = alertHistory.filter(a => a.result?.outcome === 'WIN').length;
    const losses = alertHistory.filter(a => a.result?.outcome === 'LOSS').length;
    const winRate = closed > 0 ? (wins / closed) * 100 : 0;
    
    const totalPnl = alertHistory
      .filter(a => a.result?.pnl !== undefined)
      .reduce((sum, a) => sum + (a.result?.pnl || 0), 0);

    return {
      total,
      active,
      closed,
      wins,
      losses,
      winRate,
      totalPnl,
    };
  }, [alertHistory]);

  // Clear old alerts (older than 30 days)
  const clearOldAlerts = useCallback(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    setAlertHistory(prev => {
      const filtered = prev.filter(alert => alert.timestamp > thirtyDaysAgo);
      if (filtered.length !== prev.length) {
        saveAlertHistory(filtered);
        console.log(`Cleared ${prev.length - filtered.length} old alerts`);
      }
      return filtered;
    });
  }, [saveAlertHistory]);

  // Generate mock alert for testing
  const generateMockAlert = useCallback((symbol: string, type: 'SCALPING' | 'ML_TRADING') => {
    const actions: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const confidence = 70 + Math.random() * 25;
    const entryPrice = 1.0500 + (Math.random() - 0.5) * 0.1;
    const stopLoss = action === 'BUY' ? entryPrice * 0.99 : entryPrice * 1.01;
    const takeProfit = action === 'BUY' ? entryPrice * 1.02 : entryPrice * 0.98;

    const mockAlert = {
      symbol,
      type,
      action,
      confidence: Math.round(confidence),
      timestamp: new Date(),
      details: {
        entryPrice,
        stopLoss,
        takeProfit,
        reason: type === 'SCALPING' 
          ? `Strong momentum breakout • RSI ${Math.round(30 + Math.random() * 40)} • High volatility`
          : `ML Model prediction • Neural Network confidence ${Math.round(confidence)}% • Technical score: ${Math.round(60 + Math.random() * 30)}`,
        modelUsed: type === 'ML_TRADING' ? 'Neural Network Model' : undefined,
        strategy: type === 'SCALPING' ? 'MOMENTUM_BREAKOUT' : undefined,
      },
      status: 'ACTIVE' as const,
    };

    return addAlert(mockAlert);
  }, [addAlert]);

  // Initialize on mount
  useEffect(() => {
    loadAlertHistory();
  }, [loadAlertHistory]);

  // Auto-cleanup old alerts daily
  useEffect(() => {
    const interval = setInterval(clearOldAlerts, 24 * 60 * 60 * 1000); // Daily
    return () => clearInterval(interval);
  }, [clearOldAlerts]);

  return {
    alertHistory,
    loading,
    addAlert,
    updateAlert,
    getAlertsForSymbol,
    getAlertsByType,
    getActiveAlerts,
    getStatistics,
    clearOldAlerts,
    generateMockAlert,
    loadAlertHistory,
  };
}