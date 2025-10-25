import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutateData } from "../../hook/Request";
import { logindispatch } from "../../redux/AuthSlice";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Zod schema for validation
const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const loginMutation = useMutateData("login", "POST");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const onSubmit = async (formData) => {
    try {
      const response = await loginMutation.mutateAsync({
        url: "/api/v1/auth/signin",
        data: formData,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        dispatch(logindispatch(response));
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <LoginSideBar />

      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-darkBlueGray">
              Welcome Back to JXTCOMM!
            </h1>
            <p className="text-blueBayoux text-sm md:text-base">
              Manage your church's operations, track communications, and stay
              connected with your community.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={`bg-lightBlueGray text-darkBlueGray ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`bg-lightBlueGray text-darkBlueGray  pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-deepPurple hover:bg-deepPurple text-paleBlue px-6 md:px-7 py-3 rounded-full text-sm md:text-base font-medium"
              >
                {loginMutation.isLoading ? (
                  "Logging in..."
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In <ArrowRight />{" "}
                  </div>
                )}
              </Button>
              <p className="text-inkyBlue text-xs md:text-sm text-center sm:text-right">
                Don't have an account?{" "}
                <a
                  href="/login"
                  className="text-deepPurple font-medium hover:underline"
                >
                  Get Started
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
