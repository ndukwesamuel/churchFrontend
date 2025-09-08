import React from "react";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
    const navigate = useNavigate();
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Left Side */}
        <LoginSideBar />

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-8">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center">
              Welcome Back to ChurchComm!
            </h1>
            <p className="text-gray-600 mb-3 text-center">
              Manage your church’s operations, track communications, and stay
              connected with your community.
            </p>

            <form className="space-y-4" onSubmit={() => navigate("/step2")}>
              {/* Full Name */}
              <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  // {...register("email", { required: "Email is required" })}
                />
                {/* {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )} */}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  // {...register("email", { required: "Email is required" })}
                />
                {/* {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )} */}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  // {...register("password", {
                  //   required: "Password is required",
                  //   minLength: {
                  //     value: 8,
                  //     message: "Password must be at least 8 characters",
                  //   },
                  // })}
                />
                {/* {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )} */}
                <p className="text-[#3D4C5E] text-sm mt-2">Password strength</p>
                <p className="text-[#3D4C5E] text-sm mt-2 ml-3">
                  assword must be at least 8 characters.
                </p>
                <p className="text-[#3D4C5E] text-sm mt-2 ml-3">
                  A mix of upper and lower case letters
                </p>
                <p className="text-[#3D4C5E] text-sm mt-2 ml-3">
                  Password must contain at least 1 number and 1 special
                  character.
                </p>
              </div>

              <div className="flex flex-row items-center justify-between">
                {/* Submit Button */}
                <button
                  type="submit"
                  //   disabled={loginMutation.isLoading}
                  className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition disabled:bg-purple-400"
                >
                  {/* {loginMutation.isLoading ? "Logging in..." : "Login →"} */}
                  Next →
                </button>

                {/* Sign Up */}
                <p className="text-center text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-purple-600 font-medium">
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}

export default SignUp;