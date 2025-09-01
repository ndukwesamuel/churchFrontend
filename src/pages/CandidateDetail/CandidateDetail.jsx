import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useCandiateActions,
  useCandidateStore,
} from "../../store/useCandidateStore";
import GuarantorView from "./GuarantorView";
import GuarantorHeader from "./GuarantorHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import Button from "../../components/Button";

const DetailSection = ({ title, children }) => (
  <div className="border p-2 rounded">
    {title && <p className="font-semibold py-4">{title}</p>}
    <div className="flex flex-col divide-y">{children}</div>
  </div>
);

const DetailRow = ({
  label,
  value,
  isValueLink,
  endLabel,
  endValue,
  isEndValueLink,
}) => (
  <div className="py-2 flex justify-between">
    <div className="flex flex-col gap-2">
      <p>{label}</p>
      <p
        className={`font-semibold ${
          isValueLink ? "text-blue-600 underline" : ""
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
    <div className="flex flex-col items-end gap-4">
      <p>{endLabel}</p>
      <p
        className={`font-semibold ${
          isEndValueLink ? "text-blue-600 underline" : ""
        }`}
      >
        {endValue || "N/A"}
      </p>
    </div>
  </div>
);

export default function CandidateDetail() {
  const location = useLocation();
  const { state } = location;
  const {
    candidate,
    credentials,
    documents,
    isLoading,
    status,
    verificationInfo,
    searchParams,
  } = useCandidateStore();
  const { getCandidate } = useCandiateActions();

  console.log(searchParams);

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  useEffect(() => {
    if (state?.staff_id) {
      getCandidate(state.staff_id);
    }
  }, [state, getCandidate]);

  const toggleDetails = (setIsOpen, isOpen, setText, textOpen, textClose) => {
    setText(isOpen ? textClose : textOpen);
    setIsOpen(!isOpen);
  };

  const countGuarantors = (candidate) => {
    let guarantorCount = 0;

    if (candidate["1st_guarantor_name"]) guarantorCount += 1;
    if (candidate["2nd_guarantor_name"]) guarantorCount += 1;
    if (candidate["3rd_guarantor_name"]) guarantorCount += 1;

    return guarantorCount;
  };

  const [firstText, setFirstText] = useState("View Details");
  const [secondText, setSecondText] = useState("View Details");
  const [thirdText, setThirdText] = useState("View Details");

  const firstGuarantor = {
    ...documents?.find((doc) => doc?.document_name?.includes("Guarantor 1")),
    ...verificationInfo?.guarantor1,
    ...Object.keys(candidate || {})
      .filter(
        (key) =>
          key.startsWith("1st_guarantor") || key.startsWith("n_1st_guarantor")
      )
      .reduce((acc, key) => ({ ...acc, [key]: candidate[key] }), {}),
  };

  const secondGuarantor = {
    ...documents?.find((doc) => doc?.document_name?.includes("Guarantor 2")),
    ...verificationInfo?.guarantor2,
    ...Object.keys(candidate || {})
      .filter(
        (key) =>
          key.startsWith("2nd_guarantor") || key.startsWith("n_2nd_guarantor")
      )
      .reduce((acc, key) => ({ ...acc, [key]: candidate[key] }), {}),
  };

  const thirdGuarantor = {
    ...documents?.find((doc) => doc?.document_name?.includes("Guarantor 3")),
    ...verificationInfo?.guarantor3,
    ...Object.keys(candidate || {})
      .filter(
        (key) =>
          key.startsWith("3rd_guarantor") || key.startsWith("n_3rd_guarantor")
      )
      .reduce((acc, key) => ({ ...acc, [key]: candidate[key] }), {}),
  };

  // console.log(candidate);
  // console.log(status);
  console.log(verificationInfo);
  console.log(firstGuarantor);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white border rounded w-full p-2">
        <Link
          to="/"
          className="bg-white p-2 flex gap-2 items-center text-xl font-semibold group cursor-pointer"
        >
          <IoIosArrowRoundBack
            size={34}
            className="cursor-pointer group-hover:animate-shake"
          />
          Back
        </Link>

        <Button
          text="Sync"
          className="text-xl bg-primary text-white px-6 py-2 rounded font-semibold flex items-center"
          loading={isLoading}
          loadingText="Syncing..."
          onClick={() => getCandidate(state?.staff_id)}
        />
      </div>

      <div className="flex gap-4">
        <div className="border bg-white w-1/2 px-2 rounded py-4">
          <p className="pb-6 text-2xl font-semibold">
            {candidate?.surname} {candidate?.firstname}
          </p>
          <div className="flex flex-col gap-4">
            <DetailSection title="Personal Information">
              <DetailRow
                label="Passport"
                value="View Uploaded"
                endLabel="Gender"
                endValue={candidate?.sex}
              />
              <DetailRow
                label="Phone Number"
                value={candidate?.mobile_phone_number}
                endLabel="Email Address"
                endValue={candidate?.email_address}
              />
              <DetailRow
                label="Marital Status"
                value={candidate?.marital_status}
                endLabel="Date Of Birth"
                endValue={candidate?.date_of_birth}
              />
              <DetailRow
                label="No. Of Guarantor"
                value={countGuarantors(candidate)}
                endLabel="State Of Residents"
                endValue={candidate?.["1st_guarantor_state_code"]}
              />
              <DetailRow
                label="State Of Resident"
                value="N/A"
                endLabel="Client"
                endValue={candidate?.company_code}
              />
            </DetailSection>

            <DetailSection title="Other Details">
              <DetailRow
                label="State Of Origin"
                value={candidate?.state_origin}
                endLabel="Local Government"
                endValue={candidate?.local_govt_of_origin_code}
              />
              <DetailRow
                label="Pension Fund Administration"
                value={candidate?.pfa_code || "N/A"}
                endLabel="Pension Pin"
                endValue={candidate?.pension_pin || "N/A"}
              />
              <DetailRow
                label="BVN"
                value={candidate?.bvn}
                endLabel="NIN"
                endValue={candidate?.nin}
              />
              <DetailRow
                label="Account Number"
                value={candidate?.bank_account_number}
                endLabel="Bank Name"
                endValue={candidate?.payment_code}
              />
            </DetailSection>

            <DetailSection>
              <DetailRow
                label="Address 1"
                value={candidate?.current_address_1}
                endLabel="City"
                endValue={candidate?.current_address_town}
              />
              <DetailRow
                label="Address 2"
                value={candidate?.current_address_2 || "N/A"}
                endLabel="City"
                endValue={candidate?.current_address_town}
              />
            </DetailSection>
          </div>
        </div>

        <div className="flex flex-col gap-4 border bg-white w-1/2 p-2 py-6 rounded divide-y">
          <div className="p-2">
            <div className="flex justify-between items-center px-2 pb-4">
              <p className="text-2xl font-semibold">Guarantor 1</p>
              <button
                onClick={() =>
                  toggleDetails(
                    setIsOpen1,
                    isOpen1,
                    setFirstText,
                    "View Less",
                    "View Details"
                  )
                }
                className="underline text-blue-600 font-semibold"
              >
                {firstText}
              </button>
            </div>
            <div className="flex flex-col">
              <GuarantorHeader
                guarantor={firstGuarantor}
                isOpen={!isOpen1}
                path="1st"
              />
              <GuarantorView
                guarantor={firstGuarantor}
                isOpen={isOpen1}
                path="1st"
              />
            </div>
          </div>
          <div className="p-2">
            <div className="flex justify-between items-center px-2 pb-4">
              <p className="text-2xl font-semibold">Guarantor 2</p>
              <button
                onClick={() =>
                  toggleDetails(
                    setIsOpen2,
                    isOpen2,
                    setSecondText,
                    "View Less",
                    "View Details"
                  )
                }
                className="underline text-blue-600 font-semibold"
              >
                {secondText}
              </button>
            </div>
            <div className="flex flex-col">
              <GuarantorHeader
                guarantor={secondGuarantor}
                isOpen={!isOpen2}
                path="2nd"
              />
              <GuarantorView
                guarantor={secondGuarantor}
                isOpen={isOpen2}
                path="2nd"
              />
            </div>
          </div>

          {countGuarantors(candidate) > 2 ? (
            <div className="p-2">
              <div className="flex justify-between items-center px-2 pb-4">
                <p className="text-2xl font-semibold">Guarantor 3</p>
                <button
                  onClick={() =>
                    toggleDetails(
                      setIsOpen3,
                      isOpen3,
                      setThirdText,
                      "View Less",
                      "View Details"
                    )
                  }
                  className="underline text-blue-600 font-semibold"
                >
                  {thirdText}
                </button>
              </div>
              <div className="flex flex-col">
                <GuarantorHeader
                  guarantor={thirdGuarantor}
                  isOpen={!isOpen3}
                  path="3rd"
                />
                <GuarantorView
                  guarantor={thirdGuarantor}
                  isOpen={isOpen3}
                  path="3rd"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
