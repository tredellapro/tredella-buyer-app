import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ViewMode = "retail" | "wholesale" | "royal";

interface ViewModeState {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set) => ({
      mode: "retail",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "view-mode-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
