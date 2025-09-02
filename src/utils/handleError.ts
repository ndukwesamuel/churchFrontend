import { toast } from "sonner";

export const handleError = (error: any): void => {
  console.error(error);
  // Support both axios errors and custom error objects
  const message =
    error?.response?.data?.message ||
    error?.message ||
    (typeof error === "string" ? error : null);
  if (message) {
    toast.error(message);
  } else {
    toast.error("Something went wrong");
  }
};
