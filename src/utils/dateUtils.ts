export interface DateInfo {
        day: number;
        monthNumber: number;        // Mês real (1 a 12) para usar no Supabase
        monthFormatted: string;     // Mês com zero à esquerda ("01", "06", "11")
        monthName: string;          // Nome por extenso ("Janeiro", "Junho")
        year: number;
}

const MESES_ANO = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const dateUtils = {
        parseDateData(inputDate?: string | Date): DateInfo {
                let dateObj: Date;

                if (!inputDate) {
                        // Se não passar nada, pega a data atual do sistema
                        dateObj = new Date();
                } else if (inputDate instanceof Date) {
                        dateObj = inputDate;
                } else {
                        // Se for string, verifica o formato
                        if (inputDate.includes('-')) {
                                // Formato SQL: YYYY-MM-DD
                                const [ano, mes, dia] = inputDate.split('-').map(Number);
                                dateObj = new Date(ano, mes - 1, dia);
                        } else if (inputDate.includes('/')) {
                                // Formato BR: DD/MM/YYYY
                                const [dia, mes, ano] = inputDate.split('/').map(Number);
                                dateObj = new Date(ano, mes - 1, dia);
                        } else {
                                dateObj = new Date(inputDate);
                        }
                }

                // Extrai os dados do objeto Date
                const day = dateObj.getDate();
                const monthNumber = dateObj.getMonth() + 1; // getMonth() vai de 0 a 11
                const year = dateObj.getFullYear();

                const monthFormatted = String(monthNumber).padStart(2, '0');
                const monthName = MESES_ANO[monthNumber - 1];

                return {
                        day,
                        monthNumber,
                        monthFormatted,
                        monthName,
                        year
                };
        },

        now() {
                return new Date().toISOString()
        },

        currentDate() {
                return new Date().toLocaleDateString('pt-BR')
        },

        formatDateToNamedFormat(data: string) {
                return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        },

        //Formata YYYY-MM-DD para DD/MM/YYYY 
        formatDateFromDashToSlash(data: string) {
                return data.split('-').reverse().join('/')
        },

        //Formata DD/MM/YYYY para YYYY-MM-DD  
        formatDateFromSlashToDash(data: string) {
                return data.split('/').reverse().join('-')
        }
}