// pages/Events/RegistrationsList.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  Loader,
  Trash2,
  MoreVertical,
  X,
} from "lucide-react";
import { useFetchData, useDeleteData, usePatchData } from "../../hook/Request";
import { format } from "date-fns";
import { toast } from "sonner";

const RegistrationsList = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const { data: eventData, isLoading: loadingEvent } = useFetchData(
    `/api/v1/event/${eventId}`,
    `event-${eventId}`,
  );

  const {
    data: registrationsData,
    isLoading: loadingRegistrations,
    error: registrationsError,
    refetch: refetchRegistrations,
  } = useFetchData(
    `/api/v1/event/registrations/${eventId}`,
    `event-registrations-${eventId}`,
  );

  const { mutate: deleteRegistration } = useDeleteData("event-registrations");
  const { mutate: updateRegistrationStatus } = usePatchData(
    "event-registrations",
  );

  const event = eventData?.data;
  const allRegistrations = registrationsData?.data || [];

  // Filter registrations
  const filteredRegistrations = allRegistrations.filter((reg) => {
    const matchesSearch =
      reg.registrantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registrantEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRegistrations(filteredRegistrations.map((reg) => reg._id));
    } else {
      setSelectedRegistrations([]);
    }
  };

  // Handle individual selection
  const handleSelectRegistration = (regId) => {
    if (selectedRegistrations.includes(regId)) {
      setSelectedRegistrations(
        selectedRegistrations.filter((id) => id !== regId),
      );
    } else {
      setSelectedRegistrations([...selectedRegistrations, regId]);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedRegistrations.length === 0) {
      toast.error("Please select at least one registration");
      return;
    }

    updateRegistrationStatus(
      {
        url: `/api/v1/event/registrations/bulk-status`,
        data: {
          registrationIds: selectedRegistrations,
          status: newStatus,
        },
      },
      {
        onSuccess: (response) => {
          toast.success(
            `${response.data?.updatedCount || selectedRegistrations.length} registration(s) updated`,
          );
          refetchRegistrations();
          setSelectedRegistrations([]);
          setShowBulkActions(false);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update registrations");
        },
      },
    );
  };

  // Handle single status update
  const handleStatusUpdate = (regId, newStatus) => {
    updateRegistrationStatus(
      {
        url: `/api/v1/event/registration/${regId}/status`,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success("Registration status updated");
          refetchRegistrations();
          setOpenDropdown(null);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update status");
        },
      },
    );
  };

  // Handle delete registration
  const handleDeleteRegistration = (regId, registrantName) => {
    if (
      window.confirm(
        `Are you sure you want to delete registration for "${registrantName}"?`,
      )
    ) {
      deleteRegistration(
        { url: `/api/v1/event/registration/${regId}` },
        {
          onSuccess: () => {
            toast.success("Registration deleted successfully");
            refetchRegistrations();
            setOpenDropdown(null);
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to delete registration");
          },
        },
      );
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/event/registrations/${eventId}/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();

      // Convert to CSV
      const csvData = convertToCSV(data.data);
      downloadCSV(csvData, `${event?.eventName}-registrations.csv`);

      toast.success("Export successful!");
    } catch (error) {
      toast.error("Failed to export registrations");
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      }),
    );

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      attended: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return config[status] || config.confirmed;
  };

  if (loadingEvent || loadingRegistrations) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (registrationsError || !event) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p>Error loading registrations. Please try again.</p>
            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Back to Event Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = {
    all: allRegistrations.length,
    confirmed: allRegistrations.filter((r) => r.status === "confirmed").length,
    pending: allRegistrations.filter((r) => r.status === "pending").length,
    attended: allRegistrations.filter((r) => r.status === "attended").length,
    cancelled: allRegistrations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/events/${eventId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Dashboard
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Event Registrations
            </h1>
            <p className="text-gray-600 text-sm">{event.eventName}</p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div
          onClick={() => setStatusFilter("all")}
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition ${
            statusFilter === "all" ? "ring-2 ring-purple-600" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold">{statusCounts.all}</span>
          </div>
          <p className="text-sm text-gray-600">All</p>
        </div>

        <div
          onClick={() => setStatusFilter("confirmed")}
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition ${
            statusFilter === "confirmed" ? "ring-2 ring-green-600" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-2xl font-bold">{statusCounts.confirmed}</span>
          </div>
          <p className="text-sm text-gray-600">Confirmed</p>
        </div>

        <div
          onClick={() => setStatusFilter("pending")}
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition ${
            statusFilter === "pending" ? "ring-2 ring-orange-600" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <span className="text-2xl font-bold">{statusCounts.pending}</span>
          </div>
          <p className="text-sm text-gray-600">Pending</p>
        </div>

        <div
          onClick={() => setStatusFilter("attended")}
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition ${
            statusFilter === "attended" ? "ring-2 ring-purple-600" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-6 h-6 text-purple-600" />
            <span className="text-2xl font-bold">{statusCounts.attended}</span>
          </div>
          <p className="text-sm text-gray-600">Attended</p>
        </div>

        <div
          onClick={() => setStatusFilter("cancelled")}
          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition ${
            statusFilter === "cancelled" ? "ring-2 ring-red-600" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <span className="text-2xl font-bold">{statusCounts.cancelled}</span>
          </div>
          <p className="text-sm text-gray-600">Cancelled</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {selectedRegistrations.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedRegistrations.length} selected
              </span>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Bulk Actions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Dropdown */}
      {showBulkActions && selectedRegistrations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Bulk Actions</h3>
            <button
              onClick={() => setShowBulkActions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("confirmed")}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              Mark as Confirmed
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("attended")}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >
              Mark as Attended
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("pending")}
              className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700"
            >
              Mark as Pending
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("cancelled")}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Mark as Cancelled
            </button>
          </div>
        </div>
      )}

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No registrations found</p>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Share the registration link to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedRegistrations.length ===
                          filteredRegistrations.length &&
                        filteredRegistrations.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegistrations.map((registration) => (
                  <tr
                    key={registration._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRegistrations.includes(
                          registration._id,
                        )}
                        onChange={() =>
                          handleSelectRegistration(registration._id)
                        }
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {registration.registrantName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">
                        {registration.registrantEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          registration.status,
                        )}`}
                      >
                        {registration.status.charAt(0).toUpperCase() +
                          registration.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {format(
                          new Date(registration.registeredAt),
                          "MMM dd, yyyy",
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(registration.registeredAt), "h:mm a")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === registration._id
                                ? null
                                : registration._id,
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openDropdown === registration._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  registration._id,
                                  "confirmed",
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Mark Confirmed
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(registration._id, "attended")
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <UserCheck className="w-4 h-4 text-purple-600" />
                              Mark Attended
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(registration._id, "pending")
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4 text-orange-600" />
                              Mark Pending
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  registration._id,
                                  "cancelled",
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                              Mark Cancelled
                            </button>
                            <div className="border-t"></div>
                            <button
                              onClick={() =>
                                handleDeleteRegistration(
                                  registration._id,
                                  registration.registrantName,
                                )
                              }
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredRegistrations.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {filteredRegistrations.length} of {allRegistrations.length}{" "}
          registration(s)
        </div>
      )}
    </div>
  );
};

export default RegistrationsList;
