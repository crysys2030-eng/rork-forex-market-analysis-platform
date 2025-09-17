import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, Component, ReactNode } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AlertTriangle, RefreshCw } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RealTimeDataProvider } from "@/contexts/RealTimeDataContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
try {
  if (Platform.OS !== 'web') {
    SplashScreen.preventAutoHideAsync();
  }
} catch (error) {
  console.warn('SplashScreen.preventAutoHideAsync failed:', error);
}

// Cross-platform QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: Platform.OS === 'web' ? 2 : 3,
      staleTime: Platform.OS === 'web' ? 30000 : 60000,
      refetchOnWindowFocus: Platform.OS === 'web',
    },
  },
});

// Cross-platform Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('App Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <View style={errorStyles.errorCard}>
            <AlertTriangle size={48} color="#EF4444" style={errorStyles.icon} />
            <Text style={errorStyles.title}>App Error</Text>
            <Text style={errorStyles.message}>
              The trading app encountered an error. This may be due to network issues or system compatibility.
            </Text>
            <TouchableOpacity style={errorStyles.retryButton} onPress={this.handleRetry}>
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={errorStyles.retryText}>Restart App</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: Platform.OS === 'web' ? '#1F2937' : undefined,
      },
      headerTintColor: Platform.OS === 'web' ? '#FFFFFF' : undefined,
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplashScreen = async () => {
      try {
        if (Platform.OS !== 'web') {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.warn('SplashScreen.hideAsync failed:', error);
      }
    };
    
    // Small delay to ensure app is ready
    const timer = setTimeout(hideSplashScreen, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <RealTimeDataProvider>
            <GestureHandlerRootView style={styles.container}>
              {Platform.OS === 'android' && (
                <StatusBar 
                  barStyle="light-content" 
                  backgroundColor="#111827" 
                  translucent={false}
                />
              )}
              <RootLayoutNav />
            </GestureHandlerRootView>
          </RealTimeDataProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
