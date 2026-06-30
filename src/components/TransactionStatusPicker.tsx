import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { TransactionStatus } from '../types/TransactionStatusType';

interface StatusPickerProps {
        status: TransactionStatus;
        onChange: (status: TransactionStatus) => void;
        isExpense: boolean;
}

export function TransactionStatusPicker({ status, onChange, isExpense }: StatusPickerProps) {
        return (
                <View style={styles.container}>
                        {/* Pago */}
                        <TouchableOpacity
                                style={[
                                        styles.button,
                                        status === 'paid' && (isExpense ? styles.activeExpense : styles.activeIncome)
                                ]}
                                onPress={() => onChange('paid')}
                        >
                                <Ionicons
                                        name="checkmark-circle"
                                        size={18}
                                        color={status === 'paid' ? (isExpense ? '#EF4444' : '#10B981') : theme.colors.textLight}
                                />
                                <Text style={[styles.text, status === 'paid' && (isExpense ? styles.textExpense : styles.textIncome)]}>
                                        {isExpense ? 'Pago' : 'Recebido'}
                                </Text>
                        </TouchableOpacity>

                        {/* A pagar / receber */}
                        <TouchableOpacity
                                style={[styles.button, status === 'unpaid' && styles.activeUnpaid]}
                                onPress={() => onChange('unpaid')}
                        >
                                <Ionicons
                                        name="alert-circle"
                                        size={18}
                                        color={status === 'unpaid' ? '#3B82F6' : theme.colors.textLight}
                                />
                                <Text style={[styles.text, status === 'unpaid' && styles.textUnpaid]}>
                                        {isExpense ? 'A Pagar' : 'A Receber'}
                                </Text>
                        </TouchableOpacity>

                        {/* Agendado */}
                        <TouchableOpacity
                                style={[styles.button, status === 'scheduled' && styles.activeScheduled]}
                                onPress={() => onChange('scheduled')}
                        >
                                <Ionicons
                                        name="calendar"
                                        size={18}
                                        color={status === 'scheduled' ? '#F59E0B' : theme.colors.textLight}
                                />
                                <Text style={[styles.text, status === 'scheduled' && styles.textScheduled]}>
                                        Agendado
                                </Text>
                        </TouchableOpacity>
                </View>
        );
}

const styles = StyleSheet.create({
        container: { flexDirection: 'row', gap: 8, marginTop: 12 },
        button: {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: theme.colors.background,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.04)',
                gap: 6
        },
        text: { fontSize: 13, fontWeight: '600', color: theme.colors.textLight },

        activeIncome: { backgroundColor: '#10B98110', borderColor: '#10B981' },
        textIncome: { color: '#10B981' },

        activeExpense: { backgroundColor: '#EF444410', borderColor: '#EF4444' },
        textExpense: { color: '#EF4444' },

        activeUnpaid: { backgroundColor: '#3B82F610', borderColor: '#3B82F6' },
        textUnpaid: { color: '#3B82F6' },

        activeScheduled: { backgroundColor: '#F59E0B10', borderColor: '#F59E0B' },
        textScheduled: { color: '#F59E0B' },
});