import type { TransactionUiStatus } from "@/lib/transactions/types";

const COMPLETED_STATUSES = new Set(["settled", "validated"]);
const FAILED_STATUSES = new Set(["failed", "expired", "refunded"]);

export function mapPaycrestStatusToUi(
  status?: string | null,
): TransactionUiStatus {
  const normalized = status?.trim().toLowerCase();

  if (!normalized) {
    return "Ongoing";
  }

  if (COMPLETED_STATUSES.has(normalized)) {
    return "Completed";
  }

  if (FAILED_STATUSES.has(normalized)) {
    return "Failed";
  }

  return "Ongoing";
}
