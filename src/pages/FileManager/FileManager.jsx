import React, { useState, useRef } from "react";
import {
  Upload,
  Search,
  FolderPlus,
  MoreVertical,
  X,
  File,
  Link,
  Folder,
  AlertCircle,
  Loader,
  Trash2,
  Eye,
  ZoomIn,
  ZoomOut,
  Plus,
} from "lucide-react";
import {
  useFetchData,
  useMutateData,
  useMutateData_formdata,
  useSingleImageUpload,
} from "../../hook/Request";

const FileManager = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Files");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageScale, setImageScale] = useState(100);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showFolder, setshowFolder] = useState(true);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useFetchData("/api/v1/collection", "userData");

  console.log({
    fgfg: userData?.data?.existing,
  });

  const photoFolders = userData?.data?.existing?.photoFolders || [];

  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [editFolder, setEditFolder] = useState(false);

  const { mutate: addFolder, isLoading: isAddingaddFolder } =
    useMutateData("contacts");

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    if (editFolder) {
    } else {
      // create new contact
      addFolder(
        {
          url: "/api/v1/collection/add-folder",
          data: { name: newFolderName },
        },
        {
          onSuccess: (data) => {
            console.log({
              fgfg: data,
            });
            let message = `New Folder Created `;

            alert(message);

            setNewFolderName("");
            setShowNewFolderInput(false);
            refetch();
          },
          onError: (err) => {
            console.error("Failed to add contact:", err);
          },
        }
      );
    }
  };

  // Fixed image scaling function
  const scaleImage = (file, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // Use document.createElement instead of new Image()
      const img = document.createElement("img");

      img.onload = () => {
        const scaleFactor = imageScale / 100;
        canvas.width = img.naturalWidth * scaleFactor;
        canvas.height = img.naturalHeight * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            const scaledFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(scaledFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Fixed file change handler
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert(
        "Some files were skipped. Only image files (JPEG, PNG, GIF, WebP) are allowed."
      );
    }

    // Generate previews for images
    const previews = await Promise.all(
      validFiles.map(async (file) => {
        const preview = URL.createObjectURL(file);

        // Use document.createElement instead of new Image()
        const img = document.createElement("img");
        img.src = preview;

        return new Promise((resolve) => {
          img.onload = () => {
            resolve({
              file,
              preview,
              name: file.name,
              size: file.size,
              type: file.type,
              dimensions: {
                width: img.width,
                height: img.height,
              },
            });
          };
          img.onerror = () => {
            resolve({
              file,
              preview,
              name: file.name,
              size: file.size,
              type: file.type,
              dimensions: { width: 0, height: 0 },
            });
          };
        });
      })
    );

    setSelectedFiles(validFiles);
    setPreviewImages(previews);
  };

  // Enhanced drag and drop handler
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    const mockEvent = {
      target: {
        files: files,
      },
    };

    await handleFileChange(mockEvent);
  };

  // Remove file from selection - this is the key fix
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    // Cleanup preview URLs to prevent memory leaks
    if (previewImages[index]) {
      URL.revokeObjectURL(previewImages[index].preview);
    }

    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  const { mutate: uploadFiles, isLoading: isUploadingFiles } =
    useMutateData_formdata(
      "/api/v1/collection/add-fileToFolder",
      "POST",
      "userData" // This will invalidate the userData query after successful upload
    );

  const { mutate: uploadSingleImage, isLoading: isUploadingSingleImage } =
    useSingleImageUpload("userData");

  // Enhanced upload handler
  const handleFileUpload_fake = async () => {
    if (!selectedFiles.length || !selectedFolder) {
      alert("Please select at least one file and choose a folder");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("folder_id", selectedFolder);

      // Process files based on scale setting
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (imageScale !== 100 && file.type.startsWith("image/")) {
            return await scaleImage(file);
          }
          return file;
        })
      );

      // Append all processed files with the key "images" to match your backend
      processedFiles.forEach((file) => {
        formData.append("images", file);
      });

      console.log(
        `Uploading ${processedFiles.length} file(s) to folder ${selectedFolder}`
      );

      // Simulate API call - replace with your actual mutate function
      setTimeout(() => {
        console.log("✅ Files uploaded successfully");

        // Simulate success response
        const uploadSummary = {
          successful: processedFiles.length,
          failed: 0,
        };

        let message = `Successfully uploaded ${uploadSummary.successful} file(s)`;
        if (uploadSummary.failed > 0) {
          message += `, ${uploadSummary.failed} failed`;
        }
        alert(message);

        // Cleanup and reset
        cleanupPreviews();
        setSelectedFolder(null);
        setImageScale(100);
        setShowUploadModal(false);
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Error processing files before upload");
      setIsUploading(false);
    }
  };

  // Enhanced upload handler - replace the existing one
  const handleFileUpload_fake2 = async () => {
    if (!selectedFiles.length || !selectedFolder) {
      alert("Please select at least one file and choose a folder");
      return;
    }

    setIsUploading(true);

    try {
      // Process files based on scale setting
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (imageScale !== 100 && file.type.startsWith("image/")) {
            return await scaleImage(file);
          }
          return file;
        })
      );

      // Create FormData object
      const formData = new FormData();
      formData.append("folder_id", selectedFolder);

      // Append all processed files with the key "images" to match your backend
      processedFiles.forEach((file) => {
        formData.append("images", file);
      });

      console.log(
        `Uploading ${processedFiles.length} file(s) to folder ${selectedFolder}`
      );

      // Make the actual API call
      uploadFiles(formData, {
        onSuccess: (response) => {
          console.log("✅ Files uploaded successfully", response);

          const uploadedCount =
            response.data?.uploadedFiles?.length || processedFiles.length;
          const message = `Successfully uploaded ${uploadedCount} file(s)`;
          alert(message);

          // Cleanup and reset
          cleanupPreviews();
          setSelectedFolder(null);
          setImageScale(100);
          setShowUploadModal(false);
          setIsUploading(false);

          // The query will be automatically invalidated by the mutation hook
          // which will refetch the userData to show the new files
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          const errorMessage =
            error.message || "Failed to upload files. Please try again.";
          alert(errorMessage);
          setIsUploading(false);
        },
      });
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Error processing files before upload");
      setIsUploading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length || !selectedFolder) {
      alert("Please select at least one file and choose a folder");
      return;
    }

    setIsUploading(true);

    try {
      // Process files based on scale setting
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (imageScale !== 100 && file.type.startsWith("image/")) {
            return await scaleImage(file);
          }
          return file;
        })
      );

      console.log("Processed files:", processedFiles); // Debug log

      // Create FormData object
      const formData = new FormData();
      formData.append("folder_id", selectedFolder);

      // Append all processed files
      processedFiles.forEach((file, index) => {
        console.log(
          `Appending file ${index}:`,
          file.name,
          file.type,
          file.size
        ); // Debug log
        formData.append("images", file);
      });

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log("FormData entry:", key, value);
      }

      console.log(
        `Uploading ${processedFiles.length} file(s) to folder ${selectedFolder}`
      );

      // Make the actual API call
      uploadFiles(formData, {
        onSuccess: (response) => {
          console.log("✅ Files uploaded successfully", response);
          // ... rest of success handling
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          console.error("Error details:", error.response?.data); // More detailed error
          alert(error.message || "Failed to upload files. Please try again.");
          setIsUploading(false);
        },
      });
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Error processing files before upload");
      setIsUploading(false);
    }
  };

  const handleSingleImageUpload = async () => {
    if (selectedFiles.length !== 1 || !selectedFolder) {
      alert("Please select exactly one image and choose a folder");
      return;
    }

    setIsUploading(true);

    try {
      const file = selectedFiles[0];

      // Apply scaling if needed
      const processedFile =
        imageScale !== 100 && file.type.startsWith("image/")
          ? await scaleImage(file)
          : file;

      console.log(
        `Uploading single image: ${processedFile.name} to folder ${selectedFolder}`
      );

      uploadSingleImage(
        {
          folder_id: selectedFolder,
          imageFile: processedFile,
        },
        {
          onSuccess: (response) => {
            console.log("✅ Single image uploaded successfully", response);
            alert("Image uploaded successfully!");

            // Cleanup and reset
            cleanupPreviews();
            setSelectedFolder(null);
            setImageScale(100);
            setShowUploadModal(false);
            setIsUploading(false);
          },
          onError: (error) => {
            console.error("Single image upload failed:", error);
            alert(error.message || "Failed to upload image. Please try again.");
            setIsUploading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error processing single image:", error);
      alert("Error processing image before upload");
      setIsUploading(false);
    }
  };

  // Enhanced upload handler that chooses between single and multiple
  const handleSmartUpload = async () => {
    if (selectedFiles.length === 1) {
      await handleSingleImageUpload();
    } else {
      await handleFileUpload(); // Your existing multiple upload function
    }
  };

  // Update the upload button disabled state to use the actual loading state
  // In your upload modal, replace the existing upload button with:
  const uploadButtonDisabled =
    !selectedFiles.length || !selectedFolder || isUploading || isUploadingFiles;

  // Preview image modal
  const openImagePreview = (imageData) => {
    setSelectedPreviewImage(imageData);
    setShowImagePreview(true);
  };

  // Cleanup function
  const cleanupPreviews = () => {
    previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setPreviewImages([]);
    setSelectedFiles([]);
  };

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

  const { mutate: createCollection, isLoading: isCreatingCollection } =
    useMutateData("userData");

  const handleCreateCollection = () => {
    createCollection(
      {
        url: "/api/v1/collection/create", // Adjust URL as needed
        data: {},
      },
      {
        onSuccess: (data) => {
          console.log("Collection created:", data);
          alert("Collection created successfully!");
          refetch();
        },
        onError: (err) => {
          console.error("Failed to create collection:", err);
          alert("Failed to create collection. Please try again.");
        },
      }
    );
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

    if (searchTerm) {
      allPhotos = allPhotos.filter(
        (photo) =>
          photo.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
          photo.folderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allPhotos;
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show "Create Collection" interface when userData?.data?.existing is null
  // if (!userData?.data?.existing) {
  //   return (
  //     <div className="flex-1 bg-gray-50 p-6">
  //       {/* Header */}
  //       <div className="mb-6">
  //         <h1 className="text-2xl font-semibold text-gray-900 mb-2">
  //           File Manager
  //         </h1>
  //         <p className="text-gray-600">
  //           Upload, organise and manage your media file with AI-Powered
  //           optimization
  //         </p>
  //       </div>

  //       {/* Create Collection Card */}
  //       <div className="bg-white rounded-lg shadow-sm p-12">
  //         <div className="text-center max-w-md mx-auto">
  //           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //             <Plus className="w-8 h-8 text-blue-600" />
  //           </div>

  //           <h2 className="text-2xl font-semibold text-gray-900 mb-4">
  //             Create Your First Collection
  //           </h2>

  //           <p className="text-gray-600 mb-8">
  //             Get started by creating a collection to organize and manage your
  //             media files. You can then create folders and upload your images
  //             with AI-powered optimization.
  //           </p>

  //           <button
  //             onClick={handleCreateCollection}
  //             disabled={isCreatingCollection}
  //             className="inline-flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  //           >
  //             {isCreatingCollection ? (
  //               <>
  //                 <Loader className="w-5 h-5 animate-spin" />
  //                 <span>Creating Collection...</span>
  //               </>
  //             ) : (
  //               <>
  //                 <Plus className="w-5 h-5" />
  //                 <span>Create Collection</span>
  //               </>
  //             )}
  //           </button>

  //           <div className="mt-8 text-sm text-gray-500">
  //             <p>Once created, you'll be able to:</p>
  //             <ul className="mt-2 space-y-1">
  //               <li>• Create and organize folders</li>
  //               <li>• Upload and manage images</li>
  //               <li>• Use AI-powered optimization</li>
  //               <li>• Track storage usage</li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          File Manager jaja
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
              <button
                onClick={() => setShowNewFolderInput(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photoFolders.map((folder) => (
                <div
                  key={folder._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
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
            <div className="divide-y divide-gray-200">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                    <File className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No files found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Upload some files to get started
                  </p>

                  <button
                    onClick={handleCreateCollection}
                    disabled={isCreatingCollection}
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreatingCollection ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Creating Collection...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Create Collection</span>
                      </>
                    )}
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

      {/* Enhanced Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Files{" "}
                {selectedFiles.length > 0 &&
                  `(${selectedFiles.length} selected)`}
              </h3>
              <button
                onClick={() => {
                  cleanupPreviews();
                  setShowUploadModal(false);
                  setImageScale(100);
                }}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Choose images and upload securely. Supports JPEG, PNG, GIF, and
              WebP formats.
            </p>

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
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
                <p className="text-xs text-gray-500 mb-4">
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
                <label
                  htmlFor="fileInput"
                  className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Select Images
                </label>
              </div>
            </div>

            {/* Image Scale Control */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Scale: {imageScale}%
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setImageScale(Math.max(10, imageScale - 10))}
                    className="p-1 hover:bg-gray-200 rounded"
                    disabled={isUploading}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={imageScale}
                    onChange={(e) => setImageScale(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isUploading}
                  />
                  <button
                    onClick={() =>
                      setImageScale(Math.min(100, imageScale + 10))
                    }
                    className="p-1 hover:bg-gray-200 rounded"
                    disabled={isUploading}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Lower scale = smaller file size. Original size = 100%
                </div>
              </div>
            )}

            {/* Image Previews - Enhanced with better delete functionality */}
            {previewImages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Images ({previewImages.length}):
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {previewImages.map((imageData, index) => (
                    <div
                      key={index}
                      className="relative group bg-white rounded-lg p-2 shadow-sm border"
                    >
                      <div className="aspect-square rounded overflow-hidden bg-gray-100">
                        <img
                          src={imageData.preview}
                          alt={imageData.name}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                          onClick={() =>
                            !isUploading && openImagePreview(imageData)
                          }
                        />
                      </div>
                      <div className="mt-2 text-xs">
                        <div
                          className="font-medium text-gray-900 truncate"
                          title={imageData.name}
                        >
                          {imageData.name}
                        </div>
                        <div className="text-gray-500 flex justify-between">
                          <span>{(imageData.size / 1024).toFixed(1)} KB</span>
                          <span>
                            {imageData.dimensions.width}×
                            {imageData.dimensions.height}
                          </span>
                        </div>
                      </div>

                      {/* Delete button - more prominent and always visible */}
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                        disabled={isUploading}
                        title="Remove file"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Preview button */}
                      <button
                        onClick={() => openImagePreview(imageData)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                        disabled={isUploading}
                        title="Preview image"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Folder Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Folder *
              </label>
              <select
                value={selectedFolder || ""}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isUploading}
              >
                <option value="" disabled>
                  -- Choose a folder --
                </option>
                {photoFolders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.name} ({folder.photos.length} files)
                  </option>
                ))}
              </select>
              {photoFolders.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No folders available. Create a folder first.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  cleanupPreviews();
                  setShowUploadModal(false);
                  setImageScale(100);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isUploading}
              >
                Cancel
              </button>

              <button
                onClick={handleSmartUpload} // Use smart upload function
                disabled={uploadButtonDisabled}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isUploading || isUploadingFiles || isUploadingSingleImage ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>
                    Upload {selectedFiles.length}{" "}
                    {selectedFiles.length === 1 ? "Image" : "Files"}
                    {selectedFiles.length === 1 ? " (Single)" : " (Multiple)"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && selectedPreviewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => {
                setShowImagePreview(false);
                setSelectedPreviewImage(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedPreviewImage.preview}
              alt={selectedPreviewImage.name}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
              <div className="text-lg font-medium">
                {selectedPreviewImage.name}
              </div>
              <div className="text-sm text-gray-300">
                {selectedPreviewImage.dimensions.width} ×{" "}
                {selectedPreviewImage.dimensions.height} •{" "}
                {(selectedPreviewImage.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewFolderInput && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowNewFolderInput(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>

            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowNewFolderInput(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>

              {isAddingaddFolder ? (
                <div className="flex items-center space-x-2 ml-3">
                  <Loader className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-gray-600">Creating...</span>
                </div>
              ) : (
                <button
                  onClick={handleCreateFolder}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
