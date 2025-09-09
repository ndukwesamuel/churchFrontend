import { User } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormInput from "../../../components/FormInput";

const churchProfileSchema = z.object({
  churchName: z.string().min(1, "Church name is required"),
  pastorName: z.string().min(1, "Pastor name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")), // allow empty string
});

const ChurchProfileContent = () => {
  const methods = useForm({
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

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="space-y-6  bg-gray-50">
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
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
          <FormInput
            name="churchName"
            label="Church Name"
            placeholder="Enter church name"
            className="w-full px-3 py-2 bg-lightBlueGray bg-lightBlueGray border border-gray-300 rounded-md outline-none"
          />

          <FormInput
            name="pastorName"
            label="Pastor Name"
            placeholder="Enter pastor name"
            className="w-full px-3 py-2 bg-lightBlueGray border border-gray-300 rounded-md outline-none"
          />

          <div>
            <FormInput
              name="address"
              label="Address"
              placeholder="Enter Church Address"
              className="w-full px-3 py-2 bg-lightBlueGray border border-gray-300  rounded-md outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 bg-lightBlueGray border border-gray-300 rounded-md outline-none"
            />

            <FormInput
              name="phone"
              label="Phone"
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-3 py-2 bg-lightBlueGray border border-gray-300 rounded-md outline-none"
            />
          </div>

          <FormInput
            name="website"
            label="Website"
            type="url"
            placeholder="Enter website URL"
            className="w-full px-3 py-2 bg-lightBlueGray border border-gray-300 rounded-md outline-none"
          />

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-[#5B38DB] text-white px-6 py-2 rounded-full hover:bg-[#4A2FB8] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ChurchProfileContent;
