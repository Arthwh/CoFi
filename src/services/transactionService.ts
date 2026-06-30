import { supabase } from '../lib/supabase';
import { TransactionStatus } from '../components/TransactionStatusPicker';

// Interface do Payload de cadastro
export interface CreateTransactionPayload {
        user_id: string | null;
        type: 'income' | 'expense';
        amount: number;
        description: string;
        category_id: string | null;
        date: string;
        status: TransactionStatus;
        payment_method_id: string | null;
        frequency: 'single' | 'installment' | 'fixed';
        installments?: number;
        payee?: string;
        tags?: string[];
        ignore_in_dashboard: boolean;
        notes?: string;
        notify_me: boolean;
        days_before_notify?: number | null;
}

export interface BalanceData {
        total: number;
        income: number;
        expense: number;
}

export const transactionService = {
        async create(payload: CreateTransactionPayload) {
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
                        .from('transactions') //Tabela
                        .select(`
                          *,
                                category:categories!inner(id, name, icon, color),
                                paymentMethod:payment_methods!inner(id, name, icon, color)
                        `);

                if (error) {
                        throw error;
                }

                return data;
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
                                paymentMethod:payment_methods!inner(id, name, icon, color)
                        `)
                        .is('deleted_at', null)
                        .gte('date', firstDay)
                        .lte('date', lastDay)
                        .order('date', { ascending: false }); // Ordena da mais recente para a mais antiga

                if (error) {
                        throw error;
                }

                return data;
        },

        async getBalance() {
                return { total: 0, income: 0, expense: 0 }
        },

        async markTransactionAsPaid(transactionId: string) {
                const { data, error } = await supabase
                        .from('transactions')
                        .update({
                                status: 'paid',
                                updated_at: new Date().toISOString(),
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

        async update(transactionId: string, payload: CreateTransactionPayload) {
                const { data, error } = await supabase
                        .from('transactions')
                        .update({
                                description: payload.description,
                                amount: payload.amount,
                                category_id: payload.category_id,
                                payment_method_id: payload.payment_method_id,
                                status: payload.status,
                                payee: payload.payee,
                                tags: payload.tags,
                                ignore_in_dashboard: payload.ignore_in_dashboard,
                                notes: payload.notes,
                                notify_me: payload.notify_me,
                                days_before_notify: payload.days_before_notify,
                                updated_at: new Date().toISOString() // Registra o momento da alteração
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
                                updated_at: new Date().toISOString(),
                                deleted_at: new Date().toISOString()
                        })
                        .eq('id', transactionId)

                if (error) {
                        throw error;
                }

                return null;
        }
};