import React from "react";
import { useFormContext } from "react-hook-form";

export default function FormInput({
  name,
  label,
  type = "text",
  validation,
  placeholder,
  className,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-2 text-left">
      <label className=" font-[600] text-[15px] text-[#02052F]" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        {...register(name, validation)}
        placeholder={placeholder}
        className={`${className} ${errors[name] ? "border-red-500" : null}`}
      />
      {errors[name] && (
        <span className="text-red-600">{errors[name]?.message}</span>
      )}
    </div>
  );
}
