import React, { useState } from "react";
import { FiMail, FiPhone, FiEdit2, FiTrash } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
// import React from "react";
import { IoClose } from "react-icons/io5";
import {
  useDeleteData,
  useFetchData,
  useMutateData,
  usePatchData,
} from "../../hook/Request";
import { useSelector } from "react-redux";

export default function Contacts() {
  const { ChurchProfile } = useSelector((state) => state?.reducer?.AuthSlice);
  const [editingContact, setEditingContact] = useState(null);
  const [editContact, setEditContact] = useState(null);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  console.log({
    ff: ChurchProfile?.user?.groups,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: settingApiData, refetch } = useFetchData(
    `/api/v1/contacts`,
    "contacts"
  );

  const contacts = settingApiData?.data?.members || [];

  const { mutate: deleteContact, isLoading: isDeleting } =
    useDeleteData("contacts");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContact(
        {
          url: `/api/v1/contacts/${id}`,
          method: "DELETE",
        },
        {
          onSuccess: () => {
            refetch(); // refresh the contact list
          },
          onError: (err) => {
            console.error("Failed to delete contact:", err);
          },
        }
      );
    }
  };

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
        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          + Add Contact
        </button> */}

        <button
          onClick={() => {
            setSelectedContact(null); // new contact
            setIsModalOpen(true);
          }}
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
                {/* <button className="text-gray-500 hover:text-gray-700">
                  <FiEdit2 />
                </button> */}

                {/* <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setEditingContact(contact);
                    setIsModalOpen(true);
                  }}
                >
                  <FiEdit2 />
                </button> */}

                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSelectedContact(contact); // pass existing contact
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
                {ChurchProfile?.user?.groups?.find(
                  (g) => g._id === contact.groupId || g._id === contact.group // depending on how backend returns
                )?.name || "No Group"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* {isModalOpen && !editContact && (
        <AddContactModal onClose={() => setIsModalOpen(false)} />
      )}

      {editContact && (
        <AddContactModal
          onClose={() => setEditContact(null)}
          contact={editContact}
        />
      )} */}

      {isModalOpen && (
        <AddContactModal
          onClose={() => setIsModalOpen(false)}
          contact={selectedContact} // null = create, object = edit
        />
      )}
      {/* {isModalOpen && <AddContactModal onClose={() => setIsModalOpen(false)} />} */}
    </div>
  );
}

// function AddContactModal({ onClose }) {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     status: "Active",
//     role: "Member",
//     groupId: "",
//   });

//   const { data: settingApiData } = useFetchData(
//     `/api/v1/setting`,
//     "profilesetting"
//   );

//   const { mutate: addContact, isLoading } = useMutateData("contacts");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addContact(
//       {
//         url: "/api/v1/contacts", // 👈 adjust to your contact creation endpoint
//         data: formData,
//       },
//       {
//         onSuccess: (data) => {
//           console.log({
//             ddddd: data,
//           });

//           onClose(); // close modal after success
//         },
//         onError: (err) => {
//           console.error("Failed to add contact:", err);
//         },
//       }
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
//       <div className="bg-white w-full sm:w-[400px] h-full p-6 overflow-y-auto shadow-lg">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Add Contact Info</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-black">
//             <IoClose size={24} />
//           </button>
//         </div>
//         <p className="text-gray-500 mb-4">
//           Fill in the details below to add a new contact to your records
//         </p>

//         {/* Form */}
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-sm text-gray-700">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="John Smith"
//               className="w-full border rounded-md px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Status</label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full border rounded-md px-3 py-2"
//             >
//               <option>Active</option>
//               <option>Inactive</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="johnsmith@email.com"
//               className="w-full border rounded-md px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Phone Number</label>
//             <input
//               type="tel"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               placeholder="+1 (555) 345-7890"
//               className="w-full border rounded-md px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Role</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full border rounded-md px-3 py-2"
//             >
//               <option>Member</option>
//               <option>Leader</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700">Group</label>
//             <select
//               name="groupId"
//               value={formData.groupId}
//               onChange={handleChange}
//               className="w-full border rounded-md px-3 py-2"
//             >
//               {settingApiData?.data?.user?.groups?.map((group) => (
//                 <option key={group?._id} value={group?._id}>
//                   {group?.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
//           >
//             {isLoading ? "Saving..." : "Save Contact"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

function AddContactModal({ onClose, contact }) {
  const isEditing = Boolean(contact);

  const [formData, setFormData] = useState({
    fullName: contact?.fullName || "",
    email: contact?.email || "",
    phoneNumber: contact?.phoneNumber || "",
    status: contact?.status || "Active",
    role: contact?.role || "Member",
    groupId: contact?.groupId || "",
  });

  const { data: settingApiData } = useFetchData(
    `/api/v1/setting`,
    "profilesetting"
  );

  // create
  const { mutate: addContact, isLoading: isAdding } = useMutateData("contacts");
  // update
  // const { mutate: updateContact, isLoading: isUpdating } =
  // useMutateData("contacts");

  const { mutate: updateContact, isLoading: isUpdating } =
    usePatchData("contacts");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ffg: isEditing,
    });

    if (isEditing) {
      // update contact
      updateContact(
        {
          url: `/api/v1/contacts/${contact._id}`,
          data: formData,
        },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            console.error("Failed to update contact:", err);
          },
        }
      );
    } else {
      // create new contact
      addContact(
        {
          url: "/api/v1/contacts",
          data: formData,
        },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            console.error("Failed to add contact:", err);
          },
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full sm:w-[400px] h-full p-6 overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Contact" : "Add Contact Info"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Smith"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johnsmith@email.com"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 345-7890"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option>Member</option>
              <option>Leader</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Group</label>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              {settingApiData?.data?.user?.groups?.map((group) => (
                <option key={group?._id} value={group?._id}>
                  {group?.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isEditing
              ? isUpdating
                ? "Updating..."
                : "Update Contact"
              : isAdding
              ? "Saving..."
              : "Save Contact"}
          </button>
        </form>
      </div>
    </div>
  );
}
