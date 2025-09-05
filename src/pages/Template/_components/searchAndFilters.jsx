import { useState, useEffect, useCallback } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  channelFilter,
  setChannelFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(value);
        }, 1000); // 300ms delay
      };
    })(),
    [setSearchTerm]
  );

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleChannelChange = (value) => {
    setChannelFilter(value === "all" ? "" : value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value === "all" ? "" : value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg outline-none text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex gap-4">
          {/* Channel Filter */}
          <Select
            value={channelFilter || "all"}
            onValueChange={handleChannelChange}
          >
            <SelectTrigger className="min-w-[140px] border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="min-w-[160px] border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Service Announcement">
                Service Announcement
              </SelectItem>
              <SelectItem value="Newsletter">Newsletter</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Pastoral Care">Pastoral Care</SelectItem>
              <SelectItem value="Members Care">Members Care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Filters */}
      <div
        className={`${showFilters ? "block" : "hidden"} lg:hidden space-y-3`}
      >
        {/* Channel Filter (mobile) */}
        <Select
          value={channelFilter || "all"}
          onValueChange={handleChannelChange}
        >
          <SelectTrigger className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter (mobile) */}
        <Select
          value={categoryFilter || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Service Announcement">
              Service Announcement
            </SelectItem>
            <SelectItem value="Newsletter">Newsletter</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="Pastoral Care">Pastoral Care</SelectItem>
            <SelectItem value="Members Care">Members Care</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
