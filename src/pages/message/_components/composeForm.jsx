import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Bold, Italic, Underline } from "lucide-react";
import TemplateListModal from "./templateListModal";
const ComposeForm = ({ form, recipientGroups, onNext, isMobile }) => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-darkBlueGray">
              Message Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-paleBlueGray">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Message</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsTemplateModalOpen(true)}
                    >
                      Insert Template
                    </Button>
                  </div>
                  <div className="border rounded-md">
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="border-0 resize-none focus-visible:ring-0 bg-paleBlueGray"
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    {field.value?.length || 0} / 5000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
            <CardDescription>
              Select groups to send your message to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="recipients"
              render={() => (
                <FormItem>
                  <div className="space-y-3">
                    {recipientGroups.map((group) => (
                      <FormField
                        key={group.groupId}
                        control={form.control}
                        name="recipients"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={group.id}
                              className="flex flex-row items-center justify-between space-y-0"
                            >
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      group.groupId
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            group.groupId,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== group.groupId
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-medium">
                                  {group.groupName}
                                </FormLabel>
                              </div>
                              <span className="text-sm text-gray-500">
                                {group.count} members
                              </span>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {isMobile && (
          <Button
            type="button"
            onClick={onNext}
            className="w-full bg-deepPurple hover:bg-deepPurple rounded-full"
            disabled={!isValid}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        <TemplateListModal
          isOpen={isTemplateModalOpen}
          onOpenChange={setIsTemplateModalOpen}
          onUseTemplate={(content) => form.setValue("message", content)}
        />
      </form>
    </Form>
  );
};
export default ComposeForm;
