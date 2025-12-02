import React, { useState } from "react";
import { FiMail, FiPhone, FiEdit2, FiTrash, FiCalendar } from "react-icons/fi";
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

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
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

export default function Contacts() {
  const { contact } = useSelector((state) => state?.reducer?.AuthSlice);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
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

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => {
          const birthday = formatBirthday(contact.birthDay, contact.birthMonth);

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
              <span className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-md w-fit">
                {contact.status}
              </span>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FiMail /> {contact.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FiPhone /> {contact.phoneNumber}
              </div>

              {/* Birthday Display */}
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

      {/* Modals */}
      {isModalOpen && (
        <AddContactModal
          onClose={() => {
            setIsModalOpen(false);
            refetch(); // refresh contacts after add/edit
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
