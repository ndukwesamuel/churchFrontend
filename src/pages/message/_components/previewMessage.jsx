import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Clock,
  Save,
  ArrowLeft,
  Users,
  Smartphone,
  Mail,
  MessageCircle,
} from "lucide-react";
import CampaignSummary from "./CampaignSummary";

const PreviewMessage = ({
  formData,
  recipientGroups,
  onBack,
  onSend,
  onSchedule,
  onSaveDraft,
  isMobile,
  isFormValid,
}) => {
  const formatMessage = (text, type) => {
    if (!text) return "";
    switch (type) {
      case "sms":
        return text.length > 160 ? text.substring(0, 157) + "..." : text;
      case "email":
        return text.split("\n").map((line, i) => (
          <p key={i} className="mb-2">
            {line}
          </p>
        ));
      case "whatsapp":
        return text;
      default:
        return text;
    }
  };

  const getTotalRecipients = () => {
    return (
      formData.recipients?.reduce((total, groupId) => {
        const group = recipientGroups.find((g) => g.id === groupId);
        return total + (group?.count || 0);
      }, 0) || 0
    );
  };

  const calculatePrice = () => {
    const totalRecipients = getTotalRecipients();
    switch (formData.messageType) {
      case "sms":
        return (totalRecipients * 0.05).toFixed(2);
      case "email":
        return (totalRecipients * 0.02).toFixed(2);
      case "whatsapp":
        return (totalRecipients * 0.03).toFixed(2);
      default:
        return "0.00";
    }
  };

  return (
    <div className="space-y-6">
      {isMobile && (
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Preview Message</CardTitle>
          <CardDescription>
            Preview how your message will look across SMS, Email and WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sms" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sms" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sms" className="mt-4">
              <div className="p-4 bg-blue-50 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">SMS Preview:</div>
                <div className="text-sm">
                  {formatMessage(formData.message, "sms") ||
                    "Your SMS message will appear here..."}
                </div>
                {formData.message?.length > 160 && (
                  <div className="text-xs text-orange-600 mt-2">
                    Message will be sent as multiple SMS (
                    {Math.ceil(formData.message.length / 160)} parts)
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="email" className="mt-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">Email Preview:</div>
                <div className="text-sm">
                  {formatMessage(formData.message, "email") ||
                    "Your email message will appear here..."}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="whatsapp" className="mt-4">
              <div className="p-4 bg-green-50 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">
                  WhatsApp Preview:
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {formatMessage(formData.message, "whatsapp") ||
                    "Your WhatsApp message will appear here..."}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CampaignSummary
        totalRecipients={getTotalRecipients()}
        messageType={formData.messageType}
        price={calculatePrice()}
        onSend={onSend}
        onSchedule={onSchedule}
        onSaveDraft={onSaveDraft}
        isFormValid={isFormValid}
      />
    </div>
  );
};

export default PreviewMessage;
