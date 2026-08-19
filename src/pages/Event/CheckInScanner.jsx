// pages/Event/CheckInScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { ArrowLeft, Camera, CameraOff, ScanLine } from "lucide-react";
import { useFetchData } from "../../hook/Request";
import RegistrationProfileModal from "./RegistrationProfileModal";

const READER_ID = "checkin-qr-reader";

// A scanned QR may encode a JSON payload ({"registrationId":"...","eventId":"..."}),
// a full URL that ends with the id (e.g. a check-in link), or the raw id itself.
const extractRegistrationId = (rawText) => {
  const trimmed = rawText.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed?.registrationId) return parsed.registrationId;
  } catch {
    // not JSON, fall through
  }

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
  const [manualId, setManualId] = useState("");
  const [profileRegistrationId, setProfileRegistrationId] = useState(null);

  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

  const { data: eventData } = useFetchData(
    `/api/v1/event/${eventId}`,
    `event-${eventId}`,
  );
  const event = eventData?.data;

  const handleDecoded = (decodedText) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Freeze the camera on the hit so the same code isn't re-decoded every
    // frame while it's still in view — resumes when the profile is closed.
    try {
      scannerRef.current?.pause(true);
    } catch {
      // ignore if already paused/stopped
    }

    setProfileRegistrationId(extractRegistrationId(decodedText));
    isProcessingRef.current = false;
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
    setProfileRegistrationId(extractRegistrationId(manualId));
  };

  const closeProfile = () => {
    setProfileRegistrationId(null);
    setManualId("");
    try {
      scannerRef.current?.resume();
    } catch {
      // camera may be stopped, nothing to resume
    }
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

      <div className="max-w-xl">
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

          <div className="relative w-full min-h-[300px] rounded-lg overflow-hidden bg-black">
            <div id={READER_ID} className="w-full h-full" />

            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                <Camera className="w-10 h-10 mb-2" />
                <p className="text-sm">Camera is off</p>
              </div>
            )}
          </div>

          {cameraError && (
            <p className="mt-3 text-sm text-red-600">{cameraError}</p>
          )}

          <p className="mt-4 text-sm text-gray-500">
            Scanning a code opens the registrant's profile, where you can
            check them in or out.
          </p>

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
      </div>

      {profileRegistrationId && (
        <RegistrationProfileModal
          registrationId={profileRegistrationId}
          onClose={closeProfile}
          onCheckInToggled={() => {}}
        />
      )}
    </div>
  );
};

export default CheckInScanner;