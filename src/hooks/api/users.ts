import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from '@/app/config';

const userKeys = {
  getCurrentUser: ['currentUser'] as const
}

export const useGetCurrentUser = () => useQuery({ 
  queryKey: userKeys.getCurrentUser, 
  queryFn: async () => {
    const { 
      data: { user } 
    } = await apiRequest.get('/api/v2/users/me');
    return user;
  }
});

export const useLogoutUser = () => {
    const queryClient = useQueryClient();
  
    // TODO: invalidate everything
  
    return useMutation({
      mutationFn: async () => {
        const { data } = await apiRequest.post(`/api/v2/auth/expire`);
        return data;
      },
      onSuccess(_, dto) {
        queryClient.invalidateQueries(userKeys.getCurrentUser);
      }
    });
  };