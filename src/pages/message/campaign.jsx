import { MessageSquareText } from "lucide-react";
import { useFetchData } from "../../hook/Request";
import { formatDate, truncateMessage } from "../../utils/helpers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const navigate = useNavigate();
  const { data: messageData, loading } = useFetchData(
    `/api/v1/messages`,
    "messages"
  );
  const messages = messageData?.data?.messages || [];

  console.log({
    yyuuu: messages,
  });

  const [activeTab, setActiveTab] = useState("sent");

  // Separate messages into sent and scheduled
  const sentMessages = messages.filter(
    (msg) => msg.status === "sent" && !msg.scheduleAt
  );
  const scheduledMessages = messages.filter(
    (msg) =>
      msg.status === "scheduled" || (msg.scheduleAt && msg.status !== "sent")
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" };
      case "sent":
        return {
          bg: "bg-fadedGreen",
          text: "text-whatsappGreen",
          label: "Sent",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          label: "Pending",
        };
      case "scheduled":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          label: "Scheduled",
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: status };
    }
  };

  const getMessageTypeBadge = (type) => type?.toUpperCase() || "UNKNOWN";

  const displayMessages =
    activeTab === "sent" ? sentMessages : scheduledMessages;

  return (
    <div className="p-4 space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-darkBlueGray">
          All Campaigns
        </h2>
        <p className="text-inkyBlue mt-1 text-sm">
          {messages.length > 0
            ? `Total: ${messages.length} campaigns (${sentMessages.length} sent, ${scheduledMessages.length} scheduled)`
            : "You don't have any campaigns yet."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-3 px-2 font-medium text-sm transition-colors relative ${
            activeTab === "sent"
              ? "text-deepPurple"
              : "text-lightSlateGray hover:text-darkBlueGray"
          }`}
        >
          Sent ({sentMessages.length})
          {activeTab === "sent" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-deepPurple"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`pb-3 px-2 font-medium text-sm transition-colors relative ${
            activeTab === "scheduled"
              ? "text-deepPurple"
              : "text-lightSlateGray hover:text-darkBlueGray"
          }`}
        >
          Scheduled ({scheduledMessages.length})
          {activeTab === "scheduled" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-deepPurple"></span>
          )}
        </button>
      </div>

      {/* Empty State */}
      {displayMessages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-blueBayoux">
          <MessageSquareText className="w-12 h-12 mb-4 text-blueBayoux opacity-70" />
          <p className="text-base sm:text-lg font-medium text-darkBlueGray">
            No {activeTab} campaigns yet
          </p>
          <p className="text-sm text-inkyBlue mt-1">
            {activeTab === "sent"
              ? "When you send your first campaign, it'll appear here."
              : "When you schedule a campaign, it'll appear here."}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10 text-blueBayoux">
          <p>Loading campaigns...</p>
        </div>
      )}

      {/* Campaign Grid */}
      {!loading && displayMessages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayMessages.map((message) => {
            const statusBadge = getStatusBadge(message.status);

            return (
              <div
                key={message._id}
                onClick={() =>
                  navigate(`/campaigns/${message._id}`, { state: { message } })
                }
                className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <div className="bg-lightGrayishBlue p-1 w-6 rounded-sm mb-4">
                  <MessageSquareText size={16} className="text-deepPurple" />
                </div>

                <div className="text-center mb-4">
                  <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap justify-center">
                    <span className="text-xs font-normal bg-paleBlueGray text-darkBlueGray px-2 py-1 rounded-[6px]">
                      {getMessageTypeBadge(message.messageType)}
                    </span>
                    <span
                      className={`text-xs font-normal ${statusBadge.bg} ${statusBadge.text} px-2 py-1 rounded-[6px]`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-darkBlueGray text-center mb-4 text-sm sm:text-base leading-tight">
                  {truncateMessage(message.message, 40)}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-lightSlateGray text-sm sm:text-base font-medium">
                      Recipients:{" "}
                      <span className="text-blueBayoux">
                        {message.totalRecipients}
                      </span>
                    </span>
                    <span className="text-lightSlateGray text-sm sm:text-base font-medium">
                      Cost:{" "}
                      <span className="text-blueBayoux">
                        #{message.totalCost}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-darkBlueGray">
                    To:{" "}
                    <span className="text-blueBayoux font-medium">
                      {message.recipients?.[0]?.name || "N/A"}
                    </span>
                  </p>
                  {message.scheduleAt ? (
                    <p className="text-sm font-medium text-blue-600">
                      Scheduled: {formatDate(message.scheduleAt)}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-blueBayoux">
                      {formatDate(message.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
