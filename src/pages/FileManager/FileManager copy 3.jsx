// // import React, { useState } from "react";
// // import {
// //   Upload,
// //   Search,
// //   FolderPlus,
// //   MoreVertical,
// //   X,
// //   File,
// //   Link,
// //   Image,
// //   Folder,
// //   AlertCircle,
// //   Loader,
// //   TruckElectricIcon,
// // } from "lucide-react";
// // import {
// //   useFetchData,
// //   useMutateData,
// //   useMutateData_formdata,
// // } from "../../hook/Request";
// // import FileManagerFake from "./FileManagerFake";
// // import { SiTruenas } from "react-icons/si";
// // // import { useFetchData, useMutateData } from './hooks/useApi'; // Adjust path as needed

// // Updated FileManager Component with Image Scaling and Preview

// import React, { useState, useRef } from "react";
// import {
//   Upload,
//   Search,
//   FolderPlus,
//   MoreVertical,
//   X,
//   File,
//   Link,
//   Image,
//   Folder,
//   AlertCircle,
//   Loader,
//   Trash2,
//   Eye,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";
// import {
//   useFetchData,
//   useMutateData,
//   useMutateData_formdata,
// } from "../../hook/Request";
// const FileManager = () => {
//   // const [showUploadModal, setShowUploadModal] = useState(false);
//   // const [activeTab, setActiveTab] = useState("All Files");
//   // const [searchTerm, setSearchTerm] = useState("");
//   // const [uploadUrl, setUploadUrl] = useState("");
//   // const [selectedFolder, setSelectedFolder] = useState(null);
//   // const [selectedFiles, setSelectedFiles] = useState([]);
//   // const [previewImages, setPreviewImages] = useState([]); // For image previews
//   // const [imageScale, setImageScale] = useState(100); // Scale percentage
//   // const [showImagePreview, setShowImagePreview] = useState(false);

//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [activeTab, setActiveTab] = useState("All Files");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [uploadUrl, setUploadUrl] = useState("");
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [previewImages, setPreviewImages] = useState([]); // For image previews
//   const [imageScale, setImageScale] = useState(100); // Scale percentage
//   const [showImagePreview, setShowImagePreview] = useState(false);
//   const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);

//   // Fetch user data including photos
//   const {
//     data: userData,
//     isLoading,
//     error,
//     refetch,
//   } = useFetchData("/api/v1/collection", "userData");

//   // Upload mutation with better error handling
//   const { mutate, isLoading: isUploading } = useMutateData_formdata(
//     "/api/v1/collection/add-fileToFolder",
//     "POST",
//     "files"
//   );

//   const photoFolders = userData?.data?.existing?.photoFolders || [];

//   // Image scaling/compression function
//   const scaleImage = (file, quality = 0.8) => {
//     return new Promise((resolve) => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = document.createElement("img");

//       img.onload = () => {
//         // Calculate new dimensions based on scale
//         const scaleFactor = imageScale / 100;
//         canvas.width = img.naturalWidth * scaleFactor;
//         canvas.height = img.naturalHeight * scaleFactor;

//         // Draw scaled image
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//         // Convert to blob with specified quality
//         canvas.toBlob(
//           (blob) => {
//             // Create new file with scaled image
//             const scaledFile = new File([blob], file.name, {
//               type: file.type,
//               lastModified: Date.now(),
//             });
//             resolve(scaledFile);
//           },
//           file.type,
//           quality
//         );
//       };

//       img.onerror = () => {
//         // If image fails to load, return original file
//         resolve(file);
//       };

//       img.src = URL.createObjectURL(file);
//     });
//   };

//   // Enhanced file change handler with preview generation
//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length === 0) return;

//     // Validate file types
//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/gif",
//       "image/webp",
//     ];
//     const validFiles = files.filter((file) => allowedTypes.includes(file.type));

//     if (validFiles.length !== files.length) {
//       alert(
//         "Some files were skipped. Only image files (JPEG, PNG, GIF, WebP) are allowed."
//       );
//     }

//     // Generate previews for images
//     const previews = await Promise.all(
//       validFiles.map(async (file) => {
//         const preview = URL.createObjectURL(file);

//         // Get image dimensions
//         const img = new Image();
//         img.src = preview;

