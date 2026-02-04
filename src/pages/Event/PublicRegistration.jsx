// pages/Events/Public/PublicRegistration.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Loader,
  CheckCircle,
  X,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { BASE_API_URL } from "../../hook/api.config";

const apiUrl = BASE_API_URL;

const PublicRegistration = () => {
  const { eventId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationData, setRegistrationData] = useState(null);

  // Fetch public event
  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/event/public/${eventId}`,
        );

        setEventData(response.data.data);

        // Initialize form data
        const initialData = {};
        response.data.data.formFields.forEach((field) => {
          initialData[field.fieldId] = field.fieldType === "checkbox" ? [] : "";
        });
        setFormData(initialData);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Event not found or registration closed",
        );
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...currentValues, option] };
      } else {
        return {
          ...prev,
          [fieldId]: currentValues.filter((v) => v !== option),
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let registrantName = "";
    let registrantEmail = "";

    eventData.formFields.forEach((field) => {
      const value = formData[field.fieldId];

      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.fieldId] = `${field.label} is required`;
        }
      }

      // Capture name and email for submission
      if (field.fieldType === "email" && value) {
        registrantEmail = value;
      }
      if (
        (field.fieldId === "fullName" ||
          field.label.toLowerCase().includes("name")) &&
        value
      ) {
        registrantName = value;
      }

      // Email validation
      if (field.fieldType === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.fieldId] = "Invalid email address";
        }
      }

      // Phone validation
      if (field.fieldType === "phone" && value && field.validation?.pattern) {
        const phoneRegex = new RegExp(field.validation.pattern);
        if (!phoneRegex.test(value)) {
          newErrors[field.fieldId] = "Invalid phone number";
        }
      }

      // Number validation
      if (field.fieldType === "number" && value) {
        const numValue = Number(value);
        if (field.validation?.min && numValue < field.validation.min) {
          newErrors[field.fieldId] = `Minimum value is ${field.validation.min}`;
        }
        if (field.validation?.max && numValue > field.validation.max) {
          newErrors[field.fieldId] = `Maximum value is ${field.validation.max}`;
        }
      }
    });

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      registrantName,
      registrantEmail,
    };
  };

  const clearForm = () => {
    const initialData = {};
    eventData.formFields.forEach((field) => {
      initialData[field.fieldId] = field.fieldType === "checkbox" ? [] : "";
    });
    setFormData(initialData);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, registrantName, registrantEmail } = validateForm();

    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!registrantName || !registrantEmail) {
      toast.error("Name and email are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/event/public/${eventId}`,
        {
          registrantName,
          registrantEmail,
          responses: formData,
        },
      );

      // Save registration data
      setRegistrationData(response.data.data);

      // Clear form
      clearForm();

      // Show success modal
      setShowSuccessModal(true);

      toast.success("Registration successful!");
    } catch (error) {
      // Show error modal
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      setShowErrorModal(true);

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.fieldId] || "";
    const error = errors[field.fieldId];

    switch (field.fieldType) {
      case "text":
      case "email":
      case "phone":
      case "number":
      case "date":
        return (
          <div>
            <input
              type={field.fieldType}
              value={value}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div>
            <select
              value={value}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">{field.placeholder || "Select..."}</option>
              {(field.options || []).map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div>
            <div className="space-y-2">
              {(field.options || []).map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={field.fieldId}
                    value={option}
                    checked={value === option}
                    onChange={(e) =>
                      handleInputChange(field.fieldId, e.target.value)
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "checkbox":
        return (
          <div>
            <div className="space-y-2">
              {(field.options || []).map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        field.fieldId,
                        option,
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            Event not found or registration closed
          </p>
        </div>
      </div>
    );
  }

  const spotsLeft = eventData.capacity
    ? eventData.capacity - eventData.registrationCount
    : null;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {eventData.eventName}
            </h1>

            {eventData.description && (
              <p className="text-gray-600 mb-6">{eventData.description}</p>
            )}

            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                <span>
                  {format(
                    new Date(eventData.eventDate),
                    "EEEE, MMMM dd, yyyy 'at' h:mm a",
                  )}
                </span>
              </div>

              {eventData.location && (
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                  <span>{eventData.location}</span>
                </div>
              )}

              {eventData.capacity && (
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-3 text-purple-600" />
                  <span>
                    {spotsLeft > 0 ? (
                      <>
                        <span className="font-semibold text-green-600">
                          {spotsLeft} spots remaining
                        </span>{" "}
                        of {eventData.capacity}
                      </>
                    ) : (
                      <span className="font-semibold text-red-600">
                        Event is full
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Register for this Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {eventData.formFields.map((field) => (
                <div key={field.fieldId}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading || (eventData.capacity && spotsLeft <= 0)}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Successful!
              </h3>

              <p className="text-gray-600 mb-6">
                You have successfully registered for{" "}
                <strong>{eventData.eventName}</strong>
              </p>

              {registrationData && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Name:</strong> {registrationData.registrantName}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Email:</strong> {registrationData.registrantEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong>{" "}
                    <span className="text-green-600 font-medium">
                      {registrationData.status === "confirmed"
                        ? "Confirmed"
                        : "Pending Approval"}
                    </span>
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent to your email address.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Failed
              </h3>

              <p className="text-gray-600 mb-6">{errorMessage}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    // Optionally scroll to top of form
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicRegistration;
