import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.content}>

                                <View style={styles.header}>
                                        <View>
                                                <Text style={styles.greeting}>Olá, João</Text>
                                                <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
                                        </View>
                                </View>

                                <View style={[styles.card, styles.balanceCard, styles.shadow]}>
                                        <Text style={styles.balanceLabel}>Balanço Total</Text>
                                        <Text style={styles.balanceValue}>R$ 3.250,72</Text>

                                        <View style={styles.balanceRow}>
                                                <View>
                                                        <Text style={styles.balanceSubLabel}>Entradas</Text>
                                                        <Text style={styles.balanceIn}>+ R$ 4.500,00</Text>
                                                </View>
                                                <View>
                                                        <Text style={styles.balanceSubLabel}>Saídas</Text>
                                                        <Text style={styles.balanceOut}>- R$ 1.249,28</Text>
                                                </View>
                                        </View>
                                </View>

                                <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                                <View style={styles.actionsRow}>
                                        <TouchableOpacity style={[styles.actionButton, styles.shadow]}>
                                                <Ionicons name="arrow-up-circle" size={32} color={theme.colors.success} />
                                                <Text style={styles.actionText}>Entrada</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[styles.actionButton, styles.shadow]}>
                                                <Ionicons name="arrow-down-circle" size={32} color={theme.colors.danger} />
                                                <Text style={styles.actionText}>Saída</Text>
                                        </TouchableOpacity>
                                </View>

                        </ScrollView>
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { padding: theme.spacing.xl, paddingBottom: 100 },

        // Classe utilitária para sombras modernas
        shadow: {
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
        },

        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
        greeting: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
        subtitle: { fontSize: 16, color: theme.colors.textLight },
        profileIcon: { padding: 4 },

        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 24, marginBottom: 32 },
        balanceCard: { backgroundColor: theme.colors.primary },
        balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 8 },
        balanceValue: { color: '#FFF', fontSize: 40, fontWeight: 'bold', marginBottom: 24 },
        balanceRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 16 },
        balanceSubLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
        balanceIn: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
        balanceOut: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 },
        actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
        actionButton: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center' },
        actionText: { marginTop: 8, fontSize: 16, fontWeight: '600', color: theme.colors.text },
});