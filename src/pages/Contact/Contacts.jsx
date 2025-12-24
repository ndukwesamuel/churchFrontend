// // import React, { useState } from "react";
// // import { FiMail, FiPhone, FiEdit2, FiTrash, FiCalendar } from "react-icons/fi";
// // import { AiOutlineUser } from "react-icons/ai";
// // import { useSelector } from "react-redux";
// // import { useDeleteData, useFetchData } from "../../hook/Request";
// // import BulkUploadContacts from "./BulkUploadContacts";
// // import AddContactModal from "./_components/addContactModal";

// // // Helper function to format birthday
// // const formatBirthday = (birthDay, birthMonth) => {
// //   if (!birthDay || !birthMonth) return null;

// //   const months = [
// //     "January",
// //     "February",
// //     "March",
// //     "April",
// //     "May",
// //     "June",
// //     "July",
// //     "August",
// //     "September",
// //     "October",
// //     "November",
// //     "December",
// //   ];

// //   const monthName = months[parseInt(birthMonth) - 1];
// //   const day = parseInt(birthDay);

// //   // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
// //   const getOrdinalSuffix = (day) => {
// //     if (day > 3 && day < 21) return "th";
// //     switch (day % 10) {
// //       case 1:
// //         return "st";
// //       case 2:
// //         return "nd";
// //       case 3:
// //         return "rd";
// //       default:
// //         return "th";
// //     }
// //   };

// //   return `${monthName} ${day}${getOrdinalSuffix(day)}`;
// // };

// // export default function Contacts() {
// //   const { contact } = useSelector((state) => state?.reducer?.AuthSlice);
// //   const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
// //   const [selectedContact, setSelectedContact] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   const { data: contactData, refetch } = useFetchData(
// //     `/api/v1/contacts`,
// //     "contacts"
// //   );
// //   const contacts = contactData?.data?.members || [];

// //   const { mutate: deleteContact, isLoading: isDeleting } =
// //     useDeleteData("contacts");

// //   const handleDelete = (id) => {
// //     if (window.confirm("Are you sure you want to delete this contact?")) {
// //       deleteContact(
// //         { url: `/api/v1/contacts/${id}`, method: "DELETE" },
// //         {
// //           onSuccess: () => refetch(),
// //           onError: (err) => console.error("Failed to delete contact:", err),
// //         }
// //       );
// //     }
// //   };

// //   return (
// //     <div className="p-6 flex-1">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="sm:text-2xl font-semibold text-darkBlueGray">
// //             Contact Management
// //           </h1>
// //           <p className="text-slateBlue text-sm sm:text-base font-normal">
// //             Manage your congregation contacts and groups
// //           </p>
// //         </div>

// //         <div className="flex gap-3">
// //           <button
// //             onClick={() => setIsBulkUploadModalOpen(true)}
// //             className="bg-gray-200 text-deepPurple px-4 py-2 rounded-md hover:bg-paleBlue font-medium"
// //           >
// //             Bulk Upload
// //           </button>

// //           <button
// //             onClick={() => {
// //               setSelectedContact(null);
// //               setIsModalOpen(true);
// //             }}
// //             className="bg-deepPurple text-white px-4 py-2 rounded-md hover:bg-deepPurple"
// //           >
// //             + Add Contact
// //           </button>
// //         </div>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-3 gap-4 mb-6">
// //         <div className="bg-white shadow rounded-lg p-4">
// //           <p className="text-gray-500">Total Contacts</p>
// //           <h2 className="text-2xl font-bold">
// //             {contactData?.data?.memberCount || 0}
// //           </h2>
// //         </div>
// //         <div className="bg-white shadow rounded-lg p-4">
// //           <p className="text-gray-500">Active Members</p>
// //           <h2 className="text-2xl font-bold">
// //             {contacts.filter((c) => c.status === "active").length}
// //           </h2>
// //         </div>
// //         <div className="bg-white shadow rounded-lg p-4">
// //           <p className="text-gray-500">Groups</p>
// //           <h2 className="text-2xl font-bold">
// //             {contactData?.data?.groupTotal || 0}
// //           </h2>
// //         </div>
// //       </div>

