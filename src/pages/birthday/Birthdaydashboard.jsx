// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   Cake,
//   Filter,
//   Search,
//   Users,
//   Mail,
//   Phone,
//   Send,
//   FileText,
//   Settings,
//   Save,
//   CheckCircle2,
//   Trash2,
//   Edit,
//   AlertCircle,
// } from "lucide-react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useFetchData, useMutateData } from "../../hook/Request";
// import { toast } from "sonner";

// const MONTHS = [
//   { value: "all", label: "All Months" },
//   { value: "1", label: "January" },
//   { value: "2", label: "February" },
//   { value: "3", label: "March" },
//   { value: "4", label: "April" },
//   { value: "5", label: "May" },
//   { value: "6", label: "June" },
//   { value: "7", label: "July" },
//   { value: "8", label: "August" },
//   { value: "9", label: "September" },
//   { value: "10", label: "October" },
//   { value: "11", label: "November" },
//   { value: "12", label: "December" },
// ];

// const CHANNEL_OPTIONS = [
//   { value: "sms", label: "SMS", icon: Phone },
//   { value: "email", label: "Email", icon: Mail },
// ];

// export default function BirthdayDashboard() {
//   const [selectedMonth, setSelectedMonth] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sendingMessages, setSendingMessages] = useState({});
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [selectedChannels, setSelectedChannels] = useState([]);
//   const [sendTime, setSendTime] = useState("08:00");
//   const [isEnabled, setIsEnabled] = useState(true);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [showConfigForm, setShowConfigForm] = useState(false);

//   // Build API URL based on selected month
//   const apiUrl =
//     selectedMonth === "all"
//       ? "/api/v1/birthday"
//       : `/api/v1/birthday?month=${selectedMonth}`;

//   // Fetch birthday data
//   const { data, isLoading, refetch } = useFetchData(
//     apiUrl,
//     `birthdays-${selectedMonth}`
//   );

//   // Fetch templates
//   const { data: templateData, isLoading: templatesLoading } = useFetchData(
//     "/api/v1/birthday/template",
//     "birthday-templates"
//   );

//   const templates__new_Data =
//     templateData?.data?.templates?.filter(
//       (template) => template.category?.name === "Birthday"
//     ) || [];

//   // Fetch existing config
//   const {
//     data: configData,
//     isLoading: configLoading,
//     refetch: refetchConfig,
//   } = useFetchData("/api/v1/birthday/templateConfig", "birthday-config");

//   // Mutation for saving config
//   const { mutate: saveConfig, isLoading: isSavingConfig } = useMutateData(
//     "birthday-config",
//     "POST"
//   );

//   // Mutation for deleting config
//   const { mutate: deleteConfig, isLoading: isDeletingConfig } = useMutateData(
//     "birthday-config",
//     "DELETE"
//   );

//   // Mutation for sending birthday messages
//   const { mutate: sendBirthdayMessage, isLoading: isSendingMessage } =
//     useMutateData("birthday-messages", "POST");

//   const birthdays = data || [];
//   const templates = templates__new_Data || [];

//   // Get the first config (since there's only one per user)
//   const currentConfig = configData?.data?.[0] || null;

//   // Get selected template object
//   const selectedTemplateObj = templates.find((t) => t._id === selectedTemplate);

//   // Load existing config when data is fetched
//   useEffect(() => {
//     if (currentConfig) {
//       setSelectedTemplate(currentConfig.template?._id || "");
//       setSelectedChannels(currentConfig.selectedChannels || []);
//       setSendTime(currentConfig.sendTime || "08:00");
//       setIsEnabled(currentConfig.enabled !== false);
//       setHasUnsavedChanges(false);
//       setShowConfigForm(false);
//     } else {
//       setShowConfigForm(true);
//     }
//   }, [currentConfig]);

//   // Track changes
//   useEffect(() => {
//     if (currentConfig) {
//       const hasChanges =
//         selectedTemplate !== (currentConfig.template?._id || "") ||
//         JSON.stringify(selectedChannels) !==
//           JSON.stringify(currentConfig.selectedChannels || []) ||
//         sendTime !== (currentConfig.sendTime || "08:00") ||
//         isEnabled !== (currentConfig.enabled !== false);

//       setHasUnsavedChanges(hasChanges);
//     }
//   }, [selectedTemplate, selectedChannels, sendTime, isEnabled, currentConfig]);

//   // Handle channel selection
//   const handleChannelToggle = (channel) => {
//     setSelectedChannels((prev) =>
//       prev.includes(channel)
//         ? prev.filter((c) => c !== channel)
//         : [...prev, channel]
//     );
//   };

//   // Save birthday configuration
//   const handleSaveConfig = async () => {
//     if (!selectedTemplate) {
//       toast.error("Please select a template");
//       return;
//     }

//     if (selectedChannels.length === 0) {
//       toast.error("Please select at least one channel");
//       return;
//     }

