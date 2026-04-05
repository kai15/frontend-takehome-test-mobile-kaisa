import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface EmptyData {
    description?: string;
    icon?: MaterialCommunityIconName;
}

export default function EmptyData({ description, icon }: EmptyData) {
    const theme = useTheme();
    return (
        <View style={styles.empty}>
            {icon ? <MaterialCommunityIcons name={icon} size={80} color={theme.colors.outlineVariant} /> : null}
            <Text style={{ color: theme.colors.onSurfaceVariant }}>{description ?? 'Oops! No data found.'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    empty: {
        alignItems: "center",
        marginTop: 40
    }
})