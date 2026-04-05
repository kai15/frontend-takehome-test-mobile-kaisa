import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import * as Updates from 'expo-updates';
import '@/global.css';

import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { darkMode } = useAuth();
  const theme = darkMode ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        if (__DEV__) return;

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Auto-update error: ", error);
      }
    }

    onFetchUpdateAsync();
  }, []);
  
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style={darkMode ? "light" : "dark"}
        backgroundColor="transparent"
        translucent={true}
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.surface
          }
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ title: "Course Detail" }} />
      </Stack>
      <Toast />
    </PaperProvider>
  );
}
