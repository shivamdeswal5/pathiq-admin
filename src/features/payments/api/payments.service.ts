import { apiClient } from '@/lib/api-client';
import {
  AdminGetPaymentsResponse,
  ManualActivationPayload,
  ManualActivationResponse,
} from '@/types/admin';

export const paymentsService = {
  getPayments: async (limit: number = 100, offset: number = 0): Promise<AdminGetPaymentsResponse> => {
    const res = await apiClient.get<AdminGetPaymentsResponse>('/billing/admin/payments', {
      params: { limit, offset },
    });
    return res.data;
  },

  manualActivation: async (
    payload: ManualActivationPayload,
  ): Promise<ManualActivationResponse> => {
    const res = await apiClient.post<ManualActivationResponse>(
      '/billing/admin/manual-activation',
      payload,
    );
    return res.data;
  },
};
