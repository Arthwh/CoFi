import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { theme } from '../theme';
import { authService } from '../services/authService';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { handleError } from '../utils/errorHandler';
import { AuthStackParamList } from '../routes/AuthRoutes';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
        const navigation = useNavigation<LoginScreenNavigationProp>();

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);

        const handleLogin = async () => {
                if (!email || !password) {
                        return handleError(new Error("Preencha todos os campos."), "Atenção");
                }

                setLoading(true);
                try {
                        await authService.login(email, password);
                } catch (error: unknown) {
                        handleError(error, 'Erro ao entrar');
                        setLoading(false);
                }
        };

        if (loading) {
                return <LoadingIndicator />;
        }

        return (
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={styles.content}>
                                <Text style={styles.logo}>CoFi</Text>
                                <Text style={styles.title}>Entrar</Text>

                                <TextInput
                                        style={styles.input}
                                        placeholder="E-mail"
                                        placeholderTextColor={theme.colors.placeholder}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                />
                                <TextInput
                                        style={styles.input}
                                        placeholder="Senha"
                                        placeholderTextColor={theme.colors.placeholder}
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                />

                                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                        <Text style={styles.buttonText}>Acessar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                        style={styles.switchButton}
                                        onPress={() => navigation.navigate('Register')}
                                >
                                        <Text style={styles.switchText}>Não tem conta? Cadastre-se</Text>
                                </TouchableOpacity>
                        </View>
                </KeyboardAvoidingView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { flex: 1, justifyContent: 'center', padding: theme.spacing.xl, gap: theme.spacing.md },
        logo: {
                fontSize: 48, fontWeight: '900', color: theme.colors.primary, marginBottom: theme.spacing.sm,
        },
        title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.lg },
        input: {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
        },
        button: {
                backgroundColor: theme.colors.primary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                alignItems: 'center',
                marginTop: theme.spacing.sm,
        },
        buttonText: { color: theme.colors.surface, fontSize: 16, fontWeight: 'bold' },
        switchButton: { marginTop: theme.spacing.lg, alignItems: 'center' },
        switchText: { color: theme.colors.textLight, fontSize: 14 },
});