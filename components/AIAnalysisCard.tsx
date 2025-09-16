import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, TrendingUp, TrendingDown, Minus, Target, Shield } from 'lucide-react-native';
import { AIAnalysis } from '@/types/forex';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
  onPress?: () => void;
}

export function AIAnalysisCard({ analysis, onPress }: AIAnalysisCardProps) {
  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'bullish': return '#10B981';
      case 'bearish': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'bullish': return <TrendingUp size={16} color="#10B981" />;
      case 'bearish': return <TrendingDown size={16} color="#EF4444" />;
      default: return <Minus size={16} color="#6B7280" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#1F2937', '#374151']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.symbolContainer}>
            <Brain size={20} color="#00D4AA" />
            <Text style={styles.symbol}>{analysis.symbol}</Text>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>AI Confidence</Text>
            <Text style={styles.confidence}>{analysis.confidence}%</Text>
          </View>
        </View>

        {/* Prediction */}
        <View style={styles.predictionContainer}>
          <View style={styles.predictionRow}>
            {getPredictionIcon(analysis.prediction)}
            <Text style={[styles.prediction, { color: getPredictionColor(analysis.prediction) }]}>
              {analysis.prediction.toUpperCase()}
            </Text>
            <Text style={styles.timeframe}>{analysis.timeframe}</Text>
          </View>
          <View style={styles.targetContainer}>
            <Target size={14} color="#9CA3AF" />
            <Text style={styles.target}>Target: {analysis.priceTarget.toFixed(5)}</Text>
          </View>
        </View>

        {/* Risk and Accuracy */}
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Shield size={14} color={getRiskColor(analysis.riskLevel)} />
            <Text style={styles.metricLabel}>Risk</Text>
            <Text style={[styles.metricValue, { color: getRiskColor(analysis.riskLevel) }]}>
              {analysis.riskLevel.toUpperCase()}
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.accuracyValue}>{analysis.accuracy}%</Text>
          </View>
        </View>

        {/* AI Reasoning */}
        <View style={styles.reasoningContainer}>
          <Text style={styles.reasoningTitle}>AI Analysis:</Text>
          {analysis.reasoning.slice(0, 2).map((reason, index) => (
            <Text key={index} style={styles.reasoningText}>
              • {reason}
            </Text>
          ))}
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Updated: {analysis.lastUpdated.toLocaleTimeString()}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  confidence: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
  predictionContainer: {
    marginBottom: 12,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  prediction: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  timeframe: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    backgroundColor: '#374151',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  target: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    marginRight: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  accuracyValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D4AA',
  },
  reasoningContainer: {
    marginBottom: 8,
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  lastUpdated: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
});