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
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useFetchData,
  useMutateData,
  usePatchData,
} from "../../../hook/Request";
import { ChurchProfile } from "../../../redux/AuthSlice";

const churchProfileSchema = z.object({
  churchName: z.string().min(1, "Church name is required"),
  pastorName: z.string().min(1, "Pastor name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

export default function ChurchProfileContent() {
  const { ChurchProfile: churchprofileInfo } = useSelector(
    (state) => state?.reducer?.AuthSlice
  );
  const dispatch = useDispatch();
  const {
    data: settingData,
    refetch,
    isLoading,
  } = useFetchData(`/api/v1/setting`, "setting");

  // Dispatch contacts to Redux when they load
  useEffect(() => {
    if (settingData?.data) {
      dispatch(ChurchProfile(settingData?.data));
    }
  }, [settingData, dispatch, churchprofileInfo]);
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
  // 🔥 Prefill form when ChurchProfile is available
  useEffect(() => {
    if (churchprofileInfo?.user) {
      form.reset({
        churchName: churchprofileInfo?.user?.user?.churchName || "",
        pastorName: churchprofileInfo?.user?.user?.pastorName || "",
        address: churchprofileInfo?.user?.user?.address || "",
        email: churchprofileInfo?.user?.user?.email || "",
        phone: churchprofileInfo?.user?.user?.phone || "",
        website: churchprofileInfo?.user?.user?.website || "",
      });
    }
  }, [churchprofileInfo, form]);

  const { mutate: Updateprofile, isLoading: isUpdating } =
    usePatchData("contacts");

  // function onSubmit(values) {
  //   console.log("Form submitted:", values);

  //   Updateprofile(
  //     {
  //       url: `/api/v1/setting`,
  //       data: {
  //         churchName: values?.churchName, //"Jaja Church",
  //         pastorName: values?.pastorName, //"Skjdskjd",
  //         address: values?.address, // "123 Main Street, Lagos",
  //         //   "email": "q@mail.com",
  //         phone: values?.phone, // "+2348012345678",
  //         website: values?.website, // "https://jajachurch.org",
  //       },
  //     },
  //     {
  //       onSuccess: (data) => {
  //         // onClose();
  //         console.log({
  //           dfdd: data,
  //         });
  //       },
  //       onError: (err) => {
  //         console.error("Failed to update contact:", err);
  //       },
  //     }
  //   );
  // }

  function onSubmit(values) {
    console.log("Form submitted:", values);

    Updateprofile(
      {
        url: `/api/v1/setting`,
        data: {
          churchName: values?.churchName,
          pastorName: values?.pastorName,
          address: values?.address,
          phone: values?.phone,
          website: values?.website,
        },
      },
      {
        onSuccess: async () => {
          // ✅ After successful update, refetch the new setting
          const updated = await refetch();

          // ✅ Dispatch updated setting to Redux
          if (updated?.data) {
            dispatch(ChurchProfile(updated?.data));
          }

          console.log("Profile updated successfully:", updated?.data);
        },
        onError: (err) => {
          console.error("Failed to update church profile:", err);
        },
      }
    );
  }

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
                <FormLabel>Church Name</FormLabel>
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
                <FormLabel>Pastor Name</FormLabel>
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
                <FormLabel>Address</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Phone</FormLabel>
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
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
