import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import AppPinScreen from './src/screens/AppPinScreen';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <AppPinScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
