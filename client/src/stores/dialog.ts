import create from 'zustand';
import { Product } from '../features/product'

interface DialogStore {
    product: Product,
    open: boolean,
    setProduct: (product: Product) => void,
    setOpen: (open: boolean) => void
}

export const useDialogStore = create<DialogStore>((set) => ({
    product: null,
    open: false,
    setProduct: (product) => set({ product }),
    setOpen: (open) => set({ open }),
}));