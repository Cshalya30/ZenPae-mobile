import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { bottomNav } from '../theme/theme';

import HomeScreen from '../screens/HomeScreen';
import DreamBuyScreen from '../screens/DreamBuyScreen';
import PayStackNavigator from './PayStackNavigator';
import AnalyticsScreen from '../components/analytics/AnalyticsScreen';
import AssistantScreen from '../assistant/AssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';


const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bottomNav.background,
          borderTopColor: 'rgba(255,255,255,0.05)',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: bottomNav.active,
        tabBarInactiveTintColor: bottomNav.inactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="DreamBuy" component={DreamBuyScreen} />
      <Tab.Screen name="Pay" component={PayStackNavigator} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Assistant" component={AssistantScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
