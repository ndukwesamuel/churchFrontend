// pages/Events/EventsList.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  ExternalLink,
  Loader,
} from "lucide-react";
import { useFetchData, useDeleteData } from "../../hook/Request";
import { format } from "date-fns";
import { toast } from "sonner";

const EventsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);

  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useFetchData("/api/v1/event", "events");

  console.log({
    yyyy: eventsData,
  });

  const { mutate: deleteEvent, isLoading: isDeleting } =
    useDeleteData("events");

  const events = eventsData?.data || [];

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    const isUpcoming = new Date(event.eventDate) > new Date();
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "upcoming" && isUpcoming) ||
      (typeFilter === "past" && !isUpcoming);

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDeleteEvent = (eventId, eventName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${eventName}"? This will also delete all registrations.`,
      )
    ) {
      deleteEvent(
        { url: `/api/events/${eventId}` },
        {
          onSuccess: () => {
            toast.success("Event deleted successfully");
            refetch();
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to delete event");
          },
        },
      );
    }
  };

  const copyRegistrationLink = (eventId) => {
    const link = `${window.location.origin}/register/${eventId}`;
    navigator.clipboard.writeText(link);
    toast.success("Registration link copied to clipboard!");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: "bg-gray-100 text-gray-800",
      open: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
    };
    return statusConfig[status] || statusConfig.draft;
  };

  const getCapacityInfo = (event) => {
    const { capacity, registrationCount } = event;
    if (!capacity) return "Unlimited";

    const percentage = (registrationCount / capacity) * 100;
    const remaining = capacity - registrationCount;

    if (percentage >= 100) {
      return <span className="text-red-600 font-medium">Full</span>;
    } else if (percentage >= 80) {
      return (
        <span className="text-orange-600 font-medium">
          {remaining} spots left
        </span>
      );
    } else {
      return (
        <span className="text-gray-600">
          {registrationCount}/{capacity}
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p>Error loading events. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Events
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your church events and registrations
            </p>
          </div>
          <button
            onClick={() => navigate("/events/create")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Events</p>
              <p className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.status === "open").length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-blue-600">
                {events.reduce((sum, e) => sum + e.registrationCount, 0)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Draft Events</p>
              <p className="text-2xl font-bold text-gray-600">
                {events.filter((e) => e.status === "draft").length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-4">
              {events.length === 0
                ? "Create your first event to get started"
                : "Try adjusting your filters"}
            </p>
            {events.length === 0 && (
              <button
                onClick={() => navigate("/events/create")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Card Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {event.eventName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(event.status)}`}
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description || "No description"}
                    </p>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === event._id ? null : event._id,
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openDropdown === event._id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-10">
                        <button
                          onClick={() => {
                            navigate(`/events/${event._id}`);
                            setOpenDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/events/${event._id}/registrations`);
                            setOpenDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          View Registrations
                        </button>
                        <button
                          onClick={() => {
                            copyRegistrationLink(event._id);
                            setOpenDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Copy Registration Link
                        </button>
                        <div className="border-t"></div>
                        <button
                          onClick={() => {
                            handleDeleteEvent(event._id, event.eventName);
                            setOpenDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {format(
                      new Date(event.eventDate),
                      "MMM dd, yyyy 'at' h:mm a",
                    )}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {event.registrationCount} registered
                    </span>
                  </div>
                  <div className="text-sm">{getCapacityInfo(event)}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    View Details
                  </button>
                  {event.status === "open" && (
                    <button
                      onClick={() => copyRegistrationLink(event._id)}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Share Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
