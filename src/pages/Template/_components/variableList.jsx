import { Plus } from "lucide-react";

export const VariableList = ({ variables, onVariableClick }) => {
  const handleAddVariable = () => {
    console.log("Add new variable - would open modal");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Variables</h3>
        {/* <button
          type="button"
          onClick={handleAddVariable}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Variable
        </button> */}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {variables.map((variable, index) => (
          <div
            key={index}
            onClick={() => onVariableClick(variable)}
            className="bg-lightGray p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
          >
            <div className="font-mono text-sm text-textColor mb-1">
              {variable.placeholder}
            </div>
            <div className="text-xs text-gray-500">{variable.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
