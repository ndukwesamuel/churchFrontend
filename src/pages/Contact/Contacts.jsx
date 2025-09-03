import React, { useState } from "react";
import { FiMail, FiPhone, FiEdit2, FiTrash } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
// import React from "react";
import { IoClose } from "react-icons/io5";
import { useFetchData } from "../../hook/Request";
// import AddContactModal from "./AddContactModal";

// export default function Contacts() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { data: settingApiData, refetch: refetchIncomeData } = useFetchData(
//     `/api/v1/contacts`,
//     "contacts" // Changed query key for clarity
//   );

//   console.log({
//     fff: settingApiData,
//   });

//   const contacts = [
//     {
//       id: 1,
//       name: "John Smith",
//       email: "admin@gracechurch.com",
//       phone: "+1 (555) 345-7890",
//       status: "Active",
//       groups: ["Members", "Youth Ministry"],
//     },
//     {
//       id: 2,
//       name: "John Smith",
//       email: "admin@gracechurch.com",
//       phone: "+1 (555) 345-7890",
//       status: "Active",
//       groups: ["Members", "Youth Ministry"],
//     },
//   ];

//   return (
//     <div className="p-6 flex-1">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold">Contact Management</h1>
//           <p className="text-gray-500">
//             Manage your congregation contacts and groups
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
//         >
//           + Add Contact
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-gray-500">Total Contact</p>
//           <h2 className="text-2xl font-bold">4</h2>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-gray-500">Active Members</p>
//           <h2 className="text-2xl font-bold">3</h2>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-gray-500">Groups</p>
//           <h2 className="text-2xl font-bold">4</h2>
//         </div>
//       </div>

//       {/* Search + Filter */}
//       <div className="flex justify-between items-center mb-6">
//         <input
//           type="text"
//           placeholder="Search customers"
//           className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:ring-2 focus:ring-purple-500"
//         />
//         <select className="border border-gray-300 rounded-md px-3 py-2">
//           <option>All Groups</option>
//         </select>
//       </div>

//       {/* Contact Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {contacts.map((contact) => (
//           <div
//             key={contact.id}
//             className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
//           >
//             <div className="flex justify-between items-center">
//               <AiOutlineUser className="text-3xl text-purple-500" />
//               <div className="flex gap-2">
//                 <button className="text-gray-500 hover:text-gray-700">
//                   <FiEdit2 />
//                 </button>
//                 <button className="text-gray-500 hover:text-red-600">
//                   <FiTrash />
//                 </button>
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold">{contact.name}</h3>
//             <span className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-md w-fit">
//               {contact.status}
//             </span>
//             <div className="flex items-center gap-2 text-gray-600 text-sm">
//               <FiMail /> {contact.email}
//             </div>
//             <div className="flex items-center gap-2 text-gray-600 text-sm">
//               <FiPhone /> {contact.phone}
//             </div>
//             <div className="flex gap-2 flex-wrap mt-2">
//               {contact.groups.map((group, i) => (
//                 <span
//                   key={i}
//                   className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
//                 >
//                   {group}
//                 </span>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Contact Modal */}
//       {isModalOpen && <AddContactModal onClose={() => setIsModalOpen(false)} />}
//     </div>
//   );
// }

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: settingApiData, refetch } = useFetchData(
    `/api/v1/contacts`,
    "contacts"
  );

  const contacts = settingApiData?.data?.members || [];

  return (
    <div className="p-6 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Contact Management</h1>
          <p className="text-gray-500">
            Manage your congregation contacts and groups
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          + Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Total Contact</p>
          <h2 className="text-2xl font-bold">
            {settingApiData?.data?.memberCount || 0}
          </h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Active Members</p>
          <h2 className="text-2xl font-bold">
            {contacts.filter((c) => c.status === "active").length}
          </h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Groups</p>
          <h2 className="text-2xl font-bold">
            {[...new Set(contacts.map((c) => c.group))].length}
          </h2>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <AiOutlineUser className="text-3xl text-purple-500" />
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <FiEdit2 />
                </button>
                <button className="text-gray-500 hover:text-red-600">
                  <FiTrash />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{contact.fullName}</h3>
            <span className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-md w-fit">
              {contact.status}
            </span>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FiMail /> {contact.email}
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FiPhone /> {contact.phoneNumber}
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {contact.group}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && <AddContactModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function AddContactModal({ onClose }) {
  const { data: settingApiData, refetch: refetchIncomeData } = useFetchData(
    `/api/v1/setting`,
    "profilesetting" // Changed query key for clarity
  );

  console.log({
    cccc: settingApiData?.data?.user?.groups,
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full sm:w-[400px] h-full p-6 overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Contact Info</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>
        <p className="text-gray-500 mb-4">
          Fill in the details below to add a new contact to your records
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="John Smith"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Status</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="johnsmith@email.com"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 345-7890"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Member</option>
              <option>Leader</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Group</label>
            <select className="w-full border rounded-md px-3 py-2">
              {settingApiData?.data?.user?.groups?.map((group, index) => (
                <option key={group?._id}>{group?.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Save Contact
          </button>
        </form>
      </div>
    </div>
  );
}
