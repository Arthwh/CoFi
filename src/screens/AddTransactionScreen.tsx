import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { CategoryPickerModal } from '../components/CategoryPickerModal';
import { TransactionStatusPicker } from '../components/TransactionStatusPicker';
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
import { TransactionPaymentFrequencyDataForm } from '../components/TransactionPaymentFrequencyDataForm';
import { TransactionNotificationOptionsCard } from '../components/TransactionNotificationOptionsCard';
import { TransactionBasicDataForm } from '../components/TransactionBasicDataForm';

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
        const [daysBeforeNotify, setDaysBeforeNotify] = useState<string | null>(null);
        const showNotificationOption = status === 'unpaid' || status === 'scheduled' || frequency === 'installment';

        // Controle de Modal
        const [showCategoryPicker, setShowCategoryPicker] = useState(false);
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
                                        <TransactionNotificationOptionsCard
                                                notifyMe={notifyMe}
                                                daysBeforeNotify={daysBeforeNotify}
                                                setNotifyMe={setNotifyMe}
                                                setDaysBeforeNotify={setDaysBeforeNotify}
                                        />
                                )}

                                {/* Dados Básicos */}
                                <TransactionBasicDataForm
                                        description={description}
                                        selectedCategory={selectedCategory!}
                                        date={date}
                                        setDescription={setDescription}
                                        setShowCategoryPicker={setShowCategoryPicker}
                                        setShowDatePicker={setShowDatePicker}
                                />

                                {/* Pagamento e Frequência */}
                                <TransactionPaymentFrequencyDataForm
                                        paymentMethods={paymentMethods}
                                        selectedPaymentMethod={selectedPaymentMethod!}
                                        frequency={frequency!}
                                        installmentsCount={installmentsCount}
                                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                                        setFrequency={setFrequency}
                                        setInstallmentsCount={setInstallmentsCount}
                                />

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

                        <CategoryPickerModal
                                visible={showCategoryPicker}
                                onClose={() => setShowCategoryPicker(false)}
                                categories={categories!}
                                onSelectCategory={setSelectedCategory}
                        />

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
                                        onDismiss={() => setShowDatePicker(false)}
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
        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 20 },
        amountCard: { alignItems: 'center', paddingVertical: 24 },
        inputLabelLabel: { fontSize: 14, color: theme.colors.textLight, fontWeight: '500', marginBottom: 8 },
        amountInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
        currencyPrefix: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginRight: 6, marginTop: 4 },
        amountInput: { fontSize: 42, fontWeight: 'bold', color: theme.colors.text, minWidth: 150, textAlign: 'left' },
        submitButton: { backgroundColor: theme.colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
        submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
