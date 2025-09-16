import { Tabs } from "expo-router";
import { Home, TrendingUp, Target, Zap, Brain } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00D4AA",
        tabBarInactiveTintColor: "#6B7280",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1F2937",
          borderTopColor: "#374151",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === 'web' ? 12 : 10,
          fontWeight: "600" as const,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'web' ? 4 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: "Markets",
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="strategies"
        options={{
          title: "Strategies",
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="scalping"
        options={{
          title: "Scalping AI",
          tabBarIcon: ({ color, size }) => <Zap color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ml"
        options={{
          title: "ML Trading",
          tabBarIcon: ({ color, size }) => <Brain color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}