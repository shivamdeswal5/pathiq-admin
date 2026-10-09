import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from './payments.service';
import { PAYMENTS_QUERY_KEY } from './payments.queries';
import { TENANTS_QUERY_KEY } from '@/features/tenants/api/tenants.queries';
import { ManualActivationPayload, ManualActivationResponse } from '@/types/admin';

export function useManualActivationMutation() {
  const queryClient = useQueryClient();

  return useMutation<ManualActivationResponse, Error, ManualActivationPayload>({
    mutationFn: paymentsService.manualActivation,
    onSuccess: () => {
      // Invalidate both tenants list and payments ledger
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
}
