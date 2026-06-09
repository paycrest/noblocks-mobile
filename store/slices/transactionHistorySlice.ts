import type {
  StoredTransaction,
  TransactionUiStatus,
  UpsertTransactionInput,
} from "@/lib/transactions/types";
import { ImmerStateCreator } from "../Store";
import { sliceResetFns } from "../StoreReset";

export interface TransactionHistorySliceParams {
  transactions: StoredTransaction[];
}

export interface TransactionHistorySlice extends TransactionHistorySliceParams {
  upsertTransaction: (input: UpsertTransactionInput) => void;
  updateTransactionStatus: (
    id: string,
    paycrestStatus: string,
    status: TransactionUiStatus,
  ) => void;
}

export const initialTransactionHistoryState: TransactionHistorySliceParams = {
  transactions: [],
};

function parseAmount(value?: string): number {
  const parsed = Number.parseFloat(value?.trim() ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildStoredTransaction(
  input: UpsertTransactionInput,
): StoredTransaction {
  return {
    id: input.id,
    amountUSD: parseAmount(input.amount),
    amountFiat: parseAmount(input.fiatEstimate),
    fiatCurrency: input.fiatCurrency.trim().toUpperCase(),
    status: input.status ?? "Ongoing",
    paycrestStatus: input.paycrestStatus,
    date: new Date().toISOString(),
    token: input.token.trim().toUpperCase(),
    recipientName: input.recipientName?.trim() || undefined,
    institutionName: input.institutionName?.trim() || undefined,
    accountNumber: input.accountNumber?.trim() || undefined,
    memo: input.memo?.trim() || undefined,
    network: input.network?.trim().toLowerCase() || undefined,
  };
}

export const transactionHistorySlice: ImmerStateCreator<
  TransactionHistorySlice
> = (set) => {
  sliceResetFns.add(() => set(initialTransactionHistoryState));

  return {
    ...initialTransactionHistoryState,
    upsertTransaction(input) {
      set((state) => {
        const next = buildStoredTransaction(input);
        const existingIndex = state.transactions.findIndex(
          (tx) => tx.id === input.id,
        );

        if (existingIndex >= 0) {
          state.transactions[existingIndex] = {
            ...state.transactions[existingIndex],
            ...next,
            date: state.transactions[existingIndex].date,
          };
          return;
        }

        state.transactions.unshift(next);
      });
    },
    updateTransactionStatus(id, paycrestStatus, status) {
      set((state) => {
        const existing = state.transactions.find((tx) => tx.id === id);
        if (!existing) {
          return;
        }

        existing.paycrestStatus = paycrestStatus;
        existing.status = status;
      });
    },
  };
};

export const transactionHistoryState = {
  initial: initialTransactionHistoryState,
  slice: transactionHistorySlice,
};
