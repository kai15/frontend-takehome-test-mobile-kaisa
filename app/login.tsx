import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    const { login, user, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/(tabs)');
        }
    }, [user, isLoading]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const result = await response.json();

            if (response.ok) {
                await login(result.user);
                router.replace('/(tabs)');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: result.error ?? 'Wrong email or password!'
                });
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
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
                <View style={styles.headerSection}>
                    <View style={styles.logoCircle}>
                        <MaterialCommunityIcons name="book-open-variant" size={24} color="#06B6D4" />
                    </View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.tagline}>Sign in to continue</Text>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={16} color="#8E8E93" style={styles.icon} />
                        <TextInput
                            placeholder="Email Address"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={16} color="#8E8E93" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPass}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Ionicons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, (loading || !email || !password) && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <>
                                <Text style={styles.loginButtonText}>Sign In</Text>
                                {/* <Ionicons name="arrow-forward" size={20} color="#FFF" /> */}
                            </>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.version}>Version 1.0</Text>
                </View>
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
        justifyContent: 'center'
    },
    headerSection: {
        marginBottom: 40
    },
    logoCircle: {
        width: 70,
        height: 70,
        backgroundColor: '#FFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF'
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5
    },
    version: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontStyle: "italic",
        marginTop: 10
    },
    formSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
        marginRight: 5
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1C1C1E'
    },
    loginButton: {
        backgroundColor: '#1C1C1E',
        height: 55,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 10
    },
});