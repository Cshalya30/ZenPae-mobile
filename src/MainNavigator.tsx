import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import DreamsScreen from '../screens/DreamsScreen';
import PayScreen from '../screens/PayScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon }: { focused: boolean; icon: string }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
  </View>
);

const TabLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
    {label}
  </Text>
);

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.zenGreen,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Home" />,
        }}
      />
      <Tab.Screen
        name="Dreams"
        component={DreamsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="✨" />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Dreams" />,
        }}
      />
      <Tab.Screen
        name="Pay"
        component={PayScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="💳" />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Pay" />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📊" />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Analytics" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Profile" />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderDark,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: COLORS.zenGreen,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(153,255,50,0.15)',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabIconActive: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.zenGreen,
  },
});
