import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wifi, WifiOff, Settings } from 'lucide-react-native';
import { useMT5Connection } from '@/hooks/useMT5Connection';

export const MT5ConnectionCard: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [showForm, setShowForm] = useState(false);

  const {
    isConnected,
    isConnecting,
    account,
    error,
    connect,
    disconnect
  } = useMT5Connection();

  const handleConnect = async () => {
    if (!login || !password || !server) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await connect(login, password, server);
      setShowForm(false);
    } catch (err) {
      Alert.alert('Connection Failed', 'Unable to connect to MT5');
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect from MT5?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', onPress: disconnect, style: 'destructive' }
      ]
    );
  };

  if (isConnected && account) {
    return (
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.connectedCard}
      >
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <Wifi size={20} color="#FFFFFF" />
            <Text style={styles.statusText}>Connected to MT5</Text>
          </View>
          <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
            <WifiOff size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountDetails}>
            Login: {account.login} | Server: {account.server}
          </Text>
        </View>

        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceValue}>${account.balance.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Equity</Text>
            <Text style={styles.balanceValue}>${account.equity.toFixed(2)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Profit</Text>
            <Text style={[
              styles.balanceValue,
              { color: account.profit >= 0 ? '#FFFFFF' : '#FEE2E2' }
            ]}>
              ${account.profit.toFixed(2)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <WifiOff size={20} color="#EF4444" />
          <Text style={styles.disconnectedText}>Not Connected to MT5</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowForm(!showForm)} 
          style={styles.settingsButton}
        >
          <Settings size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Login"
            value={login}
            onChangeText={setLogin}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Server (e.g., MetaQuotes-Demo)"
            value={server}
            onChangeText={setServer}
            placeholderTextColor="#9CA3AF"
          />
          
          <TouchableOpacity 
            style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.connectButtonText}>Connect to MT5</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {!showForm && (
        <TouchableOpacity 
          style={styles.showFormButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.showFormButtonText}>Connect to MT5</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectedCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disconnectedText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disconnectButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountDetails: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  connectButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  showFormButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  showFormButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});