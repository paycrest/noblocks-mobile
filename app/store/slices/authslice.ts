import { PrivyUser } from "@privy-io/expo";
import { pick } from "lodash";
import { ImmerStateCreator } from "../Store";
import { sliceResetFns } from "../StoreReset";

export interface AuthSliceParams {
  user: PrivyUser | null;
}

export interface AuthSlice extends AuthSliceParams {
  saveUserInfo: (user: any) => void;
  updateUserInfo: (user: any, override?: boolean) => void;
}

const initialAuthState = {
  user: null,
};

const authSlice: ImmerStateCreator<AuthSlice> = (set) => {
  sliceResetFns.add(() => set(initialAuthState));
  return {
    ...initialAuthState,
    saveUserInfo: (user: any) => set(() => ({ user })),
    updateUserInfo: (user: any, override?: boolean) =>
      set((state) => ({
        user: override
          ? { ...user, ...pick(state?.user, ["token", "hasPermanentToken"]) }
          : {
              ...state.user,
              ...user,
            },
      })),
  };
};

export const authState = {
  initial: initialAuthState,
  slice: authSlice,
};
