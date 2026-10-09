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
};
