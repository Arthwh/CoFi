import { TransactionStatus } from "../types/TransactionStatusType";

export interface UpdateTransactionDto {
        description: string;
        amount: number;
        category_id: string;
        payment_method_id: string;
        status: TransactionStatus;
        payee: string | null;
        tags: string[] | null;
        ignore_in_dashboard: boolean;
        notify_me: boolean;
        days_before_notify: number | null;
}