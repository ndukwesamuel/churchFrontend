import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Send,
  Clock,
  Save,
  ArrowRight,
  ArrowLeft,
  Users,
  Bold,
  Italic,
  Underline,
  Smartphone,
  Mail,
  MessageCircle,
} from "lucide-react";

const CampaignSummary = ({
  totalRecipients,
  messageType,
  price,
  onSend,
  onSchedule,
  onSaveDraft,
  isFormValid,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Summary</CardTitle>
        <CardDescription>Review before sending</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Recipient Count</span>
          </div>
          <span className="font-medium">{totalRecipients} people</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Message Type</span>
          <span className="font-medium capitalize">
            {messageType || "Not selected"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Amount to Pay</span>
          <span className="font-medium">${price}</span>
        </div>

        <Button
          className="w-full bg-vividBlue"
          size="lg"
          disabled={!isFormValid}
          onClick={onSend}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Now
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!isFormValid}
            onClick={onSchedule}
            type="button"
          >
            <Clock className="mr-2 h-4 w-4" />
            Schedule for Later
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSaveDraft}
            type="button"
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
