import { Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { CategoryPickerModal } from '../components/CategoryPickerModal';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types/navigation';
import { TransactionTypePicker } from '../components/TransactionTypePicker';
import { TransactionOptionalDataForm } from '../components/TransactionOptionalDataForm';
import { TransactionPaymentFrequencyDataForm } from '../components/TransactionPaymentFrequencyDataForm';
import { TransactionNotificationOptionsCard } from '../components/TransactionNotificationOptionsCard';
import { TransactionBasicDataForm } from '../components/TransactionBasicDataForm';
import { TransactionStatusAndAmountDataForm } from '../components/TransactionStatusAndAmountDataForm';
import { useAddEditTransaction } from '../hooks/useAddEditTransaction';
import { formatTagsFromStringToMap } from '../utils/tagsUtils';

export default function AddTransactionScreen() {
        const route = useRoute<RouteProp<RootStackParamList, 'Adicionar'>>();
        const navigation = useNavigation();

        const {
                // Estados de Controle da Tela e Loading
                loading, isEditing, showCategoryPicker, setShowCategoryPicker, showDatePicker, setShowDatePicker,
                // Dados Externos
                categories, paymentMethods,
                // Estados do Formulário e Handlers
                type, setType, amount, handleAmountChange, description, setDescription,
                selectedCategory, setSelectedCategory, date, setDate, status, setStatus,
                selectedPaymentMethod, setSelectedPaymentMethod, frequency, setFrequency,
                installmentsCount, setInstallmentsCount, payee, setPayee, tags, setTags,
                ignoreInDashboard, setIgnoreInDashboard,
                // Notificações
                notifyMe, setNotifyMe, daysBeforeNotify,
                setDaysBeforeNotify, showNotificationOption,
                // Ação Principal
                handleSaveTransaction
        } = useAddEditTransaction({
                route,
                navigation
        });

        if (loading) {
                return <LoadingIndicator message="Carregando..." />;
        }

        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                                <Text style={styles.headerTitle}>{isEditing ? 'Editar Movimentação' : 'Nova Movimentação'}</Text>

                                {/* Seletor de Tipo de Movimentação */}
                                <TransactionTypePicker type={type} onPress={setType} isEditing={isEditing} />

                                {/* Valor e Status */}
                                <TransactionStatusAndAmountDataForm
                                        amount={amount}
                                        status={status}
                                        type={type}
                                        handleAmountChange={handleAmountChange}
                                        setStatus={setStatus} />

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
                                        isEditing={isEditing}
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
                                        setTags={(tags) => {
                                                setTags(formatTagsFromStringToMap(tags))
                                        }}
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
