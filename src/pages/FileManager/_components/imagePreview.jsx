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

const ImagePreviewModal = ({ isOpen, onClose, imageData }) => {
  if (!imageData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <X className="w-6 h-6" />
          </Button>
          <img
            src={imageData.preview}
            alt={imageData.name}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          <div className="bg-black bg-opacity-75 text-white p-4">
            <div className="text-lg font-medium">{imageData.name}</div>
            <div className="text-sm text-gray-300">
              {imageData.dimensions.width} × {imageData.dimensions.height} •{" "}
              {(imageData.size / 1024).toFixed(1)} KB
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ImagePreviewModal;
