import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PrototypeProvider } from '../src/context/PrototypeContext';
import { fontMap } from '../src/theme/fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PrototypeProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </PrototypeProvider>
    </GestureHandlerRootView>
  );
}
