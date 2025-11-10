import { Upload, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageScaleControl from "./imageScalePreview";
import ImagePreview from "./imagePreview";

const UploadModal = ({
  isOpen,
  onClose,
  selectedFiles,
  previewImages,
  imageScale,
  setImageScale,
  selectedFolder,
  setSelectedFolder,
  photoFolders,
  isUploading,
  handleFileChange,
  handleDrop,
  removeFile,
  openImagePreview,
  handleSmartUpload,
  fileInputRef,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Upload Files{" "}
          {selectedFiles.length > 0 && `(${selectedFiles.length} selected)`}
        </DialogTitle>
        <DialogDescription>
          Choose images and upload securely. Supports JPEG, PNG, GIF, and WebP
          formats.
        </DialogDescription>
      </DialogHeader>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          selectedFiles.length > 0
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Drag and drop your images
          </p>
          <p className="text-xs text-gray-600 mb-4">
            JPEG, PNG, GIF, WebP formats, up to 10MB per file
          </p>

          <input
            ref={fileInputRef}
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button asChild variant="outline" disabled={isUploading}>
            <label htmlFor="fileInput" className="cursor-pointer">
              Select Images
            </label>
          </Button>
        </div>
      </div>

      {/* Image Scale Control */}
      {selectedFiles.length > 0 && (
        <ImageScaleControl
          imageScale={imageScale}
          setImageScale={setImageScale}
          isUploading={isUploading}
        />
      )}

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Selected Images ({previewImages.length}):
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {previewImages.map((imageData, index) => (
              <ImagePreview
                key={index}
                imageData={imageData}
                index={index}
                onRemove={removeFile}
                onPreview={openImagePreview}
                isUploading={isUploading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Folder Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Folder *
        </label>
        <Select
          value={selectedFolder || ""}
          onValueChange={setSelectedFolder}
          disabled={isUploading}
        >
          <SelectTrigger>
            <SelectValue placeholder="-- Choose a folder --" />
          </SelectTrigger>
          <SelectContent>
            {photoFolders.map((folder) => (
              <SelectItem key={folder._id} value={folder._id}>
                {folder.name} ({folder.photos.length} files)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {photoFolders.length === 0 && (
          <p className="text-xs text-red-500 mt-1">
            No folders available. Create a folder first.
          </p>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSmartUpload}
          disabled={!selectedFiles.length || !selectedFolder || isUploading}
        >
          {isUploading ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              Upload {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "Image" : "Files"}
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default UploadModal;
