import React from "react";

export default function GuarantorHeader({ guarantor, isOpen, path }) {
  if (!isOpen) {
    return null;
  }

  const isVerified = guarantor?.is_submitted
    ? "bg-purple-100"
    : guarantor?.isVerified
    ? `bg-green-100 text-green-500`
    : "bg-orange-100 text-yellow-500";

  const statusText = guarantor?.is_submitted
    ? "Submitted"
    : guarantor?.isVerified
    ? `Verified`
    : "Pending";

  const signatureLink = guarantor?.signature;
  const isSignatureAvailable = !!signatureLink;

  console.log(guarantor);

  return (
    <div className="px-2 flex flex-col gap-2 py-4">
      <div className="flex justify-between gap-4">
        <p className="w-1/4 text-left">Name</p>
        <p className="w-1/4 text-left">Signature</p>
        <p className="w-1/4 text-left">Uploaded Document</p>
        <p className="w-1/4 text-right">Status</p>
      </div>
      <div className="flex justify-between font-semibold gap-4">
        <p className="w-1/4 text-left">
          {guarantor?.[`${path}_guarantor_name`]}
        </p>
        <a
          href={isSignatureAvailable ? signatureLink : undefined}
          target={isSignatureAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`w-1/4 ${
            isSignatureAvailable
              ? "text-blue-800 underline"
              : "text-gray-500 cursor-not-allowed"
          } text-left`}
        >
          {isSignatureAvailable ? "View Uploaded" : "No Signature"}
        </a>
        <a
          href={guarantor?.credential}
          target="_blank"
          rel="noopener noreferrer"
          className="w-1/4 text-blue-800 underline text-left"
        >
          View Uploaded
        </a>
        <p className="w-1/4 text-right font-normal">
          <span className={`px-3 py-1 rounded-full text-sm ${isVerified}`}>
            {statusText}
          </span>
        </p>
      </div>
    </div>
  );
}
