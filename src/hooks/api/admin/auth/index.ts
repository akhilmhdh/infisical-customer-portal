import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from '@/app/config';

export const useAdminLogin = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: async ({
            email,
            password
        }: {
            email: string;
            password: string;
        }) => {
            const { data } = await apiRequest.post(`/api/v2/admin/auth/login`, {
                email,
                password
            });
        
            return data;
        }
    });
};