// //       {/* Contact Cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //         {contacts.map((contact) => {
// //           const birthday = formatBirthday(contact.birthDay, contact.birthMonth);

// //           return (
// //             <div
// //               key={contact._id}
// //               className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
// //             >
// //               <div className="flex justify-between items-center">
// //                 <AiOutlineUser className="text-3xl text-purple-500" />
// //                 <div className="flex gap-2">
// //                   <button
// //                     className="text-gray-500 hover:text-gray-700"
// //                     onClick={() => {
// //                       setSelectedContact(contact);
// //                       setIsModalOpen(true);
// //                     }}
// //                   >
// //                     <FiEdit2 />
// //                   </button>

// //                   <button
// //                     className="text-gray-500 hover:text-red-600"
// //                     onClick={() => handleDelete(contact._id)}
// //                     disabled={isDeleting}
// //                   >
// //                     <FiTrash />
// //                   </button>
// //                 </div>
// //               </div>
// //               <h3 className="text-lg font-semibold">{contact.fullName}</h3>
// //               <span className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-md w-fit">
// //                 {contact.status}
// //               </span>
// //               <div className="flex items-center gap-2 text-gray-600 text-sm">
// //                 <FiMail /> {contact.email}
// //               </div>
// //               <div className="flex items-center gap-2 text-gray-600 text-sm">
// //                 <FiPhone /> {contact.phoneNumber}
// //               </div>

// //               {/* Birthday Display */}
// //               {birthday && (
// //                 <div className="flex items-center gap-2 text-gray-600 text-sm">
// //                   <FiCalendar />
// //                   <span className="text-purple-600 font-medium">
// //                     {birthday}
// //                   </span>
// //                 </div>
// //               )}

// //               <div className="flex gap-2 flex-wrap mt-2">
// //                 <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
// //                   {contact?.group?.name || "No Group"}
// //                 </span>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* Modals */}
// //       {isModalOpen && (
// //         <AddContactModal
// //           onClose={() => {
// //             setIsModalOpen(false);
// //             refetch(); // refresh contacts after add/edit
// //           }}
// //           contact={selectedContact}
// //         />
// //       )}

// //       {isBulkUploadModalOpen && (
// //         <BulkUploadContacts
// //           onClose={() => {
// //             setIsBulkUploadModalOpen(false);
// //             refetch();
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import {
//   FiMail,
//   FiPhone,
//   FiEdit2,
//   FiTrash,
//   FiCalendar,
//   FiGrid,
//   FiList,
// } from "react-icons/fi";
// import { AiOutlineUser } from "react-icons/ai";
// import { useSelector } from "react-redux";
// import { useDeleteData, useFetchData } from "../../hook/Request";
// import BulkUploadContacts from "./BulkUploadContacts";
// import AddContactModal from "./_components/addContactModal";

// // Helper function to format birthday
// const formatBirthday = (birthDay, birthMonth) => {
//   if (!birthDay || !birthMonth) return null;

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const monthName = months[parseInt(birthMonth) - 1];
//   const day = parseInt(birthDay);

//   const getOrdinalSuffix = (day) => {
//     if (day > 3 && day < 21) return "th";
//     switch (day % 10) {
//       case 1:
//         return "st";
//       case 2:
//         return "nd";
//       case 3:
//         return "rd";
//       default:
//         return "th";
//     }
//   };

//   return `${monthName} ${day}${getOrdinalSuffix(day)}`;
// };

// export default function Contacts() {
//   const { contact } = useSelector((state) => state?.reducer?.AuthSlice);
//   const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("card"); // "card" or "table"

//   const { data: contactData, refetch } = useFetchData(
//     `/api/v1/contacts`,
//     "contacts"
//   );
//   const contacts = contactData?.data?.members || [];

//   const { mutate: deleteContact, isLoading: isDeleting } =
//     useDeleteData("contacts");

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this contact?")) {
//       deleteContact(
//         { url: `/api/v1/contacts/${id}`, method: "DELETE" },
//         {
//           onSuccess: () => refetch(),
//           onError: (err) => console.error("Failed to delete contact:", err),
//         }
//       );
//     }
//   };

//   return (
//     <div className="p-6 flex-1">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="sm:text-2xl font-semibold text-darkBlueGray">
//             Contact Management
//           </h1>
//           <p className="text-slateBlue text-sm sm:text-base font-normal">
//             Manage your congregation contacts and groups
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => setIsBulkUploadModalOpen(true)}
//             className="bg-gray-200 text-deepPurple px-4 py-2 rounded-md hover:bg-paleBlue font-medium"
//           >
//             Bulk Upload
//           </button>

