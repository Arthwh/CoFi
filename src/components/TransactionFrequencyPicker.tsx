import { View } from "react-native"
import { CustomIconTextButton } from "./CustomTextButton"
import { theme } from "../theme"
import { TransactionFrequency } from "../types/TransactionFrequencyType"

interface TransactionFrequencyPickerProps{
        frequency: TransactionFrequency, 
        isEditing: boolean, 
        setFrequency: (frequency: TransactionFrequency) => void
}

export function TransactionFrequencyPicker({frequency, isEditing, setFrequency}: TransactionFrequencyPickerProps) {
        return (
                <View style={theme.styles.inputRow}>
                        <CustomIconTextButton
                                text={"Única"}
                                onPress={() => setFrequency('single')}
                                active={frequency === 'single'}
                                disabled={isEditing}
                                style={{ flex: 1 }}
                        />
                        <CustomIconTextButton
                                text={"Parcelada"}
                                onPress={() => setFrequency('installment')}
                                active={frequency === 'installment'}
                                disabled={isEditing}
                                style={{ flex: 1 }}
                        />

                        <CustomIconTextButton
                                text={"Fixa Mensal"}
                                onPress={() => setFrequency('fixed')}
                                active={frequency === 'fixed'}
                                disabled={isEditing}
                                style={{ flex: 1 }}
                        />
                </View>
        )
}