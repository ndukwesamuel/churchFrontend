import { useState } from "react";
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
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar Component (handles both mobile and desktop) */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

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
      <main className="pt-14 md:pt-0 md:ml-64 min-h-screen overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
