import React, { useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/Topbar/Topbar";
import Button from "../../components/Button";
import Table from "../../components/Table";
import FormModal from "./FormModal";
import SearchInput from "../../components/SearchInput";

export default function FieldOfficers() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = () => {};

  return (
    <div className="overflow-hidden w-full">
      <div className="flex-1 min-h-dvh">
        <Topbar />
        <div className="mt-4 bg-white border rounded p-5">
          <div className="py-4 flex items-center justify-between">
            <p className="text-2xl font-medium text-[#02052F]">
              Field Officers
            </p>
            <div className="flex gap-2">
              <SearchInput />

              <Button
                text="Add Officers"
                className="bg-[#1710E1] p-2 rounded-lg text-white w-40"
                onClick={openModal}
              />
            </div>
          </div>
        </div>
      </div>
      <FormModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
