import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronDown,
  Megaphone,
  Mail,
  Calendar,
  Heart,
  Users,
} from "lucide-react";

const TemplateManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all channel");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  // Sample template data
  const templates = [
    {
      id: 1,
      title: "Sunday Service Announcement",
      channel: "WhatsApp",
      category: "Service Announcement",
      usageCount: 15,
      lastUsed: "2 days ago",
      content:
        "Join us this Sunday at {{serviceTime}} for our weekly service. Pastor {{pastorName}} will be speaking on faith and hope...",
      variables: ["{{pastorName}}", "{{serviceTime}}", "{{churchAddress}}"],
    },
    {
      id: 2,
      title: "Monthly Newsletter",
      channel: "Email",
      category: "Newsletter",
      usageCount: 8,
      lastUsed: "1 week ago",
      content:
        "Dear {{firstName}}, welcome to our monthly newsletter. This month we're excited to share updates about our community...",
      variables: ["{{firstName}}", "{{monthName}}", "{{eventDate}}"],
    },
    {
      id: 3,
      title: "Prayer Request Follow-up",
      channel: "SMS",
      category: "Pastoral Care",
      usageCount: 23,
      lastUsed: "3 hours ago",
      content:
        "Hi {{firstName}}, Pastor {{pastorName}} wanted to follow up on your prayer request. We've been praying for you...",
      variables: ["{{firstName}}", "{{pastorName}}", "{{requestDate}}"],
    },
    {
      id: 4,
      title: "Birthday Blessing",
      channel: "WhatsApp",
      category: "Members Care",
      usageCount: 12,
      lastUsed: "1 day ago",
      content:
        "Happy Birthday {{firstName}}! May God bless you with joy, peace, and prosperity in this new year of your life...",
      variables: ["{{firstName}}", "{{age}}", "{{churchName}}"],
    },
  ];

  const categoryStats = [
    { name: "Service Announcement", count: 3, icon: Megaphone },
    { name: "Newsletter", count: 5, icon: Mail },
    { name: "Event", count: 7, icon: Calendar },
    { name: "Pastoral Care", count: 4, icon: Heart },
    { name: "Members Care", count: 6, icon: Users },
  ];

  const getChannelBadgeColor = (channel) => {
    switch (channel.toLowerCase()) {
      case "sms":
        return "bg-black text-white";
      case "whatsapp":
        return "bg-green-500 text-white";
      case "email":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel =
      channelFilter === "all channel" ||
      template.channel.toLowerCase() === channelFilter.toLowerCase();
    const matchesCategory =
      categoryFilter === "All categories" ||
      template.category === categoryFilter;

    return matchesSearch && matchesChannel && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Template Manager
        </h1>
        <p className="text-gray-600">
          Create and manage message templates for SMS, Email, and WhatsApp
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categoryStats.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-lightGray p-2 rounded-md border border-gray-300">
                  <IconComponent className="w-4 h-4 text-textColor" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.count} templates
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Templates Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Message Templates
            </h2>
            <p className="text-gray-600">Manage your communication templates</p>
          </div>
          <button className="bg-purple-700  text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-600 transition-colors">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Channel</option>
                <option>WhatsApp</option>
                <option>SMS</option>
                <option>Email</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All categories</option>
                <option>Service Announcement</option>
                <option>Newsletter</option>
                <option>Event</option>
                <option>Pastoral Care</option>
                <option>Members Care</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Template Cards */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* First Line: Title, Channel Badge, Category, Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {template.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getChannelBadgeColor(
                    template.channel
                  )}`}
                >
                  {template.channel}
                </span>
                <span className="text-sm text-gray-500">
                  {template.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Second Line: Usage Stats */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
              <span>Used {template.usageCount} times</span>
              <span>•</span>
              <span>Last used {template.lastUsed}</span>
            </div>

            {/* Content Snippet */}
            <div className="mb-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                {template.content}
              </p>
            </div>

            {/* Variables */}
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
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
