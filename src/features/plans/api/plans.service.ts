import { apiClient } from '@/lib/api-client';
import { AdminPlanItem, AdminUpdatePlanDto } from '@/types/admin';

export const plansService = {
  getPlans: async (): Promise<AdminPlanItem[]> => {
    const res = await apiClient.get<AdminPlanItem[]>('/billing/admin/plans');
    return res.data;
  },

  updatePlan: async (
    id: string,
    dto: AdminUpdatePlanDto,
  ): Promise<AdminPlanItem> => {
    const res = await apiClient.patch<AdminPlanItem>(
      `/billing/admin/plans/${id}`,
      dto,
    );
    return res.data;
  },
};
