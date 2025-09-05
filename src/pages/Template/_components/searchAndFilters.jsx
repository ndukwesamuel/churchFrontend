import { useState } from "react";
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg outline-none text-sm sm:text-base"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex gap-4">
          {/* Channel Filter */}
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="min-w-[140px] border border-gray-300 focus:border-vividBlue focus:ring-2 focus:ring-vividBlue/30">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all channel"
                className="hover:bg-vividBlue hover:text-white"
              >
                All Channel
              </SelectItem>
              <SelectItem
                value="whatsapp"
                className="hover:bg-vividBlue hover:text-white"
              >
                WhatsApp
              </SelectItem>
              <SelectItem
                value="sms"
                className="hover:bg-vividBlue hover:text-white"
              >
                SMS
              </SelectItem>
              <SelectItem
                value="email"
                className="hover:bg-vividBlue hover:text-white"
              >
                Email
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="min-w-[160px] border border-gray-300 focus:border-vividBlue focus:ring-2 focus:ring-vividBlue/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="All categories"
                className="hover:bg-vividBlue hover:text-white"
              >
                All categories
              </SelectItem>
              <SelectItem
                value="Service Announcement"
                className="hover:bg-vividBlue hover:text-white"
              >
                Service Announcement
              </SelectItem>
              <SelectItem
                value="Newsletter"
                className="hover:bg-vividBlue hover:text-white"
              >
                Newsletter
              </SelectItem>
              <SelectItem
                value="Event"
                className="hover:bg-vividBlue hover:text-white"
              >
                Event
              </SelectItem>
              <SelectItem
                value="Pastoral Care"
                className="hover:bg-vividBlue hover:text-white"
              >
                Pastoral Care
              </SelectItem>
              <SelectItem
                value="Members Care"
                className="hover:bg-vividBlue hover:text-white"
              >
                Members Care
              </SelectItem>
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
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-full border border-gray-300">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="all channel"
              className="hover:bg-vividBlue hover:text-white"
            >
              All Channel
            </SelectItem>
            <SelectItem
              value="whatsapp"
              className="hover:bg-vividBlue hover:text-white"
            >
              WhatsApp
            </SelectItem>
            <SelectItem
              value="sms"
              className="hover:bg-vividBlue hover:text-white"
            >
              SMS
            </SelectItem>
            <SelectItem
              value="email"
              className="hover:bg-vividBlue hover:text-white"
            >
              Email
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter (mobile) */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full border border-gray-300">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="All categories"
              className="hover:bg-vividBlue hover:text-white"
            >
              All categories
            </SelectItem>
            <SelectItem
              value="Service Announcement"
              className="hover:bg-vividBlue hover:text-white"
            >
              Service Announcement
            </SelectItem>
            <SelectItem
              value="Newsletter"
              className="hover:bg-vividBlue hover:text-white"
            >
              Newsletter
            </SelectItem>
            <SelectItem
              value="Event"
              className="hover:bg-vividBlue hover:text-white"
            >
              Event
            </SelectItem>
            <SelectItem
              value="Pastoral Care"
              className="hover:bg-vividBlue hover:text-white"
            >
              Pastoral Care
            </SelectItem>
            <SelectItem
              value="Members Care"
              className="hover:bg-vividBlue hover:text-white"
            >
              Members Care
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
