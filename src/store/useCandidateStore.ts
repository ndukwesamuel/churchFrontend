import { create } from "zustand";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";
import { toast } from "sonner";

// Types
interface Candidate {
  staffId?: string;
  name?: string;
  [key: string]: any;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  filteredCount: number;
  perPage: number;
}

interface CandidateState {
  candidates: Candidate[];
  candidate: Candidate | {};
  credentails: any[];
  documents: any[];
  pagination: Pagination;
  status: any;
  verificationInfo: any;
  isLoading: boolean;
  isSubmitting: boolean;
  searchParams: Record<string, any>;
  actions: CandidateActions;
}

interface CandidateActions {
  getAllCandidates: (query?: Record<string, any>) => Promise<void>;
  getCandidate: (staffId: string, update?: boolean) => Promise<void>;
  verifyCandidateGuarantor: (staffId: string, data: any) => Promise<void>;
  setSearchParams: (params: Record<string, any>) => void;
}

const actions = (set: any): CandidateActions => ({
  getAllCandidates: async (query?: Record<string, any>) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/candidates", {
        params: query,
      });
      const data = response?.data?.data;

      console.log(data);

      set((state: CandidateState) => ({
        candidates: data?.candidates,
        pagination: data?.pagination,
        isLoading: false,
      }));
    } catch (error: any) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  getCandidate: async (staffId: string, update: boolean = false) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/candidates/details?staffId=${staffId}`
      );
      const data = response?.data?.data;

      set((state: CandidateState) => ({
        candidate: data?.candidate,
        status: data?.status,
        verificationInfo: data?.verification_info,
        credentails: data?.credentails,
        documents: data?.documents,
        isLoading: false,
      }));
    } catch (error: any) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  verifyCandidateGuarantor: async (staffId: string, data: any) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(
        `/admin/guarantor/verify?staffId=${staffId}`,
        data
      );
      console.log(response?.data);
      toast.success(response?.data?.message);
      await actions(set).getCandidate(staffId);
    } catch (error: any) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
  setSearchParams: (params: Record<string, any>) =>
    set({ searchParams: params }),
});

export const useCandidateStore = create<CandidateState>((set) => {
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
    searchParams: {},
    actions: actions(set),
  };
});

export const useCandidateActions = (): CandidateActions =>
  useCandidateStore((state) => state.actions);
