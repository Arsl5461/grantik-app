import create from 'zustand';

interface ModelStore {
    target: any,
    mode: number,
    setTarget: (target: any) => void,
    setMode: (mode: number) => void
}

export const useModelStore = create<ModelStore>((set) => ({
    target: null,
    mode: 0,
    setTarget: (target: any) => set({ target }),
    setMode: (mode: any) => set({ mode }),
}));