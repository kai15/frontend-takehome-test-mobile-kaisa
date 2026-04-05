import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Divider, IconButton, List, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import EmptyData from "@/components/EmptyData";
import Toast from 'react-native-toast-message';
import Loading from "@/components/Loading";

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

interface CommentProps {
    id: any;
    data: any[];
    user: any;
    refetch: () => Promise<void>;
    loading: boolean;
}

export default function CommentCard({ id, data = [], user, refetch, loading }: CommentProps) {
    const router = useRouter();
    const theme = useTheme();
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const [newComment, setNewComment] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');
    const [commentId, setCommentId] = useState(0);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const sortedComments = [...data].sort((a, b) => {
        if (sortBy === 'likes') {
            return b.likesCount - a.likesCount;
        }
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy.toLowerCase() === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const handleNewComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${baseUrl}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: Number(id),
                    userId: user.id,
                    message: newComment
                }),
            });

            const result = await response.json();
            if (response.ok) {
                refetch();
                setNewComment('');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result.error ?? 'Cannot add new comment!'
                });
            }

        } catch (error) {
            console.error("Failed to add comment:", error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed to add comment'
            });
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            const response = await fetch(`${baseUrl}/comments`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: commentId,
                    userId: user.id,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                refetch();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result.error ?? 'Failed to like comment'
                });
            }
        } catch (error) {
            console.error("Update failed:", error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed to like comment'
            });
        }
    };

    const handleDelete = async (commentId: number) => {
        setCommentId(commentId);
        setLoadingDelete(true);
        try {
            const response = await fetch(`${baseUrl}/comments?id=${commentId}&userId=${user.id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: result?.message ?? 'Success deleted comment'
                });
                refetch();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result?.error ?? 'Failed deleted comment'
                });
            }
        } catch (error) {
            console.error("Failed deleted comment:", error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed deleted comment'
            });
        } finally {
            setLoadingDelete(false);
            setCommentId(0);
        }
    };

    return (
        <View>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                {sortedComments.length ?? 0} Comments
            </Text>

            <View style={{ marginBottom: 5 }}>
                <SegmentedButtons
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as 'newest' | 'oldest' | 'likes')}
                    buttons={[
                        {
                            value: 'newest',
                            label: 'Newest',
                            icon: 'clock-outline',
                        },
                        {
                            value: 'oldest',
                            label: 'Oldest',
                            icon: 'clock-outline',
                        },
                        {
                            value: 'likes',
                            label: 'Top Likes',
                            icon: 'thumb-up-outline',
                        },
                    ]}
                    style={styles.segmentedButtons}
                />
            </View>

            <View style={styles.input}>
                {user?.name ? <View>
                    <Text variant="labelMedium" style={{ marginBottom: 4 }}>
                        Commenting as: {user?.name}
                    </Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        style={styles.textArea}
                        outlineStyle={{ borderRadius: 8 }}
                        right={<TextInput.Icon icon="send" onPress={handleNewComment} />}
                    />
                </View> :
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
                        <Text variant="bodyMedium">Login first to leave a comment. </Text>
                        <Text
                            variant="bodyMedium"
                            style={{ color: theme.colors.primary, fontWeight: '600' }}
                            onPress={() => router.push('/login')}
                        >
                            Login
                        </Text>
                    </View>}
            </View>

            {sortedComments?.length > 0 ? sortedComments?.map((item) => {
                const avatarUri = item.user?.avatar;
                const likedByUser = item.likedByOtherUser?.length > 0 ? item.likedByOtherUser?.find((v: any) => v.userId === user.id) : false

                return (
                    <View key={item.id} style={{ paddingBottom: 5 }}>
                        <List.Item
                            title={item.user?.name}
                            description={item.message}
                            left={() => (
                                <View style={{ justifyContent: "center", paddingLeft: 8 }}>
                                    {avatarUri ? (
                                        <Avatar.Image size={30} source={{ uri: avatarUri }} />
                                    ) : (
                                        <Avatar.Text
                                            size={30}
                                            label={(item?.user?.name ?? '?').substring(0, 1).toUpperCase()}
                                            style={{ backgroundColor: theme.colors.outlineVariant }}
                                        />
                                    )}
                                </View>
                            )}
                            right={() => (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <IconButton
                                        icon={likedByUser ? "thumb-up" : "thumb-up-outline"}
                                        iconColor={likedByUser ? "#FACC15" : theme.colors.outline}
                                        size={22}
                                        onPress={() => handleLike(item.id)}
                                    />
                                    <Text variant="labelSmall">
                                        {item.likesCount ?? 0}
                                    </Text>
                                </View>
                            )}
                            titleStyle={{ fontWeight: "bold", color: theme.colors.onSurface }}
                        />
                        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", marginTop: -10 }}>
                            <Text variant="bodySmall" style={{ marginLeft: 55, fontSize: 10 }}>
                                {new Date(item.createdAt).toLocaleString()}
                            </Text>
                            {(item?.user?.name === user?.name) && <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Text style={{ color: theme.colors.error, fontSize: 13, fontWeight: "bold" }}>
                                    {(loadingDelete && item.id === commentId) ? "Deleting..." : "Delete"}
                                </Text>
                            </TouchableOpacity>}
                        </View>
                        <Divider style={{ marginTop: 16 }} />
                    </View>
                )
            }) : loading ? <Loading /> : <EmptyData description="Be the first to leave a comment" />}
        </View>
    )
}

const styles = StyleSheet.create({
    segmentedButtons: {
        marginVertical: 10,
        height: 40,
    },
    input: {
        marginVertical: 10
    },
    textArea: {
        backgroundColor: "transparent"
    },
})