import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedBeneficiary = {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  institutionCode: string;
  currencyCode: string;
};

const STORAGE_KEY = "noblocks:beneficiaries";

function createBeneficiaryId() {
  return `beneficiary-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getSavedBeneficiaries(): Promise<SavedBeneficiary[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as SavedBeneficiary[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveBeneficiary(
  beneficiary: Omit<SavedBeneficiary, "id">,
): Promise<SavedBeneficiary> {
  const existing = await getSavedBeneficiaries();
  const duplicate = existing.find(
    (entry) =>
      entry.accountNumber === beneficiary.accountNumber &&
      entry.institutionCode === beneficiary.institutionCode,
  );

  if (duplicate) {
    return duplicate;
  }

  const saved: SavedBeneficiary = {
    id: createBeneficiaryId(),
    ...beneficiary,
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([saved, ...existing]),
  );

  return saved;
}