//     const configPayload = {
//       template: selectedTemplate,
//       selectedChannels: selectedChannels,
//       enabled: isEnabled,
//       sendTime: sendTime,
//     };

//     saveConfig(
//       {
//         url: "/api/v1/birthday/template",
//         data: configPayload,
//       },
//       {
//         onSuccess: (response) => {
//           toast.success("Birthday configuration saved successfully! 🎉");
//           setHasUnsavedChanges(false);
//           refetchConfig();
//           setShowConfigForm(false);
//         },
//         onError: (error) => {
//           console.error("Error saving config:", error);
//           toast.error(
//             error?.message || "Failed to save birthday configuration"
//           );
//         },
//       }
//     );
//   };

//   // Delete birthday configuration
//   const handleDeleteConfig = async () => {
//     if (!currentConfig) return;

//     if (
//       !confirm("Are you sure you want to delete this birthday configuration?")
//     ) {
//       return;
//     }

//     deleteConfig(
//       {
//         url: `/api/v1/birthday/templateConfig/${currentConfig._id}`,
//       },
//       {
//         onSuccess: () => {
//           toast.success("Birthday configuration deleted successfully! 🗑️");
//           refetchConfig();
//           setSelectedTemplate("");
//           setSelectedChannels([]);
//           setSendTime("08:00");
//           setIsEnabled(true);
//           setShowConfigForm(true);
//         },
//         onError: (error) => {
//           console.error("Error deleting config:", error);
//           toast.error(
//             error?.message || "Failed to delete birthday configuration"
//           );
//         },
//       }
//     );
//   };

//   // Filter by search query
//   const filteredBirthdays = birthdays.filter((contact) =>
//     contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group birthdays by month for display
//   const groupedByMonth = filteredBirthdays.reduce((acc, contact) => {
//     const monthKey = contact.birthMonth;
//     if (!acc[monthKey]) {
//       acc[monthKey] = [];
//     }
//     acc[monthKey].push(contact);
//     return acc;
//   }, {});

//   // Format month name
//   const getMonthName = (monthNumber) => {
//     const month = MONTHS.find((m) => m.value === monthNumber);
//     return month ? month.label : "";
//   };

//   // Format birthday display
//   const formatBirthday = (day, month) => {
//     return `${getMonthName(month)} ${day}`;
//   };

//   // Get today's date
//   const today = new Date();
//   const currentDay = today.getDate();
//   const currentMonth = today.getMonth() + 1;

//   // Check if birthday is today
//   const isBirthdayToday = (day, month) => {
//     return parseInt(day) === currentDay && parseInt(month) === currentMonth;
//   };

//   // Check if birthday is upcoming (within 7 days)
//   const isBirthdayUpcoming = (day, month) => {
//     const birthdayDate = new Date(
//       today.getFullYear(),
//       parseInt(month) - 1,
//       parseInt(day)
//     );
//     const diffTime = birthdayDate - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 && diffDays <= 7;
//   };

//   // Calculate stats
//   const todayBirthdays = birthdays.filter((b) =>
//     isBirthdayToday(b.birthDay, b.birthMonth)
//   );
//   const upcomingBirthdays = birthdays.filter((b) =>
//     isBirthdayUpcoming(b.birthDay, b.birthMonth)
//   );

//   // Handle sending birthday messages
//   const handleSendMessage = async (contact, messageType) => {
//     // Check if config is saved
//     if (!currentConfig) {
//       toast.error("Please configure and save your birthday settings first");
//       return;
//     }

//     const key = `${contact._id}-${messageType}`;
//     setSendingMessages((prev) => ({ ...prev, [key]: true }));

//     const messagePayload = {
//       contactId: contact._id,
//       messageType: messageType,
//       templateId: currentConfig.template._id,
//     };

//     sendBirthdayMessage(
//       {
//         url: "/api/v1/birthday/sendmessage",
//         data: messagePayload,
//       },
//       {
//         onSuccess: (response) => {
//           setSendingMessages((prev) => ({ ...prev, [key]: false }));

//           if (messageType === "sms") {
//             toast.success(
//               `SMS birthday message sent to ${contact.fullName}! 🎉`
//             );
//           } else if (messageType === "email") {
//             toast.success(
//               `Email birthday message sent to ${contact.fullName}! 📧`
//             );
//           } else if (messageType === "both") {
//             toast.success(
//               `SMS & Email birthday messages sent to ${contact.fullName}! 🎊`
//             );
//           }
//         },
//         onError: (error) => {
//           setSendingMessages((prev) => ({ ...prev, [key]: false }));
//           console.error("Error sending message:", error);
//           toast.error(
//             error?.message || `Failed to send message to ${contact.fullName}`
//           );
//         },
//       }
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Cake className="w-5 h-5 text-[#5B38DB]" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Birthday Calendar
//               </h1>
//               <p className="text-gray-600">View and manage member birthdays</p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {/* Today's Birthdays */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Today's Birthdays</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {todayBirthdays.length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
//                 <Cake className="w-6 h-6 text-pink-600" />
//               </div>
//             </div>
//           </div>

