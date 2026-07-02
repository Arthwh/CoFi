import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../theme";

interface TransactionInstallmentsContainerProps {
        isEditing: boolean,
        installmentsCount: string,
        setInstallmentsCount: (installmentsCount: string) => void
}

export function TransactionInstallmentsContainer({ isEditing, installmentsCount, setInstallmentsCount }: TransactionInstallmentsContainerProps) {
        return (
                <View style={styles.installmentsContainer}>
                        <Text style={styles.installmentsLabel}>Número de Parcelas:</Text>
                        <TextInput style={[styles.installmentsInput, isEditing && styles.inputDisabled]} keyboardType="numeric" value={installmentsCount} onChangeText={setInstallmentsCount} maxLength={2} editable={!isEditing} />
                </View>
        )
}

const styles = StyleSheet.create({
        inputDisabled: { backgroundColor: '#F3F4F6', color: '#9CA3AF', borderColor: '#E5E7EB' },
        installmentsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: theme.colors.background, padding: 12, borderRadius: 20 },
        installmentsLabel: { flex: 1, fontSize: 14, color: theme.colors.text },
        installmentsInput: { fontSize: 16, fontWeight: '600', color: theme.colors.primary, backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, textAlign: 'center' },
});