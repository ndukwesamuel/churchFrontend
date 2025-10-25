import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useFetchData,
  useMutateData,
  usePatchData,
} from "../../../hook/Request";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Too long"),
  status: z.enum(["Active", "Inactive"]),
  role: z.enum(["Member", "Leader"]),
  groupId: z.string().optional(),
});

export default function AddContactModal({ onClose, contact }) {
  const isEditing = Boolean(contact);

  const { data: groupData } = useFetchData(`/api/v1/groups`, "groups");
  const { mutate: addContact, isLoading: isAdding } = useMutateData("contacts");
  const { mutate: updateContact, isLoading: isUpdating } =
    usePatchData("contacts");

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: contact?.fullName || "",
      email: contact?.email || "",
      phoneNumber: contact?.phoneNumber || "",
      status: contact?.status || "Active",
      role: contact?.role || "Member",
      groupId: contact?.group?._id || "",
    },
  });

  //  Format and standardize phone numbers
  const standardizePhoneNumber = (inputNumber) => {
    const digitsOnly = inputNumber.replace(/\D/g, "");
    if (digitsOnly.startsWith("0")) return "234" + digitsOnly.slice(1);
    return digitsOnly;
  };

  useEffect(() => {
    if (contact) {
      form.reset({
        fullName: contact.fullName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        status: contact.status,
        role: contact.role,
        groupId: contact?.group?._id || "",
      });
    }
  }, [contact, form]);

  const onSubmit = (values) => {
    const dataToSend = {
      ...values,
      phoneNumber: standardizePhoneNumber(values.phoneNumber),
    };

    const mutation = isEditing ? updateContact : addContact;
    const url = isEditing
      ? `/api/v1/contacts/${contact._id}`
      : `/api/v1/contacts`;

    mutation(
      { url, data: dataToSend },
      {
        onSuccess: () => onClose(),
        onError: (err) => console.error("Failed to save contact:", err),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full sm:w-[400px] h-full p-6 overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Contact" : "Add Contact Info"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johnsmith@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="08011111111"
                      {...field}
                      onChange={(e) =>
                        field.onChange(standardizePhoneNumber(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Leader">Leader</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group */}
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groupData?.data?.groups?.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isAdding || isUpdating}
              className="w-full mt-4 bg-deepPurple hover:bg-deepPurple rounded-md text-white font-medium"
            >
              {isEditing
                ? isUpdating
                  ? "Updating..."
                  : "Update Contact"
                : isAdding
                ? "Saving..."
                : "Save Contact"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