//           {/* Upcoming (7 days) */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Next 7 Days</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {upcomingBirthdays.length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           {/* Total Birthdays */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Total Birthdays</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {birthdays.length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Users className="w-6 h-6 text-[#5B38DB]" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Current Configuration Display */}
//         {currentConfig && !showConfigForm && (
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <CheckCircle2 className="w-5 h-5 text-green-600" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     Active Birthday Configuration
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     Your birthday messages are configured and ready
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 {/* <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setShowConfigForm(true)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <Edit className="w-4 h-4 mr-1" />
//                   Edit
//                 </Button> */}
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={handleDeleteConfig}
//                   disabled={isDeletingConfig}
//                   className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
//                 >
//                   {isDeletingConfig ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1"></div>
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Delete
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Template */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-xs text-gray-500 mb-1">Template</p>
//                 <p className="font-medium text-gray-900">
//                   {currentConfig.template?.name || "Not set"}
//                 </p>
//                 {currentConfig.template?.note && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     {currentConfig.template.note}
//                   </p>
//                 )}
//               </div>

//               {/* Channels */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-xs text-gray-500 mb-2">Channels</p>
//                 <div className="flex flex-wrap gap-2">
//                   {currentConfig.selectedChannels.map((channel) => (
//                     <span
//                       key={channel}
//                       className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 border border-gray-200"
//                     >
//                       {channel === "sms" && <Phone className="w-3 h-3" />}
//                       {channel === "email" && <Mail className="w-3 h-3" />}
//                       {channel.toUpperCase()}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Send Time */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-xs text-gray-500 mb-1">Send Time</p>
//                 <p className="font-medium text-gray-900">
//                   {currentConfig.sendTime}
//                 </p>
//               </div>

