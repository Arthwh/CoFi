import { ScrollView, StyleSheet, View } from 'react-native';
import { PaymentMethod } from '../dtos/PaymentMethodDto';
import { CustomIconTextButton } from './CustomIconTextButton';

interface PaymentMethodPickerProps {
        selected: PaymentMethod | null;
        paymentMethods: PaymentMethod[];
        isEditing: boolean;
        onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodPicker({ selected, paymentMethods, onChange, isEditing }: PaymentMethodPickerProps) {
        return (
                <View style={{ marginHorizontal: -20 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                {paymentMethods.map((method) => {
                                        const isActive = selected?.id === method.id;
                                        return (
                                                <CustomIconTextButton
                                                        text={method.name}
                                                        onPress={() => onChange(method)}
                                                        active={isActive}
                                                        disabled={isEditing}
                                                        icon={method.icon}
                                                        style={{ flex: 1 }}
                                                />
                                        );
                                })}
                        </ScrollView>
                </View>
        );
}

const styles = StyleSheet.create({
        scrollContent: { paddingHorizontal: 20, gap: 10, paddingVertical: 4 },
});