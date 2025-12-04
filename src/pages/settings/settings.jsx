import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Bell, Users } from "lucide-react";
import SMSConfigContent from "./_components/smsConfiguration";
import EmailConfigContent from "./_components/emailConfiguration";
import NotificationContent from "./_components/notification";
import ChurchProfileContent from "./_components/churchProfile";
import GroupSettingsContent from "./_components/groupsettingscontent";
import SettingsItem from "./_components/settingsItems";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";

const SettingsPage = () => {
  const [mobileView, setMobileView] = useState();

  const { ChurchProfile } = useSelector((state) => state?.reducer?.AuthSlice);

  console.log({
    ffff: ChurchProfile,
  });

  const tabs = [
    {
      id: "profile",
      label: "Church Profile",
      icon: User,
      description: "Update your Church Information",
      content: <ChurchProfileContent />,
    },
    {
      id: "groups",
      label: "Group Settings",
      icon: Users,
      description: "Manage your church groups and their descriptions",
      content: <GroupSettingsContent />,
    },
    {
      id: "sms",
      label: "SMS Configuration",
      icon: Phone,
      description: "Configure the SMS services settings",
      content: <SMSConfigContent />,
    },
    {
      id: "email",
      label: "Email Configuration",
      icon: Mail,
      description: "Configure the email services settings",
      content: <EmailConfigContent />,
    },
    {
      id: "notification",
      label: "Notification",
      icon: Bell,
      description: "Configure your email notification preferences",
      content: <NotificationContent />,
    },
  ];

  // Mobile view - single tab content with back button
  if (mobileView) {
    const activeTab = tabs.find((t) => t.id === mobileView);
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setMobileView(null)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
          </button>
        </div>
        <div className="p-4">{activeTab?.content}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
          <Tabs defaultValue="profile" className="flex flex-col w-full">
            <TabsList className="flex-1 border-b border-gray-200 mb-6 space-x-4 justify-start">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative py-2 px-3 text-sm font-medium data-[state=active]:text-[#5B38DB] data-[state=active]:border-b-2 data-[state=active]:border-[#5B38DB] border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <div className="bg-white">{tab.content}</div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Mobile Column Layout */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg border border-gray-200">
            {tabs.map((tab) => (
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
