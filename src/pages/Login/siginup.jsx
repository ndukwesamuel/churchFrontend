// import React from "react";
// import LoginSideBar from "../../components/Sidebar/loginSideBar";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//     const navigate = useNavigate();
//     return (
//       <div className="flex flex-col md:flex-row min-h-screen bg-white">
//         {/* Left Side */}
//         <LoginSideBar />

//         {/* Right Side */}
//         <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-8">
//           <div className="w-full max-w-md">
//             <h1 className="text-2xl font-bold text-center">
//               Welcome Back to ChurchComm!
//             </h1>
//             <p className="text-gray-600 mb-3 text-center">
//               Manage your church’s operations, track communications, and stay
//               connected with your community.
//             </p>

//             <form className="space-y-4" onSubmit={() => navigate("/step2")}>
//               {/* Full Name */}
//               <div>
//                 <label className="block mb-2 font-medium">Full Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter Full Name"
//                   className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   // {...register("email", { required: "Email is required" })}
//                 />
//                 {/* {errors.email && (
//                         <p className="text-red-500 text-sm">{errors.email.message}</p>
//                       )} */}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block mb-2 font-medium">Email Address</label>
//                 <input
//                   type="email"
//                   placeholder="Enter Email Address"
//                   className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   // {...register("email", { required: "Email is required" })}
//                 />
//                 {/* {errors.email && (
//                         <p className="text-red-500 text-sm">{errors.email.message}</p>
//                       )} */}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block mb-2 font-medium">Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter Password"
//                   className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   // {...register("password", {
//                   //   required: "Password is required",
//                   //   minLength: {
//                   //     value: 8,
//                   //     message: "Password must be at least 8 characters",
//                   //   },
//                   // })}
//                 />
//                 {/* {errors.password && (
//                         <p className="text-red-500 text-sm">
//                           {errors.password.message}
//                         </p>
//                       )} */}
//                 <p className="text-[#3D4C5E] text-sm mt-2">Password strength</p>
//                 <p className="text-[#3D4C5E] text-sm mt-2 ml-3">
//                   assword must be at least 8 characters.
//                 </p>
//                 <p className="text-[#3D4C5E] text-sm mt-2 ml-3">
//                   A mix of upper and lower case letters
//                 </p>
//                 <p className="text-[#3D4C5E] text-sm mt-2 ml-3">
//                   Password must contain at least 1 number and 1 special
//                   character.
//                 </p>
//               </div>

//               <div className="flex flex-row items-center justify-between">
//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   //   disabled={loginMutation.isLoading}
//                   className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition disabled:bg-purple-400"
//                 >
//                   {/* {loginMutation.isLoading ? "Logging in..." : "Login →"} */}
//                   Next →
//                 </button>

//                 {/* Sign Up */}
//                 <p className="text-center text-gray-600">
//                   Already have an account?{" "}
//                   <a href="/login" className="text-purple-600 font-medium">
//                     Sign In
//                   </a>
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
// }

// export default SignUp;

import React, { useState } from "react";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import emoji from "../../assets/images/upscale_image [Upscaled].png";

// Mock Dashboard Component (replace with your actual dashboard)
const Dashboard = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-3xl font-bold">🎉 Welcome to the Dashboard!</h1>
  </div>
);

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    churchName: "",
    churchType: "",
    pastorName: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    // ✅ You can add API request here to submit `formData`
    console.log("Submitting form data:", formData);

    let data = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      churchName: formData.churchName,
      church_type: formData.churchType,
      pastorName: formData.pastorName,
    };

    console.log({
      fgf: data,
    });

    // Mock success
    // setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <Dashboard />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <LoginSideBar />

      {/* Form Area */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-8">
        <div className="w-full max-w-md">
          {step === 1 && (
            <form className="space-y-4" onSubmit={nextStep}>
              <h1 className="text-2xl font-bold text-center">
                Welcome Back to ChurchComm!
              </h1>
              <p className="text-gray-600 mb-3 text-center">
                Manage your church’s operations, track communications, and stay
                connected with your community.
              </p>

              {/* <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div> */}

              <div>
                <label className="block mb-2 font-medium">Church Name</label>
                <input
                  type="text"
                  name="churchName"
                  value={formData.churchName}
                  onChange={handleChange}
                  placeholder="Enter Church Name"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[#3D4C5E] text-sm mt-2">
                  Password must be at least 8 characters, include upper and
                  lower case letters, a number, and a special character.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition"
                >
                  Next →
                </button>
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-purple-600 font-medium">
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-4" onSubmit={handleFinalSubmit}>
              <h1 className="text-2xl font-bold text-center">
                Tell Us About Your Church
              </h1>
              <p className="text-gray-600 mb-3 text-center">
                Manage your church’s operations, track communications, and stay
                connected with your community.
              </p>

              <div>
                <label className="block mb-2 font-medium">Church Type</label>
                <select
                  name="churchType"
                  value={formData.churchType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Type</option>
                  <option value="Catholic">Catholic</option>
                  <option value="Pentecostal">Pentecostal</option>
                  <option value="Anglican">Anglican</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Pastor's Name</label>
                <input
                  type="text"
                  name="pastorName"
                  value={formData.pastorName}
                  onChange={handleChange}
                  placeholder="Enter Pastor's Name"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <p className="text-center text-gray-600 text-sm">
                By signing up, you agree to ChurchComm's
                <a href="#" className="text-purple-600 font-medium">
                  Terms of Service
                </a>
                and
                <a href="#" className="text-purple-600 font-medium">
                  Privacy Policy
                </a>
                .
              </p>

              <button
                onClick={() => setStep(1)}
                type="submit"
                // onClick={handleFinalSubmit}
                className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition"
              >
                Agree & Continue →
              </button>
            </form>
          )}

          {/* {step === 3 && (
            <form
              className="space-y-6 text-center"
              onSubmit={handleFinalSubmit}
            >
              <div className="mb-6 p-3 bg-[#D1C5FD] rounded-full border-8 border-[#F7F5FF] w-fit mx-auto">
                <img src={emoji} alt="Success" className="w-28" />
              </div>
              <h1 className="text-2xl font-bold">
                Your ChurchComm Account is Ready!
              </h1>
              <p className="text-gray-600 mb-3 text-sm">
                You’re all set to manage your church operations with ChurchComm.
              </p>

              <button
                type="submit"
                className="bg-purple-600 text-white px-7 py-3 rounded-full hover:bg-purple-700 transition"
              >
                Go To Dashboard →
              </button>
            </form>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
