export interface Customer {
    _id: string;
    phone: string;
    name: string;
    loyalty: string;
    totalSpent: number;
    createdBy?: string;
    updatedBy?: string;
    status?: string;
    __v?: number;
}
