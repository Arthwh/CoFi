import { supabase } from '../lib/supabase';
import { BalanceDto } from '../dtos/BalanceDto';
import { CreateTransactionDto } from '../dtos/CreateTransactionDto';
import { UpdateTransactionDto } from '../dtos/UpdateTransactionDto';
import { dateUtils } from '../utils/dateUtils';
import { Transaction } from '../dtos/TransactionDto';

export const transactionService = {
        async create(payload: CreateTransactionDto) {
                const { data, error } = await supabase
                        .from('transactions') // Tabela
                        .insert([payload])
                        .select(); // Retorna o dado criado com o id gerado

                if (error) {
                        throw error;
                }

                return data[0];
        },

        async getTransactions() {
                const { data, error } = await supabase
                        .from('transactions') // Tabela
                        .select(`
                          *,
                                category:categories!inner(id, name, icon, color),
                                payment_method:payment_methods!inner(id, name, icon, color)
                        `);

                if (error) {
                        throw error;
                }

                return data as Transaction[];
        },

        async getActiveTransactionsByMonth(month: number, year: number) {
                // Descobre o primeiro e o último dia do mês desejado
                const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
                const lastDayOfMonth = new Date(year, month, 0).getDate();
                const lastDay = `${year}-${String(month).padStart(2, '0')}-${lastDayOfMonth}`;

                const { data, error } = await supabase
                        .from('transactions')
                        .select(`
                                *,
                                category:categories!inner(id, name, icon, color),
                                payment_method:payment_methods!inner(id, name, icon, color)
                        `)
                        .is('deleted_at', null)
                        .gte('date', firstDay)
                        .lte('date', lastDay)
                        .order('date', { ascending: false }); // Ordena da mais recente para a mais antiga

                if (error) {
                        throw error;
                }

                return data as Transaction[];
        },

        async getBalance(userId: string) {
                const { data, error } = await supabase
                        .from('balance')
                        .select('*')
                        .eq('user_id', userId)
                        .single(); // Retorna um objeto, em vez de um array

                if (error) {
                        if (error.code === 'PGRST116') {
                                return { income: 0, expense: 0, total_balance: 0 } as BalanceDto;
                        }
                        throw error;
                }

                return data[0] as BalanceDto;
        },

        async markTransactionAsPaid(transactionId: string) {
                const { data, error } = await supabase
                        .from('transactions')
                        .update({
                                status: 'paid',
                                updated_at: dateUtils.now(),
                                notify_me: false,
                                days_before_notify: null
                        })
                        .eq('id', transactionId)
                        .select();

                if (error) {
                        throw error;
                }

                return data ? data[0] : null;
        },

        async update(transactionId: string, payload: UpdateTransactionDto) {
                const { data, error } = await supabase
                        .from('transactions')
                        .update({
                                ...payload,
                                updated_at: dateUtils.now() // Registra o momento da alteração
                        })
                        .eq('id', transactionId)
                        .select();

                if (error) {
                        throw error;
                }

                return data ? data[0] : null;
        },

        async delete(transactionId: string) {
                const { error } = await supabase
                        .from('transactions')
                        .update({
                                updated_at: dateUtils.now(),
                                deleted_at: dateUtils.now()
                        })
                        .eq('id', transactionId)

                if (error) {
                        throw error;
                }

                return null;
        }
};