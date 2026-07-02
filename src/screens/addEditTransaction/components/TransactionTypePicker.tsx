import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { TransactionType } from "../../../types/TransactionTypeType";
import { theme } from "../../../theme";

interface TransactionTypePickerProps {
        type: TransactionType,
        isEditing: boolean,
        onPress: (type: TransactionType) => void
}

export function TransactionTypePicker({ type, isEditing, onPress }: TransactionTypePickerProps) {
        return (
                < View style={styles.typeSelectorRow} >
                        <TouchableOpacity
                                style={[styles.typeButton, type === 'income' && styles.modernIncomeActive, isEditing && { opacity: 0.5 }]}
                                onPress={() => onPress('income')}
                                disabled={isEditing}
                        >
                                <Ionicons name="arrow-up-circle" size={22} color={type === 'income' ? '#10B981' : theme.colors.textLight} />
                                <Text style={[styles.typeButtonText, type === 'income' && styles.textIncome]}>Entrada</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                                style={[styles.typeButton, type === 'expense' && styles.modernExpenseActive, isEditing && { opacity: 0.5 }]}
                                onPress={() => onPress('expense')}
                                disabled={isEditing}
                        >
                                <Ionicons name="arrow-down-circle" size={22} color={type === 'expense' ? '#EF4444' : theme.colors.textLight} />
                                <Text style={[styles.typeButtonText, type === 'expense' && styles.textExpense]}>Saída</Text>
                        </TouchableOpacity>
                </View >
        )
}

const styles = StyleSheet.create({
        typeSelectorRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
        typeButton: {
                flex: 1,
                flexDirection: 'row',
                height: 50,
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)'
        },
        typeButtonText: { fontSize: 15, fontWeight: '700', color: theme.colors.textLight },
        modernIncomeActive: { backgroundColor: '#10B98110', borderColor: '#10B981' },
        modernExpenseActive: { backgroundColor: '#EF444410', borderColor: '#EF4444' },
        textIncome: { color: '#10B981' },
        textExpense: { color: '#EF4444' },
        textWhite: { color: '#FFF' },
});