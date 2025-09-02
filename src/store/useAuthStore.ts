import { create } from "zustand";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";

// Types
interface User {
  id?: string;
  name?: string;
  email?: string;
  roles?: string[];
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isValidating: boolean;
  actions: AuthActions;
}

type NavigateFn = (path: string) => void;
type OpenOtpModalFn = () => void;

interface AuthActions {
  login: (user: Partial<User>, navigate: NavigateFn) => Promise<void>;
  signUp: (user: Partial<User>, openOtpModal: OpenOtpModalFn) => Promise<void>;
  getUser: (navigate: NavigateFn) => Promise<void>;
  logout: (navigate: NavigateFn) => void;
}

const localStorageUtils = {
  saveAuthData: (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },
  loadAuthData: (): { user: User | null; token: string | null } => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    const token = localStorage.getItem("token");
    return { user, token };
  },
  clearAuthData: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

const actions = (set: any): AuthActions => ({
  login: async (user: Partial<User>, navigate: NavigateFn) => {
    set({ isAuthenticating: true });
    try {
      const response = await axiosInstance.post("/auth/signin", user);
      const data = response?.data?.data;

      set((state: AuthState) => ({
        user: data?.user,
        token: data?.token,
        isAuthenticated: true,
        isAuthenticating: false,
      }));

      if (!data?.user?.roles?.includes("admin")) {
        toast.success("Unauthorized");
        return;
      }

      // Save to localStorage
      localStorageUtils.saveAuthData(data?.user, data?.token);
      toast.success(`Welcome Back Admin!`);
      navigate("/");
    } catch (error: any) {
      handleError(error);
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signUp: async (user: Partial<User>, openOtpModal: OpenOtpModalFn) => {
    set({ isAuthenticating: true });
    try {
      await axiosInstance.post("/auth/signup", user);
      toast.success("Sign Up Successful");
      openOtpModal();
    } catch (error: any) {
      handleError(error);
    } finally {
      set({ isAuthenticating: false });
    }
  },

  getUser: async (navigate: NavigateFn) => {
    set({ isValidating: true });
    try {
      const { data } = await axiosInstance.get("/auth");
      set({ isAuthenticated: true, user: data?.data });
    } catch (error: any) {
      console.error("Error validating user:", error);
      localStorageUtils.clearAuthData();
    } finally {
      set({ isValidating: false });
    }
  },

  logout: (navigate: NavigateFn) => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorageUtils.clearAuthData();
    navigate("/");
    toast.success("Logged out successfully!");
  },
});

// Create Zustand Store
export const useAuthStore = create<AuthState>((set) => {
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

export const useAuthActions = (): AuthActions =>
  useAuthStore((state) => state.actions);