//         return new Promise((resolve) => {
//           img.onload = () => {
//             resolve({
//               file,
//               preview,
//               name: file.name,
//               size: file.size,
//               type: file.type,
//               dimensions: {
//                 width: img.width,
//                 height: img.height,
//               },
//             });
//           };
//         });
//       })
//     );

//     setSelectedFiles(validFiles);
//     setPreviewImages(previews);
//   };

//   // Enhanced drag and drop handler
//   const handleDrop = async (e) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files);

//     // Create a mock event object for consistency
//     const mockEvent = {
//       target: {
//         files: files,
//       },
//     };

//     await handleFileChange(mockEvent);
//   };

//   // Remove file from selection
//   const removeFile = (index) => {
//     const newFiles = selectedFiles.filter((_, i) => i !== index);
//     const newPreviews = previewImages.filter((_, i) => i !== index);

//     // Cleanup preview URLs
//     if (previewImages[index]) {
//       URL.revokeObjectURL(previewImages[index].preview);
//     }

//     setSelectedFiles(newFiles);
//     setPreviewImages(newPreviews);
//   };

//   // Enhanced upload handler
//   const handleFileUpload = async () => {
//     if (!selectedFiles.length || !selectedFolder) {
//       alert("Please select at least one file and choose a folder");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("folder_id", selectedFolder);

//       // Process files based on scale setting
//       const processedFiles = await Promise.all(
//         selectedFiles.map(async (file) => {
//           if (imageScale !== 100 && file.type.startsWith("image/")) {
//             // Scale image if scale is not 100%
//             return await scaleImage(file);
//           }
//           return file;
//         })
//       );

//       // Append all processed files
//       processedFiles.forEach((file) => {
//         formData.append("images", file);
//       });

//       console.log(
//         `Uploading ${processedFiles.length} file(s) to folder ${selectedFolder}`
//       );

//       mutate(formData, {
//         onSuccess: (data) => {
//           console.log("✅ Files uploaded successfully", data);

//           // Show success message with details
//           const { uploadSummary } = data.data;
//           let message = `Successfully uploaded ${uploadSummary.successful} file(s)`;
//           if (uploadSummary.failed > 0) {
//             message += `, ${uploadSummary.failed} failed`;
//           }
//           alert(message);

//           // Cleanup and reset
//           previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
//           setSelectedFiles([]);
//           setPreviewImages([]);
//           setSelectedFolder(null);
//           setImageScale(100);
//           setShowUploadModal(false);

//           // Refresh data
//           refetch();
//         },
//         onError: (err) => {
//           console.error("❌ Upload failed:", err);
//           alert(`Upload failed: ${err.message || "Unknown error occurred"}`);
//         },
//       });
//     } catch (error) {
//       console.error("Error processing files:", error);
//       alert("Error processing files before upload");
//     }
//   };

//   // Preview image modal
//   const openImagePreview = (imageData) => {
//     setSelectedPreviewImage(imageData);
//     setShowImagePreview(true);
//   };

//   // Cleanup function
//   const cleanupPreviews = () => {
//     previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
//     setPreviewImages([]);
//     setSelectedFiles([]);
//   };

//   // Enhanced file change handler with preview generation
//   // const handleFileChange = async (e) => {
//   //   const files = Array.from(e.target.files);

//   //   if (files.length === 0) return;

//   //   // Validate file types
//   //   const allowedTypes = [
//   //     "image/jpeg",
//   //     "image/jpg",
//   //     "image/png",
//   //     "image/gif",
//   //     "image/webp",
//   //   ];
//   //   const validFiles = files.filter((file) => allowedTypes.includes(file.type));

//   //   if (validFiles.length !== files.length) {
//   //     alert(
//   //       "Some files were skipped. Only image files (JPEG, PNG, GIF, WebP) are allowed."
//   //     );
//   //   }

//   //   // Generate previews for images
//   //   const previews = await Promise.all(
//   //     validFiles.map(async (file) => {
//   //       const preview = URL.createObjectURL(file);

//   //       // Get image dimensions
//   //       const img = new Image();
//   //       img.src = preview;

//   //       return new Promise((resolve) => {
//   //         img.onload = () => {
//   //           resolve({
//   //             file,
//   //             preview,
//   //             name: file.name,
//   //             size: file.size,
//   //             type: file.type,
//   //             dimensions: {
//   //               width: img.width,
//   //               height: img.height,
//   //             },
//   //           });
//   //         };
//   //       });
//   //     })
//   //   );

