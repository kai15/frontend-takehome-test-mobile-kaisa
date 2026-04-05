import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { useTheme } from "react-native-paper";

export default function Loading() {
    const theme = useTheme();
    return (
        <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color="#06B6D4" />
            <Text style={styles.loadingText}>Loading data...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 5,
        color: '#8E8E93'
    },
})