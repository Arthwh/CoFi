import { supabase } from '../lib/supabase';
import { PaymentMethod } from '../components/PaymentMethodPicker';
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

export const transactionService = {
        async create(payload: CreateTransactionPayload) {
                const { data, error } = await supabase
                        .from('transactions') //Tabela
                        .insert([payload])
                        .select(); // Retorna o dado criado com o id gerado

                if (error) {
                        console.error('Erro ao inserir transação:', error.message);
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
                        console.error('Erro ao obter transações:', error.message);
                        throw error;
                }

                return data;
        },

        async getTransactionsByMonth(month: number, year: number) {
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
                        .gte('date', firstDay)
                        .lte('date', lastDay) 
                        .order('date', { ascending: false }); // Ordena da mais recente para a mais antiga

                if (error) {
                        console.error('Erro ao obter transações:', error.message);
                        throw error;
                }

                return data;
        }
};