import { create } from "zustand";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";
import { toast } from "sonner";

const actions = (set) => ({
  getAllCandidates: async (query) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/candidates", {
        params: query,
      });
      const data = response?.data?.data;

      console.log(data);

      set((state) => ({
        candidates: data?.candidates,
        pagination: data?.pagination,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  getCandidate: async (staffId, update = false) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/candidates/details?staffId=${staffId}`
      );
      const data = response?.data?.data;

      // console.log(data);

      set((state) => ({
        candidate: data?.candidate,
        status: data?.status,
        verificationInfo: data?.verification_info,
        credentails: data?.credentails,
        documents: data?.documents,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  verifyCandidateGuarantor: async (staffId, data) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(
        `/admin/guarantor/verify?staffId=${staffId}`,
        data
      );
      console.log(response?.data);
      toast.success(response?.data?.message);
      await actions(set).getCandidate(staffId);
    } catch (error) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
  setSearchParams: (params) => set({ searchParams: params }),
});

export const useCandidateStore = create((set) => {
  return {
    candidates: [],
    candidate: {},
    credentails: [],
    documents: [],
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalCount: 0,
      filteredCount: 0,
      perPage: 0,
    },
    status: {},
    verificationInfo: {},
    isLoading: false,
    isSubmitting: false,
    searchParams: {}, // Add searchParams to store the current search parameters
    actions: actions(set),
  };
});

export const useCandiateActions = () =>
  useCandidateStore((state) => state.actions);
