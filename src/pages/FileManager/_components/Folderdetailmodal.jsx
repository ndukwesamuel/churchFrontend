import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { formatFileSize } from "../../../utils/helpers";

const FolderDetailModal = ({
  isOpen,
  onClose,
  folder,
  onImageClick,
  onUploadToFolder,
  onDeleteImage,
}) => {
  if (!folder) return null;

  const totalSize = folder.photos.reduce(
    (total, photo) => total + (photo.otherdata?.bytes || 0),
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{folder.name}</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {folder.photos.length} files • {formatFileSize(totalSize)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadToFolder(folder._id)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </DialogHeader>

        {folder.photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files yet
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your first file to this folder
            </p>
            <Button
              variant="outline"
              onClick={() => onUploadToFolder(folder._id)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {folder.photos
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((photo) => (
                <div
                  key={photo._id}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-deepPurple transition-all cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    onClick={() => onImageClick(photo)}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageClick(photo);
                      }}
                    >
                      View
                    </Button>
                  </div>

                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">
                      {photo.caption}
                    </p>
                    <p className="text-white/80 text-xs">
                      {formatFileSize(photo.otherdata?.bytes || 0)}
                    </p>
                  </div>

                  {/* Delete button */}
                  {onDeleteImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(photo._id, folder._id);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FolderDetailModal;
