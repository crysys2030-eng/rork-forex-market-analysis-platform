import { Platform } from 'react-native';

// Cross-platform timeout type
export type TimeoutId = NodeJS.Timeout | number;

// Cross-platform setTimeout wrapper
export const createTimeout = (callback: () => void, delay: number): TimeoutId => {
  return setTimeout(callback, delay) as TimeoutId;
};

// Cross-platform clearTimeout wrapper
export const clearTimeoutSafe = (timeoutId: TimeoutId | undefined | null) => {
  if (timeoutId) {
    clearTimeout(timeoutId as NodeJS.Timeout);
  }
};

// Cross-platform setInterval wrapper
export const createInterval = (callback: () => void, delay: number): TimeoutId => {
  return setInterval(callback, delay) as TimeoutId;
};

// Cross-platform clearInterval wrapper
export const clearIntervalSafe = (intervalId: TimeoutId | undefined | null) => {
  if (intervalId) {
    clearInterval(intervalId as NodeJS.Timeout);
  }
};

// Cross-platform compatibility utilities
export const PlatformUtils = {
  // Check if running on web
  isWeb: Platform.OS === 'web',
  
  // Check if running on mobile (iOS or Android)
  isMobile: Platform.OS === 'ios' || Platform.OS === 'android',
  
  // Check if running on iOS
  isIOS: Platform.OS === 'ios',
  
  // Check if running on Android
  isAndroid: Platform.OS === 'android',
  
  // Get platform-specific timeout values
  getTimeout: (webTimeout: number, mobileTimeout: number) => {
    return Platform.OS === 'web' ? webTimeout : mobileTimeout;
  },
  
  // Get platform-specific interval values
  getInterval: (webInterval: number, mobileInterval: number) => {
    return Platform.OS === 'web' ? webInterval : mobileInterval;
  },
  
  // Platform-specific storage
  storage: {
    async getItem(key: string): Promise<string | null> {
      if (Platform.OS === 'web') {
        try {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            return window.localStorage.getItem(key);
          }
        } catch (error) {
          console.warn('localStorage not available:', error);
        }
      }
      // For mobile, we would use AsyncStorage, but for now use memory storage
      return null;
    },
    
    async setItem(key: string, value: string): Promise<void> {
      if (Platform.OS === 'web') {
        try {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            window.localStorage.setItem(key, value);
            return;
          }
        } catch (error) {
          console.warn('localStorage not available:', error);
        }
      }
      // For mobile, we would use AsyncStorage
    }
  },
  
  // Platform-specific fetch with timeout
  fetchWithTimeout: async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },
  
  // Platform-specific haptic feedback
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS !== 'web') {
      // On mobile, we would use expo-haptics
      console.log(`Haptic feedback: ${type}`);
    } else {
      // Web fallback - could use vibration API if available
      if ('vibrate' in navigator) {
        const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
        navigator.vibrate(duration);
      }
    }
  },
  
  // Platform-specific dimensions
  getDimensions: () => {
    if (Platform.OS === 'web') {
      return {
        width: typeof window !== 'undefined' ? window.innerWidth : 375,
        height: typeof window !== 'undefined' ? window.innerHeight : 812
      };
    }
    // On mobile, we would use Dimensions from react-native
    return { width: 375, height: 812 };
  },
  
  // Platform-specific safe area handling
  getSafeAreaInsets: () => {
    if (Platform.OS === 'web') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    // On mobile, we would use useSafeAreaInsets
    return { top: 44, bottom: 34, left: 0, right: 0 };
  }
};

// Export platform checks for convenience
export const { isWeb, isMobile, isIOS, isAndroid } = PlatformUtils;

// Export commonly used functions
export const { getTimeout, getInterval, hapticFeedback } = PlatformUtils;