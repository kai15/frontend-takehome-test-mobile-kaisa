import CommentCard from "@/components/CommentCard";
import EmptyData from "@/components/EmptyData";
import data from "@/data/data.json";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Badge, Divider, Text, useTheme } from "react-native-paper";

export default function CourseDetailScreen() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const course = data.courses.find(val => val.id === id);
    const [comments, setComments] = useState(course?.comments ?? [])
    const [user, setUser] = useState<{ id: string, name: string }>({ id: '', name: '' })

    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await AsyncStorage.getItem('user_session');
            setUser(currentUser ? JSON.parse(currentUser) : null);
        }
        loadUser();
    }, []);

    useEffect(() => {
        const loadComment = async () => {
            const dataLocalComment = await AsyncStorage.getItem(`comments-${id}`);
            const dataLocalLiked = await AsyncStorage.getItem(`likedComment-${id}`);

            if (dataLocalComment) {
                try {
                    const dataComment = JSON.parse(dataLocalComment);
                    setComments(dataComment);
                } catch (_) {
                    // ignore invalid JSON
                }
            }

            if (dataLocalLiked) {
                try {
                    const dataLiked = JSON.parse(dataLocalLiked);
                    const listComment = dataLocalComment ? JSON.parse(dataLocalComment) : Array.from(comments);
                    dataLiked.map((item: any) => {
                        const checkData = listComment.findIndex((v: any) => v.id === item.id)
                        if (checkData > -1) {
                            listComment[checkData] = item;
                            setComments(listComment);
                        }
                        return;
                    })
                } catch (_) {
                    // ignore invalid JSON
                }
            }
        }
        loadComment();
    }, [comments])

    if (!course) {
        return (
            <EmptyData />
        )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} keyboardShouldPersistTaps="handled">
                <Image source={{ uri: course.image }} style={styles.image} />
                <View style={styles.content}>
                    <View style={styles.row}>
                        <Badge style={[styles.badge, { color: theme.colors.onTertiary }]}>
                            {course.category}
                        </Badge>
                        <View style={styles.rating}>
                            <MaterialCommunityIcons name="star" size={18} color="#FACC15" />
                            <Text style={[styles.rating, { color: theme.colors.onSurface }]}>
                                {course.rating ?? '4.0'}
                            </Text>
                        </View>
                    </View>
                    <Text variant="titleMedium" style={styles.title}>
                        {course.title}
                    </Text>

                    <View style={styles.infoRow}>
                        <View style={[styles.infoRow, { gap: 4 }]}>
                            <MaterialCommunityIcons name="account-multiple" size={16} color={theme.colors.onSurface} />
                            <Text>{course.author ?? 0}</Text>
                        </View>
                        <View style={[styles.infoRow, { gap: 4 }]}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onSurface} />
                            <Text>{course.duration ?? 0}</Text>
                        </View>
                        <View style={[styles.infoRow, { gap: 4 }]}>
                            <MaterialCommunityIcons name="poll" size={16} color={theme.colors.onSurface} />
                            <Text>{course.level ?? ''}</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold', marginBottom: 8 }}>
                        About this course
                    </Text>
                    <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                        {course.description}
                    </Text>

                    <View style={[styles.curriculumCard]}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {course.content}
                        </Text>
                    </View>

                    <Divider style={styles.divider} />

                    <CommentCard
                        id={id}
                        data={comments}
                        user={user}
                        setUser={setUser}
                        setComments={setComments}
                    />

                </View>
            </ScrollView>
            <View style={[styles.stickyInputContainer, { backgroundColor: theme.colors.background }]} />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    stickyInputContainer: {
        padding: 20,
    },
    container: {
        flex: 1
    },
    image: {
        width: "100%",
        height: 250
    },
    content: {
        padding: 20,
        paddingBottom: 60
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    badge: {
        backgroundColor: "#00B8DB",
        // color: "#FFFFFF",
        paddingHorizontal: 12,
        height: 24,
        borderRadius: 6
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    title: {
        fontWeight: "bold",
        marginBottom: 8
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        gap: 6
    },
    divider: {
        marginVertical: 16
    },
    description: {
        lineHeight: 22,
        fontSize: 15
    },
    curriculumCard: {
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc'
    },
})