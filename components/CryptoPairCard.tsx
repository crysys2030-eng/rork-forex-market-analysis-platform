import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CryptoPair } from '@/types/forex';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface CryptoPairCardProps {
  pair: CryptoPair;
  onPress?: () => void;
}

export function CryptoPairCard({ pair, onPress }: CryptoPairCardProps) {
  const isPositive = pair.changePercent >= 0;
  const changeColor = isPositive ? '#00D4AA' : '#FF6B6B';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.coinInfo}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: pair.icon }} 
              style={styles.coinIcon}
              defaultSource={{ uri: 'https://via.placeholder.com/32x32/374151/ffffff?text=' + pair.symbol.replace('USDT', '').charAt(0) }}
            />
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{pair.rank}</Text>
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.symbol}>{pair.symbol.replace('USDT', '')}</Text>
            <Text style={styles.name}>{pair.name}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(pair.price)}</Text>
          <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
            <TrendIcon size={12} color={changeColor} />
            <Text style={[styles.change, { color: changeColor }]}>
              {isPositive ? '+' : ''}{pair.changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>{formatMarketCap(pair.marketCap)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Volume 24h</Text>
          <Text style={styles.statValue}>{formatVolume(pair.volume24h)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h High</Text>
          <Text style={styles.statValue}>{formatPrice(pair.high24h)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h Low</Text>
          <Text style={styles.statValue}>{formatPrice(pair.low24h)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rankBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  nameContainer: {
    flex: 1,
  },
  symbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  name: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  change: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
});