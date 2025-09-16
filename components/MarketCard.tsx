import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react-native';

interface MarketCardProps {
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
  onPress?: () => void;
}

export function MarketCard({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent, 
  volume,
  timestamp,
  bid,
  ask,
  spread,
  onPress 
}: MarketCardProps) {
  // Ensure all values are properly defined and converted to appropriate types
  const safeSymbol = String(symbol || '');
  const safeName = String(name || '');
  const safePrice = Number(price) || 0;
  const safeChange = Number(change) || 0;
  const safeChangePercent = Number(changePercent) || 0;
  const safeVolume = volume ? Number(volume) : undefined;
  const safeBid = bid ? Number(bid) : undefined;
  const safeAsk = ask ? Number(ask) : undefined;
  const safeSpread = spread ? Number(spread) : undefined;

  const isPositive = safeChange >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  const [flashAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const prevPriceRef = useRef(safePrice);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  
  useEffect(() => {
    if (prevPriceRef.current !== safePrice) {
      const direction = safePrice > prevPriceRef.current ? 'up' : 'down';
      setPriceDirection(direction);
      
      // Flash animation when price changes
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
      
      prevPriceRef.current = safePrice;
    }
  }, [safePrice, flashAnim]);
  
  useEffect(() => {
    // Continuous pulse for active trading
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, [pulseAnim]);
  
  const formatPrice = (value: number): string => {
    if (value >= 1000) {
      return value.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    return value.toFixed(value < 1 ? 6 : 4);
  };
  
  const formatVolume = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const flashColor = priceDirection === 'up' ? '#10B981' : priceDirection === 'down' ? '#EF4444' : 'transparent';
  const priceText = '$' + formatPrice(safePrice);
  
  return (
    <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
      <TouchableOpacity 
        style={[
          styles.container,
          {
            borderColor: flashAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#374151', flashColor],
            }),
          }
        ]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.flashOverlay,
            {
              opacity: flashAnim,
              backgroundColor: flashColor + '10',
            }
          ]}
        />
        
        <View style={styles.leftSection}>
          <View style={styles.symbolRow}>
            <Text style={styles.symbol}>{safeSymbol}</Text>
            <View style={styles.liveIndicator}>
              <Zap color="#F59E0B" size={10} />
            </View>
          </View>
          <Text style={styles.name}>{safeName}</Text>
          <View style={styles.detailsRow}>
            {safeVolume && (
              <Text style={styles.volume}>Vol: {formatVolume(safeVolume)}</Text>
            )}
            {safeSpread && (
              <Text style={styles.spread}>Spread: {safeSpread.toFixed(5)}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text 
            style={styles.price}
          >
            {priceText}
          </Text>
          
          <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
            <TrendIcon color={changeColor} size={12} />
            <Text style={[styles.change, { color: changeColor }]}>
              {isPositive ? '+' : ''}{safeChange.toFixed(4)}
            </Text>
          </View>
          
          <Text style={[styles.changePercent, { color: changeColor }]}>
            {isPositive ? '+' : ''}{safeChangePercent.toFixed(2)}%
          </Text>
          
          {safeBid && safeAsk && (
            <View style={styles.bidAskContainer}>
              <Text style={styles.bidAsk}>Bid: ${formatPrice(safeBid)}</Text>
              <Text style={styles.bidAsk}>Ask: ${formatPrice(safeAsk)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    position: 'relative',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  leftSection: {
    flex: 1,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  liveIndicator: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  name: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  volume: {
    fontSize: 10,
    color: '#6B7280',
  },
  spread: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  changePercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  bidAskContainer: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  bidAsk: {
    fontSize: 10,
    color: '#9CA3AF',
    lineHeight: 12,
  },
});