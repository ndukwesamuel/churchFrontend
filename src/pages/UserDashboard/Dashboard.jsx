import React, { useEffect } from "react";
import { MessageSquare, Users, Send, Mail, Eye, Settings } from "lucide-react";
import { useFetchData } from "../../hook/Request";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    data: contactsData,
    refetch,
    isLoading,
  } = useFetchData(`/api/v1/contacts`, "contacts");

  // Dispatch contacts to Redux when they load
  useEffect(() => {
    if (contactsData?.data) {
      dispatch(setContacts(contactsData.data));
    }
  }, [contactsData, dispatch]);
  const stats = [
    {
      title: "Total messages sent",
      value: "247",
      change: "+12% this month",
      icon: MessageSquare,
    },
    {
      title: "Active contact",
      value: "247",
      change: "+12% this month",
      icon: Users,
    },
    { title: "SMS Sent", value: "447", change: "+12% this month", icon: Send },
    {
      title: "Email sent",
      value: "127",
      change: "+12% this month",
      icon: Mail,
    },
  ];

  const campaigns = Array(8).fill({
    title: "Sunday service Reminder",
    sent: 147,
    delivered: 123,
    date: "2025-01-26",
    hasEmail: true,
    hasSMS: true,
    status: "Completed",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Church communication Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your church's SMS and email communication
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Users size={16} />
              <span className="hidden sm:inline">Manage contacts</span>
              <span className="sm:hidden">Contacts</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Eye size={16} />
              <span className="hidden sm:inline">View Campaigns</span>
              <span className="sm:hidden">Campaigns</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-sm">
              <Send size={16} />
              <span className="hidden sm:inline">Send new message</span>
              <span className="sm:hidden">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <stat.icon size={18} className="text-gray-600" />
                </div>
                <MessageSquare size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center text-xs sm:text-sm">
                  <span className="text-green-600 font-medium">
                    📈 {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Campaigns Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Campaigns
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              You latest message campaigns
            </p>
          </div>

          {/* Campaigns Grid */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {campaigns.map((campaign, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${
                    index === 0
                      ? "border-blue-500 border-dashed bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageSquare size={20} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        SMS
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Email
                      </span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        Completed
                      </span>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 text-center mb-4 text-sm sm:text-base leading-tight">
                    {campaign.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">
                        Sent: {campaign.sent}
                      </span>
                      <span className="text-gray-600">
                        Delivered: {campaign.delivered}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (campaign.delivered / campaign.sent) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    {campaign.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
