import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from '@/app/config';

export const useLogoutUser = () => {
    const queryClient = useQueryClient();
  
    // TODO: invalidate everything
  
    return useMutation({
      mutationFn: async () => {
        console.log('logout 1'); 
        const { data } = await apiRequest.post(`/api/v2/auth/expire`);
        console.log('logout 2, data: ', data); 
        return data;
      }
    });
  };