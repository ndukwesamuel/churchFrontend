import React from "react";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import { useNavigate } from "react-router-dom";

const SignUpStep2 = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Side */}
      <LoginSideBar />

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center">
            Tell Us About Your Church
          </h1>
          <p className="text-gray-600 mb-3 text-center">
            Manage your church’s operations, track communications, and stay
            connected with your community.
          </p>

          <form className="space-y-4" onSubmit={() => navigate("/step3")}>
            {/* Church Name */}
            <div>
              <label className="block mb-2 font-medium">Church Name</label>
              <input
                type="text"
                placeholder="Enter Church Name"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                // {...register("email", { required: "Email is required" })}
              />
              {/* {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )} */}
            </div>

            {/* Church Type */}
            <div>
              <label className="block mb-2 font-medium">Church Type</label>
              <select
                name=""
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Catholic">Catholic</option>
                <option value="Catholic">Pentcosat</option>
              </select>
              {/* {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )} */}
            </div>

            {/* Pastor's Name */}
            <div>
              <label className="block mb-2 font-medium">Pastor's Name</label>
              <input
                type="Pastor's Name"
                placeholder="Enter Pastor's Name"
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
            </div>

            {/* Sign Up */}
            <p className="text-center text-gray-600 text-sm">
              By signing up, you agree to ChurchComm's{" "}
              <a href="#" className="text-purple-600 font-medium">
                Terms of Service
              </a>
              and
              <a href="#" className="text-purple-600 font-medium">
                {" "}
                Privacy Policy.
              </a>
            </p>
            {/* Submit Button */}
            <button
              type="submit"
              //   disabled={loginMutation.isLoading}
              className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition disabled:bg-purple-400"
            >
              {/* {loginMutation.isLoading ? "Logging in..." : "Login →"} */}
              Agree & Continue →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpStep2;
