import { Controller } from "react-hook-form";
import { RichTextEditor } from "./richTextEditor";
import { Save } from "lucide-react";

export const TemplateEditor = ({
  templateName,
  setTemplateName,
  content,
  setContent,
  variables,
  usedVariables,
  errors,
  canSave,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Message Content
        </h3>
      </div>

      {/* Template Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Template Name *
        </label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className={`w-full px-4 py-2 bg-lightGray border rounded-lg outline-none text-sm ${
            errors?.templateName
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-purple-500"
          }`}
          placeholder="e.g., Sunday Service Reminder"
        />
        {errors?.templateName && (
          <p className="text-red-500 text-xs mt-1">Template name is required</p>
        )}
      </div>

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Message Content *
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          variables={variables}
          error={errors?.content}
        />
        {errors?.content && (
          <p className="text-red-500 text-xs mt-1">
            Message content is required
          </p>
        )}
      </div>

      {/* Variables Preview */}
      {content && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Variables in use:
          </h4>
          <div className="flex flex-wrap gap-2">
            {usedVariables && usedVariables.length > 0 ? (
              usedVariables.map((variable, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-mono"
                >
                  {variable.placeholder}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No variables used</span>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        type="submit"
        disabled={!canSave || isSubmitting}
        className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? "Saving..." : "Save Template"}
      </button>
    </div>
  );
};
