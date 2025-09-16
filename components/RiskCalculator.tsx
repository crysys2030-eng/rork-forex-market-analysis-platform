import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Calculator, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react-native';
import { RiskCalculation } from '@/types/forex';

interface RiskCalculatorProps {
  onCalculate?: (calculation: RiskCalculation) => void;
}

export function RiskCalculator({ onCalculate }: RiskCalculatorProps) {
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('2');
  const [entryPrice, setEntryPrice] = useState<string>('1.0850');
  const [stopLoss, setStopLoss] = useState<string>('1.0820');
  const [targetPrice, setTargetPrice] = useState<string>('1.0920');
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null);

  const calculateRisk = () => {
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercentage);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const target = parseFloat(targetPrice);

    if (!balance || !risk || !entry || !sl) return;

    const riskAmount = (balance * risk) / 100;
    const pipValue = Math.abs(entry - sl);
    const positionSize = riskAmount / pipValue;
    const potentialProfit = Math.abs(target - entry);
    const rewardRatio = potentialProfit / pipValue;

    const result: RiskCalculation = {
      accountBalance: balance,
      riskPercentage: risk,
      entryPrice: entry,
      stopLoss: sl,
      positionSize,
      riskAmount,
      rewardRatio,
    };

    setCalculation(result);
    onCalculate?.(result);
  };

  const getRiskColor = (ratio: number) => {
    if (ratio >= 2) return '#00D4AA';
    if (ratio >= 1.5) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calculator color="#00D4AA" size={24} />
        <Text style={styles.title}>Risk Calculator</Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Balance ($)</Text>
          <TextInput
            style={styles.input}
            value={accountBalance}
            onChangeText={setAccountBalance}
            keyboardType="numeric"
            placeholder="10000"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Risk Percentage (%)</Text>
          <TextInput
            style={styles.input}
            value={riskPercentage}
            onChangeText={setRiskPercentage}
            keyboardType="numeric"
            placeholder="2"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Entry Price</Text>
            <TextInput
              style={styles.input}
              value={entryPrice}
              onChangeText={setEntryPrice}
              keyboardType="numeric"
              placeholder="1.0850"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Stop Loss</Text>
            <TextInput
              style={styles.input}
              value={stopLoss}
              onChangeText={setStopLoss}
              keyboardType="numeric"
              placeholder="1.0820"
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Price</Text>
          <TextInput
            style={styles.input}
            value={targetPrice}
            onChangeText={setTargetPrice}
            keyboardType="numeric"
            placeholder="1.0920"
            placeholderTextColor="#6B7280"
          />
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={calculateRisk}>
          <Text style={styles.calculateButtonText}>Calculate Risk</Text>
        </TouchableOpacity>
      </View>

      {calculation && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Calculation Results</Text>
          
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <DollarSign color="#9CA3AF" size={16} />
              <Text style={styles.resultLabel}>Risk Amount</Text>
              <Text style={styles.resultValue}>${calculation.riskAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.resultItem}>
              <TrendingUp color="#9CA3AF" size={16} />
              <Text style={styles.resultLabel}>Position Size</Text>
              <Text style={styles.resultValue}>{calculation.positionSize.toFixed(0)} units</Text>
            </View>
          </View>

          <View style={styles.rewardRatioContainer}>
            <AlertTriangle color={getRiskColor(calculation.rewardRatio)} size={20} />
            <Text style={styles.rewardRatioLabel}>Risk/Reward Ratio</Text>
            <Text style={[styles.rewardRatioValue, { color: getRiskColor(calculation.rewardRatio) }]}>
              1:{calculation.rewardRatio.toFixed(2)}
            </Text>
          </View>

          <View style={styles.recommendation}>
            <Text style={styles.recommendationText}>
              {calculation.rewardRatio >= 2 
                ? '✅ Excellent risk/reward ratio' 
                : calculation.rewardRatio >= 1.5 
                ? '⚠️ Acceptable risk/reward ratio' 
                : '❌ Poor risk/reward ratio - consider adjusting targets'}
            </Text>
          </View>
        </View>
      )}
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
  inputSection: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  calculateButton: {
    backgroundColor: '#00D4AA',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rewardRatioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  rewardRatioLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 8,
    marginRight: 8,
  },
  rewardRatioValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendation: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});