import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

export function CustomAddButton({ children, onPress }: BottomTabBarButtonProps) {
        return (
                <TouchableOpacity
                        style={styles.addButtonContainer}
                        onPress={onPress}
                        activeOpacity={0.7}
                >
                        <View style={styles.addButton}>
                                <Ionicons name="add" size={40} color="#FFF" />
                        </View>
                </TouchableOpacity>
        );
}

const styles = StyleSheet.create({
        addButtonContainer: {
                top: -25,
                justifyContent: 'center',
                alignItems: 'center',
        },
        addButton: {
                width: 65,
                height: 65,
                borderRadius: 35,
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 4,
                borderColor: theme.colors.primary,
        }
});