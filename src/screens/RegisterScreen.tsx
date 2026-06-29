import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { theme } from '../theme';
import { authService } from '../services/authService';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useNavigation } from '@react-navigation/native';
import { handleError } from '../utils/errorHandler';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../routes/AuthRoutes';
import { AppToast } from '../utils/toast';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
        const navigation = useNavigation<RegisterScreenNavigationProp>();

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

                        AppToast.success('Conta criada!', 'Agora você já pode fazer o seu login.');
                        navigation.navigate('Login');
                } catch (error: any) {
                        handleError(error.message, 'Erro ao criar conta');
                } finally {
                        setLoading(false);
                }
        };

        if (loading) {
                return <LoadingIndicator message="Carregando..." />;
        }

        return (
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                                <Text style={styles.title}>Criar Conta</Text>

                                <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor={theme.colors.placeholder} value={nome} onChangeText={setNome} />
                                <TextInput style={styles.input} placeholder="CPF (números)" placeholderTextColor={theme.colors.placeholder} keyboardType="numeric" value={cpf} onChangeText={setCpf} />
                                <TextInput style={styles.input} placeholder="Telefone (xx) xxxxx-xxxx" placeholderTextColor={theme.colors.placeholder} keyboardType="numeric" value={telefone} onChangeText={setTelefone} />
                                <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={theme.colors.placeholder} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                                <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={theme.colors.placeholder} secureTextEntry value={password} onChangeText={setPassword} />

                                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                                        <Text style={styles.buttonText}>Cadastrar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.switchButton} onPress={() => navigation.goBack()}>
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