//   //   setSelectedFiles(validFiles);
//   //   setPreviewImages(previews);
//   // };

//   // Enhanced drag and drop handler
//   // const handleDrop = async (e) => {
//   //   e.preventDefault();
//   //   const files = Array.from(e.dataTransfer.files);

//   //   // Create a mock event object for consistency
//   //   const mockEvent = {
//   //     target: {
//   //       files: files,
//   //     },
//   //   };

//   //   await handleFileChange(mockEvent);
//   // };

//   // Remove file from selection
//   // const removeFile = (index) => {
//   //   const newFiles = selectedFiles.filter((_, i) => i !== index);
//   //   const newPreviews = previewImages.filter((_, i) => i !== index);

//   //   // Cleanup preview URLs
//   //   if (previewImages[index]) {
//   //     URL.revokeObjectURL(previewImages[index].preview);
//   //   }

//   //   setSelectedFiles(newFiles);
//   //   setPreviewImages(newPreviews);
//   // };

//   // Enhanced upload handler
//   // const handleFileUpload = async () => {
//   //   if (!selectedFiles.length || !selectedFolder) {
//   //     alert("Please select at least one file and choose a folder");
//   //     return;
//   //   }

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("folder_id", selectedFolder);

//   //     // Process files based on scale setting
//   //     const processedFiles = await Promise.all(
//   //       selectedFiles.map(async (file) => {
//   //         if (imageScale !== 100 && file.type.startsWith("image/")) {
//   //           // Scale image if scale is not 100%
//   //           return await scaleImage(file);
//   //         }
//   //         return file;
//   //       })
//   //     );

//   //     // Append all processed files
//   //     processedFiles.forEach((file) => {
//   //       formData.append("images", file);
//   //     });

//   //     console.log(
//   //       `Uploading ${processedFiles.length} file(s) to folder ${selectedFolder}`
//   //     );

//   //     mutate(formData, {
//   //       onSuccess: (data) => {
//   //         console.log("✅ Files uploaded successfully", data);

//   //         // Show success message with details
//   //         const { uploadSummary } = data.data;
//   //         let message = `Successfully uploaded ${uploadSummary.successful} file(s)`;
//   //         if (uploadSummary.failed > 0) {
//   //           message += `, ${uploadSummary.failed} failed`;
//   //         }
//   //         alert(message);

//   //         // Cleanup and reset
//   //         previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
//   //         setSelectedFiles([]);
//   //         setPreviewImages([]);
//   //         setSelectedFolder(null);
//   //         setImageScale(100);
//   //         setShowUploadModal(false);

//   //         // Refresh data
//   //         refetch();
//   //       },
//   //       onError: (err) => {
//   //         console.error("❌ Upload failed:", err);
//   //         alert(`Upload failed: ${err.message || "Unknown error occurred"}`);
//   //       },
//   //     });
//   //   } catch (error) {
//   //     console.error("Error processing files:", error);
//   //     alert("Error processing files before upload");
//   //   }
//   // };

//   // Preview image modal
//   // const openImagePreview = (imageData) => {
//   //   setSelectedPreviewImage(imageData);
//   //   setShowImagePreview(true);
//   // };

//   // Cleanup function
//   // const cleanupPreviews = () => {
//   //   previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
//   //   setPreviewImages([]);
//   //   setSelectedFiles([]);
//   // };

//   // const [showUploadModal, setShowUploadModal] = useState(false);
//   // const [activeTab, setActiveTab] = useState("All Files");
//   // const [searchTerm, setSearchTerm] = useState("");
//   // const [uploadUrl, setUploadUrl] = useState("");
//   // const [selectedFolder, setSelectedFolder] = useState(null);
//   // const [selectedFiles, setSelectedFiles] = useState([]);

//   // Fetch user data including photos
//   // const {
//   //   data: userData,
//   //   isLoading,
//   //   error,
//   //   refetch,
//   // } = useFetchData(
//   //   "/api/v1/collection", // Adjust endpoint as needed
//   //   "userData"
//   // );

//   // Upload mutation
//   //   const uploadMutation = useMutateData("userData", "POST");

//   // const photoFolders = userData?.data?.existing?.photoFolders || [];

//   console.log({
//     ffggg: photoFolders,
//   });

