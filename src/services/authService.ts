import { supabase } from '../lib/supabase';

export const authService = {
        async login(email: string, password: string) {
                const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                });
                if (data.user?.deleted_at) {
                        await this.signOut();
                        throw Error("Conta do usuário está inativa.")
                }

                if (error) throw error;
                return data;
        },

        // Cadastro com os dados extras (Nome, CPF e telefone)
        async register(email: string, password: string, nome: string, cpf: string, telefone: string) {
                const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                                data: {
                                        full_name: nome,
                                        cpf: cpf,
                                        phone: telefone
                                }
                        }
                });
                if (error) throw error;
                return data;
        },

        // Busca a sessão atual
        async getSession() {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                        throw error;
                }
                if (!session) {
                        throw Error('Sessão não encontrada!')
                }

                return session.user;
        },

        // Busca mudanças no estado da sessão, e executa callback
        onAuthStateChange(callback: (user: any) => void) {
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                        callback(session?.user ?? null);
                });

                // Retorna a inscrição
                return subscription;
        },

        async signOut() {
                const { error } = await supabase.auth.signOut();

                if (error) {
                        return error;
                }

                return null
        }
};