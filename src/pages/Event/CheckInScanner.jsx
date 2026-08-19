// pages/Event/CheckInScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  LogIn,
  LogOut,
  Loader,
  ScanLine,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useFetchData, useMutateData } from "../../hook/Request";
import { BASE_API_URL } from "../../hook/api.config";

const apiUrl = BASE_API_URL;
const READER_ID = "checkin-qr-reader";

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

// A scanned QR may encode the raw registration id, or a full URL that ends
// with it (e.g. a check-in link) — handle both.
const extractRegistrationId = (rawText) => {
  const trimmed = rawText.trim();
  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || trimmed;
  } catch {
    return trimmed;
  }
};

const CheckInScanner = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [scanned, setScanned] = useState(null);
  const [manualId, setManualId] = useState("");
  const [recentScans, setRecentScans] = useState([]);

  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  const { data: eventData } = useFetchData(
    `/api/v1/event/${eventId}`,
    `event-${eventId}`,
  );
  const event = eventData?.data;

  const { mutate: toggleCheckIn, isLoading: toggling } =
    useMutateData("event-registrations");

  const lookupRegistration = async (registrationId) => {
    setLookupLoading(true);
    setScanned(null);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/event/registration/${registrationId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setScanned(response.data.data.registration);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration not found for that code",
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleDecoded = (decodedText) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    const registrationId = extractRegistrationId(decodedText);
    lookupRegistration(registrationId).finally(() => {
      isProcessingRef.current = false;
    });
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const html5Qrcode = new Html5Qrcode(READER_ID);
      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => handleDecoded(decodedText),
        () => {},
      );

      setCameraActive(true);
    } catch (err) {
      setCameraError(
        "Could not access the camera. Check permissions or use manual entry below.",
      );
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        await scanner.stop();
        await scanner.clear();
      } catch {
        // already stopped
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualLookup = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    lookupRegistration(extractRegistrationId(manualId));
  };

  const handleToggleCheckIn = () => {
    if (!scanned) return;
    const wasCheckedIn = scanned.checkedIn;

    toggleCheckIn(
      { url: `/api/v1/event/registration/${scanned._id}/checkin` },
      {
        onSuccess: (response) => {
          toast.success(
            response?.message || (wasCheckedIn ? "Checked out" : "Checked in"),
          );
          setScanned((prev) =>
            prev ? { ...prev, checkedIn: !wasCheckedIn } : prev,
          );
          setRecentScans((prev) =>
            [
              {
                id: scanned._id,
                name: scanned.registrantName,
                checkedIn: !wasCheckedIn,
                at: new Date(),
              },
              ...prev,
            ].slice(0, 8),
          );
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to update check-in status");
        },
      },
    );
  };

  const scanNext = () => {
    setScanned(null);
    setManualId("");
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/events/${eventId}/registrations`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Registrations
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Scan to Check In
        </h1>
        <p className="text-gray-600 text-sm">{event?.eventName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-purple-600" />
              Camera
            </h2>
            {cameraActive ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <CameraOff className="w-4 h-4" />
                Stop
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Camera className="w-4 h-4" />
                Start Camera
              </button>
            )}
          </div>

          <div
            id={READER_ID}
            className={`w-full rounded-lg overflow-hidden bg-black ${
              cameraActive ? "min-h-[300px]" : "hidden"
            }`}
          />

          {!cameraActive && !cameraError && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed rounded-lg">
              <Camera className="w-10 h-10 mb-2" />
              <p className="text-sm">Camera is off</p>
            </div>
          )}

          {cameraError && (
            <p className="mt-3 text-sm text-red-600">{cameraError}</p>
          )}

          {/* Manual fallback */}
          <form onSubmit={handleManualLookup} className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or enter code / registration ID manually
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="e.g. registration ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Look Up
              </button>
            </div>
          </form>
        </div>

        {/* Result */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Scan Result</h2>

          {lookupLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Loader className="w-8 h-8 animate-spin text-purple-600 mb-3" />
              Looking up registration...
            </div>
          ) : !scanned ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed rounded-lg">
              <ScanLine className="w-10 h-10 mb-2" />
              <p className="text-sm">Scan a QR code to see details here</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-xl font-semibold text-gray-900">
                  {scanned.registrantName}
                </p>
                <p className="text-sm text-gray-600">
                  {scanned.registrantEmail}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                      scanned.status,
                    )}`}
                  >
                    {scanned.status?.charAt(0).toUpperCase() +
                      scanned.status?.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      scanned.checkedIn
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {scanned.checkedIn ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Currently Checked
                        In
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> Not Checked In
                      </>
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleCheckIn}
                disabled={toggling}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium mb-3 transition disabled:opacity-50 ${
                  scanned.checkedIn
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {scanned.checkedIn ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    {toggling ? "Checking out..." : "Check Out"}
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {toggling ? "Checking in..." : "Check In"}
                  </>
                )}
              </button>

              <button
                onClick={scanNext}
                className="w-full py-2.5 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Scan Next Person
              </button>
            </div>
          )}

          {recentScans.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Recent Activity
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentScans.map((entry, idx) => (
                  <div
                    key={`${entry.id}-${idx}`}
                    className="flex items-center justify-between text-sm border-b border-gray-100 pb-2"
                  >
                    <div className="flex items-center gap-2 text-gray-700">
                      {entry.checkedIn ? (
                        <LogIn className="w-4 h-4 text-green-600" />
                      ) : (
                        <LogOut className="w-4 h-4 text-gray-500" />
                      )}
                      {entry.name}
                    </div>
                    <span className="text-xs text-gray-400">
                      {entry.at.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInScanner;
