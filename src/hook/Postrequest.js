import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logindispatch } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { weeklyIncomedispatch } from "@/redux/estateSlice";
// const apiUrl = "http://localhost:8070/api/v1";
const apiUrl = "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/api/v1";

const postData = async (data) => {
  const response = await axios.post(
    "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/api/v1/user/login",
    data
  );
  return response.data;
};

// Create a custom hook for the POST request
export const usePostData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: postData,
    onSuccess: (response) => {
      dispatch(logindispatch(response?.data));
    },
    onError: (error) => {
      console.error("POST request failed:", error);
    },
    onSettled: () => {
      console.log("POST request settled");
    },
  });
};
const fetchDataPost = async (url, token, data) => {
  try {
    const mainurl = `${apiUrl}${url}`;

    const response = await axios.post(mainurl, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });

    return response.data;
    // return;
  } catch (error) {
    console.error("POST request failed:", error);

    // Throw the error so it can be handled by the caller
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};

export const usePostClients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token; // Retrieve the token from the Redux store
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn: fetchDataPost,

    mutationFn: ({ url, data }) => fetchDataPost(url, token, data), // Use the token from Redux
    onSuccess: (response) => {
      // dispatch(logindispatch(response?.data)); // Dispatch your Redux action
      // navigate("/loading"); // Navigate if needed
      queryClient.invalidateQueries(["clients"]);
    },
    onError: (error) => {
      console.error("POST request failed:", { error: error?.response });
    },
    onSettled: () => {
      console.log("POST request settled");
    },
  });
};

const fetchDataupdate = async (url, token, data) => {
  try {
    const mainurl = `${apiUrl}${url}`;

    const response = await axios.put(mainurl, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });

    return response.data;
    // return;
  } catch (error) {
    console.error("POST request failed:", error);

    // Throw the error so it can be handled by the caller
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};

export const usePostClientsupdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token; // Retrieve the token from the Redux store
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn: fetchDataPost,

    mutationFn: ({ url, data }) => fetchDataupdate(url, token, data), // Use the token from Redux
    onSuccess: (response) => {
      // dispatch(logindispatch(response?.data)); // Dispatch your Redux action
      // navigate("/loading"); // Navigate if needed
      queryClient.invalidateQueries(["clients"]);
    },
    onError: (error) => {
      console.error("POST request failed:", { error: error?.response });
    },
    onSettled: () => {
      console.log("POST request settled");
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, token }) => {
      const url = `${apiUrl}/BusinessAdvisorySBU/clients/${id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the query to refetch the clients list
      queryClient.invalidateQueries(["clients"]);
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
    },
  });
};
export const fetchData = async (url, token) => {
  try {
    const mainurl = apiUrl + url;

    const response = await axios.get(mainurl, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });

    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);

    // Throw the error so it can be handled by the caller
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};
// Non-reusable useGetData hook
export const useGetData = (url, queryKey, options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token; // Retrieve the token from the Redux store
  const dispatch = useDispatch(); // Initialize useDispatch for Redux actions

  return useQuery({
    queryKey: [queryKey, token], // Include the token in the query key
    queryFn: () => fetchData(url, token), // Use the reusable fetchData function
    onSuccess: (data) => {
      // Dispatch a Redux action with the fetched data
      dispatch(weeklyIncomedispatch(data));
    },
    onError: (error) => {
      console.error("Error in useGetData:", error.message);

      // Dispatch a Redux action for error handling (if needed)
      // dispatch(someAction({ error: error.message }));
    },
    ...options, // Additional options like enabled, staleTime, etc.
  });
};

export const useGetclientsData = (url, queryKey, options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token; // Retrieve the token from the Redux store
  const dispatch = useDispatch(); // Initialize useDispatch for Redux actions

  return useQuery({
    queryKey: [queryKey, token], // Include the token in the query key
    queryFn: () => fetchData(url, token), // Use the reusable fetchData function
    onSuccess: (data) => {
      // Dispatch a Redux action with the fetched data
      // dispatch(weeklyIncomedispatch(data));
    },
    onError: (error) => {
      console.error("Error in useGetData:", error.message);

      // Dispatch a Redux action for error handling (if needed)
      // dispatch(someAction({ error: error.message }));
    },
    ...options, // Additional options like enabled, staleTime, etc.
  });
};

export const useGetHotprospect = (url, queryKey, options = {}) => {
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);
  const token = user?.token; // Retrieve the token from the Redux store
  const dispatch = useDispatch(); // Initialize useDispatch for Redux actions

  return useQuery({
    queryKey: [queryKey, token], // Include the token in the query key
    queryFn: () => fetchData(url, token), // Use the reusable fetchData function
    onSuccess: (data) => {
      // Dispatch a Redux action with the fetched data
      // dispatch(weeklyIncomedispatch(data));
    },
    onError: (error) => {
      console.error("Error in useGetData:", error.message);

      // Dispatch a Redux action for error handling (if needed)
      // dispatch(someAction({ error: error.message }));
    },
    ...options, // Additional options like enabled, staleTime, etc.
  });
};
