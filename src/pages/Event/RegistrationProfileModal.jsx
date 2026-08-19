// pages/Event/_components/RegistrationProfileModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Loader, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
// import { useMutateData } from "../../../hook/Request";
import { BASE_API_URL } from "../../hook/api.config";
import { useMutateData } from "../../hook/Request";

const apiUrl = BASE_API_URL;

const statusBadgeClass = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "attended":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Shows a single registrant's full profile: identity, status, check-in QR
// code, form responses (relabeled with the event's actual question text),
// and check-in history. Check-in/out is a button here — QR *scanning* is
// planned for the mobile app later; on web this modal is where an admin
// would look up someone by hand and toggle them in/out directly.
const RegistrationProfileModal = ({
  registrationId,
  onClose,
  onCheckInToggled,
}) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const { mutate: toggleCheckIn, isLoading: checkingIn } =
    useMutateData("event-registrations");

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/event/registration/${registrationId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setProfile(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load registration profile",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationId]);

  const handleToggleCheckIn = () => {
    toggleCheckIn(
      { url: `/api/v1/event/registration/${registrationId}/checkin` },
      {
        onSuccess: (response) => {
          toast.success(response?.message || "Check-in status updated");
          fetchProfile(); // refresh this modal
          onCheckInToggled?.(); // let the parent list refresh too
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to update check-in status");
        },
      },
    );
  };

  const registration = profile?.registration;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">
            Registrant Profile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Identity */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-900">
                  {registration.registrantName}
                </p>
                <p className="text-sm text-gray-600">
                  {registration.registrantEmail}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                      registration.status,
                    )}`}
                  >
                    {registration.status.charAt(0).toUpperCase() +
                      registration.status.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      registration.checkedIn
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {registration.checkedIn ? (
                      <>
                        <LogIn className="w-3 h-3" /> Checked In
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3 h-3" /> Checked Out
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* QR code */}
              <div className="flex flex-col items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <img
                  src={profile.qrCode}
                  alt="Check-in QR code"
                  className="w-48 h-48"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  For this person to scan in later. For now, use the button
                  below to check them in or out.
                </p>
              </div>

              {/* Check-in toggle */}
              <button
                onClick={handleToggleCheckIn}
                disabled={checkingIn}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium mb-6 transition disabled:opacity-50 ${
                  registration.checkedIn
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {registration.checkedIn ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    {checkingIn ? "Checking out..." : "Check Out"}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {checkingIn ? "Checking in..." : "Check In"}
                  </>
                )}
              </button>

              {/* Form responses, relabeled with the event's question text */}
              {profile.formattedResponses &&
                Object.keys(profile.formattedResponses).length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Registration Details
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(profile.formattedResponses).map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-2"
                          >
                            <span className="text-gray-500">{label}</span>
                            <span className="text-gray-900 text-right">
                              {value || "—"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Check-in history */}
              {registration.checkInHistory?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Check-In History
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[...registration.checkInHistory]
                      .reverse()
                      .map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          {entry.action === "in" ? (
                            <LogIn className="w-4 h-4 text-green-600" />
                          ) : (
                            <LogOut className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="capitalize">{entry.action}</span>
                          <span className="text-gray-400">
                            {format(
                              new Date(entry.timestamp),
                              "MMM dd, yyyy h:mm a",
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationProfileModal;
