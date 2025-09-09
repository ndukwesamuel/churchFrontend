import { useState } from "react";
import { Bell } from "lucide-react";

const NotificationContent = () => {
  const [notifications, setNotifications] = useState({
    campaignCompletion: false,
    deliveryFailure: true,
    weeklyReports: false,
    emailNotifications: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationItems = [
    {
      key: "campaignCompletion",
      title: "Campaign Completion",
      description: "Get notified when a campaign completes",
    },
    {
      key: "deliveryFailure",
      title: "Delivery Failure",
      description: "Get notified when a message fails to send",
    },
    {
      key: "weeklyReports",
      title: "Weekly Reports",
      description: "Get informed about the weekly activities",
    },
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Configure your email notification preferences",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
          <Bell className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Notification</h3>
          <p className="text-sm text-gray-500">
            Configure your email notification preferences
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification(item.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[item.key] ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[item.key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}

        <div className="flex justify-start pt-4">
          <button
            type="button"
            className="bg-[#5B38DB] text-white px-6 py-2 rounded-full hover:bg-[#4A2FB8] transition-colors"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationContent;
