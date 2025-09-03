import { useState } from "react";
import { Plus, Megaphone, Mail, Calendar, Heart, Users } from "lucide-react";
import { SearchAndFilters } from "./_components/searchAndFilters";
import { CategoryStats } from "./_components/categoryStats";
import { TemplateCard } from "./_components/templateCard";
import { Link } from "react-router-dom";
import { useFetchData } from "../../hook/Request";
const TemplateManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all channel");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const { data, isLoading, isError, error, refetch, isFetching } = useFetchData(
    "/api/v1/templates",
    "templates"
  );
  const templates = data?.data?.templates || [];
  const pagination = data?.data?.pagination;
  console.log(templates);
  console.log(isLoading);
  // const templates = [
  //   {
  //     id: 1,
  //     title: "Sunday Service Announcement",
  //     channel: "WhatsApp",
  //     category: "Service Announcement",
  //     usageCount: 15,
  //     lastUsed: "2 days ago",
  //     content:
  //       "Join us this Sunday at {{serviceTime}} for our weekly service. Pastor {{pastorName}} will be speaking on faith and hope...",
  //     variables: ["{{pastorName}}", "{{serviceTime}}", "{{churchAddress}}"],
  //   },
  //   {
  //     id: 2,
  //     title: "Monthly Newsletter",
  //     channel: "Email",
  //     category: "Newsletter",
  //     usageCount: 8,
  //     lastUsed: "1 week ago",
  //     content:
  //       "Dear {{firstName}}, welcome to our monthly newsletter. This month we're excited to share updates about our community...",
  //     variables: ["{{firstName}}", "{{monthName}}", "{{eventDate}}"],
  //   },
  //   {
  //     id: 3,
  //     title: "Prayer Request Follow-up",
  //     channel: "SMS",
  //     category: "Pastoral Care",
  //     usageCount: 23,
  //     lastUsed: "3 hours ago",
  //     content:
  //       "Hi {{firstName}}, Pastor {{pastorName}} wanted to follow up on your prayer request. We've been praying for you...",
  //     variables: ["{{firstName}}", "{{pastorName}}", "{{requestDate}}"],
  //   },
  //   {
  //     id: 4,
  //     title: "Birthday Blessing",
  //     channel: "WhatsApp",
  //     category: "Members Care",
  //     usageCount: 12,
  //     lastUsed: "1 day ago",
  //     content:
  //       "Happy Birthday {{firstName}}! May God bless you with joy, peace, and prosperity in this new year of your life...",
  //     variables: ["{{firstName}}", "{{age}}", "{{churchName}}"],
  //   },
  // ];

  const categoryStats = [
    { name: "Service Announcement", count: 3, icon: Megaphone },
    { name: "Newsletter", count: 5, icon: Mail },
    { name: "Event", count: 7, icon: Calendar },
    { name: "Pastoral Care", count: 4, icon: Heart },
    { name: "Members Care", count: 6, icon: Users },
  ];
  if (isLoading) {
    return <p>Loading....</p>;
  }
  const getChannelBadgeColor = (channel) => {
    switch (channel.toLowerCase()) {
      case "sms":
        return "bg-black text-white";
      case "whatsapp":
        return "bg-[#E7F7ED] text-[#0A7937]";
      case "email":
        return "bg-[#FFEDD4] text-[#9F2D00]";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      template.content?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesChannel =
      channelFilter === "all channel" ||
      template.channel?.toLowerCase() === channelFilter?.toLowerCase();
    const matchesCategory =
      categoryFilter === "All categories" ||
      template.category === categoryFilter;

    return matchesSearch && matchesChannel && matchesCategory;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Template Manager
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Create and manage message templates for SMS, Email, and WhatsApp
        </p>
      </div>

      {/* Category Stats */}
      <CategoryStats categoryStats={categoryStats} />

      {/* Message Templates Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Message Templates
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your communication templates
            </p>
          </div>
          <Link to="/templates/create">
            <button className="bg-purple-700 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </Link>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      {/* Template Cards */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            getChannelBadgeColor={getChannelBadgeColor}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">
            No templates found matching your criteria.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
