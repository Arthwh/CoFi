import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { theme } from '../theme'; // O "CSS" base do app
import { authService } from '../services/authService';

// Recebemos a função onSwitch para trocar para a tela de cadastro
export default function LoginScreen({ onSwitch }: { onSwitch: () => void }) {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleLogin = async () => {
                try {
                        await authService.login(email, password);
                        Alert.alert('Sucesso', 'Login realizado!');
                } catch (error: any) {
                        Alert.alert('Erro', error.message);
                }
        };

        return (
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View style={styles.content}>
                                <Text style={styles.logo}>CoFi</Text>
                                <Text style={styles.title}>Entrar</Text>

                                <TextInput
                                        style={styles.input}
                                        placeholder="E-mail"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                />
                                <TextInput
                                        style={styles.input}
                                        placeholder="Senha"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                />

                                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                        <Text style={styles.buttonText}>Acessar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.switchButton} onPress={onSwitch}>
                                        <Text style={styles.switchText}>Não tem conta? Cadastre-se</Text>
                                </TouchableOpacity>
                        </View>
                </KeyboardAvoidingView>
        );
}

// O "CSS" exclusivo desta página
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