import Toast from 'react-native-toast-message';
import { AppToast } from './toast';

export function handleError(error: unknown, customMessage?: string) {
        console.error("Erro:", error);

        let description = "Ocorreu um erro inesperado. Tente novamente mais tarde.";

        if (error instanceof Error) {
                if (error.message.includes('network')) {
                        description = "Sem conexão com a internet.";
                } else if (error.message.includes('AuthApiError')) {
                        description = "Credenciais inválidas.";
                } else {
                        description = error.message;
                }
        }

        AppToast.error(customMessage || 'Ops! Algo deu errado', description);
}