//               {/* Status */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-xs text-gray-500 mb-1">Status</p>
//                 <span
//                   className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
//                     currentConfig.enabled
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   <div
//                     className={`w-2 h-2 rounded-full ${
//                       currentConfig.enabled ? "bg-green-600" : "bg-gray-600"
//                     }`}
//                   ></div>
//                   {currentConfig.enabled ? "Enabled" : "Disabled"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Birthday Configuration Form */}
//         {(!currentConfig || showConfigForm) && (
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <Settings className="w-5 h-5 text-[#5B38DB]" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {currentConfig
//                       ? "Edit Birthday Configuration"
//                       : "Birthday Message Configuration"}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {currentConfig
//                       ? "Update your template and channels for birthday messages"
//                       : "Set up your default template and channels for birthday messages"}
//                   </p>
//                 </div>
//               </div>
//               {currentConfig && showConfigForm && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     setShowConfigForm(false);
//                     // Reset to current config values
//                     setSelectedTemplate(currentConfig.template?._id || "");
//                     setSelectedChannels(currentConfig.selectedChannels || []);
//                     setSendTime(currentConfig.sendTime || "08:00");
//                     setIsEnabled(currentConfig.enabled !== false);
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </div>

//             <div className="space-y-4">
//               {/* Template Selection */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-2 block">
//                   Select Message Template{" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <Select
//                   value={selectedTemplate}
//                   onValueChange={setSelectedTemplate}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Choose a birthday template..." />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {templatesLoading ? (
//                       <div className="p-4 text-center text-gray-500">
//                         Loading templates...
//                       </div>
//                     ) : templates.length === 0 ? (
//                       <div className="p-4 text-center text-gray-500">
//                         No birthday templates available
//                       </div>
//                     ) : (
//                       templates.map((template) => (
//                         <SelectItem key={template._id} value={template._id}>
//                           <div className="flex flex-col">
//                             <span className="font-medium">{template.name}</span>
//                             {template.note && (
//                               <span className="text-xs text-gray-500">
//                                 {template.note}
//                               </span>
//                             )}
//                           </div>
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//                 {selectedTemplateObj && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     Selected:{" "}
//                     <span className="font-medium">
//                       {selectedTemplateObj.name}
//                     </span>
//                   </p>
//                 )}
//               </div>

//               {/* Channel Selection */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-2 block">
//                   Select Channels <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex gap-4">
//                   {CHANNEL_OPTIONS.map((channel) => {
//                     const Icon = channel.icon;
//                     return (
//                       <div
//                         key={channel.value}
//                         className="flex items-center space-x-2"
//                       >
//                         <Checkbox
//                           id={channel.value}
//                           checked={selectedChannels.includes(channel.value)}
//                           onCheckedChange={() =>
//                             handleChannelToggle(channel.value)
//                           }
//                         />
//                         <label
//                           htmlFor={channel.value}
//                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
//                         >
//                           <Icon className="w-4 h-4" />
//                           {channel.label}
//                         </label>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Send Time */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     Send Time
//                   </label>
//                   <Input
//                     type="time"
//                     value={sendTime}
//                     onChange={(e) => setSendTime(e.target.value)}
//                     className="w-full"
//                   />
//                 </div>

//                 <div className="flex items-end">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="enabled"
//                       checked={isEnabled}
//                       onCheckedChange={setIsEnabled}
//                     />
//                     <label
//                       htmlFor="enabled"
//                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                     >
//                       Enable automatic birthday messages
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Save Button */}
//               <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                 <div>
//                   {hasUnsavedChanges && (
//                     <p className="text-sm text-amber-600 flex items-center gap-1">
//                       <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
//                       You have unsaved changes
//                     </p>
//                   )}
//                   {!hasUnsavedChanges && selectedTemplate && currentConfig && (
//                     <p className="text-sm text-green-600 flex items-center gap-1">
//                       <CheckCircle2 className="w-4 h-4" />
//                       Configuration saved
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   onClick={handleSaveConfig}
//                   disabled={
//                     isSavingConfig ||
//                     !selectedTemplate ||
//                     selectedChannels.length === 0
//                   }
//                   className="bg-[#5B38DB] hover:bg-[#4a2db0]"
//                 >
//                   {isSavingConfig ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       {currentConfig
//                         ? "Update Configuration"
//                         : "Save Configuration"}
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* No Config Warning */}
//         {!currentConfig && !showConfigForm && (
//           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
//               <div className="flex-1">
//                 <h3 className="font-semibold text-amber-900 mb-1">
//                   No Birthday Configuration Set
//                 </h3>
//                 <p className="text-sm text-amber-800 mb-3">
//                   You haven't configured your birthday messages yet. Set up your
//                   template and channels to start sending birthday wishes
//                   automatically.
//                 </p>
//                 <Button
//                   size="sm"
//                   onClick={() => setShowConfigForm(true)}
//                   className="bg-amber-600 hover:bg-amber-700"
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   Configure Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by name..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             {/* Month Filter */}
//             <div className="w-full md:w-48">
//               <Select
//                 value={selectedMonth}
//                 onValueChange={(value) => {
//                   setSelectedMonth(value);
//                   setSearchQuery("");
//                 }}
//               >
//                 <SelectTrigger>
//                   <Filter className="w-4 h-4 mr-2" />
//                   <SelectValue placeholder="Filter by month" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {MONTHS.map((month) => (
//                     <SelectItem key={month.value} value={month.value}>
//                       {month.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Reset Button */}
//             {(selectedMonth !== "all" || searchQuery) && (
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setSelectedMonth("all");
//                   setSearchQuery("");
//                 }}
//               >
//                 Reset
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Birthday List */}
//         {isLoading ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//             <div className="animate-spin w-8 h-8 border-4 border-[#5B38DB] border-t-transparent rounded-full mx-auto mb-4"></div>
//             <p className="text-gray-500">Loading birthdays...</p>
//           </div>
//         ) : filteredBirthdays.length === 0 ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//             <Cake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               No birthdays found
//             </h3>
//             <p className="text-gray-500">
//               {searchQuery
//                 ? "Try a different search term"
//                 : selectedMonth !== "all"
//                 ? `No birthdays in ${getMonthName(selectedMonth)}`
//                 : "No birthdays recorded yet"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {selectedMonth === "all" ? (
//               // Grouped by month view
//               Object.keys(groupedByMonth)
//                 .sort((a, b) => parseInt(a) - parseInt(b))
//                 .map((monthKey) => (
//                   <div
//                     key={monthKey}
//                     className="bg-white rounded-lg border border-gray-200 overflow-hidden"
//                   >
//                     <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//                       <h3 className="font-semibold text-gray-900">
//                         {getMonthName(monthKey)} (
//                         {groupedByMonth[monthKey].length})
//                       </h3>
//                     </div>
//                     <div className="divide-y divide-gray-200">
//                       {groupedByMonth[monthKey]
//                         .sort(
//                           (a, b) => parseInt(a.birthDay) - parseInt(b.birthDay)
//                         )
//                         .map((contact) => (
//                           <BirthdayCard
//                             key={contact._id}
//                             contact={contact}
//                             isBirthdayToday={isBirthdayToday}
//                             isBirthdayUpcoming={isBirthdayUpcoming}
//                             formatBirthday={formatBirthday}
//                             onSendMessage={handleSendMessage}
//                             sendingMessages={sendingMessages}
//                             selectedChannels={
//                               currentConfig?.selectedChannels || []
//                             }
//                             hasConfig={!!currentConfig}
//                           />
//                         ))}
//                     </div>
//                   </div>
//                 ))
//             ) : (
//               // Single month view
//               <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                 <div className="divide-y divide-gray-200">
//                   {filteredBirthdays
//                     .sort((a, b) => parseInt(a.birthDay) - parseInt(b.birthDay))
//                     .map((contact) => (
//                       <BirthdayCard
//                         key={contact._id}
//                         contact={contact}
//                         isBirthdayToday={isBirthdayToday}
//                         isBirthdayUpcoming={isBirthdayUpcoming}
//                         formatBirthday={formatBirthday}
//                         onSendMessage={handleSendMessage}
//                         sendingMessages={sendingMessages}
//                         selectedChannels={currentConfig?.selectedChannels || []}
//                         hasConfig={!!currentConfig}
//                       />
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Birthday Card Component (unchanged)
// function BirthdayCard({
//   contact,
//   isBirthdayToday,
//   isBirthdayUpcoming,
//   formatBirthday,
//   onSendMessage,
//   sendingMessages,
//   selectedChannels,
//   hasConfig,
// }) {
//   const isToday = isBirthdayToday(contact.birthDay, contact.birthMonth);
//   const isUpcoming = isBirthdayUpcoming(contact.birthDay, contact.birthMonth);

