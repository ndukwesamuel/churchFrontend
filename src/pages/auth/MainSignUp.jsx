import React, { useState } from "react";
import { useMutateData } from "../../hook/Request";
import LoginSideBar from "../../components/Sidebar/loginSideBar";
import Dashboard from "./Dashboard";
import { toast } from "sonner";
import SignUpStep1 from "./_components/signupStep1";
import SignUpStep2 from "./_components/signupStep2";

const MainSignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    churchName: "",
    email: "",
    password: "",
    churchType: "",
    pastorName: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: SignUpData, isLoading: isloadingSignUp } =
    useMutateData("signup");

  // Move to next step with current data
  const nextStep = (dataFromStep1) => {
    setFormData((prev) => ({ ...prev, ...dataFromStep1 }));
    setStep(2);
  };

  const prevStep = (dataFromStep2) => {
    // Save Step 2 data before going back
    if (dataFromStep2) {
      setFormData((prev) => ({ ...prev, ...dataFromStep2 }));
    }
    setStep(1);
  };
  // Final submission (Step 2 data)
  const handleFinalSubmit = (dataFromStep2) => {
    const finalData = {
      ...formData, // includes Step 1 data
      ...dataFromStep2, // includes Step 2 data
    };

    SignUpData(
      {
        url: "/api/v1/auth/signup",
        data: finalData,
      },
      {
        onSuccess: (response) => {
          setIsSubmitted(true);
        },
        onError: (error) => {
          toast.error(error.message || "Signup failed");
        },
      }
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <LoginSideBar />

      {/* Form Area */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
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
                <SignUpStep1
                  defaultValues={{
                    churchName: formData.churchName,
                    email: formData.email,
                    password: formData.password,
                  }}
                  onNext={nextStep}
                />
              )}

              {step === 2 && (
                <SignUpStep2
                  onBack={prevStep}
                  onSubmit={handleFinalSubmit}
                  isLoading={isloadingSignUp}
                  defaultValues={{
                    churchType: formData.churchType,
                    pastorName: formData.pastorName,
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSignUp;
