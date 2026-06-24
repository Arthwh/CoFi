import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { userService } from '../services/userService';
import { transactionService, BalanceData } from '../services/transactionService';
import { formatCurrencyToBRL } from '../utils/moneyUtils'

export default function HomeScreen() {
        const [loading, setLoading] = useState(true);
        const [userName, setUserName] = useState('');
        const [balance, setBalance] = useState<BalanceData>({ total: 0, income: 0, expense: 0 });

        useEffect(() => {
                getUserData()
                setLoading(false)
        }, [])

        const getUserData = async () => {
                try {
                        // Busca os dados em paralelo
                        const [userData, balanceData] = await Promise.all([
                                userService.getUserProfile(),
                                transactionService.getBalance()
                        ]);

                        if (userData) setUserName(userData.name);
                        if (balanceData) setBalance(balanceData);

                } catch (error) {
                        console.error('Erro ao carregar dados da Home:', error);
                } finally {
                        setLoading(false);
                }
        }

        if (loading) {
                return <LoadingIndicator message="Carregando..." />;
        }

        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                                {/* HEADER */}
                                <View style={styles.header}>
                                        <View>
                                                <Text style={styles.greeting}>Olá, {userName?.split(" ")[0] || 'Usuário'}</Text>
                                                <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
                                        </View>
                                        <TouchableOpacity style={styles.notificationBtn}>
                                                <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                                        </TouchableOpacity>
                                </View>

                                {/* CARD DE SALDO REAL */}
                                <View style={[styles.card, styles.balanceCard, styles.shadow]}>
                                        <Text style={styles.balanceLabel}>Balanço Total</Text>
                                        <Text style={styles.balanceValue}>{formatCurrencyToBRL(balance.total)}</Text>

                                        <View style={styles.balanceRow}>
                                                <View>
                                                        <View style={styles.rowLabelIcon}>
                                                                <Ionicons name="arrow-up-circle" size={16} color="rgba(255,255,255,0.7)" />
                                                                <Text style={styles.balanceSubLabel}>Entradas</Text>
                                                        </View>
                                                        <Text style={styles.balanceIn}>{formatCurrencyToBRL(balance.income)}</Text>
                                                </View>

                                                <View>
                                                        <View style={styles.rowLabelIcon}>
                                                                <Ionicons name="arrow-down-circle" size={16} color="rgba(255,255,255,0.7)" />
                                                                <Text style={styles.balanceSubLabel}>Saídas</Text>
                                                        </View>
                                                        <Text style={styles.balanceOut}>{formatCurrencyToBRL(balance.expense)}</Text>
                                                </View>
                                        </View>
                                </View>

                                {/* SEÇÃO 1: RADAR DE GASTOS (ORÇAMENTO DO MÊS) */}
                                <Text style={styles.sectionTitle}>Radar do Mês</Text>
                                <View style={[styles.card, styles.infoCard, styles.shadow]}>
                                        <View style={styles.cardHeader}>
                                                <Ionicons name="pie-chart" size={20} color={theme.colors.primary} />
                                                <Text style={styles.cardTitle}>Limite de Gastos Mensal</Text>
                                        </View>

                                        {/* Exemplo de cálculo: Saídas vs Meta de Gastos (ex: R$ 3.000,00) */}
                                        <View style={styles.progressInfoRow}>
                                                <Text style={styles.progressText}>
                                                        Você já usou <Text style={styles.boldText}>{((balance.expense / 3000) * 100).toFixed(0)}%</Text> do limite
                                                </Text>
                                                <Text style={styles.progressSubText}>{formatCurrencyToBRL(balance.expense)} de R$ 3.000,00</Text>
                                        </View>

                                        {/* Barra de Progresso Visual */}
                                        <View style={styles.progressBarBackground}>
                                                <View
                                                        style={[
                                                                styles.progressBarFill,
                                                                {
                                                                        width: `${Math.min((balance.expense / 3000) * 100, 100)}%`,
                                                                        // Fica vermelho se passar de 80% do orçamento
                                                                        backgroundColor: (balance.expense / 3000) > 0.8 ? theme.colors.danger : theme.colors.primary
                                                                }
                                                        ]}
                                                />
                                        </View>
                                </View>

                                {/* SEÇÃO 2: ALERTAS E LEMBRETES ÚTEIS */}
                                <Text style={styles.sectionTitle}>Atenção para os próximos dias</Text>
                                <View style={[styles.card, styles.alertCard, styles.shadow]}>
                                        <View style={styles.alertItem}>
                                                <View style={[styles.alertIconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                                        <Ionicons name="warning" size={20} color={theme.colors.danger} />
                                                </View>
                                                <View style={styles.alertTextContainer}>
                                                        <Text style={styles.alertTitle}>Fatura de Cartão vencendo</Text>
                                                        <Text style={styles.alertDescription}>Vence em 3 dias. Evite juros de atraso.</Text>
                                                </View>
                                        </View>

                                        <View style={styles.alertDivider} />

                                        <View style={styles.alertItem}>
                                                <View style={[styles.alertIconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                                        <Ionicons name="calendar" size={20} color="#F59E0B" />
                                                </View>
                                                <View style={styles.alertTextContainer}>
                                                        <Text style={styles.alertTitle}>3 Contas agendadas</Text>
                                                        <Text style={styles.alertDescription}>Lançamentos automáticos para a próxima semana.</Text>
                                                </View>
                                        </View>
                                </View>

                        </ScrollView>
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { padding: theme.spacing.xl, paddingBottom: 110 },

        shadow: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
        },

        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
        greeting: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
        subtitle: { fontSize: 16, color: theme.colors.textLight },
        notificationBtn: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 16 },

        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 24, marginBottom: 28 },
        balanceCard: { backgroundColor: theme.colors.primary },
        balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginBottom: 4 },
        balanceValue: { color: '#FFF', fontSize: 34, fontWeight: 'bold', marginBottom: 24 },
        balanceRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 16 },
        rowLabelIcon: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
        balanceSubLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
        balanceIn: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
        balanceOut: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 },

        // ESTILOS DOS NOVOS PAINÉIS INFORMATIVOS
        infoCard: { backgroundColor: theme.colors.surface, padding: 20, marginBottom: 24 },
        cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
        cardTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text },

        progressInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
        progressText: { fontSize: 14, color: theme.colors.text },
        boldText: { fontWeight: '700' },
        progressSubText: { fontSize: 12, color: theme.colors.textLight },

        progressBarBackground: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden' },
        progressBarFill: { height: '100%', borderRadius: 5 },

        // CARD DE ALERTAS
        alertCard: { backgroundColor: theme.colors.surface, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16 },
        alertItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
        alertIconBadge: { padding: 10, borderRadius: 12 },
        alertTextContainer: { flex: 1 },
        alertTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 2 },
        alertDescription: { fontSize: 13, color: theme.colors.textLight },
        alertDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
});