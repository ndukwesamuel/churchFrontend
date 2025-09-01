import React from "react";
import { IoClose } from "react-icons/io5";

export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  image,
  paragraph,
  button1,
  button2,
}) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" bg-primary p-6 rounded-lg relative w-[90%] max-w-xl text-[14px] text-primary font-[400]">
        <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
          <div className="mt-4 text-center flex flex-col justify-center items-center gap-2 px-4 py-8 md:px-8 lg:px-16">
            <img className="w-3/4 md:w-1/2 mx-auto" src={image} alt="" />
            <div className="text-[#02052F] text-2xl font-semibold ">{icon}</div>
            <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-sweet-affogato text-secondary font-semibold">
              {title}
            </h2>
            <p className="mt-2 text-[16px] md:text-[18px] lg:text-[21.95px] text-[#02052F] font-normal text-secondary">
              {paragraph}
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-center">
              {button1 ? <>{button1}</> : null}
              {button2 ? <>{button2}</> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
