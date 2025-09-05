import { X } from "lucide-react";

export const TemplateModal = ({ template, isOpen, onClose }) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {template.name}
        </h2>
        {template.category && (
          <p className="text-sm text-gray-500 mb-4">
            Category: {template.category.name}
          </p>
        )}

        {/* Content */}
        <div className="prose max-w-none text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: template.content }} />
        </div>

        {/* Variables */}
        {template.variables?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Variables
            </h4>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono"
                >
                  {variable?.placeholder || variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
