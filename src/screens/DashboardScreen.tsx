import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { theme } from '../theme';

export default function DashboardScreen() {
        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                                <View style={styles.header}>
                                        <Text style={styles.headerTitle}>Dashboard</Text>
                                </View>
                        </ScrollView>
                </SafeAreaView>
        )
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { padding: 24, paddingBottom: 120 },

        header: { marginBottom: 24, marginTop: 10 },
        headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text }
})