//           <button
//             onClick={() => {
//               setSelectedContact(null);
//               setIsModalOpen(true);
//             }}
//             className="bg-deepPurple text-white px-4 py-2 rounded-md hover:bg-deepPurple"
//           >
//             + Add Contact
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-gray-500">Total Contacts</p>
//           <h2 className="text-2xl font-bold">
//             {contactData?.data?.memberCount || 0}
//           </h2>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-gray-500">Active Members</p>
//           <h2 className="text-2xl font-bold">
//             {contacts.filter((c) => c.status === "active").length}
//           </h2>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4">
//           <p className="text-gray-500">Groups</p>
//           <h2 className="text-2xl font-bold">
//             {contactData?.data?.groupTotal || 0}
//           </h2>
//         </div>
//       </div>

//       {/* View Toggle */}
//       <div className="flex justify-end mb-4">
//         <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
//           <button
//             onClick={() => setViewMode("card")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
//               viewMode === "card"
//                 ? "bg-white text-deepPurple shadow-sm"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             <FiGrid size={18} />
//             <span className="text-sm font-medium">Cards</span>
//           </button>
//           <button
//             onClick={() => setViewMode("table")}
//             className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
//               viewMode === "table"
//                 ? "bg-white text-deepPurple shadow-sm"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             <FiList size={18} />
//             <span className="text-sm font-medium">Table</span>
//           </button>
//         </div>
//       </div>

//       {/* Card View */}
//       {viewMode === "card" && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {contacts.map((contact) => {
//             const birthday = formatBirthday(
//               contact.birthDay,
//               contact.birthMonth
//             );

//             return (
//               <div
//                 key={contact._id}
//                 className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
//               >
//                 <div className="flex justify-between items-center">
//                   <AiOutlineUser className="text-3xl text-purple-500" />
//                   <div className="flex gap-2">
//                     <button
//                       className="text-gray-500 hover:text-gray-700"
//                       onClick={() => {
//                         setSelectedContact(contact);
//                         setIsModalOpen(true);
//                       }}
//                     >
//                       <FiEdit2 />
//                     </button>

//                     <button
//                       className="text-gray-500 hover:text-red-600"
//                       onClick={() => handleDelete(contact._id)}
//                       disabled={isDeleting}
//                     >
//                       <FiTrash />
//                     </button>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold">{contact.fullName}</h3>
//                 <span className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-md w-fit">
//                   {contact.status}
//                 </span>
//                 <div className="flex items-center gap-2 text-gray-600 text-sm">
//                   <FiMail /> {contact.email}
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600 text-sm">
//                   <FiPhone /> {contact.phoneNumber}
//                 </div>

//                 {birthday && (
//                   <div className="flex items-center gap-2 text-gray-600 text-sm">
//                     <FiCalendar />
//                     <span className="text-purple-600 font-medium">
//                       {birthday}
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex gap-2 flex-wrap mt-2">
//                   <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
//                     {contact?.group?.name || "No Group"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Table View */}
//       {viewMode === "table" && (
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
//                     Name
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
//                     Email
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
//                     Phone
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
//                     Birthday
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
//                     Group
//                   </th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
//                     Status
//                   </th>
//                   <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {contacts.map((contact) => {
//                   const birthday = formatBirthday(
//                     contact.birthDay,
//                     contact.birthMonth
//                   );

