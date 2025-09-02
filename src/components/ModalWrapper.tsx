import React from "react";
import { IoClose } from "react-icons/io5";

export default function ModalWrapper({ heading, isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded-lg relative w-[90%] max-w-2xl text-[14px] text-primary font-[400]">
        <div className="bg-white p-6 py-14 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className=" font-semibold text-2xl">{heading}</span>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900"
            >
              <IoClose
                size={24}
                className=" bg-gray-100 rounded-full p-1 text-gray-500"
              />
            </button>
          </div>
          <div className=" max-h-[70vh]"> {children}</div>
        </div>
      </div>
    </div>
  );
}