//   const isSendingSMS = sendingMessages[`${contact._id}-sms`];
//   const isSendingEmail = sendingMessages[`${contact._id}-email`];
//   const isSendingBoth = sendingMessages[`${contact._id}-both`];

//   const canSendSMS = selectedChannels.includes("sms");
//   const canSendEmail = selectedChannels.includes("email") && contact.email;

//   return (
//     <div
//       className={`p-4 hover:bg-gray-50 transition-colors ${
//         isToday ? "bg-pink-50" : ""
//       }`}
//     >
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div className="flex items-center gap-4">
//           {/* Avatar */}
//           <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//             {contact.fullName.charAt(0).toUpperCase()}
//           </div>

//           {/* Info */}
//           <div>
//             <div className="flex items-center gap-2 flex-wrap">
//               <h4 className="font-semibold text-gray-900">
//                 {contact.fullName}
//               </h4>
//               {isToday && (
//                 <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">
//                   🎉 Today!
//                 </span>
//               )}
//               {!isToday && isUpcoming && (
//                 <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
//                   Upcoming
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
//               <span className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 {formatBirthday(contact.birthDay, contact.birthMonth)}
//               </span>
//               {contact.email && <span className="text-gray-400">•</span>}
//               {contact.email && <span>{contact.email}</span>}
//             </div>
//           </div>
//         </div>

//         {/* Message Actions */}
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-sm text-gray-500 mr-2">{contact.role}</span>

//           {/* SMS Button */}
//           {canSendSMS && (
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onSendMessage(contact, "sms")}
//               disabled={isSendingSMS || !hasConfig}
//               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-300 disabled:opacity-50"
//               title={
//                 !hasConfig ? "Please configure settings first" : "Send SMS"
//               }
//             >
//               {isSendingSMS ? (
//                 <>
//                   <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1"></div>
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Phone className="w-4 h-4 mr-1" />
//                   SMS
//                 </>
//               )}
//             </Button>
//           )}

//           {/* Email Button */}
//           {canSendEmail && (
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onSendMessage(contact, "email")}
//               disabled={isSendingEmail || !hasConfig}
//               className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-300 disabled:opacity-50"
//               title={
//                 !hasConfig ? "Please configure settings first" : "Send email"
//               }
//             >
//               {isSendingEmail ? (
//                 <>
//                   <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1"></div>
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Mail className="w-4 h-4 mr-1" />
//                   Email
//                 </>
//               )}
//             </Button>
//           )}

//           {/* Both Button */}
//           {canSendSMS && canSendEmail && (
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => onSendMessage(contact, "both")}
//               disabled={isSendingBoth || !hasConfig}
//               className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 border-purple-300 disabled:opacity-50"
//               title={
//                 !hasConfig
//                   ? "Please configure settings first"
//                   : "Send both SMS and Email"
//               }
//             >
//               {isSendingBoth ? (
//                 <>
//                   <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-1"></div>
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-4 h-4 mr-1" />
//                   Both
//                 </>
//               )}
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Cake,
  Filter,
  Search,
  Users,
  Mail,
  Phone,
  Send,
  FileText,
  Settings,
  Save,
  CheckCircle2,
  Trash2,
  Edit,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFetchData, useMutateData } from "../../hook/Request";
