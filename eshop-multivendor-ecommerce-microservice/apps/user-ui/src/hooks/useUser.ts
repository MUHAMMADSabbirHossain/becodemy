import axiosInstance from '@/utils/axios-instance';
import { useQuery } from '@tanstack/react-query';

// Fetch user data from API
const fetchUser = async () => {
  const response = await axiosInstance.get('/api/logged-in-user');

  return response.data.user;
};

const useUser = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return {
    user: data,
    isPending,
    isError,
    refetch,
  };
};

export default useUser;
