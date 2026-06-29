import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig, BaseToastProps } from 'react-native-toast-message';
import { theme } from '../theme';

export const toastConfig: ToastConfig = {
        success: ({ text1, text2 }: BaseToastProps) => (
                <View style={[styles.toastContainer, styles.successBorder]}>
                        <View style={styles.content}>
                                {text1 && <Text style={styles.title}>{text1}</Text>}
                                {text2 && <Text style={styles.description}>{text2}</Text>}
                        </View>
                </View>
        ),
        error: ({ text1, text2 }: BaseToastProps) => (
                <View style={[styles.toastContainer, styles.errorBorder]}>
                        <View style={styles.content}>
                                {text1 && <Text style={styles.title}>{text1}</Text>}
                                {text2 && <Text style={styles.description}>{text2}</Text>}
                        </View>
                </View>
        ),
        info: ({ text1, text2 }: BaseToastProps) => (
                <View style={[styles.toastContainer, styles.infoBorder]}>
                        <View style={styles.content}>
                                {text1 && <Text style={styles.title}>{text1}</Text>}
                                {text2 && <Text style={styles.description}>{text2}</Text>}
                        </View>
                </View>
        ),
};

const styles = StyleSheet.create({
        toastContainer: {
                width: '90%',
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.md,
                borderLeftWidth: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
        },

        successBorder: { borderLeftColor: theme.colors.success },
        errorBorder: { borderLeftColor: theme.colors.danger },
        infoBorder: { borderLeftColor: '#3182CE' },

        content: { justifyContent: 'center' },
        title: {
                fontSize: 15,
                fontWeight: 'bold',
                color: theme.colors.text || '#1A202C'
        },
        description: {
                fontSize: 13,
                color: theme.colors.textLight || '#718096',
                marginTop: 2
        },
});