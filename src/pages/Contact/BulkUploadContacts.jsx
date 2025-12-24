import React, { useState } from "react";
import * as XLSX from "xlsx";
import { IoClose, IoTrash, IoOpenOutline } from "react-icons/io5";
import { useMutateData, useFetchData } from "../../hook/Request";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Google Sheet template link - Replace with your actual Google Sheet link
const GOOGLE_SHEET_TEMPLATE_URL =
  "https://docs.google.com/spreadsheets/d/1KGO_QMhi53svJ6DV0LoJsMo3lRTGuSblKJSsH75j4Cw/edit?usp=sharing";

export default function BulkUploadContacts({ onClose }) {
  const [contacts, setContacts] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [defaultRole, setDefaultRole] = useState("Member");
  const [defaultGroupId, setDefaultGroupId] = useState("");
  const [defaultStatus, setDefaultStatus] = useState("Active");

  const { data: groupData } = useFetchData(`/api/v1/groups`, "groups");
  const { mutate: bulkUpload, isLoading } = useMutateData("contacts");

  const handleOpenGoogleSheet = () => {
    window.open(GOOGLE_SHEET_TEMPLATE_URL, "_blank");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const fileExtension = file.name.split(".").pop().toLowerCase();

    const reader = new FileReader();

    reader.onload = (event) => {
      let workbook;

      if (fileExtension === "csv") {
        const csvData = event.target.result;
        workbook = XLSX.read(csvData, { type: "string" });
      } else {
        const data = new Uint8Array(event.target.result);
        workbook = XLSX.read(data, { type: "array" });
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const normalizedRows = rows.map((row, index) => ({
        id: index,
        fullName:
          row["Full Name"] ||
          row["fullName"] ||
          row["FullName"] ||
          row["name"] ||
          row["Name"] ||
          "",
        email: row["Email"] || row["email"] || "",
        phoneNumber:
          row["Phone Number"] ||
          row["Phone"] ||
          row["phoneNumber"] ||
          row["PhoneNumber"] ||
          row["phone"] ||
          "",
        birthDay: row["Birth Day"] || row["birthDay"] || row["Day"] || "",
        birthMonth:
          row["Birth Month"] || row["birthMonth"] || row["Month"] || "",
        status: row["Status"] || row["status"] || "",
        role: row["Role"] || row["role"] || "",
        groupId: row["Group"] || row["group"] || row["groupId"] || "",
      }));

      const validRows = normalizedRows.filter(
        (row) => row.fullName || row.email || row.phoneNumber
      );

      setContacts(validRows);
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
      setFileName(null);
    };

    if (fileExtension === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleContactChange = (index, field, value) => {
    setContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleDeleteContact = (index) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const applyDefaultsToAll = () => {
    setContacts((prev) =>
      prev.map((contact) => ({
        ...contact,
        status: contact.status || defaultStatus,
        role: contact.role || defaultRole,
        groupId: contact.groupId || defaultGroupId,
      }))
    );
  };

  const handleSubmit = () => {
    if (!contacts.length) {
      alert("No contacts found in file!");
      return;
    }

    const invalidContacts = contacts.filter(
      (c) => !c.fullName || !c.phoneNumber || !c.groupId
    );

    if (invalidContacts.length > 0) {
      alert(
        `${invalidContacts.length} contact(s) are missing required fields (Full Name, Phone Number, or Group). Please fix them before uploading.`
      );
      return;
    }

    const finalContacts = contacts.map((c) => {
      let groupIdValue = c.groupId;

      if (groupIdValue && !groupIdValue.match(/^[a-f\d]{24}$/i)) {
        const foundGroup = groupData?.data?.groups?.find(
          (g) => g.name.toLowerCase() === groupIdValue.toLowerCase()
        );
        groupIdValue = foundGroup?._id || groupIdValue;
      }

      return {
        fullName: c.fullName,
        email: c.email,
        phoneNumber: c.phoneNumber,
        birthDay: c.birthDay,
        birthMonth: c.birthMonth,
        status: c.status || defaultStatus,
        role: c.role || defaultRole,
        groupId: groupIdValue || defaultGroupId,
      };
    });

    bulkUpload(
      {
        url: "/api/v1/contacts/bulk",
        data: { contacts: finalContacts },
      },
      {
        onSuccess: () => {
          alert("Contacts uploaded successfully!");
          onClose();
        },
        onError: (err) => {
          console.error("Bulk upload failed:", err);
          alert("Failed to upload contacts. Please try again.");
        },
      }
    );
  };

  const handleClearFile = () => {
    setContacts([]);
    setFileName(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Bulk Upload Contacts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {/* Instructions with Google Sheet Link */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Accepted formats: .xlsx, .xls, .csv
                </p>
                <p className="text-xs text-blue-600">
                  Columns: Full Name, Email, Phone Number, Birth Day, Birth
                  Month, Status, Role, Group
                </p>
              </div>

              {/* Google Sheet Template Link */}
              <div className="bg-white border border-blue-300 rounded-md p-3">
                <p className="text-sm text-gray-700 mb-2">
                  📋 <span className="font-medium">Need a template?</span> Use
                  our Google Sheet sample:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleOpenGoogleSheet}
                    // className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    <IoOpenOutline size={18} />
                    Open Google Sheet Template
                  </button>
                  <p className="text-xs text-gray-500 self-center">
                    Click "File" → "Make a copy" → Fill your data → Download as
                    .xlsx or .csv
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Groups Info */}
          {groupData?.data?.groups?.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Available Groups:</span> Use these
                exact names in your Excel/CSV file
              </p>
              <div className="flex flex-wrap gap-2">
                {groupData?.data?.groups?.map((g) => (
                  <span
                    key={g._id}
                    className="bg-white border px-2 py-1 rounded text-xs text-gray-700"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Default Values */}
          <div className="bg-gray-50 border rounded-md p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Default values (applied to empty fields)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Default Status
                </label>
                <select
                  value={defaultStatus}
                  onChange={(e) => setDefaultStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Default Role
                </label>
                <select
                  value={defaultRole}
                  onChange={(e) => setDefaultRole(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="Member">Member</option>
                  <option value="Leader">Leader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Default Group
                </label>
                <select
                  value={defaultGroupId}
                  onChange={(e) => setDefaultGroupId(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">-- Select Group --</option>
                  {groupData?.data?.groups?.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {contacts.length > 0 && (
              <button
                onClick={applyDefaultsToAll}
                className="mt-3 text-sm text-purple-600 hover:text-purple-800 underline"
              >
                Apply defaults to all empty fields
              </button>
            )}
          </div>

          {/* Upload */}
          <div className="border-dashed border-2 border-gray-400 p-6 rounded-lg text-center mb-4">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Upload Excel or CSV File
            </label>
            {fileName && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <p className="text-sm text-gray-500">{fileName}</p>
                <button
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  (Clear)
                </button>
              </div>
            )}
          </div>

          {/* Preview Table */}
          {contacts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold">{contacts.length}</span>{" "}
                  contacts
                </p>
                <p className="text-xs text-gray-400">
                  ← Scroll horizontally to see all columns →
                </p>
              </div>

              {/* Scrollable Table Container */}
              <div className="border rounded-md">
                <div className="overflow-x-auto">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 font-medium text-gray-700 w-12">
                            #
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[180px]">
                            Full Name
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[220px]">
                            Email
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[160px]">
                            Phone Number
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[100px]">
                            Birth Day
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[140px]">
                            Birth Month
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[120px]">
                            Status
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[120px]">
                            Role
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 min-w-[160px]">
                            Group
                          </th>
                          <th className="px-4 py-3 font-medium text-gray-700 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {contacts.map((c, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-400 font-medium">
                              {idx + 1}
                            </td>

                            {/* Full Name */}
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={c.fullName}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "fullName",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter full name"
                              />
                            </td>

                            {/* Email */}
                            <td className="px-4 py-3">
                              <input
                                type="email"
                                value={c.email}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "email",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="email@example.com"
                              />
                            </td>

                            {/* Phone Number */}
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={c.phoneNumber}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "phoneNumber",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="08012345678"
                              />
                            </td>

                            {/* Birth Day */}
                            <td className="px-4 py-3">
                              <select
                                value={c.birthDay}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "birthDay",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                              >
                                <option value="">Day</option>
                                {DAYS.map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Birth Month */}
                            <td className="px-4 py-3">
                              <select
                                value={c.birthMonth}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "birthMonth",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                              >
                                <option value="">Month</option>
                                {MONTHS.map((month) => (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <select
                                value={c.status || defaultStatus}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "status",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </td>

                            {/* Role */}
                            <td className="px-4 py-3">
                              <select
                                value={c.role || defaultRole}
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "role",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                              >
                                <option value="Member">Member</option>
                                <option value="Leader">Leader</option>
                              </select>
                            </td>

                            {/* Group */}
                            <td className="px-4 py-3">
                              <select
                                value={
                                  groupData?.data?.groups?.find(
                                    (g) =>
                                      g._id === c.groupId ||
                                      g.name.toLowerCase() ===
                                        c.groupId?.toLowerCase()
                                  )?._id ||
                                  c.groupId ||
                                  defaultGroupId
                                }
                                onChange={(e) =>
                                  handleContactChange(
                                    idx,
                                    "groupId",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                              >
                                <option value="">Select Group</option>
                                {groupData?.data?.groups?.map((g) => (
                                  <option key={g._id} value={g._id}>
                                    {g.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Delete */}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDeleteContact(idx)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete contact"
                              >
                                <IoTrash size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Table scroll hint for mobile */}
              <p className="text-xs text-gray-400 mt-2 text-center sm:hidden">
                Swipe left/right to see more columns
              </p>
            </>
          )}
        </div>

        {/* Footer with Submit Button */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !contacts.length}
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading
              ? "Uploading..."
              : `Save ${contacts.length || ""} Contacts`}
          </button>
        </div>
      </div>
    </div>
  );
}
