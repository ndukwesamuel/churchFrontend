import React from "react";
import Button from "../../components/Button";
import {
  useCandiateActions,
  useCandidateStore,
} from "../../store/useCandidateStore";

export default function GuarantorView({ guarantor, isOpen, path }) {
  const { candidate, isSubmitting } = useCandidateStore();
  const { verifyCandidateGuarantor } = useCandiateActions();
  const data = { guarantor_number: path.charAt(0) };

  console.log(data);
  console.log(candidate?.staff_id);
  console.log(isSubmitting);

  const isVerified = guarantor?.is_verified;

  console.log(guarantor);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="px-2 flex flex-col gap-2 py-4 divide-y">
      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/3 text-left">Name</p>
          <p className="w-1/3 text-left">Uploaded Document</p>
          <p className="w-1/3 text-right">Company</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/3 text-left">
            {guarantor?.[`${path}_guarantor_name`]}
          </p>
          <a
            href={guarantor?.credential}
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/3 text-blue-800 underline text-left"
          >
            View Uploaded
          </a>
          <p className="w-1/3 text-right">
            {guarantor?.[`n_${path}_guarantor_company`]}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/3 text-left">State</p>
          <p className="w-1/3 text-left">City</p>
          <p className="w-1/3 text-right">Email Address</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/3 text-left">
            {guarantor?.[`${path}_guarantor_state_code`]}
          </p>
          <p className="w-1/3 text-left">
            {guarantor?.[`${path}_guarantor_town`]}
          </p>
          <p className="w-1/3 text-right overflow-clip">
            {guarantor?.[`${path}_guarantor_email`]}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/2 text-left">Phone</p>
          <p className="w-1/2 text-right">Years</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/2 text-left">
            {guarantor?.[`${path}_guarantor_phone`]}
          </p>
          <p className="w-1/2 text-right">
            {guarantor?.[`n_${path}_guarantor_no_years`]}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/2 text-left">Residential Address</p>
          <p className="w-1/2 text-right">Relationship to Applicant</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/2 text-left flex flex-col gap-1">
            <span>{guarantor?.[`${path}_guarantor_address_1`]}.</span>
            <span>{guarantor?.[`${path}_guarantor_address_2`]}</span>
          </p>
          <p className="w-1/2 text-right">
            {guarantor?.[`n_${path}_guarantor_grade`]}
          </p>
        </div>
      </div>

      <div className=" flex items-center gap-4 py-4">
        <Button
          text={isVerified ? "Verified" : "Verify"}
          loadingText={`Verifying...`}
          loading={isSubmitting}
          disabled={isVerified ? true : isSubmitting}
          className="bg-primary text-white px-6 py-2 rounded-lg text-center flex items-center font-semibold"
          onClick={() => verifyCandidateGuarantor(candidate?.staff_id, data)}
        />
        <Button
          text="Not A Match"
          className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center font-semibold"
        />
      </div>
    </div>
  );
}
