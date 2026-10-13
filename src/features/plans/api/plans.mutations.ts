import { useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService } from './plans.service';
import { ADMIN_PLANS_QUERY_KEY } from './plans.queries';
import { AdminPlanItem, AdminUpdatePlanDto } from '@/types/admin';

interface UpdatePlanMutationParams {
  id: string;
  dto: AdminUpdatePlanDto;
}

export function useUpdatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation<AdminPlanItem, Error, UpdatePlanMutationParams>({
    mutationFn: ({ id, dto }) => plansService.updatePlan(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PLANS_QUERY_KEY });
    },
  });
}
