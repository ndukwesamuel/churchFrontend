// import React from "react";
import {
  HiOutlineUsers,
  HiOutlineExclamationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { useFetchData } from "../../hook/Request";

const stats = [
  {
    title: "Customers",
    value: "247",
    change: "+12% this month",
    icon: <HiOutlineUsers className="w-6 h-6 text-purple-600" />,
  },
  {
    title: "Active Issues",
    value: "247",
    change: "+12% this month",
    icon: <HiOutlineExclamationCircle className="w-6 h-6 text-purple-600" />,
  },
  {
    title: "Revenue Monthly",
    value: "$12,847",
    change: "+12% this month",
    icon: <HiOutlineCurrencyDollar className="w-6 h-6 text-purple-600" />,
  },
  {
    title: "Messages sent",
    value: "1.2M",
    change: "+12% this month",
    icon: <HiOutlineChatAlt2 className="w-6 h-6 text-purple-600" />,
  },
];

const customers = [
  {
    church: "Grace Community Church",
    email: "admin@gracechurch.com",
    type: ["Catholic", "Helping Others"],
    contact: "Rev. John Smith",
    phone: "+1 (555) 345-7890",
    package: "Premium",
    status: "Active",
    message: "12,967",
    lastActive: "2025-01-28",
  },
  {
    church: "Grace Community Church",
    email: "admin@gracechurch.com",
    type: ["Baptist"],
    contact: "Rev. John Smith",
    phone: "+1 (555) 345-7890",
    package: "Premium",
    status: "Trial",
    message: "12,967",
    lastActive: "2025-01-28",
  },
  {
    church: "Grace Community Church",
    email: "admin@gracechurch.com",
    type: ["Pentecostal"],
    contact: "Rev. John Smith",
    phone: "+1 (555) 345-7890",
    package: "Premium",
    status: "Suspended",
    message: "12,967",
    lastActive: "2025-01-28",
  },
  {
    church: "Grace Community Church",
    email: "admin@gracechurch.com",
    type: ["Catholic", "Helping Others"],
    contact: "Rev. John Smith",
    phone: "+1 (555) 345-7890",
    package: "Premium",
    status: "Active",
    message: "12,967",
    lastActive: "2025-01-28",
  },
];

export default function Dashboard() {
  // Fetching data from API
  const { data: settingApiData, refetch: refetchIncomeData } = useFetchData(
    `/api/v1/setting`,
    "profilesetting" // Changed query key for clarity
  );

  console.log({
    fff: settingApiData,
  });

  return (
    <main className="flex-1 p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-1">Admin Portal</h2>
      <p className="text-gray-600 mb-6">
        Manage customers, troubleshoot issues, and monitor platform performance.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-xl font-bold">{stat.value}</h3>
              <p className="text-green-500 text-xs">{stat.change}</p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button className="pb-2 border-b-2 border-purple-600 font-medium">
          Customers
        </button>
        <button className="pb-2 text-gray-500">Troubleshooting</button>
        <button className="pb-2 text-gray-500">Analytics</button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search customers"
          className="border border-gray-300 rounded-md p-2 w-full md:w-1/3"
        />
        <select className="border border-gray-300 rounded-md p-2 w-full md:w-auto">
          <option>All Status</option>
          <option>Active</option>
          <option>Trial</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Table - scrollable on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-3">Church</th>
              <th className="p-3">Type</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Package</th>
              <th className="p-3">Status</th>
              <th className="p-3">Message</th>
              <th className="p-3">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} className="border-b text-sm">
                <td className="p-3">
                  <p className="font-medium">{c.church}</p>
                  <p className="text-gray-500">{c.email}</p>
                </td>
                <td className="p-3 space-x-2">
                  {c.type.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </td>
                <td className="p-3">
                  <p className="font-medium">{c.contact}</p>
                  <p className="text-gray-500">{c.phone}</p>
                </td>
                <td className="p-3">
                  <span className="bg-black text-white px-2 py-1 rounded-full text-xs">
                    {c.package}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : c.status === "Trial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3">{c.message}</td>
                <td className="p-3">{c.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
