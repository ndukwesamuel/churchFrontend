import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export const TemplateModal = ({ template, isOpen, onClose }) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          {template.category && (
            <DialogDescription>
              Category: {template.category.name}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="prose max-w-none text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: template.content }} />
        </div>

        {/* Variables */}
        {template.variables?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Variables
            </h4>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono"
                >
                  {variable?.placeholder || variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
