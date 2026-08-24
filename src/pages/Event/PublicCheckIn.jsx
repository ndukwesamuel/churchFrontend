// pages/Event/PublicCheckIn.jsx
// TEMPORARY page for a one-off test — no login required. Search a
// registrant by name or group tag (e.g. "S01"), open their info, and
// check them in/out. Talks only to the two public-test endpoints; remove
// alongside those routes by end of September 2026.
import React, { useEffect, useState } from "react";
import { Search, X, LogIn, LogOut, Loader, User } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { BASE_API_URL } from "../../hook/api.config";

const apiUrl = BASE_API_URL;

const PublicCheckIn = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [togglingCheckIn, setTogglingCheckIn] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/event/public-test/everyone`,
      );
      setRegistrations(response.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load registrants",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const search = searchTerm.trim().toLowerCase();
  const results = search
    ? registrations.filter(
        (reg) =>
          reg.registrantName.toLowerCase().includes(search) ||
          (reg.groupCode && reg.groupCode.toLowerCase().includes(search)),
      )
    : registrations;

  const handleToggleCheckIn = async () => {
    if (!selected) return;
    setTogglingCheckIn(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/event/public-test/registration/${selected._id}/checkin`,
      );
      toast.success(response.data?.message);

      const updated = {
        ...selected,
        checkedIn: response.data.data.checkedIn,
      };
      setSelected(updated);
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === updated._id ? { ...reg, checkedIn: updated.checkedIn } : reg)),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update check-in status",
      );
    } finally {
      setTogglingCheckIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Event Check-In
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              autoFocus
              placeholder="Search by name or tag (e.g. S01)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              {search ? "No matches found" : "No registrants yet"}
            </p>
          ) : (
            <div className="mt-4 divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {results.map((reg) => (
                <button
                  key={reg._id}
                  onClick={() => setSelected(reg)}
                  className="w-full flex items-center justify-between py-3 px-2 text-left hover:bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {reg.registrantName}
                    </p>
                    {reg.groupCode && (
                      <span className="text-xs text-purple-700 font-semibold">
                        {reg.groupCode}
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reg.checkedIn
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {reg.checkedIn ? "In" : "Out"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Registrant modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-purple-100 mb-3">
                <User className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selected.registrantName}
              </h3>
              {selected.groupCode && (
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                  {selected.groupCode}
                </span>
              )}
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selected.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Currently</span>
                <span
                  className={`font-medium ${
                    selected.checkedIn ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {selected.checkedIn ? "Checked In" : "Checked Out"}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleCheckIn}
              disabled={togglingCheckIn}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white disabled:opacity-50 ${
                selected.checkedIn
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-green-600 hover:bg-red-700"
              }`}
            >
              {togglingCheckIn ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : selected.checkedIn ? (
                <>
                  <LogOut className="w-5 h-5" />
                  Check Out
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Check In
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCheckIn;
