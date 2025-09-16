import { useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { PlatformUtils } from '@/utils/platform';

interface SoundAlertConfig {
  enabled: boolean;
  volume: number;
  vibrationEnabled: boolean;
  alertTypes: {
    scalping: boolean;
    mlTrading: boolean;
    highConfidence: boolean;
    criticalSignals: boolean;
  };
}

interface AlertTrigger {
  type: 'SCALPING' | 'ML_TRADING' | 'HIGH_CONFIDENCE' | 'CRITICAL';
  symbol: string;
  confidence: number;
  timestamp: Date;
}

export function useSoundAlerts() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAlertRef = useRef<{ [key: string]: number }>({});
  const configRef = useRef<SoundAlertConfig>({
    enabled: true,
    volume: 0.7,
    vibrationEnabled: true,
    alertTypes: {
      scalping: true,
      mlTrading: true,
      highConfidence: true,
      criticalSignals: true,
    },
  });

  // Initialize audio context for web
  const initializeAudio = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        if (!audioContextRef.current) {
          // @ts-ignore - AudioContext is available in browser
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return true;
      } catch (error) {
        console.warn('Audio context not available:', error);
        return false;
      }
    }
    return true;
  }, []);

  // Generate alert sound using Web Audio API
  const playWebAlert = useCallback((frequency: number, duration: number, type: 'beep' | 'chime' | 'notification') => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Different sound patterns for different alert types
      switch (type) {
        case 'beep':
          oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
          oscillator.type = 'sine';
          break;
        case 'chime':
          oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContextRef.current.currentTime + duration / 2);
          oscillator.type = 'triangle';
          break;
        case 'notification':
          oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
          oscillator.frequency.setValueAtTime(frequency * 1.2, audioContextRef.current.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime + 0.2);
          oscillator.type = 'square';
          break;
      }
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(configRef.current.volume * 0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Error playing web alert:', error);
    }
  }, []);

  // Cross-platform vibration
  const playVibration = useCallback(async (type: 'beep' | 'chime' | 'notification') => {
    if (!configRef.current.vibrationEnabled) return;
    
    if (Platform.OS !== 'web') {
      try {
        const Haptics = await import('expo-haptics');
        switch (type) {
          case 'beep':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'chime':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'notification':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        }
      } catch (error) {
        console.warn('Haptics not available, trying vibration:', error);
        try {
          const { Vibration } = await import('react-native');
          switch (type) {
            case 'beep':
              Vibration.vibrate(200);
              break;
            case 'chime':
              Vibration.vibrate([0, 150, 100, 150]);
              break;
            case 'notification':
              Vibration.vibrate([0, 100, 50, 100, 50, 200]);
              break;
          }
        } catch (vibError) {
          console.warn('Vibration not available:', vibError);
        }
      }
    } else {
      // Web vibration API
      if ('vibrate' in navigator) {
        switch (type) {
          case 'beep':
            navigator.vibrate(200);
            break;
          case 'chime':
            navigator.vibrate([150, 100, 150]);
            break;
          case 'notification':
            navigator.vibrate([100, 50, 100, 50, 200]);
            break;
        }
      }
    }
  }, []);

  // Play native alert sound (for mobile)
  const playNativeAlert = useCallback(async (type: 'beep' | 'chime' | 'notification') => {
    if (Platform.OS !== 'web') {
      // Use vibration as the primary alert method
      await playVibration(type);
    }
  }, [playVibration]);

  // Main alert function
  const playAlert = useCallback((trigger: AlertTrigger) => {
    if (!configRef.current.enabled) return;

    // Prevent spam - only allow one alert per symbol per 5 seconds
    const now = Date.now();
    const lastAlert = lastAlertRef.current[trigger.symbol] || 0;
    if (now - lastAlert < 5000) return;
    
    lastAlertRef.current[trigger.symbol] = now;

    // Check if this alert type is enabled
    const alertTypeEnabled = {
      'SCALPING': configRef.current.alertTypes.scalping,
      'ML_TRADING': configRef.current.alertTypes.mlTrading,
      'HIGH_CONFIDENCE': configRef.current.alertTypes.highConfidence,
      'CRITICAL': configRef.current.alertTypes.criticalSignals,
    }[trigger.type];

    if (!alertTypeEnabled) return;

    // Determine sound characteristics based on alert type and confidence
    let frequency = 800;
    let duration = 0.3;
    let soundType: 'beep' | 'chime' | 'notification' = 'beep';

    switch (trigger.type) {
      case 'SCALPING':
        frequency = 900;
        duration = 0.2;
        soundType = 'beep';
        break;
      case 'ML_TRADING':
        frequency = 700;
        duration = 0.4;
        soundType = 'chime';
        break;
      case 'HIGH_CONFIDENCE':
        frequency = 1000;
        duration = 0.5;
        soundType = 'notification';
        break;
      case 'CRITICAL':
        frequency = 1200;
        duration = 0.6;
        soundType = 'notification';
        break;
    }

    // Adjust frequency based on confidence level
    if (trigger.confidence > 90) {
      frequency *= 1.2;
      duration *= 1.2;
    } else if (trigger.confidence > 80) {
      frequency *= 1.1;
      duration *= 1.1;
    }

    console.log(`🔊 Playing ${trigger.type} alert for ${trigger.symbol} (${trigger.confidence}% confidence)`);

    // Play appropriate sound based on platform
    if (Platform.OS === 'web') {
      if (initializeAudio()) {
        playWebAlert(frequency, duration, soundType);
      }
      // Web vibration API if available
      if (configRef.current.vibrationEnabled && 'vibrate' in navigator) {
        switch (soundType) {
          case 'beep':
            navigator.vibrate(200);
            break;
          case 'chime':
            navigator.vibrate([150, 100, 150]);
            break;
          case 'notification':
            navigator.vibrate([100, 50, 100, 50, 200]);
            break;
        }
      }
    } else {
      playNativeAlert(soundType);
    }
  }, [initializeAudio, playWebAlert, playNativeAlert]);

  // Configuration functions
  const updateConfig = useCallback((newConfig: Partial<SoundAlertConfig>) => {
    configRef.current = { ...configRef.current, ...newConfig };
  }, []);

  const toggleAlerts = useCallback(() => {
    configRef.current.enabled = !configRef.current.enabled;
    console.log(`🔊 Sound alerts ${configRef.current.enabled ? 'enabled' : 'disabled'}`);
  }, []);

  const setVolume = useCallback((volume: number) => {
    configRef.current.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const toggleVibration = useCallback(() => {
    configRef.current.vibrationEnabled = !configRef.current.vibrationEnabled;
    console.log(`📳 Vibration alerts ${configRef.current.vibrationEnabled ? 'enabled' : 'disabled'}`);
  }, []);

  // Test alert function
  const testAlert = useCallback((type: AlertTrigger['type'] = 'SCALPING') => {
    playAlert({
      type,
      symbol: 'TEST',
      confidence: 85,
      timestamp: new Date(),
    });
  }, [playAlert]);

  // Initialize audio context on first use
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Initialize on user interaction to comply with browser policies
      const handleUserInteraction = () => {
        initializeAudio();
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
      
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [initializeAudio]);

  return {
    playAlert,
    updateConfig,
    toggleAlerts,
    setVolume,
    toggleVibration,
    testAlert,
    config: configRef.current,
    isEnabled: configRef.current.enabled,
    isVibrationEnabled: configRef.current.vibrationEnabled,
  };
}