//                   return (
//                     <tr
//                       key={contact._id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                             <AiOutlineUser className="text-xl text-purple-500" />
//                           </div>
//                           <span className="font-medium text-gray-900">
//                             {contact.fullName}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600 text-sm">
//                         {contact.email || "-"}
//                       </td>
//                       <td className="px-6 py-4 text-gray-600 text-sm">
//                         {contact.phoneNumber}
//                       </td>
//                       <td className="px-6 py-4">
//                         {birthday ? (
//                           <span className="text-purple-600 text-sm font-medium">
//                             {birthday}
//                           </span>
//                         ) : (
//                           <span className="text-gray-400 text-sm">-</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
//                           {contact?.group?.name || "No Group"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2 py-1 text-xs rounded-md ${
//                             contact.status === "active"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-gray-100 text-gray-600"
//                           }`}
//                         >
//                           {contact.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             className="p-2 text-gray-500 hover:text-deepPurple hover:bg-purple-50 rounded-md transition-colors"
//                             onClick={() => {
//                               setSelectedContact(contact);
//                               setIsModalOpen(true);
//                             }}
//                           >
//                             <FiEdit2 size={16} />
//                           </button>
//                           <button
//                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
//                             onClick={() => handleDelete(contact._id)}
//                             disabled={isDeleting}
//                           >
//                             <FiTrash size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {/* Empty State */}
//             {contacts.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 No contacts found. Add your first contact to get started.
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {isModalOpen && (
//         <AddContactModal
//           onClose={() => {
//             setIsModalOpen(false);
//             refetch();
//           }}
//           contact={selectedContact}
//         />
//       )}

//       {isBulkUploadModalOpen && (
//         <BulkUploadContacts
//           onClose={() => {
//             setIsBulkUploadModalOpen(false);
//             refetch();
//           }}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import {
  FiMail,
  FiPhone,
  FiEdit2,
  FiTrash,
  FiCalendar,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDeleteData, useFetchData } from "../../hook/Request";
import BulkUploadContacts from "./BulkUploadContacts";
import AddContactModal from "./_components/addContactModal";

// Helper function to format birthday
const formatBirthday = (birthDay, birthMonth) => {
  if (!birthDay || !birthMonth) return null;

  const months = [
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

  const monthName = months[parseInt(birthMonth) - 1];
  const day = parseInt(birthDay);

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${monthName} ${day}${getOrdinalSuffix(day)}`;
};

// Month options for birthday filter
const MONTHS = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
  { value: "this_month", label: "This Month" },
  { value: "upcoming", label: "Upcoming (30 days)" },
];

// Date added filter options
const DATE_ADDED_OPTIONS = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_30", label: "Last 30 Days" },
  { value: "last_90", label: "Last 90 Days" },
];

// Role options
const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "Member", label: "Member" },
  { value: "Leader", label: "Leader" },
  { value: "Pastor", label: "Pastor" },
  { value: "Volunteer", label: "Volunteer" },
  { value: "Deacon", label: "Deacon" },
  { value: "Usher", label: "Usher" },
];

export default function Contacts() {
  const { contact } = useSelector((state) => state?.reducer?.AuthSlice);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [birthdayFilter, setBirthdayFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dateAddedFilter, setDateAddedFilter] = useState("");

  const { data: contactData, refetch } = useFetchData(
    `/api/v1/contacts`,
    "contacts"
  );
  const contacts = contactData?.data?.members || [];
  const groups = contactData?.data?.groups || [];

  const { mutate: deleteContact, isLoading: isDeleting } =
    useDeleteData("contacts");

  // Calculate active filter count
  const activeFilterCount = [
    searchQuery,
    statusFilter,
    groupFilter,
    birthdayFilter,
    roleFilter,
    dateAddedFilter,
  ].filter(Boolean).length;

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setGroupFilter("");
    setBirthdayFilter("");
    setRoleFilter("");
    setDateAddedFilter("");
  };

  // Filter logic
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // 1. Search filter (name, email, phone)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = contact.fullName?.toLowerCase().includes(query);
        const matchesEmail = contact.email?.toLowerCase().includes(query);
        const matchesPhone = contact.phoneNumber?.includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }

      // 2. Status filter
      if (statusFilter && contact.status !== statusFilter) {
        return false;
      }

      // 3. Group filter
      if (groupFilter) {
        if (groupFilter === "no_group") {
          if (contact.group) return false;
        } else if (contact.group?._id !== groupFilter) {
          return false;
        }
      }

      // 4. Birthday month filter
      if (birthdayFilter) {
        const contactMonth = parseInt(contact.birthMonth);
        const contactDay = parseInt(contact.birthDay);
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        if (birthdayFilter === "this_month") {
          if (contactMonth !== currentMonth) return false;
        } else if (birthdayFilter === "upcoming") {
          // Check if birthday is within next 30 days
          if (!contact.birthMonth || !contact.birthDay) return false;

          const thisYear = today.getFullYear();
          let birthdayThisYear = new Date(
            thisYear,
            contactMonth - 1,
            contactDay
          );

          // If birthday already passed this year, check next year
          if (birthdayThisYear < today) {
            birthdayThisYear = new Date(
              thisYear + 1,
              contactMonth - 1,
              contactDay
            );
          }

          const diffTime = birthdayThisYear.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 30) return false;
        } else {
          if (contactMonth !== parseInt(birthdayFilter)) return false;
        }
      }

      // 5. Role filter
      if (roleFilter && contact.role !== roleFilter) {
        return false;
      }

      // 6. Date added filter
      if (dateAddedFilter && contact.createdAt) {
        const contactDate = new Date(contact.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);

        const last90Days = new Date(today);
        last90Days.setDate(today.getDate() - 90);

        switch (dateAddedFilter) {
          case "today":
            if (contactDate < today) return false;
            break;
          case "this_week":
            if (contactDate < startOfWeek) return false;
            break;
          case "this_month":
            if (contactDate < startOfMonth) return false;
            break;
          case "last_30":
            if (contactDate < last30Days) return false;
            break;
          case "last_90":
            if (contactDate < last90Days) return false;
            break;
        }
      }

      return true;
    });
  }, [
    contacts,
    searchQuery,
    statusFilter,
    groupFilter,
    birthdayFilter,
    roleFilter,
    dateAddedFilter,
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContact(
        { url: `/api/v1/contacts/${id}`, method: "DELETE" },
        {
          onSuccess: () => refetch(),
          onError: (err) => console.error("Failed to delete contact:", err),
        }
      );
    }
  };

  return (
    <div className="p-6 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="sm:text-2xl font-semibold text-darkBlueGray">
            Contact Management
          </h1>
          <p className="text-slateBlue text-sm sm:text-base font-normal">
            Manage your congregation contacts and groups
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="bg-gray-200 text-deepPurple px-4 py-2 rounded-md hover:bg-paleBlue font-medium"
          >
            Bulk Upload
          </button>

          <button
            onClick={() => {
              setSelectedContact(null);
              setIsModalOpen(true);
            }}
            className="bg-deepPurple text-white px-4 py-2 rounded-md hover:bg-deepPurple"
          >
            + Add Contact
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Total Contacts</p>
          <h2 className="text-2xl font-bold">
            {contactData?.data?.memberCount || 0}
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
            {contactData?.data?.groupTotal || 0}
          </h2>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        {/* Primary Filters Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple bg-white cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Group Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple bg-white cursor-pointer"
            >
              <option value="">All Groups</option>
              <option value="no_group">No Group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showAdvancedFilters ||
              birthdayFilter ||
              roleFilter ||
              dateAddedFilter
                ? "border-deepPurple bg-purple-50 text-deepPurple"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FiFilter size={16} />
            <span>More Filters</span>
            {(birthdayFilter || roleFilter || dateAddedFilter) && (
              <span className="bg-deepPurple text-white text-xs px-2 py-0.5 rounded-full">
                {
                  [birthdayFilter, roleFilter, dateAddedFilter].filter(Boolean)
                    .length
                }
              </span>
            )}
          </button>

          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiX size={16} />
              <span>Clear All ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Advanced Filters Row */}
        {showAdvancedFilters && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Birthday Month Filter */}
            <div className="relative min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">
                Birthday
              </label>
              <select
                value={birthdayFilter}
                onChange={(e) => setBirthdayFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple bg-white cursor-pointer"
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 bottom-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Role Filter */}
            <div className="relative min-w-[160px]">
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple bg-white cursor-pointer"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 bottom-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Added Filter */}
            <div className="relative min-w-[160px]">
              <label className="block text-xs text-gray-500 mb-1">
                Date Added
              </label>
              <select
                value={dateAddedFilter}
                onChange={(e) => setDateAddedFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple bg-white cursor-pointer"
              >
                {DATE_ADDED_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 bottom-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Results Count & View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 text-sm">
          Showing{" "}
          <span className="font-semibold">{filteredContacts.length}</span> of{" "}
          <span className="font-semibold">{contacts.length}</span> contacts
        </p>

        <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setViewMode("card")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "card"
                ? "bg-white text-deepPurple shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiGrid size={18} />
            <span className="text-sm font-medium">Cards</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              viewMode === "table"
                ? "bg-white text-deepPurple shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiList size={18} />
            <span className="text-sm font-medium">Table</span>
          </button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const birthday = formatBirthday(
              contact.birthDay,
              contact.birthMonth
            );

            return (
              <div
                key={contact._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <AiOutlineUser className="text-3xl text-purple-500" />
                  <div className="flex gap-2">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSelectedContact(contact);
                        setIsModalOpen(true);
                      }}
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="text-gray-500 hover:text-red-600"
                      onClick={() => handleDelete(contact._id)}
                      disabled={isDeleting}
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{contact.fullName}</h3>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 text-sm rounded-md ${
                      contact.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {contact.status}
                  </span>
                  {contact.role && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 text-sm rounded-md">
                      {contact.role}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FiMail /> {contact.email || "-"}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FiPhone /> {contact.phoneNumber}
                </div>

                {birthday && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiCalendar />
                    <span className="text-purple-600 font-medium">
                      {birthday}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap mt-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                    {contact?.group?.name || "No Group"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Phone
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Birthday
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Group
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContacts.map((contact) => {
                  const birthday = formatBirthday(
                    contact.birthDay,
                    contact.birthMonth
                  );

                  return (
                    <tr
                      key={contact._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <AiOutlineUser className="text-xl text-purple-500" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {contact.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {contact.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {contact.phoneNumber}
                      </td>
                      <td className="px-6 py-4">
                        {birthday ? (
                          <span className="text-purple-600 text-sm font-medium">
                            {birthday}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {contact.role ? (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md">
                            {contact.role}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                          {contact?.group?.name || "No Group"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            contact.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 text-gray-500 hover:text-deepPurple hover:bg-purple-50 rounded-md transition-colors"
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsModalOpen(true);
                            }}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            onClick={() => handleDelete(contact._id)}
                            disabled={isDeleting}
                          >
                            <FiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No contacts found</p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-deepPurple hover:underline text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State for Card View */}
      {viewMode === "card" && filteredContacts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-2">No contacts found</p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-deepPurple hover:underline text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <AddContactModal
          onClose={() => {
            setIsModalOpen(false);
            refetch();
          }}
          contact={selectedContact}
        />
      )}

      {isBulkUploadModalOpen && (
        <BulkUploadContacts
          onClose={() => {
            setIsBulkUploadModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
