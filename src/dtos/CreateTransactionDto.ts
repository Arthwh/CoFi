import { TransactionFrequency } from "../types/TransactionFrequencyType";
import { TransactionStatus } from "../types/TransactionStatusType";
import { TransactionType } from "../types/TransactionTypeType";

export interface CreateTransactionDto {
        user_id: string;
        type: TransactionType;
        amount: number;
        description: string;
        category_id: string;
        date: string;
        status: TransactionStatus;
        payment_method_id: string;
        frequency: TransactionFrequency;
        installments: number | null;
        payee: string | null;
        tags: string[] | null;
        ignore_in_dashboard: boolean;
        notes: string | null;
        notify_me: boolean;
        days_before_notify: number | null;
}