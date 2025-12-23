// import React from "react";
// import { MoreVertical } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { formatFileSize, formatDate } from "../../../utils/helpers";

// const FileItem = ({ photo }) => (
//   <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 rounded-lg px-2 gap-3 sm:gap-0">
//     {/* Left: Image + Details */}
//     <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
//       <div className="w-full sm:w-12 h-40 sm:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//         <img
//           src={photo.url}
//           alt={photo.caption}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <div className="mt-2 sm:mt-0 flex-1">
//         <h3 className="text-sm font-medium text-gray-900 truncate">
//           {photo.caption}
//         </h3>

//         <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-600">
//           {photo.otherdata?.bytes && (
//             <span>{formatFileSize(photo.otherdata.bytes)}</span>
//           )}
//           {photo.folderName && <span>Folder: {photo.folderName}</span>}
//           {photo.createdAt && <span>{formatDate(photo.createdAt)}</span>}
//           {photo.otherdata?.width && (
//             <span>
//               {photo.otherdata.width} × {photo.otherdata.height}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Right: Status + Actions */}
//     <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-3 mt-2 sm:mt-0 w-full sm:w-auto">
//       <Badge
//         variant="secondary"
//         className="bg-green-100 text-green-600 hover:bg-green-100 text-xs"
//       >
//         Uploaded
//       </Badge>
//       <Button variant="ghost" size="icon">
//         <MoreVertical className="w-4 h-4 text-gray-400" />
//       </Button>
//     </div>
//   </div>
// );

// export default FileItem;

import React, { useState } from "react";
import { MoreVertical, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize, formatDate } from "../../../utils/helpers";

const FileItem = ({ photo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInNewTab = () => {
    window.open(photo.url, "_blank");
  };

  return (
    <>
      <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 rounded-lg px-2 gap-3 sm:gap-0">
        {/* Left: Image + Details */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
          <div
            className="w-full sm:w-12 h-40 sm:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-auto max-h-[80vh] object-contain cursor-pointer"
                onClick={openInNewTab}
              />

              {/* Open in new tab hint */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors cursor-pointer group"
                onClick={openInNewTab}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-full">
                  <ExternalLink className="w-5 h-5" />
                  <span>Open in new tab</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="mt-3 text-center text-white">
              <p className="font-medium">{photo.caption}</p>
              {photo.otherdata?.width && (
                <p className="text-sm text-gray-400 mt-1">
                  {photo.otherdata.width} × {photo.otherdata.height}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileItem;
