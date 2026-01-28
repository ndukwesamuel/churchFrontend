// pages/Events/EditEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Save,
  X,
  Loader,
} from "lucide-react";
import { useMutateData, useFetchData } from "../../hook/Request";
import { toast } from "sonner";
import { format } from "date-fns";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { mutate: updateEvent, isLoading: isUpdating } =
    useMutateData("events");

  const {
    data: eventData,
    isLoading: loadingEvent,
    error: eventError,
  } = useFetchData(`/api/events/${eventId}`, `event-${eventId}`);

  const [showPreview, setShowPreview] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    eventName: "",
    description: "",
    eventDate: "",
    eventEndDate: "",
    location: "",
    capacity: "",
    status: "draft",
    allowMultipleRegistrations: false,
    requireApproval: false,
    isPublic: true,
  });

  const [formFields, setFormFields] = useState([]);
  const [expandedField, setExpandedField] = useState(null);
  const [hasRegistrations, setHasRegistrations] = useState(false);

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "number", label: "Number" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "radio", label: "Radio Buttons" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "date", label: "Date" },
  ];

  // Load event data when component mounts
  useEffect(() => {
    if (eventData?.data) {
      const event = eventData.data;

      // Convert ISO date to datetime-local format
      const eventDateLocal = event.eventDate
        ? new Date(event.eventDate).toISOString().slice(0, 16)
        : "";
      const eventEndDateLocal = event.eventEndDate
        ? new Date(event.eventEndDate).toISOString().slice(0, 16)
        : "";

      setEventFormData({
        eventName: event.eventName || "",
        description: event.description || "",
        eventDate: eventDateLocal,
        eventEndDate: eventEndDateLocal,
        location: event.location || "",
        capacity: event.capacity || "",
        status: event.status || "draft",
        allowMultipleRegistrations: event.allowMultipleRegistrations || false,
        requireApproval: event.requireApproval || false,
        isPublic: event.isPublic !== undefined ? event.isPublic : true,
      });

      setFormFields(event.formFields || []);
      setHasRegistrations(event.registrationCount > 0);
    }
  }, [eventData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name) => {
    setEventFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const addFormField = () => {
    const newField = {
      fieldId: `field_${Date.now()}`,
      fieldType: "text",
      label: "New Field",
      placeholder: "",
      required: false,
      order: formFields.length + 1,
    };
    setFormFields([...formFields, newField]);
    setExpandedField(formFields.length);
  };

  const updateFormField = (index, key, value) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFormFields(newFields);
  };

  const removeFormField = (index) => {
    if (
      hasRegistrations &&
      !window.confirm(
        "This event already has registrations. Removing fields may cause data loss. Continue?",
      )
    ) {
      return;
    }

    const newFields = formFields.filter((_, i) => i !== index);
    newFields.forEach((field, i) => {
      field.order = i + 1;
    });
    setFormFields(newFields);
  };

  const moveField = (index, direction) => {
    const newFields = [...formFields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newFields.length) return;

    [newFields[index], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[index],
    ];

    newFields.forEach((field, i) => {
      field.order = i + 1;
    });

    setFormFields(newFields);
  };

  const addOption = (fieldIndex) => {
    const field = formFields[fieldIndex];
    const options = field.options || [];
    updateFormField(fieldIndex, "options", [...options, ""]);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const field = formFields[fieldIndex];
    const options = [...(field.options || [])];
    options[optionIndex] = value;
    updateFormField(fieldIndex, "options", options);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const field = formFields[fieldIndex];
    const options = (field.options || []).filter((_, i) => i !== optionIndex);
    updateFormField(fieldIndex, "options", options);
  };

  const validateForm = () => {
    if (!eventFormData.eventName.trim()) {
      toast.error("Event name is required");
      return false;
    }
    if (!eventFormData.eventDate) {
      toast.error("Event date is required");
      return false;
    }
    if (formFields.length === 0) {
      toast.error("Add at least one form field");
      return false;
    }

    const fieldIds = formFields.map((f) => f.fieldId);
    const uniqueIds = new Set(fieldIds);
    if (fieldIds.length !== uniqueIds.size) {
      toast.error("Duplicate field IDs found. Please use unique IDs.");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (
      hasRegistrations &&
      !window.confirm(
        "This event already has registrations. Changes to form fields may affect existing data. Continue?",
      )
    ) {
      return;
    }

    const payload = {
      ...eventFormData,
      capacity: eventFormData.capacity
        ? parseInt(eventFormData.capacity)
        : null,
      formFields,
    };

    updateEvent(
      {
        url: `/api/v1/event/${eventId}`,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Event updated successfully!");
          navigate(`/events/${eventId}`);
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update event");
        },
      },
    );
  };

  const needsOptions = (fieldType) =>
    ["select", "radio", "checkbox"].includes(fieldType);

  if (loadingEvent) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (eventError || !eventData?.data) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Edit Event
            </h1>
            <p className="text-gray-600 text-sm">
              Update your event details and registration form
            </p>
            {hasRegistrations && (
              <div className="mt-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  ⚠️ This event has {eventData.data.registrationCount}{" "}
                  registration(s). Be careful when editing form fields.
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Event Details</h2>
              <p className="text-sm text-gray-600">
                Basic information about your event
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={eventFormData.eventName}
                  onChange={handleInputChange}
                  placeholder="All Night Service 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventFormData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={eventFormData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="eventEndDate"
                    value={eventFormData.eventEndDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventFormData.location}
                  onChange={handleInputChange}
                  placeholder="Church Main Auditorium, Lagos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={eventFormData.capacity}
                  onChange={handleInputChange}
                  placeholder="500"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Registration Settings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Registration Settings</h2>
              <p className="text-sm text-gray-600">
                Configure how registrations work
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Public Event</p>
                  <p className="text-sm text-gray-500">
                    Anyone with the link can register
                  </p>
                </div>
                <button
                  onClick={() => handleSwitchChange("isPublic")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    eventFormData.isPublic ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      eventFormData.isPublic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    Allow Multiple Registrations
                  </p>
                  <p className="text-sm text-gray-500">
                    Same email can register multiple times
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSwitchChange("allowMultipleRegistrations")
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    eventFormData.allowMultipleRegistrations
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      eventFormData.allowMultipleRegistrations
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Require Approval</p>
                  <p className="text-sm text-gray-500">
                    Registrations need admin approval
                  </p>
                </div>
                <button
                  onClick={() => handleSwitchChange("requireApproval")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    eventFormData.requireApproval
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      eventFormData.requireApproval
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Form Builder */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Registration Form Fields
                  </h2>
                  <p className="text-sm text-gray-600">
                    Customize what information to collect
                  </p>
                </div>
                <button
                  onClick={addFormField}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div
                    key={field.fieldId}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {field.label || "Untitled Field"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {
                            fieldTypes.find((t) => t.value === field.fieldType)
                              ?.label
                          }
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => moveField(index, "up")}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveField(index, "down")}
                          disabled={index === formFields.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setExpandedField(
                              expandedField === index ? null : index,
                            )
                          }
                          className="px-2 py-1 text-xs hover:bg-gray-200 rounded"
                        >
                          {expandedField === index ? "Collapse" : "Expand"}
                        </button>
                        <button
                          onClick={() => removeFormField(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {expandedField === index && (
                      <div className="space-y-3 pt-3 border-t">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Field ID
                            </label>
                            <input
                              type="text"
                              value={field.fieldId}
                              onChange={(e) =>
                                updateFormField(
                                  index,
                                  "fieldId",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Field Type
                            </label>
                            <select
                              value={field.fieldType}
                              onChange={(e) =>
                                updateFormField(
                                  index,
                                  "fieldType",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {fieldTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              updateFormField(index, "label", e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            value={field.placeholder || ""}
                            onChange={(e) =>
                              updateFormField(
                                index,
                                "placeholder",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        {needsOptions(field.fieldType) && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-medium text-gray-700">
                                Options
                              </label>
                              <button
                                onClick={() => addOption(index)}
                                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                <Plus className="w-3 h-3 inline mr-1" />
                                Add
                              </button>
                            </div>
                            <div className="space-y-2">
                              {(field.options || []).map((option, optIdx) => (
                                <div key={optIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(
                                        index,
                                        optIdx,
                                        e.target.value,
                                      )
                                    }
                                    placeholder={`Option ${optIdx + 1}`}
                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  />
                                  <button
                                    onClick={() => removeOption(index, optIdx)}
                                    className="p-1.5 hover:bg-gray-200 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-700">
                            Required Field
                          </label>
                          <button
                            onClick={() =>
                              updateFormField(
                                index,
                                "required",
                                !field.required,
                              )
                            }
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                              field.required ? "bg-purple-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                                field.required
                                  ? "translate-x-5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {formFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No form fields added yet.</p>
                    <button
                      onClick={addFormField}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Add Your First Field
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Event
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Form Preview</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-lg mb-2">
                    {eventFormData.eventName || "Event Name"}
                  </h4>
                  {eventFormData.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {eventFormData.description}
                    </p>
                  )}
                  {eventFormData.eventDate && (
                    <p className="text-sm text-gray-600">
                      📅{" "}
                      {format(
                        new Date(eventFormData.eventDate),
                        "MMM dd, yyyy 'at' h:mm a",
                      )}
                    </p>
                  )}
                  {eventFormData.location && (
                    <p className="text-sm text-gray-600">
                      📍 {eventFormData.location}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  {formFields.map((field) => (
                    <div key={field.fieldId}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.fieldType === "textarea" ? (
                        <textarea
                          placeholder={field.placeholder}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                          rows={3}
                        />
                      ) : field.fieldType === "select" ? (
                        <select
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                        >
                          <option>{field.placeholder || "Select..."}</option>
                          {(field.options || []).map((opt, idx) => (
                            <option key={idx}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.fieldType}
                          placeholder={field.placeholder}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  disabled
                  className="w-full py-2 bg-purple-600 text-white rounded-lg opacity-50"
                >
                  Register for Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditEvent;
