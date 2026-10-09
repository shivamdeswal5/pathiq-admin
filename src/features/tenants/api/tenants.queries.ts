import { useQuery } from '@tanstack/react-query';
import { tenantsService } from './tenants.service';
import { AdminTenantListItem } from '@/types/admin';

export const TENANTS_QUERY_KEY = ['admin', 'tenants'];

export function useTenantsQuery() {
  return useQuery<AdminTenantListItem[], Error>({
    queryKey: TENANTS_QUERY_KEY,
    queryFn: tenantsService.getTenants,
  });
}
