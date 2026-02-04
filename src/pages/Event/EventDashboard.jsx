import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  Loader,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  Copy,
  BarChart3,
  QrCode,
  X,
} from "lucide-react";
import { useFetchData, useDeleteData, usePatchData } from "../../hook/Request";
import { format } from "date-fns";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { BASE_API_URL } from "../../hook/api.config";

const apiUrl = BASE_API_URL;

const EventDashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [changingStatus, setChangingStatus] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const qrRef = useRef(null);

  const {
    data: eventData,
    isLoading: loadingEvent,
    error: eventError,
    refetch: refetchEvent,
  } = useFetchData(`/api/v1/event/${eventId}`, `event-${eventId}`);

  const {
    data: statsData,
    isLoading: loadingStats,
    refetch: refetchStats,
  } = useFetchData(`/api/v1/event/${eventId}/stats`, `event-stats-${eventId}`);

  const {
    data: registrationsData,
    isLoading: loadingRegistrations,
    refetch: refetchRegistrations,
  } = useFetchData(
    `/api/v1/event/registrations/${eventId}`,
    `event-registrations-${eventId}`,
  );

  const { mutate: deleteEvent } = useDeleteData("events");
  const { mutate: updateEventStatus } = usePatchData("events");

  const event = eventData?.data;
  const stats = statsData?.data;
  const registrations = registrationsData?.data || [];
  const recentRegistrations = registrations.slice(0, 10);

  const registrationLink = `${window.location.origin}/register/${eventId}`;

  const handleDeleteEvent = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${event?.eventName}"? This will also delete all registrations.`,
      )
    ) {
      deleteEvent(
        { url: `/api/v1/event/${eventId}` },
        {
          onSuccess: () => {
            toast.success("Event deleted successfully");
            navigate("/events");
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to delete event");
          },
        },
      );
    }
  };

  const handleStatusChange = (newStatus) => {
    setChangingStatus(true);
    updateEventStatus(
      {
        url: `/api/v1/event/${eventId}/status`,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(`Event ${newStatus} successfully`);
          refetchEvent();
          refetchStats();
          setChangingStatus(false);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update event status");
          setChangingStatus(false);
        },
      },
    );
  };

  const copyRegistrationLink = () => {
    navigator.clipboard.writeText(registrationLink);
    toast.success("Registration link copied to clipboard!");
  };

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${event?.eventName}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("QR code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/v1/event/registrations/${eventId}/export`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();

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
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      open: { bg: "bg-green-100", text: "text-green-800", label: "Open" },
      closed: { bg: "bg-red-100", text: "text-red-800", label: "Closed" },
    };
    return config[status] || config.draft;
  };

  if (loadingEvent || loadingStats) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p>Error loading event. Please try again.</p>
            <button
              onClick={() => navigate("/events")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(event.status);
  const capacityPercentage = event.capacity
    ? (event.registrationCount / event.capacity) * 100
    : 0;

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Event Registration QR Code
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div
                ref={qrRef}
                className="bg-white p-4 rounded-lg border-2 border-gray-200"
              >
                <QRCodeSVG
                  value={registrationLink}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-sm text-gray-600 mt-4 text-center">
                Scan this QR code to register for the event
              </p>

              <div className="flex gap-3 mt-6 w-full">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
                <button
                  onClick={copyRegistrationLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.eventName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}
              >
                {statusBadge.label}
              </span>
            </div>
            {event.description && (
              <p className="text-gray-600">{event.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Draft Status - Show Open Registration Button */}
            {event.status === "draft" && (
              <button
                onClick={() => handleStatusChange("open")}
                disabled={changingStatus}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {changingStatus ? "Opening..." : "Open Registration"}
              </button>
            )}

            {/* Open Status - Show Close Registration Button */}
            {event.status === "open" && (
              <button
                onClick={() => handleStatusChange("closed")}
                disabled={changingStatus}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {changingStatus ? "Closing..." : "Close Registration"}
              </button>
            )}

            {/* Closed Status - Show Reopen Registration Button */}
            {event.status === "closed" && (
              <button
                onClick={() => handleStatusChange("open")}
                disabled={changingStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {changingStatus ? "Reopening..." : "Reopen Registration"}
              </button>
            )}

            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            <button
              onClick={copyRegistrationLink}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
            <button
              onClick={() => navigate(`/events/${eventId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeleteEvent}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Event Details Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Event Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium">
                {format(new Date(event.eventDate), "MMM dd, yyyy")}
              </p>
              <p className="text-sm text-gray-600">
                {format(new Date(event.eventDate), "h:mm a")}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="font-medium">
                {event.capacity ? `${event.capacity} people` : "Unlimited"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Form Fields</p>
              <p className="font-medium">
                {event.formFields?.length || 0} fields
              </p>
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        {event.capacity && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Registration Progress</span>
              <span className="font-medium">
                {event.registrationCount} / {event.capacity} (
                {capacityPercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  capacityPercentage >= 100
                    ? "bg-red-600"
                    : capacityPercentage >= 80
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">
              {stats?.totalRegistrations || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Registrations</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-green-600">
              {stats?.confirmedRegistrations || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Confirmed</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-3xl font-bold text-orange-600">
              {stats?.pendingRegistrations || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Pending Approval</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-purple-600">
              {stats?.attendedCount || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600">Attended</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => navigate(`/events/${eventId}/registrations`)}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
        >
          <Users className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">View All Registrations</h3>
          <p className="text-sm text-gray-600">
            Manage and view all event registrations
          </p>
        </button>

        <button
          onClick={handleExport}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
        >
          <Download className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Export Data</h3>
          <p className="text-sm text-gray-600">
            Download registrations as CSV file
          </p>
        </button>

        <button
          onClick={copyRegistrationLink}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
        >
          <ExternalLink className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Share Event</h3>
          <p className="text-sm text-gray-600">
            Copy registration link to share
          </p>
        </button>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Registrations</h2>
              <p className="text-sm text-gray-600">
                Last 10 people who registered
              </p>
            </div>
            <button
              onClick={() => navigate(`/events/${eventId}/registrations`)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>
        </div>

        <div className="p-6">
          {loadingRegistrations ? (
            <div className="text-center py-8">
              <Loader className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
            </div>
          ) : recentRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No registrations yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Share the registration link to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRegistrations.map((registration) => (
                <div
                  key={registration._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {registration.registrantName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {registration.registrantEmail}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {format(
                          new Date(registration.registeredAt),
                          "MMM dd, yyyy",
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(registration.registeredAt), "h:mm a")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        registration.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : registration.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : registration.status === "attended"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {registration.status.charAt(0).toUpperCase() +
                        registration.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
