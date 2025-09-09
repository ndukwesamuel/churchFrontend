import React, { useState } from "react";
import {
  MessageSquare,
  Users,
  Send,
  Mail,
  Eye,
  Settings,
  User,
  Bell,
  Smartphone,
} from "lucide-react";

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState("Church Profile");
  const [formData, setFormData] = useState({
    churchName: "Grace Community Church",
    pastorName: "Rev. John Smith",
    address: "123 Main Street, Brooklyn",
    phone: "+1(555) 123-3432",
    email: "info@gracechurch.com",
    website: "https://gracechurch.com",
    smsProvider: "Demo Mode (No Real SMS)",
    fromNumber: "+1(555) 123-3432",
    apiKey: "",
    enableSMS: true,
    notifications: {
      campaignCompletion: true,
      deliveryFailure: true,
      weeklyReports: true,
      notification: true,
    },
  });

  const tabs = [
    { name: "Church Profile", icon: User },
    { name: "SMS Configuration", icon: Smartphone },
    { name: "Email Configuration", icon: Mail },
    { name: "Notification", icon: Bell },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Church Profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Church Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Update your Church Information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Church Name
                </label>
                <input
                  type="text"
                  value={formData.churchName}
                  onChange={(e) =>
                    handleInputChange("churchName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pastor Name
                </label>
                <input
                  type="text"
                  value={formData.pastorName}
                  onChange={(e) =>
                    handleInputChange("pastorName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Save Changes
            </button>
          </div>
        );

      case "SMS Configuration":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Smartphone size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  SMS Configuration
                </h3>
                <p className="text-gray-600 text-sm">
                  Configure the SMS services settings
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Provider
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                  Demo Mode (No Real SMS)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Number
                </label>
                <input
                  type="text"
                  value={formData.fromNumber}
                  onChange={(e) =>
                    handleInputChange("fromNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter you API Key"
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Enable SMS messaging
                  </h4>
                </div>
                <button
                  onClick={() =>
                    handleInputChange("enableSMS", !formData.enableSMS)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.enableSMS ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.enableSMS ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Balance</h4>
                    <p className="text-sm text-gray-600">Demo Account</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    unlimited
                  </span>
                </div>
              </div>
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Save SMS Settings
            </button>
          </div>
        );

      case "Email Configuration":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Configuration
                </h3>
                <p className="text-gray-600 text-sm">
                  Configure your email settings
                </p>
              </div>
            </div>

            <div className="text-center py-12">
              <Mail size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Email configuration settings would go here
              </p>
            </div>
          </div>
        );

      case "Notification":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Notification
                </h3>
                <p className="text-gray-600 text-sm">
                  Configure your email notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Campaign Completion
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get notified when a campaign completes
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleNotificationChange(
                      "campaignCompletion",
                      !formData.notifications.campaignCompletion
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.campaignCompletion
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.campaignCompletion
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Delivery Failure
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get notified when a message fails to send
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleNotificationChange(
                      "deliveryFailure",
                      !formData.notifications.deliveryFailure
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.deliveryFailure
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.deliveryFailure
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                  <p className="text-sm text-gray-600">
                    Get inform about the weekly weekly activities
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleNotificationChange(
                      "weeklyReports",
                      !formData.notifications.weeklyReports
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.weeklyReports
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.weeklyReports
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notification</h4>
                  <p className="text-sm text-gray-600">
                    Configure your email notification preferences
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleNotificationChange(
                      "notification",
                      !formData.notifications.notification
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.notifications.notification
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notifications.notification
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Save Notification Settings
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Configuration settings for {activeTab}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1">
      <div className="bg-white">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your church profile and communication preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === tab.name
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Churchcomm
              </h1>
              <p className="text-gray-500 text-sm">Grace community church</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex">
        {/* Sidebar - Hidden on mobile, visible on larger screens */}
        {/* <div className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Eye size={16} />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Users size={16} />
                Contacts
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Send size={16} />
                Compose
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MessageSquare size={16} />
                Campaigns
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Mail size={16} />
                Templates
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Users size={16} />
                Files
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-white bg-blue-600 rounded-lg"
              >
                <Settings size={16} />
                Settings
              </a>
            </nav>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white">
            <div className="p-4 sm:p-6">
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Settings
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your church profile and communication preferences
                </p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                        activeTab === tab.name
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon size={16} />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-lg">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
