import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PayScreen from '../screens/PayScreen';
import PostPaymentScreen from '../screens/PostPaymentScreen';
import type { Category } from '../store/financeStore';

export type PayStackParamList = {
  PayMain: undefined;
  PostPayment: {
    amount: number;
    vendor: string;
    category: Category;
    isRecurring: boolean;
    frequency?: 'Weekly' | 'Monthly' | 'Yearly';
  };
};

const Stack = createNativeStackNavigator<PayStackParamList>();

export default function PayStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PayMain" component={PayScreen} />
      <Stack.Screen name="PostPayment" component={PostPaymentScreen} />
    </Stack.Navigator>
  );
}
