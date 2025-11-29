import {
  MessageSquareText,
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { formatDate } from "../../utils/helpers";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Get message from passed state
  const message = location.state?.message;

  console.log({
    message,
    id,
    state: location.state,
  });

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

  const getMessageTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "sms":
        return <MessageCircle className="w-5 h-5" />;
      case "whatsapp":
        return <Send className="w-5 h-5" />;
      default:
        return <MessageSquareText className="w-5 h-5" />;
    }
  };

  if (!message) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-darkBlueGray text-lg font-medium mb-2">
          Campaign not found
        </p>
        <p className="text-lightSlateGray text-sm mb-4">
          No campaign data available. Please navigate from the campaigns list.
        </p>
        <button
          onClick={() => navigate("/campaigns")}
          className="bg-deepPurple text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          Go back to campaigns
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(message.status);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-lightSlateGray hover:text-darkBlueGray mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Campaigns</span>
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-darkBlueGray mb-2">
              Campaign Details
            </h1>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-medium bg-paleBlueGray text-darkBlueGray px-3 py-1.5 rounded-[6px]">
                {message.messageType?.toUpperCase()}
              </span>
              <span
                className={`text-xs font-medium ${statusBadge.bg} ${statusBadge.text} px-3 py-1.5 rounded-[6px]`}
              >
                {statusBadge.label}
              </span>
            </div>
          </div>

          <div className="bg-lightGrayishBlue p-3 rounded-lg">
            {getMessageTypeIcon(message.messageType)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Users className="w-5 h-5 text-deepPurple" />
            </div>
            <div>
              <p className="text-xs text-lightSlateGray">Recipients</p>
              <p className="text-xl font-semibold text-darkBlueGray">
                {message.totalRecipients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-lightSlateGray">Total Cost</p>
              <p className="text-xl font-semibold text-darkBlueGray">
                #{message.totalCost}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-lightSlateGray">Created</p>
              <p className="text-sm font-semibold text-darkBlueGray">
                {formatDate(message.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-lightSlateGray">
                {message.scheduleAt ? "Scheduled For" : "Sent At"}
              </p>
              <p className="text-sm font-semibold text-darkBlueGray">
                {message.scheduleAt
                  ? formatDateTime(message.scheduleAt)
                  : message.sentAt
                  ? formatDateTime(message.sentAt)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-darkBlueGray mb-4">
              Message Content
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-darkBlueGray whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {/* Recipients List */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-darkBlueGray mb-4">
              Recipient Groups ({message.recipients?.length || 0})
            </h2>
            <div className="space-y-3">
              {message.recipients?.map((recipient) => (
                <div
                  key={recipient._id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-darkBlueGray mb-1">
                        {recipient.name}
                      </h3>
                      <p className="text-sm text-lightSlateGray">
                        {recipient.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Campaign Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-darkBlueGray mb-4">
              Campaign Info
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-lightSlateGray mb-1">Campaign ID</p>
                <p className="text-sm font-mono text-darkBlueGray break-all">
                  {message._id}
                </p>
              </div>
              <div>
                <p className="text-xs text-lightSlateGray mb-1">Message Type</p>
                <p className="text-sm font-medium text-darkBlueGray">
                  {message.messageType?.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs text-lightSlateGray mb-1">Status</p>
                <span
                  className={`inline-block text-xs font-medium ${statusBadge.bg} ${statusBadge.text} px-2 py-1 rounded-[6px]`}
                >
                  {statusBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-darkBlueGray mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-deepPurple rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-200"></div>
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-darkBlueGray">
                    Created
                  </p>
                  <p className="text-xs text-lightSlateGray">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>

              {message.scheduleAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-darkBlueGray">
                      Scheduled
                    </p>
                    <p className="text-xs text-lightSlateGray">
                      {formatDateTime(message.scheduleAt)}
                    </p>
                  </div>
                </div>
              )}

              {message.sentAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-whatsappGreen rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-darkBlueGray">
                      Sent
                    </p>
                    <p className="text-xs text-lightSlateGray">
                      {formatDateTime(message.sentAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
