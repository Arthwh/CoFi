import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { LoadingIndicator } from '../components/LoadingIndicator';

export default function ProfileScreen() {
        const [loading, setLoading] = useState(true);
        const [saving, setSaving] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        // Estados dos dados
        const [id, setId] = useState('');
        const [name, setName] = useState('');
        const [phone, setPhone] = useState('');
        const [cpf, setCpf] = useState('');
        const [email, setEmail] = useState('');
        const [createdAt, setCreatedAt] = useState('');

        useEffect(() => {
                carregarDados();
        }, []);

        const carregarDados = async () => {
                const profile = await userService.getUserProfile();
                console.log(profile)
                if (profile) {
                        setId(profile.id);
                        setName(profile.name);
                        setPhone(profile.phone);
                        setCpf(profile.cpf);
                        setEmail(profile.email || '');

                        // Formata a data de criação
                        const dataCriacao = new Date(profile.createdAt);
                        setCreatedAt(dataCriacao.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }));
                }
                setLoading(false);
        };

        const handleSave = async () => {
                setSaving(true);
                try {
                        await userService.updateUserProfile({
                                name: name,
                                phone: phone,
                        });

                        setIsEditing(false);
                        Alert.alert('Sucesso', 'Seus dados foram atualizados!');
                } catch (error) {
                        Alert.alert('Erro', 'Não foi possível atualizar os dados.');
                } finally {
                        setSaving(false);
                }
        };

        const handleLogout = () => {
                Alert.alert('Sair', 'Tem certeza que deseja sair da conta?', [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                                text: 'Sair',
                                style: 'destructive',
                                onPress: async () => {
                                        await authService.signOut();
                                }
                        }
                ]);
        };

        const handleDelete = () => {
                Alert.alert('Deletar', 'Tem certeza que deseja deletar a conta?', [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                                text: 'Deletar',
                                style: 'destructive',
                                onPress: async () => {
                                        await userService.deleteUserProfile(id);
                                }
                        }
                ]);
        }

        // Pega a primeira letra do nome para o Avatar
        const avatarLetter = name ? name.charAt(0).toUpperCase() : '?';

        if (loading) {
                return <LoadingIndicator message="Carregando suas informações..." />;
        }

        return (
                <SafeAreaView style={styles.container}>
                        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                                {/* Cabeçalho */}
                                <View style={styles.header}>
                                        <Text style={styles.headerTitle}>Meu Perfil</Text>
                                </View>

                                {/* Card de Identificação */}
                                <View style={[styles.card, styles.shadow, styles.avatarCard]}>
                                        <View style={styles.avatarContainer}>
                                                <Text style={styles.avatarText}>{avatarLetter}</Text>
                                        </View>
                                        <Text style={styles.userName}>{name}</Text>
                                        <Text style={styles.userEmail}>{email}</Text>
                                        <View style={styles.badge}>
                                                <Text style={styles.badgeText}>Membro desde {createdAt}</Text>
                                        </View>
                                </View>

                                {/* Card de Dados Pessoais */}
                                <View style={[styles.card, styles.shadow]}>
                                        <View style={styles.cardHeader}>
                                                <Text style={styles.cardTitle}>Dados Pessoais</Text>
                                                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                                                        {saving ? (
                                                                <ActivityIndicator size="small" color={theme.colors.primary} />
                                                        ) : (
                                                                <Text style={styles.actionText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
                                                        )}
                                                </TouchableOpacity>
                                        </View>

                                        <View style={styles.infoRow}>
                                                <Text style={styles.infoLabel}>Nome Completo</Text>
                                                {isEditing ? (
                                                        <TextInput style={styles.input} value={name} onChangeText={setName} />
                                                ) : (
                                                        <Text style={styles.infoValue}>{name}</Text>
                                                )}
                                        </View>

                                        <View style={styles.divider} />

                                        <View style={styles.infoRow}>
                                                <Text style={styles.infoLabel}>Telefone</Text>
                                                {isEditing ? (
                                                        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                                                ) : (
                                                        <Text style={styles.infoValue}>{phone}</Text>
                                                )}
                                        </View>

                                        <View style={styles.divider} />

                                        <View style={styles.infoRow}>
                                                <Text style={styles.infoLabel}>CPF</Text>
                                                <Text style={[styles.infoValue, { color: theme.colors.textLight }]}>{cpf}</Text>
                                        </View>
                                </View>

                                {/* Menu de Configurações e Sobre */}
                                <View style={[styles.card, styles.shadow, styles.menuCard]}>
                                        <TouchableOpacity style={styles.menuItem}>
                                                <View style={styles.menuItemLeft}>
                                                        <View style={styles.iconContainer}>
                                                                <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                                                        </View>
                                                        <Text style={styles.menuItemText}>Configurações do App</Text>
                                                </View>
                                                <Feather name="chevron-right" size={20} color={theme.colors.textLight} />
                                        </TouchableOpacity>

                                        <View style={styles.divider} />

                                        <TouchableOpacity style={styles.menuItem}>
                                                <View style={styles.menuItemLeft}>
                                                        <View style={styles.iconContainer}>
                                                                <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                                                        </View>
                                                        <Text style={styles.menuItemText}>Sobre o CoFi</Text>
                                                </View>
                                                <Feather name="chevron-right" size={20} color={theme.colors.textLight} />
                                        </TouchableOpacity>
                                </View>

                                {/* Botão de Sair */}
                                <TouchableOpacity style={[styles.button, styles.logoutButton, styles.shadow]} onPress={handleLogout}>
                                        <Ionicons name="log-out-outline" size={24} color={theme.colors.danger} />
                                        <Text style={[styles.buttonText, styles.logoutText]}>Sair da conta</Text>
                                </TouchableOpacity>

                                {/* Botão de Sair */}
                                <TouchableOpacity style={[styles.button, styles.deleteButton, styles.shadow]} onPress={handleDelete}>
                                        <Ionicons name="trash" size={24} color={theme.colors.white} />
                                        <Text style={[styles.buttonText, styles.deleteText]}>Deletar conta</Text>
                                </TouchableOpacity>

                        </ScrollView>
                </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        content: { padding: 24, paddingBottom: 120 },

        shadow: {
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
        },

        header: { marginBottom: 24, marginTop: 10 },
        headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text },

        card: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 24, marginBottom: 24 },

        // Avatar section
        avatarCard: { alignItems: 'center', paddingTop: 32 },
        avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
        avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
        userName: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
        userEmail: { fontSize: 16, color: theme.colors.textLight, marginBottom: 16 },
        badge: { backgroundColor: 'rgba(99, 102, 241, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
        badgeText: { color: theme.colors.primary, fontSize: 12, fontWeight: '600' },

        // Info section
        cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
        cardTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
        actionText: { fontSize: 16, fontWeight: '600', color: theme.colors.primary },
        infoRow: { paddingVertical: 8 },
        infoLabel: { fontSize: 14, color: theme.colors.textLight, marginBottom: 4 },
        infoValue: { fontSize: 16, fontWeight: '500', color: theme.colors.text },
        input: { fontSize: 16, fontWeight: '500', color: theme.colors.text, borderBottomWidth: 1, borderBottomColor: theme.colors.primary, paddingVertical: 4 },
        divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },

        // Menu section
        menuCard: { padding: 16 },
        menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
        menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
        iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
        menuItemText: { fontSize: 16, fontWeight: '500', color: theme.colors.text },

        button: { flexDirection: 'row', borderRadius: 20, padding: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
        buttonText: { marginLeft: 12, fontSize: 18, fontWeight: 'bold' },

        // Logout
        logoutButton: { backgroundColor: theme.colors.surface, borderColor: theme.colors.danger },
        logoutText: { color: theme.colors.danger },

        deleteButton: { backgroundColor: theme.colors.danger, borderColor: theme.colors.white, marginTop: 10 },
        deleteText: { color: theme.colors.white },
});