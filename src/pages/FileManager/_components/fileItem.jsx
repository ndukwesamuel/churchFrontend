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
import { formatFileSize } from "../../../utils/helpers";
import { formatDate } from "../../../utils/helpers";
const FileItem = ({ photo }) => (
  <div className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg px-2">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900">{photo.caption}</h3>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
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
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-600 hover:bg-green-100"
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
