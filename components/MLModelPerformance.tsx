import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Brain, TrendingUp, Target, BarChart3, Zap, Activity } from 'lucide-react-native';

interface MLModel {
  name: string;
  accuracy: number;
  lastTrained: Date;
  predictions: number[];
}

interface MLModelPerformanceProps {
  models: MLModel[];
  isAnalyzing: boolean;
}

export function MLModelPerformance({ models, isAnalyzing }: MLModelPerformanceProps) {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return '#00D4AA';
    if (accuracy >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const getModelIcon = (name: string) => {
    switch (name) {
      case 'DeepSeek': return '🧠';
      case 'ChatGPT': return '🤖';
      case 'Claude': return '🎯';
      case 'Gemini': return '💎';
      default: return '🔮';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Brain size={20} color="#8B5CF6" />
        <Text style={styles.title}>ML Model Performance</Text>
        {isAnalyzing && (
          <View style={styles.analyzingBadge}>
            <Activity size={12} color="#F59E0B" />
            <Text style={styles.analyzingText}>Analyzing</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelsContainer}>
        {models.map((model, index) => (
          <View key={model.name} style={styles.modelCard}>
            <View style={styles.modelHeader}>
              <Text style={styles.modelIcon}>{getModelIcon(model.name)}</Text>
              <Text style={styles.modelName}>{model.name}</Text>
            </View>

            <View style={styles.accuracyContainer}>
              <Text style={styles.accuracyLabel}>Accuracy</Text>
              <Text style={[styles.accuracyValue, { color: getAccuracyColor(model.accuracy) }]}>
                {model.accuracy.toFixed(1)}%
              </Text>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metric}>
                <TrendingUp size={14} color="#00D4AA" />
                <Text style={styles.metricLabel}>Predictions</Text>
                <Text style={styles.metricValue}>{model.predictions.length}</Text>
              </View>

              <View style={styles.metric}>
                <Target size={14} color="#8B5CF6" />
                <Text style={styles.metricLabel}>Success Rate</Text>
                <Text style={styles.metricValue}>
                  {(model.predictions.filter(p => p > 70).length / model.predictions.length * 100).toFixed(0)}%
                </Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Recent Performance</Text>
              <View style={styles.miniChart}>
                {model.predictions.slice(-12).map((prediction, idx) => (
                  <View
                    key={`${model.name}-${idx}`}
                    style={[
                      styles.chartBar,
                      {
                        height: (prediction / 100) * 40,
                        backgroundColor: prediction > 70 ? '#00D4AA' : prediction > 50 ? '#F59E0B' : '#EF4444',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            <Text style={styles.lastTrained}>
              Last trained: {model.lastTrained.toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {models.length === 0 && (
        <View style={styles.emptyState}>
          <BarChart3 size={48} color="#6B7280" />
          <Text style={styles.emptyText}>No ML models data available</Text>
          <Text style={styles.emptySubtext}>Models will appear here once analysis begins</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  analyzingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  analyzingText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
  },
  modelsContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  modelCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 180,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  modelIcon: {
    fontSize: 20,
  },
  modelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  accuracyContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  accuracyLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  accuracyValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chartContainer: {
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 2,
  },
  chartBar: {
    flex: 1,
    borderRadius: 1,
    minHeight: 2,
  },
  lastTrained: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});