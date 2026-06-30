import { TransactionFrequency } from "../types/TransactionFrequencyType";
import { TransactionStatus } from "../types/TransactionStatusType";
import { TransactionType } from "../types/TransactionTypeType";
import { Category } from "../dtos/CategoryDto"
import { PaymentMethod } from "./PaymentMethodDto";

export interface Transaction {
        id: string;
        user_id: string;
        type: TransactionType;
        amount: number;
        description: string;
        category_id: string;
        category: Category;
        date: string;
        status: TransactionStatus;
        payment_method_id: string;
        paymentMethod: PaymentMethod;
        frequency: TransactionFrequency;
        installments: number | null;
        payee: string | null;
        tags: string[] | null;
        ignore_in_dashboard: boolean;
        notes: string | null;
        notify_me: boolean;
        days_before_notify: number | null;
        created_at: string;
        updated_at: string | null;
        deleted_at: string | null;
}