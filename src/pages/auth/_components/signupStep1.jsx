import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Check, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Validation schema
const step1Schema = z.object({
  churchName: z.string().min(1, "Church name is required"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

const SignUpStep1 = ({ onNext, defaultValues }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues, // ✅ Keeps old data when going back
  });

  const password = watch("password", "");

  const onSubmit = (data) => {
    onNext(data);
  };

  // Password criteria checklist
  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "Contains special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-xl md:text-2xl font-semibold text-center text-darkBlueGray">
        Welcome Back to JXTCOMM!
      </h1>
      <p className="text-blueBayoux font-normal text-sm md:text-base mb-3 text-center px-2">
        Manage your church's operations, track communications, and stay
        connected with your community.
      </p>

      {/* Church Name */}
      <div className="space-y-2">
        <Label
          htmlFor="churchName"
          className="text-sm md:text-base text-darkBlueGray"
        >
          Church Name
        </Label>
        <Input
          id="churchName"
          type="text"
          placeholder="Enter Church Name"
          {...register("churchName")}
          className={`bg-lightBlueGray text-darkBlueGray ${
            errors.churchName ? "border-red-500" : ""
          }`}
        />
        {errors.churchName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.churchName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm md:text-base text-darkBlueGray"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter Email Address"
          {...register("email")}
          className={`bg-lightBlueGray text-darkBlueGray ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm md:text-base text-darkBlueGray"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            {...register("password")}
            className={`pr-10 bg-lightBlueGray text-darkBlueGray ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>

        {/* Password Criteria */}
        <div className="space-y-1 mt-2">
          {passwordChecks.map((check) => (
            <div
              key={check.label}
              className="flex items-center gap-2 text-xs text-inkyBlue"
            >
              {check.valid ? (
                <Check className="text-green w-4 h-4" />
              ) : (
                <X className="text-gray-400 w-4 h-4" />
              )}
              <span
                className={`${
                  check.valid ? "text-green-600" : "text-gray-500"
                }`}
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>

        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
        <Button
          type="submit"
          className="w-full sm:w-auto bg-deepPurple hover:bg-deepPurple text-paleBlue px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-medium"
        >
          Next <ArrowRight />
        </Button>
        <p className="text-inkyBlue text-xs md:text-sm text-center sm:text-right">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-deepPurple font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignUpStep1;
