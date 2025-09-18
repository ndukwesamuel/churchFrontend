import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ComposeForm from "./_components/composeForm";
import PreviewMessage from "./_components/previewMessage";
import { useFetchData } from "../../hook/Request";
const messageSchema = z.object({
  messageType: z.enum(["sms", "whatsapp", "email"], {
    required_error: "Please select a message type",
  }),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be less than 5000 characters"),
  recipients: z
    .array(z.string())
    .min(1, "Please select at least one recipient group"),
});

const MessageComposer = () => {
  const [currentView, setCurrentView] = useState("compose");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: contactData, refetch } = useFetchData(
    `/api/v1/contacts`,
    "contacts"
  );

  const recipientGroups = contactData?.data?.groupCounts || [];
  // Form setup
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      messageType: "",
      message: "",
      recipients: [],
    },
  });

  const {
    watch,
    handleSubmit,
    formState: { isValid },
  } = form;
  const watchedFields = watch();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentView("preview");
  };

  const handleBack = () => {
    setCurrentView("compose");
  };

  const handleSend = () => {
    if (isValid) {
      handleSubmit((data) => {
        console.log("Sending message:", data);
        // Handle send logic
      })();
    }
  };

  const handleSchedule = () => {
    if (isValid) {
      console.log("Schedule for later:", watchedFields);
      // Handle scheduling logic
    }
  };

  const handleSaveDraft = () => {
    console.log("Save as draft:", watchedFields);
    // Handle save draft logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compose Messages
          </h1>
          <p className="text-gray-600">
            Create and send SMS, Email, or WhatsApp messages to your
            congregation
          </p>
        </div>

        {isMobile ? (
          <div>
            {currentView === "compose" ? (
              <ComposeForm
                form={form}
                recipientGroups={recipientGroups}
                onNext={handleNext}
                isMobile={isMobile}
              />
            ) : (
              <PreviewMessage
                formData={watchedFields}
                recipientGroups={recipientGroups}
                onBack={handleBack}
                onSend={handleSend}
                onSchedule={handleSchedule}
                onSaveDraft={handleSaveDraft}
                isMobile={isMobile}
                isFormValid={isValid}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ComposeForm
                form={form}
                recipientGroups={recipientGroups}
                onNext={handleNext}
                isMobile={isMobile}
              />
            </div>
            <div>
              <PreviewMessage
                formData={watchedFields}
                recipientGroups={recipientGroups}
                onBack={handleBack}
                onSend={handleSend}
                onSchedule={handleSchedule}
                onSaveDraft={handleSaveDraft}
                isMobile={isMobile}
                isFormValid={isValid}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComposer;
