import { apiClient } from '@/lib/api-client';
import {
  AdminTenantListItem,
  AdminCreateTenantDto,
  AdminCreateTenantResponse,
} from '@/types/admin';

export const tenantsService = {
  getTenants: async (): Promise<AdminTenantListItem[]> => {
    const res = await apiClient.get<AdminTenantListItem[]>('/billing/admin/tenants');
    return res.data;
  },

  createTenant: async (
    dto: AdminCreateTenantDto,
  ): Promise<AdminCreateTenantResponse> => {
    const res = await apiClient.post<AdminCreateTenantResponse>(
      '/billing/admin/tenants',
      dto,
    );
    return res.data;
  },

  extendTrial: async (
    labId: string,
    days: number,
    reason?: string,
  ): Promise<import('@/types/admin').ExtendTrialResponse> => {
    const res = await apiClient.post<import('@/types/admin').ExtendTrialResponse>(
      `/billing/admin/tenants/${labId}/extend-trial`,
      { days, reason },
    );
    return res.data;
  },

  toggleTenantStatus: async (
    labId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'LOCKED',
    reason?: string,
  ): Promise<import('@/types/admin').ToggleTenantStatusResponse> => {
    const res = await apiClient.patch<import('@/types/admin').ToggleTenantStatusResponse>(
      `/billing/admin/tenants/${labId}/status`,
      { status, reason },
    );
    return res.data;
  },

  impersonateTenant: async (
    labId: string,
  ): Promise<import('@/types/admin').AdminImpersonateResponse> => {
    const res = await apiClient.post<import('@/types/admin').AdminImpersonateResponse>(
      `/billing/admin/tenants/${labId}/impersonate`,
    );
    return res.data;
  },

  purgeTestData: async (
    labId: string,
  ): Promise<import('@/types/admin').AdminPurgeTestDataResponse> => {
    const res = await apiClient.post<import('@/types/admin').AdminPurgeTestDataResponse>(
      `/billing/admin/tenants/${labId}/purge-test-data`,
      { confirmation: 'PURGE' },
    );
    return res.data;
  },
};
