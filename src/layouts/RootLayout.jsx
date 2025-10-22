import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { assets } from "../assets/assets";

export default function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex bg-gray-50 relative min-h-screen overflow-hidden">
      {/* Fixed Sidebar (Desktop) */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-30">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Sticky Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm flex items-center gap-2 px-4 py-3">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg border border-gray-200 shadow-sm bg-white hover:bg-gray-50 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <img src={assets.logo} alt="App Logo" className="h-10 w-auto" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64 pt-14 md:pt-0 h-screen overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
