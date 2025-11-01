import { Mail } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const emailConfigSchema = z.object({
  provider: z.enum(["SendGrid", "Mailgun", "AWS SES"], {
    required_error: "Please select a provider",
  }),
  fromEmail: z.string().email("Enter a valid email address"),
  apiKey: z.string().min(6, "API key must be at least 6 characters"),
  enableEmail: z.boolean().default(false),
});

export default function EmailConfigContent() {
  const form = useForm({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      provider: undefined,
      fromEmail: "",
      apiKey: "",
      enableEmail: false,
    },
  });

  const onSubmit = (values) => {
    console.log("Email Config Submitted:", values);
  };

  return (
    <div className="space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
          <Mail className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Email Configuration</h3>
          <p className="text-sm text-gray-500">
            Configure the email services settings
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Provider */}
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Provider</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SendGrid">SendGrid</SelectItem>
                    <SelectItem value="Mailgun">Mailgun</SelectItem>
                    <SelectItem value="AWS SES">AWS SES</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* From Email */}
          <FormField
            control={form.control}
            name="fromEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="noreply@yourchurch.com"
                    {...field}
                    className="bg-lightBlueGray"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* API Key */}
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-lightBlueGray"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Enable Email */}
          <FormField
            control={form.control}
            name="enableEmail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 ">
                <div className="space-y-0.5">
                  <FormLabel>Enable Email Messaging</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-vividBlue data-[state=unchecked]:bg-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Balance Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex gap-2 items-center">
              <div className="text-lg font-medium ">Email Balance</div>
              <div className="text-sm bg-[#D1C5FD] rounded-md p-1 font-semibold text-deepPurple">
                Unlimited
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="bg-[#5B38DB] hover:bg-[#4A2FB8]">
            Save Email Settings
          </Button>
        </form>
      </Form>
    </div>
  );
}
