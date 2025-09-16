import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, 
  BellOff, 
  TrendingUp, 
  BarChart3, 
  Newspaper, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Trash2
} from 'lucide-react-native';
import { SmartAlert } from '@/types/forex';

interface SmartAlertCardProps {
  alert: SmartAlert;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SmartAlertCard({ alert, onToggle, onDelete }: SmartAlertCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price': return <TrendingUp size={16} color="#00D4AA" />;
      case 'technical': return <BarChart3 size={16} color="#F59E0B" />;
      case 'news': return <Newspaper size={16} color="#8B5CF6" />;
      case 'ai_signal': return <Brain size={16} color="#EF4444" />;
      default: return <Bell size={16} color="#9CA3AF" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'price': return 'Price Alert';
      case 'technical': return 'Technical';
      case 'news': return 'News Alert';
      case 'ai_signal': return 'AI Signal';
      default: return 'Alert';
    }
  };

  return (
    <LinearGradient
      colors={alert.triggered ? ['#1F2937', '#374151'] : ['#1F2937', '#374151']}
      style={[
        styles.container,
        alert.triggered && styles.triggeredContainer,
        !alert.isActive && styles.inactiveContainer
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.alertInfo}>
          {getTypeIcon(alert.type)}
          <View style={styles.alertText}>
            <Text style={styles.symbol}>{alert.symbol}</Text>
            <Text style={styles.type}>{getTypeLabel(alert.type)}</Text>
          </View>
        </View>
        
        <View style={styles.controls}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
            <Text style={styles.priorityText}>{alert.priority.toUpperCase()}</Text>
          </View>
          <Switch
            value={alert.isActive}
            onValueChange={() => onToggle(alert.id)}
            trackColor={{ false: '#374151', true: '#00D4AA40' }}
            thumbColor={alert.isActive ? '#00D4AA' : '#9CA3AF'}
          />
        </View>
      </View>

      {/* Status */}
      <View style={styles.statusContainer}>
        {alert.triggered ? (
          <View style={styles.status}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.statusText}>
              Triggered {alert.triggeredAt?.toLocaleString()}
            </Text>
          </View>
        ) : (
          <View style={styles.status}>
            {alert.isActive ? (
              <Bell size={14} color="#00D4AA" />
            ) : (
              <BellOff size={14} color="#6B7280" />
            )}
            <Text style={styles.statusText}>
              {alert.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        )}
        
        {alert.aiEnhanced && (
          <View style={styles.aiEnhanced}>
            <Brain size={12} color="#8B5CF6" />
            <Text style={styles.aiText}>AI Enhanced</Text>
          </View>
        )}
      </View>

      {/* Condition */}
      <View style={styles.conditionContainer}>
        <Text style={styles.conditionLabel}>Condition:</Text>
        <Text style={styles.condition}>{alert.condition}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.createdAt}>
          Created: {alert.createdAt.toLocaleDateString()}
        </Text>
        <TouchableOpacity 
          onPress={() => onDelete(alert.id)}
          style={styles.deleteButton}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
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
  triggeredContainer: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  inactiveContainer: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertText: {
    marginLeft: 8,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  type: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#D1D5DB',
    marginLeft: 4,
  },
  aiEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiText: {
    fontSize: 10,
    color: '#8B5CF6',
    marginLeft: 2,
    fontWeight: '600',
  },
  conditionContainer: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  conditionLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  condition: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 10,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 4,
  },
});