import create from 'zustand';
import { Product } from '../features/product'

interface CheckoutStore {
    products: Product[],
    show: boolean,
    addProduct: (product: Product) => void,
    setShow: (show: boolean) => void,
    updateProduct: (product: Product) => void,
    removeProduct: (product_id: string) => void,
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
    products: [],
    show: false,
    addProduct: (newProduct) => set((state) => ({ products: [...state.products.filter((product) => product._id !== newProduct._id), newProduct] })),
    removeProduct: (product_id) => set((state) => ({
        products: state.products.filter((product) => product._id !== product_id)
    })),
    updateProduct: (newProduct) => set(state => ({ products: [...state.products.reduce((arr, product) => product._id === newProduct._id ? [...arr, newProduct] : [...arr, product], [])] })),
    setShow: (show) => set({ show }),
}));