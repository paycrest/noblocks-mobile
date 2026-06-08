import {
  getSavedBeneficiaries,
  saveBeneficiary,
  type SavedBeneficiary,
} from "@/lib/beneficiaries/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BENEFICIARIES_QUERY_KEY = ["beneficiaries"] as const;

export function useBeneficiaries() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: BENEFICIARIES_QUERY_KEY,
    queryFn: getSavedBeneficiaries,
  });

  const saveMutation = useMutation({
    mutationFn: saveBeneficiary,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BENEFICIARIES_QUERY_KEY });
    },
  });

  return {
    beneficiaries: query.data ?? [],
    isLoading: query.isLoading,
    saveBeneficiary: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}

export type { SavedBeneficiary };
