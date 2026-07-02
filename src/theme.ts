const colors = {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        primary: '#6366F1',
        text: '#1F2937',
        textLight: '#6B7280',
        success: '#22C55E',
        danger: '#EF4444',
        border: '#d4d6d8',
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
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24
};

export const theme = {
        colors,
        spacing,
        borderRadius,

        styles: {
                shadow: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 } as const,
                card: { backgroundColor: colors.surface, borderRadius: borderRadius.xxl, padding: 20, marginBottom: 20 } as const,
                inputLabel: { fontSize: 13, color: colors.textLight, marginBottom: 6, textTransform: 'uppercase' } as const,
                inputRow: { flexDirection: 'row', gap: 8, marginTop: 8 } as const,
                inputGroup: { paddingVertical: 4 } as const,
                divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: borderRadius.md - borderRadius.sm } as const,
        }
};