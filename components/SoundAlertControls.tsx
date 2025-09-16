import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Volume2, VolumeX, TestTube, Settings } from 'lucide-react-native';

interface SoundAlertControlsProps {
  isEnabled: boolean;
  onToggle: () => void;
  onTest: () => void;
  onSettings?: () => void;
  style?: any;
}

export function SoundAlertControls({ 
  isEnabled, 
  onToggle, 
  onTest, 
  onSettings,
  style 
}: SoundAlertControlsProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.alertToggle}>
        {isEnabled ? (
          <Volume2 color="#10B981" size={16} />
        ) : (
          <VolumeX color="#6B7280" size={16} />
        )}
        <Text style={[styles.alertLabel, { color: isEnabled ? '#10B981' : '#6B7280' }]}>
          Sound Alerts
        </Text>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: '#374151', true: 'rgba(16, 185, 129, 0.3)' }}
          thumbColor={isEnabled ? '#10B981' : '#9CA3AF'}
          style={styles.switch}
        />
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onTest}
          style={[styles.controlButton, styles.testButton]}
          disabled={!isEnabled}
        >
          <TestTube color={isEnabled ? '#8B5CF6' : '#6B7280'} size={14} />
          <Text style={[styles.controlButtonText, { color: isEnabled ? '#8B5CF6' : '#6B7280' }]}>
            Test
          </Text>
        </TouchableOpacity>
        
        {onSettings && (
          <TouchableOpacity
            onPress={onSettings}
            style={[styles.controlButton, styles.settingsButton]}
            disabled={!isEnabled}
          >
            <Settings color={isEnabled ? '#F59E0B' : '#6B7280'} size={14} />
            <Text style={[styles.controlButtonText, { color: isEnabled ? '#F59E0B' : '#6B7280' }]}>
              Settings
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  alertToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
  },
  testButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  settingsButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});