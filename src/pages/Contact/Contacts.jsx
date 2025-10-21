import React, { useState } from "react";
import { FiMail, FiPhone, FiEdit2, FiTrash } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import {
  useDeleteData,
  useFetchData,
  useMutateData,
  usePatchData,
} from "../../hook/Request";
import { useSelector } from "react-redux";
import BulkUploadContacts from "./BulkUploadContacts";

export default function Contacts() {
  const { contact } = useSelector((state) => state?.reducer?.AuthSlice);
  const [editingContact, setEditingContact] = useState(null);
  const [editContact, setEditContact] = useState(null);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: contactData, refetch } = useFetchData(
    `/api/v1/contacts`,
    "contacts"
  );

  const contacts = contactData?.data?.members || [];

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Contact Management</h1>
          <p className="text-gray-500">
            Manage your congregation contacts and groups
          </p>
        </div>

        <div className="flex gap-3">
          {/* ADD BULK UPLOAD BUTTON */}
          <button
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="bg-gray-200 text-purple-600 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
          >
            Bulk Upload
          </button>

          {/* EXISTING ADD CONTACT BUTTON */}
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
      </div>
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Contact Management</h1>
          <p className="text-gray-500">
            Manage your congregation contacts and groups
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedContact(null); // new contact
            setIsModalOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          + Add Contact
        </button>
      </div> */}
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Total Contact</p>
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
                {contact?.group?.name || "No Group"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* {isModalOpen && !editContact && (
//         <AddContactModal onClose={() => setIsModalOpen(false)} />
//       )}

//       {editContact && (
//         <AddContactModal
//           onClose={() => setEditContact(null)}
//           contact={editContact}
//         />
//       )} */}
      {isModalOpen && (
        <AddContactModal
          onClose={() => setIsModalOpen(false)}
          contact={selectedContact} // null = create, object = edit
        />
      )}

      {isBulkUploadModalOpen && (
        <BulkUploadContacts
          onClose={() => {
            setIsBulkUploadModalOpen(false);
            refetch(); // 👈 IMPORTANT: Refetch contacts after a successful bulk upload
          }}
        />
      )}
      {/* {isModalOpen && <AddContactModal onClose={() => setIsModalOpen(false)} />} */}
    </div>
  );
}

function AddContactModal({ onClose, contact }) {
  const isEditing = Boolean(contact);
  console.log(contact);
  const standardizePhoneNumber = (inputNumber) => {
    // 1. Remove non-digit characters
    const digitsOnly = inputNumber.replace(/\D/g, "");

    // 2. Check if it starts with '0' and is long enough to be a local Nigerian number (e.g., 11 digits)
    if (digitsOnly.length > 0 && digitsOnly.startsWith("0")) {
      // Remove the leading '0' and prepend '234'
      return "234" + digitsOnly.substring(1);
    }

    // 3. If it already starts with '234' or is not a typical local format, return as is
    // This allows for other international formats if needed, or if '234' was manually typed
    return digitsOnly;
  };
  const [formData, setFormData] = useState({
    fullName: contact?.fullName || "",
    email: contact?.email || "",
    phoneNumber: contact?.phoneNumber || "",
    status: contact?.status || "Active",
    role: contact?.role || "Member",
    groupId: contact?.group?._id || "",
  });

  const { data: groupData } = useFetchData(`/api/v1/groups`, "groups");
  // create
  const { mutate: addContact, isLoading: isAdding } = useMutateData("contacts");
  const { mutate: updateContact, isLoading: isUpdating } =
    usePatchData("contacts");

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Standardize the phone number when the user types
      const standardizedValue = standardizePhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: standardizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
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
              placeholder="08011111111"
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
              <option value="" disabled>
                -- Select a group --
              </option>
              {groupData?.data?.groups?.map((group) => (
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
