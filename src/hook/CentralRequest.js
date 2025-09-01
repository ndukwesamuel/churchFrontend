import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

// Constants
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}api`;
// const MainapiUrl = import.meta.env.VITE_API_URL;
// const apiUrl = `${MainapiUrl}api`;

// Utility functions
const handleApiError = (error) => {
  const errorData = {
    message: error?.message || "Network Error",
    response: error?.response?.data,
    status: error?.response?.status,
  };

  console.error("API Error:", errorData);
  throw errorData; // More structured error handling
};

// const fetchData = async (url, token) => {
//   try {
//     const response = await axios.get(`${apiUrl}${url}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", {
//       message: error?.message,
//       response: error?.response?.data,
//       status: error?.response?.status,
//     });
//     throw error; // re-throw if you want the caller to handle it too
//   }
// };

const fetchData = async (url, token, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, // Added support for query parameters
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const mutateData = async ({
  url,
  token,
  data,
  method = "POST",
  params = {},
}) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data,
      params, // Added support for query parameters in mutations
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Explicit content type
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
// // const mutateData = async ({ url, token, data, method = "POST" }) => {
// //   try {
// //     const response = await axios({
// //       method,
// //       url: `${apiUrl}${url}`,
// //       data,
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     throw new Error(
// //       error.response?.data?.message ||
// //         "Something went wrong while mutating data"
// //     );
// //   }
// // };

// // Reusable hook for GET requests
// export const useFetchData = (url, queryKey, options = {}) => {
//   const { user } = useSelector((state) => state?.reducer?.AuthSlice);
//   const token = user?.token;
//   return useQuery({
//     queryKey: [queryKey, token],
//     queryFn: () => fetchData(url, token),
//     ...options,
//   });
// };

// // Reusable hook for mutations (POST, PUT, DELETE)
// export const useMutateData = (queryKey, method = "POST") => {
//   const { user } = useSelector((state) => state?.reducer?.AuthSlice);
//   const token = user?.token;
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ url, data }) => mutateData({ url, token, data, method }),
//     onSuccess: () => {
//       queryClient.invalidateQueries([queryKey]);
//     },
//     onError: (error) => {
//       throw error?.response;
//     },
//   });
// };

// Custom hooks
export const useFetchData = (queryKey, url, options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token;

  return useQuery({
    queryKey: [queryKey, token, url, options?.params], // Include params in query key
    queryFn: () => fetchData(url, token, options?.params),
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      return error?.status >= 500 && failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache by default
    ...options,
  });
};

export const useMutateData = (queryKey, method = "POST", options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url, data, params }) =>
      mutateData({ url, token, data, method, params }),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries([queryKey]);

      // Optional: Update cache immediately for optimistic updates
      if (options.updateQueryKey) {
        queryClient.setQueryData([options.updateQueryKey], (oldData) => {
          return options.updateFn ? options.updateFn(oldData, data) : data;
        });
      }
    },
    onError: (error) => {
      // Handle error globally or pass to component
      console.error("Mutation Error:", error);
      if (options.onError) options.onError(error);
    },
    ...options,
  });
};

// // Fetching data with params
// const { data } = useFetchData('users', '/users', {
//   params: { page: 1, limit: 10 },
//   staleTime: 10000 // override default
// });

// // Mutation with optimistic update
// const { mutate } = useMutateData('todos', 'POST', {
//   updateQueryKey: 'todos',
//   updateFn: (oldData, newItem) => [...oldData, newItem],
//   onError: (error) => toast.error(error.message)
// });
