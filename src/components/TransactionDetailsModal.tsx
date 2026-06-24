import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface TransactionDetailsModalProps {
        visible: boolean;
        transaction: any | null;
        onClose: () => void;
        onMarkAsPaid: (id: string) => void;
        onDelete?: (id: string) => void;
        isLoading?: boolean;
}

export function TransactionDetailsModal({ visible, transaction, onClose, onMarkAsPaid, onDelete, isLoading = false }: TransactionDetailsModalProps) {
        if (!transaction) return null;

        const isIncome = transaction.type === 'income';
        const isUnpaid = transaction.status === 'unpaid';

        return (
                <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
                        <View style={styles.modalOverlay}>
                                <SafeAreaView style={styles.modalContent}>
                                        <View style={styles.dragIndicator} />

                                        <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={isLoading}>
                                                <Ionicons name="close" size={24} color={theme.colors.textLight} />
                                        </TouchableOpacity>

                                        {/* Cabeçalho do Modal */}
                                        <View style={styles.header}>
                                                <View style={[styles.bigIconBg, { backgroundColor: transaction.category.color + '20' }]}>
                                                        <Ionicons name={transaction.category.icon} size={32} color={transaction.category.color} />
                                                </View>
                                                <Text style={styles.description}>{transaction.description}</Text>
                                                <Text style={[styles.amount, { color: isIncome ? '#10B981' : theme.colors.text }]}>
                                                        {isIncome ? '+ ' : '- '}R$ {transaction.amount.toFixed(2).replace('.', ',')}
                                                </Text>

                                                {isUnpaid && (
                                                        <View style={styles.unpaidBadge}>
                                                                <Ionicons name="alert-circle" size={14} color="#3B82F6" />
                                                                <Text style={styles.unpaidText}>Pendente</Text>
                                                        </View>
                                                )}
                                        </View>

                                        <View style={styles.divider} />

                                        {/* Lista de Detalhes */}
                                        <View style={styles.detailsList}>
                                                <DetailRow label="Data" value={transaction.date} icon="calendar-outline" />
                                                <DetailRow label="Categoria" value={transaction.category.name} icon="grid-outline" />
                                                <DetailRow label="Método" value={transaction.paymentMethod.name} icon="wallet-outline" />
                                                {transaction.payee && <DetailRow label="Local / Pessoa" value={transaction.payee} icon="person-outline" />}
                                        </View>

                                        {/* Ações */}
                                        <View style={styles.actionsContainer}>
                                                {isUnpaid && (
                                                        <TouchableOpacity style={styles.btnPrimary} onPress={() => onMarkAsPaid(transaction.id)} disabled={isLoading}>
                                                                {isLoading ? (
                                                                        <ActivityIndicator size="small" color="#FFF" />
                                                                ) : (
                                                                        <>
                                                                                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                                                                                <Text style={styles.btnPrimaryText}>Marcar como Pago</Text>
                                                                        </>
                                                                )}
                                                        </TouchableOpacity>
                                                )}

                                                <View style={styles.rowActions}>
                                                        <TouchableOpacity style={styles.btnSecondary} disabled={isLoading}>
                                                                <Ionicons name="pencil" size={20} color={theme.colors.textLight} />
                                                                <Text style={styles.btnSecondaryText}>Editar</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.btnSecondary, styles.btnDanger]} onPress={() => onDelete?.(transaction.id)} disabled={isLoading}>
                                                                <Ionicons name="trash" size={20} color="#EF4444" />
                                                        </TouchableOpacity>
                                                </View>
                                        </View>
                                </SafeAreaView>
                        </View >
                </Modal >
        );
}

// Subcomponente para as linhas de detalhe
const DetailRow = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
        <View style={styles.detailRow}>
                <View style={styles.detailLabelContainer}>
                        <Ionicons name={icon} size={18} color={theme.colors.textLight} />
                        <Text style={styles.detailLabel}>{label}</Text>
                </View>
                <Text style={styles.detailValue}>{value}</Text>
        </View>
);

const styles = StyleSheet.create({
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
        modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: 24 },
        dragIndicator: { width: 40, height: 5, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3, alignSelf: 'center', marginVertical: 12 },
        closeButton: { position: 'absolute', top: 20, right: 24, zIndex: 10, padding: 4 },

        header: { alignItems: 'center', marginTop: 10 },
        bigIconBg: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
        description: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
        amount: { fontSize: 32, fontWeight: '900', marginBottom: 12 },
        unpaidBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F615', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 4 },
        unpaidText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 13 },

        divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 24 },

        detailsList: { gap: 16, marginBottom: 24 },
        detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        detailLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
        detailLabel: { color: theme.colors.textLight, fontSize: 15 },
        detailValue: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },

        actionsContainer: { gap: 12 },
        btnPrimary: { flexDirection: 'row', backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
        btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
        rowActions: { flexDirection: 'row', gap: 12 },
        btnSecondary: { flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background, paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
        btnSecondaryText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
        btnDanger: { flex: 0.2, backgroundColor: '#EF444410', borderColor: '#EF444430' }
});