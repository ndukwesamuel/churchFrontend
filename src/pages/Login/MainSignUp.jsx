import React, { useState } from "react";
import { useMutateData } from "../../hook/Request";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import Dashboard from "./Dashboard";

const MainSignUp = () => {
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

  const { mutate: SignUpData, isLoading: isloadingSignUp } =
    useMutateData("contacts");

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    let data = {
      email: formData.email,
      password: formData.password,
      churchName: formData.churchName,
      pastorName: formData.pastorName,
    };

    SignUpData(
      {
        url: "/api/v1/auth/signup",
        data: data,
      },
      {
        onSuccess: (main_data) => {
          console.log({ dff: main_data });
          setIsSubmitted(true);
        },
        onError: (err) => {
          console.error("Failed to add contact:", err);
        },
      }
    );
  };

  // if (isSubmitted) {
  //   return <Dashboard />;
  // }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <LoginSideBar />

      {/* Form Area */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-8">
        <div className="w-full max-w-md">
          {isSubmitted ? (
            <Dashboard
              data={{
                email: formData.email,
                password: formData.password,
              }}
            />
          ) : (
            <>
              {step === 1 && (
                <form className="space-y-4" onSubmit={nextStep}>
                  <h1 className="text-2xl font-bold text-center">
                    Welcome Back to ChurchComm!
                  </h1>
                  <p className="text-gray-600 mb-3 text-center">
                    Manage your church’s operations, track communications, and
                    stay connected with your community.
                  </p>

                  <div>
                    <label className="block mb-2 font-medium">
                      Church Name
                    </label>
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
                    <label className="block mb-2 font-medium">
                      Email Address
                    </label>
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
                    Manage your church’s operations, track communications, and
                    stay connected with your community.
                  </p>

                  <div>
                    <label className="block mb-2 font-medium">
                      Church Type
                    </label>
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
                    <label className="block mb-2 font-medium">
                      Pastor's Name
                    </label>
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
                    By signing up, you agree to ChurchComm's{" "}
                    <a href="#" className="text-purple-600 font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-600 font-medium">
                      Privacy Policy
                    </a>
                    .
                  </p>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-400 text-white px-7 py-3 rounded-full hover:bg-gray-500 transition"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isloadingSignUp}
                      className={`px-7 py-3 rounded-full transition ${
                        isloadingSignUp
                          ? "bg-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {isloadingSignUp ? "Creating..." : "Agree & Continue →"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSignUp;
