import React, { useEffect } from "react";
import {
  MessageSquareText,
  MessageSquare,
  Users,
  Send,
  Mail,
  Eye,
  Settings,
} from "lucide-react";
import { useFetchData } from "../../hook/Request";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { data, refetch, isLoading } = useFetchData(
    `/api/v1/dashboard`,
    "setting"
  );
  console.log(data?.data);
  const statsDetails = data?.data;
  // Dispatch contacts to Redux when they load

  const stats = [
    {
      title: "Total messages sent",
      value: statsDetails?.totalMessagesSent || 0,
      change: "+12% this month",
      icon: Send,
    },
    {
      title: "Active contact",
      value: statsDetails?.activeUsers || 0,
      change: "6% this month",
      icon: Users,
    },
    {
      title: "SMS Sent",
      value:
        statsDetails?.messageTypeCounts.find((m) => m.messageType === "sms")
          ?.count || 0,
      change: "+10% this month",
      icon: MessageSquareText,
    },
    {
      title: "Email sent",
      value:
        statsDetails?.messageTypeCounts.find((m) => m.messageType === "email")
          ?.count || 0,
      change: "+22% this month",
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
            <h1 className="text-xl sm:text-2xl font-semibold text-darkBlueGray">
              Church communication Dashboard
            </h1>
            <p className="text-slateBlue mt-1 text-sm sm:text-base">
              Manage your church's SMS and email communication
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Left group of 2 buttons */}
            <div className="flex flex-1 gap-2">
              <button className="flex flex-1 items-center justify-center gap-2 px-4 py-4 text-darkBlueGray bg-paleBlueGray rounded-full font-medium hover:bg-gray-50 text-sm whitespace-nowrap">
                <Users size={16} />
                <span>Manage contacts</span>
              </button>

              <button className="flex flex-1 items-center justify-center gap-2 px-4 py-4 text-darkBlueGray bg-paleBlueGray rounded-full font-medium hover:bg-gray-50 text-sm whitespace-nowrap">
                <Eye size={16} />
                <span>View campaigns</span>
              </button>
            </div>

            {/* Right button */}
            <button className="flex flex-1 items-center justify-center gap-2 px-4 py-4 rounded-full text-paleBlue bg-deepPurple hover:bg-deepPurple/90 font-medium text-sm whitespace-nowrap">
              <Send size={16} />
              <span>Send new message</span>
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
              className="bg-white rounded-xl border-none p-4 sm:p-6"
            >
              <div className="flex justify-between items-center mb-2 p-2">
                <p className="text-xs sm:text-sm font-medium text-inkyBlue mb-1">
                  {stat.title}
                </p>

                <div className="bg-lightGrayishBlue flex items-center p-1 rounded-sm">
                  <stat.icon size={14} className="text-darkBlueGray " />
                </div>
              </div>

              <p className="text-2xl sm:text-3xl font-semibold text-darkBlueGray mb-2">
                {stat.value}
              </p>
              <div className="flex items-center text-xs sm:text-sm">
                <span className=" font-normal">
                  📈 <span className="text-inkyBlue"> {stat.change}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Campaigns Section */}
        <div className="space-y-5">
          <div className=" ">
            <h2 className="text-lg font-semibold text-darkBlueGray">
              Recent Campaigns
            </h2>
            <p className="text-inkyBlue mt-1 text-sm">
              Your latest message campaigns
            </p>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="border- rounded-lg bg-white p-4 ">
                <div className="bg-lightGrayishBlue p-1 w-6 rounded-sm mb-4">
                  <MessageSquareText size={16} className="text-deepPurple" />
                </div>

                <div className="text-center mb-4">
                  <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-normal bg-paleBlueGray text-darkBlueGray px-2 py-1 rounded-[6px]">
                      SMS
                    </span>
                    <span className="text-xs font-normal bg-paleBlueGray text-darkBlueGray px-2 py-1 rounded-[6px]">
                      Email
                    </span>
                    <span className="text-xs font-normal bg-fadedGreen text-whatsappGreen px-2 py-1 rounded-[6px]">
                      Completed
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-darkBlueGray text-center mb-4 text-sm sm:text-base leading-tight">
                  {campaign.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-lightSlateGray text-sm sm:text-base font-medium">
                      Sent:{" "}
                      <span className="text-blueBayoux">{campaign.sent}</span>
                    </span>
                    <span className="text-lightSlateGray text-sm sm:text-base font-medium">
                      Delivered:
                      <span className="text-blueBayoux">
                        {campaign.delivered}
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-paleBlueGray rounded-full h-2">
                    <div
                      className="bg-deepPurple h-2 rounded-full"
                      style={{
                        width: `${(campaign.delivered / campaign.sent) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm font-medium text-blueBayoux">
                  {campaign.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
