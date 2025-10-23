import React, { useState, useRef } from "react";
import {
  Upload,
  Search,
  FolderPlus,
  MoreVertical,
  X,
  File,
  Folder,
  AlertCircle,
  Loader,
  Save,
  CircleCheck,
  Eye,
  ZoomIn,
  ZoomOut,
  Plus,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const ImagePreview = ({
  imageData,
  index,
  onRemove,
  onPreview,
  isUploading,
}) => (
  <div className="relative group bg-white rounded-lg p-2 shadow-sm border">
    <div className="aspect-square rounded overflow-hidden bg-gray-100">
      <img
        src={imageData.preview}
        alt={imageData.name}
        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
        onClick={() => !isUploading && onPreview(imageData)}
      />
    </div>
    <div className="mt-2 text-xs">
      <div
        className="font-medium text-gray-900 truncate"
        title={imageData.name}
      >
        {imageData.name}
      </div>
      <div className="text-gray-600 flex justify-between">
        <span>{(imageData.size / 1024).toFixed(1)} KB</span>
        <span>
          {imageData.dimensions.width}×{imageData.dimensions.height}
        </span>
      </div>
    </div>
    <Button
      size="icon"
      variant="destructive"
      onClick={() => onRemove(index)}
      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
      disabled={isUploading}
      title="Remove file"
    >
      <X className="w-3 h-3" />
    </Button>
    <Button
      size="icon"
      variant="secondary"
      onClick={() => onPreview(imageData)}
      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 hover:bg-opacity-70"
      disabled={isUploading}
      title="Preview image"
    >
      <Eye className="w-3 h-3" />
    </Button>
  </div>
);

export default ImagePreview;
