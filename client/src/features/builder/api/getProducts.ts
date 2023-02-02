import { axios } from '../../../lib/axios';
import { Product } from '../../product';

interface Photo {
    _id: string;
    imageUrl: string;
    author: string;
}

export const getProducts = (): Promise<Product> => {
    return axios.get("/products");
}