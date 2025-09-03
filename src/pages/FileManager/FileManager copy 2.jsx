import React, { useState } from "react";
import {
  Upload,
  Search,
  FolderPlus,
  MoreVertical,
  X,
  File,
  Link,
  Image,
  Folder,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useFetchData, useMutateData } from "../../hook/Request";
// import { useFetchData, useMutateData } from './hooks/useApi'; // Adjust path as needed

const FileManager = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Files");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Fetch user data including photos
  const {u
    data: userData,
    isLoading,
    error,
    refetch,
  } = useFetchData(
    "/api/v1/collection", // Adjust endpoint as needed
    "userData"
  );

  // Upload mutation
  //   const uploadMutation = useMutateData("userData", "POST");

  const photoFolders = userData?.data?.existing?.photoFolders || [];

  // Calculate statistics
  const totalFiles = photoFolders.reduce(
    (total, folder) => total + folder.photos.length,
    0
  );
  const totalSize = photoFolders.reduce((total, folder) => {
    return (
      total +
      folder.photos.reduce((folderTotal, photo) => {
        return folderTotal + (photo.otherdata?.bytes || 0);
      }, 0)
    );
  }, 0);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFilteredPhotos = () => {
    let allPhotos = [];

    if (activeTab === "All Files") {
      photoFolders.forEach((folder) => {
        folder.photos.forEach((photo) => {
          allPhotos.push({
            ...photo,
            folderName: folder.name,
            folderId: folder._id,
          });
        });
      });
    }

    // Filter by search term
    if (searchTerm) {
      allPhotos = allPhotos.filter(
        (photo) =>
          photo.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
          photo.folderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allPhotos;
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    setShowUploadModal(false);
  };

  const handleUrlUpload = () => {
    // Handle URL upload logic here
    setUploadUrl("");
    setShowUploadModal(false);
  };

  const filteredPhotos = getFilteredPhotos();

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Error loading files</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          File Manager
        </h1>
        <p className="text-gray-600">
          Upload, organise and manage your media file with AI-Powered
          optimization
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Total Files</span>
            <File className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalFiles}</div>
          <div className="text-xs text-gray-500 mt-1">
            Across {photoFolders.length} folders
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Storage Used</span>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatFileSize(totalSize)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total storage</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Folders</span>
            <Folder className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {photoFolders.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Photo folders</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Recent Uploads</span>
            <div className="w-4 h-4 bg-green-200 rounded"></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {
              filteredPhotos.filter((photo) => {
                const uploadDate = new Date(photo.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return uploadDate > weekAgo;
              }).length
            }
          </div>
          <div className="text-xs text-gray-500 mt-1">This week</div>
        </div>
      </div>

      {/* File Library Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {["All Files", "Folders", "AI Processing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Library Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                File Library
              </h2>
              <p className="text-sm text-gray-600">
                Manage your uploaded files and media
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FolderPlus className="w-4 h-4" />
                <span>New Folder</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="ml-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Types</option>
                <option>Images</option>
                <option>Videos</option>
                <option>Documents</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "Folders" ? (
            // Folders View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photoFolders.map((folder) => (
                <div
                  key={folder._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedFolder(folder)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Folder className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {folder.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {folder.photos.length} files
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(folder.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Files View
            <div className="divide-y divide-gray-200">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No files found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Upload some files to get started
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Upload Files
                  </button>
                </div>
              ) : (
                filteredPhotos.map((photo) => (
                  <div
                    key={photo._id}
                    className="py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {photo.caption}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>{formatFileSize(photo.otherdata?.bytes)}</span>
                          <span>Folder: {photo.folderName}</span>
                          <span>{formatDate(photo.createdAt)}</span>
                          {photo.otherdata && (
                            <span>
                              {photo.otherdata.width} × {photo.otherdata.height}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        Uploaded
                      </span>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                File Upload
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Choose a file and upload securely to proceed.
            </p>

            {/* Drag and Drop Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drag and drop your files
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  JPEG, PNG, PDF and MP4 formats, up to 50MB
                </p>
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Select file
                </button>
              </div>
            </div>

            {/* URL Upload */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Link className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  or upload from URL
                </span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add file URL"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleUrlUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                disabled={uploadMutation.isLoading}
              >
                {uploadMutation.isLoading ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
