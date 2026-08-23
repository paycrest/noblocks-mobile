export type TransactionUiStatus = "Completed" | "Ongoing" | "Failed";

export interface StoredTransaction {
  id: string;
  amountUSD: number;
  amountFiat: number;
  fiatCurrency: string;
  status: TransactionUiStatus;
  paycrestStatus?: string;
  date: string;
  token: string;
  recipientName?: string;
  institutionName?: string;
  accountNumber?: string;
  memo?: string;
  network?: string;
}

export interface UpsertTransactionInput {
  id: string;
  amount: string;
  token: string;
  fiatCurrency: string;
  fiatEstimate?: string;
  recipientName?: string;
  institutionName?: string;
  accountNumber?: string;
  memo?: string;
  network?: string;
  status?: TransactionUiStatus;
  paycrestStatus?: string;
}
