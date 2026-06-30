import { supabase } from "../lib/supabase";

export const paymentMethodService = {
        async getPaymentMethods() {
                const { data, error } = await supabase
                        .from('payment_methods') //Tabela
                        .select('*');

                if (error) {
                        throw error;
                }

                return data;
        }
}