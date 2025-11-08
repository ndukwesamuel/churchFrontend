import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schema for Step 2
const step2Schema = z.object({
  churchType: z.string().min(1, "Please select a church type"),
  pastorName: z.string().min(1, "Pastor's name is required"),
});

const SignUpStep2 = ({ onBack, onSubmit, isLoading, defaultValues }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: defaultValues || {
      churchType: "",
      pastorName: "",
    },
  });

  const churchType = watch("churchType");
  const handleBackClick = () => {
    const currentValues = {
      churchType: watch("churchType"),
      pastorName: watch("pastorName"),
    };
    onBack(currentValues);
  };

  const handleSelectChange = (value) => {
    setValue("churchType", value, { shouldValidate: true });
  };

  const submitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-center text-darkBlueGray">
        Tell Us About Your Church
      </h1>
      <p className="text-blueBayoux text-sm md:text-base mb-3 text-center px-2">
        Manage your church's operations, track communications, and stay
        connected with your community.
      </p>

      {/* Church Type */}
      <div className="space-y-2">
        <Label
          htmlFor="churchType"
          className="text-sm md:text-base text-darkBlueGray"
        >
          Church Type
        </Label>
        <Select value={churchType} onValueChange={handleSelectChange}>
          <SelectTrigger
            className={`w-full bg-lightBlueGray text-darkBlueGray ${
              errors.churchType ? "border-red-500" : ""
            }`}
            id="churchType"
          >
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Catholic">Catholic</SelectItem>
            <SelectItem value="Pentecostal">Pentecostal</SelectItem>
            <SelectItem value="Anglican">Anglican</SelectItem>
            <SelectItem value="Baptist">Baptist</SelectItem>
            <SelectItem value="Methodist">Methodist</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.churchType && (
          <p className="text-red-500 text-xs md:text-sm mt-1">
            {errors.churchType.message}
          </p>
        )}
      </div>

      {/* Pastor Name */}
      <div className="space-y-2">
        <Label
          htmlFor="pastorName"
          className="text-sm md:text-base text-darkBlueGray"
        >
          Pastor's Name
        </Label>
        <Input
          id="pastorName"
          type="text"
          placeholder="Enter Pastor's Name"
          {...register("pastorName")}
          className={`bg-lightBlueGray text-darkBlueGray ${
            errors.pastorName ? "border-red-500" : ""
          }`}
        />
        {errors.pastorName && (
          <p className="text-red-500 text-xs md:text-sm mt-1">
            {errors.pastorName.message}
          </p>
        )}
      </div>

      <p className="text-center text-darkBlueGray text-xs md:text-sm px-2">
        By signing up, you agree to JxtComm's{" "}
        <a href="#" className="text-moodIndigo font-medium hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-moodIndigo font-medium hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-2">
        <Button
          type="button"
          onClick={handleBackClick}
          variant="secondary"
          className="w-full sm:w-auto px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-medium cursor-pointer"
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-deepPurple hover:bg-deepPurple text-paleBlue px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-medium cursor-pointer"
        >
          {isLoading ? "Creating..." : "Agree & Continue →"}
        </Button>
      </div>
    </form>
  );
};

export default SignUpStep2;
