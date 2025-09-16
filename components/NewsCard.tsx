import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Newspaper, Clock, AlertTriangle } from 'lucide-react-native';
import { NewsItem } from '@/types/forex';

interface NewsCardProps {
  news: NewsItem[];
}

export function NewsCard({ news }: NewsCardProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const sortedNews = [...news].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Newspaper color="#00D4AA" size={24} />
        <Text style={styles.title}>Market News</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedNews.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsItem}>
            <View style={styles.newsHeader}>
              <View style={styles.impactContainer}>
                <AlertTriangle color={getImpactColor(item.impact)} size={14} />
                <Text style={[styles.impactText, { color: getImpactColor(item.impact) }]}>
                  {item.impact.toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.timeContainer}>
                <Clock color="#9CA3AF" size={12} />
                <Text style={styles.timeText}>{getTimeAgo(item.timestamp)}</Text>
              </View>
            </View>

            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary}>{item.summary}</Text>

            <View style={styles.newsFooter}>
              <View style={styles.pairsContainer}>
                <Text style={styles.pairsLabel}>Affects:</Text>
                <View style={styles.pairsList}>
                  {item.affectedPairs.slice(0, 3).map((pair, index) => (
                    <View key={pair} style={styles.pairBadge}>
                      <Text style={styles.pairText}>{pair}</Text>
                    </View>
                  ))}
                  {item.affectedPairs.length > 3 && (
                    <Text style={styles.morePairs}>+{item.affectedPairs.length - 3}</Text>
                  )}
                </View>
              </View>
              
              <Text style={styles.source}>{item.source}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {sortedNews.length === 0 && (
          <View style={styles.emptyState}>
            <Newspaper color="#6B7280" size={48} />
            <Text style={styles.emptyText}>No news available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  newsItem: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  newsSummary: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pairsContainer: {
    flex: 1,
  },
  pairsLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  pairsList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  pairBadge: {
    backgroundColor: '#374151',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pairText: {
    fontSize: 10,
    color: '#00D4AA',
    fontWeight: '600',
  },
  morePairs: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  source: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});