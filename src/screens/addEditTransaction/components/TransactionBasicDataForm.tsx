import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../../theme";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../../dtos/CategoryDto";

interface TransactionBasicDataFormProps {
        description: string,
        selectedCategory: Category,
        date: string,
        setDescription: (description: string) => void,
        setShowCategoryPicker: (showCategoryPicker: boolean) => void,
        setShowDatePicker: (showDatePicker: boolean) => void
}

export function TransactionBasicDataForm({ description, selectedCategory, date, setDescription, setShowCategoryPicker, setShowDatePicker }: TransactionBasicDataFormProps) {
        return (
                <View style={[styles.card, styles.shadow]}>
                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Descrição</Text>
                                <TextInput style={styles.input} placeholder="Ex: Supermercado" placeholderTextColor={theme.colors.placeholder} value={description} onChangeText={setDescription} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Categoria</Text>
                                <TouchableOpacity style={styles.selectRow} onPress={() => setShowCategoryPicker(true)}>
                                        <Text style={selectedCategory ? styles.selectRowTextActive : styles.selectRowTextPlaceholder}>
                                                {selectedCategory ? selectedCategory.name : 'Selecione uma categoria'}
                                        </Text>
                                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textLight} />
                                </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Data</Text>
                                <View style={styles.selectRow}>
                                        <TouchableOpacity style={styles.selectRow} onPress={() => setShowDatePicker(true)}>
                                                <Text style={styles.inputClean}>{date}</Text>
                                                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                </View>
                        </View>
                </View>
        )
}

const styles = StyleSheet.create({
        shadow: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 20 },
        inputGroup: { paddingVertical: 4 },
        inputLabel: { fontSize: 13, color: theme.colors.textLight, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
        input: { fontSize: 16, color: theme.colors.text, paddingVertical: 6 },
        inputClean: { fontSize: 16, color: theme.colors.text, flex: 1, padding: 0 },
        divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },
        selectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
        selectRowTextPlaceholder: { fontSize: 16, color: 'rgba(0,0,0,0.25)' },
        selectRowTextActive: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
});