// // import React, { useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";
// // import { useMutateData } from "../../hook/Request";
// // import { data } from "autoprefixer";
// // import { logindispatch } from "../../redux/AuthSlice";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { loginUser } from "../../store/authSlice"; // <-- adjust path to your slice
// // // import toast from "react-hot-toast";

// // export default function Login() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const [isLogin, setIsLogin] = useState(true);

// //   const { user } = useSelector((state) => state?.reducer?.AuthSlice);
// //   console.log({
// //     ffgg: user,
// //   });

// //   let loading = false; // Placeholder for loading state, replace with actual state management
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm();

// //   const loginMutation = useMutateData("login", "POST");

// //   const onSubmit = async (datainfo) => {
// //     try {
// //       const maindata = await loginMutation.mutateAsync({
// //         url: "/api/v1/auth/signin",
// //         data: datainfo,
// //       });

// //       if (data?.error) {
// //         // toast.error(data.error);
// //       } else {
// //         // console.log({
// //         //   fff: maindata,
// //         // });
// //         // localStorage.setItem("auth", JSON.stringify(data));
// //         // setAuth({ ...auth, token: data.token, user: data.user });
// //         dispatch(logindispatch(maindata));
// //         // toast.success(isLogin ? "Login successful" : "Registration successful");
// //         navigate("/dashboard");
// //       }

// //       // const res = await dispatch(loginUser(data)).unwrap();
// //       // store in localStorage
// //       // localStorage.setItem("auth", JSON.stringify(res));
// //       // toast.success("Login successful!");
// //       // navigate("/dashboard/home");
// //     } catch (err) {
// //       console.error("Login failed:", err);
// //       // toast.error(err?.message || "Authentication failed.");
// //     }

// //     // try {
// //     //   console.log({
// //     //     fff: data,
// //     //   });

// //     //   const data = await loginMutation.mutateAsync({
// //     //     url: "/api/v1/auth/signin",
// //     //     // url: isLogin ? "/api/v1/auth/signin" : "/api/v1/auth/signup",
// //     //     data: data,
// //     //     // ? {
// //     //     //     email: email.toLowerCase(),
// //     //     //     password,
// //     //     //   }
// //     //     // : {
// //     //     //     //   fullName,
// //     //     //     email: email.toLowerCase(),
// //     //     //     password,
// //     //     //   },
// //     //   });

// //     //   if (data?.error) {
// //     //     // toast.error(data.error);
// //     //   } else {
// //     //     console.log({
// //     //       fff: data,
// //     //     });

// //     //     // localStorage.setItem("auth", JSON.stringify(data));
// //     //     // setAuth({ ...auth, token: data.token, user: data.user });
// //     //     // dispatch(logindispatch(data));
// //     //     // toast.success(isLogin ? "Login successful" : "Registration successful");
// //     //     // navigate("/dashboard/home");
// //     //   }

// //     //   // const res = await dispatch(loginUser(data)).unwrap();
// //     //   // store in localStorage
// //     //   // localStorage.setItem("auth", JSON.stringify(res));
// //     //   // toast.success("Login successful!");
// //     //   // navigate("/dashboard/home");
// //     // } catch (err) {
// //     //   console.error("Login failed:", err);
// //     //   // toast.error(err?.message || "Authentication failed.");
// //     // }
// //   };

// //   return (
// //     <div className="flex flex-col md:flex-row min-h-screen bg-white">
// //       {/* Left Side */}
// //       <div className="hidden lg:flex w-1/2 bg-[#F6F0FF] items-center justify-center p-10 relative">
// //         <div className="border-2 border-purple-500 rounded-xl p-6 bg-gradient-to-b from-[#F6F0FF] to-[#E9E0FF] relative">
// //           <div className="bg-white rounded-[50%] p-1 w-[320px] h-[420px] overflow-hidden shadow-md">
// //             <img
// //               src="https://images.unsplash.com/photo-1603415526960-f7e0328e40f3"
// //               alt="People using phones"
// //               className="object-cover w-full h-full"
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Right Side */}
// //       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12 relative">
// //         <div className="w-full max-w-md">
// //           <h1 className="text-2xl font-bold mb-2">
// //             Welcome Back to ChurchComm!
// //           </h1>
// //           <p className="text-gray-600 mb-6">
// //             Manage your church’s operations, track communications, and stay
// //             connected with your community.
// //           </p>

