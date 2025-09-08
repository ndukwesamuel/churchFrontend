import { ChannelSelector } from "./channelSelector";
import { ChevronDown } from "lucide-react";
import { VariableList } from "./variableList";
import { useFetchData } from "../../../hook/Request";
export const TemplateForm = ({
  selectedChannels,
  setSelectedChannels,
  category,
  setCategory,
  variables,
  onVariableClick,
  note,
  setNote,
}) => {
  const { data: categoryData } = useFetchData(
    "/api/v1/categories",
    "categories"
  );
  const categories = categoryData?.data;

  return (
    <div className="space-y-6">
      {/* Channel Selector */}
      <ChannelSelector
        selectedChannels={selectedChannels}
        onChannelChange={setSelectedChannels}
      />

      {/* Category Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none bg-lightGray border border-gray-300 rounded-lg px-4 py-2 pr-10 outline-none text-sm"
          >
            <option value="">Select a category</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Variable List - Hidden on medium and smaller screens */}
      {/* <div className="hidden lg:block">
        <VariableList variables={variables} onVariableClick={onVariableClick} />
      </div> */}

      {/* Note Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Note (Optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full p-3 bg-lightGray border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
          placeholder="Add any notes about this template..."
        />
      </div>
    </div>
  );
};
