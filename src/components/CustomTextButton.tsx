import React from "react";
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

interface CustomIconTextButtonProps {
        text: string;
        onPress: () => void;
        active?: boolean;       // Se o botão está selecionado
        disabled?: boolean;     // Se o botão está bloqueado
        icon?: React.ComponentProps<typeof Ionicons>['name']; // Ícone opcional
        style?: StyleProp<ViewStyle>; // Permite passar estilos extras
}

export function CustomIconTextButton({ 
        text, 
        onPress, 
        active = false, 
        disabled = false, 
        icon,
        style
}: CustomIconTextButtonProps) {
        const getIconColor = () => {
                if (disabled) return active ? theme.colors.border : theme.colors.textLight;
                return active ? theme.colors.white : theme.colors.text;
        };

        return (
                <TouchableOpacity 
                        style={[
                                styles.btn,
                                active && styles.btnActive,
                                disabled && styles.btnDisabled,
                                active && disabled && styles.btnActiveDisabled,
                                style // Estilo externo
                        ]} 
                        onPress={onPress} 
                        disabled={disabled}
                        activeOpacity={0.7}
                >
                        {icon && (
                                <Ionicons name={icon} size={18} color={getIconColor()} />
                        )}
                        
                        <Text style={[
                                styles.btnText,
                                active && styles.btnTextActive,
                                disabled && styles.btnTextDisabled,
                                active && disabled && styles.btnTextActiveDisabled
                        ]}>
                                {text}
                        </Text>
                </TouchableOpacity>
        );
}

const styles = StyleSheet.create({
        btn: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: theme.colors.background,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.lg,
                paddingVertical: theme.spacing.sm,
        },
        btnActive: {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
        },
        btnDisabled: {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                opacity: 0.6,
        },
        btnActiveDisabled: {
                backgroundColor: theme.colors.primaryDisabled,
                borderColor: theme.colors.primaryDisabled,
                opacity: 0.8,
        },

        btnText: {
                fontSize: 13, 
                fontWeight: '600', 
                color: theme.colors.textLight
        },
        btnTextActive: {
                color: theme.colors.white,
        },
        btnTextDisabled: {
                color: theme.colors.textLight,
        },
        btnTextActiveDisabled: {
                color: theme.colors.border,
        }
});