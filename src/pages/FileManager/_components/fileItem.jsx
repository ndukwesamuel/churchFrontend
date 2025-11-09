import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, formatDate } from "../../../utils/helpers";

const FileItem = ({ photo }) => (
  <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 rounded-lg px-2 gap-3 sm:gap-0">
    {/* Left: Image + Details */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
      <div className="w-full sm:w-12 h-40 sm:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-2 sm:mt-0 flex-1">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {photo.caption}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-600">
          {photo.otherdata?.bytes && (
            <span>{formatFileSize(photo.otherdata.bytes)}</span>
          )}
          {photo.folderName && <span>Folder: {photo.folderName}</span>}
          {photo.createdAt && <span>{formatDate(photo.createdAt)}</span>}
          {photo.otherdata?.width && (
            <span>
              {photo.otherdata.width} × {photo.otherdata.height}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Right: Status + Actions */}
    <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-3 mt-2 sm:mt-0 w-full sm:w-auto">
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-600 hover:bg-green-100 text-xs"
      >
        Uploaded
      </Badge>
      <Button variant="ghost" size="icon">
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </Button>
    </div>
  </div>
);

export default FileItem;
