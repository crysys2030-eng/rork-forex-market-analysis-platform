import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react-native';
import { MarketCard } from './MarketCard';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp?: number;
  bid?: number;
  ask?: number;
  spread?: number;
}

interface MarketSectionProps {
  title: string;
  data: MarketData[];
  loading: boolean;
  onRefresh: () => void;
  icon?: React.ReactNode;
}

export function MarketSection({ title, data, loading, onRefresh, icon }: MarketSectionProps) {
  const [expanded, setExpanded] = useState(true);
  
  const ChevronIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.count}>({data.length})</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={onRefresh}
            style={styles.refreshButton}
            disabled={loading}
          >
            <RefreshCw 
              color="#6B7280" 
              size={16} 
              style={loading ? styles.spinning : undefined}
            />
          </TouchableOpacity>
          
          <ChevronIcon color="#6B7280" size={20} />
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <MarketCard
                key={item.symbol}
                symbol={item.symbol}
                name={item.name}
                price={item.price}
                change={item.change}
                changePercent={item.changePercent}
                volume={item.volume}
                timestamp={item.timestamp}
                bid={item.bid}
                ask={item.ask}
                spread={item.spread}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {loading ? 'Loading market data...' : 'No data available'}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  count: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 4,
    marginRight: 8,
  },
  spinning: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingHorizontal: 20,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});