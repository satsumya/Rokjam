import { Stack } from 'expo-router';

import { PrototypeProvider } from '../src/context/PrototypeContext';

export default function RootLayout() {
  return (
    <PrototypeProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </PrototypeProvider>
  );
}
