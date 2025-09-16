import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Settings, User } from 'lucide-react-native';

interface ProfessionalHeaderProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  showSettings?: boolean;
  showProfile?: boolean;
  onNotificationsPress?: () => void;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
}

export function ProfessionalHeader({
  title,
  subtitle,
  showNotifications = true,
  showSettings = true,
  showProfile = false,
  onNotificationsPress,
  onSettingsPress,
  onProfilePress,
}: ProfessionalHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={styles.actionsContainer}>
        {showNotifications && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onNotificationsPress}
          >
            <Bell color="#9CA3AF" size={20} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
        
        {showSettings && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onSettingsPress}
          >
            <Settings color="#9CA3AF" size={20} />
          </TouchableOpacity>
        )}
        
        {showProfile && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onProfilePress}
          >
            <User color="#9CA3AF" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});