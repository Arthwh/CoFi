import { supabase } from '../lib/supabase';

export const userService = {
        async getUserProfile() {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                        console.error('Erro ao buscar dados do usuário:', error.message);
                        return null;
                }

                if (!user) return null;

                // Retorna os dados nativos de auth + os dados customizados (user_metadata)
                return {
                        id: user.id,
                        email: user.email,
                        createdAt: user.created_at,
                        name: user.user_metadata?.full_name || '',
                        phone: user.user_metadata?.phone || '',
                        cpf: user.user_metadata?.cpf || '',
                };
        },

        async updateUserProfile(updates: { name?: string; phone?: string; cpf?: string }) {
                const { data, error } = await supabase.auth.updateUser({
                        data: updates
                });

                if (error) {
                        console.error('Erro ao atualizar perfil:', error.message);
                        throw error;
                }

                return data.user;
        }
};