import { supabase } from "../lib/supabase";

export const categoryService = {
        async getCategories() {
                const { data, error } = await supabase
                        .from('categories') // Tabela
                        .select();

                if (error) {
                        throw error;
                }

                return data;
        }
}