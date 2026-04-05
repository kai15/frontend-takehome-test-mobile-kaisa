import CommentCard from "@/components/CommentCard";
import EmptyData from "@/components/EmptyData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Badge, Divider, Text, useTheme } from "react-native-paper";
import Toast from 'react-native-toast-message';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';

interface Comments {
    id: number;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    likesCount: number;
    likedByUser: boolean;
    message: string;
    createdAt: string;
}

interface Courses {
    id: number;
    title: string;
    description: string;
    content: string;
    category: string;
    duration: string;
    level: string;
    author: string;
    image: string;
    rating: number;
    comments: Comments[];
    createdAt: string;
}

export default function CourseDetailScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const theme = useTheme();
    const router = useRouter();
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const [course, setCourse] = useState<Courses>({
        id: 0,
        title: '',
        description: '',
        content: '',
        category: '',
        duration: '',
        level: '',
        author: '',
        image: '',
        rating: 5,
        comments: [],
        createdAt: '',
    });
    const [comments, setComments] = useState<Comments[]>([])
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/courses?id=${id}`);
            const data = await response.json();
            if (response?.ok) {
                setCourse(data);
                setComments(data?.comments);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Sorry!',
                    text2: 'Data not found.'
                });
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error("Failed load data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const response = await fetch(`${baseUrl}/comments?courseId=${id}`);
            const data = await response.json();
            if (response?.ok) {
                setComments(data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Sorry!',
                    text2: 'Data not found.'
                });
            }
        } catch (error) {
            console.error("Failed load data:", error);
        } finally {
            setLoadingComments(false);
        }
    };

    const fetchFavorite = async () => {
        setLoadingFavorite(true);
        try {
            const response = await fetch(`${baseUrl}/favorites?courseId=${id}&userId=${user?.id}`);
            if (response?.ok) setIsFavorite(true);
            else setIsFavorite(false);
        } catch (error) {
            console.error("Failed load data:", error);
            setIsFavorite(false);
        } finally {
            setLoadingFavorite(false);
        }
    };

    useEffect(() => {
        fetchFavorite();
    }, [user]);

    const handleFavorite = async () => {
        try {
            const response = await fetch(`${baseUrl}/favorites`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: id,
                    userId: user?.id,
                }),
            });
            if (response?.ok) {
                fetchFavorite();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Sorry!',
                    text2: 'Failed to add favorite.'
                });
            }
        } catch (error) {
            console.error("Failed load data:", error);
            Toast.show({
                type: 'error',
                text1: 'Sorry!',
                text2: 'Failed to add favorite.'
            });
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchData(),
            fetchComments(),
            fetchFavorite()
        ]);
        setRefreshing(false);
    };

    if (!course) {
        return (
            <EmptyData />
        )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            {loading ? <Loading />
                : <ScrollView
                    style={[styles.container, { backgroundColor: theme.colors.background }]}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    {course.image && <Image source={{ uri: course.image }} style={styles.image} />}
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Badge style={[styles.badge, { color: theme.colors.onTertiary }]}>
                                {course.category}
                            </Badge>
                            <View style={[styles.rating, { gap: 15 }]}>
                                <View style={styles.rating}>
                                    <MaterialCommunityIcons name="star" size={18} color="#FACC15" />
                                    <Text style={[styles.rating, { color: theme.colors.onSurface }]}>
                                        {course.rating ?? '4.0'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={handleFavorite} disabled={loadingFavorite}>
                                    {loadingFavorite
                                        ? <ActivityIndicator />
                                        : <MaterialCommunityIcons name="heart" size={24} color={isFavorite ? "red" : "gray"} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text variant="titleMedium" style={styles.title}>
                            {course.title}
                        </Text>

                        <View style={styles.infoRow}>
                            <View style={[styles.infoRow, { gap: 4 }]}>
                                <MaterialCommunityIcons name="account" size={16} color={theme.colors.onSurface} />
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

                        {/* Comment section */}
                        <CommentCard
                            id={id}
                            data={comments ?? []}
                            user={user}
                            refetch={fetchComments}
                            loading={loadingComments}
                        />

                    </View>
                </ScrollView>}
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
        paddingHorizontal: 12,
        height: 24,
        borderRadius: 6,
        fontSize: 12
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