import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from '@/app/config';

const organizationKeys = {
    getOrganizations: ['organizations'] as const,
    getPmtMethods: (organizationId: string) => [{ organizationId }, 'pmt-methods'] as const,
    getCloudPlans: (organizationId: string) => [{ organizationId }, 'cloud-plans'] as const
};

export const useGetOrganizations = () => useQuery({ 
  queryKey: organizationKeys.getOrganizations, 
  queryFn: async () => {
    const { 
      data: { organizations } 
    } = await apiRequest.get('/api/v2/organizations');
    return organizations;
  }
});

export const useGetPmtMethods = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getPmtMethods(organizationId),
  queryFn: async () => {
    const {
      data: { paymentMethods }
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/payment-methods`);
    
    return paymentMethods;
  }
});

export const useAddPmtMethod = () => {
  const queryClient = useQueryClient();

  // TODO: invalidate payment methods

  return useMutation({
    mutationFn: async (organizationId: string ) => {
      const { data: { url } } = await apiRequest.post(`/api/v2/organizations/${organizationId}/payment-methods`);
      return url;
    }
  });
};

export const useGetCloudSubs = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getCloudPlans(organizationId),
  queryFn: async () => {
    const {
      data: { cloudPlans }
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/cloud-subs`)
    
    return cloudPlans;
  }
});

export const useManageCloudSubs = () => {
  const queryClient = useQueryClient();

  // TODO: invalidate payment methods

  return useMutation({
    mutationFn: async (organizationId: string,) => {
      const { data: { url } } = await apiRequest.post(`/api/v2/organizations/${organizationId}/cloud-subs`);
      return url;
    }
  });
};