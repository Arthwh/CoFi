import { Ionicons } from "@expo/vector-icons";

export interface PaymentMethod {
        id: string;
        name: string;
        icon: keyof typeof Ionicons | string;
        color: string;
}