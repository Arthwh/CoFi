import { View, Text } from "react-native";
import { theme } from "../../../theme";
import { PaymentMethodPicker } from "./PaymentMethodPicker";
import { PaymentMethod } from "../../../dtos/PaymentMethodDto";
import { TransactionFrequency } from "../../../types/TransactionFrequencyType";
import { TransactionFrequencyPicker } from "./TransactionFrequencyPicker";
import { TransactionInstallmentsContainer } from "./TransactionInstallmentsContainer";

interface TransactionPaymentFrequencyDataFormProps {
        paymentMethods: PaymentMethod[],
        selectedPaymentMethod: PaymentMethod,
        frequency: TransactionFrequency,
        installmentsCount: string,
        isEditing: boolean,
        setSelectedPaymentMethod: (selectedPaymentMethod: PaymentMethod) => void,
        setFrequency: (frequency: TransactionFrequency) => void,
        setInstallmentsCount: (installmentsCount: string) => void
}

export function TransactionPaymentFrequencyDataForm({ paymentMethods, selectedPaymentMethod, frequency, installmentsCount, isEditing, setSelectedPaymentMethod, setFrequency, setInstallmentsCount }: TransactionPaymentFrequencyDataFormProps) {
        return (
                <View style={[theme.styles.card, theme.styles.shadow]}>
                        <View style={theme.styles.inputGroup}>
                                <Text style={theme.styles.inputLabel}>Método de Pagamento</Text>
                                <PaymentMethodPicker selected={selectedPaymentMethod} paymentMethods={paymentMethods!} onChange={setSelectedPaymentMethod} isEditing={isEditing} />
                        </View>

                        <View style={theme.styles.divider} />

                        <View style={theme.styles.inputGroup}>
                                <Text style={theme.styles.inputLabel}>Repetição</Text>
                                <TransactionFrequencyPicker
                                        frequency={frequency}
                                        isEditing={isEditing}
                                        setFrequency={setFrequency}
                                />

                                {/* Input de parcelas */}
                                {frequency === 'installment' && (
                                        <TransactionInstallmentsContainer
                                                isEditing={isEditing}
                                                installmentsCount={installmentsCount}
                                                setInstallmentsCount={setInstallmentsCount}
                                        />
                                )}
                        </View>
                </View>
        )
}