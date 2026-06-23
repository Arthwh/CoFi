import { supabase } from "../lib/supabase";

export const paymentMethodService = {
        async getPaymentMethods() {
                const { data, error } = await supabase
                        .from('payment_methods') //Tabela
                        .select('*');

                if (error) {
                        console.error('Erro ao obter métodos de pagamento:', error.message);
                        throw error;
                }
                console.log("payment_methods")
                console.log(data)

                return data;
        }
}