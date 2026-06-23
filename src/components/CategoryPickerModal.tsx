import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Tipagem para a Categoria
export interface Category {
        id: string;
        name: string;
        icon: keyof typeof Ionicons | string;
        color: string;
}

interface CategoryPickerModalProps {
        visible: boolean;
        onClose: () => void;
        categories: Category[];
        onSelectCategory: (category: Category) => void;
}

export function CategoryPickerModal({ visible, onClose, categories, onSelectCategory }: CategoryPickerModalProps) {
        return (
                <Modal visible={visible} animationType="slide" transparent>
                        <View style={styles.modalOverlay}>
                                <SafeAreaView style={styles.modalContent}>

                                        <View style={styles.dragIndicator} />

                                        <View style={styles.header}>
                                                <Text style={styles.title}>Selecione uma Categoria</Text>
                                                <TouchableOpacity onPress={onClose}>
                                                        <Ionicons name="close-circle" size={28} color={theme.colors.textLight} />
                                                </TouchableOpacity>
                                        </View>

                                        <FlatList
                                                data={categories}
                                                keyExtractor={(item) => item.id}
                                                numColumns={2}
                                                columnWrapperStyle={styles.row}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                                style={[styles.categoryCard, { borderColor: item.color + '30' }]}
                                                                onPress={() => {
                                                                        onSelectCategory(item);
                                                                        onClose();
                                                                }}
                                                        >
                                                                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                                                                        <Ionicons name={item.icon as any} size={24} color={item.color} />
                                                                </View>
                                                                <Text style={styles.categoryName}>{item.name}</Text>
                                                        </TouchableOpacity>
                                                )}
                                        />
                                </SafeAreaView>
                        </View>
                </Modal>
        );
}

const styles = StyleSheet.create({
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
        modalContent: {
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                maxHeight: '75%',
                paddingHorizontal: 24,
        },
        dragIndicator: {
                width: 40,
                height: 5,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 3,
                alignSelf: 'center',
                marginVertical: 12,
        },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
        title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
        row: { justifyContent: 'space-between', gap: 12, marginBottom: 12 },
        categoryCard: {
                flex: 1,
                backgroundColor: theme.colors.background,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
        },
        iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
        categoryName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
});