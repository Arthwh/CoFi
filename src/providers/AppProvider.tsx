import Toast from 'react-native-toast-message';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import AppRoutes from '../routes/AppRoutes';
import { AuthRoutes } from '../routes/AuthRoutes';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import { toastConfig } from '../components/CustomToast';

function NavigationConsumer() {
        const { user, loading } = useAuth();

        if (loading) {
                return (
                        <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                );
        }

        return user ? <AppRoutes /> : <AuthRoutes />;
}

export function AppProvider() {
        return (
                <AuthProvider>
                        <NavigationConsumer />
                        <Toast config={toastConfig} />
                </AuthProvider>
        );
}

const styles = StyleSheet.create({
        loadingContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.background,
        },
});