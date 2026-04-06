import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();
    const [payload, setPayload] = useState({
        name: '',
        email: '',
        password: '',
        bio: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!payload.name || !payload.email || !payload.password) {
            return Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fill all fields'
            });
        }

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: payload.name,
                    email: payload.email,
                    password: payload.password,
                    bio: payload.bio,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Registration Success',
                    text2: 'Please login with your new account'
                });
                router.replace('/login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: result.error ?? 'Something went wrong!'
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed connect to server'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.circleDecorator} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
                    <View style={styles.headerSection}>                        
                        <View style={styles.logoCircle}>
                            <MaterialCommunityIcons name="account-plus" size={24} color="#06B6D4" />
                        </View>
                        <Text style={styles.welcomeText}>Create Account</Text>
                        <Text style={styles.tagline}>Join us to start learning</Text>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={16} color="#8E8E93" style={styles.icon} />
                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor={"#666"}
                                style={styles.input}
                                value={payload.name}
                                onChangeText={(value) => setPayload({...payload, name: value})}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={16} color="#8E8E93" style={styles.icon} />
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor={"#666"}
                                style={styles.input}
                                value={payload.email}
                                onChangeText={(value) => setPayload({...payload, email: value})}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={16} color="#8E8E93" style={styles.icon} />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={"#666"}
                                style={styles.input}
                                value={payload.password}
                                onChangeText={(value) => setPayload({...payload, password: value})}
                                secureTextEntry={!showPass}
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                <Ionicons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="book" size={16} color="#8E8E93" style={styles.icon} />
                            <TextInput
                                placeholder="Bio"
                                placeholderTextColor={"#666"}
                                style={styles.input}
                                value={payload.bio}
                                multiline
                                onChangeText={(value) => setPayload({...payload, bio: value})}
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, (loading || !payload.email || !payload.password || !payload.name) && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading || !payload.email || !payload.password || !payload.name}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.registerButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.loginLink} 
                            onPress={() => router.push('/login')}
                        >
                            <Text style={styles.loginLinkText}>
                                Already have an account? <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#06B6D4'
    },
    circleDecorator: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    headerSection: {
        marginTop: 60,
        marginBottom: 30
    },
    backButton: {
        marginBottom: 20,
        marginLeft: -5
    },
    logoCircle: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF'
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5
    },
    formSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 40
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        marginBottom: 15,
    },
    icon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1C1C1E'
    },
    registerButton: {
        backgroundColor: '#1C1C1E',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center'
    },
    loginLinkText: {
        color: '#FFF',
        fontSize: 13
    }
});