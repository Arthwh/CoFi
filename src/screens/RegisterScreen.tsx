import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { theme } from '../theme';
import { authService } from '../services/authService';
import { LoadingIndicator } from '../components/LoadingIndicator';

export default function RegisterScreen({ onSwitch }: { onSwitch: () => void }) {
        const [nome, setNome] = useState('');
        const [cpf, setCpf] = useState('');
        const [telefone, setTelefone] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const [loading, setLoading] = useState(false);

        const handleRegister = async () => {
                setLoading(true);
                try {
                        await authService.register(email, password, nome, cpf, telefone);
                        Alert.alert('Sucesso', 'Conta criada! Faça login para continuar.');
                        onSwitch(); // Volta para a tela de login após criar a conta
                } catch (error: any) {
                        Alert.alert('Erro', error.message);
                }
                setLoading(false)
        };

        if (loading) {
                return <LoadingIndicator message="Carregando suas movimentações..." />;
        }

        return (
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                                <Text style={styles.title}>Criar Conta</Text>

                                <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
                                <TextInput style={styles.input} placeholder="CPF (números)" keyboardType="numeric" value={cpf} onChangeText={setCpf} />
                                <TextInput style={styles.input} placeholder="Telefone (xx) xxxxx-xxxx" keyboardType="numeric" value={telefone} onChangeText={setTelefone} />
                                <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                                <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />

                                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                                        <Text style={styles.buttonText}>Cadastrar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.switchButton} onPress={onSwitch}>
                                        <Text style={styles.switchText}>Já tem conta? Faça Login</Text>
                                </TouchableOpacity>
                        </ScrollView>
                </KeyboardAvoidingView>
        );
}

// Estilos exclusivos da página
const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.xl, gap: theme.spacing.md },
        title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.lg },
        input: {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                fontSize: 16,
        },
        button: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, alignItems: 'center' },
        buttonText: { color: theme.colors.surface, fontSize: 16, fontWeight: 'bold' },
        switchButton: { marginTop: theme.spacing.lg, alignItems: 'center' },
        switchText: { color: theme.colors.textLight, fontSize: 14 },
});