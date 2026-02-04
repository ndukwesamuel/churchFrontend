import React, { useEffect, useState } from "react";
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

// Nigerian Network Prefixes
// const NIGERIAN_NETWORKS = {
//   MTN: [
//     "0803",
//     "0806",
//     "0810",
//     "0813",
//     "0814",
//     "0816",
//     "0903",
//     "0906",
//     "0913",
//     "0916",
//   ],
//   AIRTEL: ["0802", "0808", "0812", "0901", "0902", "0904", "0907", "0912"],
//   GLO: ["0805", "0807", "0811", "0815", "0905", "0915"],
//   "9MOBILE": ["0809", "0817", "0818", "0908", "0909"],
// };

const NIGERIAN_NETWORKS = {
  MTN: [
    "0703",
    "0706",
    "0803",
    "0806",
    "0810",
    "0813",
    "0814",
    "0816",
    "0903",
    "0906",
    "0913",
    "0916",
  ],
  AIRTEL: [
    "0701",
    "0708",
    "0704",
    "0802",
    "0808",
    "0812",
    "0901",
    "0902",
    "0904",
    "0907",
    "0912",
  ],

  GLO: ["0705", "0805", "0807", "0811", "0815", "0905", "0915"],
  "9MOBILE": ["0709", "0809", "0817", "0818", "0908", "0909"],
};

// Detect network provider from phone number
const detectNetwork = (phoneNumber) => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  let prefix = "";

  // Check if it starts with 234 (country code)
  if (digitsOnly.startsWith("234")) {
    prefix = "0" + digitsOnly.substring(3, 6);
  } else if (digitsOnly.startsWith("0")) {
    prefix = digitsOnly.substring(0, 4);
  }

  for (const [network, prefixes] of Object.entries(NIGERIAN_NETWORKS)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }

  return null;
};

// Validate Nigerian phone number
const isValidNigerianNumber = (phoneNumber) => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Check if it's 11 digits starting with 0, or 13 digits starting with 234
  if (digitsOnly.startsWith("234") && digitsOnly.length === 13) {
    return detectNetwork(phoneNumber) !== null;
  }
  if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
    return detectNetwork(phoneNumber) !== null;
  }

  return false;
};

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .refine(isValidNigerianNumber, {
      message:
        "Enter a valid Nigerian phone number (MTN, Airtel, Glo, or 9Mobile)",
    }),
  birthDay: z.string().optional(),
  birthMonth: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  role: z.enum(["Member", "Leader"]),
  groupId: z.string().optional(),
});

export default function AddContactModal({ onClose, contact }) {
  const isEditing = Boolean(contact);
  const [detectedNetwork, setDetectedNetwork] = useState(null);

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
      birthDay: contact?.birthDay || "",
      birthMonth: contact?.birthMonth || "",
      // status: contact?.status || "active",
      status: (contact?.status || "active").toLowerCase(),
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

  // Watch phone number changes to detect network
  const watchPhoneNumber = form.watch("phoneNumber");
  useEffect(() => {
    if (watchPhoneNumber) {
      const network = detectNetwork(watchPhoneNumber);
      setDetectedNetwork(network);
    } else {
      setDetectedNetwork(null);
    }
  }, [watchPhoneNumber]);

  useEffect(() => {
    if (contact) {
      form.reset({
        fullName: contact.fullName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
        birthDay: contact.birthDay || "",
        birthMonth: contact.birthMonth || "",
        // status: contact.status,
        status: (contact?.status || "active").toLowerCase(),
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
    console.log({
      aaa: dataToSend,
    });

    const mutation = isEditing ? updateContact : addContact;
    const url = isEditing
      ? `/api/v1/contacts/${contact._id}`
      : `/api/v1/contacts`;

    mutation(
      { url, data: dataToSend },
      {
        onSuccess: () => onClose(),
        onError: (err) => console.error("Failed to save contact:", err),
      },
    );
  };

  // Network badge colors
  const getNetworkColor = (network) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-800 border-yellow-300",
      AIRTEL: "bg-red-100 text-red-800 border-red-300",
      GLO: "bg-green-100 text-green-800 border-green-300",
      "9MOBILE": "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
    return colors[network] || "bg-gray-100 text-gray-800 border-gray-300";
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
              control={form?.control}
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
              control={form?.control}
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
              control={form?.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="08011111111"
                        {...field}
                        maxLength={11}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                      {detectedNetwork && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border font-medium ${getNetworkColor(
                              detectedNetwork,
                            )}`}
                          >
                            {detectedNetwork}
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter Nigerian number (MTN, Airtel, Glo, 9Mobile)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthday (Day and Month) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Day</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (day) => (
                            <SelectItem key={day} value={String(day)}>
                              {day}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Month</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
