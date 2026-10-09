import { useQuery } from '@tanstack/react-query';
import { paymentsService } from './payments.service';
import { AdminGetPaymentsResponse } from '@/types/admin';

export const PAYMENTS_QUERY_KEY = ['admin', 'payments'];

export function usePaymentsQuery(limit: number = 100, offset: number = 0) {
  return useQuery<AdminGetPaymentsResponse, Error>({
    queryKey: [...PAYMENTS_QUERY_KEY, limit, offset],
    queryFn: () => paymentsService.getPayments(limit, offset),
  });
}
