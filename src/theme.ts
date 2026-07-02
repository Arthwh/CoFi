// 1. Definimos as bases separadamente para podermos usá-las nos estilos abaixo
const colors = {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        primary: '#6366F1',
        text: '#1F2937',
        textLight: '#6B7280',
        success: '#22C55E',
        danger: '#EF4444',
        border: '#E5E7EB',
        white: '#FFFFFF',
        placeholder: '#94A3B8',
        primaryDisabled: '#8b8989'
};

const spacing = {
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
};

const borderRadius = {
        md: 12,
        lg: 16,
};

// 2. Agora exportamos o objeto global juntando tudo
export const theme = {
        colors,
        spacing,
        borderRadius,

        // Seus componentes globais padronizados
        styles: {
                // Estilo para Inputs de Texto
                input: {
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: borderRadius.md,
                        paddingHorizontal: spacing.md,
                        paddingVertical: 14,
                        fontSize: 16,
                        color: colors.text,
                },
                inputDisabled: {
                        backgroundColor: colors.background, 
                        borderColor: colors.border,
                        color: colors.textLight,
                },

                // Estilo para Linhas de Seleção (TouchableOpacity que abre Modal/Data)
                selectRow: {
                        flexDirection: 'row' as const,
                        justifyContent: 'space-between' as const,
                        alignItems: 'center' as const,
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: borderRadius.md,
                        paddingHorizontal: spacing.md,
                        paddingVertical: 14,
                },
                selectRowDisabled: {
                        backgroundColor: colors.background,
                        opacity: 0.6,
                },

                // Estilo para Botões Principais (Salvar, Continuar)
                btnPrimary: {
                        backgroundColor: colors.primary,
                        borderRadius: borderRadius.lg,
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.lg,
                        alignItems: 'center' as const,
                        justifyContent: 'center' as const,
                        flexDirection: 'row' as const,
                        gap: 8,
                },
                btnPrimaryDisabled: {
                        backgroundColor: colors.primaryDisabled,
                },

                // Estilo para os Textos dentro dos Botões
                btnText: {
                        color: colors.white,
                        fontSize: 16,
                        fontWeight: 'bold' as const,
                },
                btnTextDisabled: {
                        color: colors.border,
                }
        }
};