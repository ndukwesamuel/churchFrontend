import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutateData } from "../../hook/Request";
import { logindispatch } from "../../redux/AuthSlice";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import { toast } from "sonner";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state?.reducer?.AuthSlice);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutateData("login", "POST");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const response = await loginMutation.mutateAsync({
        url: "/api/v1/auth/signin",
        data: formData,
      });
      if (response?.error) {
        console.error(response.error);
        // toast.error(response.error); // Optional
      } else {
        dispatch(logindispatch(response));
        // toast.success("Login successful!"); // Optional
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Side */}
      <LoginSideBar />

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">
            Welcome Back to ChurchComm!
          </h1>
          <p className="text-gray-600 mb-6">
            Manage your church’s operations, track communications, and stay
            connected with your community.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isLoading}
              className="bg-purple-600 text-white w-full py-3 rounded-md hover:bg-purple-700 transition disabled:bg-purple-400"
            >
              {loginMutation.isLoading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {/* Sign Up */}
          <p className="text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-purple-600 font-medium">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