// //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// //             {/* Email */}
// //             <div>
// //               <label className="block mb-2 font-medium">Email Address</label>
// //               <input
// //                 type="email"
// //                 placeholder="Enter Email Address"
// //                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
// //                 {...register("email", { required: "Email is required" })}
// //               />
// //               {errors.email && (
// //                 <p className="text-red-500 text-sm">{errors.email.message}</p>
// //               )}
// //             </div>

// //             {/* Password */}
// //             <div>
// //               <label className="block mb-2 font-medium">Password</label>
// //               <input
// //                 type="password"
// //                 placeholder="Enter Password"
// //                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
// //                 {...register("password", {
// //                   required: "Password is required",
// //                   minLength: {
// //                     value: 8,
// //                     message: "Password must be at least 8 characters",
// //                   },
// //                 })}
// //               />
// //               {errors.password && (
// //                 <p className="text-red-500 text-sm">
// //                   {errors.password.message}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Button */}
// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="bg-purple-600 text-white w-full py-3 rounded-md hover:bg-purple-700 transition disabled:bg-purple-400"
// //             >
// //               {loading ? "Logging in..." : "Login →"}
// //             </button>
// //           </form>

// //           {/* Sign up link */}
// //           <p className="text-center mt-6 text-gray-600">
// //             Don’t have an account?{" "}
// //             <a href="/signup" className="text-purple-600 font-medium">
// //               Sign Up
// //             </a>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useMutateData } from "../../hook/Request";
// import { logindispatch } from "../../redux/AuthSlice";

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);

//   const { user } = useSelector((state) => state?.reducer?.AuthSlice);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const loginMutation = useMutateData("login", "POST");

//   // ✅ If user already logged in, redirect to dashboard
//   useEffect(() => {
//     if (user) {
//       navigate("/dashboard");
//     }
//   }, [user, navigate]);

//   const onSubmit = async (datainfo) => {
//     try {
//       const maindata = await loginMutation.mutateAsync({
//         url: "/api/v1/auth/signin",
//         data: datainfo,
//       });

//       if (maindata?.error) {
//         console.error(maindata.error);
//       } else {
//         // Save user to Redux
//         dispatch(logindispatch(maindata));

//         // ✅ Redirect after successful login
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       console.error("Login failed:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-white">
//       {/* Left Side */}
//       <div className="hidden lg:flex w-1/2 bg-[#F6F0FF] items-center justify-center p-10 relative">
//         <div className="border-2 border-purple-500 rounded-xl p-6 bg-gradient-to-b from-[#F6F0FF] to-[#E9E0FF] relative">
//           <div className="bg-white rounded-[50%] p-1 w-[320px] h-[420px] overflow-hidden shadow-md">
//             <img
//               src="https://images.unsplash.com/photo-1603415526960-f7e0328e40f3"
//               alt="People using phones"
//               className="object-cover w-full h-full"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12 relative">
//         <div className="w-full max-w-md">
//           <h1 className="text-2xl font-bold mb-2">
//             Welcome Back to ChurchComm!
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Manage your church’s operations, track communications, and stay
//             connected with your community.
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block mb-2 font-medium">Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Enter Email Address"
//                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 {...register("email", { required: "Email is required" })}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block mb-2 font-medium">Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter Password"
//                 className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 8,
//                     message: "Password must be at least 8 characters",
//                   },
//                 })}
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-sm">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={loginMutation.isLoading}
//               className="bg-purple-600 text-white w-full py-3 rounded-md hover:bg-purple-700 transition disabled:bg-purple-400"
//             >
//               {loginMutation.isLoading ? "Logging in..." : "Login →"}
//             </button>
//           </form>

//           {/* Sign up link */}
//           <p className="text-center mt-6 text-gray-600">
//             Don’t have an account?{" "}
//             <a href="/signup" className="text-purple-600 font-medium">
//               Sign Up
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutateData } from "../../hook/Request";
import { logindispatch } from "../../redux/AuthSlice";
import LoginSideBar from "../../components/Sidebar/loginSideBar";


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
      console.error("Login failed:", err);
      // toast.error(err?.message || "Login failed"); // Optional
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Side */}
      <LoginSideBar/>

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
