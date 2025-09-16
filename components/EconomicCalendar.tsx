import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar, Clock, Flag, AlertCircle } from 'lucide-react-native';
import { EconomicEvent } from '@/types/forex';

interface EconomicCalendarProps {
  events: EconomicEvent[];
}

export function EconomicCalendar({ events }: EconomicCalendarProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getImpactIcon = (impact: string) => {
    const color = getImpactColor(impact);
    return <AlertCircle color={color} size={16} />;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getValueColor = (actual?: number, forecast?: number) => {
    if (actual === undefined || forecast === undefined) return '#D1D5DB';
    if (actual > forecast) return '#00D4AA';
    if (actual < forecast) return '#EF4444';
    return '#F59E0B';
  };

  const sortedEvents = [...events].sort((a, b) => a.time.getTime() - b.time.getTime());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar color="#00D4AA" size={24} />
        <Text style={styles.title}>Economic Calendar</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <View style={styles.timeContainer}>
                <Clock color="#9CA3AF" size={14} />
                <Text style={styles.timeText}>{formatTime(event.time)}</Text>
              </View>
              
              <View style={styles.impactContainer}>
                {getImpactIcon(event.impact)}
                <Text style={[styles.impactText, { color: getImpactColor(event.impact) }]}>
                  {event.impact.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.eventContent}>
              <View style={styles.titleRow}>
                <Flag color="#9CA3AF" size={16} />
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
              
              <View style={styles.countryRow}>
                <Text style={styles.countryText}>{event.country}</Text>
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>{event.currency}</Text>
                </View>
              </View>
              
              <Text style={styles.description}>{event.description}</Text>
              
              {(event.actual !== undefined || event.forecast !== undefined || event.previous !== undefined) && (
                <View style={styles.valuesContainer}>
                  <View style={styles.valueRow}>
                    <Text style={styles.valueLabel}>Previous:</Text>
                    <Text style={styles.valueText}>
                      {event.previous !== undefined ? event.previous.toLocaleString() : 'N/A'}
                    </Text>
                  </View>
                  
                  <View style={styles.valueRow}>
                    <Text style={styles.valueLabel}>Forecast:</Text>
                    <Text style={styles.valueText}>
                      {event.forecast !== undefined ? event.forecast.toLocaleString() : 'N/A'}
                    </Text>
                  </View>
                  
                  <View style={styles.valueRow}>
                    <Text style={styles.valueLabel}>Actual:</Text>
                    <Text style={[
                      styles.valueText,
                      { color: getValueColor(event.actual, event.forecast) }
                    ]}>
                      {event.actual !== undefined ? event.actual.toLocaleString() : 'Pending'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
        
        {sortedEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar color="#6B7280" size={48} />
            <Text style={styles.emptyText}>No upcoming events</Text>
          </View>
        )}
      </ScrollView>
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
  eventCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventContent: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  countryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryText: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  currencyBadge: {
    backgroundColor: '#00D4AA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  valuesContainer: {
    backgroundColor: '#374151',
    borderRadius: 6,
    padding: 8,
    gap: 4,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
});