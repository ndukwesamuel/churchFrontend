import { Folder as FolderIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "../../../utils/helpers";
const FolderCard = ({ folder }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardContent className="p-4">
      <div className="flex items-center space-x-3 mb-3">
        <FolderIcon className="w-8 h-8 text-blue-500" />
        <div>
          <h3 className="font-medium text-gray-900">{folder.name}</h3>
          <p className="text-sm text-gray-600">{folder.photos.length} files</p>
        </div>
      </div>
      <div className="text-xs text-gray-600">
        Created: {formatDate(folder.createdAt)}
      </div>
    </CardContent>
  </Card>
);

export default FolderCard;
