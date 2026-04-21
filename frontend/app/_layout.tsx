import 'react-native-url-polyfill/auto';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {AuthProvider} from "@/src/context/AuthContext";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="sign-in" />
                <Stack.Screen name="sign-up" />
            </Stack>
        </AuthProvider>
      <StatusBar style="light" />
    </>
  );
}
