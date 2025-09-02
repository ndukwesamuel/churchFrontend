import { Eye, Edit, Copy, Trash2 } from "lucide-react";

export const TemplateCard = ({ template, getChannelBadgeColor }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex flex-col gap-3 mb-3">
        {/* Title and Actions Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg break-words mb-2">
              {template.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getChannelBadgeColor(
                  template.channel
                )}`}
              >
                {template.channel}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                {template.category}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-3 text-xs sm:text-sm text-gray-500">
        <span>Used {template.usageCount} times</span>
        <span className="hidden sm:inline">•</span>
        <span>Last used {template.lastUsed}</span>
      </div>

      {/* Content Snippet */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-relaxed">
          {template.content.length > 120
            ? template.content.substring(0, 120) + "..."
            : template.content}
        </p>
      </div>

      {/* Variables */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {template.variables.map((variable, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono break-all"
          >
            {variable}
          </span>
        ))}
      </div>
    </div>
  );
};
