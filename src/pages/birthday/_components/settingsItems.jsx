import { ChevronRight } from "lucide-react";

const SettingsItem = ({ icon: Icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
  >
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

export default SettingsItem;
