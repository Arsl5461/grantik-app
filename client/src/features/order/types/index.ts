import { Product } from '../../product/types';

export interface Order {
    _id: string,
    id: string,
    orderId: string,
    paymentType: string,
    products: Product[],
    termsCondition: boolean,
    payerId: string;
    contactName: string;
    contactSurename: string,
    address: string,
    regionNumber: string,
    country: string,
    city: string,
    phone: string,
    email: string,
    amount: number;
    deliveried: boolean,
    created_at: number,
}