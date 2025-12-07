import { create } from "zustand";

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo")) || {},
  isLoading: false,
  signIn: (data) => set((state) => ({ user: data })),
  signOut: () => set({ user: {} }),
  setIsLoading: (val) => set((state) => ({ isLoading: val })),
  
}));

export default useStore;