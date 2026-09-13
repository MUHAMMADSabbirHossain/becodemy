import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

// Fetch user data from API
const fetchSeller = async () => {
  const response = await axiosInstance.get('/api/logged-in-seller');

  return response.data.data;
};

const useSeller = () => {
  const {
    data: seller,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['seller'],
    queryFn: fetchSeller,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return {
    seller,
    isPending,
    isError,
    refetch,
  };
};

export default useSeller;
