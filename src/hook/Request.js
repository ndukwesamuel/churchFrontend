import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

// const apiUrl = "http://localhost:8080";
const apiUrl = "http://localhost:8080";

// const apiUrl = "https://churchbackend-r0x2.onrender.com";

const fetchData = async (url, token) => {
  try {
    const response = await axios.get(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Make sure to return the data
  } catch (error) {
    console.error("Error fetching data:", {
      response: error?.response?.data,
    });
    throw error; // Re-throw the error so React Query can handle it
  }
};

const mutateData = async ({ url, token, data, method = "POST" }) => {
  try {
    console.log({
      jgjg: url,
    });

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
    console.error(
      "Error in mutateData:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Something went wrong while mutating data"
    );
  }
};

export const useFetchData = (url, queryKey, options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);

  const token = user?.data?.token;

  return useQuery({
    queryKey: [queryKey, token],
    queryFn: () => fetchData(url, token),
    retry: 2, // Retry failed requests twice
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// leave your existing hook as is
export const useMutateData = (queryKey, method = "POST") => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);

  const token = user?.data?.token;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ url, data }) => mutateData({ url, token, data, method }),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
    },
    // onError: (error) => {
    //   throw error?.response;
    // },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};

// ✅ new PATCH-only wrapper
export const usePatchData = (queryKey) => {
  return useMutateData(queryKey, "PATCH");
};

export const useDeleteData = (queryKey) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.data?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url }) => mutateData({ url, token, method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries([queryKey]),
  });
};

const formdataapiRequest = async ({ url, method, data, token }) => {
  if (!token) throw new Error("Token is missing");

  try {
    const response = await axios({
      url: `${apiUrl}${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // 👈 force multipart
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "API request failed");
  }
};

export const useMutateData_formdata = (url, method = "POST", queryKey) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);

  const token = user?.data?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      formdataapiRequest({ url, token, data: formData, method }),
    onSuccess: () => {
      if (queryKey) queryClient.invalidateQueries([queryKey]);
    },
    onError: (error) => {
      console.error("FormData mutation error:", error);
    },
  });
};

export const useSingleImageUpload = (queryKey) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.data?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ folder_id, imageFile }) => {
      if (!token) throw new Error("Token is missing");

      const formData = new FormData();
      formData.append("folder_id", folder_id);
      formData.append("image", imageFile); // Single image key

      try {
        const response = await axios({
          url: `${apiUrl}/api/v1/collection/add-fileToFolder`, // New endpoint
          method: "POST",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      } catch (error) {
        console.error(
          "Single image upload error:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message || "Failed to upload image"
        );
      }
    },
    onSuccess: () => {
      if (queryKey) queryClient.invalidateQueries([queryKey]);
    },
    onError: (error) => {
      console.error("Single image upload mutation error:", error);
    },
  });
};
