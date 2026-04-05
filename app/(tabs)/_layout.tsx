import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
    const theme = useTheme();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: [styles.tabBar, { backgroundColor: theme.colors.background, shadowColor: theme.colors.primary }],
            tabBarActiveTintColor: '#06B6D4',
            tabBarInactiveTintColor: '#999',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorite"
                options={{
                    title: 'Favorite',
                    tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        borderTopWidth: 0,
        height: 50,
        bottom: 20,
        marginHorizontal: 20,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 15,
    },
});