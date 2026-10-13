import { useQuery } from '@tanstack/react-query';
import { plansService } from './plans.service';
import { AdminPlanItem } from '@/types/admin';

export const ADMIN_PLANS_QUERY_KEY = ['admin-plans'] as const;

export function useAdminPlansQuery() {
  return useQuery<AdminPlanItem[], Error>({
    queryKey: ADMIN_PLANS_QUERY_KEY,
    queryFn: plansService.getPlans,
    staleTime: 60 * 1000,
  });
}
