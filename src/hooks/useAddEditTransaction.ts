import { useState, useEffect, useCallback } from 'react';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { userService } from '../services/userService';
import { categoryService } from '../services/categoryService';
import { paymentMethodService } from '../services/paymentMethodService';
import { transactionService } from '../services/transactionService';
import { AppToast } from '../utils/toast';
import { handleError } from '../utils/errorHandler';
import { Category } from '../dtos/CategoryDto';
import { PaymentMethod } from '../dtos/PaymentMethodDto';
import { TransactionType } from '../types/TransactionTypeType';
import { TransactionStatus } from '../types/TransactionStatusType';
import { TransactionFrequency } from '../types/TransactionFrequencyType';
import { UpdateTransactionDto } from '../dtos/UpdateTransactionDto';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';

export function useAddTransaction() {
        const route = useRoute<RouteProp<RootStackParamList, 'Adicionar'>>();
        const navigation = useNavigation();
        const transactionToEdit = route.params?.transactionToEdit;

        // Estados de Controle da UI
        const [loading, setLoading] = useState(true);
        const [isEditing, setIsEditing] = useState(false);
        const [modalVisible, setModalVisible] = useState(false);

        // Estados de Dados Externos
        const [categories, setCategories] = useState<Category[]>([]);
        const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
        const [userId, setUserId] = useState<string | null>(null);

        // Estados do Formulário
        const [type, setType] = useState<TransactionType>('income');
        const [amount, setAmount] = useState('');
        const [description, setDescription] = useState('');
        const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
        const [date, setDate] = useState(new Date().toLocaleDateString('pt-BR'));
        const [status, setStatus] = useState<TransactionStatus>('paid');
        const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
        const [frequency, setFrequency] = useState<TransactionFrequency | null>(null);
        const [installmentsCount, setInstallmentsCount] = useState('2');
        const [payee, setPayee] = useState('');
        const [tags, setTags] = useState('');
        const [ignoreInDashboard, setIgnoreInDashboard] = useState(false);
        const [notes, setNotes] = useState('');
        const [notifyMe, setNotifyMe] = useState(false);
        const [daysBeforeNotify, setDaysBeforeNotify] = useState<string | null>(null);

        // Estado Derivado (Não precisa de useState, pois calcula baseado em outros estados)
        const showNotificationOption = status === 'unpaid' || status === 'scheduled' || frequency === 'installment';

        // Limpa o formulário ao sair da tela
        useFocusEffect(
                useCallback(() => {
                        return () => resetForm();
                }, [])
        );

        // Carrega dados iniciais do banco
        useEffect(() => {
                loadInitialData();
        }, []);

        // Preenche os campos se for modo de edição
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
                        setFrequency(transactionToEdit.frequency);
                        setInstallmentsCount(transactionToEdit.installmentsCount);
                        setTags(transactionToEdit.tags);
                        setIgnoreInDashboard(transactionToEdit.ignoreInDashboard);
                        setNotes(transactionToEdit.notes);
                        setNotifyMe(transactionToEdit.notifyMe);
                        setDaysBeforeNotify(transactionToEdit.daysBeforeNotify);
                }
        }, [transactionToEdit, isEditing]);

        const loadInitialData = async () => {
                try {
                        const [userData, categoriesData, paymentMethodsData] = await Promise.all([
                                userService.getUserProfile(),
                                categoryService.getCategories(),
                                paymentMethodService.getPaymentMethods(),
                        ]);

                        if (userData) setUserId(userData.id);
                        if (categoriesData) setCategories(categoriesData);
                        if (paymentMethodsData) setPaymentMethods(paymentMethodsData);
                } catch (error: any) {
                        handleError(error.message, 'Houve um erro ao carregar os dados. Tente novamente mais tarde.');
                } finally {
                        setLoading(false);
                }
        };

        const handleSaveTransaction = async () => {
                setLoading(true);
                const [dia, mes, ano] = date.split('/');
                const dataFormatada = `${ano}-${mes}-${dia}`;
                const parsedAmount = parseFloat(amount.replace(',', '.'));

                try {
                        if (isEditing) {
                                const payload: UpdateTransactionDto = {
                                        description,
                                        amount: parsedAmount,
                                        category_id: selectedCategory!.id,
                                        payment_method_id: selectedPaymentMethod!.id,
                                        status,
                                        payee,
                                        tags: tags.split(',').map((t) => t.trim()),
                                        ignore_in_dashboard: ignoreInDashboard,
                                        notes,
                                        notify_me: notifyMe,
                                        days_before_notify: notifyMe && daysBeforeNotify ? parseInt(daysBeforeNotify) : null,
                                };

                                await transactionService.update(transactionToEdit.id, payload);
                                AppToast.success('Movimentação atualizada com sucesso!');
                                navigation.goBack();
                        } else {
                                const payload: CreateTransactionDto = {
                                        user_id: userId!,
                                        type,
                                        amount: parsedAmount,
                                        description,
                                        category_id: selectedCategory!.id,
                                        date: dataFormatada,
                                        status,
                                        payment_method_id: selectedPaymentMethod!.id,
                                        frequency: frequency!,
                                        installments: frequency === 'installment' ? parseInt(installmentsCount) : 1,
                                        payee,
                                        tags: tags.split(',').map((t) => t.trim()),
                                        ignore_in_dashboard: ignoreInDashboard,
                                        notes,
                                        notify_me: notifyMe,
                                        days_before_notify: notifyMe && daysBeforeNotify ? parseInt(daysBeforeNotify) : null,
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
                setAmount('');
                setDescription('');
                setSelectedCategory(null);
                setDate(new Date().toLocaleDateString('pt-BR'));
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
                setIsEditing(false);
                navigation.setParams({ transactionToEdit: undefined });
        };

        // Retornamos tudo o que a View vai precisar ler ou modificar
        return {
                loading,
                isEditing,
                modalVisible,
                setModalVisible,
                categories,
                paymentMethods,
                type,
                setType,
                amount,
                setAmount,
                description,
                setDescription,
                selectedCategory,
                setSelectedCategory,
                date,
                setDate,
                status,
                setStatus,
                selectedPaymentMethod,
                setSelectedPaymentMethod,
                frequency,
                setFrequency,
                installmentsCount,
                setInstallmentsCount,
                payee,
                setPayee,
                tags,
                setTags,
                ignoreInDashboard,
                setIgnoreInDashboard,
                notes,
                setNotes,
                notifyMe,
                setNotifyMe,
                daysBeforeNotify,
                setDaysBeforeNotify,
                showNotificationOption,
                handleSaveTransaction,
        };
}