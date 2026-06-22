import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { theme } from './src/theme';
import { NavigationContainer } from '@react-navigation/native';
import AppRoutes from './src/routes/AppRoutes';
import { authService } from './src/services/authService';
import { User } from '@supabase/supabase-js';

export default function App() {
        // Estado para controlar qual tela de Auth é mostrada
        const [showLogin, setShowLogin] = useState(true);

        // Estado usuário logado
        const [user, setUser] = useState<User | null>(null);

        useEffect(() => {
                // Função assíncrona para buscar a sessão inicial
                const verificarSessaoInicial = async () => {
                        const usuarioLogado = await authService.getSession();
                        setUser(usuarioLogado);
                };

                verificarSessaoInicial();

                const subscription = authService.onAuthStateChange((usuarioAtualizado) => {
                        setUser(usuarioAtualizado);
                });

                return () => {
                        subscription.unsubscribe();
                };
        }, []);

        return (
                <NavigationContainer>
                        {user ? (
                                // Se tem usuário, mostra as abas inferiores e a Home
                                <AppRoutes />
                        ) : (
                                // Se não tem usuário, mostra a tela de Autenticação
                                <SafeAreaView style={styles.container}>
                                        {showLogin ? (
                                                <LoginScreen onSwitch={() => setShowLogin(false)} />
                                        ) : (
                                                <RegisterScreen onSwitch={() => setShowLogin(true)} />
                                        )}
                                </SafeAreaView>
                        )}
                </NavigationContainer>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: theme.colors.background,
        },
});