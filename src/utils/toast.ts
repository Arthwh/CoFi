import Toast from 'react-native-toast-message';

export const AppToast = {
        success: (title: string, message?: string) => {
                Toast.show({
                        type: 'success',
                        text1: title,
                        text2: message,
                        position: 'bottom',
                        visibilityTime: 3000, // Tempo que fica na tela (3 segundos)
                });
        },
        error: (title: string, message?: string) => {
                Toast.show({
                        type: 'error',
                        text1: title,
                        text2: message,
                        position: 'bottom',
                        visibilityTime: 4000,
                });
        },
        info: (title: string, message?: string) => {
                Toast.show({
                        type: 'info',
                        text1: title,
                        text2: message,
                        position: 'bottom',
                        visibilityTime: 3500,
                });
        },
};