import { toast } from "sonner";

export const handleError = (error) => {
  console.error(error);
  const { response } = error;
  if (response?.data?.message) {
    return toast.error(response.data.message);
  }
  toast.error("Something went wrong");
};
