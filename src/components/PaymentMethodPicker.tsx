import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { PaymentMethod } from '../dtos/PaymentMethodDto';

interface PaymentMethodPickerProps {
        selected: PaymentMethod | null;
        paymentMethods: PaymentMethod[];
        isEditing: boolean;
        onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodPicker({ selected, paymentMethods, onChange, isEditing }: PaymentMethodPickerProps) {
        return (
                <View style={{ marginHorizontal: -20 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                {paymentMethods.map((method) => {
                                        const isActive = selected?.id === method.id;
                                        return (
                                                <TouchableOpacity
                                                        key={method.id}
                                                        style={[styles.chip, isActive && styles.chipActive, isActive && isEditing && styles.chipDisabled]}
                                                        onPress={() => onChange(method)}
                                                        disabled={isEditing}
                                                >
                                                        <Ionicons name={method.icon as any} size={18} color={isActive ? theme.colors.white : theme.colors.textLight} />
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
        chipDisabled: { backgroundColor: theme.colors.primaryDisabled, borderColor: theme.colors.primaryDisabled },
        chipText: { fontSize: 14, fontWeight: '500', color: theme.colors.textLight },
        chipTextActive: { color: theme.colors.white },
});