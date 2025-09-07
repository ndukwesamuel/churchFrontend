import React, { useState } from "react";
import {
  Upload,
  Search,
  FolderPlus,
  MoreVertical,
  X,
  File,
  Link,
} from "lucide-react";

const FileManager = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Files");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  const files = [
    {
      id: 1,
      name: "Church banner 2025.jpeg",
      size: "2.4 MB",
      type: "Banners",
      date: "2025-01-27",
      usage: "Used 10 Times",
      status: "Processing",
      options: ["Remove background noise", "Enhance Background"],
    },
    {
      id: 2,
      name: "Church banner 2025.jpeg",
      size: "2.4 MB",
      type: "Banners",
      date: "2025-01-27",
      usage: "Used 10 Times",
      status: "Cleaned",
      options: ["Remove background noise", "Enhance Background"],
    },
    {
      id: 3,
      name: "Church banner 2025.jpeg",
      size: "2.4 MB",
      type: "Banners",
      date: "2025-01-27",
      usage: "Used 10 Times",
      status: "Pending",
      options: ["Remove background noise", "Enhance Background"],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-600";
      case "Cleaned":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
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
          <div className="text-3xl font-bold text-gray-900">91</div>
          <div className="text-xs text-gray-500 mt-1">+15 this week</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Storage Used</span>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">1.7GB</div>
          <div className="text-xs text-gray-500 mt-1">Of 10GB</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">AI Processed</span>
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">67</div>
          <div className="text-xs text-gray-500 mt-1">Files Processed</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">Space Saved</span>
            <div className="w-4 h-4 bg-green-200 rounded"></div>
          </div>
          <div className="text-3xl font-bold text-gray-900">324 MB</div>
          <div className="text-xs text-gray-500 mt-1">through optimization</div>
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

        {/* File List */}
        <div className="divide-y divide-gray-200">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {file.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>{file.type}</span>
                    <span>{file.date}</span>
                    <span>{file.usage}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {file.options.map((option, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center text-xs text-blue-600"
                      >
                        <span className="w-1 h-1 bg-blue-600 rounded-full mr-1"></span>
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    file.status
                  )}`}
                >
                  {file.status}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
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
              >
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// export default FileManager;

export default function FileManagerFake() {
  return <FileManager />;
}
