import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchData } from "@/hook/Request";
import { cn } from "@/lib/utils";

const TemplateListModal = ({ isOpen, onOpenChange, onUseTemplate }) => {
  const { data, refetch, isLoading } = useFetchData(
    "/api/v1/templates",
    "templates"
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (isOpen) refetch(); // Fetch when modal opens
  }, [isOpen]);

  const templates = data?.data?.templates || [];

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      const tempEl = document.createElement("div");
      tempEl.innerHTML = selectedTemplate.content;
      const plainText = tempEl.innerText || tempEl.textContent || "";
      onUseTemplate(plainText.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-2">
          {isLoading ? (
            <p className="text-sm text-gray-500 px-2">Loading templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-gray-500 px-2">No templates found.</p>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <Card
                  key={template._id}
                  onClick={() => setSelectedTemplate(template)}
                  className={cn(
                    "cursor-pointer transition-all border hover:border-deepPurple",
                    selectedTemplate?._id === template._id &&
                      "border-deepPurple bg-deepPurple/5"
                  )}
                >
                  <CardHeader className="py-3">
                    <CardTitle className="text-base font-semibold">
                      {template.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      {template.category?.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: template.content }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedTemplate}
            onClick={handleUseTemplate}
            className="bg-deepPurple hover:bg-deepPurple"
          >
            Use as Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateListModal;
