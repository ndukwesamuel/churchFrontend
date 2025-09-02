import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

const apiUrl = import.meta.env.VITE_API_URL;

// const apiUrl = "https://remicommerc.onrender.com";
type Token = string | undefined;
type FetchDataResponse = any;
type MutateDataPayload = {
  url: string;
  token: Token;
  data?: any;
  method?: string;
};
type MutateDataResponse = any;

const fetchData = async (
  url: string,
  token: Token
): Promise<FetchDataResponse> => {
  try {
    const response = await axios.get(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", {
      response: error?.response?.data,
    });
    throw error;
  }
};

const mutateData = async ({
  url,
  token,
  data,
  method = "POST",
}: MutateDataPayload): Promise<MutateDataResponse> => {
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
  } catch (error: any) {
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

export const useFetchData = (
  url: string,
  queryKey: string,
  options: Record<string, any> = {}
): ReturnType<typeof useQuery> => {
  const { user } = useSelector((state: any) => state?.reducer?.AuthSlice);
  const token: Token = user?.data?.token;
  return useQuery({
    queryKey: [queryKey, token],
    queryFn: () => fetchData(url, token),
    retry: 2,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

// Reusable hook for mutations (POST, PUT, DELETE)
export const useMutateData = (queryKey: string, method: string = "POST") => {
  const { user } = useSelector((state: any) => state?.reducer?.AuthSlice);
  const token: Token = user?.data?.token;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ url, data }: { url: string; data?: any }) =>
      mutateData({ url, token, data, method }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, token] });
    },
  });
  return {
    ...mutation,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
