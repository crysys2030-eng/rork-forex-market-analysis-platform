import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Settings, Bot, Shield, Target, Clock } from 'lucide-react-native';
import { AITradingConfig } from '@/types/forex';

interface AITradingConfigCardProps {
  config: AITradingConfig;
  onConfigChange: (config: Partial<AITradingConfig>) => void;
}

export function AITradingConfigCard({ config, onConfigChange }: AITradingConfigCardProps) {
  const aiModels = ['DeepSeek', 'ChatGPT', 'Claude', 'Gemini'] as const;
  const riskLevels = ['LOW', 'MEDIUM', 'HIGH'] as const;
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'DeepSeek': return '🧠';
      case 'ChatGPT': return '🤖';
      case 'Claude': return '🎯';
      case 'Gemini': return '💎';
      default: return '🤖';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#00D4AA';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={20} color={'#00D4AA'} />
        <Text style={styles.title}>AI Trading Configuration</Text>
      </View>

      {/* AI Model Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bot size={16} color={'#8B5CF6'} />
          <Text style={styles.sectionTitle}>AI Model</Text>
        </View>
        <View style={styles.optionsGrid}>
          {aiModels.map((model) => (
            <TouchableOpacity
              key={model}
              style={[
                styles.optionButton,
                config.aiModel === model && styles.selectedOption
              ]}
              onPress={() => onConfigChange({ aiModel: model })}
            >
              <Text style={styles.modelIcon}>{getModelIcon(model)}</Text>
              <Text style={[
                styles.optionText,
                config.aiModel === model && styles.selectedOptionText
              ]}>
                {model}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Risk Level */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={16} color={'#EF4444'} />
          <Text style={styles.sectionTitle}>Risk Level</Text>
        </View>
        <View style={styles.optionsRow}>
          {riskLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.riskButton,
                { borderColor: getRiskColor(level) },
                config.riskLevel === level && { backgroundColor: getRiskColor(level) + '20' }
              ]}
              onPress={() => onConfigChange({ riskLevel: level })}
            >
              <Text style={[
                styles.riskText,
                { color: getRiskColor(level) },
                config.riskLevel === level && styles.selectedRiskText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trading Parameters */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={16} color={'#F59E0B'} />
          <Text style={styles.sectionTitle}>Trading Parameters</Text>
        </View>
        
        <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Max Positions</Text>
          <View style={styles.parameterButtons}>
            {[3, 5, 8, 10].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.parameterButton,
                  config.maxPositions === num && styles.selectedParameter
                ]}
                onPress={() => onConfigChange({ maxPositions: num })}
              >
                <Text style={[
                  styles.parameterButtonText,
                  config.maxPositions === num && styles.selectedParameterText
                ]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.parameterRow}>
          <Text style={styles.parameterLabel}>Risk per Trade (%)</Text>
          <View style={styles.parameterButtons}>
            {[1, 2, 3, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.parameterButton,
                  config.riskPerTrade === num && styles.selectedParameter
                ]}
                onPress={() => onConfigChange({ riskPerTrade: num })}
              >
                <Text style={[
                  styles.parameterButtonText,
                  config.riskPerTrade === num && styles.selectedParameterText
                ]}>
                  {num}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Timeframes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={16} color={'#06B6D4'} />
          <Text style={styles.sectionTitle}>Active Timeframes</Text>
        </View>
        <View style={styles.timeframesGrid}>
          {timeframes.map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeButton,
                config.timeframes.includes(tf) && styles.selectedTimeframe
              ]}
              onPress={() => {
                const newTimeframes = config.timeframes.includes(tf)
                  ? config.timeframes.filter(t => t !== tf)
                  : [...config.timeframes, tf];
                onConfigChange({ timeframes: newTimeframes });
              }}
            >
              <Text style={[
                styles.timeframeText,
                config.timeframes.includes(tf) && styles.selectedTimeframeText
              ]}>
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Switches */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Bot size={16} color={'#8B5CF6'} />
            <Text style={styles.switchText}>Machine Learning</Text>
          </View>
          <Switch
            value={config.mlEnabled}
            onValueChange={(value) => onConfigChange({ mlEnabled: value })}
            trackColor={{ false: '#374151', true: '#00D4AA' }}
            thumbColor={config.mlEnabled ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Target size={16} color={'#EF4444'} />
            <Text style={styles.switchText}>Auto Trading</Text>
          </View>
          <Switch
            value={config.autoTrading}
            onValueChange={(value) => onConfigChange({ autoTrading: value })}
            trackColor={{ false: '#374151', true: '#EF4444' }}
            thumbColor={config.autoTrading ? '#FFFFFF' : '#9CA3AF'}
          />
        </View>
      </View>

      {/* Warning for Auto Trading */}
      {config.autoTrading && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Auto Trading is enabled. Signals will be executed automatically based on your risk settings.
          </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    minWidth: 80,
  },
  selectedOption: {
    backgroundColor: '#00D4AA20',
    borderWidth: 1,
    borderColor: '#00D4AA',
  },
  modelIcon: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#00D4AA',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  riskButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedRiskText: {
    fontWeight: 'bold',
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
  },
  parameterButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  parameterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  selectedParameter: {
    backgroundColor: '#00D4AA',
  },
  parameterButtonText: {
    fontSize: 11,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  selectedParameterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timeframesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTimeframe: {
    backgroundColor: '#06B6D420',
    borderColor: '#06B6D4',
  },
  timeframeText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  selectedTimeframeText: {
    color: '#06B6D4',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
});