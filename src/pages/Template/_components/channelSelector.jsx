import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export const ChannelSelector = ({ selectedChannels, onChannelChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const channels = [
    { id: "email", name: "Email" },
    { id: "whatsapp", name: "WhatsApp" },
    { id: "sms", name: "SMS" },
  ];

  const toggleChannel = (channelId) => {
    const newChannels = selectedChannels.includes(channelId)
      ? selectedChannels.filter((id) => id !== channelId)
      : [...selectedChannels, channelId];
    onChannelChange(newChannels);
  };

  const getPlaceholderText = () => {
    if (selectedChannels.length === 0) return "Select channels...";
    if (selectedChannels.length === 1) {
      const channel = channels.find((c) => c.id === selectedChannels[0]);
      return channel?.name;
    }
    return `${selectedChannels.length} channels selected`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Channel *
      </label>

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-left bg-lightGray border border-gray-300 rounded-md shadow-sm outline-none flex items-center justify-between"
        >
          <span className="text-sm text-gray-700">{getPlaceholderText()}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="py-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => toggleChannel(channel.id)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center gap-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel.id)}
                      onChange={() => {}} // Handled by button onClick
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 pointer-events-none"
                    />
                    <span className="text-gray-700">{channel.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}

      {/* Selected Channels Tags */}
      {selectedChannels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedChannels.map((channelId) => {
            const channel = channels.find((c) => c.id === channelId);
            return (
              <span
                key={channelId}
                className={
                  "bg-[#E7F7ED] text-[#096A30] px-2 py-1 text-xs font-medium rounded-md flex items-center gap-1"
                }
              >
                {channel.name}
                <button
                  type="button"
                  onClick={() => toggleChannel(channelId)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
