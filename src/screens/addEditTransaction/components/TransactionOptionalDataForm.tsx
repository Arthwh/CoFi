import { View, Text, TextInput, Switch, StyleSheet } from "react-native";
import { theme } from "../../../theme";
import { formatTagsFromMapToString } from "../../../utils/tagsUtils";

interface TransactionOptionalDataFormProps {
        payee: string | null,
        tags: string[] | null,
        ignoreInDashboard: boolean,
        setPayee: (payee: string) => void,
        setTags: (tags: string) => void,
        setIgnoreInDashboard: (ignoreInDashboard: boolean) => void,
}

export function TransactionOptionalDataForm({ payee, tags, ignoreInDashboard, setPayee, setTags, setIgnoreInDashboard }: TransactionOptionalDataFormProps) {
        return (
                <View style={[styles.card, styles.shadow]}>
                        <Text style={styles.sectionTitle}>Detalhes Adicionais (Opcional)</Text>

                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Local / Beneficiário</Text>
                                <TextInput style={styles.input} placeholder="Ex: Padaria do Zé, Maria Silva..." placeholderTextColor={theme.colors.placeholder} value={payee ? payee : ''} onChangeText={setPayee} />
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Tags (separadas por vírgula)</Text>
                                <TextInput style={styles.input} placeholder="Ex: viagem, carro, emergencia" placeholderTextColor={theme.colors.placeholder} value={tags ? formatTagsFromMapToString(tags) : ''} onChangeText={setTags} />
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.switchRow}>
                                <View style={{ flex: 1 }}>
                                        <Text style={styles.switchTitle}>Ignorar nos Gráficos</Text>
                                        <Text style={styles.switchDesc}>Não somar essa transação no dashboard</Text>
                                </View>
                                <Switch value={ignoreInDashboard} onValueChange={setIgnoreInDashboard} trackColor={{ true: theme.colors.primary, false: '#e5e7eb' }} />
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
        divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },

        sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 },
        switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
        switchTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
        switchDesc: { fontSize: 13, color: theme.colors.textLight },
});