//   // Calculate statistics
//   const totalFiles = photoFolders.reduce(
//     (total, folder) => total + folder.photos.length,
//     0
//   );
//   const totalSize = photoFolders.reduce((total, folder) => {
//     return (
//       total +
//       folder.photos.reduce((folderTotal, photo) => {
//         return folderTotal + (photo.otherdata?.bytes || 0);
//       }, 0)
//     );
//   }, 0);

//   const formatFileSize = (bytes) => {
//     if (!bytes) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const getFilteredPhotos = () => {
//     let allPhotos = [];

//     if (activeTab === "All Files") {
//       photoFolders.forEach((folder) => {
//         folder.photos.forEach((photo) => {
//           allPhotos.push({
//             ...photo,
//             folderName: folder.name,
//             folderId: folder._id,
//           });
//         });
//       });
//     }

//     // Filter by search term
//     if (searchTerm) {
//       allPhotos = allPhotos.filter(
//         (photo) =>
//           photo.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           photo.folderName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     return allPhotos;
//   };

//   // const { mutate, isLoading_data_data } = useMutateData_formdata(
//   //   // "api/v1/general/pickUp",
//   //   "api/v1/collection/add-fileToFolder",
//   //   "POST",
//   //   "files"
//   // );

//   // // const handleFileUpload = () => {
//   // //   if (!selectedFiles.length || !selectedFolder) {
//   // //     alert("Please select at least one file and choose a folder");
//   // //     return;
//   // //   }

//   // //   console.log({
//   // //     mail_oen: selectedFolder,
//   // //     mainGuy: selectedFiles,
//   // //   });

//   // //   const formData = new FormData();
//   // //   formData.append("folder_id", selectedFolder);

//   // //   selectedFolder.forEach((img, index) => {
//   // //     formData.append("images", {
//   // //       uri: img.uri,
//   // //       type: img.type || "image/jpeg", // make sure type exists
//   // //       name: img.name || `image_${index}.jpg`,
//   // //     });
//   // //   });
//   // //   mutate(formData, {
//   // //     onSuccess: (data) => {
//   // //       console.log({
//   // //         success: "File uploaded successfully",

//   // //         ddd: data,
//   // //       });

//   // //       // Alert.alert("Success", "Pickup Errand created successfully!", [
//   // //       //   {
//   // //       //     text: "OK",
//   // //       //     onPress: () => navigation.goBack(), // navigate back
//   // //       //   },
//   // //       // ]);
//   // //       // Alert.alert("Success", "Pickup Errand created successfully!");
//   // //       // setTitle("");
//   // //       // setDeliveryAddress("");
//   // //       // setPickUpAddress("");
//   // //       // setDescription("");
//   // //       // setPhoneNumber("");
//   // //       // setImages([]);
//   // //     },

//   // //     onError: (err) => {
//   // //       console.log({ err });

//   // //       // Alert.alert("Error", err.message || "Failed to create pickup errand");
//   // //     },
//   // //   });
//   // // };

//   // const handleFileUpload = () => {
//   //   if (!selectedFiles.length || !selectedFolder) {
//   //     alert("Please select at least one file and choose a folder");
//   //     return;
//   //   }

//   //   console.log({
//   //     mail_oen: selectedFolder, // this is just the folderId string
//   //     mainGuy: selectedFiles, // this is an array of File objects
//   //   });

//   //   const formData = new FormData();
//   //   formData.append("folder_id", selectedFolder);

//   //   // loop through the files instead
//   //   selectedFiles.forEach((file, index) => {
//   //     formData.append("images", file);
//   //     // since it's a normal File object from <input type="file" />
//   //     // you don’t need to wrap it in {uri, type, name} like React Native
//   //   });

//   //   mutate(formData, {
//   //     onSuccess: (data) => {
//   //       console.log({
//   //         success: "File uploaded successfully",
//   //         ddd: data,
//   //       });

//   //       setSelectedFiles([]);
//   //       setSelectedFolder(null);
//   //       setShowUploadModal(false);
//   //       refetch();
//   //     },
//   //     onError: (err) => {
//   //       console.log({ err });
//   //     },
//   //   });
//   // };

//   // const { mutate, isLoading: isUploading } = useMutateData_formdata(
//   //   "/api/v1/collection/add-fileToFolder", // endpoint
//   //   "POST",
//   //   "files" // query key for cache invalidation
//   // );

