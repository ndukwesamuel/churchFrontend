import { Eye, Edit, Copy, Trash2 } from "lucide-react";
import { capitalizeWords, formatDate } from "../../../utils/helpers";

export const TemplateCard = ({
  template,
  getChannelBadgeColor,
  onEdit,
  onView,
  onCopy,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit(template);
  };

  const handleView = () => {
    onView(template);
  };

  const handleCopy = () => {
    onCopy(template);
  };

  const handleDelete = () => {
    onDelete(template);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex flex-col gap-3 mb-3">
        {/* Title and Actions Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 md:flex-row">
            <h3 className="font-semibold text-[#1D242D] text-base sm:text-lg break-words mb-2">
              {template.name}
            </h3>
            <div className="flex items-center gap-2">
              {template.channels?.map((channel) => (
                <span
                  key={channel}
                  className={`text-center px-2 py-1 text-md font-medium rounded-md ${getChannelBadgeColor(
                    channel
                  )}`}
                >
                  {channel}
                </span>
              )) || (
                <span
                  className={`text-center px-2 py-1 text-md font-medium rounded-md ${getChannelBadgeColor(
                    template.channel
                  )}`}
                >
                  {template.channel}
                </span>
              )}
              {template.category && (
                <p className="flex-1 text-md font-bold p-2 rounded-md sm:text-sm text-[#546881] bg-lightGray">
                  {capitalizeWords(template.category.name)}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleView}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View template"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit template"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Copy template"
            >
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete template"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-3 text-xs sm:text-sm text-gray-500">
        <span>Used {template.usageCount || 0} times</span>
        <span className="hidden sm:inline">•</span>
        <span>Last used {template.lastUsed || "Never"}</span>
        {template.createdAt && (
          <>
            <span className="hidden sm:inline">•</span>
            <span>Created {formatDate(template.createdAt)}</span>
          </>
        )}
      </div>

      {/* Content Snippet */}
      <div className="mb-3">
        <p
          className="text-gray-700 bg-lightGray p-4 text-sm leading-relaxed line-clamp-3"
          dangerouslySetInnerHTML={{
            __html:
              template.content.length > 120
                ? template.content.substring(0, 120) + "..."
                : template.content,
          }}
        />
      </div>

      {/* Variables */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {template.variables && template.variables.length > 0 ? (
          template.variables.map((variable, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono break-all"
            >
              {variable?.placeholder || variable}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500 italic">
            No variables used
          </span>
        )}
      </div>
    </div>
  );
};
