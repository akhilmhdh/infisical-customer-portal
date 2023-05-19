import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from '@/app/config';

const cloudPlanKeys = {
  getCloudPlans: (billingCycle: 'monthly' | 'yearly') => [{ billingCycle }, 'cloud-plans'] as const,
};

export const useGetCloudPlans = (billingCycle: 'monthly' | 'yearly') => useQuery({
    queryKey: cloudPlanKeys.getCloudPlans(billingCycle),
    queryFn: async () => {
      const {
        data
      } = await apiRequest.get(`/api/v2/cloud-products?billing-cycle=${billingCycle}`);
      
      return data;
    }
  });