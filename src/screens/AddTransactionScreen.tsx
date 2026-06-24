import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Category, CategoryPickerModal } from '../components/CategoryPickerModal';
import { TransactionStatus, TransactionStatusPicker } from '../components/TransactionStatusPicker';
import { PaymentMethodPicker, PaymentMethod } from '../components/PaymentMethodPicker';
import { CreateTransactionPayload, transactionService } from '../services/transactionService'
import { userService } from '../services/userService';
import { categoryService } from '../services/categoryService';
import { paymentMethodService } from '../services/paymentMethodService';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function AddTransactionScreen() {
        const route = useRoute<RouteProp<RootStackParamList, 'Adicionar'>>();
        const navigation = useNavigation();

        // Captura a movimentação vinda do Modal de Detalhes (se existir)
        const transactionToEdit = route.params?.transactionToEdit;

        const [isEditing, setIsEditing] = useState(false);
        const [contentWasEdited, setContentWasEdited] = useState(false);

        const [categories, setCategories] = useState<Category[]>([]);
        const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
        const [userId, setUserId] = useState<string | null>(null);
        // Dados Principais
        const [type, setType] = useState<'income' | 'expense'>('income');
        const [amount, setAmount] = useState('');
        const [description, setDescription] = useState('');
        const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
        const [date, setDate] = useState(new Date().toLocaleDateString('pt-BR'));

        // Status e Pagamento
        const [status, setStatus] = useState<TransactionStatus>('paid');
        const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

        // Frequência e Parcelamento
        const [frequency, setFrequency] = useState<'single' | 'installment' | 'fixed'>('single');
        const [installmentsCount, setInstallmentsCount] = useState('2');

        // Outros dados opcionais
        const [payee, setPayee] = useState('');
        const [tags, setTags] = useState('');
        const [ignoreInDashboard, setIgnoreInDashboard] = useState(false); // Ignorar transferências no dashboard
        const [notes, setNotes] = useState('');

        // Funcionalidade de notificações
        const [notifyMe, setNotifyMe] = useState(false);
        const [daysBeforeNotify, setDaysBeforeNotify] = useState('1'); // Quantos dias antes avisar
        const showNotificationOption = status === 'unpaid' || status === 'scheduled' || frequency === 'installment';

        // Controle de Modal
        const [modalVisible, setModalVisible] = useState(false);

        const [loading, setLoading] = useState(true);

        useFocusEffect(
                useCallback(() => {
                        // Executado quando a tela entra em foco 
                        return () => {
                                // Executado quando a tela perde o foco
                                resetForm();
                        };
                }, [])
        );

        useEffect(() => {
                const loadInitialData = async () => {
                        try {
                                const userData = await userService.getUserProfile();
                                if (userData) setUserId(userData.id);

                                const categoriesData = await categoryService.getCategories();
                                if (categoriesData) setCategories(categoriesData);

                                const paymentData = await paymentMethodService.getPaymentMethods();
                                if (paymentData) setPaymentMethods(paymentData);
                        } catch (e) {
                                console.error(e);
                        } finally {
                                setLoading(false);
                        }
                };

                loadInitialData();
        }, []);

        // Seta os dados no modo edição
        useEffect(() => {
                if (transactionToEdit && !isEditing) {
                        setIsEditing(true);

                        setDescription(transactionToEdit.description);
                        setAmount(String(transactionToEdit.amount));
                        setType(transactionToEdit.type);
                        setSelectedCategory(transactionToEdit.category);
                        setSelectedPaymentMethod(transactionToEdit.paymentMethod);
                        setDate(transactionToEdit.date);
                        setPayee(transactionToEdit.payee || '');
                        setStatus(transactionToEdit.status);
                        setFrequency(transactionToEdit.frequency)
                        setInstallmentsCount(transactionToEdit.installmentsCount)
                        setTags(transactionToEdit.tags)
                        setIgnoreInDashboard(transactionToEdit.ignoreInDashboard)
                        setNotes(transactionToEdit.notes)
                        setNotifyMe(transactionToEdit.notifyMe)
                        setDaysBeforeNotify(transactionToEdit.daysBeforeNotify)
                }
        }, [transactionToEdit, isEditing]);

        // // Verifica se algum campo foi editado
        // useEffect(() => {
        //         setContentWasEdited(true);
        // }, [type, amount, description, selectedCategory, date, status, selectedPaymentMethod,
        //         frequency, installmentsCount, payee, tags, ignoreInDashboard, notes, notifyMe, daysBeforeNotify]);

        // useEffect(() => {
        //         // Ouve o clique nas abas de baixo do aplicativo
        //         const unsubscribeTab = navigation.getParent()?.addListener('tabPress' as any, (e: any) => {

        //                 // Se o usuário alterou algo no formulário, impede a troca de aba
        //                 if (contentWasEdited) {
        //                         e.preventDefault(); // Trava o usuário na tela atual

        //                         // Dispara o Alerta nativo (ou o seu modal customizado)
        //                         Alert.alert(
        //                                 'Descartar alterações?',
        //                                 'Você perderá os dados digitados se sair agora.',
        //                                 [
        //                                         { text: 'Continuar Editando', style: 'cancel' },
        //                                         {
        //                                                 text: 'Descartar',
        //                                                 style: 'destructive',
        //                                                 onPress: () => {
        //                                                         resetForm();
        //                                                         navigation.navigate(e.target?.split('-')[0] as any);
        //                                                 },
        //                                         },
        //                                 ]
        //                         );
        //                 }
        //         });

        //         return unsubscribeTab;
        // }, [navigation]);

        const handleSaveTransaction = async () => {
                if (!description || !amount) return;

                setLoading(true);
                const [dia, mes, ano] = date.split('/');
                const dataFormatada = `${ano}-${mes}-${dia}`;

                const payload: CreateTransactionPayload = {
                        user_id: userId,
                        type,
                        amount: parseFloat(amount.replace(',', '.')),
                        description,
                        category_id: selectedCategory?.id ? selectedCategory.id : null,
                        date: dataFormatada,
                        status,
                        payment_method_id: selectedPaymentMethod?.id ? selectedPaymentMethod.id : null,
                        frequency,
                        installments: frequency === 'installment' ? parseInt(installmentsCount) : 1,
                        payee,
                        tags: tags.split(',').map(t => t.trim()),
                        ignore_in_dashboard: ignoreInDashboard,
                        notes,
                        notify_me: notifyMe,
                        days_before_notify: notifyMe === true ? parseInt(daysBeforeNotify) : null
                };

                try {
                        if (isEditing) {
                                await transactionService.update(transactionToEdit.id, payload)
                                Alert.alert('Sucesso', 'Movimentação atualizada com sucesso!');
                                // Volta para a tela anterior
                                navigation.goBack();
                        }
                        else {
                                await transactionService.create(payload);
                                Alert.alert('Sucesso', 'Movimentação salva com sucesso!');
                        }
                } catch (e) {
                        Alert.alert('Erro', 'Erro ao salvar');
                } finally {
                        resetForm();
                        setLoading(false);
                }
        };

        const resetForm = () => {
                setType('income');
                setAmount('');
                setDescription('');
                setSelectedCategory(null);
                setDate(new Date().toLocaleDateString('pt-BR'));
                setStatus('paid');
                setSelectedPaymentMethod(null);
                setFrequency('single');
                setInstallmentsCount('2');
                setPayee('');
                setTags('');
                setIgnoreInDashboard(false);
                setNotes('');
                setNotifyMe(false);
                setDaysBeforeNotify('1');

                setIsEditing(false)
                navigation.setParams({ transactionToEdit: undefined });
        };

        if (loading) {
                return <LoadingIndicator message="Carregando..." />;
        }

        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                                <Text style={styles.headerTitle}>{isEditing ? 'Editar Movimentação' : 'Nova Movimentação'}</Text>

                                {/* Seletor de Tipo de Movimentação */}
                                <View style={styles.typeSelectorRow}>
                                        <TouchableOpacity
                                                style={[styles.typeButton, type === 'income' && styles.modernIncomeActive]}
                                                onPress={() => setType('income')}
                                        >
                                                <Ionicons name="arrow-up-circle" size={22} color={type === 'income' ? '#10B981' : theme.colors.textLight} />
                                                <Text style={[styles.typeButtonText, type === 'income' && styles.textIncome]}>Entrada</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                                style={[styles.typeButton, type === 'expense' && styles.modernExpenseActive]}
                                                onPress={() => setType('expense')}
                                        >
                                                <Ionicons name="arrow-down-circle" size={22} color={type === 'expense' ? '#EF4444' : theme.colors.textLight} />
                                                <Text style={[styles.typeButtonText, type === 'expense' && styles.textExpense]}>Saída</Text>
                                        </TouchableOpacity>
                                </View>

                                {/* Valor e Status */}
                                <View style={[styles.card, styles.shadow, styles.amountCard]}>
                                        <Text style={styles.inputLabelLabel}>Valor da Transação</Text>
                                        <View style={styles.amountInputContainer}>
                                                <Text style={styles.currencyPrefix}>R$</Text>
                                                <TextInput style={styles.amountInput} placeholder="0,00" keyboardType="numeric" value={amount} onChangeText={setAmount} />
                                        </View>

                                        <TransactionStatusPicker status={status} onChange={setStatus} isExpense={type === 'expense'} />
                                </View>

                                {/* Opção de notificação */}
                                {showNotificationOption && (
                                        <View style={[styles.card, styles.shadow, { borderColor: '#3B82F630', borderWidth: 1 }]}>
                                                <View style={styles.switchRow}>
                                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                                <View style={styles.notificationIconBg}>
                                                                        <Ionicons name="notifications" size={20} color="#3B82F6" />
                                                                </View>
                                                                <View style={{ flex: 1 }}>
                                                                        <Text style={styles.switchTitle}>Lembrete de Vencimento</Text>
                                                                        <Text style={styles.switchDesc}>Me avise antes desta conta vencer</Text>
                                                                </View>
                                                        </View>
                                                        <Switch
                                                                value={notifyMe}
                                                                onValueChange={setNotifyMe}
                                                                trackColor={{ true: '#3B82F6', false: '#e5e7eb' }}
                                                        />
                                                </View>

                                                {notifyMe && (
                                                        <View style={styles.daysBeforeNotifyContainer}>
                                                                <Text style={styles.daysBeforeNotifyLabel}>Avisar quantos dias antes?</Text>
                                                                <View style={styles.daysRow}>
                                                                        {['1', '3', '5'].map((day) => (
                                                                                <TouchableOpacity
                                                                                        key={day}
                                                                                        style={[styles.dayChip, daysBeforeNotify === day && styles.dayChipActive]}
                                                                                        onPress={() => setDaysBeforeNotify(day)}
                                                                                >
                                                                                        <Text style={[styles.dayChipText, daysBeforeNotify === day && styles.textWhite]}>{day} {day === '1' ? 'dia' : 'dias'}</Text>
                                                                                </TouchableOpacity>
                                                                        ))}
                                                                </View>
                                                        </View>
                                                )}
                                        </View>
                                )}

                                {/* Dados Básicos */}
                                <View style={[styles.card, styles.shadow]}>
                                        <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Descrição</Text>
                                                <TextInput style={styles.input} placeholder="Ex: Supermercado" value={description} onChangeText={setDescription} />
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Categoria</Text>
                                                <TouchableOpacity style={styles.selectRow} onPress={() => setModalVisible(true)}>
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
                                                        <TextInput style={styles.inputClean} value={date} onChangeText={setDate} placeholder="DD/MM/AAAA" />
                                                        <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                                                </View>
                                        </View>
                                </View>

                                {/* Pagamento e Frequência */}
                                <View style={[styles.card, styles.shadow]}>
                                        <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Método de Pagamento</Text>
                                                <PaymentMethodPicker selected={selectedPaymentMethod} paymentMethods={paymentMethods!} onChange={setSelectedPaymentMethod} />
                                        </View>

                                        <View style={styles.divider} />

                                        <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Repetição</Text>
                                                <View style={styles.frequencyRow}>
                                                        <TouchableOpacity style={[styles.freqBtn, frequency === 'single' && styles.freqBtnActive]} onPress={() => setFrequency('single')}>
                                                                <Text style={[styles.freqText, frequency === 'single' && styles.textWhite]}>Única</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.freqBtn, frequency === 'installment' && styles.freqBtnActive]} onPress={() => setFrequency('installment')}>
                                                                <Text style={[styles.freqText, frequency === 'installment' && styles.textWhite]}>Parcelada</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.freqBtn, frequency === 'fixed' && styles.freqBtnActive]} onPress={() => setFrequency('fixed')}>
                                                                <Text style={[styles.freqText, frequency === 'fixed' && styles.textWhite]}>Fixa Mensal</Text>
                                                        </TouchableOpacity>
                                                </View>

                                                {/* Mostra input de parcelas se for Parcelado */}
                                                {frequency === 'installment' && (
                                                        <View style={styles.installmentsContainer}>
                                                                <Text style={styles.installmentsLabel}>Número de Parcelas:</Text>
                                                                <TextInput style={styles.installmentsInput} keyboardType="numeric" value={installmentsCount} onChangeText={setInstallmentsCount} maxLength={2} />
                                                        </View>
                                                )}
                                        </View>
                                </View>

                                {/* Dados Opcionais */}
                                <View style={[styles.card, styles.shadow]}>
                                        <Text style={styles.sectionTitle}>Detalhes Adicionais (Opcional)</Text>

                                        <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Local / Beneficiário</Text>
                                                <TextInput style={styles.input} placeholder="Ex: Padaria do Zé, Maria Silva..." value={payee} onChangeText={setPayee} />
                                        </View>
                                        <View style={styles.divider} />

                                        <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Tags (separadas por vírgula)</Text>
                                                <TextInput style={styles.input} placeholder="Ex: viagem, carro, emergencia" value={tags} onChangeText={setTags} />
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

                                <TouchableOpacity style={[styles.submitButton, styles.shadow]} onPress={handleSaveTransaction}>
                                        <Text style={styles.submitButtonText}>{isEditing ? 'Salvar Alterações' : 'Confirmar Movimentação'}</Text>
                                </TouchableOpacity>

                        </ScrollView>

                        <CategoryPickerModal visible={modalVisible} onClose={() => setModalVisible(false)} categories={categories!} onSelectCategory={setSelectedCategory} />
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { padding: 24, paddingBottom: 120 },
        shadow: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
        headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginBottom: 24 },

        typeSelectorRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
        typeButton: {
                flex: 1,
                flexDirection: 'row',
                height: 50,
                backgroundColor: theme.colors.surface,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.05)'
        },
        typeButtonText: { fontSize: 15, fontWeight: '700', color: theme.colors.textLight },
        modernIncomeActive: { backgroundColor: '#10B98110', borderColor: '#10B981' },
        modernExpenseActive: { backgroundColor: '#EF444410', borderColor: '#EF4444' },
        textIncome: { color: '#10B981' },
        textExpense: { color: '#EF4444' },
        textWhite: { color: '#FFF' },


        incomeActive: { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
        expenseActive: { backgroundColor: theme.colors.danger, borderColor: theme.colors.danger },

        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 20 },
        amountCard: { alignItems: 'center', paddingVertical: 24 },
        inputLabelLabel: { fontSize: 14, color: theme.colors.textLight, fontWeight: '500', marginBottom: 8 },
        amountInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
        currencyPrefix: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginRight: 6, marginTop: 4 },
        amountInput: { fontSize: 42, fontWeight: 'bold', color: theme.colors.text, minWidth: 150, textAlign: 'left' },

        inputGroup: { paddingVertical: 4 },
        inputLabel: { fontSize: 13, color: theme.colors.textLight, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
        input: { fontSize: 16, color: theme.colors.text, paddingVertical: 6 },
        inputClean: { fontSize: 16, color: theme.colors.text, flex: 1, padding: 0 },
        divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },

        selectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
        selectRowTextPlaceholder: { fontSize: 16, color: 'rgba(0,0,0,0.25)' },
        selectRowTextActive: { fontSize: 16, fontWeight: '600', color: theme.colors.text },

        frequencyRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
        freqBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: theme.colors.background, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
        freqBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        freqText: { fontSize: 13, fontWeight: '600', color: theme.colors.textLight },
        installmentsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: theme.colors.background, padding: 12, borderRadius: 12 },
        installmentsLabel: { flex: 1, fontSize: 14, color: theme.colors.text },
        installmentsInput: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, textAlign: 'center' },

        sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 },
        switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
        switchTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
        switchDesc: { fontSize: 13, color: theme.colors.textLight },

        submitButton: { backgroundColor: theme.colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
        submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

        // Estilos do Card de Notificação
        notificationIconBg: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#3B82F615', justifyContent: 'center', alignItems: 'center' },
        daysBeforeNotifyContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
        daysBeforeNotifyLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.text, marginBottom: 10 },
        daysRow: { flexDirection: 'row', gap: 8 },
        dayChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
        dayChipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
        dayChipText: { fontSize: 13, fontWeight: '600', color: theme.colors.textLight },
});
