import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { CiSquarePlus } from "react-icons/ci";

export default function FormModal({ isOpen, onClose }) {
  const methods = useForm();
  const { handleSubmit } = methods;
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const closeSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  const onSubmit = (data) => {
    setShowSuccess(true);
    navigate("/field-officers");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper heading="Add Officers" isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormInput
            name="fullName"
            label="Full Name"
            placeholder=""
            validation={{ required: "Full name is required" }}
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
          />
          {/* <FormInput
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder=""
            validation={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid phone number",
              },
            }}
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
          /> */}
          <FormInput
            name="email"
            label="Email Address"
            type="email"
            placeholder=""
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            }}
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
          />

          <FormInput
            name="Password"
            label="Password"
            placeholder=""
            validation={{ required: "Full name is required" }}
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
          />

          {/* <FormInput
            name="gender"
            label="Gender"
            validation={{ required: "Gender is required" }}
            className="border border-gray-300 rounded-lg p-2 text-sm outline-none"
          >
            <select
              {...methods.register("gender", {
                required: "Gender is required",
              })}
              className="border border-gray-300 rounded-lg p-2 w-full text-sm outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FormInput> */}
          {/* <p className="text-xs italic text-gray-500">
            Note: Officer's password is the first name
          </p> */}

          <Button
            text="Add Officer"
            type="submit"
            className="w-full px-4 py-2 bg-[#1710E1] text-white rounded-lg font-medium text-base"
          />
        </form>
      </FormProvider>
      <Modal
        isOpen={showSuccess}
        onClose={closeSuccess}
        icon={<CiSquarePlus />}
        title="Officers Added"
        paragraph="You have successfully added (name of the officer)"
        button1={
          <Button
            text="Okay"
            className="bg-[#1710E1] text-white p-3 rounded-lg text-lg font-normal"
            onClick={closeSuccess}
          />
        }
      />
    </ModalWrapper>
  );
}
