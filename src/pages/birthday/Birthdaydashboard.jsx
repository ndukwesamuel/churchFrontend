import React, { useState } from "react";
import { Calendar, Cake, Filter, Search, Users } from "lucide-react";
// import { useFetchData } from "../../../hook/Request";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetchData } from "../../hook/Request";

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

export default function BirthdayDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  console.log({
    fgtt: data,
  });

  const birthdays = data || [];

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

// Birthday Card Component
function BirthdayCard({
  contact,
  isBirthdayToday,
  isBirthdayUpcoming,
  formatBirthday,
}) {
  const isToday = isBirthdayToday(contact.birthDay, contact.birthMonth);
  const isUpcoming = isBirthdayUpcoming(contact.birthDay, contact.birthMonth);

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        isToday ? "bg-pink-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {contact.fullName.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatBirthday(contact.birthDay, contact.birthMonth)}
              </span>
              {contact.email && <span className="text-gray-400">•</span>}
              {contact.email && <span>{contact.email}</span>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{contact.role}</span>
        </div>
      </div>
    </div>
  );
}
