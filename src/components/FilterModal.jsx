import React, { useState } from "react";

export default function FilterModal({ isOpen, onClose, onApply }) {
  const [submissionStatus, setSubmissionStatus] = useState(null);

  if (!isOpen) return null;

  const submissionStatusOptions = [0, 1, 2, 3];

  const handleApply = () => {
    onApply({ submittedStatus: submissionStatus });
    onClose();
  };

  return (
    <div className="bg-white p-5 rounded-lg w-full max-w-md absolute shadow-lg top-12">
      <div className="flex flex-col gap-2">
        {/* Specific Status Options */}
        {submissionStatusOptions.map((status) => (
          <label key={status} className="flex items-center gap-2">
            <input
              type="radio"
              name="submissionStatus"
              value={status}
              checked={submissionStatus === status}
              onChange={() => setSubmissionStatus(status)}
            />
            <span>{`${status}/2 Submitted`}</span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2 mt-4">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
          Cancel
        </button>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
