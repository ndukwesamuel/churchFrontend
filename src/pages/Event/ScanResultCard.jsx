// pages/Event/ScanResultCard.jsx
import React from "react";
import { X, Loader, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useFetchData, useMutateData, usePatchData } from "../../hook/Request";

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

// Dedicated panel for the check-in scanner flow. Unlike RegistrationProfileModal,
// this always shows exactly ONE button that does exactly one thing:
//   - not checked in yet  -> "Check In"  (also marks them attended if needed)
//   - already checked in  -> "Check Out"
// No two-step "mark attended, then check in" dance — one click always works,
// even for someone who hasn't been marked attended yet.
const ScanResultCard = ({ registrationId, onClose, onCheckInToggled }) => {
  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData(
    `/api/v1/event/registration/${registrationId}/profile`,
    `registration-profile-${registrationId}`,
    { enabled: !!registrationId },
  );

  const { mutate: toggleCheckIn, isLoading: togglingCheckIn } =
    useMutateData("event-registrations");
  const { mutate: updateStatus, isLoading: markingAttended } =
    usePatchData("event-registrations");

  const profile = profileData?.data;
  const registration = profile?.registration;
  const isBusy = togglingCheckIn || markingAttended;

  const doCheckIn = () => {
    toggleCheckIn(
      { url: `/api/v1/event/registration/${registrationId}/checkin` },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Checked in");
          refetch();
          onCheckInToggled?.();
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to check in");
        },
      },
    );
  };

  const doCheckOut = () => {
    toggleCheckIn(
      { url: `/api/v1/event/registration/${registrationId}/checkin` },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Checked out");
          refetch();
          onCheckInToggled?.();
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to check out");
        },
      },
    );
  };

  const handleCheckInOut = () => {
    if (!registration) return;

    // Already checked in -> single step, just check out.
    if (registration.checkedIn) {
      doCheckOut();
      return;
    }

    // Not checked in yet. If they also haven't been marked attended,
    // do that first, then immediately check them in, as one click.
    if (registration.status !== "attended") {
      updateStatus(
        {
          url: `/api/v1/event/registration/${registrationId}/status`,
          data: { status: "attended" },
        },
        {
          onSuccess: () => doCheckIn(),
          onError: (err) => {
            toast.error(err?.message || "Failed to check in");
          },
        },
      );
    } else {
      doCheckIn();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Scanned Registrant
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading registrant...</p>
            </div>
          ) : isError || !registration ? (
            <div className="text-center py-12 text-red-600">
              <p>{error?.message || "Registration not found"}</p>
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

              {/* Always-visible single-purpose button */}
              <button
                onClick={handleCheckInOut}
                disabled={isBusy}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 ${
                  registration.checkedIn
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {registration.checkedIn ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    {isBusy ? "Checking out..." : "Check Out"}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {isBusy ? "Checking in..." : "Check In"}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanResultCard;
