import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Settings, ChevronRight, Target, Shield, Clock } from 'lucide-react-native';
import { ScalpingConfig } from '@/hooks/useScalpingAI';

interface ScalpingConfigCardProps {
  config: ScalpingConfig;
  onConfigUpdate: (config: Partial<ScalpingConfig>) => void;
}

export function ScalpingConfigCard({ config, onConfigUpdate }: ScalpingConfigCardProps) {
  const [showModal, setShowModal] = useState(false);

  const confidenceOptions = [70, 75, 80, 85, 90];
  const riskOptions = [1, 1.5, 2, 2.5, 3];
  const rrOptions = [1, 1.5, 2, 2.5, 3];

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Settings color="#00D4AA" size={20} />
          <Text style={styles.title}>Scalping Configuration</Text>
          <ChevronRight color="#6B7280" size={20} />
        </View>
        
        <View style={styles.configPreview}>
          <View style={styles.previewItem}>
            <Target color="#9CA3AF" size={14} />
            <Text style={styles.previewLabel}>Min Confidence</Text>
            <Text style={styles.previewValue}>{config.minConfidence}%</Text>
          </View>
          
          <View style={styles.previewItem}>
            <Shield color="#9CA3AF" size={14} />
            <Text style={styles.previewLabel}>Max Risk</Text>
            <Text style={styles.previewValue}>{config.maxRisk}%</Text>
          </View>
          
          <View style={styles.previewItem}>
            <Clock color="#9CA3AF" size={14} />
            <Text style={styles.previewLabel}>R:R Ratio</Text>
            <Text style={styles.previewValue}>1:{config.riskRewardRatio}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Scalping Settings</Text>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Min Confidence */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Minimum Confidence</Text>
              <Text style={styles.settingDescription}>
                Only show signals with confidence above this threshold
              </Text>
              <View style={styles.optionsContainer}>
                {confidenceOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      config.minConfidence === option && styles.selectedOption
                    ]}
                    onPress={() => onConfigUpdate({ minConfidence: option })}
                  >
                    <Text style={[
                      styles.optionText,
                      config.minConfidence === option && styles.selectedOptionText
                    ]}>
                      {option}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Max Risk */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Maximum Risk per Trade</Text>
              <Text style={styles.settingDescription}>
                Maximum percentage of account to risk per position
              </Text>
              <View style={styles.optionsContainer}>
                {riskOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      config.maxRisk === option && styles.selectedOption
                    ]}
                    onPress={() => onConfigUpdate({ maxRisk: option })}
                  >
                    <Text style={[
                      styles.optionText,
                      config.maxRisk === option && styles.selectedOptionText
                    ]}>
                      {option}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Risk Reward Ratio */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Risk/Reward Ratio</Text>
              <Text style={styles.settingDescription}>
                Target profit relative to risk amount
              </Text>
              <View style={styles.optionsContainer}>
                {rrOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      config.riskRewardRatio === option && styles.selectedOption
                    ]}
                    onPress={() => onConfigUpdate({ riskRewardRatio: option })}
                  >
                    <Text style={[
                      styles.optionText,
                      config.riskRewardRatio === option && styles.selectedOptionText
                    ]}>
                      1:{option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Active Pairs */}
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Active Currency Pairs</Text>
              <Text style={styles.settingDescription}>
                Currently monitoring {config.pairs.length} major forex pairs
              </Text>
              <View style={styles.pairsList}>
                {config.pairs.map((pair) => (
                  <View key={pair} style={styles.pairBadge}>
                    <Text style={styles.pairText}>{pair}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  configPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewItem: {
    alignItems: 'center',
    flex: 1,
  },
  previewLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 2,
  },
  previewValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D4AA',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00D4AA',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  settingSection: {
    marginBottom: 32,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },
  selectedOption: {
    backgroundColor: '#00D4AA',
    borderColor: '#00D4AA',
  },
  optionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pairsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pairBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pairText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});