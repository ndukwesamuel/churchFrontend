import React, { useState, useRef } from "react";
import {
  Upload,
  Search,
  FolderPlus,
  File as FileIcon,
  Folder as FolderIcon,
  AlertCircle,
  Loader,
  Save,
  CircleCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useFetchData,
  useMutateData,
  useMutateData_formdata,
  useSingleImageUpload,
} from "../../hook/Request";
import StatsCard from "./_components/statsCard";
import UploadModal from "./_components/uploadModal";
import CreateFolderModal from "./_components/createFolderModal";
import FolderCard from "./_components/folderCard";
import ImagePreviewModal from "./_components/imagePreview";
import { formatFileSize } from "../../utils/helpers";
import FileItem from "./_components/fileItem";
import EmptyState from "./_components/emptyState.jsx";
const FileManager = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageScale, setImageScale] = useState(100);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef(null);

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useFetchData("/api/v1/collection", "userData");

  const photoFolders = userData?.data?.existing?.photoFolders || [];

  const { mutate: addFolder, isLoading: isAddingFolder } =
    useMutateData("contacts");
  const { mutate: uploadFiles, isLoading: isUploadingFiles } =
    useMutateData_formdata(
      "/api/v1/collection/add-fileToFolder",
      "POST",
      "userData"
    );
  const { mutate: uploadSingleImage, isLoading: isUploadingSingleImage } =
    useSingleImageUpload("userData");
  const { mutate: createCollection, isLoading: isCreatingCollection } =
    useMutateData("userData");

  // Image scaling function
  const scaleImage = (file, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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

      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  // File change handler
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

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

    const previews = await Promise.all(
      validFiles.map(async (file) => {
        const preview = URL.createObjectURL(file);
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
              dimensions: { width: img.width, height: img.height },
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

  // Drag and drop handler
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const mockEvent = { target: { files } };
    await handleFileChange(mockEvent);
  };

  // Remove file
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    if (previewImages[index]) {
      URL.revokeObjectURL(previewImages[index].preview);
    }

    setSelectedFiles(newFiles);
    setPreviewImages(newPreviews);
  };

  // Cleanup previews
  const cleanupPreviews = () => {
    previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setPreviewImages([]);
    setSelectedFiles([]);
  };

  // Upload handlers
  const handleFileUpload = async () => {
    if (!selectedFiles.length || !selectedFolder) {
      alert("Please select at least one file and choose a folder");
      return;
    }

    setIsUploading(true);

    try {
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (imageScale !== 100 && file.type.startsWith("image/")) {
            return await scaleImage(file);
          }
          return file;
        })
      );

      const formData = new FormData();
      formData.append("folder_id", selectedFolder);
      processedFiles.forEach((file) => formData.append("images", file));

      uploadFiles(formData, {
        onSuccess: (response) => {
          alert(`Successfully uploaded ${processedFiles.length} file(s)`);
          cleanupPreviews();
          setSelectedFolder(null);
          setImageScale(100);
          setShowUploadModal(false);
          setIsUploading(false);
        },
        onError: (error) => {
          alert(error.message || "Failed to upload files. Please try again.");
          setIsUploading(false);
        },
      });
    } catch (error) {
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
      const processedFile =
        imageScale !== 100 && file.type.startsWith("image/")
          ? await scaleImage(file)
          : file;

      uploadSingleImage(
        { folder_id: selectedFolder, imageFile: processedFile },
        {
          onSuccess: () => {
            alert("Image uploaded successfully!");
            cleanupPreviews();
            setSelectedFolder(null);
            setImageScale(100);
            setShowUploadModal(false);
            setIsUploading(false);
          },
          onError: (error) => {
            alert(error.message || "Failed to upload image. Please try again.");
            setIsUploading(false);
          },
        }
      );
    } catch (error) {
      alert("Error processing image before upload");
      setIsUploading(false);
    }
  };

  const handleSmartUpload = async () => {
    if (selectedFiles.length === 1) {
      await handleSingleImageUpload();
    } else {
      await handleFileUpload();
    }
  };

  // Create folder handler
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    addFolder(
      {
        url: "/api/v1/collection/add-folder",
        data: { name: newFolderName },
      },
      {
        onSuccess: () => {
          alert("New Folder Created");
          setNewFolderName("");
          setShowNewFolderInput(false);
          refetch();
        },
        onError: (err) => {
          console.error("Failed to add folder:", err);
          alert("Failed to create folder. Please try again.");
        },
      }
    );
  };

  // Create collection handler
  const handleCreateCollection = () => {
    createCollection(
      {
        url: "/api/v1/collection/create",
        data: {},
      },
      {
        onSuccess: () => {
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

  // Open image preview
  const openImagePreview = (imageData) => {
    setSelectedPreviewImage(imageData);
    setShowImagePreview(true);
  };

  // Get filtered photos
  const getFilteredPhotos = () => {
    let allPhotos = [];

    if (activeTab === "all") {
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

  const recentUploads = filteredPhotos.filter((photo) => {
    const uploadDate = new Date(photo.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading files. Please try again.
          </AlertDescription>
        </Alert>
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
        <p className="text-gray-600 text-sm">
          Upload, organise and manage your media file with AI-Powered
          optimization
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={FileIcon}
          label="Total Files"
          value={totalFiles}
          subtitle={`Across ${photoFolders.length} folders`}
        />
        <StatsCard
          icon={Save}
          label="Storage Used"
          value={formatFileSize(totalSize)}
          subtitle="Total storage"
        />
        <StatsCard
          icon={FolderIcon}
          label="Folders"
          value={photoFolders.length}
          subtitle="Photo folders"
        />
        <StatsCard
          icon={CircleCheck}
          label="Recent Uploads"
          value={recentUploads}
          subtitle="This week"
        />
      </div>

      {/* File Library Section */}
      <Card>
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none bg-transparent p-0 px-6">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 data-[state=active]:border-deepPurple"
              >
                All Files
              </TabsTrigger>
              <TabsTrigger
                value="folders"
                className="rounded-none border-b-2 data-[state=active]:border-deepPurple"
              >
                Folders
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="rounded-none border-b-2 data-[state=active]:border-deepPurple"
              >
                AI Processing
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Library Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>File Library</CardTitle>
                <CardDescription>
                  Manage your uploaded files and media
                </CardDescription>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewFolderInput(true)}
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center space-x-2  bg-deepPurple hover:bg-deepPurple"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search files"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="ml-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {/* Content Area */}
          <CardContent className="p-6">
            <TabsContent value="folders" className="mt-0">
              {photoFolders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                    <FolderIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No folders yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first folder to organize your files
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewFolderInput(true)}
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create Folder
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoFolders.map((folder) => (
                    <FolderCard key={folder._id} folder={folder} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="divide-y divide-gray-200">
                {filteredPhotos.length === 0 ? (
                  <EmptyState
                    onCreateCollection={handleCreateCollection}
                    isCreating={isCreatingCollection}
                  />
                ) : (
                  filteredPhotos.map((photo) => (
                    <FileItem key={photo._id} photo={photo} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-0">
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  AI Processing
                </h3>
                <p className="text-gray-600">
                  AI processing features coming soon
                </p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          cleanupPreviews();
          setShowUploadModal(false);
          setImageScale(100);
        }}
        selectedFiles={selectedFiles}
        previewImages={previewImages}
        imageScale={imageScale}
        setImageScale={setImageScale}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        photoFolders={photoFolders}
        isUploading={isUploading || isUploadingFiles || isUploadingSingleImage}
        handleFileChange={handleFileChange}
        handleDrop={handleDrop}
        removeFile={removeFile}
        openImagePreview={openImagePreview}
        handleSmartUpload={handleSmartUpload}
        fileInputRef={fileInputRef}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showNewFolderInput}
        onClose={() => {
          setShowNewFolderInput(false);
          setNewFolderName("");
        }}
        folderName={newFolderName}
        setFolderName={setNewFolderName}
        onCreateFolder={handleCreateFolder}
        isLoading={isAddingFolder}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showImagePreview}
        onClose={() => {
          setShowImagePreview(false);
          setSelectedPreviewImage(null);
        }}
        imageData={selectedPreviewImage}
      />
    </div>
  );
};

export default FileManager;
