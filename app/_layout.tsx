import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, Switch } from 'react-native-paper';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const THEME_SETTING = '@user_theme_preference';
export default function RootLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [ready, setReady] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const currentTheme = await AsyncStorage.getItem(THEME_SETTING);
        if (currentTheme !== null) {
          setDarkMode(currentTheme === 'dark');
        }
      } catch (e) {
        console.log("Error message", e)
      } finally {
        setReady(true);
      }
    }
    loadTheme();
  }, []);

  const handleTheme = async () => {
    try {
      const tempValue = !darkMode;
      setDarkMode(tempValue);
      await AsyncStorage.setItem(THEME_SETTING, tempValue ? 'dark' : 'light');
    } catch (e) {
      console.log("errror message", e)
    }
  }

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!ready) return null;

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav darkMode={darkMode} handleTheme={handleTheme} />;
}

function RootLayoutNav({ darkMode = false, handleTheme }: any) {
  const colorScheme = useColorScheme();
  const theme = darkMode ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
    {/* <PaperProvider theme={theme}> */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          headerShadowVisible: false,
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginRight: 10 }}>
                <MaterialCommunityIcons
                  name={darkMode ? "weather-night" : "weather-sunny"}
                  size={20}
                  color={theme.colors.onSurface}
                />
                <Switch
                  value={darkMode}
                  onValueChange={handleTheme}
                  color="#06B6D4"
                />
              </View>
            )
          }
        }}
      >
        <Stack.Screen name="index" options={{ title: "Courses" }} />
        <Stack.Screen 
          name="course/[id]" 
          options={{ 
            title: "Course Detail",
            headerBackTitle: "Back" 
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </PaperProvider>
  );
}
