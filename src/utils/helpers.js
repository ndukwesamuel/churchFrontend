export const capitalizeWords = (str) => {
  return str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export function formatDate(dateInput) {
  const date = new Date(dateInput);

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}
export const getChannelBadgeColor = (channel) => {
  switch (channel?.toLowerCase()) {
    case "sms":
      return "bg-black text-white";
    case "whatsapp":
      return "bg-[#E7F7ED] text-[#0A7937]";
    case "email":
      return "bg-[#FFEDD4] text-[#9F2D00]";
    default:
      return "bg-gray-500 text-white";
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