import { toast } from "sonner";

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const CHANNEL_OPTIONS = [
  { value: "sms", label: "SMS", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
];

export default function BirthdayDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingMessages, setSendingMessages] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [sendTime, setSendTime] = useState("08:00");
  const [isEnabled, setIsEnabled] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);

  // Build API URL based on selected month
  const apiUrl =
    selectedMonth === "all"
      ? "/api/v1/birthday"
      : `/api/v1/birthday?month=${selectedMonth}`;

  // Fetch birthday data
  const { data, isLoading, refetch } = useFetchData(
    apiUrl,
    `birthdays-${selectedMonth}`
  );

  // Fetch templates
  const { data: templateData, isLoading: templatesLoading } = useFetchData(
    "/api/v1/birthday/template",
    "birthday-templates"
  );

  const templates__new_Data =
    templateData?.data?.templates?.filter(
      (template) => template.category?.name === "Birthday"
    ) || [];

  // Fetch existing config
  const {
    data: configData,
    isLoading: configLoading,
    refetch: refetchConfig,
  } = useFetchData("/api/v1/birthday/templateConfig", "birthday-config");

  // Mutation for saving config
  const { mutate: saveConfig, isLoading: isSavingConfig } = useMutateData(
    "birthday-config",
    "POST"
  );

  // Mutation for deleting config
  const { mutate: deleteConfig, isLoading: isDeletingConfig } = useMutateData(
    "birthday-config",
    "DELETE"
  );

  // Mutation for sending birthday messages
  const { mutate: sendBirthdayMessage, isLoading: isSendingMessage } =
    useMutateData("birthday-messages", "POST");

  const birthdays = data || [];
  const templates = templates__new_Data || [];

  // Get the first config (since there's only one per user)
  const currentConfig = configData?.data?.[0] || null;

  // Get selected template object
  const selectedTemplateObj = templates.find((t) => t._id === selectedTemplate);

  // Load existing config when data is fetched
  useEffect(() => {
    if (currentConfig) {
      setSelectedTemplate(currentConfig.template?._id || "");
      setSelectedChannels(currentConfig.selectedChannels || []);
      setSendTime(currentConfig.sendTime || "08:00");
      setIsEnabled(currentConfig.enabled !== false);
      setHasUnsavedChanges(false);
      setShowConfigForm(false);
    } else {
      setShowConfigForm(true);
    }
  }, [currentConfig]);

  // Track changes
  useEffect(() => {
    if (currentConfig) {
      const hasChanges =
        selectedTemplate !== (currentConfig.template?._id || "") ||
        JSON.stringify(selectedChannels) !==
          JSON.stringify(currentConfig.selectedChannels || []) ||
        sendTime !== (currentConfig.sendTime || "08:00") ||
        isEnabled !== (currentConfig.enabled !== false);

      setHasUnsavedChanges(hasChanges);
    }
  }, [selectedTemplate, selectedChannels, sendTime, isEnabled, currentConfig]);

  // Handle channel selection
  const handleChannelToggle = (channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  // Save birthday configuration
  const handleSaveConfig = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    if (selectedChannels.length === 0) {
      toast.error("Please select at least one channel");
      return;
    }

    const configPayload = {
      template: selectedTemplate,
      selectedChannels: selectedChannels,
      enabled: isEnabled,
      sendTime: sendTime,
    };

    saveConfig(
      {
        url: "/api/v1/birthday/template",
        data: configPayload,
      },
      {
        onSuccess: (response) => {
          toast.success("Birthday configuration saved successfully! 🎉");
          setHasUnsavedChanges(false);
          refetchConfig();
          setShowConfigForm(false);
        },
        onError: (error) => {
          console.error("Error saving config:", error);
          toast.error(
            error?.message || "Failed to save birthday configuration"
          );
        },
      }
    );
  };

  // Delete birthday configuration
  const handleDeleteConfig = async () => {
    if (!currentConfig) return;

    if (
      !confirm("Are you sure you want to delete this birthday configuration?")
    ) {
      return;
    }

    deleteConfig(
      {
        url: `/api/v1/birthday/templateConfig/${currentConfig._id}`,
      },
      {
        onSuccess: () => {
          toast.success("Birthday configuration deleted successfully! 🗑️");
          refetchConfig();
          setSelectedTemplate("");
          setSelectedChannels([]);
          setSendTime("08:00");
          setIsEnabled(true);
          setShowConfigForm(true);
        },
        onError: (error) => {
          console.error("Error deleting config:", error);
          toast.error(
            error?.message || "Failed to delete birthday configuration"
          );
        },
      }
    );
  };

  // Filter by search query
  const filteredBirthdays = birthdays.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group birthdays by month for display
  const groupedByMonth = filteredBirthdays.reduce((acc, contact) => {
    const monthKey = contact.birthMonth;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(contact);
    return acc;
  }, {});

  // Format month name
  const getMonthName = (monthNumber) => {
    const month = MONTHS.find((m) => m.value === monthNumber);
    return month ? month.label : "";
  };

  // Format birthday display
  const formatBirthday = (day, month) => {
    return `${getMonthName(month)} ${day}`;
  };

  // Get today's date
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;

  // Check if birthday is today
  const isBirthdayToday = (day, month) => {
    return parseInt(day) === currentDay && parseInt(month) === currentMonth;
  };

  // Check if birthday is upcoming (within 7 days)
  const isBirthdayUpcoming = (day, month) => {
    const birthdayDate = new Date(
      today.getFullYear(),
      parseInt(month) - 1,
      parseInt(day)
    );
    const diffTime = birthdayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  };

  // Calculate stats
  const todayBirthdays = birthdays.filter((b) =>
    isBirthdayToday(b.birthDay, b.birthMonth)
  );
  const upcomingBirthdays = birthdays.filter((b) =>
    isBirthdayUpcoming(b.birthDay, b.birthMonth)
  );

  // Handle sending birthday messages - FIXED VERSION
  const handleSendMessage = async (contact, channel) => {
    const key = `${contact._id}-${channel}`;
    setSendingMessages((prev) => ({ ...prev, [key]: true }));

    const messagePayload = {
      contactId: contact._id,
      channel: channel, // Changed from messageType to channel to match your API
    };

    sendBirthdayMessage(
      {
        url: "/api/v1/birthday/sendmessage",
        data: messagePayload,
      },
      {
        onSuccess: (response) => {
          setSendingMessages((prev) => ({ ...prev, [key]: false }));

          if (channel === "sms") {
            toast.success(
              `SMS birthday message sent to ${contact.fullName}! 🎉`
            );
          } else if (channel === "email") {
            toast.success(
              `Email birthday message sent to ${contact.fullName}! 📧`
            );
          }
        },
        onError: (error) => {
          setSendingMessages((prev) => ({ ...prev, [key]: false }));
          console.error("Error sending message:", error);
          toast.error(
            error?.message || `Failed to send message to ${contact.fullName}`
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Cake className="w-5 h-5 text-[#5B38DB]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Birthday Calendar
              </h1>
              <p className="text-gray-600">View and manage member birthdays</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Today's Birthdays */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Birthdays</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayBirthdays.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Cake className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          {/* Upcoming (7 days) */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Next 7 Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingBirthdays.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Birthdays */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Birthdays</p>
                <p className="text-2xl font-bold text-gray-900">
                  {birthdays.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#5B38DB]" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Configuration Display */}
        {currentConfig && !showConfigForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Active Birthday Configuration
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your birthday messages are configured and ready
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDeleteConfig}
                  disabled={isDeletingConfig}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
                >
                  {isDeletingConfig ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Template */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Template</p>
                <p className="font-medium text-gray-900">
                  {currentConfig.template?.name || "Not set"}
                </p>
                {currentConfig.template?.note && (
                  <p className="text-xs text-gray-500 mt-1">
                    {currentConfig.template.note}
                  </p>
                )}
              </div>

              {/* Channels */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Channels</p>
                <div className="flex flex-wrap gap-2">
                  {currentConfig.selectedChannels.map((channel) => (
                    <span
                      key={channel}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 border border-gray-200"
                    >
                      {channel === "sms" && <Phone className="w-3 h-3" />}
                      {channel === "email" && <Mail className="w-3 h-3" />}
                      {channel.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Send Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Send Time</p>
                <p className="font-medium text-gray-900">
                  {currentConfig.sendTime}
                </p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    currentConfig.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentConfig.enabled ? "bg-green-600" : "bg-gray-600"
                    }`}
                  ></div>
                  {currentConfig.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Birthday Configuration Form */}
        {(!currentConfig || showConfigForm) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#5B38DB]" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {currentConfig
                      ? "Edit Birthday Configuration"
                      : "Birthday Message Configuration"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentConfig
                      ? "Update your template and channels for birthday messages"
                      : "Set up your default template and channels for birthday messages"}
                  </p>
                </div>
              </div>
              {currentConfig && showConfigForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowConfigForm(false);
                    // Reset to current config values
                    setSelectedTemplate(currentConfig.template?._id || "");
                    setSelectedChannels(currentConfig.selectedChannels || []);
                    setSendTime(currentConfig.sendTime || "08:00");
                    setIsEnabled(currentConfig.enabled !== false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Message Template{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a birthday template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templatesLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading templates...
                      </div>
                    ) : templates.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No birthday templates available
                      </div>
                    ) : (
                      templates.map((template) => (
                        <SelectItem key={template._id} value={template._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{template.name}</span>
                            {template.note && (
                              <span className="text-xs text-gray-500">
                                {template.note}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {selectedTemplateObj && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected:{" "}
                    <span className="font-medium">
                      {selectedTemplateObj.name}
                    </span>
                  </p>
                )}
              </div>

              {/* Channel Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Channels <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {CHANNEL_OPTIONS.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <div
                        key={channel.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={channel.value}
                          checked={selectedChannels.includes(channel.value)}
                          onCheckedChange={() =>
                            handleChannelToggle(channel.value)
                          }
                        />
                        <label
                          htmlFor={channel.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                        >
                          <Icon className="w-4 h-4" />
                          {channel.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Send Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Send Time
                  </label>
                  <Input
                    type="time"
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enabled"
                      checked={isEnabled}
                      onCheckedChange={setIsEnabled}
                    />
                    <label
                      htmlFor="enabled"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Enable automatic birthday messages
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  {hasUnsavedChanges && (
                    <p className="text-sm text-amber-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                      You have unsaved changes
                    </p>
                  )}
                  {!hasUnsavedChanges && selectedTemplate && currentConfig && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Configuration saved
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSaveConfig}
                  disabled={
                    isSavingConfig ||
                    !selectedTemplate ||
                    selectedChannels.length === 0
                  }
                  className="bg-[#5B38DB] hover:bg-[#4a2db0]"
                >
                  {isSavingConfig ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {currentConfig
                        ? "Update Configuration"
                        : "Save Configuration"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* No Config Warning */}
        {!currentConfig && !showConfigForm && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">
                  No Birthday Configuration Set
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  You haven't configured your birthday messages yet. Set up your
                  template and channels to start sending birthday wishes
                  automatically.
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowConfigForm(true)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Month Filter */}
            <div className="w-full md:w-48">
              <Select
                value={selectedMonth}
                onValueChange={(value) => {
                  setSelectedMonth(value);
                  setSearchQuery("");
                }}
              >
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            {(selectedMonth !== "all" || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMonth("all");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Birthday List */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#5B38DB] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading birthdays...</p>
          </div>
        ) : filteredBirthdays.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Cake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No birthdays found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : selectedMonth !== "all"
                ? `No birthdays in ${getMonthName(selectedMonth)}`
                : "No birthdays recorded yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedMonth === "all" ? (
              // Grouped by month view
              Object.keys(groupedByMonth)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((monthKey) => (
                  <div
                    key={monthKey}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">
                        {getMonthName(monthKey)} (
                        {groupedByMonth[monthKey].length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {groupedByMonth[monthKey]
                        .sort(
                          (a, b) => parseInt(a.birthDay) - parseInt(b.birthDay)
                        )
                        .map((contact) => (
                          <BirthdayCard
                            key={contact._id}
                            contact={contact}
                            isBirthdayToday={isBirthdayToday}
                            isBirthdayUpcoming={isBirthdayUpcoming}
                            formatBirthday={formatBirthday}
                            onSendMessage={handleSendMessage}
                            sendingMessages={sendingMessages}
                          />
                        ))}
                    </div>
                  </div>
                ))
            ) : (
              // Single month view
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredBirthdays
                    .sort((a, b) => parseInt(a.birthDay) - parseInt(b.birthDay))
                    .map((contact) => (
                      <BirthdayCard
                        key={contact._id}
                        contact={contact}
                        isBirthdayToday={isBirthdayToday}
                        isBirthdayUpcoming={isBirthdayUpcoming}
                        formatBirthday={formatBirthday}
                        onSendMessage={handleSendMessage}
                        sendingMessages={sendingMessages}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Birthday Card Component - FIXED to always show both buttons
function BirthdayCard({
  contact,
  isBirthdayToday,
  isBirthdayUpcoming,
  formatBirthday,
  onSendMessage,
  sendingMessages,
}) {
  const isToday = isBirthdayToday(contact.birthDay, contact.birthMonth);
  const isUpcoming = isBirthdayUpcoming(contact.birthDay, contact.birthMonth);

  const isSendingSMS = sendingMessages[`${contact._id}-sms`];
  const isSendingEmail = sendingMessages[`${contact._id}-email`];

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        isToday ? "bg-pink-50" : ""
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {contact.fullName.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900">
                {contact.fullName}
              </h4>
              {isToday && (
                <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">
                  🎉 Today!
                </span>
              )}
              {!isToday && isUpcoming && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  Upcoming
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatBirthday(contact.birthDay, contact.birthMonth)}
              </span>
              {contact.email && <span className="text-gray-400">•</span>}
              {contact.email && <span>{contact.email}</span>}
            </div>
          </div>
        </div>

        {/* Message Actions - ALWAYS SHOW BOTH BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 mr-2">{contact.role}</span>

          {/* SMS Button - Always visible */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSendMessage(contact, "sms")}
            disabled={isSendingSMS}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-300 disabled:opacity-50"
            title="Send SMS"
          >
            {isSendingSMS ? (
              <>
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                Sending...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-1" />
                SMS
              </>
            )}
          </Button>

          {/* Email Button - Always visible, disabled if no email */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSendMessage(contact, "email")}
            disabled={isSendingEmail || !contact.email}
            className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-300 disabled:opacity-50"
            title={!contact.email ? "No email address available" : "Send email"}
          >
            {isSendingEmail ? (
              <>
                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-1" />
                Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
