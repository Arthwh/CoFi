import { useCallback, useEffect, useState } from "react";
import { NavigationProp, NavigationState, RouteProp, useFocusEffect } from "@react-navigation/native";

import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { UpdateTransactionDto } from "../dtos/UpdateTransactionDto";
import { PaymentMethod } from "../dtos/PaymentMethodDto";
import { Category } from "../dtos/CategoryDto";
import { categoryService } from "../services/categoryService";
import { paymentMethodService } from "../services/paymentMethodService";
import { transactionService } from "../services/transactionService";
import { userService } from "../services/userService";
import { dateUtils } from "../utils/dateUtils";
import { handleError } from "../utils/errorHandler";
import { AppToast } from "../utils/toast";
import { TransactionFrequency } from "../types/TransactionFrequencyType";
import { TransactionStatus } from "../types/TransactionStatusType";
import { TransactionType } from "../types/TransactionTypeType";
import { RootStackParamList } from "../types/navigation";
import { formatTagsFromMapToString, formatTagsFromStringToMap } from "../utils/tagsUtils";

interface useAddEditTransactionProps {
        route: RouteProp<RootStackParamList, "Adicionar">
        navigation: Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & {
                getState(): NavigationState | undefined
        }
}

export function useAddEditTransaction({ route, navigation }: useAddEditTransactionProps) {
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
        const [payee, setPayee] = useState<string | null>(null);
        const [tags, setTags] = useState<string[] | null>(null);
        const [ignoreInDashboard, setIgnoreInDashboard] = useState(false); // Ignorar transferências no dashboard
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
                        console.log(transactionToEdit)
                        setIsEditing(true);
                        setDescription(transactionToEdit.description);
                        setAmount(String(transactionToEdit.amount));
                        setType(transactionToEdit.type);
                        setSelectedCategory(transactionToEdit.category);
                        setSelectedPaymentMethod(transactionToEdit.payment_method);
                        setDate(transactionToEdit.date);
                        setPayee(transactionToEdit.payee);
                        setStatus(transactionToEdit.status);
                        setFrequency(transactionToEdit.frequency)
                        setInstallmentsCount(transactionToEdit.installments)
                        setTags(transactionToEdit.tags)
                        setIgnoreInDashboard(transactionToEdit.ignore_in_dashboard)
                        setNotifyMe(transactionToEdit.notify_me)
                        setDaysBeforeNotify(transactionToEdit.days_before_notify)
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
                try {
                        if (isEditing) {
                                const payload: UpdateTransactionDto = getUpdateTransactionPayload();
                                await transactionService.update(transactionToEdit.id, payload)
                                AppToast.success('Movimentação atualizada com sucesso!');
                                // Volta para a tela anterior
                                navigation.goBack();
                        }
                        else {
                                const payload: CreateTransactionDto = getCreateTransactionPayload();
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

        const getCreateTransactionPayload = () => {
                return {
                        user_id: userId!,
                        type,
                        amount: Number(amount),
                        description,
                        category_id: selectedCategory!.id,
                        date: dateUtils.formatDateFromSlashToDash(date),
                        status,
                        payment_method_id: selectedPaymentMethod!.id,
                        frequency: frequency!,
                        installments: frequency === 'installment' ? parseInt(installmentsCount) : 1,
                        payee: payee ? payee : null,
                        tags: tags ? tags : null,
                        ignore_in_dashboard: ignoreInDashboard,
                        notify_me: notifyMe,
                        days_before_notify: notifyMe === true && daysBeforeNotify ? parseInt(daysBeforeNotify) : null
                } as CreateTransactionDto;
        };

        const getUpdateTransactionPayload = () => {
                return {
                        description,
                        amount: Number(amount),
                        category_id: selectedCategory!.id,
                        payment_method_id: selectedPaymentMethod!.id,
                        status,
                        payee: payee ? payee : null,
                        tags: tags ? tags : null,
                        ignore_in_dashboard: ignoreInDashboard,
                        notify_me: notifyMe,
                        days_before_notify: notifyMe === true && daysBeforeNotify ? parseInt(daysBeforeNotify) : null
                } as UpdateTransactionDto
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
                setPayee(null);
                setTags(null);
                setIgnoreInDashboard(false);
                setNotifyMe(false);
                setDaysBeforeNotify(null);
                setIsEditing(false)
                navigation.setParams({ transactionToEdit: undefined });
        };

        return {
                // Estados de Controle da Tela e Loading
                loading,
                isEditing,
                showCategoryPicker,
                setShowCategoryPicker,
                showDatePicker,
                setShowDatePicker,

                // Dados Externos
                categories,
                paymentMethods,

                // Estados do Formulário e Handlers
                type,
                setType,
                amount,
                handleAmountChange,
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

                // Notificações
                notifyMe,
                setNotifyMe,
                daysBeforeNotify,
                setDaysBeforeNotify,
                showNotificationOption,

                // Ação Principal
                handleSaveTransaction
        };
}