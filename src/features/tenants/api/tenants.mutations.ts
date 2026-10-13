import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsService } from './tenants.service';
import { TENANTS_QUERY_KEY } from './tenants.queries';
import { PAYMENTS_QUERY_KEY } from '@/features/payments/api/payments.queries';
import {
  AdminCreateTenantDto,
  AdminCreateTenantResponse,
  ExtendTrialPayload,
  ExtendTrialResponse,
  ToggleTenantStatusPayload,
  ToggleTenantStatusResponse,
} from '@/types/admin';

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

export function useExtendTrialMutation() {
  const queryClient = useQueryClient();

  return useMutation<ExtendTrialResponse, Error, ExtendTrialPayload>({
    mutationFn: ({ labId, days, reason }) =>
      tenantsService.extendTrial(labId, days, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },
  });
}

export function useToggleTenantStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<ToggleTenantStatusResponse, Error, ToggleTenantStatusPayload>({
    mutationFn: ({ labId, status, reason }) =>
      tenantsService.toggleTenantStatus(labId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },
  });
}

export function useImpersonateTenantMutation() {
  return useMutation<import('@/types/admin').AdminImpersonateResponse, Error, string>({
    mutationFn: (labId: string) => tenantsService.impersonateTenant(labId),
  });
}

export function usePurgeTestDataMutation() {
  const queryClient = useQueryClient();

  return useMutation<import('@/types/admin').AdminPurgeTestDataResponse, Error, string>({
    mutationFn: (labId: string) => tenantsService.purgeTestData(labId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },
  });
}
