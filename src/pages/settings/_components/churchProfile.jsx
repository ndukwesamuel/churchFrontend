import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFetchData, useMutateData } from "../../../hook/Request";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
const churchProfileSchema = z.object({
  churchName: z.string().min(1, "Church name is required"),
  pastorName: z.string().min(1, "Pastor name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  website: z.url("Invalid website URL").optional().or(z.literal("")),
});

export default function ChurchProfileContent() {
  const { data } = useFetchData("/api/v1/setting", "getProfile");
  const userData = data?.data?.user?.user;
  const { mutateAsync, isLoading } = useMutateData(`updateProfile`, "PATCH");

  const form = useForm({
    resolver: zodResolver(churchProfileSchema),
    defaultValues: {
      churchName: "",
      pastorName: "",
      address: "",
      email: "",
      phone: "",
      website: "",
    },
  });
  useEffect(() => {
    if (userData) {
      form.reset({
        churchName: userData.churchName || "",
        pastorName: userData.pastorName || "",
        address: userData.address || "",
        email: userData.email || "",
        phone: userData.phone || "",
        website: userData.website || "",
      });
    }
  }, [userData, form]);
  const onSubmit = async (payload) => {
    try {
      const response = await mutateAsync({
        url: "/api/v1/setting",
        data: payload,
      });
      toast.success(response.message);
    } catch (error) {
      toast.error(
        error.errors?.map((err) => err.message)?.join(", ") ||
          error?.message ||
          "Failed to complete request."
      );
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded-md">
      {/* Header */}
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Church Profile</h3>
          <p className="text-sm text-gray-500">
            Update your Church Information
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="churchName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Church Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter church name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pastorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Pastor Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter pastor name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter church address"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Enter website URL"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-start">
            <Button
              type="submit"
              className="bg-[#5B38DB] hover:bg-[#4A2FB8] rounded-full px-6"
            >
              {isLoading ? (
                <div className="flex gap-2">
                  <Loader2 /> Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