//   // const handleFileUpload = () => {
//   //   if (!selectedFiles.length || !selectedFolder) {
//   //     alert("Please select at least one file and choose a folder");
//   //     return;
//   //   }

//   //   const formData = new FormData();
//   //   formData.append("folder_id", selectedFolder); // folderId string

//   //   // append all selected files under key "images"
//   //   selectedFiles.forEach((file) => {
//   //     formData.append("images", file);
//   //   });

//   //   mutate(formData, {
//   //     onSuccess: (data) => {
//   //       console.log("✅ File uploaded successfully", data);
//   //       setSelectedFiles([]);
//   //       setSelectedFolder(null);
//   //       setShowUploadModal(false);
//   //       refetch();
//   //     },
//   //     onError: (err) => {
//   //       console.error("❌ Upload failed:", err);
//   //     },
//   //   });
//   // };

//   const handleUrlUpload = () => {
//     // Handle URL upload logic here
//     setUploadUrl("");
//     setShowUploadModal(false);
//   };

//   // const handleFileChange = (e) => {
//   //   setSelectedFiles(Array.from(e.target.files));
//   // };

//   // Handle drag & drop
//   // const handleDrop = (e) => {
//   //   e.preventDefault();
//   //   const files = Array.from(e.dataTransfer.files);
//   //   setSelectedFiles((prev) => [...prev, ...files]);
//   // };

//   // Prevent default browser behavior
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const filteredPhotos = getFilteredPhotos();

//   if (isLoading) {
//     return (
//       <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading your files...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
//           <p className="text-gray-600 mb-4">Error loading files</p>
//           <button
//             onClick={() => refetch()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

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

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-gray-500 text-sm">Total Files</span>
//             <File className="w-4 h-4 text-gray-400" />
//           </div>
//           <div className="text-3xl font-bold text-gray-900">{totalFiles}</div>
//           <div className="text-xs text-gray-500 mt-1">
//             Across {photoFolders.length} folders
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-gray-500 text-sm">Storage Used</span>
//             <div className="w-4 h-4 bg-gray-200 rounded"></div>
//           </div>
//           <div className="text-3xl font-bold text-gray-900">
//             {formatFileSize(totalSize)}
//           </div>
//           <div className="text-xs text-gray-500 mt-1">Total storage</div>
//         </div>

//         <div className="bg-white rounded-lg p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-gray-500 text-sm">Folders</span>
//             <Folder className="w-4 h-4 text-blue-400" />
//           </div>
//           <div className="text-3xl font-bold text-gray-900">
//             {photoFolders.length}
//           </div>
//           <div className="text-xs text-gray-500 mt-1">Photo folders</div>
//         </div>

//         <div className="bg-white rounded-lg p-6 shadow-sm">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-gray-500 text-sm">Recent Uploads</span>
//             <div className="w-4 h-4 bg-green-200 rounded"></div>
//           </div>
//           <div className="text-3xl font-bold text-gray-900">
//             {
//               filteredPhotos.filter((photo) => {
//                 const uploadDate = new Date(photo.createdAt);
//                 const weekAgo = new Date();
//                 weekAgo.setDate(weekAgo.getDate() - 7);
//                 return uploadDate > weekAgo;
//               }).length
//             }
//           </div>
//           <div className="text-xs text-gray-500 mt-1">This week</div>
//         </div>
//       </div>

//       {/* <FileManagerFake /> */}

//       {/* File Library Section */}
//       <div className="bg-white rounded-lg shadow-sm">
//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <div className="flex space-x-8 px-6">
//             {["All Files", "Folders", "AI Processing"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`py-4 text-sm font-medium border-b-2 ${
//                   activeTab === tab
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Library Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 File Library
//               </h2>
//               <p className="text-sm text-gray-600">
//                 Manage your uploaded files and media
//               </p>
//             </div>
//             <div className="flex space-x-3">
//               <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
//                 <FolderPlus className="w-4 h-4" />
//                 <span>New Folder</span>
//               </button>
//               <button
//                 onClick={() => setShowUploadModal(true)}
//                 className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
//               >
//                 <Upload className="w-4 h-4" />
//                 <span>Upload Files </span>
//               </button>
//             </div>
//           </div>

