import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function EmptyData() {
    const theme = useTheme();
    return (
        <View style={styles.empty}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Oops! No data found.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    empty: {
      alignItems: "center", 
      marginTop: 40
    }
})