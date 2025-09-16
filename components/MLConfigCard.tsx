import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Settings, RefreshCw, Brain, Zap } from 'lucide-react-native';
import { MLConfig } from '@/hooks/useMLTrading';

interface MLConfigCardProps {
  config: MLConfig;
  onConfigUpdate: (config: Partial<MLConfig>) => void;
  onRetrain: () => void;
}

export function MLConfigCard({ config, onConfigUpdate, onRetrain }: MLConfigCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleModel = (modelType: string) => {
    const updatedModels = config.enabledModels.includes(modelType)
      ? config.enabledModels.filter(m => m !== modelType)
      : [...config.enabledModels, modelType];
    
    onConfigUpdate({ enabledModels: updatedModels });
  };

  const updateAccuracy = (increase: boolean) => {
    const newAccuracy = increase 
      ? Math.min(95, config.minAccuracy + 5)
      : Math.max(60, config.minAccuracy - 5);
    
    onConfigUpdate({ minAccuracy: newAccuracy });
  };

  const updateRisk = (increase: boolean) => {
    const newRisk = increase 
      ? Math.min(5, config.maxRisk + 0.5)
      : Math.max(1, config.maxRisk - 0.5);
    
    onConfigUpdate({ maxRisk: newRisk });
  };

  const modelTypes = ['LSTM', 'RANDOM_FOREST', 'SVM', 'NEURAL_NETWORK', 'ENSEMBLE'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Settings color="#8B5CF6" size={20} />
          <Text style={styles.title}>ML Configuration</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.retrainButton}
          onPress={onRetrain}
          activeOpacity={0.8}
        >
          <RefreshCw color="#FFFFFF" size={16} />
          <Text style={styles.retrainText}>Retrain</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Active Models</Text>
          <Text style={styles.statValue}>{config.enabledModels.length}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min Accuracy</Text>
          <Text style={styles.statValue}>{config.minAccuracy}%</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max Risk</Text>
          <Text style={styles.statValue}>{config.maxRisk}%</Text>
        </View>
      </View>

      {/* Expandable Configuration */}
      {expanded && (
        <View style={styles.expandedSection}>
          {/* Model Selection */}
          <View style={styles.configSection}>
            <View style={styles.sectionHeader}>
              <Brain color="#8B5CF6" size={16} />
              <Text style={styles.sectionTitle}>ML Models</Text>
            </View>
            
            <View style={styles.modelsGrid}>
              {modelTypes.map((modelType) => (
                <TouchableOpacity
                  key={modelType}
                  style={[
                    styles.modelToggle,
                    config.enabledModels.includes(modelType) && styles.modelToggleActive
                  ]}
                  onPress={() => toggleModel(modelType)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.modelToggleText,
                    config.enabledModels.includes(modelType) && styles.modelToggleTextActive
                  ]}>
                    {modelType.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Accuracy Settings */}
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>Minimum Accuracy Threshold</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => updateAccuracy(false)}
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.sliderValue}>
                <Text style={styles.sliderValueText}>{config.minAccuracy}%</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => updateAccuracy(true)}
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Risk Settings */}
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>Maximum Risk per Trade</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => updateRisk(false)}
              >
                <Text style={styles.sliderButtonText}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.sliderValue}>
                <Text style={styles.sliderValueText}>{config.maxRisk}%</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.sliderButton}
                onPress={() => updateRisk(true)}
              >
                <Text style={styles.sliderButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Advanced Settings */}
          <View style={styles.configSection}>
            <View style={styles.sectionHeader}>
              <Zap color="#F59E0B" size={16} />
              <Text style={styles.sectionTitle}>Advanced Settings</Text>
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Ensemble Voting</Text>
              <Switch
                value={config.ensembleVoting}
                onValueChange={(value) => onConfigUpdate({ ensembleVoting: value })}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor={config.ensembleVoting ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Auto Retrain</Text>
              <Switch
                value={config.autoRetrain}
                onValueChange={(value) => onConfigUpdate({ autoRetrain: value })}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor={config.autoRetrain ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>

          {/* Features */}
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>Active Features</Text>
            <View style={styles.featuresContainer}>
              {config.features.map((feature, index) => (
                <View key={`${feature}-${index}`} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  retrainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retrainText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  expandedSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  configSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelToggle: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modelToggleActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#A78BFA',
  },
  modelToggleText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  modelToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 8,
  },
  sliderButton: {
    backgroundColor: '#374151',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sliderValue: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  sliderValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 10,
    color: '#D1D5DB',
  },
});