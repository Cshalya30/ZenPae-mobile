import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import RootNavigator from './src/navigation/RootNavigator';
import AppPinScreen from './src/screens/AppPinScreen';
import LaunchScreen from './src/screens/LaunchScreen';
import { fontFamily } from './src/theme/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [fontsLoaded] = useFonts({
    [fontFamily.regular]: Inter_400Regular,
    [fontFamily.medium]: Inter_500Medium,
    [fontFamily.semiBold]: Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  if (!Text.defaultProps) Text.defaultProps = {};
  if (!TextInput.defaultProps) TextInput.defaultProps = {};
  Text.defaultProps.style = [{ fontFamily: fontFamily.medium }, Text.defaultProps.style];
  TextInput.defaultProps.style = [{ fontFamily: fontFamily.medium }, TextInput.defaultProps.style];

  if (!ready) {
    return <LaunchScreen onDone={() => setReady(true)} />;
  }

  if (!unlocked) {
    return <AppPinScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
