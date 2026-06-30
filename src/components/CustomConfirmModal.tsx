import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

// Tipagem das opções
export interface AppConfirmModalOptions {
        title: string;
        message: string;
        onConfirm: () => void | Promise<void>;
        confirmText?: string;
        cancelText?: string;
        isDestructive?: boolean;
}

// Referência global
export const confirmModalRef = React.createRef<any>();

export const AppConfirm = {
        show: (options: AppConfirmModalOptions) => confirmModalRef.current?.show(options),
        hide: () => confirmModalRef.current?.hide(),
};

export const ConfirmModal = forwardRef((_, ref) => {
        const [config, setConfig] = useState<AppConfirmModalOptions | null>(null);
        const [isLoading, setIsLoading] = useState(false);

        // Expõe a função de show/hide para a referência global
        useImperativeHandle(ref, () => ({
                show: (options: AppConfirmModalOptions) => setConfig(options),
                hide: () => setConfig(null),
        }));

        const handleConfirm = async () => {
                if (!config) return;
                setIsLoading(true);
                try {
                        await config.onConfirm(); // Aguarda a ação terminar
                } finally {
                        setIsLoading(false);
                        setConfig(null);
                }
        };

        if (!config) return null;

        return (
                <Modal visible={true} transparent={true} animationType="fade" onRequestClose={() => setConfig(null)}>
                        <View style={styles.overlay}>
                                <View style={styles.alertBox}>
                                        <Text style={styles.title}>{config.title}</Text>
                                        <Text style={styles.message}>{config.message}</Text>

                                        <View style={styles.buttonRow}>
                                                <TouchableOpacity
                                                        style={[styles.button, styles.cancelButton]}
                                                        onPress={() => setConfig(null)}
                                                        disabled={isLoading}
                                                >
                                                        <Text style={styles.cancelButtonText}>{config.cancelText || 'Cancelar'}</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                        style={[
                                                                styles.button,
                                                                config.isDestructive ? styles.destructiveButton : styles.confirmButton
                                                        ]}
                                                        onPress={handleConfirm}
                                                        disabled={isLoading}
                                                >
                                                        {isLoading ? (
                                                                <ActivityIndicator color={theme.colors.surface} size="small" />
                                                        ) : (
                                                                <Text style={styles.confirmButtonText}>{config.confirmText || 'Sim'}</Text>
                                                        )}
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </View>
                </Modal>
        );
});

const styles = StyleSheet.create({
        overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
        alertBox: { width: '100%', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: theme.spacing.lg, elevation: 5 },
        title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.sm },
        message: { fontSize: 16, color: theme.colors.textLight, marginBottom: theme.spacing.lg, lineHeight: 22 },
        buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.md },
        button: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, borderRadius: theme.borderRadius.md, minWidth: 120, alignItems: 'center' },
        cancelButton: { backgroundColor: 'transparent' },
        cancelButtonText: { color: theme.colors.textLight, fontSize: 16, fontWeight: '600' },
        confirmButton: { backgroundColor: theme.colors.primary },
        destructiveButton: { backgroundColor: '#E53E3E' },
        confirmButtonText: { color: theme.colors.surface, fontSize: 16, fontWeight: 'bold' },
});