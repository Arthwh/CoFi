// Formata para Real Brasileiro (R$)
export const formatCurrencyToBRL = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};