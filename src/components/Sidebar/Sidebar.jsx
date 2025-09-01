import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  function isActiveLink(path) {
    return location.pathname === path;
  }

  const tabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/contacts", label: "Contacts" },
    { path: "/compose", label: "Compose" },
    { path: "/campaigns", label: "Campaigns" },
    { path: "/templates", label: "Templates" },
    { path: "/files", label: "Files" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white shadow-lg p-4">
      {/* Sidebar Title */}
      <h1 className="text-xl font-bold text-purple-600 mb-6">ChurchComm</h1>

      {/* Nav Links */}
      <nav className="space-y-4">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`block font-medium ${
              isActiveLink(tab.path)
                ? "text-purple-600"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
