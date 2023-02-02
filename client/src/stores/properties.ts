import create from "zustand";
import { Euler, Vector3 } from "@react-three/fiber";
import { getProducts } from '../features/builder/api/getProducts';
import { Product } from '../features/product';

export interface Property {
  id: string;
  url?: string;
  mode: string;
  product?: Product;
  textObj?: any;
  position?: Vector3;
  rotation?: Euler;
  scale?: Vector3;
}

interface PropertyStore {
  properties: Property[];
  products: Product[],
  getProducts: () => void,
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  products: [],
  getProducts: async () => {
    const response: any = await getProducts();
    set({ products: response })
  },
  addProperty: (property) =>
    set((state) => ({
      properties: [...state.properties, property],
    })),
  updateProperty: (newProperty) =>
    set((state) => ({
      properties: state.properties.reduce((arr, property) => {
        return newProperty.id === property.id
          ? [...arr, newProperty]
          : [...arr, property];
      }, []),
    })),
  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((property) => property.id !== id),
    })),
}));
