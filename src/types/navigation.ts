export type RootStackParamList = {
        Home: undefined;
        Extrato: undefined;
        Adicionar: { transactionToEdit?: any } | undefined;
        Dashboard: undefined;
        Perfil: undefined;
};

// Injeta globalmente os tipos no useNavigation() do app
declare global {
        namespace ReactNavigation {
                interface RootParamList extends RootStackParamList { }
        }
}