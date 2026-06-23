import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash' | 'transfer' | 'boleto';

interface PaymentMethodPickerProps {
        selected: PaymentMethod;
        onChange: (method: PaymentMethod) => void;
}

const METHODS: { id: PaymentMethod; name: string; icon: String }[] = [
        { id: 'pix', name: 'Pix', icon: 'qr-code-outline' },
        { id: 'credit', name: 'Crédito', icon: 'card-outline' },
        { id: 'debit', name: 'Débito', icon: 'card' },
        { id: 'cash', name: 'Dinheiro', icon: 'cash-outline' },
        { id: 'transfer', name: 'Transferência', icon: 'swap-horizontal-outline' },
        { id: 'boleto', name: 'Boleto', icon: 'barcode-outline' },
];

export function PaymentMethodPicker({ selected, onChange }: PaymentMethodPickerProps) {
        return (
                <View style={{ marginHorizontal: -20 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                {METHODS.map((method) => {
                                        const isActive = selected === method.id;
                                        return (
                                                <TouchableOpacity
                                                        key={method.id}
                                                        style={[styles.chip, isActive && styles.chipActive]}
                                                        onPress={() => onChange(method.id)}
                                                >
                                                        <Ionicons name={method.icon as any} size={18} color={isActive ? '#FFF' : theme.colors.textLight} />
                                                        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{method.name}</Text>
                                                </TouchableOpacity>
                                        );
                                })}
                        </ScrollView>
                </View>
        );
}

const styles = StyleSheet.create({
        scrollContent: { paddingHorizontal: 20, gap: 10, paddingVertical: 4 },
        chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', gap: 6 },
        chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        chipText: { fontSize: 14, fontWeight: '500', color: theme.colors.textLight },
        chipTextActive: { color: '#FFF' },
});