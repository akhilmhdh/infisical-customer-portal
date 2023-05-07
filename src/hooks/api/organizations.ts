import { useQuery } from "@tanstack/react-query";
import { apiRequest } from '@/config';

const organizationKeys = {
    getOrganizations: ['organizations'] as const,
    getOrganizationPmtMethods: (organizationId: string) => [{ organizationId }, 'organization-pmt-method'] as const
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

export const useGetOrganizationPmtMethods = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getOrganizationPmtMethods(organizationId),
  queryFn: async () => {
    const {
      data
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/payment-method`);
    
    console.log('data: ', data);
    return data;
  }
});
