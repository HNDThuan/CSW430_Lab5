export interface TransactionService {
    _id: string;
    name: string;
    price: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    quantity: number;
}

export interface TransactionCustomer {
    _id: string;
    phone: string;
    name: string;
    loyalty: string;
    totalSpent: number;
    status?: string;
    createdBy?: string;
    __v?: number;
}

export interface Transaction {
    _id: string;
    id: string;
    customer: TransactionCustomer;
    services: TransactionService[];
    priceBeforePromotion: number;
    price: number;
    createdBy: {
        _id: string;
        phone: string;
        password?: string;
        name: string;
        __v?: number;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
}
