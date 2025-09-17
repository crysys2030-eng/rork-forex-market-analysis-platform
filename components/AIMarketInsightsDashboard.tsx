import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Brain, TrendingUp, TrendingDown, Activity, AlertCircle, Calendar, Newspaper, Target } from 'lucide-react-native';
import { AIMarketInsights } from '@/hooks/useAIEnhancedMarketData';

interface AIMarketInsightsDashboardProps {
  insights: AIMarketInsights | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export function AIMarketInsightsDashboard({ insights, loading, onRefresh }: AIMarketInsightsDashboardProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Brain size={24} color="#8B5CF6" />
        <Text style={styles.loadingText}>AI is analyzing market conditions...</Text>
      </View>
    );
  }

  if (!insights) {
    return (
      <View style={styles.emptyContainer}>
        <Brain size={32} color="#9CA3AF" />
        <Text style={styles.emptyText}>No AI insights available</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Generate Insights</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return '#10B981';
      case 'BEARISH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UPTREND': return <TrendingUp size={16} color="#10B981" />;
      case 'DOWNTREND': return <TrendingDown size={16} color="#EF4444" />;
      default: return <Activity size={16} color="#6B7280" />;
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'HIGH': return '#EF4444';
      case 'MEDIUM': return '#F59E0B';
      case 'LOW': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Brain size={24} color="#8B5CF6" />
          <Text style={styles.title}>AI Market Intelligence</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Market Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.cardTitle}>Market Overview</Text>
        
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(insights.overallSentiment) }]}>
              <Text style={styles.sentimentText}>{insights.overallSentiment}</Text>
            </View>
            <Text style={styles.overviewLabel}>Overall Sentiment</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <View style={styles.trendContainer}>
              {getTrendIcon(insights.marketTrend)}
              <Text style={styles.trendText}>{insights.marketTrend}</Text>
            </View>
            <Text style={styles.overviewLabel}>Market Trend</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <View style={[styles.volatilityBadge, { backgroundColor: getVolatilityColor(insights.volatilityIndex > 5 ? 'HIGH' : insights.volatilityIndex > 2 ? 'MEDIUM' : 'LOW') }]}>
              <Text style={styles.volatilityText}>{insights.volatilityIndex.toFixed(1)}</Text>
            </View>
            <Text style={styles.overviewLabel}>Volatility Index</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <View style={styles.riskContainer}>
              <AlertCircle size={16} color={insights.riskLevel > 7 ? '#EF4444' : insights.riskLevel > 4 ? '#F59E0B' : '#10B981'} />
              <Text style={[styles.riskText, { color: insights.riskLevel > 7 ? '#EF4444' : insights.riskLevel > 4 ? '#F59E0B' : '#10B981' }]}>
                {insights.riskLevel}/10
              </Text>
            </View>
            <Text style={styles.overviewLabel}>Risk Level</Text>
          </View>
        </View>
      </View>

      {/* Top Opportunities */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Target size={20} color="#10B981" />
          <Text style={styles.cardTitle}>Top Trading Opportunities</Text>
        </View>
        
        {insights.topOpportunities.map((opportunity, index) => (
          <View key={index} style={styles.opportunityItem}>
            <View style={styles.opportunityLeft}>
              <Text style={styles.opportunitySymbol}>{opportunity.symbol}</Text>
              <Text style={styles.opportunityReason} numberOfLines={2}>
                {opportunity.reason}
              </Text>
            </View>
            <View style={styles.opportunityRight}>
              <View style={[styles.confidenceBadge, { backgroundColor: `rgba(16, 185, 129, ${opportunity.confidence / 100})` }]}>
                <Text style={styles.confidenceText}>{opportunity.confidence}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Market News */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Newspaper size={20} color="#3B82F6" />
          <Text style={styles.cardTitle}>Market News Impact</Text>
        </View>
        
        {insights.marketNews.map((news, index) => (
          <View key={index} style={styles.newsItem}>
            <View style={styles.newsHeader}>
              <View style={[styles.impactBadge, { 
                backgroundColor: news.impact === 'HIGH' ? '#EF4444' : news.impact === 'MEDIUM' ? '#F59E0B' : '#10B981' 
              }]}>
                <Text style={styles.impactText}>{news.impact}</Text>
              </View>
              <View style={[styles.sentimentBadge, { 
                backgroundColor: news.sentiment === 'POSITIVE' ? '#10B981' : news.sentiment === 'NEGATIVE' ? '#EF4444' : '#6B7280' 
              }]}>
                <Text style={styles.sentimentText}>{news.sentiment}</Text>
              </View>
            </View>
            <Text style={styles.newsHeadline} numberOfLines={2}>
              {news.headline}
            </Text>
            <Text style={styles.newsTime}>
              {new Date(news.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Economic Calendar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Calendar size={20} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Economic Calendar</Text>
        </View>
        
        {insights.economicCalendar.map((event, index) => (
          <View key={index} style={styles.calendarItem}>
            <View style={styles.calendarLeft}>
              <Text style={styles.eventTime}>{event.time}</Text>
              <View style={[styles.impactBadge, { 
                backgroundColor: event.impact === 'HIGH' ? '#EF4444' : event.impact === 'MEDIUM' ? '#F59E0B' : '#10B981' 
              }]}>
                <Text style={styles.impactText}>{event.impact}</Text>
              </View>
            </View>
            <View style={styles.calendarRight}>
              <Text style={styles.eventName} numberOfLines={1}>
                {event.event}
              </Text>
              <View style={styles.eventDetails}>
                <Text style={styles.eventDetail}>Forecast: {event.forecast}</Text>
                <Text style={styles.eventDetail}>Previous: {event.previous}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* AI Recommendation */}
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>🤖 AI Market Recommendation</Text>
        <Text style={styles.recommendationText}>
          Based on current market analysis, the AI suggests maintaining a {insights.overallSentiment.toLowerCase()} bias with {insights.riskLevel > 6 ? 'reduced' : 'standard'} position sizing. 
          Monitor key economic events and maintain proper risk management protocols.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  refreshButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  overviewItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  sentimentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  sentimentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  volatilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  volatilityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '700',
  },
  overviewLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  opportunityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  opportunityLeft: {
    flex: 1,
    marginRight: 12,
  },
  opportunitySymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  opportunityReason: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  opportunityRight: {
    alignItems: 'flex-end',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  newsItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  newsHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  impactText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  newsHeadline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 4,
  },
  newsTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  calendarItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  calendarLeft: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  calendarRight: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  eventDetail: {
    fontSize: 11,
    color: '#6B7280',
  },
  recommendationCard: {
    backgroundColor: '#FEF3C7',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});