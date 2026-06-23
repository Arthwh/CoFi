import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

export type FilterType = 'all' | 'income' | 'expense' | 'unpaid';

interface TransactionFiltersProps {
        selected: FilterType;
        onChange: (filter: FilterType) => void;
}

const FILTERS: { id: FilterType; label: string; icon?: string }[] = [
        { id: 'all', label: 'Todas' },
        { id: 'income', label: 'Entradas' },
        { id: 'expense', label: 'Saídas' },
        { id: 'unpaid', label: 'A Pagar' },
];

export function TransactionFilters({ selected, onChange }: TransactionFiltersProps) {
        return (
                <View style={{ marginHorizontal: -24, marginBottom: 16 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                {FILTERS.map((f) => {
                                        const isActive = selected === f.id;
                                        return (
                                                <TouchableOpacity
                                                        key={f.id}
                                                        style={[styles.chip, isActive && styles.chipActive]}
                                                        onPress={() => onChange(f.id)}
                                                >
                                                        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f.label}</Text>
                                                </TouchableOpacity>
                                        );
                                })}
                        </ScrollView>
                </View>
        );
}

const styles = StyleSheet.create({
        scrollContent: { paddingHorizontal: 24, gap: 10, paddingVertical: 4 },
        chip: {
                backgroundColor: theme.colors.surface,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)',
        },
        chipActive: {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
        },
        chipText: { fontSize: 14, fontWeight: '600', color: theme.colors.textLight },
        chipTextActive: { color: '#FFF' },
});