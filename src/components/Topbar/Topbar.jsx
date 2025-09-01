import React from "react";
import wavingIcon from "../../assets/icons/waving-hand.png";
import { BsPeopleFill } from "react-icons/bs";
import { BiSolidUserPin } from "react-icons/bi";
import { useCandidateStore } from "../../store/useCandidateStore";

export default function Topbar() {
  const { pagination } = useCandidateStore();

  return (
    <div className=" flex flex-col gap-y-4 bg-white border border-gray-200 rounded-lg overflow-hidden p-5 justify-start">
      <div className="flex gap-x-4">
        <img src={wavingIcon} alt="" />
        <p className="text-secondary text-[16px] font-[600]"> Welcome Admin</p>
      </div>
      <div className="flex gap-x-4">
        <div className=" flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
          <BsPeopleFill className="text-primary" size={44} />
          <div>
            <p className="text-[16px] font-[500] text-secondary">Candidates</p>
            <p className="text-[20px] font-[700] text-secondary">
              {pagination?.totalCount?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
        <div className=" flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
          <BiSolidUserPin className="text-primary" size={44} />
          <div>
            <p className="text-[16px] font-[500] text-secondary">
              Field Officers
            </p>
            <p className="text-[20px] font-[700] text-secondary">34,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
