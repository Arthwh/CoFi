import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CategoryPickerModal } from '../components/CategoryPickerModal';
import { TransactionStatusPicker } from '../components/TransactionStatusPicker';
import { PaymentMethodPicker } from '../components/PaymentMethodPicker';
import { transactionService } from '../services/transactionService';
import { userService } from '../services/userService';
import { categoryService } from '../services/categoryService';
import { paymentMethodService } from '../services/paymentMethodService';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types/navigation';
import { AppToast } from '../utils/toast';
import { handleError } from '../utils/errorHandler';
import { TransactionType } from '../types/TransactionTypeType';
import { TransactionFrequency } from '../types/TransactionFrequencyType';
import { PaymentMethod } from '../dtos/PaymentMethodDto';
import { TransactionStatus } from '../types/TransactionStatusType';
import { Category } from '../dtos/CategoryDto';
import { UpdateTransactionDto } from '../dtos/UpdateTransactionDto';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';
import { dateUtils } from '../utils/dateUtils';
import { formatAmountToString } from '../utils/moneyUtils'
import { TransactionTypePicker } from '../components/TransactionTypePicker';
import { TransactionOptionalDataForm } from '../components/TransactionOptionalDataForm';

export default function AddTransactionScreen() {
        const route = useRoute<RouteProp<RootStackParamList, 'Adicionar'>>();
        const navigation = useNavigation();

        // Captura a movimentação vinda do Modal de Detalhes (se existir)
        const transactionToEdit = route.params?.transactionToEdit;

        const [isEditing, setIsEditing] = useState(false);

        const [categories, setCategories] = useState<Category[]>([]);
        const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
        const [userId, setUserId] = useState<string | null>(null);
        // Dados Principais
        const [type, setType] = useState<TransactionType>('income');
        const [amount, setAmount] = useState<string>('0');
        const [description, setDescription] = useState('');
        const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
        const [date, setDate] = useState(dateUtils.currentDate());

        // Status e Pagamento
        const [status, setStatus] = useState<TransactionStatus>('paid');
        const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

        // Frequência e Parcelamento
        const [frequency, setFrequency] = useState<TransactionFrequency | null>(null);
        const [installmentsCount, setInstallmentsCount] = useState('2');

        // Outros dados opcionais
        const [payee, setPayee] = useState('');
        const [tags, setTags] = useState('');
        const [ignoreInDashboard, setIgnoreInDashboard] = useState(false); // Ignorar transferências no dashboard
        const [notes, setNotes] = useState('');

        // Funcionalidade de notificações
        const [notifyMe, setNotifyMe] = useState(false);
        const [daysBeforeNotify, setDaysBeforeNotify] = useState<string | null>(null); // Quantos dias antes avisar
        const showNotificationOption = status === 'unpaid' || status === 'scheduled' || frequency === 'installment';

        // Controle de Modal
        const [modalVisible, setModalVisible] = useState(false);
        const [showDatePicker, setShowDatePicker] = useState(false);

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
                loadInitialData();
        }, []);

        // Atribui os dados para o modo de edição
        useEffect(() => {
                if (transactionToEdit && !isEditing) {
                        setIsEditing(true);

                        setDescription(transactionToEdit.description);
                        setAmount(transactionToEdit.amount);
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

        const loadInitialData = async () => {
                try {
                        const [userData, categoriesData, paymentMethodsData] = await Promise.all([
                                userService.getUserProfile(),
                                categoryService.getCategories(),
                                paymentMethodService.getPaymentMethods()
                        ])

                        if (userData) setUserId(userData.id);
                        if (categoriesData) setCategories(categoriesData);
                        if (paymentMethodsData) setPaymentMethods(paymentMethodsData);
                } catch (error: any) {
                        handleError(error.message, 'Houve um erro ao carregar os dados. Tente novamente mais tarde.');
                } finally {
                        setLoading(false);
                }
        };

        const handleAmountChange = (text: string) => {
                // Remove tudo que não for número
                const cleanNumber = text.replace(/\D/g, '');
                setAmount(cleanNumber);
        };

        const handleSaveTransaction = async () => {
                setLoading(true);
                const [dia, mes, ano] = date.split('/');
                const dataFormatada = `${ano}-${mes}-${dia}`;

                try {
                        if (isEditing) {
                                const payload: UpdateTransactionDto = {
                                        description,
                                        amount: Number(amount),
                                        category_id: selectedCategory!.id,
                                        payment_method_id: selectedPaymentMethod!.id,
                                        status,
                                        payee,
                                        tags: tags.split(',').map(t => t.trim()),
                                        ignore_in_dashboard: ignoreInDashboard,
                                        notes,
                                        notify_me: notifyMe,
                                        days_before_notify: notifyMe === true && daysBeforeNotify ? parseInt(daysBeforeNotify) : null
                                }

                                await transactionService.update(transactionToEdit.id, payload)
                                AppToast.success('Movimentação atualizada com sucesso!');
                                // Volta para a tela anterior
                                navigation.goBack();
                        }
                        else {
                                const payload: CreateTransactionDto = {
                                        user_id: userId!,
                                        type,
                                        amount: Number(amount),
                                        description,
                                        category_id: selectedCategory!.id,
                                        date: dataFormatada,
                                        status,
                                        payment_method_id: selectedPaymentMethod!.id,
                                        frequency: frequency!,
                                        installments: frequency === 'installment' ? parseInt(installmentsCount) : 1,
                                        payee,
                                        tags: tags.split(',').map(t => t.trim()),
                                        ignore_in_dashboard: ignoreInDashboard,
                                        notes,
                                        notify_me: notifyMe,
                                        days_before_notify: notifyMe === true && daysBeforeNotify ? parseInt(daysBeforeNotify) : null
                                };
                                await transactionService.create(payload);
                                AppToast.success('Movimentação criada com sucesso!', 'Você pode visualizá-la na aba de listagem.');
                        }
                } catch (error: any) {
                        handleError(error.message, 'Erro ao salvar movimentação');
                } finally {
                        resetForm();
                        setLoading(false);
                }
        };

        const resetForm = () => {
                setType('income');
                setAmount('0');
                setDescription('');
                setSelectedCategory(null);
                setDate(dateUtils.currentDate());
                setStatus('paid');
                setSelectedPaymentMethod(null);
                setFrequency(null);
                setInstallmentsCount('2');
                setPayee('');
                setTags('');
                setIgnoreInDashboard(false);
                setNotes('');
                setNotifyMe(false);
                setDaysBeforeNotify(null);

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
                                <TransactionTypePicker type={type} onPress={setType} />

                                {/* Valor e Status */}
                                <View style={[styles.card, styles.shadow, styles.amountCard]}>
                                        <Text style={styles.inputLabelLabel}>Valor da Transação</Text>
                                        <View style={styles.amountInputContainer}>
                                                <Text style={styles.currencyPrefix}>R$</Text>
                                                <TextInput style={styles.amountInput} placeholderTextColor={theme.colors.placeholder} keyboardType="numeric" value={formatAmountToString(amount)} onChangeText={handleAmountChange} />
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
                                                <TextInput style={styles.input} placeholder="Ex: Supermercado" placeholderTextColor={theme.colors.placeholder} value={description} onChangeText={setDescription} />
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
                                                        <TouchableOpacity style={styles.selectRow} onPress={() => setShowDatePicker(true)}>
                                                                <Text style={styles.inputClean}>{date}</Text>
                                                                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                                                        </TouchableOpacity>
                                                        {/* <TextInput style={styles.inputClean} value={date} onChangeText={setDate} placeholder="DD/MM/AAAA" placeholderTextColor={theme.colors.placeholder} />
                                                        <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} /> */}
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

                                <TransactionOptionalDataForm
                                        payee={payee} 
                                        tags={tags} 
                                        ignoreInDashboard={ignoreInDashboard} 
                                        setPayee={setPayee} 
                                        setTags={setTags} 
                                        setIgnoreInDashboard={setIgnoreInDashboard}
                                />

                                <TouchableOpacity style={[styles.submitButton, styles.shadow]} onPress={handleSaveTransaction}>
                                        <Text style={styles.submitButtonText}>{isEditing ? 'Salvar Alterações' : 'Confirmar Movimentação'}</Text>
                                </TouchableOpacity>

                        </ScrollView>

                        <CategoryPickerModal visible={modalVisible} onClose={() => setModalVisible(false)} categories={categories!} onSelectCategory={setSelectedCategory} />

                        {showDatePicker && (
                                <DateTimePicker
                                        value={new Date()}
                                        mode="date"
                                        display="default"
                                        onValueChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                if (selectedDate) {
                                                        // Formata e salva no estado
                                                        setDate(selectedDate.toLocaleDateString('pt-BR'));
                                                }
                                        }}
                                />
                        )}
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { padding: 24, paddingBottom: 120 },
        shadow: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
        headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginBottom: 24 },

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
