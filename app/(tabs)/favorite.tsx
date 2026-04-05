import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import Loading from '@/components/Loading';
import EmptyData from '@/components/EmptyData';

interface Favorite {
    id: number;
    courseId: number;
    course: {
        id: number;
        title: string;
        description: string;
    };
    user: {
        name: string;
    };
}

const FavoriteScreen = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/favorites?userId=${user?.id}`);
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
            return () => { };
        }, [user?.id])
    );

    const handleRemoveFavorite = async (id: number) => {
        setLoadingDelete(true);
        try {
            const response = await fetch(`${baseUrl}/favorites?id=${id}&userId=${user?.id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: result?.message ?? 'Success deleted favorite'
                });
                fetchFavorites();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result?.error ?? 'Failed deleted favorite'
                });
            }
        } catch (error) {
            console.error("Failed deleted favorite:", error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed deleted favorite'
            });
        } finally {
            setLoadingDelete(false);
        }
    }

    const renderItem = ({ item }: { item: Favorite }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
            <TouchableOpacity
                style={styles.cardMainAction}
                onPress={() => router.push(`/course/${item.courseId}`)}
            >
                <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="book-open-variant" size={24} color="#06B6D4" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.courseTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {item.course.title}
                    </Text>
                    <Text style={[styles.instructorName, { color: theme.colors.outline }]} numberOfLines={1}>
                        {item.course.description}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleRemoveFavorite(item.id)}
                style={styles.deleteIconButton}
                disabled={loadingDelete}
            >
                {loadingDelete
                    ? <ActivityIndicator />
                    : <Ionicons name="trash-outline" size={20} color="#FF3B30" />}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>My Favorites</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.outline }]}>
                        {favorites.length} items saved
                    </Text>
                </View>

                {favorites.length > 0 && (
                    <TouchableOpacity
                        onPress={() => handleRemoveFavorite(0)}
                        style={styles.clearButton}
                        disabled={loadingDelete}
                    >
                        {loadingDelete
                            ? <ActivityIndicator />
                            : <Text style={{ color: '#FF3B30', fontWeight: '600' }}>
                                Clear All
                            </Text>}
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <Loading />
            ) : favorites.length === 0 ? (
                <View style={styles.center}>
                    <EmptyData description='No Favorites yet.' icon="heart" />
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onRefresh={fetchFavorites}
                    refreshing={loading}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    instructorName: {
        fontSize: 13,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    clearButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
    },
    cardMainAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIconButton: {
        padding: 10,
        marginLeft: 5,
        backgroundColor: 'rgba(255, 59, 48, 0.05)',
        borderRadius: 10,
    },
});

export default FavoriteScreen;