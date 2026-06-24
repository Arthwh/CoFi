import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface LoadingIndicatorProps {
        message?: string;             // Texto opcional=
        fullScreen?: boolean;         // Se deve ocupar a tela inteira ou ser embutido
        size?: 'small' | 'large';     // Tamanho do círculo de loading
}

export function LoadingIndicator({
        message,
        fullScreen = true,
        size = 'large'
}: LoadingIndicatorProps) {
        return (
                <View style={[
                        styles.container,
                        fullScreen ? styles.fullScreen : styles.inline
                ]}>
                        <ActivityIndicator size={size} color={theme.colors.primary} />

                        {/* Mensagem opcional */}
                        {message && (
                                <Text style={styles.messageText}>{message}</Text>
                        )}
                </View>
        );
}

const styles = StyleSheet.create({
        container: {
                justifyContent: 'center',
                alignItems: 'center',
        },
        fullScreen: {
                flex: 1,
                backgroundColor: theme.colors.background,
        },
        inline: {
                padding: 24,
        },
        messageText: {
                marginTop: 12,
                fontSize: 14,
                fontWeight: '500',
                color: theme.colors.textLight,
                textAlign: 'center',
        },
});