import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { theme } from "../theme";
import { Ionicons } from "@expo/vector-icons";

interface TransactionNotificationOptionsCardProps {
        notifyMe: boolean,
        daysBeforeNotify: string | null,
        setNotifyMe: (notifyMe: boolean) => void,
        setDaysBeforeNotify: (daysBeforeNotify: string) => void
}

export function TransactionNotificationOptionsCard({ notifyMe, daysBeforeNotify, setNotifyMe, setDaysBeforeNotify }: TransactionNotificationOptionsCardProps) {
        return (
                <View style={[styles.card, styles.shadow, { borderColor: '#3B82F630', borderWidth: 1 }]}>
                        <View style={styles.switchRow}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <View style={styles.notificationIconBg}>
                                                <Ionicons name="notifications" size={20} color={theme.colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                                <Text style={styles.switchTitle}>Lembrete de Vencimento</Text>
                                                <Text style={styles.switchDesc}>Me avise antes desta conta vencer</Text>
                                        </View>
                                </View>
                                <Switch
                                        value={notifyMe}
                                        onValueChange={setNotifyMe}
                                        trackColor={{ true: theme.colors.primary, false: '#e5e7eb' }}
                                />
                        </View>

                        {notifyMe && (
                                <View style={styles.daysBeforeNotifyContainer}>
                                        <Text style={styles.daysBeforeNotifyLabel}>Avisar quantos dias antes?</Text>
                                        <View style={styles.daysRow}>
                                                {['1', '3', '5'].map((day) => (
                                                        <TouchableOpacity
                                                                key={day}
                                                                style={[styles.dayChip, daysBeforeNotify === day && styles.dayChipActive]}
                                                                onPress={() => setDaysBeforeNotify(day)}
                                                        >
                                                                <Text style={[styles.dayChipText, daysBeforeNotify === day && styles.textWhite]}>{day} {day === '1' ? 'dia' : 'dias'}</Text>
                                                        </TouchableOpacity>
                                                ))}
                                        </View>
                                </View>
                        )}
                </View>
        )
}

const styles = StyleSheet.create({
        shadow: { shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
        textWhite: { color: theme.colors.white },
        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 20 },
        switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
        switchTitle: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
        switchDesc: { fontSize: 13, color: theme.colors.textLight },
        notificationIconBg: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#3B82F615', justifyContent: 'center', alignItems: 'center' },
        daysBeforeNotifyContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
        daysBeforeNotifyLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.text, marginBottom: 10 },
        daysRow: { flexDirection: 'row', gap: 8 },
        dayChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
        dayChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        dayChipText: { fontSize: 13, fontWeight: '600', color: theme.colors.textLight },
});
