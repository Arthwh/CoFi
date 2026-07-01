import { View, Text, TextInput, StyleSheet } from "react-native";
import { TransactionStatusPicker } from "./TransactionStatusPicker";
import { theme } from "../theme";
import { TransactionStatus } from "../types/TransactionStatusType";
import { TransactionType } from "../types/TransactionTypeType";
import { formatAmountToString } from '../utils/moneyUtils'

interface TransactionStatusAndAmountDataFormProps {
        amount: string,
        status: TransactionStatus,
        type: TransactionType,
        handleAmountChange: (amount: string) => void,
        setStatus: (status: TransactionStatus) => void
}

export function TransactionStatusAndAmountDataForm({ amount, status, type, handleAmountChange, setStatus }: TransactionStatusAndAmountDataFormProps) {
        return (
                <View style={[styles.card, styles.shadow, styles.amountCard]}>
                        <Text style={styles.inputLabelLabel}>Valor da Transação</Text>
                        <View style={styles.amountInputContainer}>
                                <Text style={styles.currencyPrefix}>R$</Text>
                                <TextInput style={styles.amountInput} placeholderTextColor={theme.colors.placeholder} keyboardType="numeric" value={formatAmountToString(amount)} onChangeText={handleAmountChange} />
                        </View>

                        <TransactionStatusPicker status={status} onChange={setStatus} isExpense={type === 'expense'} />
                </View>
        )
}

const styles = StyleSheet.create({
        shadow: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 20 },
        amountCard: { alignItems: 'center', paddingVertical: 24 },
        inputLabelLabel: { fontSize: 14, color: theme.colors.textLight, fontWeight: '500', marginBottom: 8 },
        amountInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
        currencyPrefix: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginRight: 6, marginTop: 4 },
        amountInput: { fontSize: 42, fontWeight: 'bold', color: theme.colors.text, minWidth: 150, textAlign: 'left' },
});