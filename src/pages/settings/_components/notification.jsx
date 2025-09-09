import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

const notificationSchema = z.object({
  campaignCompletion: z.boolean(),
  deliveryFailure: z.boolean(),
  weeklyReports: z.boolean(),
  emailNotifications: z.boolean(),
});

export default function NotificationContent() {
  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      campaignCompletion: false,
      deliveryFailure: true,
      weeklyReports: false,
      emailNotifications: true,
    },
  });

  function onSubmit(values) {
    console.log("Submitted values:", values);
    // TODO: send to backend API
  }

  const notificationItems = [
    {
      key: "campaignCompletion",
      title: "Campaign Completion",
      description: "Get notified when a campaign completes",
    },
    {
      key: "deliveryFailure",
      title: "Delivery Failure",
      description: "Get notified when a message fails to send",
    },
    {
      key: "weeklyReports",
      title: "Weekly Reports",
      description: "Get informed about the weekly activities",
    },
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Configure your email notification preferences",
    },
  ];

  return (
    <Card className="bg-gray-50 border-0 shadow-none">
      <CardContent className="space-y-6 p-0">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
            <Bell className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Notification</h3>
            <p className="text-sm text-gray-500">
              Configure your email notification preferences
            </p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {notificationItems.map((item) => (
              <FormField
                key={item.key}
                control={form.control}
                name={item.key}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <FormLabel className="font-medium text-gray-900">
                        {item.title}
                      </FormLabel>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-vividBlue"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-start pt-4">
              <Button
                type="submit"
                className="bg-vividBlue hover:bg-[#4A2FB8] rounded-full px-6"
              >
                Save Notification Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
