import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { History, X, AlertCircle } from 'lucide-react-native';

export interface AlertHistoryItem {
  id: string;
  symbol: string;
  type: 'SCALPING' | 'ML_TRADING';
  action: 'BUY' | 'SELL';
  confidence: number;
  timestamp: Date;
  details: {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    reason: string;
    modelUsed?: string;
    strategy?: string;
  };
  status: 'ACTIVE' | 'CLOSED' | 'EXPIRED';
  result?: {
    outcome: 'WIN' | 'LOSS' | 'BREAKEVEN';
    pnl: number;
    duration: number; // in minutes
  };
}

interface AlertHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  alerts: AlertHistoryItem[];
  symbol?: string;
}

export function AlertHistoryModal({ visible, onClose, alerts, symbol }: AlertHistoryModalProps) {
  const [selectedAlert, setSelectedAlert] = useState<AlertHistoryItem | null>(null);

  const filteredAlerts = symbol 
    ? alerts.filter(alert => alert.symbol === symbol)
    : alerts;

  const getTypeColor = (type: AlertHistoryItem['type']) => {
    return type === 'SCALPING' ? '#F59E0B' : '#8B5CF6';
  };

  const getStatusColor = (status: AlertHistoryItem['status']) => {
    switch (status) {
      case 'ACTIVE': return '#10B981';
      case 'CLOSED': return '#6B7280';
      case 'EXPIRED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getOutcomeColor = (outcome?: 'WIN' | 'LOSS' | 'BREAKEVEN') => {
    switch (outcome) {
      case 'WIN': return '#10B981';
      case 'LOSS': return '#EF4444';
      case 'BREAKEVEN': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const formatPrice = (price: number, symbol: string) => {
    const decimals = symbol.includes('JPY') ? 3 : 5;
    return price.toFixed(decimals);
  };

  const renderAlertItem = (alert: AlertHistoryItem) => (
    <TouchableOpacity
      key={alert.id}
      style={[
        styles.alertItem,
        { borderLeftColor: getTypeColor(alert.type) }
      ]}
      onPress={() => setSelectedAlert(alert)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleRow}>
          <Text style={styles.alertSymbol}>{alert.symbol}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(alert.type) }]}>
            <Text style={styles.typeBadgeText}>
              {alert.type === 'SCALPING' ? 'SCALP' : 'ML'}
            </Text>
          </View>
        </View>
        <View style={styles.alertMetaRow}>
          <View style={[styles.actionBadge, { 
            backgroundColor: alert.action === 'BUY' ? '#10B981' : '#EF4444' 
          }]}>
            <Text style={styles.actionText}>{alert.action}</Text>
          </View>
          <Text style={styles.confidenceText}>{alert.confidence}%</Text>
        </View>
      </View>

      <View style={styles.alertDetails}>
        <Text style={styles.alertPrice}>
          Entry: {formatPrice(alert.details.entryPrice, alert.symbol)}
        </Text>
        <Text style={styles.alertTime}>
          {alert.timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      <View style={styles.alertFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(alert.status) }]}>
          <Text style={styles.statusText}>{alert.status}</Text>
        </View>
        {alert.result && (
          <View style={styles.resultContainer}>
            <Text style={[styles.pnlText, { color: getOutcomeColor(alert.result.outcome) }]}>
              {alert.result.pnl > 0 ? '+' : ''}{alert.result.pnl.toFixed(2)}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAlertDetails = (alert: AlertHistoryItem) => (
    <Modal
      visible={!!selectedAlert}
      transparent
      animationType="slide"
      onRequestClose={() => setSelectedAlert(null)}
    >
      <View style={styles.detailModalOverlay}>
        <View style={styles.detailModalContent}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Alert Details</Text>
            <TouchableOpacity onPress={() => setSelectedAlert(null)}>
              <X color="#9CA3AF" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailScroll}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Signal Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Symbol:</Text>
                <Text style={styles.detailValue}>{alert.symbol}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={[styles.detailValue, { color: getTypeColor(alert.type) }]}>
                  {alert.type === 'SCALPING' ? 'Scalping Signal' : 'ML Trading Signal'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Action:</Text>
                <Text style={[styles.detailValue, { 
                  color: alert.action === 'BUY' ? '#10B981' : '#EF4444' 
                }]}>
                  {alert.action}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence:</Text>
                <Text style={styles.detailValue}>{alert.confidence}%</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Price Levels</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Entry Price:</Text>
                <Text style={styles.detailValue}>
                  {formatPrice(alert.details.entryPrice, alert.symbol)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Stop Loss:</Text>
                <Text style={[styles.detailValue, { color: '#EF4444' }]}>
                  {formatPrice(alert.details.stopLoss, alert.symbol)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Take Profit:</Text>
                <Text style={[styles.detailValue, { color: '#10B981' }]}>
                  {formatPrice(alert.details.takeProfit, alert.symbol)}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Analysis</Text>
              <Text style={styles.reasonText}>{alert.details.reason}</Text>
              {alert.details.modelUsed && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Model:</Text>
                  <Text style={styles.detailValue}>{alert.details.modelUsed}</Text>
                </View>
              )}
              {alert.details.strategy && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Strategy:</Text>
                  <Text style={styles.detailValue}>{alert.details.strategy}</Text>
                </View>
              )}
            </View>

            {alert.result && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Result</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Outcome:</Text>
                  <Text style={[styles.detailValue, { color: getOutcomeColor(alert.result.outcome) }]}>
                    {alert.result.outcome}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>P&L:</Text>
                  <Text style={[styles.detailValue, { color: getOutcomeColor(alert.result.outcome) }]}>
                    {alert.result.pnl > 0 ? '+' : ''}{alert.result.pnl.toFixed(2)}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailValue}>{alert.result.duration} minutes</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <History color="#8B5CF6" size={24} />
              <Text style={styles.modalTitle}>
                Alert History {symbol ? `- ${symbol}` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color="#9CA3AF" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{filteredAlerts.length}</Text>
              <Text style={styles.statLabel}>Total Alerts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {filteredAlerts.filter(a => a.status === 'ACTIVE').length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {filteredAlerts.filter(a => a.result?.outcome === 'WIN').length}
              </Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
          </View>

          <ScrollView style={styles.alertsList}>
            {filteredAlerts.length > 0 ? (
              filteredAlerts
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map(renderAlertItem)
            ) : (
              <View style={styles.emptyState}>
                <AlertCircle color="#6B7280" size={48} />
                <Text style={styles.emptyText}>No alerts found</Text>
                <Text style={styles.emptySubtext}>
                  {symbol ? `No alerts for ${symbol}` : 'No alert history available'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {selectedAlert && renderAlertDetails(selectedAlert)}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  alertsList: {
    flex: 1,
    paddingBottom: 20,
  },
  alertItem: {
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  alertHeader: {
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  alertMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  confidenceText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertPrice: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultContainer: {
    alignItems: 'flex-end',
  },
  pnlText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Detail modal styles
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailModalContent: {
    backgroundColor: '#111827',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailScroll: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reasonText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 8,
  },
});