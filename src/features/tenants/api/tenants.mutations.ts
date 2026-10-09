import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsService } from './tenants.service';
import { TENANTS_QUERY_KEY } from './tenants.queries';
import { PAYMENTS_QUERY_KEY } from '@/features/payments/api/payments.queries';
import { AdminCreateTenantDto, AdminCreateTenantResponse } from '@/types/admin';

export function useCreateTenantMutation() {
  const queryClient = useQueryClient();

  return useMutation<AdminCreateTenantResponse, Error, AdminCreateTenantDto>({
    mutationFn: tenantsService.createTenant,
    onSuccess: () => {
      // Invalidate both tenants list and payment ledger if activated
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
}
