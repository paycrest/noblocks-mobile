import { ImmerStateCreator } from "../Store";
import { sliceResetFns } from "../StoreReset";

type AppTheme = "dark" | "light" | "system";

export interface GeneralSliceParams {
  appTheme: AppTheme;
  newInstall: boolean;
}

export interface GeneralSlice extends GeneralSliceParams {
  setAppTheme: (theme: AppTheme) => void;
  setNewInstall: (newInstall: boolean) => void;
}

export const initialGeneralState: GeneralSliceParams = {
  appTheme: "system",
  newInstall: true,
};

export const generalSlice: ImmerStateCreator<GeneralSlice> = (set, get) => {
  sliceResetFns.add(() => set(initialGeneralState));
  return {
    ...initialGeneralState,
    setAppTheme(theme) {
      set((state) => {
        state.appTheme = theme;
      });
    },
    setNewInstall(newInstall) {
      set((state) => {
        state.newInstall = newInstall;
      });
    },
  };
};

export const generalState = {
  initial: initialGeneralState,
  slice: generalSlice,
};
