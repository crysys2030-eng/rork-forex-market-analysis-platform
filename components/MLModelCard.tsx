import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Brain, TrendingUp, Target, Shield, Activity, Zap, Cpu, Bot } from 'lucide-react-native';
import { MLModel } from '@/hooks/useEnhancedMLTrading';

interface MLModelCardProps {
  model: MLModel;
}

export function MLModelCard({ model }: MLModelCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#10B981';
      case 'TRAINING': return '#F59E0B';
      case 'INACTIVE': return '#6B7280';
      case 'ERROR': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'AI_HYBRID': return <Bot color="#00D4AA" size={16} />;
      case 'TRANSFORMER': return <Zap color="#F59E0B" size={16} />;
      case 'DEEP_ENSEMBLE': return <Cpu color="#8B5CF6" size={16} />;
      case 'LSTM': return <Brain color="#8B5CF6" size={16} />;
      case 'NEURAL_NETWORK': return <Activity color="#8B5CF6" size={16} />;
      case 'RANDOM_FOREST': return <TrendingUp color="#8B5CF6" size={16} />;
      case 'SVM': return <Target color="#8B5CF6" size={16} />;
      case 'ENSEMBLE': return <Shield color="#8B5CF6" size={16} />;
      default: return <Brain color="#8B5CF6" size={16} />;
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Never';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.modelInfo}>
          {getModelTypeIcon(model.type)}
          <View style={styles.modelDetails}>
            <Text style={styles.modelName}>{model.name}</Text>
            <Text style={styles.modelType}>{model.type.replace('_', ' ')}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          {model.aiEnhanced && (
            <View style={styles.aiEnhancedBadge}>
              <Bot color="#FFFFFF" size={10} />
              <Text style={styles.aiEnhancedText}>AI</Text>
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(model.status) }]}>
            <Text style={styles.statusText}>{model.status}</Text>
          </View>
        </View>
      </View>

      {/* Performance Metrics */}
      <View style={styles.metricsSection}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Accuracy</Text>
            <Text style={styles.metricValue}>{model.accuracy.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Precision</Text>
            <Text style={styles.metricValue}>{model.precision.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>F1 Score</Text>
            <Text style={styles.metricValue}>{model.f1Score.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Performance Stats */}
      <View style={styles.performanceSection}>
        <View style={styles.performanceRow}>
          <Text style={styles.performanceLabel}>Win Rate:</Text>
          <Text style={[styles.performanceValue, { color: model.performance.winRate > 60 ? '#10B981' : '#F59E0B' }]}>
            {model.performance.winRate.toFixed(1)}%
          </Text>
        </View>
        
        <View style={styles.performanceRow}>
          <Text style={styles.performanceLabel}>Avg Return:</Text>
          <Text style={[styles.performanceValue, { color: model.performance.avgReturn > 0 ? '#10B981' : '#EF4444' }]}>
            {model.performance.avgReturn > 0 ? '+' : ''}{model.performance.avgReturn.toFixed(2)}%
          </Text>
        </View>
        
        <View style={styles.performanceRow}>
          <Text style={styles.performanceLabel}>Sharpe Ratio:</Text>
          <Text style={styles.performanceValue}>{model.performance.sharpeRatio.toFixed(2)}</Text>
        </View>
        
        <View style={styles.performanceRow}>
          <Text style={styles.performanceLabel}>Max Drawdown:</Text>
          <Text style={[styles.performanceValue, { color: '#EF4444' }]}>
            {model.performance.maxDrawdown.toFixed(1)}%
          </Text>
        </View>
        
        <View style={styles.performanceRow}>
          <Text style={styles.performanceLabel}>Profit Factor:</Text>
          <Text style={[styles.performanceValue, { color: model.performance.profitFactor > 1.5 ? '#10B981' : '#F59E0B' }]}>
            {model.performance.profitFactor.toFixed(2)}
          </Text>
        </View>
        
        {model.performance.sortino && (
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Sortino Ratio:</Text>
            <Text style={styles.performanceValue}>{model.performance.sortino.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Training Info */}
      <View style={styles.trainingSection}>
        <View style={styles.trainingRow}>
          <Text style={styles.trainingLabel}>Training Data:</Text>
          <Text style={styles.trainingValue}>{model.trainingData.toLocaleString()} samples</Text>
        </View>
        
        <View style={styles.trainingRow}>
          <Text style={styles.trainingLabel}>Last Trained:</Text>
          <Text style={styles.trainingValue}>{formatDate(model.lastTrained)}</Text>
        </View>
        
        {model.realTimeUpdates && (
          <View style={styles.trainingRow}>
            <Text style={styles.trainingLabel}>Real-time Updates:</Text>
            <Text style={[styles.trainingValue, { color: '#10B981' }]}>Active</Text>
          </View>
        )}
        
        {model.hyperparameters.aiOptimized && (
          <View style={styles.trainingRow}>
            <Text style={styles.trainingLabel}>AI Optimized:</Text>
            <Text style={[styles.trainingValue, { color: '#00D4AA' }]}>Yes</Text>
          </View>
        )}
      </View>

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <View style={styles.featuresContainer}>
          {model.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {model.features.length > 3 && (
            <View style={styles.featureTag}>
              <Text style={styles.featureText}>+{model.features.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
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
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modelDetails: {
    marginLeft: 8,
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modelType: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiEnhancedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4AA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  aiEnhancedText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metricsSection: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  performanceSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  performanceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trainingSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  trainingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  trainingLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  trainingValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  featuresTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    color: '#D1D5DB',
  },
});