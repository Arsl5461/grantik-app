import create from 'zustand';

interface CurrentPropertyStore {
    currentPropertyId: string,
    setCurrentPropertyId: (currentPropertyId: string) => void,
}

export const useCurrentPropertyStore = create<CurrentPropertyStore>((set) => ({
    currentPropertyId: "",
    setCurrentPropertyId: (currentPropertyId: string) => set({ currentPropertyId })
}));