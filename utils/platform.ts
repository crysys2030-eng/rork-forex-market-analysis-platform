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
      try {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            return window.localStorage.getItem(key);
          }
          return null;
        } else {
          // Use AsyncStorage for mobile (iOS/Android)
          const AsyncStorage = await import('@react-native-async-storage/async-storage');
          return await AsyncStorage.default.getItem(key);
        }
      } catch (error) {
        console.warn('Storage getItem failed:', error);
        return null;
      }
    },
    
    async setItem(key: string, value: string): Promise<void> {
      try {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            window.localStorage.setItem(key, value);
          }
        } else {
          // Use AsyncStorage for mobile (iOS/Android)
          const AsyncStorage = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.default.setItem(key, value);
        }
      } catch (error) {
        console.warn('Storage setItem failed:', error);
      }
    },
    
    async removeItem(key: string): Promise<void> {
      try {
        if (Platform.OS === 'web') {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            window.localStorage.removeItem(key);
          }
        } else {
          // Use AsyncStorage for mobile (iOS/Android)
          const AsyncStorage = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.default.removeItem(key);
        }
      } catch (error) {
        console.warn('Storage removeItem failed:', error);
      }
    }
  },
  
  // Platform-specific fetch with timeout and Android compatibility
  fetchWithTimeout: async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      // Android-specific headers and options
      const androidSafeOptions: RequestInit = {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': Platform.OS === 'android' ? 'ReactNative/Android' : Platform.OS === 'ios' ? 'ReactNative/iOS' : 'ReactNative/Web',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options.headers,
        },
        // Android-specific network settings
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit', // Don't send credentials for public APIs
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      };
      
      // Add retry logic for Android network issues
      let lastError: Error | null = null;
      const maxRetries = Platform.OS === 'android' ? 2 : 1;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, androidSafeOptions);
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          lastError = error as Error;
          
          // Don't retry on abort or timeout
          if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
            break;
          }
          
          // Wait before retry (only on Android)
          if (attempt < maxRetries && Platform.OS === 'android') {
            await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
          }
        }
      }
      
      throw lastError;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(`Fetch failed for ${url} after retries:`, error);
      throw error;
    }
  },
  
  // Safe fetch with fallback for Android
  safeFetch: async (url: string, options: RequestInit = {}, timeout: number = 8000) => {
    try {
      const response = await PlatformUtils.fetchWithTimeout(url, options, timeout);
      
      // Additional validation for Android
      if (Platform.OS === 'android' && !response.ok && response.status === 0) {
        throw new Error('Network connection failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Safe fetch failed for ${url}:`, errorMessage);
      
      // Return a mock response that indicates failure but doesn't crash
      return {
        ok: false,
        status: 0,
        statusText: 'Network Error',
        json: async () => {
          throw new Error('Network request failed');
        },
        text: async () => {
          throw new Error('Network request failed');
        },
      } as unknown as Response;
    }
  },
  
  // Platform-specific haptic feedback
  hapticFeedback: async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (Platform.OS !== 'web') {
        // Use expo-haptics for mobile
        const Haptics = await import('expo-haptics');
        switch (type) {
          case 'light':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        }
      } else {
        // Web fallback - use vibration API if available
        if ('vibrate' in navigator) {
          const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
          navigator.vibrate(duration);
        }
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      // Fallback to console log for debugging
      console.log(`Haptic feedback: ${type}`);
    }
  },
  
  // Platform-specific dimensions
  getDimensions: async () => {
    try {
      if (Platform.OS === 'web') {
        return {
          width: typeof window !== 'undefined' ? window.innerWidth : 375,
          height: typeof window !== 'undefined' ? window.innerHeight : 812
        };
      } else {
        // Use Dimensions from react-native for mobile
        const { Dimensions } = await import('react-native');
        const { width, height } = Dimensions.get('window');
        return { width, height };
      }
    } catch (error) {
      console.warn('Failed to get dimensions:', error);
      return { width: 375, height: 812 };
    }
  },
  
  // Platform-specific safe area handling
  getSafeAreaInsets: () => {
    try {
      if (Platform.OS === 'web') {
        return { top: 0, bottom: 0, left: 0, right: 0 };
      } else {
        // Default safe area values for mobile
        // In actual usage, this should be replaced with useSafeAreaInsets hook
        return Platform.OS === 'ios' 
          ? { top: 44, bottom: 34, left: 0, right: 0 }
          : { top: 24, bottom: 0, left: 0, right: 0 }; // Android status bar
      }
    } catch (error) {
      console.warn('Failed to get safe area insets:', error);
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  },
  
  // Platform-specific vibration
  vibrate: async (pattern?: number | number[]) => {
    try {
      if (Platform.OS !== 'web') {
        const RN = await import('react-native');
        if (pattern) {
          RN.Vibration.vibrate(pattern);
        } else {
          RN.Vibration.vibrate();
        }
      } else {
        // Web vibration API
        if ('vibrate' in navigator) {
          if (Array.isArray(pattern)) {
            navigator.vibrate(pattern);
          } else {
            navigator.vibrate(pattern || 200);
          }
        }
      }
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }
};

// Export platform checks for convenience
export const { isWeb, isMobile, isIOS, isAndroid } = PlatformUtils;

// Export commonly used functions
export const { getTimeout, getInterval, hapticFeedback, vibrate, fetchWithTimeout, safeFetch } = PlatformUtils;
export const { storage } = PlatformUtils;