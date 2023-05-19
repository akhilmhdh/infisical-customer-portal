import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from '@/app/config';

const organizationKeys = {
  getOrganizations: ['organizations'] as const,
  getPmtMethods: (organizationId: string) => [{ organizationId }, 'pmt-methods'] as const,
  getCloudPlan: (organizationId: string) => [{ organizationId }, 'cloud-plan'] as const,
  getLicenses: (organizationId: string) => [{ organizationId }, 'licenses'] as const,
  getInvoices: (organizationId: string) => [{ organizationId }, 'invoices'] as const,
  getBillingDetails: (organizationId: string) => [{ organizationId }, 'billing-details'] as const,
  getTaxIds: (organizationId: string) => [{ organizationId }, 'tax-ids'] as const
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
      data: { pmtMethods }
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/billing-details/payment-methods`);
    
    return pmtMethods;
  }
});

export const useAddPmtMethod = () => {
  const queryClient = useQueryClient();

  // TODO: invalidate payment methods

  return useMutation({
    mutationFn: async (organizationId: string ) => {
      const { data: { url } } = await apiRequest.post(`/api/v2/organizations/${organizationId}/billing-details/payment-methods`);
      return url;
    }
  });
};

export const useDeletePmtMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      _id,
    }: {
      organizationId: string;
      _id: string;
    }) => {
      const { data } = await apiRequest.delete(`/api/v2/organizations/${organizationId}/billing-details/payment-methods/${_id}`);
      return data;
    },
    onSuccess(_, dto) {
      queryClient.invalidateQueries(organizationKeys.getPmtMethods(dto.organizationId));
    }
  });
}

export const useGetCloudPlan = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getCloudPlan(organizationId),
  queryFn: async () => {
    const {
      data
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/cloud-plan`)
    
    return data;
  }
});

export const useManageCloudPlans = () => {
  const queryClient = useQueryClient();

  // TODO: invalidate payment methods

  return useMutation({
    mutationFn: async (organizationId: string,) => {
      const { data: { url } } = await apiRequest.post(`/api/v2/organizations/${organizationId}/cloud-plan`);
      return url;
    }
  });
};

export const useGetLicenses = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getLicenses(organizationId),
  queryFn: async () => {
    const {
      data: { licenses }
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/licenses`);
    
    return licenses;
  }
});

export const useGetInvoices = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getInvoices(organizationId),
  queryFn: async () => {
    const {
      data: { invoices }
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/invoices`);
    
    return invoices;
  }
});

export const useGetBillingDetails = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getBillingDetails(organizationId),
  queryFn: async () => {
    const {
      data
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/billing-details`);
    
    return data;
  }
});

export const useUpdateBillingDetails = () => {
  const queryClient = useQueryClient();

  // TODO: invalidate billing info

  return useMutation({
    mutationFn: async ({
      organizationId,
      name,
      email
    }: {
      organizationId: string;
      name?: string;
      email?: string;
    }) => {
      const { data } = await apiRequest.patch(`/api/v2/organizations/${organizationId}/billing-details`, {
        name,
        email
      });
      return data;
    }
  });
};

export const useGetTaxIds = (organizationId: string) => useQuery({
  queryKey: organizationKeys.getTaxIds(organizationId),
  queryFn: async () => {
    const {
      data: { tax_ids }
    } = await apiRequest.get(`/api/v2/organizations/${organizationId}/billing-details/tax-ids`);
    
    return tax_ids;
  }
});

export const useAddTaxId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      type,
      value
    }: {
      organizationId: string;
      type?: string;
      value?: string;
    }) => {
      const { data } = await apiRequest.post(`/api/v2/organizations/${organizationId}/billing-details/tax-ids`, {
        type,
        value
      });
      return data;
    },
    onSuccess(_, dto) {
      queryClient.invalidateQueries(organizationKeys.getTaxIds(dto.organizationId));
    }
  });
};

export const useDeleteTaxId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      _id,
    }: {
      organizationId: string;
      _id: string;
    }) => {
      const { data } = await apiRequest.delete(`/api/v2/organizations/${organizationId}/billing-details/tax-ids/${_id}`);
      return data;
    },
    onSuccess(_, dto) {
      queryClient.invalidateQueries(organizationKeys.getTaxIds(dto.organizationId));
    }
  });
};

export const useUpdateCloudPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      productId
    }: {
      organizationId: string;
      productId: string;
    }) => {
      const { data } = await apiRequest.post(`/api/v2/organizations/${organizationId}/billing-details/cloud-products/${productId}`);
      return data;
    },
    onSuccess(_, dto) {
      queryClient.invalidateQueries(organizationKeys.getCloudPlan(dto.organizationId));
    }
  });
};
