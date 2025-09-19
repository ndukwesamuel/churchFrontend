// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { IoClose } from "react-icons/io5";
// import { useMutateData } from "../../hook/Request";

// export default function BulkUploadContacts({ onClose }) {
//   const [contacts, setContacts] = useState([]);
//   const [fileName, setFileName] = useState(null);

//   const { mutate: bulkUpload, isLoading } = useMutateData("contacts");

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setFileName(file.name);

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: "array" });

//       // get first sheet
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const rows = XLSX.utils.sheet_to_json(sheet);

//       /*
//        Expected Excel Columns:
//        fullName | email | phoneNumber | status | role | groupId
//       */

//       setContacts(rows);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleSubmit = () => {
//     if (!contacts.length) {
//       alert("No contacts found in file!");
//       return;
//     }

//     bulkUpload(
//       {
//         url: "/api/v1/contacts/bulk",
//         data: { contacts },
//       },
//       {
//         onSuccess: () => {
//           alert("Contacts uploaded successfully!");
//           onClose();
//         },
//         onError: (err) => {
//           console.error("Bulk upload failed:", err);
//         },
//       }
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white w-full sm:w-[600px] p-6 rounded-lg shadow-lg">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Bulk Upload Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-black">
//             <IoClose size={24} />
//           </button>
//         </div>

//         {/* Upload */}
//         <div className="border-dashed border-2 border-gray-400 p-6 rounded-lg text-center mb-4">
//           <input
//             type="file"
//             accept=".xlsx, .xls, .csv"
//             onChange={handleFileUpload}
//             className="hidden"
//             id="fileUpload"
//           />
//           <label
//             htmlFor="fileUpload"
//             className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
//           >
//             Upload Excel File
//           </label>
//           {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
//         </div>

//         {/* Preview Table */}
//         {contacts.length > 0 && (
//           <div className="overflow-x-auto max-h-60 border rounded-md">
//             <table className="w-full text-sm text-left">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2">Full Name</th>
//                   <th className="px-4 py-2">Email</th>
//                   <th className="px-4 py-2">Phone</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Role</th>
//                   <th className="px-4 py-2">Group</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contacts.map((c, idx) => (
//                   <tr key={idx} className="border-t">
//                     <td className="px-4 py-2">{c.fullName}</td>
//                     <td className="px-4 py-2">{c.email}</td>
//                     <td className="px-4 py-2">{c.phoneNumber}</td>
//                     <td className="px-4 py-2">{c.status}</td>
//                     <td className="px-4 py-2">{c.role}</td>
//                     <td className="px-4 py-2">{c.groupId}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
//         >
//           {isLoading ? "Uploading..." : "Save All Contacts"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { IoClose } from "react-icons/io5";
import { useMutateData, useFetchData } from "../../hook/Request";

export default function BulkUploadContacts({ onClose }) {
  const [contacts, setContacts] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [role, setRole] = useState("Member");
  const [groupId, setGroupId] = useState("");

  const { data: groupData } = useFetchData(`/api/v1/groups`, "groups");
  const { mutate: bulkUpload, isLoading } = useMutateData("contacts");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // get first sheet
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      /*
       Expected Excel Columns:
       fullName | email | phoneNumber | status
      */

      setContacts(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = () => {
    if (!contacts.length) {
      alert("No contacts found in file!");
      return;
    }
    if (!groupId) {
      alert("Please select a group for all contacts.");
      return;
    }

    // Apply role + groupId to all contacts
    const finalContacts = contacts.map((c) => ({
      ...c,
      role,
      groupId,
    }));

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
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full sm:w-[650px] p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bulk Upload Contacts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        {/* Role + Group Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Member">Member</option>
              <option value="Leader">Leader</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Group</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
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
            Upload Excel File
          </label>
          {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
        </div>

        {/* Preview Table */}
        {contacts.length > 0 && (
          <div className="overflow-x-auto max-h-60 border rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Role (Applied)</th>
                  <th className="px-4 py-2">Group (Applied)</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{c.fullName}</td>
                    <td className="px-4 py-2">{c.email}</td>
                    <td className="px-4 py-2">{c.phoneNumber}</td>
                    <td className="px-4 py-2">{c.status}</td>
                    <td className="px-4 py-2">{role}</td>
                    <td className="px-4 py-2">
                      {
                        groupData?.data?.groups?.find((g) => g._id === groupId)
                          ?.name
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : "Save All Contacts"}
        </button>
      </div>
    </div>
  );
}
