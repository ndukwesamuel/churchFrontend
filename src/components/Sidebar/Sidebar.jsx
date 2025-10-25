import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { mainlogout } from "../../redux/AuthSlice";
import SidebarContent from "./sidebarContent";

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCustomersExpanded, setIsCustomersExpanded] = useState(false);

  const isActiveLink = (path) => location.pathname === path;

  const handleTabClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(mainlogout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 w-64 bg-white shadow-lg min-h-screen z-30">
        <div className="flex flex-col h-full">
          <SidebarContent
            isActiveLink={isActiveLink}
            handleTabClick={handleTabClick}
            handleLogout={handleLogout}
            isCustomersExpanded={isCustomersExpanded}
            setIsCustomersExpanded={setIsCustomersExpanded}
          />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out min-h-screen flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          isActiveLink={isActiveLink}
          handleTabClick={handleTabClick}
          handleLogout={handleLogout}
          isCustomersExpanded={isCustomersExpanded}
          setIsCustomersExpanded={setIsCustomersExpanded}
          isMobile={true}
        />
      </aside>
    </>
  );
}
