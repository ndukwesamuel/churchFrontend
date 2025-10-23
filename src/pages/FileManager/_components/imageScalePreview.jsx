import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
const ImageScaleControl = ({ imageScale, setImageScale, isUploading }) => (
  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Image Scale: {imageScale}%
    </label>
    <div className="flex items-center space-x-3">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setImageScale(Math.max(10, imageScale - 10))}
        disabled={isUploading}
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      <Slider
        value={[imageScale]}
        onValueChange={(value) => setImageScale(value[0])}
        min={10}
        max={100}
        step={10}
        disabled={isUploading}
        className="flex-1"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setImageScale(Math.min(100, imageScale + 10))}
        disabled={isUploading}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
    </div>
    <p className="text-xs text-gray-600 mt-1">
      Lower scale = smaller file size. Original size = 100%
    </p>
  </div>
);

export default ImageScaleControl;
