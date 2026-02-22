import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Divider, IconButton, List, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import EmptyData from "./EmptyData";

interface CommentProps {
    id: any;
    data: any[];
    user: any;
    setUser: any;
    setComments: any;
}

export default function CommentCard({ id, data = [], user, setUser, setComments }: CommentProps) {
    const theme = useTheme();
    const [newComment, setNewComment] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');
    const [tempName, setTempName] = useState('');

    const sortedComments = [...data].sort((a, b) => {
        if (sortBy === 'likes') {
            return b.likesCount - a.likesCount;
        }
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy.toLowerCase() === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const handleNewComment = async () => {
        if (!newComment.trim) return;

        if (newComment.trim()) {
            const comment = {
                id: Date.now().toString(),
                user,
                message: newComment,
                createdAt: new Date().toString(),
                likesCount: 0,
                likedByUser: false
            }
            setComments([comment, ...data])
            await AsyncStorage.setItem(`comments-${id}`, JSON.stringify([comment, ...data]))
            setNewComment('');
        }
    }

    const handleLike = async (idComment: any, likedByUser: boolean) => {
        const tempComment = Array.from(data);
        const isExist = tempComment.findIndex(v => v.id === idComment);
        if (isExist > -1) {
            const countData = likedByUser ? tempComment[isExist].likesCount - 1 : tempComment[isExist].likesCount + 1;
            tempComment[isExist] = { ...tempComment[isExist], likedByUser: !likedByUser, likesCount: countData }
            setComments(tempComment);
        }
        await AsyncStorage.setItem(`likedComment-${id}`, JSON.stringify(tempComment));
    }

    const handleDelete = async (idComment: any) => {
        const tempComment = Array.from(data);
        const isExist = tempComment.findIndex(v => v.id === idComment);
        if (isExist > -1) {
            tempComment.splice(isExist, 1)
            setComments(tempComment);
        }
        await AsyncStorage.setItem(`comments-${id}`, JSON.stringify(tempComment))
        await AsyncStorage.setItem(`likedComment-${id}`, JSON.stringify(tempComment));
    }

    const handleInput = async (e: any) => {
        // if (e.key === 'Enter') {
        // const tempName = (e.target as HTMLInputElement).value;
        if (tempName.trim()) {
            const user = { id: `user-${Date.now()}`, name: tempName };
            await AsyncStorage.setItem('user_session', JSON.stringify(user));
            setUser(user);
        }
        // }
    }

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
                            // checkedColor: '#06B6D4',
                        },
                        {
                            value: 'oldest',
                            label: 'Oldest',
                            icon: 'clock-outline',
                            // checkedColor: '#06B6D4',
                        },
                        {
                            value: 'likes',
                            label: 'Top Likes',
                            icon: 'thumb-up-outline',
                            // checkedColor: '#FACC15',
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
                    <View>
                        <Text variant="labelMedium" style={{ marginBottom: 8 }}>
                            Enter your name to comment:
                        </Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Your Name..."
                            value={tempName}
                            onChangeText={setTempName}
                            outlineStyle={{ borderRadius: 8 }}
                            returnKeyType="done"
                            onSubmitEditing={handleInput}
                            right={
                                <TextInput.Icon
                                    icon="check-circle"
                                    onPress={handleInput}
                                />
                            }
                        />
                    </View>}
            </View>

            {sortedComments?.length > 0 ? sortedComments?.map((item) => {
                return (
                    <View key={item.id} style={{ paddingBottom: 5 }}>
                        <List.Item
                            title={item.user?.name}
                            description={item.message}
                            left={() => (
                                <View style={{ justifyContent: "center", paddingLeft: 8 }}>
                                    <Avatar.Text
                                        size={30}
                                        label={item?.user?.name.substring(0, 1).toUpperCase()}
                                        style={{ backgroundColor: theme.colors.outlineVariant }}
                                    />
                                </View>
                            )}
                            right={() => (
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <IconButton
                                        icon={item.likedByUser ? "thumb-up" : "thumb-up-outline"}
                                        iconColor={item.likedByUser ? "#FACC15" : theme.colors.outline}
                                        size={24}
                                        onPress={() => handleLike(item.id, item.likedByUser)}
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
                            {(item?.user?.name === user?.name) && <Text
                                style={{ color: theme.colors.error, fontSize: 13, fontWeight: "bold" }}
                                onPress={() => handleDelete(item.id)}
                            >
                                Delete
                            </Text>}
                        </View>
                        <Divider style={{ marginTop: 16 }} />
                    </View>
                )
            }) : <EmptyData />}
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