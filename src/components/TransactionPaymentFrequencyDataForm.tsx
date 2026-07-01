import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { theme } from "../theme";
import { PaymentMethodPicker } from "./PaymentMethodPicker";
import { PaymentMethod } from "../dtos/PaymentMethodDto";
import { TransactionFrequency } from "../types/TransactionFrequencyType";

interface TransactionPaymentFrequencyDataFormProps {
        paymentMethods: PaymentMethod[],
        selectedPaymentMethod: PaymentMethod | null,
        frequency: TransactionFrequency | null,
        installmentsCount: string, 
        setSelectedPaymentMethod: (selectedPaymentMethod: PaymentMethod) => void,
        setFrequency: (frequency: TransactionFrequency) => void,
        setInstallmentsCount: (installmentsCount: string) => void
}

export function TransactionPaymentFrequencyDataForm({ paymentMethods, selectedPaymentMethod, frequency, installmentsCount, setSelectedPaymentMethod, setFrequency, setInstallmentsCount }: TransactionPaymentFrequencyDataFormProps) {
        return (
                <View style={[styles.card, styles.shadow]}>
                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Método de Pagamento</Text>
                                <PaymentMethodPicker selected={selectedPaymentMethod} paymentMethods={paymentMethods!} onChange={setSelectedPaymentMethod} />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Repetição</Text>
                                <View style={styles.frequencyRow}>
                                        <TouchableOpacity style={[styles.freqBtn, frequency === 'single' && styles.freqBtnActive]} onPress={() => setFrequency('single')}>
                                                <Text style={[styles.freqText, frequency === 'single' && styles.textWhite]}>Única</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.freqBtn, frequency === 'installment' && styles.freqBtnActive]} onPress={() => setFrequency('installment')}>
                                                <Text style={[styles.freqText, frequency === 'installment' && styles.textWhite]}>Parcelada</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.freqBtn, frequency === 'fixed' && styles.freqBtnActive]} onPress={() => setFrequency('fixed')}>
                                                <Text style={[styles.freqText, frequency === 'fixed' && styles.textWhite]}>Fixa Mensal</Text>
                                        </TouchableOpacity>
                                </View>

                                {/* Input de parcelas */}
                                {frequency === 'installment' && (
                                        <View style={styles.installmentsContainer}>
                                                <Text style={styles.installmentsLabel}>Número de Parcelas:</Text>
                                                <TextInput style={styles.installmentsInput} keyboardType="numeric" value={installmentsCount} onChangeText={setInstallmentsCount} maxLength={2} />
                                        </View>
                                )}
                        </View>
                </View>
        )
}

const styles = StyleSheet.create({
        shadow: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
        textWhite: { color: theme.colors.white },
        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 20 },
        inputGroup: { paddingVertical: 4 },
        inputLabel: { fontSize: 13, color: theme.colors.textLight, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
        divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },
        frequencyRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
        freqBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: theme.colors.background, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
        freqBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        freqText: { fontSize: 13, fontWeight: '600', color: theme.colors.textLight },
        installmentsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: theme.colors.background, padding: 12, borderRadius: 12 },
        installmentsLabel: { flex: 1, fontSize: 14, color: theme.colors.text },
        installmentsInput: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, textAlign: 'center' },
});