import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone } from "lucide-react";
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

const smsConfigSchema = z.object({
  provider: z.enum(["Twilio", "AWS SNS", "MessageBird"], {
    required_error: "Please select a provider",
  }),
  fromNumber: z
    .string()
    .min(10, { message: "From number must be at least 10 digits" }),
  apiKey: z
    .string()
    .min(6, { message: "API key must be at least 6 characters" }),
  enableSMS: z.boolean().default(false),
});

export default function SMSConfigContent() {
  const form = useForm({
    resolver: zodResolver(smsConfigSchema),
    defaultValues: {
      provider: "",
      fromNumber: "",
      apiKey: "",
      enableSMS: false,
    },
  });

  function onSubmit(values) {
    console.log("SMS Config Submitted:", values);
  }

  return (
    <div className="space-y-6 bg-gray-50">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
          <Phone className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">SMS Configuration</h3>
          <p className="text-sm text-gray-500">
            Configure the SMS services settings
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Provider */}
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMS Provider</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select Provider"
                        className="bg-lightBlueGray"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Twilio">Twilio</SelectItem>
                    <SelectItem value="AWS SNS">AWS SNS</SelectItem>
                    <SelectItem value="MessageBird">MessageBird</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* From Number */}
          <FormField
            control={form.control}
            name="fromNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1234567890"
                    type="tel"
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
                    placeholder="Enter API Key"
                    type="password"
                    {...field}
                    className="bg-lightBlueGray"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Enable SMS */}
          <FormField
            control={form.control}
            name="enableSMS"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                <div className="space-y-0.5">
                  <FormLabel>Enable SMS messaging</FormLabel>
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
              <div className="text-lg font-medium ">SMS Balance</div>
              <div className="text-sm bg-[#D1C5FD] rounded-md p-1 font-semibold text-deepPurple">
                Unlimited
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-start">
            <Button
              type="submit"
              className="rounded-full bg-vividBlue hover:bg-[#4A2FB8]"
            >
              Save SMS Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
