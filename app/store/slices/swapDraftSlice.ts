import { ImmerStateCreator } from "../Store";
import { sliceResetFns } from "../StoreReset";

export interface SwapDraftAsset {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
}

export interface SwapDraftSliceParams {
  swapDraftAmount: string;
  swapDraftAsset: SwapDraftAsset | null;
}

export interface SwapDraftSlice extends SwapDraftSliceParams {
  setSwapDraftAmount: (amount: string) => void;
  setSwapDraftAsset: (asset: SwapDraftAsset | null) => void;
  clearSwapDraft: () => void;
}

const initialSwapDraftState: SwapDraftSliceParams = {
  swapDraftAmount: "",
  swapDraftAsset: null,
};

const swapDraftSlice: ImmerStateCreator<SwapDraftSlice> = (set) => {
  sliceResetFns.add(() => set(initialSwapDraftState));

  return {
    ...initialSwapDraftState,
    setSwapDraftAmount(amount) {
      set((state) => {
        state.swapDraftAmount = amount;
      });
    },
    setSwapDraftAsset(asset) {
      set((state) => {
        state.swapDraftAsset = asset;
      });
    },
    clearSwapDraft() {
      set((state) => {
        state.swapDraftAmount = "";
        state.swapDraftAsset = null;
      });
    },
  };
};

export const swapDraftState = {
  initial: initialSwapDraftState,
  slice: swapDraftSlice,
};
