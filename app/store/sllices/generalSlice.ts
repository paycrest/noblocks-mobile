import { ImmerStateCreator } from "../Store";
import { sliceResetFns } from "../StoreReset";

type AppTheme = "dark" | "light" | "system";

export interface GeneralSliceParams {
  appTheme: AppTheme;
}

export interface GeneralSlice extends GeneralSliceParams {
  setAppTheme: (theme: AppTheme) => void;
}

export const initialGeneralState: GeneralSliceParams = {
  appTheme: "system",
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
  };
};

export const generalState = {
  initial: initialGeneralState,
  slice: generalSlice,
};
