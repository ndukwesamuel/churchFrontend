import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Bell } from "lucide-react";
import SMSConfigContent from "./_components/smsConfiguration";
import EmailConfigContent from "./_components/emailConfiguration";
import NotificationContent from "./_components/notification";
import ChurchProfileContent from "./_components/churchProfile";
import SettingsItem from "./_components/settingsItems";
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileView, setMobileView] = useState(null);

  const tabs = [
    {
      id: "profile",
      label: "Church Profile",
      icon: User,
      description: "Update your Church Information",
    },
    {
      id: "sms",
      label: "SMS Configuration",
      icon: Phone,
      description: "Configure the SMS services settings",
    },
    {
      id: "email",
      label: "Email Configuration",
      icon: Mail,
      description: "Configure the email services settings",
    },
    {
      id: "notification",
      label: "Notification",
      icon: Bell,
      description: "Configure your email notification preferences",
    },
  ];

  const renderContent = (tabId) => {
    switch (tabId) {
      case "profile":
        return <ChurchProfileContent />;
      case "sms":
        return <SMSConfigContent />;
      case "email":
        return <EmailConfigContent />;
      case "notification":
        return <NotificationContent />;
      default:
        return <ChurchProfileContent />;
    }
  };

  // Mobile view - individual tab content
  if (mobileView) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setMobileView(null)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <div className="p-4">{renderContent(mobileView)}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your church profile and communication preferences
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-[#5B38DB] text-[#5B38DB]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="bg-white">{renderContent(activeTab)}</div>
        </div>

        {/* Mobile Column Layout */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg border border-gray-200">
            {tabs.map((tab, index) => (
              <SettingsItem
                key={tab.id}
                icon={tab.icon}
                title={tab.label}
                description={tab.description}
                onClick={() => setMobileView(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