//           {/* Search and Filter */}
//           <div className="flex items-center justify-between">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search files"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="ml-4">
//               <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                 <option>All Types</option>
//                 <option>Images</option>
//                 <option>Videos</option>
//                 <option>Documents</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="p-6">
//           {activeTab === "Folders" ? (
//             // Folders View
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {photoFolders.map((folder) => (
//                 <div
//                   key={folder._id}
//                   className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//                   onClick={() => setSelectedFolder(folder)}
//                 >
//                   <div className="flex items-center space-x-3 mb-3">
//                     <Folder className="w-8 h-8 text-blue-500" />
//                     <div>
//                       <h3 className="font-medium text-gray-900">
//                         {folder.name}
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         {folder.photos.length} files
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     Created: {formatDate(folder.createdAt)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             // Files View
//             <div className="divide-y divide-gray-200">
//               {filteredPhotos.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">
//                     No files found
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     Upload some files to get started
//                   </p>
//                   <button
//                     onClick={() => setShowUploadModal(true)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Upload Files
//                   </button>
//                 </div>
//               ) : (
//                 filteredPhotos.map((photo) => (
//                   <div
//                     key={photo._id}
//                     className="py-4 flex items-center justify-between hover:bg-gray-50"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
//                         <img
//                           src={photo.url}
//                           alt={photo.caption}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-900">
//                           {photo.caption}
//                         </h3>
//                         <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
//                           <span>{formatFileSize(photo.otherdata?.bytes)}</span>
//                           <span>Folder: {photo.folderName}</span>
//                           <span>{formatDate(photo.createdAt)}</span>
//                           {photo.otherdata && (
//                             <span>
//                               {photo.otherdata.width} × {photo.otherdata.height}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
//                         Uploaded
//                       </span>
//                       <button className="p-2 hover:bg-gray-100 rounded-lg">
//                         <MoreVertical className="w-4 h-4 text-gray-400" />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Upload Files{" "}
//                 {selectedFiles.length > 0 &&
//                   `(${selectedFiles.length} selected)`}
//               </h3>
//               <button
//                 onClick={() => {
//                   cleanupPreviews();
//                   setShowUploadModal(false);
//                   setImageScale(100);
//                 }}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 <X className="w-5 h-5 text-gray-400" />
//               </button>
//             </div>

//             <p className="text-sm text-gray-600 mb-6">
//               Choose images and upload securely. Supports JPEG, PNG, GIF, and
//               WebP formats.
//             </p>

//             {/* Drag and Drop Area */}
//             <div
//               className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
//                 selectedFiles.length > 0
//                   ? "border-blue-400 bg-blue-50"
//                   : "border-gray-300 hover:border-blue-400"
//               }`}
//               onDrop={handleDrop}
//               onDragOver={(e) => e.preventDefault()}
//             >
//               <div className="flex flex-col items-center">
//                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
//                   <Upload className="w-6 h-6 text-gray-400" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-900 mb-1">
//                   Drag and drop your images
//                 </p>
//                 <p className="text-xs text-gray-500 mb-4">
//                   JPEG, PNG, GIF, WebP formats, up to 50MB per file
//                 </p>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   id="fileInput"
//                   multiple
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//                 <label
//                   htmlFor="fileInput"
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
//                 >
//                   Select Images
//                 </label>
//               </div>
//             </div>

//             {/* Image Scale Control */}
//             {selectedFiles.length > 0 && (
//               <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Image Scale: {imageScale}%
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={() => setImageScale(Math.max(10, imageScale - 10))}
//                     className="p-1 hover:bg-gray-200 rounded"
//                   >
//                     <ZoomOut className="w-4 h-4" />
//                   </button>
//                   <input
//                     type="range"
//                     min="10"
//                     max="100"
//                     step="10"
//                     value={imageScale}
//                     onChange={(e) => setImageScale(parseInt(e.target.value))}
//                     className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                   />
//                   <button
//                     onClick={() =>
//                       setImageScale(Math.min(100, imageScale + 10))
//                     }
//                     className="p-1 hover:bg-gray-200 rounded"
//                   >
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   Lower scale = smaller file size. Original size = 100%
//                 </div>
//               </div>
//             )}

//             {/* Image Previews */}
//             {previewImages.length > 0 && (
//               <div className="mb-4">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                   Selected Images ({previewImages.length}):
//                 </h4>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
//                   {previewImages.map((imageData, index) => (
//                     <div
//                       key={index}
//                       className="relative group bg-white rounded-lg p-2 shadow-sm"
//                     >
//                       <div className="aspect-square rounded overflow-hidden bg-gray-100">
//                         <img
//                           src={imageData.preview}
//                           alt={imageData.name}
//                           className="w-full h-full object-cover cursor-pointer hover:opacity-80"
//                           onClick={() => openImagePreview(imageData)}
//                         />
//                       </div>
//                       <div className="mt-2 text-xs">
//                         <div
//                           className="font-medium text-gray-900 truncate"
//                           title={imageData.name}
//                         >
//                           {imageData.name}
//                         </div>
//                         <div className="text-gray-500 flex justify-between">
//                           <span>{(imageData.size / 1024).toFixed(1)} KB</span>
//                           <span>
//                             {imageData.dimensions.width}×
//                             {imageData.dimensions.height}
//                           </span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => removeFile(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                       <button
//                         onClick={() => openImagePreview(imageData)}
//                         className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <Eye className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Folder Selection */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Folder *
//               </label>
//               <select
//                 value={selectedFolder || ""}
//                 onChange={(e) => setSelectedFolder(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               >
//                 <option value="" disabled>
//                   -- Choose a folder --
//                 </option>
//                 {photoFolders.map((folder) => (
//                   <option key={folder._id} value={folder._id}>
//                     {folder.name} ({folder.photos.length} files)
//                   </option>
//                 ))}
//               </select>
//               {photoFolders.length === 0 && (
//                 <p className="text-xs text-red-500 mt-1">
//                   No folders available. Create a folder first.
//                 </p>
//               )}
//             </div>

//             {/* Modal Actions */}
//             <div className="flex space-x-3 mt-6">
//               <button
//                 onClick={() => {
//                   cleanupPreviews();
//                   setShowUploadModal(false);
//                   setImageScale(100);
//                 }}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 disabled={isUploading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFileUpload}
//                 disabled={
//                   !selectedFiles.length || !selectedFolder || isUploading
//                 }
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader className="w-4 h-4 animate-spin" />
//                     <span>Uploading...</span>
//                   </>
//                 ) : (
//                   <span>
//                     Upload {selectedFiles.length} File
//                     {selectedFiles.length !== 1 ? "s" : ""}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Image Preview Modal */}
//       {showImagePreview && selectedPreviewImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
//           <div className="relative max-w-4xl max-h-full p-4">
//             <button
//               onClick={() => {
//                 setShowImagePreview(false);
//                 setSelectedPreviewImage(null);
//               }}
//               className="absolute -top-12 right-0 text-white hover:text-gray-300"
//             >
//               <X className="w-8 h-8" />
//             </button>
//             <img
//               src={selectedPreviewImage.preview}
//               alt={selectedPreviewImage.name}
//               className="max-w-full max-h-full object-contain"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
//               <div className="text-lg font-medium">
//                 {selectedPreviewImage.name}
//               </div>
//               <div className="text-sm text-gray-300">
//                 {selectedPreviewImage.dimensions.width} ×{" "}
//                 {selectedPreviewImage.dimensions.height} •{" "}
//                 {(selectedPreviewImage.size / 1024).toFixed(1)} KB
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileManager;

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
} from "lucide-react";

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
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock data for demonstration - replace with your actual API calls
  const userData = {
    data: {
      existing: {
        photoFolders: [
          {
            _id: "1",
            name: "Personal Photos",
            photos: [
              {
                _id: "p1",
                caption: "Beach vacation",
                url: "https://picsum.photos/200/200?random=1",
                createdAt: "2024-01-15",
                otherdata: { bytes: 2048000, width: 1920, height: 1080 },
              },
            ],
            createdAt: "2024-01-01",
          },
          {
            _id: "2",
            name: "Work Projects",
            photos: [],
            createdAt: "2024-01-10",
          },
        ],
      },
    },
  };

  const photoFolders = userData?.data?.existing?.photoFolders || [];
  const isLoading = false;
  const error = null;

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

  // Enhanced upload handler
  const handleFileUpload = async () => {
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
                onClick={handleFileUpload}
                disabled={
                  !selectedFiles.length || !selectedFolder || isUploading
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>
                    Upload {selectedFiles.length} File
                    {selectedFiles.length !== 1 ? "s" : ""}
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
    </div>
  );
};

export default FileManager;
