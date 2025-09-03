import { useState } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";

export const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  channelFilter,
  setChannelFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search and Filters Row - Single line on large screens */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
          />
        </div>

        {/* Desktop Filters - Hidden on mobile */}
        <div className="hidden lg:flex gap-4">
          <div className="relative">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none text-sm min-w-[140px]"
            >
              <option>All Channel</option>
              <option>WhatsApp</option>
              <option>SMS</option>
              <option>Email</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none text-sm min-w-[160px]"
            >
              <option>All categories</option>
              <option>Service Announcement</option>
              <option>Newsletter</option>
              <option>Event</option>
              <option>Pastoral Care</option>
              <option>Members Care</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
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

      {/* Mobile Filters - Collapsible */}
      <div
        className={`${showFilters ? "block" : "hidden"} lg:hidden space-y-3`}
      >
        <div className="relative">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 outline-none text-sm"
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
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 outline-none text-sm"
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
  );
};
