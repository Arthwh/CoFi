import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, SectionList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { TransactionFilters, FilterType } from '../components/TransactionFilters';
import { TransactionDetailsModal } from '../components/TransactionDetailsModal';
import { transactionService } from '../services/transactionService';
import { dateUtils, DateInfo } from '../utils/dateUtils'
import { LoadingIndicator } from '../components/LoadingIndicator';

export default function TransactionsListScreen() {
        const [currentDateInfo, setCurrentDateInfo] = useState<DateInfo>(dateUtils.parseDateData());
        const [transactions, setTransactions] = useState<any[]>([]);
        const [activeFilter, setActiveFilter] = useState<FilterType>('all');
        const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

        const [loading, setLoading] = useState(true);

        const groupedTransactions = useMemo(() => {
                // Se não tem transação, devolve array vazio
                if (!transactions || transactions.length === 0) return [];

                // Filtra os dados
                const filtered = transactions.filter(t => {
                        if (activeFilter === 'income') return t.type === 'income';
                        if (activeFilter === 'expense') return t.type === 'expense';
                        if (activeFilter === 'unpaid') return t.status === 'unpaid';
                        return true;
                });

                // Agrupa por data
                const groups = filtered.reduce((acc, curr) => {
                        const dateKey = curr.date;
                        if (!acc[dateKey]) acc[dateKey] = [];
                        acc[dateKey].push(curr);
                        return acc;
                }, {} as Record<string, typeof transactions>);

                return Object.keys(groups)
                        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                        .map(date => ({
                                title: date,
                                data: groups[date]
                        }));

        }, [activeFilter, transactions]);

        useEffect(() => {
                const fetchTransactions = async () => {
                        // Passa o número do mês e o ano extraídos do objeto
                        const data = await transactionService.getTransactionsByMonth(
                                currentDateInfo.monthNumber,
                                currentDateInfo.year
                        );
                        if (data) setTransactions(data);
                        setLoading(false);
                };

                fetchTransactions();
        }, [currentDateInfo.monthNumber, currentDateInfo.year]);

        // Funções para os botões de Avançar e Voltar Mês
        const handlePreviousMonth = () => {
                const prevDate = new Date(currentDateInfo.year, currentDateInfo.monthNumber - 2, 1);
                setCurrentDateInfo(dateUtils.parseDateData(prevDate));
        };

        const handleNextMonth = () => {
                const nextDate = new Date(currentDateInfo.year, currentDateInfo.monthNumber, 1);
                setCurrentDateInfo(dateUtils.parseDateData(nextDate));
        };

        if (loading) {
                return <LoadingIndicator message="Carregando suas movimentações..." />;
        }
        
        return (
                <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                                <View style={styles.monthSelector}>
                                        <TouchableOpacity onPress={handlePreviousMonth}><Ionicons name="chevron-back" size={24} color={theme.colors.text} /></TouchableOpacity>
                                        <Text style={styles.monthText}>{currentDateInfo.monthName} {currentDateInfo.year}</Text>
                                        <TouchableOpacity onPress={handleNextMonth}><Ionicons name="chevron-forward" size={24} color={theme.colors.text} /></TouchableOpacity>
                                </View>
                        </View>

                        <View style={styles.content}>
                                <TransactionFilters selected={activeFilter} onChange={setActiveFilter} />

                                <SectionList
                                        sections={groupedTransactions}
                                        keyExtractor={(item) => item.id}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ paddingBottom: 40 }}

                                        // Renderiza o Cabeçalho de cada dia
                                        renderSectionHeader={({ section: { title } }) => (
                                                <Text style={styles.sectionTitle}>
                                                        {title.split('-').reverse().join('/')} {/* Formata YYYY-MM-DD para DD/MM/YYYY */}
                                                </Text>
                                        )}

                                        // Renderiza o Card de Movimentação
                                        renderItem={({ item }) => {
                                                const isIncome = item.type === 'income';
                                                return (
                                                        <TouchableOpacity style={styles.card} onPress={() => setSelectedTransaction(item)}>
                                                                <View style={[styles.iconContainer, { backgroundColor: item.category.color + '15' }]}>
                                                                        <Ionicons name={item.category.icon as any} size={20} color={item.category.color} />
                                                                </View>

                                                                <View style={styles.cardDetails}>
                                                                        <Text style={styles.cardTitle}>{item.description}</Text>
                                                                        <View style={styles.cardSubDetails}>
                                                                                <Text style={styles.cardSubTitle}>{item.category.name}</Text>
                                                                                {item.status === 'unpaid' && (
                                                                                        <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>Pendente</Text></View>
                                                                                )}
                                                                        </View>
                                                                </View>

                                                                <Text style={[styles.cardAmount, { color: isIncome ? '#10B981' : theme.colors.text }]}>
                                                                        {isIncome ? '+' : '-'} R$ {item.amount.toFixed(2)}
                                                                </Text>
                                                        </TouchableOpacity>
                                                );
                                        }}

                                        ListEmptyComponent={
                                                <View style={styles.emptyState}>
                                                        <Ionicons name="receipt-outline" size={48} color={theme.colors.textLight} />
                                                        <Text style={styles.emptyStateText}>Nenhuma movimentação encontrada.</Text>
                                                </View>
                                        }
                                />
                        </View>

                        <TransactionDetailsModal
                                visible={!!selectedTransaction}
                                transaction={selectedTransaction}
                                onClose={() => setSelectedTransaction(null)}
                                onMarkAsPaid={(id) => {
                                        console.log('Pagar ID:', id);
                                        setSelectedTransaction(null); // Fecha modal
                                }}
                                onDelete={(id) => {
                                        console.log('Deletar ID:', id);
                                        setSelectedTransaction(null);
                                }}
                        />
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { padding: 24, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
        monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        monthText: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },

        content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },

        sectionTitle: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textLight, marginTop: 16, marginBottom: 12 },

        card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 16, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
        iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
        cardDetails: { flex: 1 },
        cardTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
        cardSubDetails: { flexDirection: 'row', alignItems: 'center', gap: 6 },
        cardSubTitle: { fontSize: 13, color: theme.colors.textLight },

        miniBadge: { backgroundColor: '#3B82F615', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
        miniBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#3B82F6' },

        cardAmount: { fontSize: 16, fontWeight: 'bold' },

        emptyState: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
        emptyStateText: { marginTop: 12, fontSize: 16, color: theme.colors.textLight }
});