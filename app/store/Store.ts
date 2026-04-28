import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { AuthSlice, authState } from "./slices/authslice";
import { GeneralSlice, generalState } from "./slices/generalSlice";
import { SwapDraftSlice, swapDraftState } from "./slices/swapDraftSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { sliceResetFns } from "./StoreReset";

interface RootState {
  _hasHydrated: boolean;
  _firstLaunch: boolean;
  setLaunchState: (value: boolean) => void;
  logoutAndClearState: () => void;
}

export type StoreState = RootState & GeneralSlice & AuthSlice & SwapDraftSlice;

export type ImmerStateCreator<T> = StateCreator<
  T,
  [["zustand/immer", never], never],
  [],
  T
>;

export const createStoreWithSelectors =
  <T extends StoreState>(store: UseBoundStore<StoreApi<T>>) =>
  <K extends keyof T>(keys: K[]) => {
    return store(
      useShallow((state) =>
        keys.reduce(
          (selected, key) => {
            selected[key] = state[key];
            return selected;
          },
          {} as { [P in K]: T[P] },
        ),
      ),
    );
  };

export const boundStore = create<StoreState>()(
  persist(
    subscribeWithSelector(
      immer<StoreState>((setState: any, getState: any, store: any) => ({
        _hasHydrated: false,
        _firstLaunch: false,
        setLaunchState: (value: boolean) => {
          setState((state: { _firstLaunch: boolean }) => {
            state._firstLaunch = value;
          });
        },
        logoutAndClearState: () => {
          sliceResetFns.forEach((resetFn) => {
            resetFn();
          });
        },
        ...generalState.slice(setState, getState, store),
        ...authState.slice(setState, getState, store),
        ...swapDraftState.slice(setState, getState, store),
      })),
    ),
    {
      name: "noblocks-storage",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useBoundStore.setState({
          _hasHydrated: true,
          _firstLaunch: true,
        });
      },
    },
  ),
);

export const useBoundStore = boundStore;

export const useSelector = createStoreWithSelectors(boundStore);
