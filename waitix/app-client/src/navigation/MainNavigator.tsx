import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/main/HomeScreen';
import { BookingConfirmScreen } from '../screens/main/BookingConfirmScreen';
import { MatchingScreen } from '../screens/main/MatchingScreen';
import { MissionLiveScreen } from '../screens/main/MissionLiveScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

export type MainStackParamList = {
  Home: undefined;
  BookingConfirm: {
    location: string;
    duration: number;
    price: number;
    basePrice: number;
    isUrgent: boolean;
    urgentSupplement: number;
  };
  Matching: {
    location: string;
    duration: number;
    price: number;
    isUrgent: boolean;
  };
  MissionLive: {
    location: string;
    duration: number;
    price: number;
    waiterName: string;
    waiterRating: number;
    waiterMissions: number;
  };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
      <Stack.Screen name="Matching" component={MatchingScreen} />
      <Stack.Screen name="MissionLive" component={MissionLiveScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
