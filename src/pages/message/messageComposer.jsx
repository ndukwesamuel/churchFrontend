import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ComposeForm from "./_components/composeForm";
import PreviewMessage from "./_components/previewMessage";
import { useFetchData, useMutateData } from "../../hook/Request";
import ScheduleModal from "./_components/scheduleModal";
import { toast } from "sonner";
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
  status: z.enum(["draft", "scheduled", "sent"]).default("draft"),
  scheduleAt: z.date().optional(),
});

const MessageComposer = () => {
  const [currentView, setCurrentView] = useState("compose");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: contactData, refetch } = useFetchData(
    `/api/v1/contacts`,
    "contacts"
  );
  const { mutateAsync, isLoading } = useMutateData(`createMessage`, "POST");

  const recipientGroups = contactData?.data?.groupCounts || [];
  // Form setup
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      messageType: "",
      message: "",
      recipients: [],
    },
    mode: "onChange",
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

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleSend = () => {
    if (isValid) {
      handleSubmit(async (data) => {
        const payload = { ...data, status: "sent" };
        console.log("🚀 Sending immediately:", payload);
        try {
          const response = await mutateAsync({
            url: "/api/v1/messages",
            data: payload,
          });
          console.log({ response });
          toast.success(response.message);
        } catch (error) {
          console.log(error);
          toast.error(
            error.errors?.map((err) => err.message)?.join(", ") ||
              error?.message ||
              "Failed to complete request."
          );
        }
      })();
    }
  };
  const handleBack = () => {
    setCurrentView("compose");
  };
  const handleSchedule = () => {
    if (isValid) {
      setShowScheduleModal(true);
    }
  };

  const confirmSchedule = async (date) => {
    const payload = { ...watchedFields, status: "scheduled", scheduleAt: date };
    console.log("📅 Scheduling:", payload);
    try {
      const response = await mutateAsync({
        url: "/api/v1/messages",
        data: payload,
      });
      console.log({ response });
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error.errors?.map((err) => err.message)?.join(", ") ||
          error?.message ||
          "Failed to complete request."
      );
    }
  };

  const handleSaveDraft = async () => {
    const payload = { ...watchedFields, status: "draft" };
    console.log("💾 Saving draft:", payload);
    try {
      const response = await mutateAsync({
        url: "/api/v1/messages",
        data: payload,
      });
      console.log({ response });
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error.errors?.map((err) => err.message)?.join(", ") ||
          error?.message ||
          "Failed to complete request."
      );
    }
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
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onConfirm={confirmSchedule}
      />
    </div>
  );
};

export default MessageComposer;
