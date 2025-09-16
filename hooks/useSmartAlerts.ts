import { useState, useEffect } from 'react';
import { SmartAlert } from '@/types/forex';

export function useSmartAlerts() {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateAlerts = () => {
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'];
    const types: ('price' | 'technical' | 'news' | 'ai_signal')[] = ['price', 'technical', 'news', 'ai_signal'];
    const priorities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];

    const generatedAlerts: SmartAlert[] = Array.from({ length: 15 }, (_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const isTriggered = Math.random() > 0.7;
      
      const conditions = {
        price: `Price crosses ${(1.2 + Math.random() * 0.1).toFixed(5)}`,
        technical: `RSI ${Math.random() > 0.5 ? 'above' : 'below'} ${Math.floor(Math.random() * 40) + 30}`,
        news: `High impact ${symbol.slice(0, 3)} news released`,
        ai_signal: `AI confidence above ${Math.floor(Math.random() * 20) + 80}%`
      };

      return {
        id: `alert-${i}`,
        symbol,
        type,
        condition: conditions[type],
        value: Math.random() * 100,
        isActive: !isTriggered,
        triggered: isTriggered,
        aiEnhanced: Math.random() > 0.4,
        priority,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        triggeredAt: isTriggered ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) : undefined,
      };
    });

    // Sort by priority and triggered status
    generatedAlerts.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      if (a.triggered !== b.triggered) return a.triggered ? 1 : -1;
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setAlerts(generatedAlerts);
  };

  const createAlert = (alert: Omit<SmartAlert, 'id' | 'createdAt' | 'triggered' | 'triggeredAt'>) => {
    const newAlert: SmartAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      createdAt: new Date(),
      triggered: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      generateAlerts();
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateAlerts();
  }, []);

  return {
    alerts,
    isLoading,
    createAlert,
    toggleAlert,
    deleteAlert,
    refetch,
  };
}