import { supabase } from '../lib/supabase';
import { authService } from './authService';
import { UserDto } from '../dtos/UserDto';

export const userService = {
        async getUserProfile() {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                        throw Error(error.message);
                }

                if (!user) throw Error('Usuário não encontrado!');

                // Retorna os dados nativos de auth + os dados customizados (user_metadata)
                return {
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || '',
                        phone: user.user_metadata?.phone || '',
                        cpf: user.user_metadata?.cpf || '',
                        createdAt: user.created_at,
                        updatedAt: user.user_metadata?.updatedAt || null,
                        deletedAt: user.user_metadata?.deletedAt || null
                } as UserDto;
        },

        async updateUserProfile(updates: { name?: string; phone?: string; cpf?: string }) {
                const { data, error } = await supabase.auth.updateUser({
                        data: updates
                });

                if (error) {
                        throw error;
                }

                return data.user;
        },

        async deleteUserProfile() {
                const { data, error } = await supabase.auth.updateUser({
                        data: {
                                deleted_at: true
                        }
                });

                if (error) {
                        throw error;
                }

                await authService.signOut()

                return data.user;
        }
};