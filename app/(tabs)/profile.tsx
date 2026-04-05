import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Avatar, useTheme, Switch } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_BIO = 'Fullstack Developer | React Native enthusiast. Building awesome things with Supabase.';

const ProfileScreen = () => {
    const { user, darkMode, toggleTheme, logout, updateUser } = useAuth();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });

    const profileData = useMemo(() => {
        if (!user) {
            return {
                avatar: '',
                name: 'Guest',
                email: '',
                bio: DEFAULT_BIO,
            };
        }

        const name = user.name?.trim() || 'User';
        const email = user.email?.trim() ?? '';
        const avatar = user.avatar?.trim();
        const bio = user.bio?.trim() || DEFAULT_BIO;

        return { avatar, name, email, bio };
    }, [user]);

    const uploadImage = async (base64String: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    base64: base64String
                }),
            });

            const result = await response.json();
            if (response.ok) {
                updateUser({ ...user, avatar: result.url });
                setFormData({ ...formData, avatar: result.url });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result?.error ?? 'Failed updated profile data'
                });
            }
        } catch (error) {
            console.error("Upload failed", error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed updated profile data'
            });
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const base64String = result.assets[0].base64;
            uploadImage(base64String);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Name and Email are required.'
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?.id,
                    ...formData,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: result?.message ?? 'Profile updated successfully'
                });
                if (formData?.email !== user?.email) {
                    return handleLogout();
                }
                setIsEditing(false);
                await updateUser(result);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: result?.error ?? 'Failed updated profile data'
                });
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed updated profile data'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            avatar: user?.avatar || '',
        });
        setIsEditing(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.minimalHeaderRow}>
                        <View style={styles.avatarWrapper}>
                            {profileData.avatar ? (
                                <Avatar.Image size={70} source={{ uri: profileData.avatar }} />
                            ) : (
                                <Avatar.Text
                                    size={70}
                                    label={(profileData?.name ?? '?').substring(0, 1).toUpperCase()}
                                    style={{ backgroundColor: theme.colors.outlineVariant }}
                                />
                            )}
                            {isEditing && (
                                <TouchableOpacity style={styles.changePhotoButtonSmall} onPress={pickImage}>
                                    <Ionicons name="camera" size={14} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.headerTextInfoRow}>
                            <Text style={[styles.displayName, { color: theme.colors.onSurface }]}>
                                {formData.name || 'Set Name'}
                            </Text>
                            <Text style={[styles.displayEmail, { color: theme.colors.outline }]}>
                                {formData.email}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Profile Details</Text>

                        {isEditing && <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.onSurface }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputDisabled]}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                editable={isEditing}
                                placeholder="Your name"
                                placeholderTextColor="#999"
                            />
                        </View>}

                        {isEditing && <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.onSurface }]}>Email Address</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputDisabled]}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                editable={isEditing}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="your.email@provider.com"
                                placeholderTextColor="#999"
                            />
                        </View>}

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.onSurface }]}>Bio</Text>
                            {!isEditing ? <View style={[styles.bioItem, { backgroundColor: theme.colors.background, borderColor: theme.colors.outlineVariant, shadowColor: theme.colors.onSurface }]}>
                                <Text style={[styles.menuText, { color: theme.colors.onSurface }]}>
                                {formData.bio || 'No bio.'}
                            </Text></View>
                                : <TextInput
                                    style={[
                                        styles.input,
                                        styles.textArea,
                                        !isEditing && styles.inputDisabled
                                    ]}
                                    value={formData.bio}
                                    onChangeText={(text) => setFormData({ ...formData, bio: text })}
                                    editable={isEditing}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    placeholder="Tell us about yourself..."
                                    placeholderTextColor="#999"
                                />}
                        </View>
                    </View>

                    {!isEditing && <View>
                        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                            Preferences
                        </Text>

                        <View style={[styles.menuItem, { backgroundColor: theme.colors.background, borderColor: theme.colors.outlineVariant, shadowColor: theme.colors.onSurface }]}>
                            <View style={styles.menuItemLeft}>
                                <MaterialCommunityIcons
                                    name={darkMode ? "weather-night" : "weather-sunny"}
                                    size={22}
                                    color={darkMode ? "#06B6D4" : "#F59E0B"}
                                />
                                <Text style={[styles.menuText, { color: theme.colors.onSurface }]}>
                                    Dark Mode
                                </Text>
                            </View>

                            <Switch
                                value={darkMode}
                                onValueChange={toggleTheme}
                                color="#06B6D4"
                            />
                        </View>
                    </View>}

                    <View style={styles.actionSection}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#007AFF" />
                        ) : isEditing ? (
                            <View style={styles.editActionsRow}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButtonDisabled, (formData.name && formData.email) && styles.saveButton]} onPress={handleSave} disabled={!formData.name || !formData.email}>
                                    <Text style={[styles.buttonTextDisabled, (formData.name && formData.email) && styles.buttonText]}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity style={[styles.button, styles.editModeButton]} onPress={() => setIsEditing(true)}>
                                    <Ionicons name="create-outline" size={18} color="white" style={{ marginRight: 8 }} />
                                    <Text style={styles.buttonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.signOutButton, { paddingVertical: 12 }]}
                                    onPress={handleLogout}
                                >
                                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
                                    <Text style={[styles.buttonText, { color: '#FF3B30' }]}>Sign Out</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    changePhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
        elevation: 3,
    },
    headerTextInfo: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1C1C1E',
        borderWidth: 2,
        borderColor: '#E5E5EA',
    },
    inputDisabled: {
        borderColor: '#F0F0F0',
        color: '#555',
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    actionSection: {
        marginTop: 30,
        alignItems: 'center',
    },
    button: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextDisabled: {
        color: 'grey',
        fontSize: 16,
        fontWeight: '600',
    },
    editModeButton: {
        backgroundColor: '#06B6D4',
        width: '100%',
    },
    editActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#06B6D4',
        flex: 1,
        marginLeft: 10,
    },
    saveButtonDisabled: {
        backgroundColor: '#CCC',
        flex: 1,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: 'white',
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        elevation: 0,
    },
    cancelButtonText: {
        color: '#FF3B30',
    },
    signOutButton: {
        backgroundColor: 'white',
        width: '100%',
        marginTop: 15,
        borderWidth: 0.5,
        borderColor: '#FFE5E5',
    },
    bioItem: {
        height: 100,
        flexDirection: 'row',
        paddingTop: 14,
        paddingHorizontal: 6,
        borderRadius: 10,
        borderWidth: 1
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 12,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    minimalHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 10,
    },
    avatarWrapper: {
        position: 'relative',
    },
    headerTextInfoRow: {
        marginLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    displayName: {
        fontSize: 20,
        fontWeight: '700',
    },
    displayEmail: {
        fontSize: 14,
        marginTop: 2,
    },
    changePhotoButtonSmall: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#06B6D4',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        elevation: 3,
    },
});

export default ProfileScreen;