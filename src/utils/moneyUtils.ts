// Formata para Real Brasileiro (R$)
export const formatCurrencyToBRL = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatAmountToString = (amount: string) => {
        return (Number(amount) / 100).toFixed(2).replace('.', ',');
}