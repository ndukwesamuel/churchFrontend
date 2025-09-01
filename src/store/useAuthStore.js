import { create } from "zustand";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";

const localStorageUtils = {
  saveAuthData: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },
  loadAuthData: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    return { user, token };
  },
  clearAuthData: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

const actions = (set) => ({
  login: async (user, navigate) => {
    set({ isAuthenticating: true });
    try {
      const response = await axiosInstance.post("/auth/signin", user);
      const data = response?.data?.data;

      set((state) => ({
        user: data?.user,
        token: data?.token,
        isAuthenticated: true,
        isAuthenticating: false,
      }));

      if (!data?.user?.roles?.includes("admin")) {
        return toast.success("Unauthorized");
      }

      // Save to localStorage
      localStorageUtils.saveAuthData(data?.user, data?.token);
      toast.success(`Welcome Back Admin!`);
      navigate("/");
    } catch (error) {
      handleError(error);
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signUp: async (user, openOtpModal) => {
    set({ isAuthenticating: true });
    try {
      await axiosInstance.post("/auth/signup", user);
      toast.success("Sign Up Successful");
      openOtpModal();
    } catch (error) {
      handleError(error);
    } finally {
      set({ isAuthenticating: false });
    }
  },

  getUser: async (navigate) => {
    set({ isValidating: true });
    try {
      const { data } = await axiosInstance.get("/auth");
      set({ isAuthenticated: true, user: data?.data });
    } catch (error) {
      console.error("Error validating user:", error);
      localStorageUtils.clearAuthData();
    } finally {
      set({ isValidating: false });
    }
  },

  logout: (navigate) => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorageUtils.clearAuthData();
    navigate("/");
    toast.success("Logged out successfully!");
  },
});

// Create Zustand Store
export const useAuthStore = create((set) => {
  const { user, token } = localStorageUtils.loadAuthData();

  return {
    user: user || null,
    token: token || null,
    isAuthenticated: !!user,
    isAuthenticating: false,
    isValidating: false,
    actions: actions(set),
  };
});

export const useAuthActions = () => useAuthStore((state) => state.actions);
