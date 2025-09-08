import React from "react";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import emoji from "../../assets/images/upscale_image [Upscaled].png";
import { useNavigate } from "react-router-dom";

const SignUpStep3 = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Side */}
      <LoginSideBar />

      {/* Right Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
        <div className="mb-12 p-3 bg-[#D1C5FD] rounded-[50%] border-8 border-solid border-[#F7F5FF]">
          <img src={emoji} alt="" className="w-28" />
        </div>
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center">
            Your ChurchComm Account is Ready!
          </h1>
          <p className="text-gray-600 mb-3 text-center text-sm">
            You’re all set to manage your church operations with ChurchComm.
          </p>
        </div>
        <button
          //   disabled={loginMutation.isLoading}
          className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition disabled:bg-purple-400"
          onClick={() => navigate("/dashboard")}
        >
          {/* {loginMutation.isLoading ? "Logging in..." : "Login →"} */}
          Go To Dashboard →
        </button>
      </div>
    </div>
  );
};

export default SignUpStep3;
