import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react-native';
import { ForexPair } from '@/types/forex';

// Add blinking animation for live dot
const BlinkingDot = React.memo(function BlinkingDot() {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let isActive = true;
    
    const startBlinking = () => {
      if (!isActive) return;
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    // Use setTimeout to avoid scheduling during render
    const timeoutId = setTimeout(startBlinking, 0);
    
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      opacity.stopAnimation();
    };
  }, []);

  return (
    <Animated.View style={[styles.liveDot, { opacity }]} />
  );
});

interface ForexPairCardProps {
  pair: ForexPair;
  onPress?: (pair: ForexPair) => void;
}

export function ForexPairCard({ pair, onPress }: ForexPairCardProps) {
  const isPositive = pair.change >= 0;
  const [previousPrice, setPreviousPrice] = useState(pair.price);
  const [priceAnimation] = useState(new Animated.Value(1));
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (pair.price !== previousPrice) {
      setIsUpdating(true);
      setPreviousPrice(pair.price);
      
      // Use requestAnimationFrame to avoid scheduling updates during render
      const animationId = requestAnimationFrame(() => {
        // Animate price change
        Animated.sequence([
          Animated.timing(priceAnimation, {
            toValue: 1.05,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(priceAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsUpdating(false);
        });
      });
      
      return () => cancelAnimationFrame(animationId);
    }
  }, [pair.price, previousPrice, priceAnimation]);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress?.(pair);
  };

  const formatPrice = (price: number) => {
    return pair.symbol.includes('JPY') ? price.toFixed(2) : price.toFixed(4);
  };

  const formatChange = (change: number) => {
    return pair.symbol.includes('JPY') ? change.toFixed(2) : change.toFixed(4);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isUpdating && styles.updating,
        isPositive ? styles.positiveGlow : styles.negativeGlow
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{pair.symbol}</Text>
          {isUpdating && <Activity color="#00D4AA" size={12} />}
        </View>
        <View style={styles.trendContainer}>
          {isPositive ? (
            <TrendingUp color="#00D4AA" size={16} />
          ) : (
            <TrendingDown color="#EF4444" size={16} />
          )}
          <Zap color="#FFD700" size={10} style={styles.liveIcon} />
        </View>
      </View>
      
      <Animated.View style={[styles.priceContainer, { transform: [{ scale: priceAnimation }] }]}>
        <Text style={[
          styles.price,
          isPositive ? styles.positivePrice : styles.negativePrice
        ]}>
          {formatPrice(pair.price)}
        </Text>
      </Animated.View>
      
      <View style={styles.changeContainer}>
        <Text style={[styles.change, { color: isPositive ? '#00D4AA' : '#EF4444' }]}>
          {isPositive ? '+' : ''}{formatChange(pair.change)}
        </Text>
        <Text style={[styles.changePercent, { color: isPositive ? '#00D4AA' : '#EF4444' }]}>
          ({isPositive ? '+' : ''}{pair.changePercent.toFixed(2)}%)
        </Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>H: {formatPrice(pair.high)}</Text>
        <Text style={styles.detailText}>L: {formatPrice(pair.low)}</Text>
      </View>
      
      <View style={styles.volumeContainer}>
        <Text style={styles.volumeLabel}>Vol:</Text>
        <Text style={styles.volumeValue}>
          {pair.volume >= 1000000 ? `${(pair.volume / 1000000).toFixed(1)}M` : `${(pair.volume / 1000).toFixed(0)}K`}
        </Text>
      </View>
      
      <View style={styles.liveIndicator}>
        <BlinkingDot />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    width: 150,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    position: 'relative',
  },
  updating: {
    borderColor: '#00D4AA',
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  positiveGlow: {
    borderColor: '#00D4AA20',
  },
  negativeGlow: {
    borderColor: '#EF444420',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  symbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  liveIcon: {
    opacity: 0.8,
  },
  priceContainer: {
    // Empty container for animation
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positivePrice: {
    color: '#00D4AA',
  },
  negativePrice: {
    color: '#EF4444',
  },
  changeContainer: {
    marginBottom: 8,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: 11,
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  volumeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    marginBottom: 8,
  },
  volumeLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  volumeValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00D4AA',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
});