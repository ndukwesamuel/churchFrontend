import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PenTool,
  Megaphone,
  FileText,
  FolderOpen,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { mainlogout } from "../../redux/AuthSlice";
import { useDispatch } from "react-redux";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomersExpanded, setIsCustomersExpanded] = useState(false);

  function isActiveLink(path) {
    return location.pathname === path;
  }

  const handleTabClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(mainlogout());
    // Add your logout logic here
    localStorage.removeItem("token"); // Example
    navigate("/login");
  };

  const tabs = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/contacts",
      label: "Contacts",
      icon: Users,
    },
    // {
    //   path: "/compose",
    //   label: "Compose",
    //   icon: PenTool,
    // },
    // {
    //   path: "/campaigns",
    //   label: "Campaigns",
    //   icon: Megaphone,
    // },
    {
      path: "/templates",
      label: "Templates",
      icon: FileText,
    },
    {
      path: "/files",
      label: "Files",
      icon: FolderOpen,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex items-center mb-8 px-4 pt-2">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-white font-bold text-sm">CC</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            Churchcomm
          </h1>
          <p className="text-xs text-gray-500 truncate">
            Grace community church
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveLink(tab.path);

            return (
              <li key={tab.path}>
                <button
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-purple-50 text-purple-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${
                      isActive ? "text-purple-700" : "text-gray-400"
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Customers Section (Expandable) */}
        <div className="mt-6">
          <button
            onClick={() => setIsCustomersExpanded(!isCustomersExpanded)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center min-w-0">
              <Users className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">Customers</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                isCustomersExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCustomersExpanded && (
            <div className="ml-8 mt-2 space-y-1">
              <button
                onClick={() => handleTabClick("/customers/all")}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                  isActiveLink("/customers/all")
                    ? "text-purple-700 bg-purple-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                All Customers
              </button>
              <button
                onClick={() => handleTabClick("/customers/active")}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                  isActiveLink("/customers/active")
                    ? "text-purple-700 bg-purple-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Active Members
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom Section - Log Out */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="truncate">Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-lg min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out min-h-screen flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center min-w-0">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">
                Churchcomm
              </h1>
              <p className="text-xs text-gray-500 truncate">
                Grace community church
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = isActiveLink(tab.path);

              return (
                <li key={tab.path}>
                  <button
                    onClick={() => handleTabClick(tab.path)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-50 text-purple-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        isActive ? "text-purple-700" : "text-gray-400"
                      }`}
                    />
                    <span className="truncate">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile Customers Section */}
          <div className="mt-6">
            <button
              onClick={() => setIsCustomersExpanded(!isCustomersExpanded)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center min-w-0">
                <Users className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400" />
                <span className="truncate">Customers</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                  isCustomersExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCustomersExpanded && (
              <div className="ml-8 mt-2 space-y-1">
                <button
                  onClick={() => handleTabClick("/customers/all")}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActiveLink("/customers/all")
                      ? "text-purple-700 bg-purple-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  All Customers
                </button>
                <button
                  onClick={() => handleTabClick("/customers/active")}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActiveLink("/customers/active")
                      ? "text-purple-700 bg-purple-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Active Members
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="truncate">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
