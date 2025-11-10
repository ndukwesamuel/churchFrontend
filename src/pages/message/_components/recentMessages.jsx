import { MessageSquareText } from "lucide-react";
import { formatDate, truncateMessage } from "../../../utils/helpers";
import { useFetchData } from "../../../hook/Request";

const RecentMessages = () => {
  const { data: messageData, loading } = useFetchData(
    `/api/v1/messages`,
    "messages"
  );

  // Extract and limit to 8
  const messages = messageData?.data?.messages || [];
  const recentMessages = messages.slice(0, 8);

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
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: status };
    }
  };

  const getMessageTypeBadge = (type) => type.toUpperCase();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-darkBlueGray">
          Recent Campaigns
        </h2>
        <p className="text-inkyBlue mt-1 text-sm">
          {recentMessages.length > 0
            ? `Your Last ${recentMessages.length} Campaigns`
            : "You don't have any Campaigns yet"}
        </p>
      </div>

      {/* 🔹 Empty State */}
      {recentMessages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-blueBayoux">
          <MessageSquareText className="w-12 h-12 mb-4 text-blueBayoux opacity-70" />
          <p className="text-base sm:text-lg font-medium text-darkBlueGray">
            No messages yet
          </p>
          <p className="text-sm text-inkyBlue mt-1">
            When you send your first message, it'll appear here.
          </p>
        </div>
      )}

      {/* 🔹 Message Grid */}
      {recentMessages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentMessages.map((message) => {
            const statusBadge = getStatusBadge(message.status);

            return (
              <div
                key={message._id}
                className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
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
                        ${message.totalCost}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-darkBlueGray">
                    To:{" "}
                    <span className="text-blueBayoux font-medium">
                      {message.recipients[0]?.name}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-blueBayoux">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentMessages;
