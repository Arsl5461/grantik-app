import create from 'zustand';

interface SocketStore {
    socket: any,
    setSocket: (socket: any) => void,
}

export const useSocketStore = create<SocketStore>((set) => ({
    socket: "",
    setSocket: (socket: any) => set({ socket })
}));