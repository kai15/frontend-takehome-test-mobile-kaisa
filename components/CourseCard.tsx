import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Badge, Button, Card, Text, useTheme } from "react-native-paper";

export default function CourseCard({ course }: any) {
    const router = useRouter();
    const theme = useTheme();

    return (
        <Card style={styles.card} onPress={() => router.push(`/course/${course.id}`)}>
            <Card.Cover source={{ uri: course.image }} style={styles.cover} />
            <Card.Content style={styles.content}>
                <View style={styles.row}>
                    <Badge style={[styles.badge, {color: theme.colors.onTertiary}]}>{course.category}</Badge>
                    <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={14} color={"#FACC15"} />
                        <Text variant="labelSmall" style={styles.ratingText}>
                            {course.rating ?? '4.0'}
                        </Text>
                    </View>
                </View>

                <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                    {course.title}
                </Text>

                <Text variant="bodySmall" numberOfLines={2} style={styles.desc}>
                    {course.description}
                </Text>
            </Card.Content>

            <Card.Actions style={styles.actions}>
                <Button
                    mode="contained"
                    buttonColor="#06B6D4"
                    contentStyle={styles.buttonContent}
                    style={styles.buttonSmall}
                    labelStyle={styles.buttonLabel}
                >
                    Learn More
                </Button>
            </Card.Actions>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        // backgroundColor: '#FFFFFF',
        elevation: 2
    },
    cover: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        height: 150
    },
    content: {
        marginTop: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    badge: {
        backgroundColor: '#00B8DB',
        // color: '#00B8DB',
        borderRadius: 4,
        paddingHorizontal: 8,
        height: 20,
        fontSize: 12
    },
    title: {
        fontWeight: 'bold'
    },
    desc: {
        // color: '#666666',
        marginTop: 4
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    ratingText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    actions: {
        paddingBottom: 12,
        paddingHorizontal: 8
    },
    buttonContent: {
        height: 32
    },
    buttonSmall: {
        borderRadius: 6,
        minWidth: 80
    },
    buttonLabel: {
        fontSize: 12,
        marginVertical: 0,
        marginHorizontal: 8
    }
})