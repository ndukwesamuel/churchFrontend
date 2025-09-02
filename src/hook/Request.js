import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

const apiUrl = import.meta.env.VITE_API_URL;

const fetchData = async (url, token) => {
  try {
    const response = await axios.get(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const mutateData = async ({ url, token, data, method = "POST" }) => {
  try {
    const response = await axios({
      method,
      url: `${apiUrl}${url}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while mutating data",
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};

export const useFetchData = (url, queryKey, options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.data?.token;
  return useQuery({
    queryKey: [queryKey, token],
    queryFn: () => fetchData(url, token),
    retry: 2,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useMutateData = (queryKey, method = "POST") => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.data?.token;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ url, data }) => mutateData({ url, token, data, method }),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
    },
  });
  return {
    ...mutation,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
